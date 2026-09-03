import fs from 'fs/promises';
import path from 'path';
import { jsonNoCache } from '@/lib/github';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const credentialsPath = path.join(process.cwd(), 'data', 'credentials.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(credentialsPath, 'utf8');
    const credentials = JSON.parse(fileContents);
    return jsonNoCache({ email: credentials.email, username: credentials.username });
  } catch (error) {
    console.error('Error reading credentials:', error);
    return jsonNoCache({ email: 'brianmuema928@gmail.com', username: 'brian' });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { password, email, username } = data;

    // Read current credentials
    let currentCredentials = { password: '', email: 'brianmuema928@gmail.com', username: 'brian' };
    try {
      const fileContents = await fs.readFile(credentialsPath, 'utf8');
      currentCredentials = JSON.parse(fileContents);
    } catch {
      // Ignored if file doesn't exist
    }

    const newCredentials = {
      ...currentCredentials,
      // Only update fields if they are provided (password can be empty string to fallback to env)
      ...(password !== undefined && { password }),
      ...(email !== undefined && { email }),
      ...(username !== undefined && { username }),
    };

    // Ensure directory exists
    const dataDir = path.dirname(credentialsPath);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    await fs.writeFile(credentialsPath, JSON.stringify(newCredentials, null, 2));

    return jsonNoCache({ success: true }, 200);
  } catch (error) {
    console.error('Error saving credentials:', error);
    return jsonNoCache({ error: 'Failed to save credentials' }, 500);
  }
}
