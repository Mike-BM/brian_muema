import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'experiences.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const experiences = JSON.parse(fileContents);
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error reading experiences:', error);
    // Return empty array if file doesn't exist
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Read current experiences
    let experiences: any[] = [];
    try {
      const fileContents = await fs.readFile(dataFilePath, 'utf8');
      experiences = JSON.parse(fileContents);
    } catch {
      // Ignored if file doesn't exist
    }

    const role = formData.get('role') as string;
    const organization = formData.get('organization') as string;
    const description = formData.get('description') as string;
    const dateJoined = formData.get('dateJoined') as string;
    const refereeNumber = formData.get('refereeNumber') as string;

    if (!role || !organization) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newExperience = {
      id: Date.now().toString(),
      role,
      organization,
      description,
      dateJoined,
      refereeNumber
    };

    experiences.push(newExperience);

    await fs.writeFile(dataFilePath, JSON.stringify(experiences, null, 2));

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

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const experiences = JSON.parse(fileContents);
    
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

    await fs.writeFile(dataFilePath, JSON.stringify(experiences, null, 2));

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

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    let experiences = JSON.parse(fileContents);
    
    experiences = experiences.filter((e: any) => e.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(experiences, null, 2));
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
