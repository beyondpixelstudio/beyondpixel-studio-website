#!/usr/bin/env node
/**
 * WCAG contrast verification for src/styles/tokens.css
 *
 * The design brief demands Lighthouse Accessibility 95+. Contrast is the part
 * of that most easily got wrong by eye, so it is measured rather than trusted.
 * This parses the token file itself — there is no second copy of the palette to
 * drift out of sync.
 *
 * Exits non-zero on any failure so it can gate a build or a commit hook.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const TOKENS = join(here, '..', 'src', 'styles', 'tokens.css');

/* -- WCAG 2.1 relative luminance and contrast ---------------------------- */

const toLinear = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

const parseHex = (hex) => {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(parseHex(a)), luminance(parseHex(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/* -- Read the tokens ------------------------------------------------------ */

const css = readFileSync(TOKENS, 'utf8');
const tokens = Object.fromEntries(
  [...css.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g)].map((m) => [m[1], m[2]]),
);

const resolve = (name) => {
  if (name.startsWith('#')) return name;
  if (!(name in tokens)) {
    console.error(`\n  Unknown token: --${name}\n`);
    process.exit(2);
  }
  return tokens[name];
};

/* -- What must hold ------------------------------------------------------
   4.5  normal body text (WCAG AA)
   3.0  large text (>=18.66px bold / >=24px) and non-text UI components     */

const CHECKS = [
  ['text', 'void', 4.5, 'Primary text on page ground'],
  ['text', 'surface', 4.5, 'Primary text on banded section'],
  ['text', 'raised', 4.5, 'Primary text on card'],
  ['text', 'overlay', 4.5, 'Primary text on hover surface'],

  ['text-muted', 'void', 4.5, 'Secondary text on ground'],
  ['text-muted', 'raised', 4.5, 'Secondary text on card'],
  ['text-dim', 'void', 3.0, 'RULES AND TICKS ONLY — not body text'],

  ['on-ember', 'ember', 4.5, 'Button label on Ember fill'],
  ['ember', 'void', 3.0, 'Button fill vs ground — WCAG 1.4.11 non-text'],
  ['ember-text', 'void', 4.5, 'Ember as text on ground'],
  ['ember-text', 'surface', 4.5, 'Ember as text on banded section'],
  ['ember-text', 'raised', 4.5, 'Ember as text on card'],
  ['ember-text', 'overlay', 4.5, 'Ember as text on hover surface'],
  ['on-ember', 'ember-hover', 4.5, 'Button label on hover fill'],
  ['ember-hover', 'void', 3.0, 'Hover fill vs ground'],

  ['magenta-text', 'void', 4.5, 'Magenta as text'],
  ['magenta', 'void', 3.0, 'Magenta fills / large text only'],
  ['ocean-text', 'void', 4.5, 'Links and badges'],
  ['ocean-text', 'raised', 4.5, 'Links on card'],
  ['ocean', 'void', 3.0, 'Ocean fills only'],

  ['tungsten', 'void', 4.5, 'Data colour 3200K'],
  ['daylight', 'void', 4.5, 'Data colour 5600K'],

  ['surface', 'void', 1.0, 'Elevation step 1 (visual separation only)'],
  ['raised', 'surface', 1.0, 'Elevation step 2'],
  ['overlay', 'raised', 1.0, 'Elevation step 3'],
];

/* -- Report --------------------------------------------------------------- */

const grade = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA-large' : '—');

let failed = 0;
const rows = CHECKS.map(([fg, bg, min, note]) => {
  const ratio = contrast(resolve(fg), resolve(bg));
  const ok = ratio >= min;
  if (!ok) failed++;
  return { ok, fg, bg, ratio, min, note };
});

const w = (s, n) => String(s).padEnd(n);
console.log('\n  Beyond Pixel Studio — contrast verification');
console.log('  ' + '-'.repeat(88));
console.log(
  `  ${w('', 2)}${w('foreground', 15)}${w('on', 12)}${w('ratio', 9)}${w('min', 7)}${w('grade', 11)}note`,
);
console.log('  ' + '-'.repeat(88));

for (const r of rows) {
  console.log(
    `  ${w(r.ok ? 'ok' : 'XX', 2)}${w('--' + r.fg, 15)}${w('--' + r.bg, 12)}` +
      `${w(r.ratio.toFixed(2) + ':1', 9)}${w(r.min.toFixed(1), 7)}${w(grade(r.ratio), 11)}${r.note}`,
  );
}

console.log('  ' + '-'.repeat(88));
console.log(
  failed === 0
    ? `  All ${rows.length} pairs pass.\n`
    : `  ${failed} of ${rows.length} FAILED.\n`,
);

process.exit(failed === 0 ? 0 : 1);
