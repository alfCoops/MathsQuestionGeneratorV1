# `/v1/import` — spec for the generator-service repo (not yet implemented)

This is the contract the app (`index.html`, `doQuestionImport()`) already calls
from the Teacher Editor's "📥 Import Question" panel. It doesn't exist yet —
the app treats any non-ok response (or a 404) as "import unavailable" and
tells the teacher plainly, without losing their uploaded file. This belongs in
the **separate FastAPI generator-service repo** (`generator-CLAUDE.md`), not
this one — it's the only place in this system that legitimately holds an LLM
API key server-side.

**Scope note (read before implementing):** this endpoint is for a teacher's
**own** worksheets/material only — never copyrighted exam papers. That's not
an oversight to fix later; it's a deliberate, standing ruling (see
DEVELOPMENT-PLAN.md) — copyright protects exam questions themselves, and
reformatting a lifted question doesn't launder it. Don't add exam-paper
handling to this endpoint even if asked; the AI generator (`/v1/batch`) is the
legitimate route to Edexcel-style questions on a given topic.

## Request

```
POST /v1/import
Headers: Authorization: Bearer <supabase access token>   (sent automatically by genFetch
                                                            when the teacher has a session)
Content-Type: application/json

{
  "bucket":   string,        // always "imports" (the private Supabase Storage bucket)
  "path":     string,        // storage object path the app already uploaded the file to
  "courseId": string,
  "lessonId": string|null    // null when the teacher didn't have a specific lesson selected
}
```

The service fetches the file from Supabase Storage itself (its own
service_role key already has legitimate access, same as every other
Storage-reading thing it does today) — the app never sends file bytes inline.

## Response

```
{
  "question_html": string,   // required — extracted question, as HTML/MathML/LaTeX-in-HTML
                              // matching the format the app already renders elsewhere
  "mark_scheme":   string,   // optional, "" if none found
  "marks":         number|null,
  "hints":         [ { "stage": string, "text": string } ],   // optional, [] if none found
  "tables_html":   string,   // optional raw HTML for any table(s) in the source, "" if none
  "parts":         string[], // optional, one entry per sub-part (a, b, c…), [] if not multi-part
  "figure_flag":   boolean,  // true if the source had a diagram/graph/image the extraction
                              // couldn't reproduce — the teacher attaches a cropped image of
                              // it themselves afterwards (existing F26 image-upload button),
                              // deliberately NOT a diagram-vectorisation pipeline
  "source_info":   string    // optional short provenance note, e.g. the original filename
                              // or a page/section reference — free text, shown to the teacher
}
```

- `question_html` missing (or the response otherwise not shaped like this) is
  treated by the app as "extraction failed" — same "unavailable, nothing
  broke" fallback as a non-2xx status.
- **One question/section per upload.** If the source document contains
  multiple distinct questions, extract the first/primary one — don't return
  an array. Auto-splitting a multi-question document into several bank
  entries is out of scope for this pass.
- **Free-response shape only.** No `options`/`answer`/MCQ shape — this
  mirrors the existing AI-generated free-response items exactly, since the
  app inserts the result with `kind:'generator'` and it flows through the
  same `practice_questions` view as everything else in that pipeline.

## Auth (required — teacher-only, stricter than `/v1/grade`)

Verify the bearer token is a real, currently-valid Supabase JWT **and** that
the signed-in account has `profiles.role = 'teacher'` before touching the
file or calling the LLM. Unlike `/v1/grade` (any signed-in student is fine
there), this endpoint reads from a private bucket and feeds a review queue
that ultimately reaches every student — a non-teacher token must get 401/403,
not just a courtesy check. The database-side insert into `questions_review`
is separately gated by RLS (`supabase/migrations.sql`, "teacher inserts
import" policy) — this endpoint's own check is the first line of defense,
not a redundant one, since the file read itself needs gating too.

## Nature of the work (different from the rest of this service)

Every other endpoint here (`/v1/batch`, `/v1/grade`) is pure-text generation
or grading from a prompt. This one is **document extraction** — reading a
PDF, Word doc, or photographed/scanned worksheet and pulling structured
content out of it (text, maths notation, tables, multi-part structure).
That's a Claude document/vision-input workload, architecturally distinct from
the text-only prompts elsewhere in this service — plan the implementation
(model choice, input handling, file-type branching for PDF vs. image vs.
Word) accordingly rather than reusing the `/v1/batch` prompt path as-is.

## CORS

Must allow `https://learn.mastermathstutoring.co.uk` (and `http://localhost:*`
for local testing), matching whatever's already configured for `/v1/batch`,
`/v1/grade`, and `/v1/corpus/*`.

## Out of scope for this doc

Building the actual endpoint (including the document-understanding pipeline
itself) is separate work — this file only fixes the contract so the app side
(already shipped) and the service side can be built independently without
renegotiating the shape later.
