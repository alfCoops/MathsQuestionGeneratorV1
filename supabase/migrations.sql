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
