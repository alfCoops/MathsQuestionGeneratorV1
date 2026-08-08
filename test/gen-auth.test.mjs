// Regression test for the generator client's AUTH TOKEN handling.
// Run: node test/gen-auth.test.mjs   (exit 0 = pass, 1 = fail)
//
// The bug: callers fetched auth headers ONCE and reused the object. runGenerate handed the
// same headers to genPOST and then to genPollLoop, which polls for up to ~3 minutes — longer
// than a Supabase access token can live. Once it expired, every remaining poll 401'd, the
// three built-in retries replayed the SAME dead token, and the run ended on "sign out and back
// in" for a session that was still perfectly valid.
//
// What must hold now:
//   1. every request re-reads the token (no captured headers anywhere)
//   2. a 401 triggers ONE forced refresh and ONE replay
//   3. only a second 401 is treated as a genuinely dead session
//   4. a refreshed retry succeeds silently — the user sees no error at all

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'index.html'), 'utf8');

function extractFn(name){
  // NB: must keep a leading `async` — extracting the body without it produces a sync function
  // whose `await`s are a syntax error. (The other test files predate any async extraction.)
  let start = src.indexOf('async function ' + name + '(');
  if (start < 0) start = src.indexOf('function ' + name + '(');
  if (start < 0) throw new Error('function ' + name + ' not found in index.html');
  let depth = 0, end = -1;
  for (let i = src.indexOf('{', start); i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  if (end < 0) throw new Error('unbalanced braces for ' + name);
  return src.slice(start, end);
}

let failures = 0;
const assert = (cond, msg) => { if (!cond) { failures++; console.error('  ✗ ' + msg); } else console.log('  ✓ ' + msg); };

// Build a sandbox with a fake supabase client + fake fetch, then load the real functions.
function makeSandbox({ tokens, responder }){
  const calls = { fetches: [], getSession: 0, refresh: 0 };
  const state = { i: 0 };
  const sbClient = {
    auth: {
      async getSession(){ calls.getSession++; return { data: { session: { access_token: tokens[state.i] } } }; },
      async refreshSession(){ calls.refresh++; state.i = Math.min(state.i + 1, tokens.length - 1);
                              return { data: { session: { access_token: tokens[state.i] } } }; }
    }
  };
  const fetchImpl = async (url, init) => {
    calls.fetches.push({ url, auth: (init.headers || {})['Authorization'] });
    return responder(calls.fetches.length, (init.headers || {})['Authorization']);
  };
  const api = (new Function('sbClient', 'fetch', 'GENERATOR', [
    extractFn('genAccessToken'), extractFn('genAuthHeaders'), extractFn('genFetch'),
    extractFn('genGET'), extractFn('genPOST'),
    'return { genAccessToken, genAuthHeaders, genFetch, genGET, genPOST };'
  ].join('\n')))(sbClient, fetchImpl, { url: 'https://svc.test' });
  return { api, calls };
}
const res = (status) => ({ status, ok: status >= 200 && status < 300, json: async () => ({ status }) });

console.log('generator client auth:');

// 1. Happy path — token read at call time, no refresh needed.
{
  const { api, calls } = makeSandbox({ tokens: ['good'], responder: () => res(200) });
  const r = await api.genGET('/v1/health');
  assert(r.ok && calls.fetches.length === 1, 'happy path: one request');
  assert(calls.fetches[0].auth === 'Bearer good', 'happy path: token attached from getSession()');
  assert(calls.refresh === 0, 'happy path: no needless refresh');
}

// 2. THE BUG: 401 → forced refresh → replay with the NEW token → success, silently.
{
  const { api, calls } = makeSandbox({
    tokens: ['stale', 'fresh'],
    responder: (n, auth) => res(auth === 'Bearer fresh' ? 200 : 401)
  });
  const r = await api.genGET('/v1/batch/abc');
  assert(calls.refresh === 1, '401: refreshSession() called exactly once');
  assert(calls.fetches.length === 2, '401: replayed exactly once (not 3 retries on a dead token)');
  assert(calls.fetches[0].auth === 'Bearer stale' && calls.fetches[1].auth === 'Bearer fresh',
    '401: the replay uses the REFRESHED token, not the captured one');
  assert(r.ok && r.status === 200, '401: the caller sees success — no error surfaces to the user');
  assert(r.refreshed === true, '401: the result records that a refresh happened');
}

// 3. A genuinely dead session: 401 twice → surfaced as 401, so the sign-out message is correct.
{
  const { api, calls } = makeSandbox({ tokens: ['dead', 'alsodead'], responder: () => res(401) });
  const r = await api.genGET('/v1/batch/abc');
  assert(calls.fetches.length === 2, 'dead session: exactly two attempts, no infinite retry');
  assert(calls.refresh === 1, 'dead session: refreshed once before giving up');
  assert(r.status === 401 && !r.ok, 'dead session: 401 surfaces so the sign-out message is shown');
}

// 4. Non-401 errors are NOT retried — a 429 must not burn a refresh or a second call.
{
  const { api, calls } = makeSandbox({ tokens: ['good'], responder: () => res(429) });
  const r = await api.genGET('/v1/batch/abc');
  assert(calls.fetches.length === 1 && calls.refresh === 0, '429: not retried, not refreshed');
  assert(r.status === 429, '429: surfaced as-is');
}

// 5. POST carries both the content type and a call-time token.
{
  const { api, calls } = makeSandbox({ tokens: ['good'], responder: () => res(200) });
  await api.genPOST('/v1/batch', { n: 1 });
  assert(calls.fetches[0].auth === 'Bearer good', 'POST: token attached at call time');
}

// 6. A network failure is reported, not thrown — a poll loop must not die on one blip.
{
  const { api } = makeSandbox({ tokens: ['good'], responder: () => { throw new Error('offline'); } });
  const r = await api.genFetch('/v1/health', {});
  assert(r.ok === false && r.networkError === true, 'network error: returned, not thrown');
}

// 7. STRUCTURAL: no caller may thread a headers object through the poll loop again.
{
  const poll = extractFn('genPollLoop');
  assert(!/function genPollLoop\([^)]*headers/.test(poll),
    'genPollLoop takes NO headers parameter (threading one through is what went stale)');
  assert(!/genGET\([^)]*,\s*headers/.test(poll), 'genPollLoop does not pass headers to genGET');
  const run = extractFn('runGenerate');
  assert(!/const h = await genAuthHeaders\(\)/.test(run),
    'runGenerate does not capture headers for later reuse');
}

// 8. The build stamp exists and is machine-readable.
{
  assert(/const BUILD = \{ at:'[^']*', ref:'[^']*' \};/.test(src), 'BUILD constant present');
  assert(/window\.MM_BUILD = BUILD/.test(src), 'BUILD exposed on window.MM_BUILD for scripted checks');
  assert(/renderBuildStamp\(\);/.test(src), 'build stamp is rendered at boot');
}

if (failures) { console.error('\n' + failures + ' assertion(s) FAILED'); process.exit(1); }
console.log('\nAll generator-auth assertions passed.');
