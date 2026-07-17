# MasterMaths Platform — Development Plan v2.1 (MoSCoW)

Last updated: 17 July 2026 · Owner: Alfie · Product owner: Ryan
v2.1 records Ryan's D1–D6 answers, folds his 15-07-26 improvements into the remaining
phases as F26–F31, and restructures Phases 2b→5 accordingly. Phase 0, 1 and 2a build
notes/deviations are preserved from v2. Status: ☐ not started · ◐ in progress · ✅ done · ⏸ parked · ✖ won't

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
| T3 | **Configure custom SMTP (Resend)** in Supabase, then switch on email verification + password reset (closes F1's deferral) | Launch blocker from Phase 1; also a prerequisite for F30 streak emails | ☐ (Ryan/Alfie — not a code task) |

**T1 build note.** The taster is a new setting `freeWeeks` (default `1`), resolved against the
course's own week list, so it's `1a–1d` today and stays correct if Ryan adds a lesson to Week 1.
It had to be a *new* key: the published cloud row already carries `SETTINGS:{"freeLessons":["1a"]}`,
which is `Object.assign`ed over the code defaults — so changing the `freeLessons` default alone
would have looked right locally and silently kept the taster at 1a in production. `freeLessons`
still works as an explicit allowlist, and setting `freeWeeks:0` hands control back to it.
Verified against the real published SETTINGS: 1a–1d free, 2a not.
**Scope note:** T1 changes the *sign-in* gate only. Sequential unlocking (F3/D2) still applies to
the taster, so a logged-out visitor opens 1a and unlocks 1b by finishing it — same rule as a
signed-in student. Say if the taster should bypass sequential unlocking too.
**T2 note.** Renamed the step label, section card, results copy, "continue" banner label and the
editor's question panel. Left the short action buttons ("Start Quiz", "Retry Quiz", "Exit Quiz")
alone — they sit under the "Diagnostic Quiz" heading and read fine; "Start Diagnostic Quiz" would
widen the card's button row.

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
| F26 | **Rich-text authoring** in Teacher Editor: toolbar (size, bold, underline, colour), no raw HTML; image insert with placement + labels in Key Notes | **Must** | M–L | — | **2b** | ☐ |
| F28 | **SEND round 2**: coloured-overlay button (range of tints incl. yellow), yellow page tint option, OpenDyslexic added as a font choice | Should | S–M | F16 | **2b** | ☐ |
| F29 | **Content extras**: motivational quote per week · calculator/non-calculator icon per lesson · sequential video reveal (video n+1 appears after opening video n) | Should | S–M | — | **2b** | ☐ |
| F27 | **Worksheet mark schemes**: per-section answers/mark scheme authored in editor; student-side reveal after attempt + printable answers page | Should | S–M | F26 helps | **2b** | ☐ |
| F31 | **Standing 1-to-1 CTA**: persistent "Book one-to-one tutoring →" button (dashboard + lesson header) to the Wix booking page | Should | S | — | **2b** | ☐ |
| F11 | Per-question results + topic + misconception tags | Should | M | F2 | 2c | ☐ |
| F7 | Resume at exact point | Should | M | F2 | 2c | ☐ |
| F8 | Quick Help — staged hints (+ pictures) | Should | M | F26, authoring | 2c | ☐ |
| F9 | Badges & streaks (in-app; emails split to F30) | Should | M | F2 | 2c | ☐ |
| F10 | Teacher dashboard (+ struggling flags, **+ comp-access toggle per student**) | Should | L | F11 | 3 | ☐ |
| F21 | End-of-unit summary + tutoring signpost | Should | M | F11 | 3 | ☐ |
| F30 | **Streak reminder emails**: opt-in at signup, one-click unsubscribe, daily cron | Could | M | F9, T3 (SMTP) | 3 | ☐ |
| F19 | Quiz engine v2 (misconception distractors, variant pools, grade stepping) | Should | L (+authoring) | F11, AI drafting | 4 | ☐ |
| F12 | Adaptive generator (timer opt-in per D2 ethos, working-at grade, Edexcel-style) | Could | L | live AI generator, F11 | 4 | ☐ |
| F20b | Interactive "From Method to Meaning" worksheets | Could | L | F16, F26 | 4 | ☐ |
| F18 | Digital maths toolkit (number line, hundred square, ×-grid, fraction bars, counters) | Could | XL | — | 5 | ☐ |
| F14 | Subscriptions: £19.99/mo, Week 1 free, **manual comp-access for weekly 1-to-1 students**, on/off toggle | Could | XL | F1, F10 (comp UI) | 5 | ☐ |
| F13 | Parent dashboard (Sherpa-style, view-only) | Could | L | F10 | 5 | ☐ |
| F23 | Weekly Q&A (stream + upvote queue + archive) | Could | M–L | F1 | 5 | ☐ |
| F24 | Points + leaderboard (opt-in, display names) | Could | M | F1, F9 | 5 | ☐ |
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

**Phase 3 — Visibility & retention.**
F10 teacher dashboard (now also the home of the **comp-access toggle** per D5) → F21
end-of-unit summaries with tutoring signpost → F30 streak emails (needs F9 + T3).

**Phase 4 — Advanced learning.** F19 quiz v2 (start the authoring pipeline during 2c —
see §4) · F12 adaptive generator once FastAPI is live · F20b interactive worksheets.

**Phase 5 — Commercial & community.** F14 subscriptions (spec now concrete per D5) ·
F13 parent portal · F23 weekly Q&A · F24 leaderboard.

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

## 4. Authoring pipeline (unchanged, now urgent)

Start during Phase 2c: FastAPI generator drafts variant questions + misconception
distractors + staged hints for 1a–1d into a review queue; Ryan clears it weekly. F19's
engine without an approved question pool is an empty feature. Ryan writes "From Method
to Meaning" tasks himself; F26 is what makes that pleasant.

## 5. Data model deltas (on top of v2 §5)

| Change | Detail |
|---|---|
| `profiles` | + `streak_emails_opt_in` bool default false, + `comp_access` bool default false |
| content schema | + week.quote, lesson.calculator ('allowed'/'not-allowed'/absent), video sequential-reveal flag; F26 stores sanitised rich HTML in existing fields |
| worksheet schema | + markScheme per section (F27) |
| `email_log` | NEW — streak emails sent (dedupe/caps for F30) |

## 6. Risks & obligations (additions to v2)

- **Emailing minors (F30):** opt-in only, unsubscribe in every message, capped frequency.
  If in doubt about tone, the test is "would a parent reading it over their shoulder object?"
- **Rich-text output (F26):** sanitise on save AND on render — the editor becomes an HTML
  injection surface if either side trusts input. Keep the allowed-tag list short.
- **Default font (D13):** don't switch the whole platform to OpenDyslexic on a list item —
  get Ryan's confirmed yes after seeing the trade-off. (Licence itself is fine: SIL OFL.)
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

**Still open:**

| # | Decision | Needed by |
|---|---|---|
| D7 | Course tile naming/order; which boards/tiers shown "coming soon" | cosmetic now — before marketing |
| D8 | Foundation grade cap for stepping (grade 5?) + 2-fail/2-pass sign-off | Phase 4 |
| D9 | Leaderboard opt-in default OFF — confirm | Phase 5 |
| D10 | Display-name policy (moderation/suggestions) — confirm shipped behaviour is fine | soon (accounts live) |
| D12 | Q&A platform (YouTube Live vs Zoom) + cadence | Phase 5 |
| **D13** | **Default font: keep Inter with dyslexia fonts one tap away, or OpenDyslexic everywhere?** (see F28 note) | Phase 2b |
| **D14** | **Streak email details: send time (17:00?), copy tone, max misses before stopping** | Phase 3 |