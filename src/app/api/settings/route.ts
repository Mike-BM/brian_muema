import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'public', 'data', 'settings.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(settingsFilePath, 'utf8');
    const settings = JSON.parse(fileContents);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error reading settings:', error);
    // Return default if not found
    return NextResponse.json({ maintenance: false });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Read current settings to merge
    let currentSettings = { maintenance: false };
    try {
      const fileContents = await fs.readFile(settingsFilePath, 'utf8');
      currentSettings = JSON.parse(fileContents);
    } catch {
      // It's okay if it fails, we use defaults
    }

    const newSettings = {
      ...currentSettings,
      ...data
    };

    await fs.writeFile(settingsFilePath, JSON.stringify(newSettings, null, 2));

    return NextResponse.json({ success: true, settings: newSettings }, { status: 200 });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
