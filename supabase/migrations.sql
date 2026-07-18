-- MasterMaths — Phase 1 schema (v2).
-- Run in Supabase → SQL Editor. Idempotent (safe to re-run).
-- v2 = CLAUDE.md's v1 SQL + DEVELOPMENT-PLAN §5 deltas (course_id, display_name, prefs, last_location).
-- NEW = added/changed vs the v1 SQL in CLAUDE.md.

create table if not exists public.profiles (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  role          text not null default 'student' check (role in ('student','teacher','parent')),
  display_name  text,                                 -- NEW: nickname only, never a real name
  prefs         jsonb not null default '{}'::jsonb,   -- NEW: SEND/accessibility prefs (F16+)
  last_location jsonb,                                -- NEW: {course_id, lesson_id, section} for F5
  created_at    timestamptz default now()
);

create table if not exists public.progress (
  user_id     uuid references auth.users(id) on delete cascade,
  course_id   text not null default 'gcse-edexcel-foundation',  -- NEW
  lesson_id   text not null,
  steps       jsonb not null default '{}'::jsonb,
  quiz_state  jsonb,
  updated_at  timestamptz default now(),
  primary key (user_id, course_id, lesson_id)         -- NEW: course_id in the key
);

create table if not exists public.events (
  id         bigint generated always as identity primary key,
  user_id    uuid references auth.users(id) on delete cascade,
  type       text not null,
  course_id  text,                                    -- NEW (nullable; used from Phase 2b)
  lesson_id  text,
  meta       jsonb,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.events   enable row level security;

drop policy if exists "own profile"  on public.profiles;
drop policy if exists "own progress" on public.progress;
drop policy if exists "own events"   on public.events;
create policy "own profile"  on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own progress" on public.progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own events"   on public.events   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- teacher read-all comes with F10 (security-definer fn or role policy) — not now.


-- ============================================================================
-- Phase 2c — F11: per-question quiz results.
-- One row per answered question. The tag columns (topic/misconception/grade_band/
-- variant_group) are designed for F19 from day one; they are NULLABLE so existing
-- untagged questions record fine and the tags fill in as content is authored.
-- ============================================================================
create table if not exists public.quiz_results (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  course_id     text not null default 'gcse-edexcel-foundation',
  lesson_id     text not null,
  attempt_id    uuid not null,                 -- one quiz sitting = one attempt_id (groups its rows); supports F19 retries
  q_index       int  not null,                 -- position of the question in the quiz
  q_id          text,                          -- stable question id once questions have one (F19 variant pools)
  topic         text,                          -- topic tag of the question (for F10/F21 analytics)
  misconception text,                          -- named misconception the chosen distractor maps to; NULL if correct
  grade_band    text,                          -- e.g. '1-3' (for F19 fail-2-down / pass-2-up grade stepping)
  variant_group text,                          -- variant pool the question came from (F19)
  chosen        int,                           -- option index the student picked (NULL if skipped)
  correct       boolean not null,
  answered_at   timestamptz not null default now(),
  meta          jsonb not null default '{}'::jsonb
);
create index if not exists quiz_results_user_lesson_idx  on public.quiz_results (user_id, course_id, lesson_id);
create index if not exists quiz_results_attempt_idx      on public.quiz_results (attempt_id);
create index if not exists quiz_results_misconception_idx on public.quiz_results (misconception) where misconception is not null;

alter table public.quiz_results enable row level security;
drop policy if exists "own quiz_results" on public.quiz_results;
create policy "own quiz_results" on public.quiz_results for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- teacher read-all lands with F10 (same security-definer/role approach as the tables above).


-- ============================================================================
-- Phase 3 — F10: teacher read-all + comp-access toggle (D5) + F30-ready opt-in.
-- Idempotent. Students keep their own-row policies; teachers ADDITIONALLY get
-- read-all on the data tables (RLS combines policies with OR), and can flip
-- comp_access via a narrow RPC. No service_role key in the browser for this.
-- ============================================================================

-- New profile columns (D5 comp-access; F30 email opt-in — column now, feature later).
alter table public.profiles add column if not exists comp_access         boolean not null default false;
alter table public.profiles add column if not exists streak_emails_opt_in boolean not null default false;

-- Who is a teacher? SECURITY DEFINER so the check runs without RLS on profiles,
-- preventing infinite recursion when the profiles policy itself calls this.
create or replace function public.is_teacher()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'teacher');
$$;
revoke all on function public.is_teacher() from public;
grant execute on function public.is_teacher() to authenticated;

-- Teacher read-all (SELECT only) on the data tables. Own-row policies stay in place.
drop policy if exists "teacher reads profiles"     on public.profiles;
drop policy if exists "teacher reads progress"     on public.progress;
drop policy if exists "teacher reads quiz_results" on public.quiz_results;
drop policy if exists "teacher reads events"       on public.events;
create policy "teacher reads profiles"     on public.profiles     for select using (public.is_teacher());
create policy "teacher reads progress"     on public.progress     for select using (public.is_teacher());
create policy "teacher reads quiz_results" on public.quiz_results for select using (public.is_teacher());
create policy "teacher reads events"       on public.events       for select using (public.is_teacher());

-- Comp-access toggle: a narrow, teacher-only RPC (avoids a blanket teacher-write
-- policy that could touch any column of any profile).
create or replace function public.set_comp_access(target uuid, val boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_teacher() then raise exception 'not authorized'; end if;
  update public.profiles set comp_access = val where user_id = target;
end; $$;
revoke all on function public.set_comp_access(uuid, boolean) from public;
grant execute on function public.set_comp_access(uuid, boolean) to authenticated;

-- ONE-TIME, by hand: make Ryan's account a teacher (find his id in Auth → Users):
--   update public.profiles set role = 'teacher' where user_id = '<ryan-user-id>';
-- (Without this, no account passes is_teacher() and the dashboard shows nothing.)

-- ============================================================================
-- Phase 3 / F32 — questions_review: the AI generation service's output queue.
-- Columns per the generator repo's GENERATOR-SERVICE.md §5 (must match byte-for-byte).
-- The SERVICE only INSERTs pending rows (via the service key, which bypasses RLS) and
-- reads back approved/edited rows for its few-shot loop. The Teacher review tab (F10b)
-- owns ALL status transitions; an edit stores the field diff in edited_diff — that diff
-- is the taste signal the generator learns from, NOT an audit trail.
-- ============================================================================
create table if not exists public.questions_review (
  id               bigint generated always as identity primary key,
  course_id        text not null,
  lesson_id        text,                                                  -- nullable
  kind             text not null check (kind in ('question','hints','generator')),
  payload          jsonb not null,                                        -- full item: question_html, options(+misconception tags), answer, answer_numeric, hints, mark_scheme, marks, calculator, trace
  spec_ref         text[],
  grade_band       int,
  variant_group    text,
  similarity_score numeric,
  source           text not null default 'ai' check (source in ('ai')),
  status           text not null default 'pending' check (status in ('pending','approved','edited','rejected')),
  approved_by      uuid references auth.users(id) on delete set null,
  edited_diff      jsonb,
  created_at       timestamptz not null default now()
);
create index if not exists questions_review_status_idx on public.questions_review (status, created_at);
create index if not exists questions_review_course_idx on public.questions_review (course_id);

alter table public.questions_review enable row level security;
-- Teacher-only: students never touch this table. The service uses the service key (bypasses RLS).
drop policy if exists "teacher reads review"  on public.questions_review;
drop policy if exists "teacher writes review" on public.questions_review;
create policy "teacher reads review"  on public.questions_review for select using (public.is_teacher());
create policy "teacher writes review" on public.questions_review for update using (public.is_teacher()) with check (public.is_teacher());
-- (No insert policy: inserts come from the service via the service key. Add one only if the
--  teacher UI ever needs to hand-author into the queue.)
