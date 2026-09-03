import { NextResponse } from 'next/server';
import { getGithubFile, updateGithubFile } from '@/lib/github';

const EXP_PATH = 'public/data/experiences.json';

function safeParseExperiences(content?: string): any[] {
  if (!content) return [];
  try {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Failed to parse experiences JSON:', e);
    return [];
  }
}

export async function GET() {
  try {
    const file = await getGithubFile(EXP_PATH);
    if (!file) {
      return NextResponse.json([]);
    }
    const experiences = safeParseExperiences(file.content);
    return NextResponse.json(experiences);
  } catch (error: any) {
    console.error('Error reading experiences:', error);
    return NextResponse.json({ error: error?.message || 'Failed to load experiences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const role = formData.get('role') as string;
    const organization = formData.get('organization') as string;
    const description = formData.get('description') as string;
    const dateJoined = formData.get('dateJoined') as string;
    const refereeNumber = formData.get('refereeNumber') as string;
    
    // Freelance fields
    const type = formData.get('type') as string || 'Formal';
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const current = formData.get('current') === 'true';
    const link = formData.get('link') as string;

    if (!role || !organization) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const file = await getGithubFile(EXP_PATH);
    const experiences = safeParseExperiences(file?.content);
    const currentSha = file ? file.sha : undefined;

    const newExperience = {
      id: Date.now().toString(),
      type,
      role,
      organization,
      description: description || '',
      dateJoined: dateJoined || '',
      refereeNumber: refereeNumber || '',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '',
      current: !!current,
      link: link || ''
    };

    experiences.push(newExperience);

    const newContent = Buffer.from(JSON.stringify(experiences, null, 2)).toString('base64');
    await updateGithubFile(EXP_PATH, newContent, `Add experience: ${role}`, currentSha);

    return NextResponse.json({ success: true, experience: newExperience }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving experience:', error);
    return NextResponse.json({ error: error?.message || 'Failed to save experience' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing experience ID' }, { status: 400 });
    }

    const role = formData.get('role') as string;
    const organization = formData.get('organization') as string;
    const description = formData.get('description') as string;
    const dateJoined = formData.get('dateJoined') as string;
    const refereeNumber = formData.get('refereeNumber') as string;

    const type = formData.get('type') as string || 'Formal';
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const current = formData.get('current') === 'true';
    const link = formData.get('link') as string;

    if (!role || !organization) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const file = await getGithubFile(EXP_PATH);
    const experiences = safeParseExperiences(file?.content);
    const currentSha = file ? file.sha : undefined;
    
    const index = experiences.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    experiences[index] = {
      ...experiences[index],
      type,
      role,
      organization,
      description: description || '',
      dateJoined: dateJoined || '',
      refereeNumber: refereeNumber || '',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '',
      current: !!current,
      link: link || ''
    };

    const newContent = Buffer.from(JSON.stringify(experiences, null, 2)).toString('base64');
    await updateGithubFile(EXP_PATH, newContent, `Update experience: ${role}`, currentSha);

    return NextResponse.json({ success: true, experience: experiences[index] }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating experience:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const file = await getGithubFile(EXP_PATH);
    let experiences = safeParseExperiences(file?.content);
    const currentSha = file ? file.sha : undefined;
    
    experiences = experiences.filter((e: any) => e.id !== id);
    
    const newContent = Buffer.from(JSON.stringify(experiences, null, 2)).toString('base64');
    await updateGithubFile(EXP_PATH, newContent, `Delete experience ${id}`, currentSha);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete experience' }, { status: 500 });
  }
}
