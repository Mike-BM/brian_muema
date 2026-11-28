import 'server-only';
import { getDb } from '@/db';
import * as q from './learning-hub-queries';

/** Server-side Learning Hub data access, bound to the real database. */
export const getLearningHubSettings = () => q.getSettings(getDb());

export const listPublishedPathways = () => q.listPathwaysWithCourses(getDb(), { publishedOnly: true });
export const listAllPathways = () => q.listPathwaysWithCourses(getDb(), { publishedOnly: false });

export const getPublishedCourse = (slug: string) => q.getCourseBySlug(getDb(), slug, { publishedOnly: true });
export const getCourseForAdmin = (slug: string) => q.getCourseBySlug(getDb(), slug, { publishedOnly: false });

export { effectiveFees } from './learning-hub-queries';
export type { LearningHubSettings, PathwayWithCourses } from './learning-hub-queries';
