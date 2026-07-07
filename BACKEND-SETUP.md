# Shared cloud backend — setup (about 10 minutes, free)

This lets you edit content in the Teacher Editor and have **every student, on every
device, see the change automatically** — no more downloading/uploading `mm-content.js`.

It uses **Supabase** (a free hosted database). No credit card needed.

---

## Step 1 — Create a Supabase project

1. Go to **https://supabase.com** and sign up (GitHub or email).
2. Click **New project**. Give it any name, set a database password (save it somewhere),
   pick the closest region, and create it. Wait ~1 minute for it to finish setting up.

## Step 2 — Create the content table

1. In your project, open the **SQL Editor** (left sidebar) → **New query**.
2. Paste this in and click **Run**:

```sql
create table if not exists public.site_content (
  id         int primary key,
  data       jsonb not null,
  updated_at timestamptz default now()
);

alter table public.site_content enable row level security;

-- Students (the public "anon" key) may READ the content:
create policy "public read" on public.site_content
  for select using (true);

-- No write policies on purpose: the public key CANNOT change anything.
-- You (the teacher) write using the service_role key, which bypasses these rules.
```

## Step 3 — Get your two keys

Open **Project Settings → API**. You need:

- **Project URL** — e.g. `https://abcdefgh.supabase.co`
- **`anon` `public` key** — a long token. This is **safe to publish**; it is read-only.
- **`service_role` `secret` key** — this is your private **editor key**. **Never commit or share it.**

## Step 4 — Put the public values in the site (one time)

Open `index.html`, find this block near the top of the `<script>`:

```js
const BACKEND = {
  url:     '',   // <- paste your Project URL here
  anonKey: '',   // <- paste your anon public key here
  table:   'site_content',
  rowId:   1
};
```

Paste your **Project URL** and **anon public key** into `url` and `anonKey`.
Then commit `index.html` to GitHub **once**. (This is the last content-related GitHub step ever.)

## Step 5 — Connect as the teacher

1. Open the app and go to the **Teacher Editor** (`✎ Teacher: edit content`, or add `#/admin`).
2. In the **☁ Cloud backend** bar, paste your **`service_role` key** into the editor-key box
   and click **Save key**. It is stored **only in your browser** (never in the code).
3. Make an edit and press **💾 Save changes**. You'll see
   *"Saved to the cloud — every student now sees these changes."*

Done. From now on, edit → **Save** → everyone gets it on their next visit.

---

## Notes on safety

- The **anon key is public by design** and can only read, because of the row-level-security
  policy above. It's fine that it sits in `index.html`.
- The **`service_role` key is powerful** (full access to your project). Only ever paste it into
  the editor on **your own** computer. On a shared/public machine, click **Forget key** when done.
- Want tighter security than the service_role key (e.g. a proper teacher login, or a small
  serverless function that hides the key)? That's a straightforward upgrade — ask and it can be added.

## If something isn't working

- **"Cloud save failed (401/403)"** — the editor key is wrong, or you pasted the anon key instead
  of the `service_role` key. Re-check Step 5.
- **Students don't see changes** — confirm `url` + `anonKey` are filled in and committed (Step 4),
  and that your Save showed the cloud success message.
- **Reset** — in the editor, **Reset to file** clears this browser's cached/saved content and reloads.
- Leaving `url`/`anonKey` blank disables the cloud entirely and the app falls back to the
  in-browser save — nothing breaks.
