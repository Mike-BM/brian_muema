import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('cv') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No CV file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // We intentionally overwrite the same file name so the static links keep working
    const filePath = path.join(uploadDir, 'cv.pdf');
    
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ success: true, message: 'CV updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving CV:', error);
    return NextResponse.json({ error: 'Failed to save CV' }, { status: 500 });
  }
}
