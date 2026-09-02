# `/v1/grade` — spec for the generator-service repo (not yet implemented)

This is the contract the app (`index.html`, `mmGrade()`) already calls for the "From
Method to Meaning" mountain journey's AI-graded written answers. It doesn't exist yet —
the app treats any non-ok response as "grading unavailable" and falls back to its
original behaviour (any non-empty answer advances), so nothing here blocks students
while this is unbuilt. This belongs in the **separate FastAPI generator-service repo**
(`generator-CLAUDE.md`), not this one — it's the only place in this system that
legitimately holds an LLM API key server-side.

## Request

```
POST /v1/grade
Headers: Authorization: Bearer <supabase access token>   (sent automatically by genFetch
                                                            when the student has a session)
Content-Type: application/json

{
  "question": string,                 // the question HTML/text, unchanged from mm-content.js
  "stage": "Clarify"|"Justify"|"Challenge"|"Generalise",
  "grade": string,                    // e.g. "Grade 2-3" — cur.worksheet[i].grade
  "accepted_answer_bank": string[],   // key reasoning points a correct explanation should
                                       // cover — always [] for now (Ryan hasn't authored
                                       // this content yet; treat an empty bank as "use your
                                       // own judgement against the question and stage")
  "student_answer": string
}
```

## Response

```
{ "correct": boolean, "feedback": string }
```

- `feedback` — one short, encouraging sentence. On `correct:false`, it should **probe, not
  reveal** — same principle as Ryan's "Talk it out" tutor brief (ask a question or point at
  what's missing, never hand over the answer). On `correct:true` it can briefly affirm what
  the student demonstrated.
- Any other shape (missing `correct`, wrong type, non-2xx status) is treated by the app as
  "grading unavailable" — so an incomplete implementation degrades safely rather than
  silently breaking.

## Auth (required)

Verify the bearer token is a real, currently-valid Supabase JWT before calling the LLM —
**any signed-in role is fine** (this isn't teacher-only like `/v1/batch`). This is purely an
abuse/cost guard: an unauthenticated public endpoint that triggers an LLM call would let
anyone run up the API bill. A request with no token, or a token that fails verification,
should return 401 — the app already treats that as "unavailable" and falls back cleanly.
Note: lesson 1a is free without an account (D1), so a signed-out student simply never gets
graded answers on that lesson — expected, not a bug to fix here.

## CORS

Must allow `https://learn.mastermathstutoring.co.uk` (and `http://localhost:*` for local
testing), matching whatever's already configured for `/v1/batch` and `/v1/corpus/*`.

## Out of scope for this doc

Building the actual endpoint, and authoring real `accepted_answer_bank` content per
question, are separate pieces of work — this file only fixes the contract so the app side
(already shipped) and the service side can be built independently without renegotiating
the shape later.
