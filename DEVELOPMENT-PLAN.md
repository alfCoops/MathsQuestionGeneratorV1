# MasterMaths Platform — Development Plan v2.2 (MoSCoW)

Last updated: 17 July 2026 · Owner: Alfie · Product owner: Ryan
v2.2 adds F32 (spec-grounded generation service — the RAG backbone for F19/F12 and the §4
authoring pipeline). v2.1 records Ryan's D1–D6 answers, folds his 15-07-26 improvements into the remaining
phases as F26–F31, and restructures Phases 2b→5 accordingly. Phase 0, 1 and 2a build
notes/deviations are preserved from v2. Status: ☐ not started · ◐ in progress · ✅ done · ⏸ parked · ✖ won't

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
| T1 | Free taster → **all of Week 1** (1a–1d browsable logged-out) | Ryan's D1; currently 1a only | ✅ (26a5d1a) |
| T2 | Rename "Quiz" → **"Diagnostic Quiz"** everywhere (section card, progress step label, results copy) | Ryan's ask; trivial; do before screenshots/marketing | ✅ (26a5d1a) |
| T3 | **Configure custom SMTP (Resend)** in Supabase, then switch on email verification + password reset (closes F1's deferral) | Launch blocker from Phase 1; also a prerequisite for F30 streak emails | ☐ (Ryan/Alfie — not a code task) |

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
| F9 | Badges & streaks (in-app; emails split to F30) | Should | M | F2 | 2c | ☐ |
| F10 | Teacher dashboard (+ struggling flags, **+ comp-access toggle per student**) | Should | L | F11 | 3 | ☐ |
| F21 | End-of-unit summary + tutoring signpost | Should | M | F11 | 3 | ☐ |
| F30 | **Streak reminder emails**: opt-in at signup, one-click unsubscribe, daily cron | Could | M | F9, T3 (SMTP) | 3 | ☐ |
| F32 | **Spec-grounded generation service** (FastAPI): Edexcel-spec retrieval, style guide, validators, similarity check, review-queue output | **Should** | L | FastAPI hosting; feeds F19/F12/F8 | **2c–3** | ☐ |
| F19 | Quiz engine v2 (misconception distractors, variant pools, grade stepping) | Should | L (+authoring) | F11, **F32** | 4 | ☐ |
| F12 | Adaptive generator (timer opt-in per D2 ethos, working-at grade, Edexcel-style) | Could | L | **F32**, F11 | 4 | ☐ |
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
F11 ✅ (schema designed for F19: topic, misconception, grade band, variant group from day
one) → F7 ✅ exact-point resume → F8 ✅ staged hints (AI-drafted per D3, authored via F26's
editor) → F9 badges & streaks (in-app only; emails are F30).

**F8 build note (done).** Each Diagnostic Quiz question can carry an ordered `hints[]` (rich
HTML via F26, so images are allowed), authored in the editor with add/remove hint fields. On
the quiz a "💡 Need a hint?" button reveals them one at a time (gentle → nearly-the-method),
shown before answering and hidden once answered; a "that's all the hints" line closes the set.
Hint usage rides into F11 as `quiz_results.meta.hints_used` per question — a scaffolding signal
for F10/F21. All optional/back-compatible: a question with no hints shows no button and gains
no key; verified a lesson without hints round-trips byte-identical. The AI-drafting of hint
text is F32's job; F8 is the authoring + staged-reveal surface.

**F7 build note (done).** URL-based and reload-safe: the lesson hash gains an optional
`/section` segment (`#/<course>/<lesson>/<section>`). As the student opens an activity
(learn/quiz/worksheet/generate) the URL is kept current via `history.replaceState` (no history
spam) and mirrored to `last_location`, so a raw reload — or the F5 "Continue where you left
off" banner, which now links to the exact section — reopens that activity and scrolls to it.
Plain navigation to a lesson (no section) still lands at the top, unchanged. Extends F5 rather
than replacing it: F5 only knew your section once you *completed* a step; F7 tracks what you're
*viewing*. Verified: parse, resume-on-load, URL sync, clean plain-load, banner link.

**F11 build note (done).** `quiz_results` table (migration in `supabase/migrations.sql`, run
by Alfie). On finishing the Diagnostic Quiz, a signed-in student writes one row per question
(best-effort insert; RLS own-row) under a per-sitting `attempt_id` (regenerated on each
retry). A wrong answer records the chosen distractor's named misconception; correct/untagged
→ null. Teacher Editor gained per-question **Topic** + **Grade** fields and a per-option
**misconception** field; all optional and only stored when authored, so existing questions and
all lessons round-trip byte-identical. The row-builder is a pure function (`quizResultRows`)
and was unit-tested for the topic/misconception/correct mapping; the DB insert no-ops safely
when signed out. Tags travel with published content. **Not yet live-tested against the DB**
(needs a signed-in sitting) — structurally verified and RLS-compatible; take one quiz signed
in and check the `quiz_results` table to confirm end-to-end.
**In parallel: F32** — the generation service is backend-only work (FastAPI, separate
repo/host), so it runs alongside the app-side 2c features without contention, and its
output starts filling the review queue for Ryan immediately.

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
**AC:** ✅ Ryan formats with size/bold/underline/colour/list without seeing HTML (one shared
sticky toolbar acts on the focused field) ✅ image placed inline in Key Notes with a visible
label ("Figure 1" caption via `<figure><figcaption>`), referenceable from a question ✅ all
existing lessons open→save byte-identical (verified across 1a–1d) ✅ Word/web paste cleaned
on the way in (paste handler sanitises before insert) ✅ output sanitised on BOTH save and
load — script/style/iframe dropped, every `on*`/`javascript:` stripped, `style` rebuilt from
a 6-property allow-list, `img src` limited to https/data-image.
**Build notes / deviations:**
- **Sanitiser** is DOM-based (`DOMParser` into an inert doc — no regex, nothing executes/loads),
  allow-list derived from an audit of the real published content; unknown tags are *unwrapped*
  (text kept) so Ryan's words can't vanish. Applied at load in `buildCourses()` — the single
  funnel every content source flows through — and at save in `richValue()`.
- **`richValue()` rewritten**, not extended: the old one stripped *all* `style`, which would have
  killed the colour/size this feature adds. New style handling is allow-list based.
- **One shared toolbar**, not per-field: per-field would have been ~780 buttons in the form
  (10 quiz Qs × 6 fields × 13 controls) and made the editor crawl. Now 14 buttons total, editor
  rebuild ~5ms.
- **Fixed a latent editor bug found while proving the "no corruption" AC**: opening any lesson
  and saving used to inject `masteryThresholds`/`sectionTimes` defaults into lessons that never
  had them (schema noise in every diff). Now only persisted when non-default.
- **Also normalised a live latent issue**: quiz options/feedback were rendered as HTML but
  authored in plain inputs, so Ryan's literal `<`/`>` went unescaped into innerHTML. They're
  rich fields now and escape properly.
- **Drag-to-position:** shipped as insert + caption + move within Key Notes (drag-reorder inside
  contenteditable is fragile) — flagged in the plan discussion, meets "placed inline, labelled,
  referenced". True drag-reorder deferred to F20b/later if Ryan wants it.

### F27 · Worksheet mark schemes — Should, Phase 2b, S–M
Each "From Method to Meaning" section gains an authored mark-scheme block (via F26's
editor). Student side: a "Show mark scheme" reveal after they confirm they've attempted
the section, and an answers appendix on the printable version (toggle so Ryan can print
with or without answers).
**AC:** ✅ mark scheme per section, editable (rich `s-ms` field via F26; only stored when
authored, so sections without one stay back-compatible) ✅ hidden until attempt is confirmed
(the "✓ I've attempted this — show mark scheme" button is the confirmation; clicking reveals
it and hides the button) ✅ print supports with/without answers (an "Include answers when
printing" checkbox toggles `#wsPrintArea.with-answers`; mark schemes are `display:none` in
print unless it's ticked). Verified: block hidden by default, reveals on click, back-compat
lesson round-trips identical with no new key, zero console errors.

### F28 · SEND round 2 — Should, Phase 2b, S–M
Extends F16's panel: an **Overlay** button offering a range of coloured tints (yellow,
cream, blue, pink, grey — the standard visual-stress set) applied as a translucent layer;
a yellow page-background option; **OpenDyslexic added as a selectable font** alongside
Atkinson Hyperlegible.
**Default-font note (D11/Ryan 15-07):** Ryan asked for OpenDyslexic everywhere. Evidence
on OpenDyslexic is mixed and some students read it *slower*; current shipped default is
Inter with dyslexia fonts one tap away. Flagged back to Ryan as D13 — if he confirms
after that context, flipping the default is a one-line change. Don't flip silently.
**AC:** ✅ overlays apply over all content incl. images (fixed `body::after`, pointer-events:none
so it never blocks clicks), per-user persisted (localStorage + profiles.prefs via F16's sync)
✅ OpenDyslexic selectable (SIL OFL), lazy-loaded from jsDelivr only when chosen ✅ default
follows D13 — unchanged (Inter); OpenDyslexic is a third font option, not the default.
**Build notes:**
- **Overlay** = a translucent full-page layer (Irlen-style visual-stress tint), tints: yellow,
  cream, blue, pink, grey. Kept low-alpha so text stays legible. This subsumes the separately
  listed "yellow page-background" — a yellow overlay and a yellow page tint are the same felt
  effect for the reader, so one control rather than two near-duplicates (say if a distinct
  behind-the-text paper tint is wanted instead).
- **Fonts** now: Standard (Inter) · Atkinson · OpenDyslexic — both dyslexia fonts lazy-load from
  their CDN only when selected (same opt-in pattern as F16's Atkinson), zero cost otherwise.
- **D13 answered** (Ryan, via Alfie): ship OpenDyslexic as a selectable option, leave the
  default as-is → done. See §7.

### F29 · Content extras — Should, Phase 2b, S–M
Three small schema+UI additions, all editable in the Teacher Editor:
1. **Motivational quote per week** — shown above the week's lessons on the pathway/dashboard.
2. **Calculator icon per lesson** — Ryan picks 🧮 allowed / 🚫 non-calculator per lesson
   (Edexcel-authentic); chip shows next to grade/duration.
3. **Sequential video reveal** — within a lesson, video n+1 appears only after video n is
   opened (less on the page, per Ryan's SEND ethos; plays well with F16's one-at-a-time).
**AC:** ✅ all three editable per week/lesson (week quote in the Weeks panel; calculator select
+ "reveal videos one at a time" checkbox in Basics) ✅ back-compatible — absent/false fields
mean no quote, no chip, all videos shown; verified a lesson without them opens→saves
byte-identical and gains no keys ✅ reveal state persists via progress (`videoReveal` in the
lesson's steps, so it syncs to the cloud too).
**Build notes:** calculator chip renders 🧮 Calculator / 🚫 Non-calculator beside grade+duration;
quote shows as an italic line under the week label in the sidebar (sanitised via F26). Sequential
reveal shows only the first video plus a "🔒 Watch the video above to unlock the next one" hint;
watching the latest revealed video reveals the next.

### F32 · Spec-grounded generation service — Should, Phase 2c–3, L
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

### F31 · Standing 1-to-1 CTA — Should, Phase 2b, S — ✅ done
Persistent, understated "Book one-to-one tutoring →" button on the course dashboard and
lesson header, linking to the Wix booking page. Complements (doesn't replace) F21's
targeted signpost. Hidden in focus mode.
**Built:** a `bookingUrl` **site setting** (editable in the Teacher Editor, publishes with the
content), defaulting to `https://www.mastermathstutoring.co.uk`. Renders an understated green
pill on the dashboard header and each lesson's title row; `no-print`; hidden in focus mode
(`html.pf-focus .book-cta{display:none}`); blank URL hides it everywhere.
**⚠ Needs from Ryan:** the exact Wix **booking** page URL — the default points at the site root,
not the booking flow. One field in the editor (📞 Book 1-to-1 tutoring link), then Save. Like
`freeWeeks`, `bookingUrl` is a new SETTINGS key so the current published cloud row (which lacks
it) won't override the default.

### Amendments
- **F14 (per D5):** price **£19.99/month**; free tier = **Week 1** (matches T1); plus a
  **comp-access flag** per student — set manually by Ryan in the teacher dashboard (F10)
  for students with a weekly recurring one-to-one booking, revoked when they stop. Stripe
  can't see his tutoring diary, so this is deliberately manual. F10 gains the toggle UI;
  F14 checks `subscription active OR comp_access OR free tier`.
- **F9 (per D4):** badge set + streak rules signed off; email reminders are **F30**, not F9.
- **F8 (per D3):** AI-drafted hints/examples with Ryan approval confirmed as the workflow.
- **F12 (per D2 ethos):** timers remain strictly opt-in.

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

## 6. Risks & obligations (additions to v2)

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
| ~~D13~~ | **ANSWERED:** ship OpenDyslexic as a selectable option, keep the default as-is (Inter). Done in F28. | ~~Phase 2b~~ |
| **D14** | **Streak email details: send time (17:00?), copy tone, max misses before stopping** | Phase 3 |