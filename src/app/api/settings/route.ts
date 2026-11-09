import { getGithubFile, updateGithubFile, jsonNoCache } from '@/lib/github';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const SETTINGS_PATH = 'public/data/settings.json';

export async function GET() {
  try {
    const file = await getGithubFile(SETTINGS_PATH);
    if (!file) {
      return jsonNoCache({ maintenance: false });
    }
    const settings = JSON.parse(file.content);
    return jsonNoCache(settings);
  } catch (error) {
    console.error('Error reading settings from GitHub:', error);
    return jsonNoCache({ maintenance: false });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const file = await getGithubFile(SETTINGS_PATH);
    let currentSettings = { maintenance: false };
    const currentSha = file ? file.sha : undefined;

    if (file) {
      try {
        currentSettings = JSON.parse(file.content);
      } catch {
        // use defaults
      }
    }

    const newSettings = {
      ...currentSettings,
      ...data
    };

    const newContent = Buffer.from(JSON.stringify(newSettings, null, 2)).toString('base64');
    await updateGithubFile(SETTINGS_PATH, newContent, `Update settings`, currentSha);

    return jsonNoCache({ success: true, settings: newSettings }, 200);
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return jsonNoCache({ error: error?.message || 'Failed to save settings' }, 500);
  }
}
