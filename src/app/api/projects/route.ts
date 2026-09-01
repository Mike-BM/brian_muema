import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'projects.json');
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const projects = JSON.parse(fileContents);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const filterCategory = formData.get('filterCategory') as string;
    const projectType = (formData.get('projectType') as string) || 'Professional';
    const technologies = (formData.get('technologies') as string)?.split(',').map(t => t.trim()) || [];
    const link = formData.get('link') as string;
    const github = formData.get('github') as string;
    const liveUrl = formData.get('liveUrl') as string;
    const imageFile = formData.get('image') as File | null;

    if (!title || !description || !category || !filterCategory) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imagePath = null;
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
      imagePath = `/uploads/projects/${fileName}`;
    }

    // Read current projects
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const projects = JSON.parse(fileContents);

    const newProject = {
      id: Date.now().toString(),
      title,
      description,
      category,
      filterCategory,
      projectType,
      technologies,
      link: link || '#',
      github: github || '#',
      liveUrl: liveUrl || '',
      image: imagePath
    };

    projects.push(newProject);

    await fs.writeFile(dataFilePath, JSON.stringify(projects, null, 2));

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}
