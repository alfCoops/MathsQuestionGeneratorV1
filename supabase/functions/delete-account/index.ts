// Supabase Edge Function: delete-account
// Fully deletes the CALLING user's account. Because profiles/progress/events
// reference auth.users with "on delete cascade", removing the auth user also
// removes all of their rows — so students can permanently delete their data (F1).
//
// Deploy once:
//   supabase functions deploy delete-account --project-ref <your-ref>
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically — the
// service_role key stays server-side (never in index.html).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const jwt = (req.headers.get('Authorization') || '').replace('Bearer ', '')
    if (!jwt) return json({ error: 'missing token' }, 401)

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Identify the caller from their JWT, then delete only that user.
    const { data, error } = await admin.auth.getUser(jwt)
    if (error || !data?.user) return json({ error: 'unauthorized' }, 401)

    const { error: delErr } = await admin.auth.admin.deleteUser(data.user.id)
    if (delErr) return json({ error: delErr.message }, 500)

    return json({ ok: true })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
