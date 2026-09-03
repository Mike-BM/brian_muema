import { NextResponse } from 'next/server';
import { getGithubFile, updateGithubFile } from '@/lib/github';

const CERTS_PATH = 'public/data/certifications.json';

function safeParseCertifications(content?: string): any[] {
  if (!content) return [];
  try {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Failed to parse certifications JSON:', e);
    return [];
  }
}

export async function GET() {
  try {
    const file = await getGithubFile(CERTS_PATH);
    if (!file) {
      return NextResponse.json([]);
    }
    const certifications = safeParseCertifications(file.content);
    return NextResponse.json(certifications);
  } catch (error: any) {
    console.error('Error reading certifications:', error);
    return NextResponse.json({ error: error?.message || 'Failed to load certifications' }, { status: 500 });
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
      const base64Content = Buffer.from(bytes).toString('base64');
      
      const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadPath = `public/uploads/certifications/${fileName}`;
      
      await updateGithubFile(uploadPath, base64Content, `Upload certification image ${fileName}`);
      imagePath = `/uploads/certifications/${fileName}`;
    }

    const file = await getGithubFile(CERTS_PATH);
    const certifications = safeParseCertifications(file?.content);
    const currentSha = file ? file.sha : undefined;

    const newCertification = {
      id: Date.now().toString(),
      institution,
      course,
      year,
      certificateUrl: imagePath
    };

    certifications.push(newCertification);

    const newContent = Buffer.from(JSON.stringify(certifications, null, 2)).toString('base64');
    await updateGithubFile(CERTS_PATH, newContent, `Add certification: ${course}`, currentSha);

    return NextResponse.json({ success: true, certification: newCertification }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving certification:', error);
    return NextResponse.json({ error: error?.message || 'Failed to save certification' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing certification ID' }, { status: 400 });
    }

    const institution = formData.get('institution') as string;
    const course = formData.get('course') as string;
    const year = formData.get('year') as string;
    const certificateUrl = formData.get('certificateUrl') as string;
    const imageFile = formData.get('image') as File | null;
    const existingImage = formData.get('existingImage') as string | null;

    if (!institution || !course || !year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imagePath = existingImage || certificateUrl || '#';
    if (imageFile && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const base64Content = Buffer.from(bytes).toString('base64');
      
      const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadPath = `public/uploads/certifications/${fileName}`;
      
      await updateGithubFile(uploadPath, base64Content, `Upload certification image ${fileName}`);
      imagePath = `/uploads/certifications/${fileName}`;
    }

    const file = await getGithubFile(CERTS_PATH);
    const certifications = safeParseCertifications(file?.content);
    const currentSha = file ? file.sha : undefined;
    
    const index = certifications.findIndex((c: any) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }

    certifications[index] = {
      ...certifications[index],
      institution,
      course,
      year,
      certificateUrl: imagePath
    };

    const newContent = Buffer.from(JSON.stringify(certifications, null, 2)).toString('base64');
    await updateGithubFile(CERTS_PATH, newContent, `Update certification: ${course}`, currentSha);

    return NextResponse.json({ success: true, certification: certifications[index] }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating certification:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update certification' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const file = await getGithubFile(CERTS_PATH);
    let certifications = safeParseCertifications(file?.content);
    const currentSha = file ? file.sha : undefined;
    
    certifications = certifications.filter((c: any) => c.id !== id);
    
    const newContent = Buffer.from(JSON.stringify(certifications, null, 2)).toString('base64');
    await updateGithubFile(CERTS_PATH, newContent, `Delete certification ${id}`, currentSha);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting certification:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete certification' }, { status: 500 });
  }
}
