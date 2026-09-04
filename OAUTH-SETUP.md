# Google & Microsoft sign-in — setup (about 15 minutes)

This turns on the "Continue with Google" / "Continue with Microsoft" buttons on the
sign-in page. Until you've done this, those buttons show a clear error message —
nothing is broken, they just don't work yet.

**Privacy note:** the app only ever asks these providers for the student's **email
address** — never their name or photo. That's deliberate (students are minors), so
don't widen the scopes below even if Google/Microsoft's screens invite you to.

---

## Step 1 — Find your Supabase callback URL

1. In Supabase, open **Authentication → Providers**.
2. Click into any provider (e.g. Google) — near the top you'll see a **Callback URL**
   that looks like `https://abcdefgh.supabase.co/auth/v1/callback`. Copy it — you'll
   paste this exact URL into both Google's and Microsoft's setup below.

## Step 2 — Google

1. Go to **https://console.cloud.google.com/** and sign in (your own Google account is
   fine — this doesn't need to be a business account).
2. Create a new project (top-left project picker → **New Project**). Any name is fine,
   e.g. "MasterMaths".
3. Left sidebar → **APIs & Services → OAuth consent screen**.
   - User type: **External**.
   - Fill in the app name ("MasterMaths"), your support email, and your email again
     under developer contact. Save through the remaining steps with defaults —
     you don't need to add scopes here, the app only requests `email`.
4. Left sidebar → **APIs & Services → Credentials → + Create Credentials → OAuth
   client ID**.
   - Application type: **Web application**.
   - Under **Authorized redirect URIs**, click **+ Add URI** and paste the Supabase
     callback URL from Step 1.
   - Click **Create**. You'll be shown a **Client ID** and **Client Secret** — copy
     both.
5. Back in Supabase → **Authentication → Providers → Google**: toggle it **on**,
   paste the Client ID and Client Secret, **Save**.

## Step 3 — Microsoft

1. Go to **https://portal.azure.com/** and sign in.
2. Search for **App registrations** (top search bar) → **+ New registration**.
   - Name: "MasterMaths".
   - Supported account types: **Accounts in any organizational directory and personal
     Microsoft accounts** (so both work/school and personal @outlook.com accounts can
     sign in).
   - Redirect URI: choose **Web**, and paste the Supabase callback URL from Step 1.
   - Click **Register**.
3. On the app's **Overview** page, copy the **Application (client) ID**.
4. Left sidebar → **Certificates & secrets → + New client secret**. Give it any
   description, leave the expiry default, **Add** — copy the secret's **Value**
   immediately (it's hidden after you leave the page).
5. Back in Supabase → **Authentication → Providers → Azure**: toggle it **on**, paste
   the Application (client) ID and the secret Value, **Save**.

## Step 4 — Test it

Open the app's sign-in page and click **Continue with Google** (or Microsoft). You
should be sent to that provider's own sign-in screen, then land back in the app signed
in. A brand-new sign-in this way is asked for a nickname once (the same "please don't
use your real name" prompt as a normal signup), then a one-time avatar picker — that's
expected, not a bug.

## If something isn't working

- **Button shows an error instead of redirecting** — the provider isn't toggled on in
  Supabase yet, or the Client ID/Secret weren't saved. Re-check Step 2/3's last bullet.
- **Provider's own page shows "redirect URI mismatch"** — the URI pasted into
  Google/Azure doesn't exactly match Supabase's callback URL from Step 1 (a trailing
  slash or http vs https difference is enough to break it). Copy it again, carefully.
- **Signed in, but no nickname was asked** — only happens for a genuinely new account;
  signing back in later never asks again, by design.
