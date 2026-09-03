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


-- ============================================================================
-- F12-lite — student practice bank (free-response, exam-style, self-marked).
-- A SANITISED, read-only view over APPROVED/EDITED, generator-kind items, exposing
-- ONLY the fields needed to render a practice question. Students NEVER see trace,
-- edited_diff, similarity, rejection data, or pending/rejected rows.
-- The practice section is FREE-RESPONSE (kind='generator': question + M1/A1 mark
-- scheme + staged hints; no MCQ options), so options/answer are intentionally absent.
-- security_invoker=false → the view runs as its owner and bypasses questions_review's
-- teacher-only RLS, but exposes only the curated subset below; read is granted to
-- students (anon + authenticated). Approved practice questions are student-facing
-- content, so this exposure is intended.
-- ============================================================================
create or replace view public.practice_questions
with (security_invoker = false) as
select
  qr.id,
  qr.course_id,
  qr.lesson_id,
  qr.grade_band,
  coalesce(qr.spec_ref, array(select jsonb_array_elements_text(coalesce(qr.payload->'spec_refs','[]'::jsonb)))) as spec_ref,  -- match to a lesson's specRefs
  qr.payload->>'topic' as topic,                                          -- for recording topic tags (part 3)
  jsonb_strip_nulls(jsonb_build_object(
    'question_html', qr.payload->'question_html',
    'hints',         qr.payload->'hints',        -- staged {stage,text,image?} — rendered via the shared helper
    'mark_scheme',   qr.payload->'mark_scheme',
    'marks',         qr.payload->'marks',
    'calculator',    qr.payload->'calculator'
  )) as item
from public.questions_review qr
where qr.status in ('approved','edited') and qr.kind = 'generator';

revoke all on public.practice_questions from public;
grant select on public.practice_questions to anon, authenticated;

-- Per-student no-repeat record (small; cascades with the user and the source row).
create table if not exists public.served_questions (
  user_id     uuid   not null references auth.users(id) on delete cascade,
  question_id bigint not null references public.questions_review(id) on delete cascade,
  lesson_id   text,
  served_at   timestamptz not null default now(),
  primary key (user_id, question_id)
);
alter table public.served_questions enable row level security;
drop policy if exists "own served" on public.served_questions;
create policy "own served" on public.served_questions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- ============================================================================
-- F13 — Parent dashboard (view-only, high-level only: completion/streak/last
-- active — never question-level or misconception detail; the linked account
-- is a third party to a minor's learning data, CLAUDE.md rule 4).
--
-- Linking is student-initiated: the student gets an invite code (get_or_
-- create_invite_code) and shares it themselves; a parent redeems it
-- (redeem_invite_code), which creates ONE row in parent_links and is the
-- ONLY thing that grants read access — unlike F10's is_teacher(), which is
-- a blanket "any teacher reads every student" policy, a parent must only
-- ever read the specific student(s) who shared a code with them.
--
-- Streak columns formalise what was previously device-local-only
-- (index.html's STREAK_KEY) so a parent (or any future cross-device view)
-- has something server-side to read; local storage stays the source of
-- truth for the signed-in device itself.
-- ============================================================================
alter table public.profiles add column if not exists invite_code   text unique;
alter table public.profiles add column if not exists streak_current int not null default 0;
alter table public.profiles add column if not exists streak_best    int not null default 0;
alter table public.profiles add column if not exists streak_last    date;

create table if not exists public.parent_links (
  parent_user_id  uuid references auth.users(id) on delete cascade,
  student_user_id uuid references auth.users(id) on delete cascade,
  created_at      timestamptz default now(),
  primary key (parent_user_id, student_user_id)
);
alter table public.parent_links enable row level security;
drop policy if exists "parent reads own links"  on public.parent_links;
drop policy if exists "student reads own links" on public.parent_links;
create policy "parent reads own links"  on public.parent_links for select using (auth.uid() = parent_user_id);
create policy "student reads own links" on public.parent_links for select using (auth.uid() = student_user_id);

-- SECURITY DEFINER so the check runs without RLS on parent_links (same
-- recursion-avoidance reason as is_teacher() above).
create or replace function public.is_linked_parent(target uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.parent_links pl
    where pl.parent_user_id = auth.uid() and pl.student_user_id = target);
$$;
revoke all on function public.is_linked_parent(uuid) from public;
grant execute on function public.is_linked_parent(uuid) to authenticated;

drop policy if exists "linked parent reads student progress" on public.progress;
drop policy if exists "linked parent reads student profile"  on public.profiles;
create policy "linked parent reads student progress" on public.progress for select using (public.is_linked_parent(user_id));
create policy "linked parent reads student profile"  on public.profiles for select using (public.is_linked_parent(user_id));

-- Student-only: get (or create on first call) their own invite code. A
-- 10-hex-char code is reasonably brute-force resistant; Supabase RPC calls
-- aren't rate-limited by default, so this is an accepted risk at this
-- scale (one-tutor business) rather than a solved one — a cooldown/
-- failed-attempts column would be the follow-up if it ever matters.
create or replace function public.get_or_create_invite_code()
returns text
language plpgsql security definer set search_path = public as $$
declare code text;
begin
  select invite_code into code from public.profiles where user_id = auth.uid();
  if code is null then
    code := substr(md5(random()::text || clock_timestamp()::text), 1, 10);
    update public.profiles set invite_code = code where user_id = auth.uid();
  end if;
  return code;
end; $$;
revoke all on function public.get_or_create_invite_code() from public;
grant execute on function public.get_or_create_invite_code() to authenticated;

-- Parent-only action: redeem a code to create the link. Promotes the
-- redeemer's own role to 'parent' UNLESS they're already 'teacher' (never
-- downgrade Ryan's own account if he ever redeemed a code for testing).
create or replace function public.redeem_invite_code(code text)
returns boolean
language plpgsql security definer set search_path = public as $$
declare student_id uuid;
begin
  select user_id into student_id from public.profiles where invite_code = code;
  if student_id is null or student_id = auth.uid() then return false; end if;
  insert into public.parent_links(parent_user_id, student_user_id)
    values (auth.uid(), student_id) on conflict do nothing;
  update public.profiles set role = 'parent' where user_id = auth.uid() and role = 'student';
  return true;
end; $$;
revoke all on function public.redeem_invite_code(text) from public;
grant execute on function public.redeem_invite_code(text) to authenticated;


-- ============================================================================
-- F23 — Weekly Q&A (D12: Zoom, not YouTube Live — no public live-embed, so this
-- is scheduling + a question queue + a join link, not a video/streaming feature).
-- Signed-in only throughout (not public/anon), matching how the rest of the app
-- treats anything beyond the free 1a lesson.
-- ============================================================================
create table if not exists public.qanda_sessions (
  id           bigint generated always as identity primary key,
  scheduled_at timestamptz not null,
  zoom_link    text,
  status       text not null default 'upcoming' check (status in ('upcoming','archived')),
  summary      text,                          -- optional notes/recording link, added on archive
  created_at   timestamptz default now()
);
alter table public.qanda_sessions enable row level security;
drop policy if exists "signed-in reads sessions" on public.qanda_sessions;
drop policy if exists "teacher writes sessions"  on public.qanda_sessions;
create policy "signed-in reads sessions" on public.qanda_sessions for select using (auth.uid() is not null);
create policy "teacher writes sessions"  on public.qanda_sessions for all    using (public.is_teacher()) with check (public.is_teacher());

create table if not exists public.qanda_questions (
  id          bigint generated always as identity primary key,
  session_id  bigint not null references public.qanda_sessions(id) on delete cascade,
  user_id     uuid   not null references auth.users(id) on delete cascade,
  text        text not null,
  answered    boolean not null default false,
  created_at  timestamptz default now()
);
alter table public.qanda_questions enable row level security;
drop policy if exists "signed-in reads questions" on public.qanda_questions;
drop policy if exists "own question insert"       on public.qanda_questions;
drop policy if exists "own question delete"       on public.qanda_questions;
drop policy if exists "teacher marks answered"    on public.qanda_questions;
create policy "signed-in reads questions" on public.qanda_questions for select using (auth.uid() is not null);
create policy "own question insert"       on public.qanda_questions for insert with check (auth.uid() = user_id);
create policy "own question delete"       on public.qanda_questions for delete using (auth.uid() = user_id);
create policy "teacher marks answered"    on public.qanda_questions for update using (public.is_teacher()) with check (public.is_teacher());

-- One vote per student per question (own row, same shape as everything else in this app).
create table if not exists public.qanda_votes (
  question_id bigint not null references public.qanda_questions(id) on delete cascade,
  user_id     uuid   not null references auth.users(id) on delete cascade,
  primary key (question_id, user_id)
);
alter table public.qanda_votes enable row level security;
drop policy if exists "signed-in reads votes" on public.qanda_votes;
drop policy if exists "own vote"              on public.qanda_votes;
create policy "signed-in reads votes" on public.qanda_votes for select using (auth.uid() is not null);
create policy "own vote"              on public.qanda_votes for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- ============================================================================
-- F24 — Points + leaderboard (D9: opt-in, default OFF — matches the existing
-- data-minimisation posture; nothing about a student is shown to other
-- students unless they choose in).
--
-- Integrity: `points` must NEVER be client-writable. The "own profile" policy
-- above is FOR ALL with no column restriction, so RLS alone does not stop a
-- student writing points directly via the client SDK — RLS is row-level only,
-- Postgres has no column-level RLS. The column-level REVOKE below closes that
-- specifically, independent of RLS, and does not affect the SECURITY DEFINER
-- function (it runs as its owner, not the calling student).
--
-- Known separate gap, not fixed here: the points formula reads streak_current,
-- which IS still directly client-writable (F13's syncStreakToCloud upserts it
-- from local storage). A student could inflate their own streak to inflate
-- points. Properly closing that means re-deriving streak server-side from
-- progress.updated_at instead of trusting the client's local calculation —
-- flagged as a follow-up, not done here.
-- ============================================================================
alter table public.profiles add column if not exists leaderboard_opt_in boolean not null default false;
alter table public.profiles add column if not exists points int not null default 0;

create or replace function public.recompute_my_points()
returns int
language plpgsql security definer set search_path = public as $$
declare lessons_complete int; quizzes_passed int; cur_streak int; total int;
begin
  select count(*) into lessons_complete from public.progress
    where user_id = auth.uid() and (steps->>'complete')::boolean is true;
  select count(*) into quizzes_passed from public.progress
    where user_id = auth.uid() and (steps->>'quiz')::boolean is true;
  select coalesce(streak_current,0) into cur_streak from public.profiles where user_id = auth.uid();
  total := lessons_complete*10 + quizzes_passed*5 + cur_streak;
  update public.profiles set points = total where user_id = auth.uid();
  return total;
end; $$;
revoke all on function public.recompute_my_points() from public;
grant execute on function public.recompute_my_points() to authenticated;

revoke update (points) on public.profiles from authenticated;

-- Narrow, opted-in-only leaderboard view — same security_invoker=false pattern as
-- practice_questions above: exposes ONLY display_name + points for opted-in
-- students, never the raw profiles row (role/comp_access/streak_last etc. stay hidden).
create or replace view public.leaderboard
with (security_invoker = false) as
select user_id, display_name, points
from public.profiles
where leaderboard_opt_in = true
order by points desc;

revoke all on public.leaderboard from public;
grant select on public.leaderboard to authenticated;


-- ============================================================================
-- site_content — published lesson content (BACKEND-SETUP.md Step 2). Created
-- here too, not just in that doc, so THIS file is fully self-contained for a
-- brand-new project ("skip Step 2, run the whole of migrations.sql instead").
-- Public anon read (row-level security still makes writes teacher-only, via
-- the policy below).
-- ============================================================================
create table if not exists public.site_content (
  id         int primary key,
  data       jsonb not null,
  updated_at timestamptz default now()
);
alter table public.site_content enable row level security;
drop policy if exists "public read" on public.site_content;
create policy "public read" on public.site_content for select using (true);

-- ============================================================================
-- SECURITY FIX — Teacher Editor saves no longer use the service_role key.
--
-- Previously, saveRemoteContent() and storageUpload() (index.html) sent the
-- service_role key directly from the teacher's browser as a request header —
-- a full-access, RLS-bypassing key sitting in localStorage and visible in the
-- Network tab. It was never committed to the repo (no .env exists here), but
-- the app was built to accept and use it at runtime from client-side code,
-- which is the actual risk: anyone with DevTools access to that browser could
-- read it out of localStorage and use it directly against the database.
--
-- Fix: site_content writes and videos-bucket uploads now go through the
-- teacher's own signed-in Supabase Auth session (the SAME sbClient already
-- used everywhere else in this app), gated by the SAME is_teacher() function
-- already backing the Teacher Dashboard reads and the Q&A/comp-access writes.
-- No service_role key is ever used by, or present in, this app's client code
-- from this point on. (The separate question-generation service is a
-- different repo and legitimately uses the service key server-side — not
-- affected by this.)
-- ============================================================================
drop policy if exists "teacher writes site_content" on public.site_content;
create policy "teacher writes site_content" on public.site_content
  for all using (public.is_teacher()) with check (public.is_teacher());

-- Storage: the `videos` bucket (BACKEND-SETUP.md step 6) needs the same
-- teacher-only write policy for uploads. Public read is unchanged (the
-- bucket is already marked Public in Supabase Storage settings).
drop policy if exists "teacher writes videos bucket" on storage.objects;
create policy "teacher writes videos bucket" on storage.objects
  for all using (bucket_id = 'videos' and public.is_teacher())
  with check (bucket_id = 'videos' and public.is_teacher());


-- ============================================================================
-- F39 — Study Planner. Sessions the student schedules for themselves (Learn/
-- Practice/Revise/Mock Exam), own-row RLS, same shape as every other per-
-- student table above (progress, quiz_results, served_questions). No
-- study_session_events table (per DEVELOPMENT-PLAN's own data-model note it
-- was only ever an optimisation to avoid re-deriving from quiz_results on
-- every page load) — at this scale, querying quiz_results directly on page
-- load is simpler and completely sufficient; nothing in F39's AC depends on
-- that table existing.
-- ============================================================================
create table if not exists public.study_sessions (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  course_id     text not null default 'gcse-edexcel-foundation',
  lesson_id     text,                          -- nullable: a session can be topic-only, not lesson-specific
  activity_type text not null check (activity_type in ('learn','practice','revise','mock_exam')),
  scheduled_at  timestamptz not null,
  duration_min  int not null default 30,
  completed_at  timestamptz,
  created_at    timestamptz default now()
);
create index if not exists study_sessions_user_idx on public.study_sessions (user_id, scheduled_at);
alter table public.study_sessions enable row level security;
drop policy if exists "own study_sessions" on public.study_sessions;
create policy "own study_sessions" on public.study_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
