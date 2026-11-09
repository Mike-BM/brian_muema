import { getGithubFile, updateGithubFile, jsonNoCache } from '@/lib/github';
import { LearningHubData } from '@/lib/learning-hub-types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const LEARNING_HUB_PATH = 'public/data/learning-hub.json';

function safeParseData(content?: string): LearningHubData {
  if (!content) {
    return {
      paths: [],
      resources: [],
      workshops: [],
      projects: [],
      learnerShowcase: [],
    };
  }
  try {
    const data = JSON.parse(content);
    return {
      paths: Array.isArray(data.paths) ? data.paths : [],
      resources: Array.isArray(data.resources) ? data.resources : [],
      workshops: Array.isArray(data.workshops) ? data.workshops : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      learnerShowcase: Array.isArray(data.learnerShowcase) ? data.learnerShowcase : [],
    };
  } catch (e) {
    console.error('Failed to parse learning hub JSON:', e);
    return {
      paths: [],
      resources: [],
      workshops: [],
      projects: [],
      learnerShowcase: [],
    };
  }
}

export async function GET() {
  try {
    const file = await getGithubFile(LEARNING_HUB_PATH);
    if (!file) {
      return jsonNoCache({
        paths: [],
        resources: [],
        workshops: [],
        projects: [],
        learnerShowcase: [],
      });
    }
    const data = safeParseData(file.content);
    return jsonNoCache(data);
  } catch (error: any) {
    console.error('Error reading learning hub data:', error);
    return jsonNoCache({ error: error?.message || 'Failed to load learning hub data' }, 500);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const file = await getGithubFile(LEARNING_HUB_PATH);
    const currentSha = file ? file.sha : undefined;

    const newContent = Buffer.from(JSON.stringify(body, null, 2)).toString('base64');
    await updateGithubFile(LEARNING_HUB_PATH, newContent, 'Update Learning Hub data', currentSha);

    return jsonNoCache({ success: true, data: body }, 200);
  } catch (error: any) {
    console.error('Error updating learning hub data:', error);
    return jsonNoCache({ error: error?.message || 'Failed to update learning hub data' }, 500);
  }
}
