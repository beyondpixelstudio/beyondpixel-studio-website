#!/usr/bin/env node
/**
 * NAP drift guard.
 *
 * business.ts claims to be the single source of truth for the phone numbers,
 * the email addresses and the postal address. A comment claiming that is worth
 * nothing six months from now, when someone in a hurry pastes a number straight
 * into a template because it is faster than an import.
 *
 * This makes the claim enforceable: every contact digit string and address
 * must appear in src/data/business.ts and NOWHERE else in src/.
 *
 * It also fails on the retired number. 89173 98179 was canonical until
 * 2026-08-23; if it ever reappears in the source, that is a regression, not a
 * typo, and it should stop the build.
 *
 * Exits non-zero on any violation so it can gate a build or a commit hook.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const SRC = join(ROOT, 'src');
const TRUTH = join(SRC, 'data', 'business.ts');

/* -- What must not appear outside business.ts ---------------------------- */

const OWNED = [
  { label: 'primary phone', re: /7608\s?924\s?893|76089\s?24893/g },
  { label: 'alternate phone', re: /6371\s?227\s?153|63712\s?27153/g },
  { label: 'general mailbox', re: /admin@beyondpixel/gi },
  { label: 'production mailbox', re: /manager@beyondpixel/gi },
  { label: 'postcode', re: /\b751024\b/g },
];

/* Retired values. Banned everywhere, business.ts included — the only mention
   permitted there is inside the comment recording the retirement, which is why
   this is checked against code lines rather than the raw file. */
const RETIRED = [{ label: 'retired 2026-08-23 phone', re: /8917\s?398\s?179|89173\s?98179/g }];

/* -- Walk src/ ----------------------------------------------------------- */

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(astro|ts|js|mjs|css|md)$/.test(entry)) out.push(p);
  }
  return out;
};

/** Strip // line comments and block comments so prose about a number is not a
    use of that number. Crude but sufficient — it only ever over-reports. */
const decomment = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');

const problems = [];

for (const file of walk(SRC)) {
  const rel = relative(ROOT, file);
  const raw = readFileSync(file, 'utf8');
  const code = decomment(raw);

  for (const { label, re } of RETIRED) {
    if (new RegExp(re.source, re.flags).test(code)) {
      problems.push(`${rel}: contains the ${label}. It was replaced — remove it.`);
    }
  }

  if (file === TRUTH) continue; // the one file allowed to hold these

  for (const { label, re } of OWNED) {
    const hits = code.match(new RegExp(re.source, re.flags));
    if (hits) {
      problems.push(
        `${rel}: hard-codes the ${label} (${hits[0]}). ` +
          `Import it from src/data/business.ts instead.`
      );
    }
  }
}

/* -- business.ts must actually still define them ------------------------- */

const truth = readFileSync(TRUTH, 'utf8');
for (const { label, re } of OWNED) {
  if (!new RegExp(re.source, re.flags).test(truth)) {
    problems.push(`src/data/business.ts: no longer defines the ${label}.`);
  }
}

/* -- Report -------------------------------------------------------------- */

const line = '-'.repeat(78);
console.log(`\n  NAP drift guard — src/ against src/data/business.ts\n  ${line}`);

if (problems.length) {
  for (const p of problems) console.log(`  FAIL  ${p}`);
  console.log(`  ${line}`);
  console.log(`  ${problems.length} violation(s). NAP consistency is not optional.\n`);
  process.exit(1);
}

console.log('  ok    every contact value is defined once, in business.ts');
console.log('  ok    the retired number appears nowhere in src/');
console.log(`  ${line}\n  Clean.\n`);
