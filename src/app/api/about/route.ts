import { NextResponse } from 'next/server';
import { getGithubFile, updateGithubFile } from '@/lib/github';

const ABOUT_PATH = 'public/data/about.json';

export async function GET() {
  try {
    const file = await getGithubFile(ABOUT_PATH);
    if (!file) {
      return NextResponse.json({ content: "" });
    }
    const aboutData = JSON.parse(file.content);
    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('Error reading about.json from GitHub:', error);
    return NextResponse.json({ error: 'Failed to load about section data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.content) {
      return NextResponse.json({ error: 'Missing content field' }, { status: 400 });
    }

    const file = await getGithubFile(ABOUT_PATH);
    const currentSha = file ? file.sha : undefined;

    const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    await updateGithubFile(ABOUT_PATH, newContent, `Update about section`, currentSha);

    return NextResponse.json({ success: true, about: data }, { status: 201 });
  } catch (error) {
    console.error('Error saving about data:', error);
    return NextResponse.json({ error: 'Failed to save about section data' }, { status: 500 });
  }
}
