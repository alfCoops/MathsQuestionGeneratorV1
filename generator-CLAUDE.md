# CLAUDE.md — MasterMaths Generation Service (F32)

Project context for Claude Code in THIS repo. This is the **spec-grounded question
generation service** for the MasterMaths learning platform — a separate FastAPI backend,
NOT the single-file app. Do not import that repo's rules (single-file, no-build, vanilla
JS) — they are wrong here. The functional spec is `GENERATOR-SERVICE.md`; read it fully
before planning. The product roadmap this serves is DEVELOPMENT-PLAN.md v2.3 in the app
repo (feature F32; consumers F8, F19, F12).

## What this service does

Given a course (board + qualification + tier), topic and grade band, it drafts original
Edexcel-style questions with misconception-tagged distractors, staged hints and an
M1/A1-style mark scheme — grounded in the exam specification — validates them, checks
them for similarity against real exam material, and inserts them into the platform's
`questions_review` queue in Supabase. **Nothing this service produces is ever
student-facing directly; everything goes through Ryan's approval queue.**

## Stack & conventions

- Python 3.12, FastAPI, uvicorn. Dependency management: `uv` (or pip + requirements.txt
  if uv is unavailable). Type hints everywhere; pydantic models for every request,
  response and corpus record.
- Anthropic SDK for generation (model configurable via env, default `claude-sonnet-4-6`).
- Retrieval: keyed lookup + rank-bm25 over corpus statements. **No vector database** —
  the corpus is small; do not add one without a demonstrated need.
- sympy for numeric answer verification. No other heavyweight deps without discussion.
- Supabase access via its REST API with the service key (server-side only).
- Tests: pytest. Every validator gets unit tests; the pipeline gets golden tests
  (fixed seed inputs → structurally valid outputs); the similarity check gets a
  seeded-near-copy test that MUST bounce.
- Deploy target: Render (Dockerfile or native Python). Health endpoint required.
- Repo is **private**. Never enable any pages/static hosting here.

## Hard rules

1. **Copyright — the load-bearing rule.** Tier-2 sources (Edexcel/other-board past
   papers, PMT compilations) are analysis-only: their text NEVER enters a generation
   prompt, is NEVER committed to this repo (no paper PDFs, no extracted question text),
   and is NEVER stored in the database. Only derived artefacts are stored: the style
   guide, and shingle/MinHash fingerprints for the similarity check (hashes are not
   recoverable text — that is the point). The output similarity check is a REQUIRED
   pipeline stage; any change that bypasses or disables it is out of policy.
2. **Corpus is board+qualification+tier keyed.** Every statement, style guide and
   generated item carries `board`, `qualification`, `tier`, `spec_ref`. `spec_ref`
   alone is ambiguous across boards — never use it as a bare key.
3. **Tier validation is strict.** A Higher-only spec statement must never ground or
   pass a Foundation-tier generation. The Foundation/Higher delta is data, not vibes.
4. **Secrets server-side only.** ANTHROPIC_API_KEY, SUPABASE_SERVICE_KEY live in env
   (Render dashboard / .env which is gitignored). Never in code, never in responses,
   never logged.
5. **Auth on every mutating endpoint.** Batch/generate endpoints verify a Supabase JWT
   with `role='teacher'` (or an internal cron secret). No open endpoints that write.
6. **Every generated item is traceable:** prompt version, model, corpus statements used,
   validator results and similarity score are stored alongside the item in the review
   queue. If Ryan asks "why did it write this?", the answer must be reconstructable.
7. **Original questions only.** The system prompt for generation must instruct original
   Edexcel-STYLE composition and must not contain retrieved paper text (see rule 1).
   Numeric contexts, names and scenarios must be freshly composed.
8. **Commit per milestone** (M1 corpus+retrieval, M2 generation+validators, M3
   similarity+queue, M4 few-shot loop — see GENERATOR-SERVICE.md §7). Tests pass before
   each commit; update the milestone checklist in the same commit.

## Working assumptions

- First and only loaded course: `gcse-edexcel-foundation` (with the Higher statement set
  loaded too, for tier-delta validation). Other boards/qualifications: schema supports
  them, no data yet (plan D15 pending).
- Raw corpus input is `corpus/raw/edexcel-gcse-fh-2026-07-17.md` — a mangled copy-paste
  of the Edexcel 1MA1 Foundation and Higher specs. M1 includes cleaning it into
  structured YAML; flag low-confidence statements for Alfie's manual review rather than
  guessing (a mis-filed spec_ref silently mis-grounds every question that uses it).
- Review-queue target table and columns are defined in GENERATOR-SERVICE.md §5 and must
  match the platform's migration (`questions_review`).
- Cost posture: batch drafting is fine, but default batch sizes small (≤10) until Alfie
  has seen real token costs.

## Verify checklist (every milestone)

- [ ] pytest green, including the seeded near-copy bounce test (from M3)
- [ ] No paper text anywhere in repo, DB, prompts or logs (grep the diff)
- [ ] Generated sample (fixed seed) eyeballed: spec_ref legal for tier, marks sum,
      distractors each carry a misconception, mark scheme in M1/A1 notation
- [ ] Secrets absent from the diff
- [ ] GENERATOR-SERVICE.md milestone checklist updated in the same commit
