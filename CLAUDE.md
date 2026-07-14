# CLAUDE.md — MasterMaths Learning Platform

Project context for Claude Code. Read this fully before making changes.
The feature roadmap lives in `DEVELOPMENT-PLAN.md` (MoSCoW, F1–F14, Phases 0–4) —
this file tells you how to build it without breaking what exists.

## What this is

A GCSE Maths learning platform for a one-man tutoring business (MasterMaths Tutoring).
Students work through lessons: video + notes → quiz (80% pass) → printable worksheet →
question generator. A built-in Teacher Editor (`#/admin`) lets the tutor (Ryan, non-technical)
edit all content and save it to a shared Supabase backend.

## Architecture — do not change these fundamentals

- **`index.html`** — the ENTIRE app: CSS + HTML + vanilla JS in one file (~1,700 lines).
  No framework, no build step, no npm. This is deliberate: deployment is "upload one file".
  Keep it that way through Phases 0–2. Only propose splitting files if/when Phase 3–4 land.
- **`mm-content.js`** — default lesson content (`window.MM_CONTENT = {WEEKS, LESSONS}`).
  Overridden at runtime by cloud content from Supabase when configured.
- **Hosting:** GitHub Pages (static). The site is also embedded in a Wix page via iframe
  (Website-address embed). Everything must work both standalone and inside that iframe.
- **Backend:** Supabase only (see `BACKEND-SETUP.md`).
  - `site_content` table row id=1: published content JSON. Public anon key = read-only (RLS).
  - Teacher writes currently use the service_role key pasted into the editor and held in
    the teacher's localStorage. NEVER hardcode or commit any service_role key.
  - Storage bucket `videos` (public read) for uploaded videos/images.
- **Routing:** hash-based (`#/1a`, `#/admin`). Add new routes the same way (`#/login`, `#/teacher`).
- **Question generator:** currently a local per-lesson bank (`genBank`). A FastAPI RAG/AI
  service will replace it later — keep the swap point (`pickGeneratedQuestion`) isolated.

## Hard rules

1. **Never break the Teacher Editor or existing content.** Any content-schema change must
   be backward-compatible: old `mm-content.js` / cloud JSON without the new fields must
   still load (default missing fields in code, don't require them).
2. **Progressive enhancement over hard dependency.** If Supabase is unreachable or
   `BACKEND.url` is blank, the app must still run (localStorage fallback already exists —
   preserve it for progress and content).
3. **No secrets in the repo.** Anon key in `index.html` is fine (read-only by RLS).
   service_role key: only ever entered by the teacher at runtime.
4. **Data minimisation (students are minors, UK GDPR / ICO Children's Code).** Accounts =
   email only. No names, no DOB, no analytics trackers. Provide account+data deletion.
5. **Keep the visual language:** white background, green `#2e7d32`/`#146c43` accent,
   navy `#14263c`, existing card/chip styles. Reuse existing CSS classes before adding new ones.
6. **Test before committing.** Use Playwright (or careful manual checks) covering: lesson
   navigation, quiz pass/fail, Teacher Editor round-trip (edit → save → reload), and the
   new feature's acceptance criteria from DEVELOPMENT-PLAN.md. The app must show zero
   console errors on load.
7. **Commit per feature** (`F4: mastery ratings`), not one mega-commit. Update the Status
   column in DEVELOPMENT-PLAN.md in the same commit (☐ → ✅).

## Working assumptions (Ryan's D1–D6 are unanswered — build these as defaults, behind flags where noted)

- D1: lesson **1a is free** without an account; everything else requires sign-in (flag: `settings.free_lessons = ['1a']`).
- D2: unlock rule = the existing four steps (video **opened**, quiz ≥ pass mark, worksheet
  downloaded, ≥1 generated question). Watch-percentage NOT required.
- D6: mastery thresholds 80/50; pass mark stays 80. Make thresholds content-configurable.
- Sequential unlocking ships **ON** by default but toggleable in the Teacher Editor.

## Phase 0 — build first (no backend changes)

**F4 Mastery ratings.** On the quiz result screen add a rating: ≥80% "🟢 Confident",
50–79% "🟡 Needs Practice", <50% "🔴 Review Lesson". Red links back to the notes/video
section; amber offers retry; green celebrates. Store latest+best in the existing progress
object. Thresholds read from content with defaults.

**F6 Section time estimates.** Add optional `time` per section to the lesson schema with
defaults: learn "~15 minutes", quiz "~10 minutes", worksheet "~25 minutes", generator
"Unlimited practice". Render as a small chip on each section card; editable in the
Teacher Editor Basics panel. Back-compatible (missing = defaults).

**F3 Sequential unlocking.** Enforce `requireSequential` (currently a dead flag): sidebar
lessons beyond the first incomplete lesson render locked (grey + 🔒, same style as the
locked weeks); clicking shows a toast naming what's left; deep links to locked lessons
redirect to the furthest unlocked lesson. Toggle lives in the Teacher Editor and persists
in cloud content (`SETTINGS`-equivalent stored alongside content).

## Phase 1 — accounts (read DEVELOPMENT-PLAN.md F1/F2/F5 first)

Supabase Auth, email OTP (`signInWithOtp` with `shouldCreateUser: true`), new `#/login`
route. Then progress moves to a `progress` table (per-user rows, RLS), localStorage
becomes cache+offline queue with completed-anywhere-wins merge, and a "Continue where
you left off" banner uses a `last_location` value updated on every step/section change.
Remove the Wix postMessage bridge code once cloud progress is verified working inside
the Wix embed.

SQL to run in Supabase (also keep a copy in `supabase/migrations.sql` in the repo):

```sql
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student','teacher','parent')),
  created_at timestamptz default now()
);
create table if not exists public.progress (
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id text not null,
  steps jsonb not null default '{}',
  quiz_state jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, lesson_id)
);
create table if not exists public.events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  lesson_id text,
  meta jsonb,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.events enable row level security;
create policy "own profile" on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own progress" on public.progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own events" on public.events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- teacher read-all comes with F10; add via a security-definer function or a role check policy then.
```

Use `@supabase/supabase-js` via CDN `<script>` tag (esm.sh or jsdelivr UMD) — remember:
no build step.

## Phase 2+ 

F11 (quiz_results table + per-question topic tags) before F7/F8/F9; F10 teacher
dashboard after. Full specs, schema and acceptance criteria are in DEVELOPMENT-PLAN.md —
follow its phase order and don't start a phase before the previous one's acceptance
criteria pass.

## Verify checklist (run after every feature)

- [ ] App loads with zero console errors, standalone AND with `?bg=transparent` in an iframe
- [ ] Old content (current `mm-content.js`) still loads unmodified
- [ ] Teacher Editor: open → edit → 💾 save → reload → edit persists
- [ ] Quiz: fail path (<80) and pass path both behave; progress % updates
- [ ] Feature's own acceptance criteria from DEVELOPMENT-PLAN.md all pass
- [ ] DEVELOPMENT-PLAN.md status updated; commit message references the F-number
