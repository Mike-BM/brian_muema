import { NextResponse } from 'next/server';
import { getGithubFile, updateGithubFile } from '@/lib/github';

const SETTINGS_PATH = 'public/data/settings.json';

export async function GET() {
  try {
    const file = await getGithubFile(SETTINGS_PATH);
    if (!file) {
      return NextResponse.json({ maintenance: false });
    }
    const settings = JSON.parse(file.content);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error reading settings from GitHub:', error);
    return NextResponse.json({ maintenance: false });
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
      } catch (e) {
        // use defaults
      }
    }

    const newSettings = {
      ...currentSettings,
      ...data
    };

    const newContent = Buffer.from(JSON.stringify(newSettings, null, 2)).toString('base64');
    await updateGithubFile(SETTINGS_PATH, newContent, `Update settings`, currentSha);

    return NextResponse.json({ success: true, settings: newSettings }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: error?.message || 'Failed to save settings' }, { status: 500 });
  }
}
