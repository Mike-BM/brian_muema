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
    
    const action = formData.get('action') as string;
    
    // Read current experiences
    let experiences = [];
    try {
      const fileContents = await fs.readFile(dataFilePath, 'utf8');
      experiences = JSON.parse(fileContents);
    } catch {
      // Ignored if file doesn't exist
    }

    if (action === 'delete') {
      const id = formData.get('id') as string;
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
      
      experiences = experiences.filter((exp: { id: string }) => exp.id !== id);
      await fs.writeFile(dataFilePath, JSON.stringify(experiences, null, 2));
      return NextResponse.json({ success: true }, { status: 200 });
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
