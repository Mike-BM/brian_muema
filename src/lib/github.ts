const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'Mike-BM';
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || 'brian_muema';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

/**
 * Gets a file from GitHub API
 * @param path Path to file from repo root, e.g. "public/data/projects.json"
 */
export async function getGithubFile(path: string) {
  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${path}?ref=${GITHUB_BRANCH}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      // Disable cache so we always get the fresh SHA
      'Cache-Control': 'no-cache',
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // File doesn't exist yet
    }
    throw new Error(`Failed to fetch file from GitHub: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    sha: data.sha,
    content: Buffer.from(data.content, 'base64').toString('utf8')
  };
}

/**
 * Updates or creates a file on GitHub
 * @param path Path to file from repo root, e.g. "public/data/projects.json"
 * @param content Base64 encoded content
 * @param message Commit message
 * @param sha (Optional) The current sha of the file to overwrite. If omitted, will try to fetch it first.
 */
export async function updateGithubFile(path: string, content: string, message: string, sha?: string) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not configured');
  }

  // If no sha provided, try to fetch the existing file's sha
  let currentSha = sha;
  if (!currentSha) {
    try {
      const existingFile = await getGithubFile(path);
      if (existingFile) {
        currentSha = existingFile.sha;
      }
    } catch (error) {
      console.warn(`Could not fetch existing file for ${path}, proceeding to create new.`);
    }
  }

  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${path}`;
  
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
    throw new Error(`Failed to update file on GitHub: ${response.statusText}`);
  }

  return await response.json();
}
