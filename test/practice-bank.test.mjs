// F12-lite: serving APPROVED AI practice questions in the lesson's practice section.
// Run: node test/practice-bank.test.mjs   (exit 0 = pass, 1 = fail)
//
// The failure this mostly guards is SILENT: a lesson stores bare spec refs (['N1','N2'])
// while the bank stores full corpus ids (['edexcel-gcse-f-N1', ...]). Match them naively and
// nothing ever matches — no error, no empty state, just the old local genBank forever, and
// nobody notices that approving questions achieved nothing.
//
// Second trap, also silent: the stored spec_ref list is the whole BM25 RETRIEVAL set, not the
// refs the model cited. A rounding item also lists A23/A21/R9, so matching on ANY overlap
// would serve rounding questions inside a geometry lesson.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'index.html'), 'utf8');

function extractFn(name){
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
function extractDecl(name){
  const start = src.indexOf('const ' + name + ' =');
  if (start < 0) throw new Error('const ' + name + ' not found');
  const end = src.indexOf(';', start);
  return src.slice(start, end + 1);
}

const api = (new Function([
  extractDecl('SPEC_REF_PREFIX'),
  extractFn('bareSpecRef'), extractFn('primarySpecRef'), extractFn('matchPracticeRows'),
  'return { bareSpecRef, primarySpecRef, matchPracticeRows };'
].join('\n')))();
const { bareSpecRef, primarySpecRef, matchPracticeRows } = api;

let failures = 0;
const assert = (cond, msg) => { if (!cond) { failures++; console.error('  ✗ ' + msg); } else console.log('  ✓ ' + msg); };

// The five real approved rows, exactly as practice_questions returns them (2026-08-08).
const LIVE = [
  { id:19, course_id:'gcse-edexcel-foundation', grade_band:1, topic:'ordering negative numbers',
    spec_ref:['edexcel-gcse-f-N1','edexcel-gcse-f-N2','edexcel-gcse-f-A24','edexcel-gcse-f-N4','edexcel-gcse-f-N15'],
    item:{ question_html:'<p>Order these</p>', mark_scheme:'B1', marks:1 } },
  { id:20, course_id:'gcse-edexcel-foundation', grade_band:2, topic:'four operations with negatives',
    spec_ref:['edexcel-gcse-f-N2','edexcel-gcse-f-N3','edexcel-gcse-f-N9','edexcel-gcse-f-A4','edexcel-gcse-f-A8'],
    item:{ question_html:'<p>Work out</p>', mark_scheme:'B1', marks:2 } },
  { id:21, course_id:'gcse-edexcel-foundation', grade_band:2, topic:'rounding to the nearest 10, 100 or 1000',
    spec_ref:['edexcel-gcse-f-N15','edexcel-gcse-f-N9','edexcel-gcse-f-A23','edexcel-gcse-f-A21','edexcel-gcse-f-R9'],
    item:{ question_html:'<p>Round</p>', mark_scheme:'B1', marks:1 } },
  { id:22, course_id:'gcse-edexcel-foundation', grade_band:3, topic:'order of operations (BIDMAS), multi-step',
    spec_ref:['edexcel-gcse-f-N3','edexcel-gcse-f-N1','edexcel-gcse-f-N2','edexcel-gcse-f-N16','edexcel-gcse-f-R14'],
    item:{ question_html:'<p>Work out \\( 3 + 4 \\times 2 \\)</p>', mark_scheme:'B1', marks:2 } },
  { id:23, course_id:'gcse-edexcel-foundation', grade_band:3, topic:'estimation and checking by approximation',
    spec_ref:['edexcel-gcse-f-N14','edexcel-gcse-f-G25','edexcel-gcse-f-G7','edexcel-gcse-f-A18','edexcel-gcse-f-A4'],
    item:{ question_html:'<p>Estimate</p>', mark_scheme:'B1', marks:2 } },
];
const LESSON_1A = ['N1','N2','N3','N14','N15'];      // verbatim from mm-content.js
const COURSE = 'gcse-edexcel-foundation';

console.log('F12-lite practice bank:');

// ── ref normalisation (the silent-failure guard) ────────────────────────────
assert(bareSpecRef('edexcel-gcse-f-N15') === 'N15', 'bareSpecRef strips the board-qual-tier prefix');
assert(bareSpecRef('edexcel-gcse-h-A21') === 'A21', 'bareSpecRef handles the higher tier too');
assert(bareSpecRef('N15') === 'N15', 'bareSpecRef leaves an already-bare ref alone');
assert(bareSpecRef(null) === '' && bareSpecRef(undefined) === '', 'bareSpecRef is null-safe');
assert(primarySpecRef(LIVE[2]) === 'N15', 'primarySpecRef takes the FIRST ref, normalised');
assert(primarySpecRef({}) === '' && primarySpecRef({spec_ref:[]}) === '', 'primarySpecRef is safe when empty');

// ── the real data must actually match the real lesson ──────────────────────
const m = matchPracticeRows(LIVE, LESSON_1A, COURSE);
assert(m.length === 5, `all 5 live approved items match lesson 1a (got ${m.length})`);
assert(m.map(r=>r.id).join(',') === '19,20,21,22,23', 'the matched ids are exactly the live five');

// ── precision: the retrieval-set trap ──────────────────────────────────────
// id=23 (estimation) also lists G25/G7; a geometry lesson must NOT pick it up.
const geo = matchPracticeRows(LIVE, ['G25','G7','G14'], COURSE);
assert(geo.length === 0,
  'a GEOMETRY lesson matches none of them — secondary retrieval refs do not drag items in');
const n15only = matchPracticeRows(LIVE, ['N15'], COURSE);
assert(n15only.length === 1 && n15only[0].id === 21,
  'a rounding-only lesson gets exactly the rounding item (primary ref, not any-overlap)');

// ── course isolation ───────────────────────────────────────────────────────
assert(matchPracticeRows(LIVE, LESSON_1A, 'gcse-edexcel-higher').length === 0,
  'items from another course are never served');

// ── defensive ──────────────────────────────────────────────────────────────
assert(matchPracticeRows(LIVE, [], COURSE).length === 0, 'a lesson with no specRefs matches nothing');
assert(matchPracticeRows(LIVE, null, COURSE).length === 0, 'null specRefs is safe');
assert(matchPracticeRows(null, LESSON_1A, COURSE).length === 0, 'null rows is safe');
assert(matchPracticeRows([{ id:9, course_id:COURSE, spec_ref:['edexcel-gcse-f-N1'], item:{} }],
        LESSON_1A, COURSE).length === 0, 'a row with no question_html is skipped, not served blank');

// ── structural guarantees ──────────────────────────────────────────────────
const pick = extractFn('pickGeneratedQuestion');
assert(/cur\.genBank/.test(pick), 'genBank fallback is still in the swap point (rule 2)');
assert(/_servedIds\.has/.test(pick), 'no-repeat is applied at pick time');
assert(/recordServed/.test(pick), 'a served bank question is recorded');
const load = extractFn('loadPracticeBank');
assert(/practice_questions/.test(load), 'reads the SANITISED view, not questions_review');
assert(!/questions_review/.test(load), 'never queries questions_review from the student path');
assert(/rows = \[\]/.test(load), 'fails open to an empty bank (→ genBank) on any error');
assert(/_practice\.loadingKey === key/.test(load),
  'an in-flight load is reused only for the SAME lesson (else the new lesson gets old questions)');
const btn = src.slice(src.indexOf("$('genBtn').addEventListener"), src.indexOf("$('timerBtn').addEventListener"));
assert(/await loadPracticeBank\(\)/.test(btn), 'the bank is loaded before a question is picked');
assert(/renderMathIn\(\$\('genCard'\)\)/.test(btn), 'LaTeX is rendered in the practice card');
assert(/renderSelfReport\(g\)/.test(btn), 'self-report is offered after each question');

if (failures) { console.error('\n' + failures + ' assertion(s) FAILED'); process.exit(1); }
console.log('\nAll practice-bank assertions passed.');
