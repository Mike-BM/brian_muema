import { getGithubFile, updateGithubFile } from './github';

const CREDENTIALS_PATH = 'data/credentials.json';

export interface StoredCredentials {
  email: string;
  username: string;
  password: string; // scrypt hash, or '' to use ADMIN_PASSWORD from the environment
}

const DEFAULTS: StoredCredentials = { email: 'brianmuema928@gmail.com', username: 'brian', password: '' };

export async function readCredentials(): Promise<StoredCredentials> {
  try {
    const file = await getGithubFile(CREDENTIALS_PATH);
    if (file?.content) return { ...DEFAULTS, ...JSON.parse(file.content) };
  } catch {
    // fall through to defaults
  }
  return { ...DEFAULTS };
}

export async function writeCredentials(creds: StoredCredentials): Promise<void> {
  const file = await getGithubFile(CREDENTIALS_PATH);
  const content = Buffer.from(JSON.stringify(creds, null, 2)).toString('base64');
  await updateGithubFile(CREDENTIALS_PATH, content, 'Update admin credentials', file ? file.sha : undefined);
}
