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

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
    }

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
    const existingImage = formData.get('existingImage') as string | null;

    if (!title || !description || !category || !filterCategory) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imagePath = existingImage || null;
    if (imageFile && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }
      
      await fs.writeFile(filePath, buffer);
      imagePath = `/uploads/projects/${fileName}`;
    }

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const projects = JSON.parse(fileContents);
    
    const index = projects.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    projects[index] = {
      ...projects[index],
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

    await fs.writeFile(dataFilePath, JSON.stringify(projects, null, 2));

    return NextResponse.json({ success: true, project: projects[index] }, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    let projects = JSON.parse(fileContents);
    
    projects = projects.filter((p: any) => p.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(projects, null, 2));
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
