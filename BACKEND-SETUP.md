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

**If this is a brand-new Supabase project, skip this step and instead run the
whole of `supabase/migrations.sql` (in this repo) in the SQL Editor.** It
creates everything below plus the `profiles` table that `is_teacher()` (used
here) depends on, in the right order, and is what an existing, working
project already has. The block below is shown just to explain what it does.

1. In your project, open the **SQL Editor** (left sidebar) → **New query**.
2. Paste this in and click **Run**:

```sql
create table if not exists public.site_content (
  id         int primary key,
  data       jsonb not null,
  updated_at timestamptz default now()
);

alter table public.site_content enable row level security;

-- Everyone (the public "anon" key) may READ the content:
create policy "public read" on public.site_content
  for select using (true);

-- Only a signed-in account with role='teacher' may WRITE. This checks who is
-- actually logged in — nobody can change content just by knowing a key.
create or replace function public.is_teacher()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'teacher');
$$;
create policy "teacher writes site_content" on public.site_content
  for all using (public.is_teacher()) with check (public.is_teacher());
```

## Step 3 — Get your public key

Open **Project Settings → API**. You need:

- **Project URL** — e.g. `https://abcdefgh.supabase.co`
- **`anon` `public` key** — a long token. This is **safe to publish**; it is read-only
  (row-level security only lets it read, per Step 2's "public read" policy).

You do **not** need the `service_role`/`secret` key for anything in this app — that key
has full, unrestricted database access and should never appear in the app or be pasted
anywhere in the browser. (It's used only by the separate, server-side question-generation
service, in its own repo — nothing to do with this site.)

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

There's no key to paste any more — you just **sign in** with your own account, the same
way a student would, and the database checks that your account is marked as the teacher.

1. **One-time only:** in the Supabase SQL Editor, run:
   ```sql
   update public.profiles set role = 'teacher' where user_id = '<your-user-id>';
   ```
   Find `<your-user-id>` in Supabase → **Authentication → Users** (create your account
   first, via the app's normal sign-up, if you haven't already).
2. Open the app and **sign in** (top of the sidebar) with that account.
3. Go to the **Teacher Editor** (`✎ Teacher: edit content`, or add `#/admin`) — the
   **☁ Cloud backend** bar shows *"✅ Signed in as teacher"*.
4. Make an edit and press **💾 Save changes**. You'll see
   *"Saved to the cloud — every student now sees these changes."*

Done. From now on, edit → **Save** → everyone gets it on their next visit, as long as
you're signed in with your teacher account. No secret key ever touches the browser.

---

## Step 6 — Enable video uploads (optional)

This lets you **drag & drop a video file** into a lesson in the editor and have it stream to
every student — no YouTube needed.

1. In Supabase, open **Storage** (left sidebar) → **New bucket**.
2. Name it exactly **`videos`**, tick **Public bucket**, and create it.
   (Public = students can watch; uploading needs you to be signed in as the teacher,
   same as saving content — see Step 5.)
3. In the SQL Editor, also run the storage policy from `supabase/migrations.sql`'s
   "teacher writes videos bucket" section (already included if you ran the whole file).
4. That's it. In the editor, each video now has a **drag & drop** area — drop an `.mp4`/`.webm`
   file, wait for the progress bar, then press **💾 Save changes** to publish it.

The same `videos` bucket is also used for **images** you add to a lesson's Key notes
(each video's notes editor has a **🖼 Add image** button) — no extra setup needed.

Notes:
- You can still paste a **YouTube/Vimeo embed link** instead — that's better for large or
  many videos (see the bandwidth note below).
- If uploading says *"bucket does not exist"*, re-check the bucket is named `videos` and is Public.
- **Free-tier limits:** Supabase Storage gives ~1 GB of storage and ~5 GB of downloads per month
  on the free plan. Video is heavy, so a busy class can use that up quickly. If you outgrow it,
  host big videos on **YouTube (unlisted)** and paste the embed link — that has no bandwidth cost.

---

## Notes on safety

- The **anon key is public by design** and can only read, because of the row-level-security
  policy above. It's fine that it sits in `index.html`.
- **The app never uses the `service_role` key.** Writes are authorised by checking, on the
  database side, that the signed-in account making the request has `role='teacher'` — there
  is no powerful key sitting in the browser for anyone to find via DevTools. If you ever see
  a service_role key mentioned in older notes about this project, that's out of date.
- Signing out (or just not being signed in as the teacher account) means saves are refused
  by the database itself, not just hidden in the interface.

## If something isn't working

- **"Cloud save failed: permission denied"** — either you're not signed in, or your account
  isn't marked `role='teacher'` yet. Re-check Step 5 (the one-time SQL update), and confirm
  the ☁ Cloud backend bar says "✅ Signed in as teacher" before you Save.
- **The Teacher Editor bounces you to Courses** — same cause: you need to be signed in with
  the teacher account for `#/admin` to open at all now.
- **Students don't see changes** — confirm `url` + `anonKey` are filled in and committed (Step 4),
  and that your Save showed the cloud success message.
- **Reset** — in the editor, **Reset to file** clears this browser's cached/saved content and reloads.
- Leaving `url`/`anonKey` blank disables the cloud entirely and the app falls back to the
  in-browser save — nothing breaks (and the Teacher Editor has no sign-in requirement in
  that local-only mode, since there's no account system to check against).
