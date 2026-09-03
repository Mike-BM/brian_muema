import { NextResponse } from 'next/server';
import { getGithubFile, updateGithubFile } from '@/lib/github';

const ABOUT_PATH = 'public/data/about.json';

export async function GET() {
  try {
    const file = await getGithubFile(ABOUT_PATH);
    if (!file || !file.content) {
      return NextResponse.json({ content: "" });
    }
    try {
      const aboutData = JSON.parse(file.content);
      return NextResponse.json(aboutData);
    } catch (err) {
      console.error('JSON parse error for about.json:', err);
      return NextResponse.json({ content: file.content });
    }
  } catch (error: any) {
    console.error('Error reading about.json:', error);
    return NextResponse.json({ error: error?.message || 'Failed to load about section data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (typeof data.content !== 'string') {
      return NextResponse.json({ error: 'Invalid content field' }, { status: 400 });
    }

    const file = await getGithubFile(ABOUT_PATH);
    const currentSha = file ? file.sha : undefined;

    const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    await updateGithubFile(ABOUT_PATH, newContent, `Update about section`, currentSha);

    return NextResponse.json({ success: true, about: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving about data:', error);
    return NextResponse.json({ error: error?.message || 'Failed to save about section data' }, { status: 500 });
  }
}
