import { NextResponse } from 'next/server';
import { getGithubFile, updateGithubFile } from '@/lib/github';

const PROJECTS_PATH = 'public/data/projects.json';

export async function GET() {
  try {
    // We fetch directly from GitHub to ensure the admin panel sees latest data
    const file = await getGithubFile(PROJECTS_PATH);
    if (!file) {
      return NextResponse.json([]);
    }
    const projects = JSON.parse(file.content);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error reading projects from GitHub:', error);
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const dateCompleted = formData.get('dateCompleted') as string;
    const featured = formData.get('featured') === 'true';
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
      const base64Content = Buffer.from(bytes).toString('base64');
      
      const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadPath = `public/uploads/projects/${fileName}`;
      
      // Upload to GitHub
      await updateGithubFile(uploadPath, base64Content, `Upload project image ${fileName}`);
      imagePath = `/uploads/projects/${fileName}`;
    }

    // Read current projects from GitHub
    const file = await getGithubFile(PROJECTS_PATH);
    const projects = file ? JSON.parse(file.content) : [];
    const currentSha = file ? file.sha : undefined;

    const newProject = {
      id: Date.now().toString(),
      title,
      description,
      fullDescription: fullDescription || '',
      dateCompleted: dateCompleted || new Date().toISOString().split('T')[0],
      featured,
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

    // Write back to GitHub
    const newContent = Buffer.from(JSON.stringify(projects, null, 2)).toString('base64');
    await updateGithubFile(PROJECTS_PATH, newContent, `Add project: ${title}`, currentSha);

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
    const fullDescription = formData.get('fullDescription') as string;
    const dateCompleted = formData.get('dateCompleted') as string;
    const featured = formData.get('featured') === 'true';
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
      const base64Content = Buffer.from(bytes).toString('base64');
      
      const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadPath = `public/uploads/projects/${fileName}`;
      
      await updateGithubFile(uploadPath, base64Content, `Upload project image ${fileName}`);
      imagePath = `/uploads/projects/${fileName}`;
    }

    const file = await getGithubFile(PROJECTS_PATH);
    if (!file) {
      return NextResponse.json({ error: 'Projects file not found' }, { status: 404 });
    }
    const projects = JSON.parse(file.content);
    const currentSha = file.sha;
    
    const index = projects.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    projects[index] = {
      ...projects[index],
      title,
      description,
      fullDescription: fullDescription || projects[index].fullDescription || '',
      dateCompleted: dateCompleted || projects[index].dateCompleted || new Date().toISOString().split('T')[0],
      featured,
      category,
      filterCategory,
      projectType,
      technologies,
      link: link || '#',
      github: github || '#',
      liveUrl: liveUrl || '',
      image: imagePath
    };

    const newContent = Buffer.from(JSON.stringify(projects, null, 2)).toString('base64');
    await updateGithubFile(PROJECTS_PATH, newContent, `Update project: ${title}`, currentSha);

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

    const file = await getGithubFile(PROJECTS_PATH);
    if (!file) {
      return NextResponse.json({ error: 'Projects file not found' }, { status: 404 });
    }
    let projects = JSON.parse(file.content);
    const currentSha = file.sha;
    
    projects = projects.filter((p: any) => p.id !== id);
    
    const newContent = Buffer.from(JSON.stringify(projects, null, 2)).toString('base64');
    await updateGithubFile(PROJECTS_PATH, newContent, `Delete project ${id}`, currentSha);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
