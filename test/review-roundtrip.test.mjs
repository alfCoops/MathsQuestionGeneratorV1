// Regression test for the F10b review-queue round-trip.
// Run: node test/review-roundtrip.test.mjs   (exit 0 = pass, 1 = fail)
//
// Guards the data-corrupting class of bug where an EDIT stringified payload.hints to
// ["[object Object]", ...]. The generator's §4 item contract has staged-hint OBJECTS
// ({stage,text,image?}); the review tab must render and round-trip them without ever turning
// them into strings. This test uses the REAL §4 shape (never string hints) — the old fixture
// used strings, which is how the bug slipped through.
//
// It extracts the PURE functions from the single-file app (index.html) and exercises them,
// so it re-runs against the actual shipped code. If those functions are renamed, update below.

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
function extractConst(name){
  const m = src.match(new RegExp('const ' + name + '\\s*=\\s*(\\[[^\\]]*\\]);'));
  if (!m) throw new Error('const ' + name + ' not found');
  return 'const ' + name + ' = ' + m[1] + ';';
}

const { mergeHintEdits, reviewEdit } = (new Function(
  [extractConst('RV_EDIT_FIELDS'), extractFn('mergeHintEdits'), extractFn('reviewEdit'),
   'return { mergeHintEdits, reviewEdit };'].join('\n')
))();

let failures = 0;
const assert = (cond, msg) => { if (!cond) { failures++; console.error('  ✗ ' + msg); } else console.log('  ✓ ' + msg); };

// Canonical §4 review-row fixture — staged-hint OBJECTS + tagged-option OBJECTS.
const payload = {
  question_html: 'Work out <b>-6 + 9</b>.',
  options: [
    { text: '-15', misconception: 'adds magnitudes, keeps the sign' },
    { text: '3', correct: true },
    { text: '-3', misconception: 'keeps the negative sign' }
  ],
  answer: 1, answer_numeric: 3,
  mark_scheme: 'B1 for 3.', marks: 1,
  hints: [
    { stage: 1, text: 'Which number is bigger, ignoring signs?' },
    { stage: 2, text: 'Start at -6 and count up 9.', image: '' }
  ],
  trace: { numeric_state: 'verified', similarity_band: 'low', flags: [], novel_misconceptions: [] }
};

console.log('review round-trip (F10b):');

// Edit only hint 2's wording.
const editedTexts = ['Which number is bigger, ignoring signs?', 'Count up 9 from -6 on a number line.'];
const merged = mergeHintEdits(payload.hints, editedTexts);
assert(typeof merged[0] === 'object' && merged[0].stage === 1, 'mergeHintEdits: hint[0] is still an object with stage');
assert(merged[1].stage === 2 && merged[1].text === 'Count up 9 from -6 on a number line.', 'mergeHintEdits: hint[1] text updated, stage kept');
assert(merged[1].image === '', 'mergeHintEdits: hint[1] image preserved');
assert(JSON.stringify(merged).indexOf('[object Object]') < 0, 'mergeHintEdits: no "[object Object]"');

const { newPayload, diff } = reviewEdit(payload, {
  question_html: payload.question_html, mark_scheme: payload.mark_scheme, marks: payload.marks, hints: merged
});
assert(typeof newPayload.hints[0] === 'object' && newPayload.hints[0].stage === 1 && typeof newPayload.hints[0].text === 'string',
  'reviewEdit: saved payload.hints[0] is an object with stage/text');
assert(JSON.stringify(newPayload.hints).indexOf('[object Object]') < 0, 'reviewEdit: saved hints contain no "[object Object]"');
assert(Array.isArray(newPayload.options) && newPayload.options.length === 3 && typeof newPayload.options[0] === 'object',
  'reviewEdit: tagged-option objects preserved intact');
assert(newPayload.answer === 1 && newPayload.answer_numeric === 3, 'reviewEdit: answer / answer_numeric preserved');
assert(diff.hints && Array.isArray(diff.hints.from) && typeof diff.hints.from[1] === 'object' && diff.hints.from[1].text === 'Start at -6 and count up 9.',
  'reviewEdit: diff.hints.from holds the pre-edit objects (this is the repair source)');
assert(!('question_html' in diff) && !('mark_scheme' in diff) && !('marks' in diff), 'reviewEdit: unchanged fields absent from diff');

// A no-op edit must produce an empty diff and keep hint objects.
const noop = reviewEdit(payload, {
  question_html: payload.question_html, mark_scheme: payload.mark_scheme, marks: payload.marks,
  hints: mergeHintEdits(payload.hints, payload.hints.map(h => h.text))
});
assert(Object.keys(noop.diff).length === 0, 'reviewEdit: identical edit produces an empty diff');
assert(typeof noop.newPayload.hints[0] === 'object', 'reviewEdit: no-op keeps hint objects');

if (failures) { console.error('\n' + failures + ' assertion(s) FAILED'); process.exit(1); }
console.log('\nAll review round-trip assertions passed.');
