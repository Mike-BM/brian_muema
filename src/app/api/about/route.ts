import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'about.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const aboutData = JSON.parse(fileContents);
    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('Error reading about.json:', error);
    return NextResponse.json({ error: 'Failed to load about section data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.content) {
      return NextResponse.json({ error: 'Missing content field' }, { status: 400 });
    }

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, about: data }, { status: 201 });
  } catch (error) {
    console.error('Error saving about data:', error);
    return NextResponse.json({ error: 'Failed to save about section data' }, { status: 500 });
  }
}
