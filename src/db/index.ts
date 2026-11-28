import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Server-side database connection (Neon Postgres over HTTPS, which suits Vercel's serverless functions).
 * Only this file reads DATABASE_URL. It is never sent to the browser.
 */
let cached: ReturnType<typeof create> | null = null;

function create(url: string) {
  return drizzle(neon(url), { schema });
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL is not set. Add your Neon connection string as an environment variable.');
    }
    cached = create(url);
  }
  return cached;
}
