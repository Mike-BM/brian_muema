/**
 * Database checks, run on a real Postgres engine (PGlite) so no server or secrets are needed.
 *
 *   npm run test:db
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import * as schema from '../src/db/schema';
import {
  effectiveFees,
  getCourseBySlug,
  getSettings,
  listPathwaysWithCourses,
  parseSettings,
  type Db,
} from '../src/lib/learning-hub-queries';

let passed = 0;
async function check(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    passed++;
    console.log(`  ok   ${name}`);
  } catch (e) {
    console.error(`  FAIL ${name}\n       ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

async function main() {
  const pg = new PGlite();
  const dir = path.join(process.cwd(), 'db', 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  const apply = async () => {
    for (const f of files) await pg.exec(fs.readFileSync(path.join(dir, f), 'utf8'));
  };
  await apply();
  const db = drizzle(pg, { schema }) as unknown as Db;
  const d = drizzle(pg, { schema });

  console.log('Migration and seed');
  await check('migrations can be applied twice without duplicates (idempotent)', async () => {
    await apply();
    assert.equal((await db.select().from(schema.lhPathways)).length, 6);
    assert.equal((await db.select().from(schema.lhCourses)).length, 17);
  });
  await check('the six pathways exist, in order', async () => {
    const all = await listPathwaysWithCourses(db, { publishedOnly: false });
    assert.deepEqual(
      all.map((p) => p.title),
      [
        'Data Analysis Essentials',
        'Python for Data Analysis',
        'Statistical Analysis and Research Tools',
        'Data Science and Machine Learning',
        'AI in Data Analysis',
        'SQL for Data Analysis',
      ]
    );
    assert.deepEqual(all.map((p) => p.courses.length), [3, 3, 3, 3, 3, 2]);
  });
  await check('every course starts as a draft with enrolment closed and nothing hard-coded', async () => {
    const courses = await db.select().from(schema.lhCourses);
    for (const c of courses) {
      assert.equal(c.status, 'draft', c.slug);
      assert.equal(c.enrolmentOpen, false, c.slug);
      assert.equal(c.individualSessionAvailable, false, c.slug);
      assert.equal(c.consultationAvailable, false, c.slug);
      assert.equal(c.feeKsh, null, c.slug);
      assert.equal(c.description, '', c.slug);
    }
  });

  console.log('Settings and fees');
  await check('initial fees and consultation options match the approved prices', async () => {
    const s = await getSettings(db);
    assert.equal(s.currency, 'KSh');
    assert.equal(s.timezone, 'Africa/Nairobi');
    assert.deepEqual(s.fees, { completeCourse: 500, individualSession: 500 });
    assert.deepEqual(s.consultationOptions, [{ minutes: 30, fee: 100 }, { minutes: 60, fee: 150 }]);
    assert.equal(s.booking.slotMinutes, 30);
  });
  await check('the payment number is blank in the repository seed', async () => {
    const s = await getSettings(db);
    assert.equal(s.payment.method, 'Pochi la Biashara');
    assert.equal(s.payment.number, '');
  });
  await check('changed settings are picked up, and the seed does not overwrite them', async () => {
    await d.update(schema.lhSettings).set({ value: { complete_course: 750, individual_session: 400 } }).where(eq(schema.lhSettings.key, 'fees'));
    await apply();
    const s = await getSettings(db);
    assert.deepEqual(s.fees, { completeCourse: 750, individualSession: 400 });
  });
  await check('missing or malformed settings fall back to safe defaults', () => {
    const s = parseSettings([{ key: 'fees', value: 'oops' }, { key: 'consultation_options', value: [{ minutes: -5, fee: 10 }, { minutes: 30, fee: 100 }] }]);
    assert.deepEqual(s.fees, { completeCourse: 500, individualSession: 500 });
    assert.deepEqual(s.consultationOptions, [{ minutes: 30, fee: 100 }]);
  });
  await check('a course fee overrides the default only when set', async () => {
    const s = await getSettings(db);
    assert.deepEqual(effectiveFees({ feeKsh: null, individualSessionFeeKsh: null }, s), { completeCourse: 750, individualSession: 400 });
    assert.deepEqual(effectiveFees({ feeKsh: 1000, individualSessionFeeKsh: 0 }, s), { completeCourse: 1000, individualSession: 0 });
  });

  console.log('Public visibility');
  await check('the public sees nothing until a course is published', async () => {
    assert.equal((await listPathwaysWithCourses(db, { publishedOnly: true })).length, 0);
    assert.equal(await getCourseBySlug(db, 'basic-excel', { publishedOnly: true }), null);
    assert.ok(await getCourseBySlug(db, 'basic-excel', { publishedOnly: false }));
  });
  await check('publishing one course shows only that course and its pathway', async () => {
    await d.update(schema.lhCourses).set({ status: 'published' }).where(eq(schema.lhCourses.slug, 'sql-fundamentals'));
    const pub = await listPathwaysWithCourses(db, { publishedOnly: true });
    assert.equal(pub.length, 1);
    assert.equal(pub[0].slug, 'sql-for-data-analysis');
    assert.deepEqual(pub[0].courses.map((c) => c.slug), ['sql-fundamentals']);
    assert.ok(await getCourseBySlug(db, 'sql-fundamentals', { publishedOnly: true }));
    assert.equal(await getCourseBySlug(db, 'sql-for-querying-and-analyzing-data', { publishedOnly: true }), null);
  });
  await check('unpublishing the pathway hides its published courses from the public', async () => {
    await d.update(schema.lhPathways).set({ published: false }).where(eq(schema.lhPathways.slug, 'sql-for-data-analysis'));
    assert.equal((await listPathwaysWithCourses(db, { publishedOnly: true })).length, 0);
    assert.equal(await getCourseBySlug(db, 'sql-fundamentals', { publishedOnly: true }), null);
  });
  await check('reordering courses changes the order shown', async () => {
    await d.update(schema.lhCourses).set({ sortOrder: 9 }).where(eq(schema.lhCourses.slug, 'basic-excel'));
    const all = await listPathwaysWithCourses(db, { publishedOnly: false });
    assert.deepEqual(all[0].courses.map((c) => c.slug), ['advanced-excel', 'excel-for-data-analysis', 'basic-excel']);
  });

  console.log('Database rules');
  const pathwayId = (await db.select().from(schema.lhPathways).limit(1))[0].id;
  const rejects = async (label: string, values: Record<string, unknown>) =>
    check(label, async () => {
      await assert.rejects(() => d.insert(schema.lhCourses).values({ pathwayId, slug: 'x-' + Math.random(), title: 'x', ...values } as never));
    });
  await rejects('a negative course fee is rejected', { feeKsh: -1 });
  await rejects('a negative session fee is rejected', { individualSessionFeeKsh: -5 });
  await rejects('an unknown status is rejected', { status: 'live' });
  await check('a duplicate course slug is rejected', async () => {
    await assert.rejects(() => d.insert(schema.lhCourses).values({ pathwayId, slug: 'basic-excel', title: 'again' }));
  });
  await check('a pathway that still has courses cannot be deleted', async () => {
    await assert.rejects(() => d.delete(schema.lhPathways).where(eq(schema.lhPathways.id, pathwayId)));
  });

  console.log('Typed schema matches the SQL');
  for (const [name, table] of [['lh_settings', schema.lhSettings], ['lh_pathways', schema.lhPathways], ['lh_courses', schema.lhCourses]] as const) {
    await check(`${name}: columns are identical`, async () => {
      const rows = await d.execute(sql`select column_name from information_schema.columns where table_name = ${name}`);
      const fromDb = (rows.rows as { column_name: string }[]).map((r) => r.column_name).sort();
      const fromTs = Object.values(getTableColumns(table)).map((c) => c.name).sort();
      assert.deepEqual(fromTs, fromDb);
    });
  }

  console.log(`\n${passed} checks passed${process.exitCode ? ', some FAILED' : ''}`);
  await pg.close();
}

main();
