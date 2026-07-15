# MasterMaths Learning Platform

A GCSE Maths learning platform for MasterMaths Tutoring. Single‑file static app
(`index.html`) + content file (`mm-content.js`), hosted on GitHub Pages and embedded
in a Wix page via iframe. See `CLAUDE.md` for architecture and `DEVELOPMENT-PLAN.md`
for the roadmap.

## Run it
Open `index.html` (or the GitHub Pages URL). No build step, no npm.

## Backend (Supabase)
Content publishing and (from Phase 1) student accounts use Supabase. Config lives in
the `BACKEND` block near the top of `index.html` (public anon key only — never commit a
service_role key). Storage/content setup is in `BACKEND-SETUP.md`.

### Database schema
Run `supabase/migrations.sql` in the Supabase SQL Editor (idempotent). It creates
`profiles`, `progress` (keyed by user + course + lesson), and `events`, all with
row‑level security.

## Accounts (F1)
Email **+ password** sign‑in (email OTP is deferred — see below). To make it work:

1. **Run the migration** (`supabase/migrations.sql`) — creates `profiles` etc.
2. **Turn OFF email confirmation:** Supabase → Authentication → Providers → Email →
   disable **"Confirm email"** (and keep the Email provider enabled). This lets students
   sign up and be logged in immediately with no email round‑trip.
3. **Deploy the account‑deletion function** so "Delete my account" fully removes the
   login (not just the data rows):
   ```
   supabase functions deploy delete-account --project-ref <your-project-ref>
   ```
   Until it's deployed, delete falls back to removing the user's data rows and signing
   out; the auth login itself is removed only once the function is live.

## ⚠️ Launch blockers / deferred
- **Custom SMTP is NOT configured yet.** Because accounts use email+password with email
  confirmation off, **sign‑in works without SMTP**. But these need it and are deferred
  until it's set up:
  - **Forgot‑password by email** (the login screen currently says "email Ryan to reset").
  - **Email verification** (emails aren't proven to belong to the user yet).
  - **Email OTP** (the originally‑planned passwordless flow).
  Configure a provider (Resend/Brevo/SendGrid), verify a sending domain (SPF/DKIM), then
  Supabase → Authentication → Emails → SMTP Settings, and raise the email rate limit.
- **Data minimisation (minors):** we store email + a nickname + progress only. No real
  names, DOB, or trackers. The display name is a pseudonym ("don't use your real name").

## Repo layout
- `index.html` — the whole app (CSS + HTML + vanilla JS).
- `mm-content.js` — default lesson content (`window.MM_CONTENT`).
- `supabase/migrations.sql` — DB schema.
- `supabase/functions/delete-account/` — Edge Function for full account deletion.
- `CLAUDE.md`, `DEVELOPMENT-PLAN.md`, `BACKEND-SETUP.md` — docs.
