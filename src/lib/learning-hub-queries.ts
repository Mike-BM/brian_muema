import { asc, eq } from 'drizzle-orm';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import * as schema from '../db/schema';
import type { LhCourse, LhPathway } from '../db/schema';

/**
 * Learning Hub read queries. They take the database as an argument so the same code runs against
 * Neon in production and a throw-away Postgres in tests. Server code should use
 * `src/lib/learning-hub-db.ts`, which supplies the real connection.
 */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export interface LearningHubSettings {
  currency: string;
  timezone: string;
  fees: { completeCourse: number; individualSession: number };
  consultationOptions: { minutes: number; fee: number }[];
  booking: { slotMinutes: number };
  payment: { method: string; number: string; instructions: string };
}

const num = (v: unknown, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : fallback;
const str = (v: unknown, fallback: string) => (typeof v === 'string' ? v : fallback);
const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

/** Turns raw key/value rows into validated settings. Missing or malformed values fall back to safe defaults. */
export function parseSettings(rows: { key: string; value: unknown }[]): LearningHubSettings {
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const fees = obj(map.get('fees'));
  const booking = obj(map.get('booking'));
  const payment = obj(map.get('payment'));
  const options = Array.isArray(map.get('consultation_options')) ? (map.get('consultation_options') as unknown[]) : [];

  return {
    currency: str(map.get('currency'), 'KSh'),
    timezone: str(map.get('timezone'), 'Africa/Nairobi'),
    fees: { completeCourse: num(fees.complete_course, 500), individualSession: num(fees.individual_session, 500) },
    consultationOptions: options
      .map((o) => obj(o))
      .filter((o) => typeof o.minutes === 'number' && o.minutes > 0 && typeof o.fee === 'number' && o.fee >= 0)
      .map((o) => ({ minutes: o.minutes as number, fee: o.fee as number })),
    booking: { slotMinutes: num(booking.slot_minutes, 30) || 30 },
    payment: {
      method: str(payment.method, 'Pochi la Biashara'),
      number: str(payment.number, ''),
      instructions: str(payment.instructions, ''),
    },
  };
}

export async function getSettings(db: Db): Promise<LearningHubSettings> {
  const rows = await db.select().from(schema.lhSettings);
  return parseSettings(rows);
}

/** The fees a visitor is shown for a course: the course's own fee if set, otherwise the default. */
export function effectiveFees(course: Pick<LhCourse, 'feeKsh' | 'individualSessionFeeKsh'>, settings: LearningHubSettings) {
  return {
    completeCourse: course.feeKsh ?? settings.fees.completeCourse,
    individualSession: course.individualSessionFeeKsh ?? settings.fees.individualSession,
  };
}

export type PathwayWithCourses = LhPathway & { courses: LhCourse[] };

/**
 * Pathways with their courses, in the admin's chosen order.
 * `publishedOnly` (the public view) hides draft/archived courses, unpublished pathways,
 * and pathways that have no published course left.
 */
export async function listPathwaysWithCourses(db: Db, opts: { publishedOnly: boolean }): Promise<PathwayWithCourses[]> {
  const pathways = await db.select().from(schema.lhPathways).orderBy(asc(schema.lhPathways.sortOrder), asc(schema.lhPathways.title));
  const courses = await db.select().from(schema.lhCourses).orderBy(asc(schema.lhCourses.sortOrder), asc(schema.lhCourses.title));

  const result = pathways
    .filter((p) => !opts.publishedOnly || p.published)
    .map((p) => ({
      ...p,
      courses: courses.filter((c) => c.pathwayId === p.id && (!opts.publishedOnly || c.status === 'published')),
    }));
  return opts.publishedOnly ? result.filter((p) => p.courses.length > 0) : result;
}

export async function getCourseBySlug(
  db: Db,
  slug: string,
  opts: { publishedOnly: boolean }
): Promise<(LhCourse & { pathway: LhPathway }) | null> {
  const rows = await db
    .select({ course: schema.lhCourses, pathway: schema.lhPathways })
    .from(schema.lhCourses)
    .innerJoin(schema.lhPathways, eq(schema.lhCourses.pathwayId, schema.lhPathways.id))
    .where(eq(schema.lhCourses.slug, slug))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (opts.publishedOnly && (row.course.status !== 'published' || !row.pathway.published)) return null;
  return { ...row.course, pathway: row.pathway };
}
