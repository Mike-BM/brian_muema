import fs from 'fs/promises';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'Mike-BM';
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || 'brian_muema';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

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
 * Fetches file metadata directly from GitHub API
 */
async function fetchGithubRaw(relPath: string) {
  if (!GITHUB_TOKEN) return null;

  const normalized = relPath.replace(/^[/\\]+/, '');
  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${normalized}?ref=${GITHUB_BRANCH}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Cache-Control': 'no-cache',
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
  return {
    sha: data.sha,
    content: cleanContent(Buffer.from(data.content, 'base64').toString('utf8')),
  };
}

/**
 * Gets a file from GitHub API or falls back to local filesystem
 * @param filePath Path to file from repo root, e.g. "public/data/projects.json"
 */
export async function getGithubFile(filePath: string): Promise<{ sha: string; content: string } | null> {
  // If GITHUB_TOKEN is available, try GitHub first
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

  // Fallback to local filesystem
  return await getLocalFile(filePath);
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
  // 1. Always attempt local write first
  const localSaved = await writeLocalFile(filePath, content);

  // 2. If GITHUB_TOKEN is not configured
  if (!GITHUB_TOKEN) {
    if (localSaved) {
      return { success: true, localOnly: true };
    }
    throw new Error(
      'GITHUB_TOKEN is not configured and local filesystem is not writable. Please set GITHUB_TOKEN in your environment variables.'
    );
  }

  // 3. Update file on GitHub repository
  const normalized = filePath.replace(/^[/\\]+/, '');
  let currentSha = (sha && sha !== 'local') ? sha : undefined;
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

  return await response.json();
}
