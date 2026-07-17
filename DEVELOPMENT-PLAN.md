# MasterMaths Platform — Development Plan v2 (MoSCoW)

Last updated: 14 July 2026 · Owner: Alfie · Product owner: Ryan
v2 folds in Ryan's improvements document (course hierarchy, SEND suite, quiz redesign,
community requests). Supersedes v1. Status: ☐ not started · ◐ in progress · ✅ done · ⏸ parked · ✖ won't

## What changed from v1

- **Phase 0 shipped** — F3, F4, F6 are live. ✅
- **New Must:** F15 course hierarchy (GCSE→Edexcel→Foundation) — designed into Phase 1 NOW,
  because retrofitting a course layer under progress data later means migrating every table.
- **New epic:** SEND accessibility suite (F16–F18) — split by cost: quick wins (settings panel)
  vs the maths toolkit (widgets). This is the platform's differentiator; quick wins jump the queue.
- **Expanded:** quiz redesign (F19) — misconception distractors, unlimited retries with fresh
  variants, in-quiz grade stepping. Engine work is moderate; **authoring is the real cost**.
- **Explicit Won't:** student forum/community + its notification system (see §6 — Online Safety
  Act obligations for under-18 user-to-user services are disproportionate for a one-tutor platform).
- **Re-scoped as website (Wix) tasks, not app features:** Trustpilot/Google reviews section.

---

## 1. Full feature list

Effort: S < ½ day · M 1–2 days · L 3–5 days · XL 1–2 weeks

| # | Feature | MoSCoW | Effort | Depends on | Phase | Status |
|---|---|---|---|---|---|---|
| F3 | Sequential lesson unlocking | Must | S | — | 0 | ✅ |
| F4 | Quiz mastery ratings 🟢🟡🔴 | Must | S | — | 0 | ✅ |
| F6 | Estimated time per section | Must | S | — | 0 | ✅ |
| F1 | Student accounts (email + password; OTP deferred) **+ display names + privacy notice + deletion** | **Must** | M–L | — | 1 | ✅ |
| F15 | **Course hierarchy & dashboard** (qualification → board → tier) | **Must** | M | with F1 | 1 | ✅ |
| F2 | Cloud progress sync (now keyed by course + lesson) | **Must** | M | F1, F15 | 1 | ✅ |
| F5 | "Continue where you left off" | **Must** | S–M | F2 | 1 | ✅ |
| F16 | **SEND quick wins**: text size/spacing, dyslexia font, light/dark/high-contrast, hide timers, focus mode, one-at-a-time reveal | **Must** | M | F1 (to save prefs) | 2a | ✅ |
| F17 | Text-to-speech (read instructions/questions aloud) | Should | S–M | F16 panel | 2a | ✅ |
| F25 | Site theme: SEND-sensitive palette + faint logo-symbol backdrop (off in focus mode) | Should | S | F16 | 2a | ☐ |
| F20a | Worksheet rename → "From Method to Meaning" | Should | S | — | 2a | ☐ |
| F11 | Per-question results + topic + **misconception tags** | Should | M | F2 | 2b | ☐ |
| F7 | Resume at exact point | Should | M | F2 | 2b | ☐ |
| F8 | Quick Help — **staged/scaffolded hints** (+ pictures at hint level) | Should | M | authoring | 2b | ☐ |
| F9 | Badges & streaks | Should | M | F2 | 2b | ☐ |
| F10 | Teacher dashboard (+ struggling-student flags) | Should | L | F11 | 3 | ☐ |
| F21 | End-of-unit summary: strengths/weaknesses + **tutoring signpost** | Should | M | F11 | 3 | ☐ |
| F19 | **Quiz engine v2**: misconception distractors, variant pools, unlimited retries w/ fresh sets, fail-2-down / pass-2-up grade stepping | Should | L (+authoring) | F11, AI drafting | 4 | ☐ |
| F12 | Adaptive generator: timer opt-in, working-at grade, Edexcel-style, hint images | Could | L | live AI generator, F11 | 4 | ☐ |
| F20b | Interactive "From Method to Meaning" worksheets (higher-order tasks; Ryan-authored) | Could | L | F16 reveal, editor | 4 | ☐ |
| F18 | Digital maths toolkit: number line, hundred square, ×-grid, fraction bars, place-value counters | Could | XL | — | 5 | ☐ |
| F14 | Subscriptions (Stripe + on/off toggle) | Could | XL | F1 | 5 | ☐ |
| F13 | Parent dashboard (Sherpa-style separate login; view-only; no social feed) | Could | L | F10 | 5 | ☐ |
| F23 | Weekly Q&A: embedded stream + upvoted question queue + archive library | Could | M–L | F1 | 5 | ☐ |
| F24 | Points + leaderboard (opt-in, display names only, weekly/monthly/all-time, tiered ranks) | Could | M | F1, F9 | 5 | ☐ |
| — | Student forum / community chat + reply notifications | **Won't** | — | — | — | ✖ |
| — | Trustpilot / Google reviews display | Website task (Wix) | — | — | — | → |
| — | Native app, offline mode, AI marking of written work, school accounts | Won't (this phase) | — | — | — | ✖ |

---

## 2. Revised phase order

**Phase 1 — Accounts & courses (next).** F1 + F15 together, then F2, F5.
Login lands on a dashboard: GCSE / IGCSE / A-Level → board → tier. Demo has one live
course (GCSE · Edexcel · Foundation); the rest render greyed "coming soon". Sign-up asks
for email + a display name (never real names — privacy for minors AND feeds F24 later).
Ships with a plain-English privacy notice route and working delete-my-account.

**Phase 2a — SEND quick wins (the differentiator, cheap).** F16 settings panel (CSS
variables + per-user prefs), F17 text-to-speech via the browser's built-in Web Speech API,
F25 theme/backdrop, F20a rename. Roughly one week total, transforms the pitch.

**Phase 2b — Learning experience.** F11 (now with misconception tags — designed for F19)
→ F7 → F8 staged hints → F9.

**Phase 3 — Visibility & guidance.** F10 teacher dashboard, F21 end-of-unit summaries
with the one-to-one tutoring signpost (the actual business funnel — costs nothing, do it
properly: triggered by 🔴 mastery patterns, links to the Wix booking page).

**Phase 4 — Advanced learning.** F19 quiz v2 (start the authoring pipeline EARLY — see §4),
F12 adaptive generator once FastAPI is live, F20b interactive worksheets.

**Phase 5 — Commercial & community.** F14 subscriptions, F13 parent portal, F23 weekly
Q&A, F24 leaderboard.

---

## 3. New feature specs (F15–F25; F1–F14 specs from v1 still apply unless amended here)

### F15 · Course hierarchy & dashboard — Must, Phase 1, M
Content model gains a course layer: `COURSES: [{id:'gcse-edexcel-foundation',
qualification:'GCSE', board:'Edexcel', tier:'Foundation', WEEKS, LESSONS}]`.
Back-compat rule: content without a COURSES wrapper is treated as that single default
course. Progress keys become (user, course, lesson). Dashboard route (`#/courses`) after
login: qualification tiles → board → tier → lesson pathway. Only one course is live;
others greyed. Teacher Editor gains a course selector (even with one course).
**AC:** ◐ login lands on dashboard *(dashboard is the default landing now; post-login
redirect lands in F1)* ✅ old content loads as the default course ✅ deep
links still work (`#/gcse-edexcel-foundation/1a`, with `#/1a` redirecting) ✅ progress
migrates keyed to the default course.

### F16 · SEND quick wins — Must, Phase 2a, M
A single accessibility settings panel (⚙ icon, honoured everywhere): text size (3 steps)
· line/letter spacing · dyslexia-friendly font (OpenDyslexic via self-hosted woff2,
licence permitting, else Atkinson Hyperlegible) · light / dark / high-contrast themes ·
hide timers · focus mode (hides sidebar chrome, backdrop, streaks/badges, non-essential
buttons) · one-question-at-a-time reveal for quizzes and on-screen worksheets.
Implementation: CSS custom properties + a `prefs` object; saved per-user (F1) with
localStorage fallback; respects `prefers-reduced-motion` / `prefers-contrast`.
**AC:** ✅ every setting applies instantly app-wide and persists across devices (localStorage
+ `profiles.prefs` sync on sign-in) ✅ high-contrast passes WCAG AA on all card types (black
on white, 2px black borders, tints removed) ✅ focus mode hides the right info column (the
faint backdrop/gamification land with F25) ◐ one-at-a-time: quiz is inherently one-question
-at-a-time; the on-screen "one at a time" pref makes the lesson activity cards an accordion.
Per-question *worksheet* reveal is deferred (worksheet is a print modal — revisit with F20b).
**Deviations (both deliberate):** dyslexia-friendly font ships as **Atkinson Hyperlegible**
(Google Fonts, lazy-loaded, guaranteed-available → zero 404s) rather than self-hosted
OpenDyslexic; OpenDyslexic can be added later. Default theme/font = light + Inter, all aids
opt-in (D11 was left unfilled — this is the safe default; flip in one line if Ryan prefers).

### F17 · Text-to-speech — Should, Phase 2a, S–M
🔊 button on instructions, quiz questions and options using the Web Speech API (built
into browsers, no service, no cost). Reads maths sensibly ("−3" → "negative three";
"<" → "is less than") via a small symbol-to-words pass before speaking.
**AC:** ✅ any question/instruction can be played, stopped and replayed (🔊 Read aloud on the
quiz question — which also reads all four options — and on the generated question; clicking
again stops, and changing lesson stops playback) ✅ symbols read correctly (unit-tested:
−3→"negative three", <→"is less than", ≠ ≥ ≤ × ÷ √ ² ³ % ° π, and a/b→"a over b"; HTML tags
and entities are stripped first) ✅ degrades gracefully — buttons are hidden entirely when
`speechSynthesis` is unavailable.
**Note:** pause/resume was implemented as stop/replay (simpler and more predictable for
students than the Web Speech API's flaky pause on some browsers).

### F19 · Quiz engine v2 — Should, Phase 4, L + authoring
Diagnostic-style questions (inspiration: diagnosticquestions.com): every distractor maps
to a named misconception, stored on wrong answers (feeds F10/F21). Retries are unlimited
but each retry draws a **fresh variant set** from a pool; fail 2 attempts → question set
steps down a grade band, pass 2 in a row → steps up (capped at Foundation's top band for
this course). Schema: questions gain `gradeBand`, `variantGroup`, `misconceptions[]`.
**The gating factor is authoring**, not code: each lesson needs pools of variants per
band. Pipeline (per Ryan's "I want to preapprove"): the AI generator drafts variants in
the diagnostic style → review queue in the Teacher Editor → Ryan approves, edits or
rejects → approved questions publish. ⚠ **Copyright rule:** Edexcel papers and PMT
compilations are copyrighted — the AI must produce *original Edexcel-style* questions;
never lift questions from those sources.
**AC:** ☐ two consecutive fails visibly ease the questions; two passes step up ☐ retry
never repeats the exact same set ☐ wrong answers record a misconception ☐ nothing
reaches students without Ryan's approval.

### F21 · End-of-unit summary — Should, Phase 3, M
On completing a week/unit: "What you did well / What to work on" built from F11 data
(topics ≥80% vs <50%), mastery per lesson, and a low-pressure signpost: "Want help with
[weakest topic]? Ryan offers one-to-one sessions →" linking to the Wix booking page.
**AC:** ☐ summary auto-generates from real answer data ☐ signpost appears only when
there's a genuine weak area ☐ Ryan sees the same summary per student (F10).

### F23 · Weekly Q&A — Could, Phase 5, M–L
Embedded live stream (unlisted YouTube Live / Zoom link) on a members page + a question
queue: students **submit questions and upvote others'** — deliberately no free-form chat
between students (keeps it out of user-to-user territory). Archive list of past sessions
searchable by topic/date.
**AC:** ☐ submit + upvote works ☐ Ryan can mark questions answered ☐ no student-to-
student messaging surface exists.

### F24 · Points & leaderboard — Could, Phase 5, M
Points from module completion, quiz performance, streaks (extends F9). Leaderboard is
**opt-in**, shows display names only, filters weekly/monthly/all-time, tiered ranks
("Foundation Master" etc.). SEND note: public ranking is exactly what anxious students
don't need — opt-in default OFF, and hidden entirely in focus mode.

### F25 · Theme & backdrop — Should, Phase 2a, S
Faint maths-symbol backdrop (from the logo: + × π √) as a body watermark, brand palette
aligned to mastermathstutoring.co.uk, colours chosen for SEND sensitivity (avoid harsh
saturation; verified contrast). The backdrop is a theme layer that **focus mode and
high-contrast mode remove** — Ryan's two wishes conflict here, and focus wins.

### Amendments to v1 specs
- **F1:** + display-name field at sign-up (no real names), privacy notice route,
  delete-account action, login lands on F15's dashboard.
  ✅ Shipped as **email + password** (email confirmation off → no SMTP needed); **OTP,
  email verification and password-reset are deferred until custom SMTP is configured**
  (see README launch blockers). Full account deletion via a `delete-account` Edge Function.
- **F8:** hints are **staged** (nudge → method prompt → worked step), each stage can
  include an image/concrete representation; still authored via editor, AI-draftable.
- **F12:** + pre-start choice "Timed (exam conditions) / Untimed"; timer hidden anyway
  when the SEND hide-timers pref is on; shows "Working at: Grade N"; hint images.
- **F13:** Sherpa-style: separate "login as parent" entry; strictly view-only; parents
  never see social/community surfaces.
- **F10:** + "struggling" flag (repeated 🔴 mastery or misconception clusters) with a
  suggested action of a tutoring referral.

## 4. Start the authoring pipeline early

F19 and F8 are code-cheap and content-expensive. From Phase 2b onwards, run authoring in
parallel with development: get the FastAPI generator drafting variant questions +
misconception distractors + staged hints for lessons 1a–1d, into a review queue Ryan
clears weekly. If authoring starts when F19's code is done, the feature will sit unusable
for a month. Ryan writes "From Method to Meaning" tasks himself (his preference) — the
editor just needs somewhere for them to live (F20b).

## 5. Data model deltas (on top of v1 §5)

| Change | Detail |
|---|---|
| `profiles` | + display_name (no real names encouraged), + prefs jsonb (SEND settings) |
| `progress` | key becomes (user_id, course_id, lesson_id) |
| `quiz_results` | + course_id, misconception text, grade_band, variant_group |
| `questions_review` | NEW — AI-drafted questions awaiting Ryan's approval (F19/F8 pipeline) |
| `qa_questions` | NEW — weekly Q&A submissions + upvotes (F23) |
| `points` / leaderboard views | NEW — derived from events (F24), opt_in flag on profiles |

## 6. Risks & obligations (additions)

- **Online Safety Act / safeguarding:** a forum or open chat for under-18s makes the
  platform a user-to-user service with active moderation and risk-assessment duties —
  disproportionate for one tutor. Hence forum = **Won't**. The Q&A queue (submit + upvote
  only) is the deliberate safe substitute. Revisit only with real moderation resource.
- **Copyright:** original Edexcel-*style* questions only; no reproduction from PMT,
  Edexcel papers, or Diagnostic Questions. Applies to AI generation prompts too.
- **Leaderboard vs SEND ethos:** opt-in only, display names only, absent in focus mode.
- **OpenDyslexic licensing:** check the font licence before bundling; Atkinson
  Hyperlegible (free, strong readability research) is the fallback.
- (All v1 risks stand: children's data, service_role key upgrade, Supabase limits,
  single-file growth — the file WILL need splitting by Phase 4; plan it at Phase 3.)

## 7. Open decisions for Ryan (updated)

| # | Decision | Needed by |
|---|---|---|
| D1 | Free taster scope (1a only? whole Week 1?) | Phase 1 |
| D3 | Hints/questions: AI-drafted + your approval queue — confirm this workflow | Phase 2b |
| D5 | Subscription price & free tier | Phase 5 |
| D7 | Course tile naming/order on the dashboard; which boards/tiers shown "coming soon" | Phase 1 |
| D8 | Foundation grade cap for stepping (grade 5?) and the 2-fail/2-pass rules sign-off | Phase 4 |
| D9 | Leaderboard: confirm opt-in default OFF | Phase 5 |
| D10 | Display-name policy (moderated? auto-generated suggestions?) | Phase 1 |
| D11 | SEND defaults: which theme/font ships as the default experience | Phase 2a |
| D12 | Q&A platform (YouTube Live vs Zoom) and cadence | Phase 5 |