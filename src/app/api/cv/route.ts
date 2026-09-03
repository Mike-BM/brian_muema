import { getGithubFile, updateGithubFile, jsonNoCache } from '@/lib/github';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const CV_PATH = 'public/cv.pdf';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('cv') as File | null;

    if (!file) {
      return jsonNoCache({ error: 'No CV file provided' }, 400);
    }

    const bytes = await file.arrayBuffer();
    const base64Content = Buffer.from(bytes).toString('base64');
    
    const existingFile = await getGithubFile(CV_PATH);
    const currentSha = existingFile ? existingFile.sha : undefined;
    
    await updateGithubFile(CV_PATH, base64Content, `Update CV document`, currentSha);

    return jsonNoCache({ success: true, message: 'CV updated successfully' }, 200);
  } catch (error: any) {
    console.error('Error saving CV:', error);
    return jsonNoCache({ error: error?.message || 'Failed to save CV' }, 500);
  }
}
