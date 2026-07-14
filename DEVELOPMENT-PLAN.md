# MasterMaths Platform — Development Plan (MoSCoW)

Last updated: 14 July 2026 · Owner: Alfie · Product owner: Ryan
Lives in the repo next to `BACKEND-SETUP.md`. Update the Status column as you go:
☐ not started · ◐ in progress · ✅ done · ⏸ parked

---

## 1. Where the platform is today

Already built and live:

| Area | State |
|---|---|
| Lesson app (videos+notes, quiz, worksheet, generator) | ✅ Live on GitHub Pages, embedded in Wix |
| Teacher Editor (`#/admin`) | ✅ Edit/add lessons, quizzes, worksheets |
| Cloud content (Supabase `site_content`) | ✅ Teacher saves → all students see changes |
| Video & image uploads (Supabase Storage) | ✅ Drag-and-drop in editor |
| Student progress | ⚠️ **Browser localStorage only** + optional Wix member bridge — not tied to an account, lost on device change |
| Question generator | ⚠️ Local question bank; FastAPI/AI service not yet connected |
| Accounts, dashboards, payments | ❌ None |

The single most important observation: **almost every requested feature depends on
student accounts and cloud progress (F1+F2).** Build those first and everything else
becomes straightforward; build anything else first and you'll rebuild it later.

---

## 2. MoSCoW summary — all features at a glance

Effort: **S** < ½ day · **M** 1–2 days · **L** 3–5 days · **XL** 1–2 weeks

| # | Feature | MoSCoW | Effort | Depends on | Phase | Status |
|---|---|---|---|---|---|---|
| F1 | Student accounts (email sign-in) | **Must** | M | — | 1 | ☐ |
| F2 | Cloud progress sync across devices | **Must** | M | F1 | 1 | ☐ |
| F3 | Automatic sequential lesson unlocking | **Must** | S | — (better with F2) | 0 | ☐ |
| F4 | Quiz mastery ratings (🟢🟡🔴) | **Must** | S | — | 0 | ☐ |
| F5 | "Continue where you left off" button | **Must** | S–M | F2 | 1 | ☐ |
| F6 | Estimated time per section | **Must** | S | — | 0 | ☐ |
| F7 | Resume at the exact point (question-level) | Should | M | F2, F5 | 2 | ☐ |
| F8 | Quick Help button (hint / worked example / notes / rewatch) | Should | M | content authoring | 2 | ☐ |
| F9 | Badges & streaks | Should | M | F2 | 2 | ☐ |
| F10 | Teacher/admin dashboard (students, progress, results, weak topics) | Should | L | F1, F2, F11 | 3 | ☐ |
| F11 | Per-question result capture + topic tags | Should | M | F2 | 2 | ☐ |
| F12 | Adaptive generator difficulty | Could | L | F11 + live AI generator | 4 | ☐ |
| F13 | Parent dashboard | Could | L | F10 | 4 | ☐ |
| F14 | Subscriptions (Stripe, monthly, on/off toggle) | Could | XL | F1 | 4 | ☐ |
| — | Native mobile app, offline mode, AI marking of written work, multi-teacher/school accounts | **Won't (this phase)** | — | — | — | — |

Why F14 (payments) is only *Could* despite being asked for: it's the largest, riskiest
item, it needs a server component, and it's worthless until accounts, progress and the
teacher dashboard prove students actually use the platform. Sequence it last on purpose.

---

## 3. Implementation order

### Phase 0 — Quick wins (one weekend, no backend changes)
F4 mastery ratings → F6 time estimates → F3 sequential unlocking.
All three work with today's localStorage progress and get upgraded for free when F2 lands.
Ship these first: visible improvement for Ryan within days.

### Phase 1 — The account foundation (the important one)
F1 accounts → F2 cloud progress → F5 continue button.
After this: progress follows students across devices, and the Wix Velo bridge +
members-only page become redundant (see §7 Decisions).

### Phase 2 — Learning experience
F11 per-question capture (enabler) → F7 exact-point resume → F8 quick help → F9 badges & streaks.

### Phase 3 — Visibility for Ryan
F10 teacher dashboard. This is where F11's data pays off (weak-topic analysis).

### Phase 4 — Commercial & adaptive
F14 subscriptions (once there's something worth charging for) · F12 adaptive difficulty
(once the FastAPI generator is live) · F13 parent dashboard.

---

## 4. Feature specifications

### F1 · Student accounts — **Must, Phase 1, Effort M**
Email-based sign-in so progress belongs to a person, not a browser.

**Approach:** Supabase Auth (already in the stack, free tier: 50k monthly active users).
Use **email OTP (6-digit code)** rather than passwords — GCSE students forget passwords,
and OTP removes the reset flow entirely. Add a `profiles` table (§5). Sign-in screen is a
new route in the app (`#/login`); app remembers the session (Supabase handles tokens).
Students can browse lesson 1a logged out (marketing taster); everything else prompts sign-in.

**Acceptance criteria**
- ☐ Student can create an account with just an email address
- ☐ Session survives closing the browser
- ☐ Works inside the Wix embed and on the direct URL
- ☐ Logged-out visitors can view lesson 1a only

**Decision needed (Ryan):** is 1a free-to-browse the right taster, or nothing without an account?

---

### F2 · Cloud progress sync — **Must, Phase 1, Effort M**
The answer to "will students lose progress?" — permanently.

**Approach:** `progress` table in Supabase (§5), RLS so each student reads/writes only
their own rows. On every completed step: write to Supabase; keep localStorage as an
offline cache and merge on login (completed-anywhere wins — same merge rule as the
existing Wix bridge). **Retire the Wix Velo bridge and CMS collection** once verified —
one progress system, not three.

**Acceptance criteria**
- ☐ Complete a step on a laptop → visible on a phone after login
- ☐ Offline/flaky connection doesn't lose steps (queued and retried)
- ☐ Old localStorage progress migrates into the account on first login

---

### F3 · Sequential lesson unlocking — **Must, Phase 0, Effort S**
"Lessons unlock once the previous lesson's required parts are done."

**Approach:** the flag already exists (`SETTINGS.requireSequential`). Work needed:
flip it to `true`, define "required parts" as the existing four steps (video opened,
quiz ≥ pass mark, worksheet downloaded, ≥1 generated question), grey out + lock-icon
locked lessons in the sidebar, and show a friendly "finish 1a to unlock" toast on click.
Make the flag editable in the Teacher Editor so Ryan can turn it off for revision periods.

**Acceptance criteria**
- ☐ 1b locked until 1a's four steps complete; unlock is instant (no refresh)
- ☐ Deep links to a locked lesson redirect to the right lesson with a message
- ☐ Ryan can toggle the behaviour in the editor

---

### F4 · Mastery ratings — **Must, Phase 0, Effort S**
Shown on the quiz results screen and stored with the result:

| Score | Rating |
|---|---|
| 80–100% | 🟢 Confident |
| 50–79% | 🟡 Needs Practice |
| below 50% | 🔴 Review Lesson |

**Approach:** pure UI + one stored field. Show the badge large on the results screen with
a tailored message ("Review Lesson" links straight back to the video/notes). Keep the
80% pass gate as-is — mastery is feedback, passing is progression. Thresholds live in
content so Ryan can tune them.

**Acceptance criteria**
- ☐ Rating shows on quiz completion with the right colour and message
- ☐ 🔴 links back to notes/video; 🟡 offers retry; 🟢 celebrates
- ☐ Latest + best rating stored per lesson (needs F2 for cross-device)

---

### F5 · "Continue where you left off" — **Must, Phase 1, Effort S–M**
**Approach:** store `last_location` (lesson + section) on every meaningful interaction.
On login/open, show a banner or button above the lesson: "Continue: 1b Decimals — Quiz".
Lesson-level resume ships in Phase 1; question-level precision is F7.

**Acceptance criteria**
- ☐ Returning student sees one tap back to their last lesson & section
- ☐ Works across devices (via F2)

---

### F6 · Estimated section times — **Must, Phase 0, Effort S**
Video ~15 min · Quiz ~10 min · Worksheet ~25 min · Generator: Unlimited practice.

**Approach:** add a `time` field per section in lesson content (editable in the Teacher
Editor, with those defaults) and render a small chip on each section card. Content
change + ~10 lines of UI.

**Acceptance criteria**
- ☐ Each section shows its estimate; generator shows "Unlimited practice"
- ☐ Editable per lesson in the Teacher Editor

---

### F7 · Resume at the exact point — **Should, Phase 2, Effort M**
Extends F5: reopen mid-quiz at question 6 with earlier answers intact, or with the same
video/notes section expanded.

**Approach:** persist quiz state (answers array, current index, flags) and open-section
state to the `progress` row as the student moves. Restore on load. The quiz engine
already holds this state in memory — the work is serialising it.

**Acceptance criteria**
- ☐ Close mid-quiz → reopen on another device → same question, answers intact
- ☐ Abandoned quiz older than e.g. 24h restarts fresh (avoids stale half-attempts)

---

### F8 · Quick Help button — **Should, Phase 2, Effort M**
Floating "?" during quiz/generator with: Show Hint · View Worked Example · Open Notes ·
Rewatch Video.

**Approach:** Notes and Rewatch are trivial (jump to existing content). Hint and Worked
Example need **new per-question content fields** — that's the real cost, and it's
authoring, not code: someone writes a hint + worked example for every quiz question.
Add the fields to the Teacher Editor, make them optional (button hides if empty), and
consider using the AI generator to draft them for Ryan to approve.

**Acceptance criteria**
- ☐ Help button available during quiz questions
- ☐ Hint reveals without giving the answer; worked example shows a similar solved problem
- ☐ Missing hint/example degrades gracefully (option hidden)

**Decision needed:** who writes hints — Ryan manually, or AI-drafted + Ryan-approved?

---

### F9 · Badges & streaks — **Should, Phase 2, Effort M**
**Approach:** `events` table records activity days; streak = consecutive UK-time days
with any activity. Badges awarded server-side-ish (checked on load, stored in `badges`
table). Starter set:

| Badge | Trigger |
|---|---|
| First Steps | first lesson section completed |
| Quiz Ace | 100% on any quiz |
| Perfect Week | all of Week 1 complete |
| On Fire | 3-day streak |
| Unstoppable | 7-day streak |
| Comeback | pass a quiz after a 🔴 attempt |

Show streak flame + count in the header; badge shelf on a small profile view. Keep it
understated — motivation, not a casino.

**Acceptance criteria**
- ☐ Streak counts consecutive active days (UK timezone) and survives device switches
- ☐ Badges award once, with a small celebration toast
- ☐ Ryan can see badges/streaks per student (feeds F10)

---

### F10 · Teacher/admin dashboard — **Should, Phase 3, Effort L**
Ryan's view: all students · last active · per-lesson completion · quiz scores & mastery ·
weak topics · (later) subscription status.

**Approach:** new route `#/teacher`, visible only to `role='teacher'` profiles (RLS-gated
queries). Weak topics come from F11's per-question results grouped by topic tag —
"Negative numbers: class average 54%" is the genuinely useful bit for planning tuition.
Start as tables, add charts only if Ryan asks.

**Acceptance criteria**
- ☐ Ryan signs in and sees every student's progress at a glance
- ☐ Per-student drill-down: lessons, scores, mastery history, streak, last active
- ☐ Weak-topics list ranked by class average
- ☐ Students cannot access it (enforced by RLS, not just hidden UI)

---

### F11 · Per-question results + topic tags — **Should, Phase 2, Effort M** *(enabler)*
Not user-visible, but F10's weak topics and F12's adaptivity are impossible without it.

**Approach:** add an optional `topic` field to each quiz question (Teacher Editor +
content schema); on every answer, insert a row into `quiz_results` (student, lesson,
question, topic, correct, attempt #). Backfill topics for lessons 1a/1b (~15 min).

**Acceptance criteria**
- ☐ Every quiz answer recorded with topic
- ☐ Editor supports tagging; untagged questions default to the lesson title

---

### F12 · Adaptive generator difficulty — **Could, Phase 4, Effort L**
**Blocked until the FastAPI/AI generator is connected** (currently a local bank).

**Approach:** the generator has no answer input (students self-mark against the mark
scheme), so the v1 signal is honest self-report: "✅ I got it right / ❌ I got it wrong"
buttons after revealing the mark scheme. Simple staircase: 2 right in a row → step up a
grade band; 2 wrong → step down; request that band from the API. Show the current band
("Working at: Grade 3") so it feels like progression, not surveillance.

**Acceptance criteria**
- ☐ Difficulty visibly steps up/down with performance
- ☐ Self-report results land in `quiz_results` (topic-tagged) for F10

---

### F13 · Parent dashboard — **Could, Phase 4, Effort L**
**Approach:** parents create a normal account; student (or Ryan) generates a one-time
link code; `parent_links` table grants read-only access to that student's progress,
scores, mastery and weak areas via RLS. UI is a read-only reuse of F10's per-student view.

**Acceptance criteria**
- ☐ Parent links to their child with a code; sees progress/scores/weak areas; cannot edit
- ☐ Student/Ryan can revoke a link

**Note:** involves children's data — read §6 before building.

---

### F14 · Subscriptions — **Could, Phase 4, Effort XL**
Monthly payments, automatic access management, and a Ryan-controlled on/off switch.

**Approach:** Stripe Checkout (monthly price) + Stripe **webhook → Supabase Edge
Function** that sets `subscriptions.status` per account; the app gates lessons beyond the
free taster on an active subscription. Stripe's customer portal handles card changes and
cancellations, so there's no billing UI to build. `settings.subscriptions_enabled` is the
master toggle: **off = everything free** (today's behaviour), on = paywall active. Ryan
flips it in the Teacher Editor.

This is the one feature that cannot be done from static JS alone — webhooks need a
server endpoint (Edge Function or the FastAPI service). Budget real testing time with
Stripe test mode.

**Acceptance criteria**
- ☐ Toggle off → platform behaves exactly as today
- ☐ Toggle on → non-subscribers see taster + subscribe page; checkout → instant access
- ☐ Cancellation/failed payment removes access automatically at period end
- ☐ Ryan sees subscription status per student (F10)

**Decisions needed (Ryan):** price point · what's in the free taster · discount for
existing one-to-one students?

---

## 5. Data model additions (Supabase)

All tables RLS-enabled; students see only their own rows; `role='teacher'` sees all.

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | role & identity | user_id, display_name, role (student/teacher/parent) |
| `progress` | per-lesson steps + resume state | user_id, lesson_id, steps jsonb, quiz_state jsonb, updated_at |
| `quiz_results` | per-question history (F11) | user_id, lesson_id, question_idx, topic, correct, attempt, created_at |
| `events` | activity log → streaks, last_location | user_id, type, lesson_id, meta jsonb, created_at |
| `badges` | awarded badges | user_id, badge_id, awarded_at |
| `parent_links` | parent→student access | parent_id, student_id, created_at |
| `subscriptions` | Stripe state | user_id, stripe_customer, status, current_period_end |
| `settings` | global toggles | id=1, subscriptions_enabled, require_sequential |

---

## 6. Risks & obligations

**Children's data (do this before F1 ships).** Students are mostly 13–16. UK GDPR and the
ICO Children's Code apply once you hold accounts on minors. Keep it defensible: collect
the minimum (email only — no names required, no DOB), publish a short plain-English
privacy notice on the site, and give Ryan a way to delete a student's account+data on
request. Parent dashboards (F13) raise the bar again. Check the ICO's children's code
guidance when you get there — this document isn't legal advice.

**`service_role` key in the teacher's browser.** Known trade-off from BACKEND-SETUP.md.
Once F1 exists, upgrade: give Ryan's account `role='teacher'` and move editor writes
behind an Edge Function that verifies his JWT — then the service_role key never leaves
Supabase. Schedule alongside Phase 1; it's ~half a day.

**Supabase free tier.** 500MB database is ample for years of progress rows; the real
ceiling is Storage bandwidth (~5GB/month) if videos are self-hosted — a busy class
streams through that fast. Mitigation stays the same: YouTube-unlisted embeds for big
videos.

**Single-file app growth.** index.html is ~1,700 lines; dashboards will add hundreds
more. It'll survive Phases 0–2. If F10+F13+F14 all land, consider splitting into a small
multi-file build then — but don't restructure pre-emptively.

**Wix overlap.** After F2, the app is the source of truth for identity and progress;
the Wix members-only gate and Velo bridge should be removed, and the Wix site becomes
purely marketing + the embed/link. One system to debug instead of two.

---

## 7. Open decisions for Ryan (answer before the relevant phase)

| # | Decision | Needed by |
|---|---|---|
| D1 | Free taster: lesson 1a only, Week 1, or nothing? | Phase 1 |
| D2 | Exact unlock rule — is "opened the video" enough, or watched-to-end (only enforceable on self-hosted video)? | Phase 0 |
| D3 | Hints/worked examples: Ryan-written or AI-drafted + approved? | Phase 2 |
| D4 | Badge set & streak rules sign-off | Phase 2 |
| D5 | Subscription price + what stays free | Phase 4 |
| D6 | Mastery thresholds confirmed (80/50) and pass mark stays 80%? | Phase 0 |
