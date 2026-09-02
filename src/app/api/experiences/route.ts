import { NextResponse } from 'next/server';
import { getGithubFile, updateGithubFile } from '@/lib/github';

const EXP_PATH = 'public/data/experiences.json';

export async function GET() {
  try {
    const file = await getGithubFile(EXP_PATH);
    if (!file) {
      return NextResponse.json([]);
    }
    const experiences = JSON.parse(file.content);
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error reading experiences from GitHub:', error);
    return NextResponse.json([]);
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

    if (!role || !organization) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const file = await getGithubFile(EXP_PATH);
    const experiences = file ? JSON.parse(file.content) : [];
    const currentSha = file ? file.sha : undefined;

    const newExperience = {
      id: Date.now().toString(),
      role,
      organization,
      description,
      dateJoined,
      refereeNumber
    };

    experiences.push(newExperience);

    const newContent = Buffer.from(JSON.stringify(experiences, null, 2)).toString('base64');
    await updateGithubFile(EXP_PATH, newContent, `Add experience: ${role}`, currentSha);

    return NextResponse.json({ success: true, experience: newExperience }, { status: 201 });
  } catch (error) {
    console.error('Error saving experience:', error);
    return NextResponse.json({ error: 'Failed to save experience' }, { status: 500 });
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

    if (!role || !organization) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const file = await getGithubFile(EXP_PATH);
    if (!file) {
      return NextResponse.json({ error: 'Experiences file not found' }, { status: 404 });
    }
    const experiences = JSON.parse(file.content);
    const currentSha = file.sha;
    
    const index = experiences.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    experiences[index] = {
      ...experiences[index],
      role,
      organization,
      description,
      dateJoined,
      refereeNumber
    };

    const newContent = Buffer.from(JSON.stringify(experiences, null, 2)).toString('base64');
    await updateGithubFile(EXP_PATH, newContent, `Update experience: ${role}`, currentSha);

    return NextResponse.json({ success: true, experience: experiences[index] }, { status: 200 });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const file = await getGithubFile(EXP_PATH);
    if (!file) {
      return NextResponse.json({ error: 'Experiences file not found' }, { status: 404 });
    }
    let experiences = JSON.parse(file.content);
    const currentSha = file.sha;
    
    experiences = experiences.filter((e: any) => e.id !== id);
    
    const newContent = Buffer.from(JSON.stringify(experiences, null, 2)).toString('base64');
    await updateGithubFile(EXP_PATH, newContent, `Delete experience ${id}`, currentSha);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
