import { getGithubFile, updateGithubFile, jsonNoCache } from '@/lib/github';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

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
      return jsonNoCache([]);
    }
    const experiences = safeParseExperiences(file.content);
    return jsonNoCache(experiences);
  } catch (error: any) {
    console.error('Error reading experiences:', error);
    return jsonNoCache({ error: error?.message || 'Failed to load experiences' }, 500);
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
      return jsonNoCache({ error: 'Missing required fields' }, 400);
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

    return jsonNoCache({ success: true, experience: newExperience }, 201);
  } catch (error: any) {
    console.error('Error saving experience:', error);
    return jsonNoCache({ error: error?.message || 'Failed to save experience' }, 500);
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return jsonNoCache({ error: 'Missing experience ID' }, 400);
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
      return jsonNoCache({ error: 'Missing required fields' }, 400);
    }

    const file = await getGithubFile(EXP_PATH);
    const experiences = safeParseExperiences(file?.content);
    const currentSha = file ? file.sha : undefined;
    
    const index = experiences.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return jsonNoCache({ error: 'Experience not found' }, 404);
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

    return jsonNoCache({ success: true, experience: experiences[index] }, 200);
  } catch (error: any) {
    console.error('Error updating experience:', error);
    return jsonNoCache({ error: error?.message || 'Failed to update experience' }, 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return jsonNoCache({ error: 'Missing id' }, 400);

    const file = await getGithubFile(EXP_PATH);
    let experiences = safeParseExperiences(file?.content);
    const currentSha = file ? file.sha : undefined;
    
    experiences = experiences.filter((e: any) => e.id !== id);
    
    const newContent = Buffer.from(JSON.stringify(experiences, null, 2)).toString('base64');
    await updateGithubFile(EXP_PATH, newContent, `Delete experience ${id}`, currentSha);
    
    return jsonNoCache({ success: true }, 200);
  } catch (error: any) {
    console.error('Error deleting experience:', error);
    return jsonNoCache({ error: error?.message || 'Failed to delete experience' }, 500);
  }
}
