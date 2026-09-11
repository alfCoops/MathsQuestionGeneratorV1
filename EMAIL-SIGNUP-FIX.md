# Fixing "Error sending confirmation email" (about 10 minutes)

**What's happening:** this is not a bug in the app — it's Supabase's own built-in
email sender. Every new Supabase project ships with a shared, free mail service
that's deliberately very limited (a handful of emails per hour) and explicitly
**not meant for real use** — it's there so you can test signup once or twice
before setting up a real mail provider. Once the pilot has more than a couple
of students signing up, it starts failing with exactly the error you're seeing.

The fix is to point Supabase at a real (still free) mail provider — **Resend**.
If you already did the streak-reminder-email setup (F30), you already have a
Resend account and API key; this reuses it. If not, it's the same free signup.

---

## Step 1 — Get a Resend API key (skip if you already have one from F30)

1. Go to **https://resend.com** → sign up (free — 3,000 emails/month, no card).
2. **Domains** (left sidebar) → add and verify your domain
   (`mastermathstutoring.co.uk`) by adding the DNS records Resend shows you
   wherever you manage your domain's DNS. This can take a few minutes to
   verify — email sending won't work until it shows "Verified".
   - No domain to verify yet? You can use Resend's shared `onboarding@resend.dev`
     sender to unblock testing today, then switch to your own domain later —
     see Step 2's "From email" note.
3. **API Keys** (left sidebar) → **Create API Key** → copy it. You won't be
   shown it again.

## Step 2 — Point Supabase's Auth emails at Resend

1. In Supabase → **Project Settings → Authentication** (or **Authentication →
   Settings**, wording varies by Supabase version) → find **SMTP Settings**
   (sometimes under "Email" or an "Enable Custom SMTP" toggle).
2. Turn on **Enable Custom SMTP** and fill in:
   - **Sender email**: an address at your verified domain, e.g.
     `noreply@mastermathstutoring.co.uk` (or `onboarding@resend.dev` if you
     skipped domain verification above — swap this later).
   - **Sender name**: `MasterMaths Tutoring`
   - **Host**: `smtp.resend.com`
   - **Port**: `465`
   - **Username**: `resend`
   - **Password**: your Resend API key from Step 1.
3. **Save**.

## Step 3 — Test it

Try creating a brand-new test account (a fresh email address you haven't used
on the site before) on the sign-up page. You should get the confirmation email
within a minute or two. If it still fails, double check the domain shows
"Verified" in Resend (Step 1.2) — an unverified domain is the most common cause
of it still failing after this setup.

## If you need the pilot unblocked *right now*, before doing the above

You can temporarily turn email confirmation off entirely so students can sign
up and get straight in, no email step at all:

Supabase → **Authentication → Providers → Email** → turn **off** "Confirm
email" → Save.

This is a reasonable stopgap for a small, known pilot group, but turn it back
on once Steps 1–2 are done — without it, anyone can sign up with any email
address (even one they don't own) since it's never verified.
