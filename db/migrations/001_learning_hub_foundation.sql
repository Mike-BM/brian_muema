-- Learning Hub, stage 1: foundation.
-- Safe to run more than once (every statement is idempotent).
-- Run it with `npm run db:migrate`, or paste it into the Neon SQL editor.

CREATE TABLE IF NOT EXISTS schema_migrations (
  name        text PRIMARY KEY,
  applied_at  timestamptz NOT NULL DEFAULT now()
);

-- Editable site settings (fees, consultation options, payment instructions ...).
CREATE TABLE IF NOT EXISTS lh_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lh_pathways (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order  integer NOT NULL DEFAULT 0,
  published   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lh_courses (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id                  uuid NOT NULL REFERENCES lh_pathways(id) ON DELETE RESTRICT,
  slug                        text NOT NULL UNIQUE,
  title                       text NOT NULL,
  summary                     text NOT NULL DEFAULT '',
  description                 text NOT NULL DEFAULT '',
  learning_outcomes           jsonb NOT NULL DEFAULT '[]'::jsonb,
  prerequisites               jsonb NOT NULL DEFAULT '[]'::jsonb,
  audience                    text NOT NULL DEFAULT '',
  format                      text NOT NULL DEFAULT '',
  duration                    text NOT NULL DEFAULT '',
  required_tools              jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- NULL means "use the default fee from lh_settings".
  fee_ksh                     integer CHECK (fee_ksh IS NULL OR fee_ksh >= 0),
  individual_session_fee_ksh  integer CHECK (individual_session_fee_ksh IS NULL OR individual_session_fee_ksh >= 0),
  status                      text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  enrolment_open              boolean NOT NULL DEFAULT false,
  individual_session_available boolean NOT NULL DEFAULT false,
  consultation_available      boolean NOT NULL DEFAULT false,
  sort_order                  integer NOT NULL DEFAULT 0,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lh_courses_pathway_idx ON lh_courses (pathway_id, sort_order);
CREATE INDEX IF NOT EXISTS lh_courses_status_idx ON lh_courses (status);

-- ---------------------------------------------------------------------------
-- Initial settings. Every value can be changed later from the admin portal.
-- The payment number is intentionally blank here: it is entered in the admin
-- portal (or by one private UPDATE) so it is not stored in the public repository.
-- ---------------------------------------------------------------------------
INSERT INTO lh_settings (key, value) VALUES
  ('currency',             '"KSh"'),
  ('timezone',             '"Africa/Nairobi"'),
  ('fees',                 '{"complete_course": 500, "individual_session": 500}'),
  ('consultation_options', '[{"minutes": 30, "fee": 100}, {"minutes": 60, "fee": 150}]'),
  ('booking',              '{"slot_minutes": 30}'),
  ('payment',              '{"method": "Pochi la Biashara", "number": "", "instructions": "Send the amount shown to the number above, then enter the M-Pesa confirmation code. Your payment is only marked as paid after it has been verified."}')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Pathways and courses. All courses start as DRAFT with enrolment closed.
-- Nothing is shown to the public until it is configured and published.
-- ---------------------------------------------------------------------------
INSERT INTO lh_pathways (slug, title, sort_order) VALUES
  ('data-analysis-essentials',            'Data Analysis Essentials',                      1),
  ('python-for-data-analysis',            'Python for Data Analysis',                      2),
  ('statistical-analysis-research-tools', 'Statistical Analysis and Research Tools',       3),
  ('data-science-machine-learning',       'Data Science and Machine Learning',             4),
  ('ai-in-data-analysis',                 'AI in Data Analysis',                           5),
  ('sql-for-data-analysis',               'SQL for Data Analysis',                         6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lh_courses (pathway_id, slug, title, sort_order)
SELECT p.id, c.slug, c.title, c.sort_order
FROM (VALUES
  ('data-analysis-essentials',            'basic-excel',                          'Basic Excel',                                   1),
  ('data-analysis-essentials',            'advanced-excel',                       'Advanced Excel',                                2),
  ('data-analysis-essentials',            'excel-for-data-analysis',              'Excel for Data Analysis',                       3),
  ('python-for-data-analysis',            'python-for-beginners',                 'Python for Beginners',                          1),
  ('python-for-data-analysis',            'intermediate-python',                  'Intermediate Python',                           2),
  ('python-for-data-analysis',            'advanced-python-for-data-analysis',    'Advanced Python for Data Analysis',             3),
  ('statistical-analysis-research-tools', 'spss',                                 'SPSS',                                          1),
  ('statistical-analysis-research-tools', 'stata',                                'Stata',                                         2),
  ('statistical-analysis-research-tools', 'r-and-rstudio',                        'R and RStudio',                                 3),
  ('data-science-machine-learning',       'fundamentals-of-data-science',         'Fundamentals of Data Science',                  1),
  ('data-science-machine-learning',       'fundamentals-of-machine-learning',     'Fundamentals of Machine Learning',              2),
  ('data-science-machine-learning',       'practical-machine-learning-python',    'Practical Machine Learning with Python',        3),
  ('ai-in-data-analysis',                 'using-ai-in-data-analysis',            'Using AI in data analysis',                     1),
  ('ai-in-data-analysis',                 'ai-assisted-data-cleaning-exploration','AI-assisted data cleaning and exploration',     2),
  ('ai-in-data-analysis',                 'ai-for-reporting-and-visualization',   'AI for reporting and visualization',            3),
  ('sql-for-data-analysis',               'sql-fundamentals',                     'SQL fundamentals',                              1),
  ('sql-for-data-analysis',               'sql-for-querying-and-analyzing-data',  'SQL for querying and analyzing data',           2)
) AS c(pathway_slug, slug, title, sort_order)
JOIN lh_pathways p ON p.slug = c.pathway_slug
ON CONFLICT (slug) DO NOTHING;

INSERT INTO schema_migrations (name) VALUES ('001_learning_hub_foundation') ON CONFLICT (name) DO NOTHING;
