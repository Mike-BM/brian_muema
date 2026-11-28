/**
 * Applies db/migrations/*.sql to the database in DATABASE_URL, in file-name order.
 * Every migration is idempotent, so running this more than once is safe.
 *
 *   npm run db:migrate
 */
import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set. Put your Neon connection string in .env.local (never commit it).');
    process.exit(1);
  }
  const dir = path.join(process.cwd(), 'db', 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    for (const file of files) {
      await client.query(fs.readFileSync(path.join(dir, file), 'utf8'));
      console.log(`applied ${file}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
