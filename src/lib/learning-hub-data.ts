import { getGithubFile } from './github';
import { LearningHubData, LearningPath } from './learning-hub-types';
import fs from 'fs/promises';
import path from 'path';

// Stored OUTSIDE /public so the raw JSON is never downloadable from the website.
const LEARNING_HUB_PATH = 'data/learning-hub.json';
const SETTINGS_PATH = 'public/data/settings.json';

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
    const fullPath = path.join(process.cwd(), 'data', 'learning-hub.json');
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


/**
 * The learning hub is shown to visitors only when the admin switches it Live.
 * Until then the public sees a "Stay tuned" page. Default: NOT live.
 */
export async function isLearningHubLive(): Promise<boolean> {
  try {
    const file = await getGithubFile(SETTINGS_PATH);
    if (file?.content) {
      return JSON.parse(file.content).learningHubLive === true;
    }
  } catch (e) {
    console.warn('Could not read learning hub visibility setting:', e);
  }
  return false;
}
