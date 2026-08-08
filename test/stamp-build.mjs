// Rewrites the BUILD constant in index.html from git + the clock.
// Run: node test/stamp-build.mjs      (then commit — the stamp is part of the deploy)
//
// Why this exists: GitHub Pages serves index.html straight from the branch and browsers cache
// HTML, so "the deploy is stale" and "my tab is stale" look identical from the outside. The
// stamp makes them distinguishable — and makes "is the fix actually live?" a fact you can read
// off the page, or assert from a script via window.MM_BUILD.
//
// There is deliberately NO build step here (CLAUDE.md): this is a one-line manual pre-commit
// step, not a pipeline. `ref` is therefore the commit HEAD was on when stamping — one behind
// the commit that carries the stamp. The TIMESTAMP is the authoritative freshness signal;
// treat `ref` as "built just after this commit".

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, '..', 'index.html');

let ref = 'unknown';
try {
  ref = execSync('git rev-parse --short HEAD', { cwd: join(here, '..') }).toString().trim();
  const dirty = execSync('git status --porcelain', { cwd: join(here, '..') }).toString().trim();
  if (dirty) ref += '+';            // uncommitted changes are in this bundle too — say so
} catch { /* not a git checkout — leave 'unknown' rather than lying */ }

const at = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const src = readFileSync(file, 'utf8');
const RX = /const BUILD = \{ at:'[^']*', ref:'[^']*' \};/;
if (!RX.test(src)) {
  console.error('BUILD constant not found in index.html — did it get renamed?');
  process.exit(1);
}
writeFileSync(file, src.replace(RX, `const BUILD = { at:'${at}', ref:'${ref}' };`), 'utf8');
console.log(`stamped: at=${at} ref=${ref}`);
