# Learning Hub: database setup (stage 1)

Stage 1 adds the database foundation only. **Nothing changes on the public site yet.**
The Learning Hub keeps working exactly as before until later stages switch it over.

## What stage 1 adds

- A Postgres database (Neon) for courses, pathways and settings. Later stages add enrolments,
  bookings, learner accounts and progress.
- Six pathways and seventeen courses, all created as **drafts with enrolment closed**.
- Editable settings: default course fee, individual-session fee, consultation options
  (30 min / 1 hour), and payment instructions. Initial values: KSh 500 per course,
  KSh 500 per session, KSh 100 for 30 minutes, KSh 150 for 1 hour.

## One-time setup

1. **Create the database.** In Neon, create a project in **Europe (Frankfurt)** with only
   *Postgres database* switched on.
2. **Create the tables.** In the Neon dashboard open **SQL Editor**, paste the contents of
   `db/migrations/001_learning_hub_foundation.sql`, and run it. It is safe to run again.
   (Developers can run `npm run db:migrate` instead.)
3. **Add the connection string to Vercel.** In Vercel open the project, then
   *Settings → Environment Variables*, and add:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | the Neon connection string (starts with `postgresql://`) |

   Keep it private. Never commit it or paste it into chat, issues or pull requests.
4. **Put Vercel's functions next to the database.** In Vercel: *Settings → Functions → Function
   Region*, choose **Frankfurt (fra1)**, then redeploy.
5. **Enter the payment number** (stored in the database, not in the repository). Run this once in
   the Neon SQL editor, replacing the number:

   ```sql
   UPDATE lh_settings
   SET value = jsonb_set(value, '{number}', '"07XXXXXXXX"'), updated_at = now()
   WHERE key = 'payment';
   ```

   Stage 2 adds an admin screen for this and for all fees.

## Local development

Create `.env.local` (it is git-ignored) containing `DATABASE_URL=...`, then:

```bash
npm install
npm run db:migrate   # apply the SQL files to the database in DATABASE_URL
npm run test:db      # run the database checks (needs no database or secrets)
```

## Payments

The first version uses **manual verification**. A learner pays to the Pochi la Biashara number
shown on the page and enters the M-Pesa confirmation code. The admin checks it against the
M-Pesa message and marks it as paid. Nothing is described as paid until it has been verified.
Pochi la Biashara has no public API for automatic confirmation, so this is the supported route.
