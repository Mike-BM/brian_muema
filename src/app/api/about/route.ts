import { getGithubFile, updateGithubFile, jsonNoCache } from '@/lib/github';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const ABOUT_PATH = 'public/data/about.json';

export async function GET() {
  try {
    const file = await getGithubFile(ABOUT_PATH);
    if (!file || !file.content) {
      return jsonNoCache({ content: "" });
    }
    try {
      const aboutData = JSON.parse(file.content);
      return jsonNoCache(aboutData);
    } catch (err) {
      console.error('JSON parse error for about.json:', err);
      return jsonNoCache({ content: file.content });
    }
  } catch (error: any) {
    console.error('Error reading about.json:', error);
    return jsonNoCache({ error: error?.message || 'Failed to load about section data' }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (typeof data.content !== 'string') {
      return jsonNoCache({ error: 'Invalid content field' }, 400);
    }

    const file = await getGithubFile(ABOUT_PATH);
    const currentSha = file ? file.sha : undefined;

    const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    await updateGithubFile(ABOUT_PATH, newContent, `Update about section`, currentSha);

    return jsonNoCache({ success: true, about: data }, 201);
  } catch (error: any) {
    console.error('Error saving about data:', error);
    return jsonNoCache({ error: error?.message || 'Failed to save about section data' }, 500);
  }
}
