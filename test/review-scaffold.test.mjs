// Regression test for the review tab's SCAFFOLD-LADDER surfaces (GENERATOR-SERVICE.md §9,
// prerequisites 1–3). Run: node test/review-scaffold.test.mjs   (exit 0 = pass, 1 = fail)
//
// What this guards, and why each one is a real failure mode rather than a style preference:
//   1. Flags must be VISIBLE and one-per-line. A flag is the generator saying "I declined to
//      REJECT this — you look". Comma-joined into a chip, or dropped, it is the same as no
//      flag at all, and the pipeline's whole flag/reject split becomes decorative.
//   2. An UNVERIFIED numeric check must not render like a VERIFIED one. The generator's check
//      is deliberately three-state; collapsing it in the UI silently converts an unchecked
//      item into a checked-looking one, which is worse than not showing it.
//   3. Scaffold parts must render as labelled fields, never JSON. The parts are structured
//      precisely so Ryan can read them as parts.
//   4. A ladder must read as a ladder, ordered by scaffold_level — "does L3 add help" is only
//      answerable next to L2.
//
// Extracts the PURE functions from the single-file app (index.html), so it re-runs against the
// actually shipped code. If these are renamed, update the extraction list below.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'index.html'), 'utf8');

function extractFn(name){
  const start = src.indexOf('function ' + name + '(');
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
function extractDecl(name){
  // `const NAME = ...;` up to the line that ends the literal at top level.
  const start = src.indexOf('const ' + name + ' =');
  if (start < 0) throw new Error('const ' + name + ' not found in index.html');
  let depth = 0, end = -1;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if ('[{'.includes(c)) depth++;
    else if (']}'.includes(c)) depth--;
    else if (c === ';' && depth === 0) { end = i + 1; break; }
  }
  if (end < 0) throw new Error('unterminated const ' + name);
  return src.slice(start, end);
}

// Minimal stand-ins for the app-wide helpers these renderers call. esc is copied verbatim from
// index.html so escaping behaviour under test matches the app exactly.
const PRELUDE = `
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
function sanitizeHtml(h){ return h==null?'':String(h); }
`;

const api = (new Function([
  PRELUDE,
  extractDecl('RV_SCAFFOLD_PARTS'),
  extractDecl('RV_NUMERIC_BADGE'),
  extractDecl('RV_SIM_BADGE'),
  extractDecl('RV_TRACE_HANDLED'),
  extractFn('renderScaffoldParts'),
  extractFn('reviewFlags'),
  extractFn('reviewFlagsHtml'),
  extractFn('reviewTraceHtml'),
  extractFn('groupReviewItems'),
  'return { renderScaffoldParts, reviewFlags, reviewFlagsHtml, reviewTraceHtml, groupReviewItems };'
].join('\n')))();

const { renderScaffoldParts, reviewFlags, reviewFlagsHtml, reviewTraceHtml, groupReviewItems } = api;

let failures = 0;
const assert = (cond, msg) => { if (!cond) { failures++; console.error('  ✗ ' + msg); } else console.log('  ✓ ' + msg); };

// A real p8 ladder rung, shaped exactly as the generator emits it (§4).
const RUNG = (level, extra = {}) => ({
  id: 100 + level,
  created_at: '2026-08-05T10:0' + level + ':00Z',
  kind: 'question',
  grade_band: 3,
  payload: Object.assign({
    question_html: 'Work out \\[ 3 + (5 - 2)^2 \\times 4 \\]',
    variant_group: 'bidmas-bracket-index',
    scaffold_level: level,
    target_misconception: 'strict-left-to-right',
    correct_feedback: 'You applied BIDMAS in order.',
    options: [
      { text: '39', correct: true },
      { text: '51', correct: false, misconception: 'strict-left-to-right',
        misconception_feedback: 'You worked left to right without completing the index first.' }
    ],
    scaffold: level === 0 ? null : {
      reminder: level >= 1 ? 'Brackets come before indices.' : null,
      sub_question: level >= 2 ? 'What is \\( 5 - 2 \\)?' : null,
      partial_working: level >= 3 ? 'Step 1: \\( (5-2) = 3 \\)  Step 4: \\( 3 + 36 = \\) ___' : null,
      guided_choices: level >= 4 ? ['\\(36\\)', '\\(8\\)'] : []
    },
    trace: { numeric_state: 'verified', similarity_band: 'clean', flags: [] }
  }, extra)
});

console.log('review scaffold surfaces (GENERATOR-SERVICE §9):');

// ── 1. flags ────────────────────────────────────────────────────────────────
const flagged = RUNG(2, { trace: { numeric_state: 'unverified', similarity_band: 'flag', flags: [
  'scaffold.sub_question contains the answer value 5 — check it is a legitimate intermediate step',
  'distractor_validity: no distractor was numerically comparable'
] } });
assert(reviewFlags(flagged).length === 2, 'reviewFlags: both flags extracted');
assert(reviewFlags(RUNG(1)).length === 0, 'reviewFlags: empty flag array yields none');
assert(reviewFlags({}).length === 0, 'reviewFlags: missing payload/trace is safe');
assert(reviewFlags({ payload: { trace: { flags: 'a single flag' } } }).length === 1,
  'reviewFlags: a bare string flag still surfaces (never silently dropped)');

const fh = reviewFlagsHtml(flagged);
assert(fh.includes('no distractor was numerically comparable'), 'reviewFlagsHtml: flag text is visible');
assert((fh.match(/<li>/g) || []).length === 2, 'reviewFlagsHtml: ONE LINE PER FLAG, not comma-joined');
assert(fh.includes('did not reject'), 'reviewFlagsHtml: says these were flagged but NOT rejected');
assert(reviewFlagsHtml(RUNG(1)) === '', 'reviewFlagsHtml: no flags renders nothing');

// ── 2. verification badges ──────────────────────────────────────────────────
const traceUnver = reviewTraceHtml(flagged);
const traceVer   = reviewTraceHtml(RUNG(1));
assert(traceUnver.includes('NOT machine-checked'), 'trace: unverified numeric says so in plain English');
assert(traceUnver.includes('caution'), 'trace: unverified numeric gets the caution style');
assert(traceVer.includes('answer checked by computer'), 'trace: verified numeric reads as checked');
assert(traceVer.includes('rv-tag ok'), 'trace: verified numeric gets the ok style');
assert(traceUnver !== traceVer, 'trace: UNVERIFIED and VERIFIED do not render identically');
assert(traceUnver.includes('similarity borderline'), 'trace: flag band is called out, not left as a word');
assert(traceVer.includes('similarity clean'), 'trace: clean band reads as clean');
assert(!traceUnver.includes('content hash'), 'trace: content_hash is not shown (noise in review)');
assert(!traceUnver.includes('flags:'), 'trace: flags are NOT duplicated as a chip (they have their own block)');
// The deliberate generality from the hints fix must survive: unknown trace keys still surface.
const odd = reviewTraceHtml({ payload: { trace: { some_future_field: 'abc' } } });
assert(odd.includes('some future field: abc'), 'trace: an UNKNOWN trace key still surfaces (generality kept)');

// ── 3. scaffold parts as labelled fields ────────────────────────────────────
const parts = renderScaffoldParts(RUNG(4).payload.scaffold);
['Reminder', 'Sub-question', 'Partial working', 'Guided choices'].forEach(lb =>
  assert(parts.includes(lb), 'renderScaffoldParts: "' + lb + '" is a labelled field'));
assert(parts.indexOf('Reminder') < parts.indexOf('Sub-question')
    && parts.indexOf('Sub-question') < parts.indexOf('Partial working')
    && parts.indexOf('Partial working') < parts.indexOf('Guided choices'),
  'renderScaffoldParts: parts render in ladder order');
assert(parts.includes('\\(36\\)') && parts.includes('\\(8\\)'), 'renderScaffoldParts: guided choices listed individually');
assert(!parts.includes('{"'), 'renderScaffoldParts: no raw JSON');
const l1 = renderScaffoldParts(RUNG(1).payload.scaffold);
assert(l1.includes('Reminder') && !l1.includes('Partial working'),
  'renderScaffoldParts: a level-1 rung shows ONLY reminder (absent parts are correct, not missing)');
assert(renderScaffoldParts(null) === '' && renderScaffoldParts(undefined) === '',
  'renderScaffoldParts: a pre-p6 item with no scaffold renders nothing');
assert(renderScaffoldParts({}) === '', 'renderScaffoldParts: an empty scaffold renders nothing');

// ── 4. ladder grouping ──────────────────────────────────────────────────────
const shuffled = [RUNG(3), RUNG(0), RUNG(4), RUNG(1), RUNG(2)];
const groups = groupReviewItems(shuffled);
assert(groups.length === 1, 'groupReviewItems: one variant_group → one group');
assert(groups[0].isLadder, 'groupReviewItems: a multi-rung group is a ladder');
assert(groups[0].items.map(i => i.payload.scaffold_level).join(',') === '0,1,2,3,4',
  'groupReviewItems: rungs ordered by scaffold_level regardless of arrival order');

const mixed = groupReviewItems([
  RUNG(0), { id: 9, created_at: 'z', payload: { question_html: 'plain', variant_group: 'other-vg' } }
]);
assert(mixed.length === 2, 'groupReviewItems: different variant_groups stay separate');
assert(!mixed[1].isLadder, 'groupReviewItems: a lone non-scaffold item is NOT dressed up as a ladder');

const ungrouped = groupReviewItems([
  { id: 1, payload: { question_html: 'a' } }, { id: 2, payload: { question_html: 'b' } }
]);
assert(ungrouped.length === 2, 'groupReviewItems: items with NO variant_group never merge together');

const single = groupReviewItems([RUNG(2)]);
assert(single[0].isLadder, 'groupReviewItems: a lone SCAFFOLDED item is still shown as ladder context');

// Arrival order of groups is preserved (grouping must not reshuffle the whole queue).
const ordered = groupReviewItems([
  { id: 1, created_at: 'a', payload: { variant_group: 'first' } },
  { id: 2, created_at: 'b', payload: { variant_group: 'second' } },
  { id: 3, created_at: 'c', payload: { variant_group: 'first' } }
]);
assert(ordered[0].key === 'first' && ordered[1].key === 'second',
  'groupReviewItems: groups keep the queue arrival order of their earliest member');
assert(groupReviewItems([]).length === 0 && groupReviewItems(null).length === 0,
  'groupReviewItems: empty/null input is safe');

// ── 5. the delimiter contract is declared exactly once, and correctly ────────
assert(src.includes("{ left:'$$',  right:'$$',  display:true  }"), 'KATEX_DELIMITERS: $$ … $$ display');
assert(src.includes("{ left:'\\\\[', right:'\\\\]', display:true  }"), 'KATEX_DELIMITERS: \\[ … \\] display');
assert(src.includes("{ left:'\\\\(', right:'\\\\)', display:false }"), 'KATEX_DELIMITERS: \\( … \\) inline');
const delimBlock = src.slice(src.indexOf('const KATEX_DELIMITERS'), src.indexOf('let _katexPromise'));
assert(!/left:'\$'/.test(delimBlock),
  'KATEX_DELIMITERS: NO single-$ delimiter (it collides with currency — the contract forbids it)');

if (failures) { console.error('\n' + failures + ' assertion(s) FAILED'); process.exit(1); }
console.log('\nAll review scaffold assertions passed.');
