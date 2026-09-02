import { NextResponse } from 'next/server';
import { getGithubFile, updateGithubFile } from '@/lib/github';

const CV_PATH = 'public/cv.pdf';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('cv') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No CV file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Content = Buffer.from(bytes).toString('base64');
    
    const existingFile = await getGithubFile(CV_PATH);
    const currentSha = existingFile ? existingFile.sha : undefined;
    
    await updateGithubFile(CV_PATH, base64Content, `Update CV document`, currentSha);

    return NextResponse.json({ success: true, message: 'CV updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving CV:', error);
    return NextResponse.json({ error: 'Failed to save CV' }, { status: 500 });
  }
}
