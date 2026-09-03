import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'Mike-BM';
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || 'brian_muema';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export function jsonNoCache(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: NO_CACHE_HEADERS,
  });
}

/**
 * In-memory cache to guarantee instantaneous read-after-write on the server,
 * bypassing GitHub API CDN propagation delay.
 */
interface CacheEntry {
  sha: string;
  content: string;
  timestamp: number;
}
const memCache = new Map<string, CacheEntry>();

/**
 * Normalizes string by removing UTF-8 or UTF-16 Byte Order Mark (BOM) if present
 */
function cleanContent(str: string): string {
  if (str.charCodeAt(0) === 0xFEFF) {
    return str.slice(1);
  }
  return str;
}

/**
 * Reads directly from the local filesystem
 */
async function getLocalFile(relPath: string) {
  try {
    const normalized = relPath.replace(/^[/\\]+/, '');
    const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), normalized);
    const content = await fs.readFile(fullPath, 'utf8');
    return {
      sha: 'local',
      content: cleanContent(content),
    };
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    console.error(`Error reading local file ${relPath}:`, error);
    return null;
  }
}

/**
 * Writes directly to the local filesystem
 */
async function writeLocalFile(relPath: string, base64Content: string): Promise<boolean> {
  try {
    const normalized = relPath.replace(/^[/\\]+/, '');
    const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), normalized);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    const buffer = Buffer.from(base64Content, 'base64');
    await fs.writeFile(fullPath, buffer);
    return true;
  } catch (error) {
    console.warn(`Could not write to local file ${relPath}:`, error);
    return false;
  }
}

/**
 * Fetches file metadata directly from GitHub API with cache-busting
 */
async function fetchGithubRaw(relPath: string) {
  if (!GITHUB_TOKEN) return null;

  const normalized = relPath.replace(/^[/\\]+/, '');
  // Cache-busting timestamp parameter ensures GitHub's CDN returns the real HEAD commit
  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${normalized}?ref=${GITHUB_BRANCH}&_t=${Date.now()}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const errText = await response.text().catch(() => '');
    console.warn(`GitHub fetch failed (${response.status}) for ${relPath}:`, errText);
    return null;
  }

  const data = await response.json();
  const content = cleanContent(Buffer.from(data.content, 'base64').toString('utf8'));
  const entry: CacheEntry = {
    sha: data.sha,
    content,
    timestamp: Date.now(),
  };
  memCache.set(normalized, entry);

  return {
    sha: data.sha,
    content,
  };
}

/**
 * Gets a file from memory cache, GitHub API, or falls back to local filesystem
 * @param filePath Path to file from repo root, e.g. "public/data/projects.json"
 */
export async function getGithubFile(filePath: string): Promise<{ sha: string; content: string } | null> {
  const normalized = filePath.replace(/^[/\\]+/, '');

  // 1. Check in-memory cache if freshly updated (within last 60 seconds)
  const cached = memCache.get(normalized);
  if (cached && Date.now() - cached.timestamp < 60000) {
    return {
      sha: cached.sha,
      content: cached.content,
    };
  }

  // 2. If GITHUB_TOKEN is available, try GitHub fresh
  if (GITHUB_TOKEN) {
    try {
      const ghFile = await fetchGithubRaw(filePath);
      if (ghFile) {
        return ghFile;
      }
    } catch (e) {
      console.warn(`Failed fetching ${filePath} from GitHub, falling back to local:`, e);
    }
  }

  // 3. Fallback to local filesystem
  const localFile = await getLocalFile(filePath);
  if (localFile) {
    memCache.set(normalized, {
      sha: localFile.sha,
      content: localFile.content,
      timestamp: Date.now(),
    });
    return localFile;
  }

  // 4. If local file doesn't exist, return expired cache if we had one
  if (cached) {
    return {
      sha: cached.sha,
      content: cached.content,
    };
  }

  return null;
}

/**
 * Updates or creates a file on local filesystem and/or GitHub
 * @param filePath Path to file from repo root, e.g. "public/data/projects.json"
 * @param content Base64 encoded content
 * @param message Commit message
 * @param sha (Optional) The current sha of the file to overwrite.
 */
export async function updateGithubFile(
  filePath: string,
  content: string,
  message: string,
  sha?: string
) {
  const normalized = filePath.replace(/^[/\\]+/, '');

  // 1. Update in-memory cache immediately so any immediate read gets this data
  const decodedText = cleanContent(Buffer.from(content, 'base64').toString('utf8'));
  memCache.set(normalized, {
    sha: sha || 'pending',
    content: decodedText,
    timestamp: Date.now(),
  });

  // 2. Always attempt local write
  const localSaved = await writeLocalFile(filePath, content);

  // 3. If GITHUB_TOKEN is not configured
  if (!GITHUB_TOKEN) {
    if (localSaved) {
      return { success: true, localOnly: true };
    }
    throw new Error(
      'GITHUB_TOKEN is not configured and local filesystem is not writable. Please set GITHUB_TOKEN in your environment variables.'
    );
  }

  // 4. Update file on GitHub repository
  let currentSha = (sha && sha !== 'local' && sha !== 'pending') ? sha : undefined;
  if (!currentSha) {
    try {
      const existing = await fetchGithubRaw(normalized);
      if (existing) {
        currentSha = existing.sha;
      }
    } catch (error) {
      console.warn(`Could not fetch existing file for ${normalized}, proceeding:`, error);
    }
  }

  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${normalized}`;

  const body: any = {
    message,
    content,
    branch: GITHUB_BRANCH,
  };

  if (currentSha) {
    body.sha = currentSha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('GitHub API Error:', errorData);

    // If local save already succeeded, don't throw an error and break user actions
    if (localSaved) {
      console.warn(`Saved ${normalized} locally, but GitHub API commit failed: ${errorData.message || response.statusText}`);
      return { success: true, localOnly: true, warning: errorData.message || response.statusText };
    }

    throw new Error(`Failed to update file on GitHub: ${errorData.message || response.statusText}`);
  }

  const result = await response.json();
  if (result?.content?.sha) {
    memCache.set(normalized, {
      sha: result.content.sha,
      content: decodedText,
      timestamp: Date.now(),
    });
  }

  return result;
}

/**
 * Retrieves a raw binary file (e.g. image or PDF) from GitHub or local storage
 */
export async function getGithubBinary(relPath: string): Promise<Buffer | null> {
  const normalized = relPath.replace(/^[/\\]+/, '');

  // 1. Check local file first
  try {
    const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), normalized);
    const buffer = await fs.readFile(fullPath);
    return buffer;
  } catch {
    // Proceed to GitHub
  }

  // 2. Fetch from GitHub Contents API
  if (GITHUB_TOKEN) {
    try {
      const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${normalized}?ref=${GITHUB_BRANCH}&_t=${Date.now()}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Cache-Control': 'no-cache, no-store',
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          return Buffer.from(data.content, 'base64');
        }
      }
    } catch (e) {
      console.warn(`Failed fetching binary ${relPath} from GitHub:`, e);
    }
  }

  return null;
}
