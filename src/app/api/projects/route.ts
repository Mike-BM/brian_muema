import { getGithubFile, updateGithubFile, jsonNoCache } from '@/lib/github';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const PROJECTS_PATH = 'public/data/projects.json';

function safeParseProjects(content?: string): any[] {
  if (!content) return [];
  try {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Failed to parse projects JSON:', e);
    return [];
  }
}

export async function GET() {
  try {
    const file = await getGithubFile(PROJECTS_PATH);
    if (!file) {
      return jsonNoCache([]);
    }
    const projects = safeParseProjects(file.content);
    return jsonNoCache(projects);
  } catch (error: any) {
    console.error('Error reading projects:', error);
    return jsonNoCache({ error: error?.message || 'Failed to load projects' }, 500);
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
    const technologies = (formData.get('technologies') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [];
    const link = formData.get('link') as string;
    const github = formData.get('github') as string;
    const liveUrl = formData.get('liveUrl') as string;
    const imageFile = formData.get('image') as File | null;

    if (!title || !description || !category || !filterCategory) {
      return jsonNoCache({ error: 'Missing required fields' }, 400);
    }

    let imagePath = null;
    if (imageFile && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const base64Content = Buffer.from(bytes).toString('base64');
      
      const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadPath = `public/uploads/projects/${fileName}`;
      
      await updateGithubFile(uploadPath, base64Content, `Upload project image ${fileName}`);
      imagePath = `/uploads/projects/${fileName}`;
    }

    const file = await getGithubFile(PROJECTS_PATH);
    const projects = safeParseProjects(file?.content);
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

    const newContent = Buffer.from(JSON.stringify(projects, null, 2)).toString('base64');
    await updateGithubFile(PROJECTS_PATH, newContent, `Add project: ${title}`, currentSha);

    return jsonNoCache({ success: true, project: newProject }, 201);
  } catch (error: any) {
    console.error('Error saving project:', error);
    return jsonNoCache({ error: error?.message || 'Failed to save project' }, 500);
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return jsonNoCache({ error: 'Missing project ID' }, 400);
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const dateCompleted = formData.get('dateCompleted') as string;
    const featured = formData.get('featured') === 'true';
    const category = formData.get('category') as string;
    const filterCategory = formData.get('filterCategory') as string;
    const projectType = (formData.get('projectType') as string) || 'Professional';
    const technologies = (formData.get('technologies') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [];
    const link = formData.get('link') as string;
    const github = formData.get('github') as string;
    const liveUrl = formData.get('liveUrl') as string;
    const imageFile = formData.get('image') as File | null;
    const existingImage = formData.get('existingImage') as string | null;

    if (!title || !description || !category || !filterCategory) {
      return jsonNoCache({ error: 'Missing required fields' }, 400);
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
    const projects = safeParseProjects(file?.content);
    const currentSha = file ? file.sha : undefined;
    
    const index = projects.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return jsonNoCache({ error: 'Project not found' }, 404);
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

    return jsonNoCache({ success: true, project: projects[index] }, 200);
  } catch (error: any) {
    console.error('Error updating project:', error);
    return jsonNoCache({ error: error?.message || 'Failed to update project' }, 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return jsonNoCache({ error: 'Missing id' }, 400);

    const file = await getGithubFile(PROJECTS_PATH);
    let projects = safeParseProjects(file?.content);
    const currentSha = file ? file.sha : undefined;
    
    projects = projects.filter((p: any) => p.id !== id);
    
    const newContent = Buffer.from(JSON.stringify(projects, null, 2)).toString('base64');
    await updateGithubFile(PROJECTS_PATH, newContent, `Delete project ${id}`, currentSha);
    
    return jsonNoCache({ success: true }, 200);
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return jsonNoCache({ error: error?.message || 'Failed to delete project' }, 500);
  }
}
