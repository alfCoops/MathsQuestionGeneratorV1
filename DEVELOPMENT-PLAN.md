# MasterMaths Platform — Development Plan v4 (MoSCoW)

Last updated: 1 September 2026 · Owner: Alfie · Product owner: Ryan
v4 folds in the rest of Ryan's running update doc (dated 31-07 at the top, but the
bulk of new material is appended undated after a "7th August" marker): F35 Prior
Knowledge Checker, F36 student avatars, F37 Lesson Overview Page redesign, F38
(rewrites F20b) From Method to Meaning as an interactive mountain journey incl. a
live AI audio tutor, F39 Study Planner, F40 Topic Resources. The §1–§22 "Adaptive
Diagnostic Quiz" and equation-editor/import material in the same doc is **not**
new — it's the source spec v3 already folded in as F19/F33/F34; see "What changed
in v4" below for the exact diff instead of re-reading the doc.
v3 folds in Ryan's 31-07 authoring & adaptive-quiz specification (F19 rewritten, F33/F34
added, F12 split for the pilot) and records the exam-paper-import ruling.
v2.3 folds in Ryan's multi-board/qualification outline and the Edexcel F+H specs. v2.2 adds F32 (spec-grounded generation service — the RAG backbone for F19/F12 and the §4
authoring pipeline). v2.1 records Ryan's D1–D6 answers, folds his 15-07-26 improvements into the remaining
phases as F26–F31, and restructures Phases 2b→5 accordingly. Phase 0, 1 and 2a build
notes/deviations are preserved from v2. Status: ☐ not started · ◐ in progress · ✅ done · ⏸ parked · ✖ won't

## What changed in v4 (Ryan's running update doc, 7-Aug section onward)

Diffed Ryan's PDF against v3 line by line. §§1–22 and the equation-editor/import
material at the top (pages 1–23 of his doc) restate the 31-07 spec **already
shipped into this plan as F19/F33/F34 in v3** — no new scope there, including the
"chillies instead of easy/medium/hard" difficulty-label line, folded into F19
below. Everything from the **7th August** marker onward is new and wasn't tracked:

- **F35 (new): Prior Knowledge Checker.** A short (~5 min) pre-lesson diagnostic
  quiz on prerequisite skills (not the lesson's own objectives), sat *before*
  "Watch Lesson & Read Notes", surfaced as an unnumbered purple-accented card
  above the main 4-step tracker. Results should drive the secure/needs-review
  ticks already shown in the existing "Prior Knowledge Checklist" panel (which
  today is a static authored list — this makes it live). Reuses the existing
  quiz engine and content schema; needs a second per-lesson question set
  (prerequisite-skill items) authored against the Foundation spec's knowledge
  progression.
- **F36 (new): Student avatars.** Ryan's mockups assume students design a
  personal avatar during onboarding and see it throughout the platform (lesson
  completion state, the From Method to Meaning mountain climber). **Nothing like
  this exists in the codebase today** (confirmed — zero references). This is a
  genuine new subsystem and a hard dependency of F37's completion state and all
  of F38, not a styling tweak.
- **F37 (new): Lesson Overview Page redesign.** Reorganises the existing lesson
  dashboard: keep the numbered 1→2→3→4→★ progress tracker exactly as shipped,
  add the F35 card above it, and — the one component genuinely new-in-kind —
  merge the three existing right-column panels (Prior Knowledge Checklist,
  Keywords, Common Misconceptions) into one tabbed "Lesson Toolkit" card. All
  three panels already exist as separate `rc*` sections rendering the same
  per-lesson content fields (`prior`, `keywords`, `misconceptions`) — this is a
  UI/layout change over existing data, not a new schema, except for the
  secure/needs-review state which depends on F35 results.
- **F38 (new — rewrites F20b): "From Method to Meaning" as an interactive
  mountain journey.** F20b ("Interactive From Method to Meaning worksheets",
  Could/L/Phase 4) already anticipated turning the printable worksheet
  interactive; this is now a full, opinionated spec for it and replaces F20b's
  placeholder. Keeps the existing Clarify/Justify/Challenge/Generalise question
  content verbatim (`worksheet:[{name,grade,g3,qs}]` — unchanged), but wraps it
  in: a full-screen mountain-climb UI with milestone stages, the student's F36
  avatar moving up the mountain, one-question-at-a-time presentation, a maths
  input toolbar for typed answers (this is F33's palette — do F33 first), and
  a choice between typing an explanation or **a live two-way voice conversation
  with an AI tutor** that Socratically probes the student's reasoning rather
  than marking right/wrong. The voice-tutor half is a materially new technical
  capability (real-time audio AI, not existing infra) and a materially new
  child-safety/data question (see §6) — flagged for a lite/full split below,
  same pattern as F12.
- **F39 (new): Study Planner.** A new sidebar section: a calendar (week/month)
  of study sessions the student schedules or accepts from recommendations,
  driven by their real topic accuracy (F11 data, already collected) and an
  "Add to Study Planner" hook from any lesson/topic page. Net-new: calendar UI,
  a session-scheduling data model, and a recommendation pass over existing
  quiz-results data.
- **F40 (new): Topic Resources.** A resources library (formula sheets per exam
  board, calculator-model-specific video tutorials, exam-skills guides,
  topic-contextual panel, searchable/filterable main library). Most of the
  *code* here is a resource browser over structured metadata; the actual
  **video content (calculator tutorials etc.) does not exist and is a Ryan
  production dependency**, not something this codebase can generate — flagging
  so effort isn't mis-scoped as pure engineering.
- **Onboarding/login visual reference (Canva link).** Ryan's doc points at a
  Canva design for the login/onboarding flow (which now also needs to include
  an avatar-creation step per F36). **I cannot open Canva links** — no browser/
  account access — so this can't be matched pixel-for-pixel from the doc alone;
  treat as an amendment to F1/F15's onboarding once Ryan exports screenshots or
  a style reference. Not spec'd as its own F-number below.
- **New decisions D18–D21** (below) — none of them block writing this plan, but
  F38's voice tutor and F36's avatar scope shouldn't start build without D18/D19
  answered given the child-data angle.

## What changed in v3 (31-07)

- **F19 rewritten to Ryan's full adaptive-quiz spec** (his 31-07 doc): misconception-ID'd
  distractors with per-misconception feedback, unlimited scaffolding ladder (levels 0–5+,
  each scaffold a more-guided variant targeting the SAME misconception), Duolingo-style
  review section counted in the score, fresh quiz on every retake, persistent
  misconceptions carried into future topics until secure, per-learning-objective mastery
  (Not Started / Learning / Developing / Mastered), configurable weighted scoring, energy
  meter, question-selection priority logic, modular engine components, config-file-driven
  constants. First milestone R1 = a working prototype on ONE topic (order of operations —
  maps to N3/BIDMAS content already in the bank). Ryan's "learning objectives" = our spec
  refs; his misconception IDs = our misconception tags + a new feedback field; his §7
  validation = validators 1–5 (already built). Genuinely new generation capability
  needed: scaffold-variant generation (scaffold_level + misconception_id as request
  params) — a p6+ prompt contract in the generator service.
- **F33 (new): mathematical equation editor** — KaTeX rendering + LaTeX input + symbol
  palette + live preview, in the Teacher Editor and all student/print surfaces; the
  generator's output format joins in. Do BEFORE heavy algebra authoring.
- **F34 (new): question import** — Ryan uploads HIS OWN material (Word/PDF/images/scans)
  → extracted into editable components → review screen → similarity gate → review queue.
  **Ruling recorded: existing exam papers are NOT an import source.** Copyright protects
  the questions themselves, not just branding — reformatting a lifted question does not
  launder it. The AI generator is the legitimate route to "Edexcel-style questions on
  topic X". Every import passes the similarity gate and lands as pending like all content.
- **F12 split** (pilot decision): **F12-lite** ships PRE-pilot — practice section serves
  approved bank items (sanitised student read-path, no-repeat tracking, self-report
  buttons, genBank fallback; NO adaptivity, NO quiz changes). **F12-full** (staircase,
  working-at grade) stays post-pilot. Generator gains the free-response `kind:"generator"`
  prompt contract (p5) so the practice bank is exam-style, not MCQ.
- **New decisions D16–D17** (below). D8 largely superseded by Ryan's own spec (2-fail/
  2-pass rules now his §3/§19; Foundation cap stands).

## What changed in v3 (Ryan's 31-07 document)

- **F19 rewritten as the Adaptive Diagnostic Quiz v2** to Ryan's full specification:
  unlimited misconception-targeted scaffolding (levels 0–5+), per-objective mastery
  (4 tiers, weighted scoring), persistent misconceptions across topics, end-of-quiz
  review section counting toward the 80% pass, fresh retake generation, energy meter,
  modular engine. First milestone = his §22 prototype (order of operations / N3).
  Now the largest single build in the plan (XL+); remains Phase 4 post-pilot — the
  pilot's real misconception data feeds this design, and every reviewed question is
  already stocking it.
- **F33 Mathematical equation editor** (KaTeX render, LaTeX input + symbol palette,
  live preview, consistent across student/editor/print/generator output) — early
  Phase 4, before heavy algebra authoring.
- **F34 Question import** (PDF/Word/image → editable components → review screen) —
  scoped to **content Ryan owns**. RULING (recorded): existing exam papers are NOT an
  import source — the questions themselves are Pearson's copyright and reformatting
  does not launder them; the AI generator is the legitimate route to "Edexcel-style
  questions on demand". All imports pass the similarity gate and land in the review
  queue like AI drafts.
- **F12 split:** F12-lite (approved-bank serving in the practice section, sanitised
  student read-path, self-report, genBank fallback) is **pre-pilot and in flight**;
  F12-full (adaptive staircase) stays post-pilot behind D8.
- **Generator follow-ons (F32-x): ✅ ALL SHIPPED** (generator repo, milestone M5, through a
  pedagogy review gate 2026-08-04/05). kind:"generator" free-response contract (**p5**) ·
  no-diagram rule (p5) · LaTeX markup contract (p5, the cross-repo pair to **F33**) ·
  scaffold-variant generation, `scaffold_level` + `target_misconception` + `parent_item`
  (**p6**) · per-distractor `misconception_feedback` + `correct_feedback` (p6) · cumulative
  levels, structural L1 simplification, bare options (**p7**) · level-gated contract making
  the ladder monotone increasing (**p8**) · renderable blank markers (**p9** — `\text{___}`
  is unparseable by KaTeX and was showing a red error where every L3/L4 blank should be).
  399 tests green. **F19 is no longer blocked on generation capability.**
  The three Teacher-Editor prerequisites in GENERATOR-SERVICE.md §9 are now ✅ **shipped
  here** (F10b): `payload.trace.flags` rendered one line each with numeric/similarity
  verdict badges · scaffold parts as labelled fields (`renderScaffoldParts` — F19's
  ScaffoldManager must REUSE it) · review tab grouped by `variant_group` × `scaffold_level`
  (`groupReviewItems`) so a rung is read next to the rung below. Still open for stocking:
  `edited_diff` shape with Ryan, Render deploy, and regenerating the review ladder under p9.
- **New decisions D16/D17** (below); D8 subsumed into F19 v2 sign-off.

## What changed in v2.3

- **Ryan's dashboard outline received** (GCSE|A-Level → Edexcel|OCR|AQA|WJEC → tier/strand):
  confirms F15's model, with one amendment — tier-3 is a generic level with a per-qualification
  label (GCSE: Higher|Foundation; A-Level: Pure|Stats|Mechanics). Verify current code didn't
  hardcode "tier" semantics.
- **Edexcel Foundation + Higher specs delivered** → F32's Tier-1 corpus is in hand before the
  service is built. F32's corpus schema is now REQUIRED to be board- and qualification-keyed
  (spec_ref alone is ambiguous across boards). OCR/AQA/WJEC GCSE + four A-Level spec sources
  catalogued for later loading. (Note: underlying GCSE subject content is DfE/OGL — grounding
  on spec statements is the low-risk corpus tier; papers remain Tier-2/analysis-only.)
- **Multi-board strategy named as D15** (rollout order + shared-core vs per-board content).
  Position until decided: full tile grid visible (greyed), F32 board-aware, content stays
  Edexcel Foundation only until the pilot passes.
- **T4/T5 added** (generator exam-style font with SEND override; right column collapses when
  the generator opens).

## What changed in v2.2

- **New: F32 spec-grounded generation service** — the FastAPI/RAG backend that F19, F12 and
  the §4 authoring pipeline were implicitly waiting on, now a first-class feature with its
  own spec, copyright guardrails and phase slot (build during Phase 2c so the review queue
  has approved stock before F19's engine lands).

## What changed in v2.1

- **Ryan answered D1–D6** (recorded in §7): Week 1 is the free taster · video-opened is
  enough · AI-draft + Ryan-approve confirmed · badges signed off **plus streak reminder
  emails (new scope → F30)** · £19.99/month with a comp-access rule for weekly one-to-one
  students (amends F14) · 80/50 thresholds confirmed.
- **Ryan's 15-07-26 list → F26–F31**: rich-text authoring (no more HTML typing), worksheet
  mark schemes, SEND round 2 (overlays, yellow tint, OpenDyslexic option), content extras
  (weekly quote, calculator icon, sequential video reveal), streak emails, standing 1-to-1 CTA.
- **Remaining phases restructured**: a new Phase 2b (Authoring & SEND round 2) goes BEFORE
  the learning-data phase — Ryan is actively authoring content now, and every week of raw-HTML
  authoring is content that may need reworking later.
- **Immediate tasks T1–T3** (this week, before/alongside Phase 2b) — see §0.

---

## 0. Immediate tasks (this week)

| # | Task | Why now | Status |
|---|---|---|---|
| T1 | Free taster → **all of Week 1** (1a–1d browsable logged-out) | Ryan's D1; currently 1a only | ✅ |
| T2 | Rename "Quiz" → **"Diagnostic Quiz"** everywhere (section card, progress step label, results copy) | Ryan's ask; trivial; do before screenshots/marketing | ✅ |
| T3 | **Configure custom SMTP (Resend)** in Supabase, then switch on email verification + password reset (closes F1's deferral) | Launch blocker from Phase 1; also a prerequisite for F30 streak emails | ◐ **APP CODE SHIPPED 2026-09-03** — real "Forgot your password?" flow (`resetPasswordForEmail`/`updateUser`, new `#/reset-password` page) replacing the old "email Ryan" placeholder. Also fixed a real bug found while building this: `route()` runs synchronously before `authInit()`'s async session restore, so a confirmation/recovery email's `#access_token=...` redirect could get mangled by the legacy-lesson-id fallback and lose the token before Supabase read it — likely a contributor to the earlier "Safari can't connect to server" issue, separate from the Site URL misconfiguration. `parseHash()` now recognises and protects any `access_token=` hash. **Still needs Ryan's dashboard steps**: custom SMTP via Resend (Authentication → SMTP settings) and Site URL corrected to the real domain (Authentication → URL Configuration) — until then Supabase's default email sender and the stale `localhost` redirect are still in effect. |
| T4 | Generator question card gets an **exam-paper style** (free Gill-Sans-family lookalike, ruled answer feel). **Student SEND font prefs override it** — accessibility beats authenticity; flag that to Ryan, don't silently decide | Ryan's 17-07 ask; small CSS | ✅ |
| T5 | Opening the Question Generator **collapses the right info column** (mirrors the watch-video behaviour; consistent with focus ethos) | Ryan's 17-07 ask; small | ✅ |
| T6 | **Verify F15 tier-3 is generic** (label per qualification: "Tier" for GCSE, "Strand" for A-Level with Pure/Stats/Mechanics tiles) and the dashboard shows Ryan's full tile grid greyed | Cheap now, migration later | ✅ |

---

## 1. Full feature list

Effort: S < ½ day · M 1–2 days · L 3–5 days · XL 1–2 weeks

| # | Feature | MoSCoW | Effort | Depends on | Phase | Status |
|---|---|---|---|---|---|---|
| F3 | Sequential lesson unlocking | Must | S | — | 0 | ✅ |
| F4 | Quiz mastery ratings 🟢🟡🔴 | Must | S | — | 0 | ✅ |
| F6 | Estimated time per section | Must | S | — | 0 | ✅ |
| F1 | Student accounts (email + password; verification/reset pending T3) | Must | M–L | — | 1 | ✅ |
| F15 | Course hierarchy & dashboard | Must | M | with F1 | 1 | ✅ |
| F2 | Cloud progress sync (course + lesson keyed) | Must | M | F1, F15 | 1 | ✅ |
| F5 | "Continue where you left off" | Must | S–M | F2 | 1 | ✅ |
| F16 | SEND quick wins (panel: size/spacing/font/themes/timers/focus/one-at-a-time) | Must | M | F1 | 2a | ✅ |
| F17 | Text-to-speech | Should | S–M | F16 | 2a | ✅ |
| F25 | Theme & maths-symbol backdrop | Should | S | F16 | 2a | ✅ |
| F20a | Worksheet rename → "From Method to Meaning" | Should | S | — | 2a | ✅ |
| F26 | **Rich-text authoring** in Teacher Editor: toolbar (size, bold, underline, colour), no raw HTML; image insert with placement + labels in Key Notes | **Must** | M–L | — | **2b** | ✅ |
| F28 | **SEND round 2**: coloured-overlay button (range of tints incl. yellow), yellow page tint option, OpenDyslexic added as a font choice | Should | S–M | F16 | **2b** | ✅ |
| F29 | **Content extras**: motivational quote per week · calculator/non-calculator icon per lesson · sequential video reveal (video n+1 appears after opening video n) | Should | S–M | — | **2b** | ✅ |
| F27 | **Worksheet mark schemes**: per-section answers/mark scheme authored in editor; student-side reveal after attempt + printable answers page | Should | S–M | F26 helps | **2b** | ✅ |
| F31 | **Standing 1-to-1 CTA**: persistent "Book one-to-one tutoring →" button (dashboard + lesson header) to the Wix booking page | Should | S | — | **2b** | ✅ |
| F11 | Per-question results + topic + misconception tags | Should | M | F2 | 2c | ✅ |
| F7 | Resume at exact point | Should | M | F2 | 2c | ✅ |
| F8 | Quick Help — staged hints (+ pictures) | Should | M | F26, authoring | 2c | ✅ |
| F9 | Badges & streaks (in-app; emails split to F30) | Should | M | F2 | 2c | ✅ |
| F10 | Teacher dashboard (+ struggling flags, **+ comp-access toggle per student**) | Should | L | F11 | 3 | ✅ |
| F21 | End-of-unit summary + tutoring signpost | Should | M | F11 | 3 | ✅ |
| F30 | **Streak reminder emails**: opt-in at signup, one-click unsubscribe, daily cron | Could | M | F9, T3 (SMTP) | 3 | ◐ **CODE SHIPPED 2026-09-03, NOT yet live** — T3 resolved without a separate backend: Supabase sends the emails itself via `pg_net` calling Resend's API directly, scheduled with `pg_cron` (`send_streak_reminders()`, `supabase/migrations.sql`). New "✉️ Email reminders" opt-in checkbox in Display & reading settings (default OFF, mirrors the F24 leaderboard opt-in exactly); Teacher Insights already read/counted `streak_emails_opt_in` before this — that AC was quietly already satisfied. Unsubscribe is a public RPC + `#/unsubscribe` route, working with zero sign-in (a deliberate, sole exception to this app's "authenticated only" RPC pattern, since an email link has to work wherever it's opened). Caps enforced via a `streak_reminder_log` table + a `streak_reminder_ignored` counter (stops after 2 reminders in a row the student didn't act on, resets when a fresh streak starts). **Remaining before this is actually live**: Ryan enables the `pg_net`/`pg_cron` extensions and stores his Resend API key in Supabase Vault (one-time SQL, never touches app code); until then `send_streak_reminders()` bails out silently (progressive enhancement, same posture as an unconfigured `BACKEND.url`). Known imprecision: the cron fires at a fixed 17:00 UTC, so it's 5pm UK outside BST and 6pm during it — accepted for a soft nudge, not worth DST handling. |
| F32 | **Spec-grounded generation service** (FastAPI): Edexcel-spec retrieval, style guide, validators, similarity check, review-queue output. **+M5: free-response contract, no-diagram, LaTeX markup, scaffold-variant generation (p5–p8)** | **Should** | L | FastAPI hosting; feeds F19/F12/F8 | **2c–3** | ✅ |
| F19 | Quiz engine v2 (misconception distractors, variant pools, grade stepping) | Should | L (+authoring) | F11, **F32** | 4 | ☐ |
| F12-lite | Practice section serves approved AI questions (sanitised student read-path, no-repeat, self-report, genBank fallback; NO adaptivity) | Should | M | F32, F10b | **pre-pilot** | ✅ **SHIPPED 2026-08-08** (browser-verified against the live bank: all 5 approved items served before any repeat, then genBank fallback; LaTeX rendered; self-report shown; signed-in no-repeat persists via served_questions). Matching is primary-spec-ref with bare-ref normalisation. NOTE the cloud-content trap this exposed — every cloud lesson had specRefs:null (published pre-2b), now defaulted from the mm-content seed at load; Ryan's next 💾 save heals the cloud copy. OLD: `practice_questions` verified live 2026-08-08: it contains exactly the 5 approved `kind:"generator"` items, no approved MCQ/ladder rung appears (by design), and it leaks no trace/options/scaffold/similarity. But **nothing in `index.html` queries it** — the practice section still serves the local `genBank`, so an approved item does NOT yet reach a student. That client read + no-repeat + self-report is the remaining work. |
| F12-full | Adaptive staircase (misconception scaffolding, working-at grade, per-objective mastery) | Could | XL | F19, F11 | post-pilot | ☐ |
| F20b | ~~Interactive "From Method to Meaning" worksheets~~ — superseded by **F38**'s full spec | Could | L | F16, F26 | 4 | ✖ superseded |
| F18 | Digital maths toolkit (number line, hundred square, ×-grid, fraction bars, counters) | Could | XL | — | 5 | ◐ **PARTIAL 2026-09-01** — Number line, Hundred square, Counters built (click/tap-based, not drag — no drag pattern existed anywhere in the codebase; simpler and more robust cross-device), embedded as a 4th "🧮 Tools" tab in the existing Lesson Toolkit card (F37), tagged per-lesson via `L.toolkit`. Authored on 1a (all 3) and 1b (number line + hundred square). Fraction bars and ×-grid deliberately deferred — no fractions/algebra lesson content exists yet to embed them into. Not browser-verified. |
| F14 | Subscriptions: £19.99/mo, Week 1 free, **manual comp-access for weekly 1-to-1 students**, on/off toggle | Could | XL | F1, F10 (comp UI) | 5 | ☐ |
| F13 | Parent dashboard (Sherpa-style, view-only) | Could | L | F10 | 5 | ◐ **LIVE 2026-09-03** — Ryan recovered from the Supabase-access block by standing up a fresh project under his own account (`migrations.sql` applied there, including a fix for a table it referenced but never created — see `fix: migrations.sql never actually created site_content`). Student-initiated linking (invite code, redeemed at `#/parent`), high-level content only (completion, quiz pass/fail, streak, last active). **Not yet end-to-end verified**: Supabase's free-tier signup rate limit blocked creating the second test account needed to actually redeem a code — teacher-side is confirmed working (Teacher Editor round-trips), student/parent-side linking flow is still to be checked once the rate limit clears. |
| F23 | Weekly Q&A (stream + upvote queue + archive) | Could | M–L | F1 | 5 | ◐ **LIVE 2026-09-03** — same new-project migration as F13/F24. D12 answered: Zoom, weekly, fixed Thursday 6pm UK slot. `#/qanda` route: upcoming session, question submission, upvoting, teacher-marked "answered," archive. **Not yet end-to-end verified** (same rate-limit blocker as F13 — a session needs creating as teacher and then checking from a genuine second/student account). |
| F24 | Points + leaderboard (opt-in, display names) | Could | M | F1, F9 | 5 | ◐ **LIVE 2026-09-03** — same new-project migration as F13/F23. D9: opt-in, default OFF; points computed server-side via a SECURITY DEFINER RPC, `profiles.points` locked against direct client writes. **Not yet end-to-end verified** (same rate-limit blocker). **Known follow-up, still not fixed:** `streak_current` is still directly client-writable and feeds the points formula. **Also found and fixed during this session's live testing:** `onSignedIn()` only ever called `loadProfile()` (a SELECT) — an account that signed up while still unconfirmed (RLS silently blocks the profile-row upsert with no session yet) stayed profile-less forever, invisibly breaking every profile-gated feature (this row's leaderboard opt-in included) with no error shown. Fixed: `onSignedIn()` now calls `ensureProfile()` (upsert, safe no-op if the row exists), self-healing on every sign-in from now on. |
| F35 | **Prior Knowledge Checker** — pre-lesson prerequisite diagnostic, drives live secure/needs-review state | Should | M–L | quiz engine (reused) | **2d** | ✅ **SHIPPED 2026-09-01, updated 2026-09-03** — Ryan-verified live on 1a; questions authored for 1a + 1b (1c/1d/Week 2+ have no content yet). 2026-09-03: added a "🔁 Try Again" full-checker retry from the results view (mirrors the Diagnostic Quiz's own Retry pattern), and every attempt now reshuffles each question's option order (`shufflePkcOptions()`) so a retry isn't just re-showing the same options in the same order — never mutates the shared authored content, only a per-attempt copy. |
| F36 | **Student avatars** — preset emoji picker in Display & reading settings, shown in sidebar | Must (for F37/F38) | M | prefs (reused, no migration) | **2d** | ✅ **SHIPPED 2026-09-01** — Ryan-verified live. Note: F38's mountain badge now uses a separate illustrated character (`assets/avatar-boy.png`, Ryan-generated) instead of this emoji picker for that one spot only — everywhere else (nav, summit, etc.) still reads the emoji chosen here. |
| F37 | **Lesson Overview Page redesign** — F35 card, unified tabbed Lesson Toolkit, unchanged progress tracker | Should | M–L | F35, F36 | **2d** | ✅ **SHIPPED 2026-09-01, extended 2026-09-03** — Ryan sent the real mockup 09-03 and most of the visual foundation already matched it (circular icon badges, outlined buttons, PKC ✓/⚠ list). Added: `#secWs` is now expandable with an embedded mini progress stepper + "Stage: X" pill; `wsBtn` gained a third "〜 In progress" visual state; the Prior Knowledge tab gained an "X of Y secure" counter+bar and a "Review results" link; a new "Lesson Complete!" banner (avatar + flag, 4-row status summary, next-lesson CTA) replaces the plain footer once a lesson is fully complete. NOT browser-verified — same disclosed limitation as everything this session (no Node/Playwright available). |
| F38 | **From Method to Meaning v2** — mountain-journey UI, avatar climber, typed or live-voice reasoning (supersedes F20b) | Could | XL+ | F33, F36; voice half needs D18/D19 | 4 | ◐ **v3 SHIPPED 2026-09-03, NOT browser-verified** — full rebuild against Ryan's real mockups (not just his written spec): the mountain scene now uses his own ChatGPT-generated illustrated background (`assets/mountain.jpg`) with the "Your Journey" cards as a translucent overlay panel directly on it, dashed leader-lines (measured via `getBoundingClientRect`, not hardcoded) connecting each card to a checkpoint on the trail, and his illustrated avatar character in the mountain badge specifically (the F36 emoji stays everywhere else). The question column gained a top progress stepper, reordered/restyled choice cards, and a permanent "Audio Chat with your Tutor" panel next to the writing box — built to match the mockup's visual richness but kept unmistakably marked "Coming soon" with an inert mic button, since Talk it out still isn't real (blocked on D18/D19 + no live audio integration). Answer flow calls a real AI grading endpoint (`mmGrade()`, reusing F32's `genPOST`/token-refresh plumbing) when one exists; `/v1/grade` itself isn't built yet (separate generator-service repo; contract in `GRADE-ENDPOINT-SPEC.md`), so it still degrades to "any non-empty answer advances" today. F38-full (live voice tutor) still not started — blocked on D18/D19 as before. |
| F39 | **Study Planner** — calendar, session scheduling, accuracy-driven recommendations, "Add to Study Planner" from lessons | Could | XL | F11 | 5 | ◐ **SHIPPED 2026-09-03, NOT browser-verified** — new `#/planner` page (summary strip, agenda list, "+ Add Study Session" modal, "Add to Study Planner" on every lesson page), `study_sessions` table (own-row RLS, same shape as `progress`/`quiz_results`). Recommendations read **real** `quiz_results` data via `recordQuizResults()` (F11, already writing topic/misconception/correct per question) — genuinely the first student-facing reader of that table, nothing hardcoded. Completing a session calls the existing `noteLearningActivity()` streak hook, no new streak logic. **Deliberate scope trim**: a grouped agenda list (Today/Tomorrow/This week/Later) instead of a full month/week calendar grid — no calendar-grid pattern exists anywhere in this codebase and building one is a sub-project on its own; a real calendar view is a clean follow-up if Ryan wants it. Also skipped the `study_session_events` table from the original data-model note — it was only ever an optimisation, no AC depends on it. Each agenda item now also has a one-way "Add to Calendar" (a Google Calendar pre-filled link + a downloadable `.ics`, no account linking, nothing shared until the student clicks it). **Full two-way Google Calendar OAuth sync was requested and deliberately NOT built** — flagged to Ryan as its own decision, same footing as the D18/D19 voice-tutor gate: it needs Google app verification, raises a real consent question for a minors platform, and is an ongoing token-maintenance dependency, not a quick feature. |
| F40 | **Topic Resources** — formula sheets, calculator tutorials, exam-skills guides, searchable library | Could | L (code) + Ryan video production | F1 | 5 | ◐ **CODE SHIPPED 2026-09-03, EMPTY (no content authored yet), NOT browser-verified** — new `#/resources` page (search + type/topic filters, sectioned by Formula Sheets/Calculator Tutorials/Exam Skills), a new global `RESOURCES` array in the content payload (first non-per-lesson authored content — same publish/save path as lessons, no new Supabase table), a Teacher Editor "📚 Resources" panel to author them, and a new "Resources" tab in every lesson's Lesson Toolkit card matching on the lesson's own Strand field. Open to signed-out visitors (reference material, no student data). **Captions**: a calculator-tutorial video with no `.vtt` captions file is filtered out of both the library and the lesson panel until one's added — keeps "videos have captions" true for anything students actually see, without blocking Ryan's authoring — but this only works for directly-hosted video files; a YouTube/Vimeo embed's captions depend on the provider's own CC toggle, outside this app's control (disclosed gap, not silently glossed over). **Scope trims**: exam-skills guides are plain text, not the full F26 rich-text toolbar; formula sheets open via the browser's native PDF handling (iframe + download link), no custom viewer. Ships with an empty library — the actual formula sheets/videos are Ryan's to produce. |
| — | Student forum / community chat + reply notifications | **Won't** | — | — | — | ✖ |
| — | Trustpilot / Google reviews display | Website task (Wix) | — | — | — | → |
| — | Native app, offline mode, AI marking, school accounts | Won't (this phase) | — | — | — | ✖ |

---

## 2. Phase order (remaining)

**Now — T1, T2, T3** (§0). T3 unblocks verification, reset and later F30.

**Phase 2b — Authoring & SEND round 2 (next build phase).**
F26 rich-text editor **first** — Ryan is authoring content now, and every hand-typed-HTML
week is potential rework. Then F28 overlays/fonts, F29 content extras, F27 mark schemes,
F31 CTA. All Ryan-visible; ship as they land.

**Phase 2c — Learning data & experience.**
F11 (schema designed for F19: topic, misconception, grade band, variant group from day
one) → F7 exact-point resume → F8 staged hints (AI-drafted per D3, authored via F26's
editor) → F9 badges & streaks (in-app only; emails are F30).
**In parallel: F32** — the generation service is backend-only work (FastAPI, separate
repo/host), so it runs alongside the app-side 2c features without contention, and its
output starts filling the review queue for Ryan immediately.

**Phase 3 — Visibility & retention.**
F10 teacher dashboard (now also the home of the **comp-access toggle** per D5) → F21
end-of-unit summaries with tutoring signpost → F30 streak emails (needs F9 + T3).

**Phase 2d — Lesson Overview redesign (new, v4).** F36 avatars **first** (both F37's
completion state and F38 need a stored avatar to point at) → F35 Prior Knowledge
Checker (needs its own authored content per lesson: prerequisite-skill questions
mapped to the existing checklist items) → F37 Lesson Overview redesign, which is
mostly layout over data that already exists (Success Criteria, Keywords, Common
Misconceptions are already per-lesson fields — only the tabbed-toolkit shell and
the secure/needs-review computation from F35 are new). Slotted before Phase 3 because
it's low-risk UI work Ryan is actively asking for, and it doesn't block on F19/F32.

**Phase 3 — Visibility & retention.**
F10 teacher dashboard (now also the home of the **comp-access toggle** per D5) → F21
end-of-unit summaries with tutoring signpost → F30 streak emails (needs F9 + T3).

**Phase 4 — Advanced learning.** F19 quiz v2 (start the authoring pipeline during 2c —
see §4) · F33 equation editor (do before F38 — it supplies F38's write-it-down maths
toolbar) · F12 adaptive generator once FastAPI is live · **F38** From Method to Meaning
v2 (supersedes F20b) — build the typed-response path first, gate the live-voice-tutor
path behind D18/D19 (see §6/§7); consider an F38-lite (typed only) / F38-full (+voice)
split, same shape as F12's split, if D18/D19 stay unanswered when this phase starts.

**Phase 5 — Commercial & community.** F14 subscriptions (spec now concrete per D5) ·
F13 parent portal · F23 weekly Q&A · F24 leaderboard · **F39** Study Planner (reuses
F11's accuracy data for recommendations) · **F40** Topic Resources (code ships
independent of Ryan's video production, but the library is thin until videos land —
sequence Ryan's filming alongside the build, not after it).

---

## 3. New feature specs (F26–F31) and amendments

### F26 · Rich-text authoring — Must, Phase 2b, M–L
Replaces raw-HTML textareas in the Teacher Editor with a lightweight rich-text editor
(contenteditable toolbar or a tiny library like Quill): **bold, underline, colour, font
size**, lists, and **image insertion with drag-to-position and a caption/label field**
("Figure 1") in Key Notes so questions can reference figures. Output is sanitised HTML
stored in the same content fields — student-facing rendering unchanged, so no migration;
existing HTML content opens and edits cleanly in the new editor.
**AC:** ☐ Ryan formats a question with size/bold/underline/colour without seeing HTML
☐ image placed inline in Key Notes with a visible label, referenced from a question
☐ existing lessons open in the editor without corruption ☐ pasted content from Word is
cleaned, not dumped as junk markup ☐ output sanitised (no script/style injection).

### F27 · Worksheet mark schemes — Should, Phase 2b, S–M
Each "From Method to Meaning" section gains an authored mark-scheme block (via F26's
editor). Student side: a "Show mark scheme" reveal after they confirm they've attempted
the section, and an answers appendix on the printable version (toggle so Ryan can print
with or without answers).
**AC:** ☐ mark scheme per section, editable ☐ hidden until attempt is confirmed
☐ print supports with/without answers.

### F28 · SEND round 2 — Should, Phase 2b, S–M
Extends F16's panel: an **Overlay** button offering a range of coloured tints (yellow,
cream, blue, pink, grey — the standard visual-stress set) applied as a translucent layer;
a yellow page-background option; **OpenDyslexic added as a selectable font** alongside
Atkinson Hyperlegible.
**Default-font note (D11/Ryan 15-07):** Ryan asked for OpenDyslexic everywhere. Evidence
on OpenDyslexic is mixed and some students read it *slower*; current shipped default is
Inter with dyslexia fonts one tap away. Flagged back to Ryan as D13 — if he confirms
after that context, flipping the default is a one-line change. Don't flip silently.
**AC:** ☐ overlays apply over all content incl. images, per-user persisted ☐ OpenDyslexic
selectable and licence-checked (it's SIL OFL — bundling is fine) ☐ default follows D13.

### F29 · Content extras — Should, Phase 2b, S–M
Three small schema+UI additions, all editable in the Teacher Editor:
1. **Motivational quote per week** — shown above the week's lessons on the pathway/dashboard.
2. **Calculator icon per lesson** — Ryan picks 🧮 allowed / 🚫 non-calculator per lesson
   (Edexcel-authentic); chip shows next to grade/duration.
3. **Sequential video reveal** — within a lesson, video n+1 appears only after video n is
   opened (less on the page, per Ryan's SEND ethos; plays well with F16's one-at-a-time).
**AC:** ☐ all three editable per week/lesson ☐ back-compatible (absent fields = no quote,
no icon, all videos shown) ☐ reveal state persists via progress.

### F32 · Spec-grounded generation service — Should, Phase 2c–3, L
**v2.3 amendments:** corpus schema is board+qualification keyed (course_id → board, tier,
spec version); Edexcel 1MA1 Foundation AND Higher statements are in hand (from Ryan,
17-07) and load first; OCR/AQA/WJEC GCSE and Edexcel/AQA/OCR/WJEC A-Level spec sources
catalogued for later. Tier-validation uses the F/H delta (Higher-only statements must
never pass Foundation validation).
The FastAPI backend that makes AI-generated content *authentically Edexcel Foundation*
rather than generically maths-flavoured. Formalises §4's authoring pipeline and unblocks
F19 (quiz variants), F12 (adaptive generator) and F8 (drafted hints).

**Corpus, in two tiers with different rules:**
- *Tier 1 — retrieved into prompts:* the Edexcel 1MA1 specification (published free by
  Pearson): content references (N2, A4…), Foundation-only scope, command words, AO1–3;
  mark-scheme notation conventions (M1/A1/B1) learned from a small example set; Ryan's own
  authored content (his voice and the Clarify/Justify/Challenge/Generalise framing); the
  misconception bank — which F11 grows automatically from real wrong answers, feeding back
  into sharper distractors over time.
- *Tier 2 — analysed, never retrieved:* past papers/PMT are used only to derive a style
  guide (question length, context types, mark distribution, wording rhythm). Their text
  never enters a generation prompt (hard rule 8), and a similarity check on OUTPUTS bounces
  any near-reproduction before it reaches the review queue.

**Architecture (v1 — deliberately simple):** topic + grade band in → keyed/BM25 lookup of
spec statements + command words + style guide + relevant misconceptions (no vector DB
needed at this corpus size) → Claude generates question, misconception-tagged distractors,
staged hints and an M1/A1-style mark scheme → validators: spec ref is Foundation-legal,
marks sum, numeric answers auto-verified with sympy where possible → similarity check →
insert into `questions_review` → Ryan approves/edits/rejects in the Teacher Editor.
Ryan's edits are retained as few-shot examples so generation drifts toward what he approves.

**AC:** ☐ every generated item carries a spec reference + grade band ☐ nothing out of
Foundation scope passes validation ☐ similarity check demonstrably bounces a seeded
near-copy ☐ numeric answers verified where sympy can ☐ output lands in the review queue,
never directly in student-facing content ☐ Ryan-edit few-shots measurably used in prompts.
**Hosting note:** runs on Render (or similar) as its own service; keys server-side only;
the app talks to it via the Supabase-authenticated user, not a shared secret in the browser.

### F30 · Streak reminder emails — Could, Phase 3, M (from Ryan's D4)
Daily Supabase cron checks streaks at risk (active yesterday, not today by ~17:00 UK) and
sends a short nudge via Resend. **Compliance is the design constraint, not the cron:**
these are engagement emails to minors — opt-in checkbox at signup (default OFF), one-click
unsubscribe in every email, frequency capped (max 1/day, stop after 2 ignored), and copy
that encourages rather than pressures.
**AC:** ☐ only opted-in students ever receive one ☐ unsubscribe works from the email
itself ☐ caps enforced ☐ Ryan can see opt-in rates (F10).

### F31 · Standing 1-to-1 CTA — Should, Phase 2b, S
Persistent, understated "Book one-to-one tutoring →" button on the course dashboard and
lesson header, linking to the Wix booking page. Complements (doesn't replace) F21's
targeted signpost. Hidden in focus mode.

### Amendments
- **F14 (per D5):** price **£19.99/month**; free tier = **Week 1** (matches T1); plus a
  **comp-access flag** per student — set manually by Ryan in the teacher dashboard (F10)
  for students with a weekly recurring one-to-one booking, revoked when they stop. Stripe
  can't see his tutoring diary, so this is deliberately manual. F10 gains the toggle UI;
  F14 checks `subscription active OR comp_access OR free tier`.
- **F9 (per D4):** badge set + streak rules signed off; email reminders are **F30**, not F9.
- **F8 (per D3):** AI-drafted hints/examples with Ryan approval confirmed as the workflow.
- **F12 (per D2 ethos):** timers remain strictly opt-in.

### F35 · Prior Knowledge Checker — Should, Phase 2d, M–L
A short (~5 min) diagnostic sat before "Watch Lesson & Read Notes", testing
**prerequisite** skills (not the lesson's new content) drawn from the Foundation
spec's knowledge progression for that topic. Reuses the existing MCQ quiz engine
and rendering; needs a new per-lesson content field (prerequisite question set,
each item tagged to one existing `prior` checklist line) authored in the Teacher
Editor. Presented as an unnumbered card above the 4-step tracker (not one of the
four main steps) with its own "~5 minutes" pill and a Start/✓ Review Results
button. On completion, each `prior` checklist item shows secure (✓ green) or
needs-review (⚠ amber) instead of always-plain, and the toolkit's Prior Knowledge
tab exposes "Review results from your checker →".
**AC:** ☐ question set is prerequisite-only, verified against a lesson's actual
`prior` list, not the lesson's own objectives ☐ completes in ~5 minutes for a
representative student ☐ checklist ticks reflect real results, not static text
☐ skippable without blocking access to the lesson (it's prep, not a gate)
☐ back-compatible: a lesson with no PKC content set shows no card.

### F36 · Student avatars — Must (for F37/F38), Phase 2d, M
A small preset-avatar picker (not a full custom illustration builder — confirm
scope with Ryan, see D19) shown once during onboarding (after tier selection,
before "Start Learning") and editable later from Settings. Stored per student
profile; rendered at the Lesson Overview completion state and as the climber in
F38's mountain journey. This is genuinely new — there is no avatar concept
anywhere in the current schema or UI.
**AC:** ☐ every student has a default avatar even if they skip the picker
("Skip for now" per Ryan's onboarding mockup) ☐ avatar persists across devices
(stored server-side, not localStorage-only, per F2's sync pattern) ☐ changeable
later without re-onboarding.

### F37 · Lesson Overview Page redesign — Should, Phase 2d, M–L
Reorganises the existing lesson dashboard. **Keep the numbered 1→2→3→4→★
progress tracker exactly as shipped** — this is explicitly Ryan's most important
constraint in the spec, don't redesign it into a different visual system. Add:
the F35 card directly above step 1, outside the numbered sequence; a compact
mini stage-strip on the From Method to Meaning card once F38 ships (Clarify
3/3 → Justify 1/3 → …); and — the one real new component — merge the three
existing right-column panels (`rcSuccess`, `rcPrior`, `rcKeywords`, `rcMisc`;
today four separate always-open cards) into a tabbed "Lesson Toolkit" card
(Prior Knowledge / Keywords / ⚠ Watch Outs — Common Misconceptions relabelled
per Ryan's friendlier heading, content unchanged) so the column isn't four long
scrolling panels. Success Criteria stays its own card above the toolkit.
Completion area gains the F36 avatar; keeps its existing two-state logic
("Keep going…" vs the celebratory complete state) unchanged in behaviour, just
restyled.
**AC:** ☐ progress tracker numbering/labels unchanged ☐ existing Success
Criteria/Prior Knowledge/Keywords/Misconceptions content renders with zero data
loss inside the new toolkit tabs ☐ PKC card never counted in the 4-step tracker
☐ responsive: stacks to one column on mobile in the order specified ☐ zero
console errors, old lessons without F35/F36 data still render sensibly.

**Build note (2026-09-01):** F35/F36/F37 implemented together in `index.html` +
`mm-content.js`, no Supabase migration — both landed inside existing synced
jsonb: avatar choice in `profiles.prefs.avatarId` (reuses the F16 prefs sync
path, picker lives in the Display & reading settings modal, not a dedicated
onboarding step), PKC results in the per-lesson progress object's new `prior`
key (reuses F2's sync). Avatars are a 10-emoji preset set, not the illustrated
custom-avatar builder from Ryan's mockup (art-asset work, out of scope — see
D20). The full celebratory "Lesson Complete" panel with avatar+flag+next-
lesson CTA from Ryan's mockup was **not** built this pass — the existing
simple `#completeBtn` footer is unchanged; that's flagged as a natural
follow-up once Ryan's seen this land. **Ryan-verified live 2026-09-01**
(1a's card + toolkit tabs confirmed working in the browser). Also added since
first landing: an ✅ Approved checkbox + ↻ Clear & retry per question in the
Teacher Editor (F35 questions are manually authored, not AI-generated — see
risks §6), and PKC questions authored for both 1a and 1b (one per checklist
line, verified for exact topical/maths fit). 1c/1d and Week 2+ have no
lesson content yet, so there's nothing to extend this to until Ryan authors
more.

### F38 · From Method to Meaning v2 — Could, Phase 4, XL+ (supersedes F20b)
Replaces the printable-worksheet UI with a full-screen interactive experience,
**keeping the existing Clarify/Justify/Challenge/Generalise question content and
grading verbatim** — this is a delivery-mechanism change, not a content rewrite.
Mountain-climb metaphor: five milestones (Clarify → Justify → Challenge →
Generalise → Mastery), the student's F36 avatar visibly moving up the mountain
as each stage completes, one question at a time (not all twelve at once),
horizontal stage-progress indicator. Under each question: **Talk it out** (live
two-way voice conversation with an AI tutor that Socratically probes reasoning —
asks follow-up questions, never states the answer, adapts prompt style per stage)
or **Write it down** (text box + a maths symbol toolbar — this is F33's palette,
build F33 first). Stage-completion feedback reinforces the *kind* of thinking
demonstrated ("You can explain why the mathematics works"), not just "Correct".
Ends at a Mastery summit screen with the avatar and a MasterMaths flag/trophy.

**This has two materially different builds bundled into one spec — recommend
splitting them the way F12 was split:**
- **F38-lite (typed only):** mountain UI, avatar, stage progression, Write-it-down
  path with the F33 toolbar. No new safety surface beyond existing text content.
- **F38-full (+ live voice tutor):** requires a real-time audio AI integration
  (not existing infra — this app has no audio pipeline today), and raises a
  genuine child-data question: a minor's live voice, sent to a third-party AI
  service, MUST be assessed against CLAUDE.md rule 4 (data minimisation, UK GDPR/
  ICO Children's Code) before any build starts. **Do not start F38-full until
  D18/D19 are answered** (see §7) — this isn't a build-order nicety, it's a
  compliance gate.
**AC (F38-lite):** ☐ all 12 existing questions present, unmodified, at their
existing grade levels ☐ avatar climbs the mountain on stage completion ☐ maths
toolbar available in Write-it-down ☐ progress not lost on refresh (persisted,
not just in-memory) ☐ mobile: stacks per spec, stage names remain readable.
**AC (F38-full, once D18/D19 clear):** ☐ voice tutor never states the answer
before the student has reasoned it out ☐ conversation audio is not retained
beyond the session unless Ryan explicitly opts to keep it for review, and that
default is OFF ☐ probing style changes per stage (Clarify/Justify/Challenge/
Generalise) per the spec's example scripts.

### F39 · Study Planner — Could, Phase 5, XL
New sidebar section. Summary strip (this week's study time, lessons planned/
completed, next session, streak) above a week/month calendar of scheduled study
sessions (Learn / Practice / Revise / Mock Exam types, distinguished by icon,
not colour alone — accessibility). "+ Add Study Session" modal pulls course/
topic/lesson from existing content; "Add to Study Planner" also appears inline
on lesson/topic pages and pre-fills that modal. Recommendations ("Your accuracy
in Trigonometry is currently 58% — schedule 30 minutes of practice") read
**existing F11 quiz-results data** (topic, misconception, correct) — no new data
collection needed, just a read-side aggregation + a supportive-language rule
("could use more practice", never "you are bad at this"). Completed sessions
feed the existing streak (F9) and progress stats.
**AC:** ☐ calendar sessions persist server-side (F2 sync pattern) ☐
recommendations are computed from real F11 data, never hardcoded ☐ "Add to Study
Planner" from a lesson pre-fills topic/lesson, only date/time/duration required
☐ completed sessions visibly contribute to streak/stats ☐ language never
frames a weak topic as a personal failing (see §6).

### F40 · Topic Resources — Could, Phase 5, L (code) + ongoing Ryan production
A resources system: **Formula Sheets** (per exam board, view/fullscreen/download);
**Calculator Skills** video tutorials (organised by calculator model — e.g. Casio
ClassWiz — since button sequences differ; GCSE vs A-Level lists per spec);
**Exam Skills** guides (show your working, command words, non-calculator
technique, time management); a **topic-contextual panel** on My Learning showing
only what's relevant to the current topic; and a searchable/filterable **Main
Resources Library** in the sidebar. Video playback should stay inside the
platform, with captions (accessibility rule, not optional).
**Scope flag:** the *code* (browser, search, filters, contextual panel, formula-
sheet viewer) is a normal build. The **video content itself does not exist** —
calculator tutorials, exam-skills videos — and producing it is Ryan's job, not
this codebase's. Sequence Ryan's filming alongside the build so the library
isn't empty on ship day; don't let the effort estimate imply engineering can
fill it.
**AC:** ☐ formula sheet correctly matches student's qualification/exam board
☐ only calculator tutorials relevant to the student's course/model show
☐ resources panel changes contextually per topic (verified on ≥2 different
topics) ☐ search/filter work across the full library ☐ videos have captions
☐ nothing communicated by colour alone.

## 4. Authoring pipeline (now specified as F32)

Start during Phase 2c: F32's service drafts variant questions + misconception distractors
+ staged hints for 1a–1d into the `questions_review` queue; Ryan clears it weekly. F19's
engine without an approved question pool is an empty feature. Ryan writes "From Method to
Meaning" tasks himself; F26 is what makes that pleasant.

## 5. Data model deltas (on top of v2 §5)

| Change | Detail |
|---|---|
| `profiles` | + `streak_emails_opt_in` bool default false, + `comp_access` bool default false |
| content schema | + week.quote, lesson.calculator ('allowed'/'not-allowed'/absent), video sequential-reveal flag; F26 stores sanitised rich HTML in existing fields |
| worksheet schema | + markScheme per section (F27) |
| `email_log` | NEW — streak emails sent (dedupe/caps for F30) |
| `questions_review` | (from v2) now F32's output target: + spec_ref, grade_band, similarity_score, source ('ai'), approved_by, edited_diff |
| `generation_examples` | NEW — Ryan's approved/edited items kept as few-shot examples for F32 |
| `profiles` | + `avatar_id` (or similar) for F36 |
| content schema | + lesson `priorKnowledgeCheck` question set (F35), keyed to existing `prior` checklist lines |
| `study_sessions` | NEW (F39) — user_id, course/topic/lesson, scheduled_at, duration, activity type, completed_at |
| `study_session_events` | NEW (F39) — feeds streak/recommendation calculations without re-deriving from `quiz_results` on every page load |
| resources content | NEW (F40) — formula sheets, video tutorials with board/qualification/calculator-model tags, exam-skills guides; static content table or CMS-style JSON, TBD at build time |
| F38 voice sessions | **NOT defined yet — deliberately.** No schema until D18/D19 settle whether/how conversation data is retained. Default assumption: not stored beyond the live session. |

## 6. Risks & obligations (additions to v2)

- **✅ FIXED 2026-09-02 — service_role key removed from the app entirely.** Teacher
  Editor saves (`saveRemoteContent`) and file uploads (`storageUpload`) previously sent
  the service_role key straight from the browser (localStorage + request headers) —
  a full-access, RLS-bypassing key, readable via DevTools, and the whole Teacher Editor
  route (`#/admin`) had no sign-in check at all. Both now go through the teacher's own
  signed-in session, authorised by RLS (`is_teacher()`, same function backing F10/F23/
  F24) — the app's client code no longer holds any key more powerful than the public
  anon key. `#/admin` is now gated the same way `#/teacher` already was. **Not yet
  live** — same Supabase-access blocker as everything else built this session; the
  migration is ready, `BACKEND-SETUP.md`/CLAUDE.md are updated to match.


- **Emailing minors (F30):** opt-in only, unsubscribe in every message, capped frequency.
  If in doubt about tone, the test is "would a parent reading it over their shoulder object?"
- **Rich-text output (F26):** sanitise on save AND on render — the editor becomes an HTML
  injection surface if either side trusts input. Keep the allowed-tag list short.
- **Default font (D13):** don't switch the whole platform to OpenDyslexic on a list item —
  get Ryan's confirmed yes after seeing the trade-off. (Licence itself is fine: SIL OFL.)
- **F32 grounding vs copying:** the whole point of tiering the corpus is that retrieval
  amplifies reproduction risk — Tier 2 sources are analysis-only, and the output similarity
  check is a required validator, not an optional one. If the similarity check is ever
  removed "temporarily", F32 is out of policy.
- **F34 import copyright ruling (v3):** import is for content Ryan owns. Exam papers are
  excluded as a source — the questions are Pearson's copyright regardless of reformatting;
  "Edexcel style conversion" of lifted questions would be infringement with better
  typography. All imports pass the similarity gate and enter as pending. The AI generator
  is the sanctioned route to original Edexcel-style items.
- **F38's live voice tutor (v4) is the biggest child-data question in this plan.**
  Students are minors (rule 4: data minimisation, UK GDPR/ICO Children's Code).
  A live microphone feature that streams a child's voice to a third-party AI
  service needs, before any build: explicit parental/account-holder consent
  flow (not just a generic ToS checkbox), a retention default of **not stored**
  unless Ryan explicitly opts in per-session for review purposes, a clear
  answer on which vendor/API is used and what THEIR data-retention policy is
  for under-18 voice data, and a fallback (Write-it-down) that is never treated
  as a lesser option so no student is pressured into voice. See D18/D19 —
  do not start F38-full without them answered.
- **F36 avatar scope creep:** "students design their own avatar" can mean
  anything from picking one of 12 preset icons to a full custom illustration
  builder. Confirm the smaller scope (D19) before estimating F37/F38 — the
  Lesson Overview and mountain-journey specs only need avatar to *exist and
  render*, not to be a rich creation tool.
- **F40 effort is misleading if read as pure engineering.** The resources
  *browser* is a normal build; the *videos* are Ryan's to produce. Don't let
  the L estimate imply the library ships full on day one.
- **F24 points integrity — streak half still open.** `points` itself is locked
  down (server-computed, column-level revoke on direct writes — see F24 spec).
  But the formula reads `streak_current`, which F13 made directly client-
  writable (a plain upsert from local storage) and nothing in F24 changed that.
  A student can currently inflate their own streak and it flows straight into
  their leaderboard points. Fix before this goes live with real students:
  re-derive streak server-side from `progress.updated_at` (consecutive-day
  count) instead of trusting the client's local streak object, then lock the
  column down the same way `points` is locked down now.
- (All v2 risks stand.)

## 7. Decisions

**Answered (recorded):**

| # | Decision | Ryan's answer |
|---|---|---|
| D1 | Free taster | **All of Week 1** (1a–1d) → task T1 |
| D2 | Unlock rule | **Opening the video is enough** (matches shipped behaviour) |
| D3 | Hints/questions authorship | **AI-drafted, Ryan approves** |
| D4 | Badges & streaks | **Signed off + email reminders** → F30 (opt-in, see §6) |
| D5 | Pricing | **£19.99/mo · Week 1 free · comp access for weekly recurring 1-to-1 students only** → F14/F10 amendments |
| D6 | Mastery thresholds / pass mark | **80/50 confirmed · pass stays 80%** |
| D16 | Mastery model reconciliation | **Alongside, not replacing**: per-objective 4-tier mastery (Not Started/Learning/Developing/Mastered) powers F19's internal logic and a future breakdown view; the shipped lesson-level 🟢🟡🔴 (D6) stays exactly as-is as the student-facing summary — no change to what students see today |
| D17 | Energy meter sign-off | **Confirmed as spec'd**: values as written (+15 first-attempt correct, +10 after 1 scaffold, +5 after 2+, +5 correct review, bonus for completing/mastering an objective, never removed for wrong answers); hidden in Focus mode and when timers are hidden (matches Ryan's reduced-distraction ethos) |
| D12 | Q&A platform + cadence | **Zoom** (not YouTube Live — no public live-embed needed, changes F23's shape to scheduling + question queue rather than video streaming) · **weekly, fixed slot: Thursday 6:00pm UK time** |

**Still open:**

| # | Decision | Needed by |
|---|---|---|
| D7 | Course tile naming/order; which boards/tiers shown "coming soon" | cosmetic now — before marketing |
| D8 | Foundation grade cap for stepping (grade 5?) + 2-fail/2-pass sign-off | Phase 4 |
| D9 | Leaderboard opt-in default OFF — confirm | Phase 5 |
| D10 | Display-name policy (moderation/suggestions) — confirm shipped behaviour is fine | soon (accounts live) |
| **D13** | **Default font: keep Inter with dyslexia fonts one tap away, or OpenDyslexic everywhere?** (see F28 note) | Phase 2b |
| **D14** | **Streak email details: send time (17:00?), copy tone, max misses before stopping** | Phase 3 |
| **D15** | **Multi-board rollout: what comes after Edexcel Foundation (Edexcel Higher vs second board), and shared-core content with board-specific assessment vs fully separate courses?** | Before any second-course authoring |
| **D18** | **F38 voice tutor: which real-time audio AI vendor/API, and what is its data-retention policy for a minor's voice?** Blocks any F38-full build start | Before F38-full |
| **D19** | **F38/F36 consent + retention: does a live voice conversation with an AI tutor need explicit parental/account-holder consent beyond the existing account ToS, and is conversation audio ever retained (default should be no)?** | Before F38-full |
| **D20** | **F36 avatar scope: preset icon picker (small build) vs a fuller custom-avatar builder (much larger build)?** | Before F37/F38 estimation firms up |
| **D21** | **F39/F40 priority vs effort: both are XL/L-plus-production and sit in Phase 5 behind F14/F13/F23/F24 — does Ryan want either pulled forward, given they're the features he's most recently asked for?** | Before Phase 5 planning |

### F19 · Adaptive Diagnostic Quiz v2 — Should, Phase 4, XL+ (Ryan's 31-07 spec)
Full specification lives in Ryan's 31-07 document (repo: docs/ryan-quiz-spec-2026-07-31).
Summary of the committed design:
- **Per-question:** 4 options, every distractor mapped to a misconception ID with
  misconception-specific feedback; question carries objective (spec ref), difficulty,
  scaffold level, worked solution.
- **Adaptive flow:** easy→hard progression; wrong answer ⇒ stay on the objective,
  identify + record the misconception, escalate scaffolding (L0 original → L1 simpler
  numbers + rule reminder → L2 stepwise → L3 partial worked example → L4 guided choices
  → L5+ continue until correct). Unlimited attempts; scaffolds never reveal the answer
  outright.
- **Review section:** end-of-quiz Duolingo-style pass over everything not right first
  time — fresh variants, counts toward the score.
- **Scoring/pass:** 80% pass unchanged; score weights first-attempt accuracy, scaffold
  depth, review performance (Ryan's §13 weights as config, not hardcode). Failing
  generates a **new** quiz biased toward unresolved misconceptions; question-ID history
  prevents repeats.
- **Mastery:** per learning objective, 4 tiers (Not Started / Learning / Developing /
  Mastered, 0/1–39/40–79/80–100), powering this engine and a future breakdown
  view — runs **alongside**, not replacing, the shipped lesson-level 🟢🟡🔴
  (D6), which stays as the student-facing summary (**D16, answered**).
- **Persistent misconceptions:** >1 miss ⇒ persistent ⇒ injected into future relevant
  quizzes cross-topic until secure; then retired.
- **Energy meter:** additive-only reinforcement, confirmed values (+15 first-attempt
  correct, +10 after 1 scaffold, +5 after 2+, +5 correct review, bonus for
  completing/mastering an objective, never removed for wrong answers), animated;
  **hidden in focus mode and when timers are hidden** (**D17, answered**).
- **Architecture:** modular (QuizEngine, ScaffoldManager, MisconceptionTracker,
  MasteryManager, EnergyManager, ReviewManager, ScoreCalculator…), config-file driven,
  engine separate from UI. AI generation via F32 with validation before use (already
  the pipeline: validators + review queue).
- **Milestone 1 = Ryan's §22 prototype:** order of operations (N3), 3 objectives,
  ≥5 templates each, full scaffold loop, review section, energy, mastery — then
  generalise.
**Build gates:** pilot complete · bank depth per objective · ~~F33 shipped~~
✅ **cleared 2026-09-01** · ~~D16/D17 answered~~ ✅ **cleared 2026-09-01** (see
§7) · its own red-team (first feature serving AI content to children
directly). **Remaining before F19 build starts:** pilot-complete status and
approved-bank depth per objective (product/business status, not something I
can assess from code) · the red-team safety pass.
**AC (top level):** ☐ wrong answers always route to same-misconception scaffolds
☐ no exact-question repeats across retakes ☐ persistent misconceptions resurface
cross-topic and retire on mastery ☐ score reflects first-attempt accuracy + scaffold
depth ☐ engine/UI separation + config externalised ☐ prototype passes Ryan's review
before generalisation.

### F33 · Equation editor — Should, Phase 4 (early), L
KaTeX rendering across student views, Teacher Editor, review tab, print; input via
LaTeX and a clickable symbol palette (fractions, indices, roots, inequalities, trig,
calculus, vectors/matrices, Greek); live preview; source markup stored, rendered
consistently on desktop/tablet/mobile/print. Do BEFORE heavy algebra authoring.

**The generator half is already done** (F32 M5, prompt p5): generated maths is emitted as
LaTeX stored as plain text in the item fields, and a `markup` validator enforces the
contract on every item. **The renderer here must match it exactly**, or approved content
renders as literal backslashes:
- inline `\(…\)` · display `\[…\]` and `$$…$$`
- **never** a bare single `$` (currency collision); a literal currency dollar is `\$`
- inequalities as `\lt \gt \le \ge \ne`, never raw `<`/`>`
- HTML limited to `<p>`, `<br>` and inert inline emphasis (`<strong> <b> <em> <i> <u>
  <sup> <sub>`)
Simple arithmetic stays plain text; fractions, indices, roots and anything structural are
LaTeX. Full statement: GENERATOR-SERVICE.md §4 "Markup".
**Status: ✅ SHIPPED 2026-09-01** (built, not yet Ryan-verified live — same
no-Node/Playwright caveat as F35-F37). Turned out to be a gap-closing job, not
a from-scratch build: `ensureKatex()`/`renderMathIn()` already existed (F10b)
and were already wired into the Teacher Editor review tab AND the live student
Question Generator card — the plan's "student surfaces still show raw markup"
note was stale. Closed the remaining five gaps: main quiz, F35's Prior
Knowledge Checker, the generator mark scheme (was a DOM sibling of the card,
not covered by the existing call), the From Method to Meaning worksheet, and
video Key Facts/Quick Fire notes. Added the palette (16 buttons — fraction,
powers, roots, ≤≥≠, π, ×÷, sin/cos/tan, θ, vector; calculus/matrices left for
a follow-up if a higher-tier/A-Level course needs them) to the existing shared
rich-text toolbar, plus a live preview strip. Fixed a print-timing race: KaTeX
loads async, so the worksheet's print button now awaits `renderMathIn` before
`window.print()`, or a fast print could have captured raw markup.

**AC:** ☑ Ryan writes a fractional equation without HTML/LaTeX knowledge (palette)
☑ same markup renders identically in editor preview, student view, print ☑ existing
content unaffected — pending Ryan's live verification.

### F34 · Question import (Ryan-owned content) — Could, Phase 4–5, L–XL
Upload PDF/Word/image/scan of **Ryan's own** material → extraction into editable
components (text, maths, tables, figures, parts, marks) → review screen (original vs
converted, all fields editable, objective/difficulty/misconceptions assigned) →
**similarity gate** → review queue as source 'import'. Clean exam-style output layout
(typography, numbering, marks display, working space) — house style, no Pearson
branding. **Exam papers are not an import source** (ruling above); the generator is
the legitimate route to Edexcel-style items.
**AC:** ☐ a scanned Ryan worksheet becomes editable structured questions ☐ every
import passes the similarity gate ☐ nothing publishes without the review screen.