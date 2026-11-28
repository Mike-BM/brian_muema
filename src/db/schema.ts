import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

/**
 * Typed mirror of db/migrations/*.sql. The SQL files are the source of truth for the database;
 * `npm run test:db` checks that these definitions and the SQL agree.
 */

export const lhSettings = pgTable('lh_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const lhPathways = pgTable('lh_pathways', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const lhCourses = pgTable('lh_courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  pathwayId: uuid('pathway_id')
    .notNull()
    .references(() => lhPathways.id, { onDelete: 'restrict' }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary').notNull().default(''),
  description: text('description').notNull().default(''),
  learningOutcomes: jsonb('learning_outcomes').$type<string[]>().notNull().default([]),
  prerequisites: jsonb('prerequisites').$type<string[]>().notNull().default([]),
  audience: text('audience').notNull().default(''),
  format: text('format').notNull().default(''),
  duration: text('duration').notNull().default(''),
  requiredTools: jsonb('required_tools').$type<string[]>().notNull().default([]),
  feeKsh: integer('fee_ksh'),
  individualSessionFeeKsh: integer('individual_session_fee_ksh'),
  status: text('status').$type<'draft' | 'published' | 'archived'>().notNull().default('draft'),
  enrolmentOpen: boolean('enrolment_open').notNull().default(false),
  individualSessionAvailable: boolean('individual_session_available').notNull().default(false),
  consultationAvailable: boolean('consultation_available').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type LhCourse = typeof lhCourses.$inferSelect;
export type LhPathway = typeof lhPathways.$inferSelect;
