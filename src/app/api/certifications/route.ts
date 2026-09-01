import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'certifications.json');
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'certifications');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const certifications = JSON.parse(fileContents);
    return NextResponse.json(certifications);
  } catch (error) {
    console.error('Error reading certifications:', error);
    return NextResponse.json({ error: 'Failed to load certifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const institution = formData.get('institution') as string;
    const course = formData.get('course') as string;
    const year = formData.get('year') as string;
    const certificateUrl = formData.get('certificateUrl') as string;
    const imageFile = formData.get('image') as File | null;

    if (!institution || !course || !year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imagePath = certificateUrl || '#';
    if (imageFile && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      
      // Ensure upload directory exists
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }
      
      await fs.writeFile(filePath, buffer);
      imagePath = `/uploads/certifications/${fileName}`;
    }

    // Read current certifications
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const certifications = JSON.parse(fileContents);

    const newCertification = {
      id: Date.now().toString(),
      institution,
      course,
      year,
      certificateUrl: imagePath
    };

    certifications.push(newCertification);

    await fs.writeFile(dataFilePath, JSON.stringify(certifications, null, 2));

    return NextResponse.json({ success: true, certification: newCertification }, { status: 201 });
  } catch (error) {
    console.error('Error saving certification:', error);
    return NextResponse.json({ error: 'Failed to save certification' }, { status: 500 });
  }
}
