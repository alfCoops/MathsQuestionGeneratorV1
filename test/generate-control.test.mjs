// Regression test for the F32 "Generate questions" client logic.
// Run: node test/generate-control.test.mjs   (exit 0 = pass, 1 = fail)
//
// Extracts the pure helpers from index.html and checks request-body building (n hard-capped
// at 10, optional calculator), the HTTP-status → message mapping, and terminal-status
// detection against the generator's live enum (queued|running|complete|interrupted|failed).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html'), 'utf8');
function extractFn(name){
  const start = src.indexOf('function ' + name + '(');
  if (start < 0) throw new Error('function ' + name + ' not found');
  let depth = 0, end = -1;
  for (let i = src.indexOf('{', start); i < src.length; i++) {
    const c = src[i]; if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  return src.slice(start, end);
}
function extractConst(name){
  const m = src.match(new RegExp('const ' + name + '\\s*=\\s*(\\{[^}]*\\});'));
  if (!m) throw new Error('const ' + name + ' not found');
  return 'const ' + name + ' = ' + m[1] + ';';
}

const { genBatchBody, genErrorMessage, genStatusTerminal } = (new Function([
  extractConst('GEN_TERMINAL'),
  extractFn('genStatusTerminal'), extractFn('genBatchBody'), extractFn('genErrorMessage'),
  'return { genBatchBody, genErrorMessage, genStatusTerminal };'
].join('\n')))();

let failures = 0;
const assert = (c, m) => { if (!c) { failures++; console.error('  ✗ ' + m); } else console.log('  ✓ ' + m); };

console.log('generate-control:');

// genBatchBody
const b1 = genBatchBody({ courseId: 'gcse-edexcel-foundation', topic: 'ordering-negatives', gradeBand: '3', calculator: 'not-allowed', n: 50 });
assert(b1.n === 10, 'genBatchBody: n hard-capped at 10 (asked 50)');
assert(genBatchBody({ courseId: 'c', topic: 't', gradeBand: '3', n: 0 }).n === 1, 'genBatchBody: n floored at 1');
assert(genBatchBody({ courseId: 'c', topic: 't', gradeBand: '3', n: 'x' }).n === 1, 'genBatchBody: non-numeric n → 1');
assert(b1.course_id === 'gcse-edexcel-foundation' && b1.topic === 'ordering-negatives', 'genBatchBody: course_id/topic passed through');
assert(b1.grade_band === 3 && typeof b1.grade_band === 'number', 'genBatchBody: grade_band coerced to int');
assert(b1.kind === 'question', 'genBatchBody: kind defaults to "question"');
assert(b1.calculator === 'not-allowed', 'genBatchBody: calculator included when given');
assert(!('calculator' in genBatchBody({ courseId: 'c', topic: 't', gradeBand: '2', n: 3 })), 'genBatchBody: calculator omitted when not given');

// genErrorMessage
assert(/session/i.test(genErrorMessage(401)), 'genErrorMessage: 401 → session');
assert(/teacher/i.test(genErrorMessage(403)), 'genErrorMessage: 403 → teacher');
assert(/tomorrow/i.test(genErrorMessage(429)), 'genErrorMessage: 429 → daily limit / tomorrow');
assert(/warming/i.test(genErrorMessage(503)), 'genErrorMessage: 503 → warming up');
assert(/500/.test(genErrorMessage(500)), 'genErrorMessage: other → shows the code');

// genStatusTerminal (against the live enum)
assert(genStatusTerminal('complete') && genStatusTerminal('failed') && genStatusTerminal('interrupted'), 'genStatusTerminal: complete/failed/interrupted are terminal');
assert(!genStatusTerminal('queued') && !genStatusTerminal('running'), 'genStatusTerminal: queued/running are NOT terminal');
assert(!genStatusTerminal('') && !genStatusTerminal(undefined), 'genStatusTerminal: empty/undefined not terminal (defensive)');
assert(genStatusTerminal('COMPLETE'), 'genStatusTerminal: case-insensitive');

if (failures) { console.error('\n' + failures + ' assertion(s) FAILED'); process.exit(1); }
console.log('\nAll generate-control assertions passed.');
