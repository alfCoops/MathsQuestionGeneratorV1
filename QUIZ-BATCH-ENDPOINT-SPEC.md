# `/v1/batch` extension for `kind:"question"` — spec for the generator-service repo (not yet implemented)

This is an **extension** to the existing `/v1/batch`/`/v1/batch/{job_id}` contract
(already built and live — `kind:"generator"` free-response batches work today),
not a new endpoint. The app (`index.html`, `genQuizQuestionBatchBody()`) already
calls it with `kind:"question"` from the Teacher Editor's Generate tab, gated
behind a "🎯 Quiz diagnostic question (MCQ)" option — until this repo's side is
built, requesting that kind degrades the same "unavailable, nothing broke" way
`/v1/import` and `/v1/grade` already do (a non-2xx or a malformed job is shown
to the teacher as an error, nothing reaches a student). This belongs in the
**separate FastAPI generator-service repo** (`generator-CLAUDE.md`), not this
one — it's the only place in this system that legitimately holds an LLM API key
server-side.

## Why this exists

F19 (Adaptive Diagnostic Quiz v2) needs an approved bank of MCQ questions, each
tagged to a specific learning objective, with misconception-mapped distractors
and a scaffold ladder — so a live quiz can route a wrong answer back to a
fresh question targeting the SAME misconception instead of just moving on.
Ryan's own stated rule: **generation and delivery are separate systems** — the
live quiz never asks the AI to invent a question on the spot; it only ever
selects from what's already been generated and teacher-approved here.

## Request

Exactly the existing `/v1/batch` body, plus two new required fields when
`kind` is `"question"`:

```
POST /v1/batch
Headers: Authorization: Bearer <supabase access token>   (unchanged — teacher-only, same as today)
Content-Type: application/json

{
  "course_id":   string,             // unchanged
  "topic":       string,             // unchanged — one of /v1/corpus/{course_id}/topics
  "grade_band":  number,             // unchanged
  "kind":        "question",         // NEW value — existing "generator"/"hints" behaviour is unaffected
  "n":           number,             // unchanged, capped at 10 from this app's UI (service caps at 50)
  "calculator":  "allowed"|"not-allowed",  // unchanged, optional

  "objective_id":    string,   // NEW, required when kind="question" — e.g. "oo-1"
  "objective_label": string    // NEW, required when kind="question" — e.g. "Apply multiplication
                                //   and division before addition and subtraction". This is the
                                //   actual instruction to the model: write questions that assess
                                //   THIS specific rule, not a generic question on the topic.
}
```

Job polling (`GET /v1/batch/{job_id}`) is completely unchanged.

## Response items (what lands in `questions_review`)

Every accepted item is inserted exactly as `kind:"generator"` items are today,
with `kind:"question"` and **`objective_id` set to the request's
`objective_id`** (a real column on `questions_review`, not inside `payload` —
see `supabase/migrations.sql`'s F19 section). Do **not** set `eligible_start`
— whether a question is allowed to open a quiz is a teacher-only decision made
in the review queue, never something the generator decides.

The `payload` shape reuses the **existing, already-shipped** contract
documented in `index.html` right above `renderStagedHints`/`renderScaffoldParts`
(search for "§4 GENERATOR ITEM CONTRACT" and "§4 SCAFFOLD CONTRACT") —
this doc intentionally doesn't restate it field-by-field, since it's the same
shape already proven by `kind:"generator"` batches:

- `question_html`, `options` (**exactly 4**, each `{text, correct?, misconception?, misconception_feedback?}`
  — exactly one `correct:true`; the other 3 each carry a short, reusable
  `misconception` label and its own `misconception_feedback`), `correct_feedback`.
- Scaffold rungs (`scaffold_level` 1–5+) are **separate response items**
  sharing `variant_group` with their level-0 diagnostic parent, each with
  `target_misconception` + `parent_item` + the level-gated `scaffold.{reminder,
  sub_question, partial_working, guided_choices}` parts — same monotone-ladder
  contract already shipped for `kind:"generator"` (p6–p8).
- **Reuse a misconception label already seen for this `objective_id` when the
  same underlying mistake recurs across a batch or across separate batches,
  rather than minting a new spelling each time.** This is the actual guard
  against the review queue's dashboard grouping/adaptive routing breaking on
  inconsistent tagging — few-shot the model with this objective's prior
  approved labels if any exist.

## Depth requirement (Milestone 1 acceptance bar, not something this endpoint enforces itself)

For each of the 3 seeded Order-of-Operations objectives (`oo-1`, `oo-2`,
`oo-3` — see `OBJECTIVES` in `index.html`), Ryan needs **at least 5 approved
templates**, spanning different difficulty levels, different misconception
patterns, and at least one scaffold ladder per misconception. The review
queue is the enforcement point (a teacher can see there are only 2 approved
items for an objective and request more) — this endpoint's job is just to
produce good candidates quickly, batch by batch.

## Auth

Unchanged from `/v1/batch` today — teacher-only. Verify the bearer token is a
real, currently-valid Supabase JWT **and** the signed-in account has
`profiles.role = 'teacher'`.

## CORS

Unchanged — `https://learn.mastermathstutoring.co.uk` and `http://localhost:*`.

## Out of scope for this doc

Building the actual `kind:"question"` generation prompt/pipeline is separate
work — this file only fixes the contract so the app side (already shipped)
and the service side can be built independently without renegotiating the
shape later.
