import { getGithubFile } from './github';
import { LearningHubData, LearningPath } from './learning-hub-types';
import fs from 'fs/promises';
import path from 'path';

const LEARNING_HUB_PATH = 'public/data/learning-hub.json';

export async function getLearningHubData(): Promise<LearningHubData> {
  try {
    const file = await getGithubFile(LEARNING_HUB_PATH);
    if (file && file.content) {
      return JSON.parse(file.content);
    }
  } catch (e) {
    console.warn('Failed to load learning hub data via getGithubFile, checking direct local fs:', e);
  }

  try {
    const fullPath = path.join(process.cwd(), 'public', 'data', 'learning-hub.json');
    const content = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to read learning hub data from local filesystem:', err);
    return {
      paths: [],
      resources: [],
      workshops: [],
      projects: [],
      learnerShowcase: [],
    };
  }
}

export async function getLearningPathBySlug(slug: string): Promise<LearningPath | null> {
  const data = await getLearningHubData();
  return data.paths.find((p) => p.slug === slug) || null;
}
