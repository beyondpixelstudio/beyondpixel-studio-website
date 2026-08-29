#!/usr/bin/env node
/**
 * Built-output audit.
 *
 * Checks the HTML that actually ships, not the source that produced it. The
 * distinction matters: the six service links on the homepage pointed at pages
 * that did not exist for an entire phase, and nothing in the source looked
 * wrong — services.ts listed six slugs and the template linked to all six. Only
 * the built directory knew there was no page behind them.
 *
 * Checks:
 *   1. every internal link resolves to a file in dist/
 *   2. exactly one <h1> per page, and no heading level skipped
 *   3. <title> <= 60 and meta description <= 160
 *   4. canonical, lang, viewport, and a description present
 *   5. every wa.me link carries the canonical WhatsApp digits
 *   6. the phone number renders as ONE string across the whole site
 *   7. no duplicate ids on a page
 *
 * Exits non-zero on failure.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const DIST = join(ROOT, 'dist');

if (!existsSync(DIST)) {
  console.error('\n  dist/ not found. Run `npm run build` first.\n');
  process.exit(1);
}

/* -- Collect pages ------------------------------------------------------- */

const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) pages.push(p);
  }
})(DIST);

const problems = [];
const note = (page, msg) => problems.push(`${relative(DIST, page) || 'index.html'}: ${msg}`);

/* -- Canonical contact values, read from the source of truth ------------- */

const truth = readFileSync(join(ROOT, 'src', 'data', 'business.ts'), 'utf8');
const grab = (k) => truth.match(new RegExp(`${k}:\\s*'([^']+)'`))?.[1];
const PHONE_DISPLAY = grab('display');
/* Both lines are legitimate wa.me targets — the contact page offers the
   alternate deliberately. The check is that a link points at a number we own,
   not that every link points at the primary. */
const WA_DIGITS = [...truth.matchAll(/wa:\s*'(\d+)'/g)].map((m) => m[1]);

/* -- Per-page checks ----------------------------------------------------- */

/* Entities are decoded BEFORE anything is measured. Google counts the rendered
   characters, not the source bytes — a title containing "&" ships as "&amp;"
   and measures five characters too long, which is a fault in the ruler rather
   than in the title. */
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));

const strip = (s) => decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

for (const page of pages) {
  const html = readFileSync(page, 'utf8');

  // --- head essentials
  if (!/<html[^>]+lang=/i.test(html)) note(page, 'no lang attribute on <html>');
  if (!/name="viewport"/i.test(html)) note(page, 'no viewport meta');
  if (!/rel="canonical"/i.test(html)) note(page, 'no canonical link');

  const title = strip(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  if (!title) note(page, 'no <title>');
  else if (title.length > 60) note(page, `title is ${title.length} chars (max 60): "${title}"`);

  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '');
  if (!desc) note(page, 'no meta description');
  else if (desc.length > 160) note(page, `description is ${desc.length} chars (max 160)`);

  // --- headings
  const heads = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: +m[1],
    text: strip(m[2]),
  }));
  const h1s = heads.filter((h) => h.level === 1);
  if (h1s.length !== 1) note(page, `${h1s.length} <h1> elements (must be exactly 1)`);

  let prev = 0;
  for (const h of heads) {
    if (prev && h.level > prev + 1) {
      note(page, `heading jumps h${prev} -> h${h.level} at "${h.text.slice(0, 44)}"`);
    }
    prev = h.level;
  }

  // --- duplicate ids
  //
  // Two elements sharing an id is invalid, and an in-page anchor silently
  // resolves to whichever comes first — which is exactly how #contact ended up
  // scrolling to the footer instead of the enquiry form.
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
  for (const d of dupes) note(page, `duplicate id="${d}"`);

  // --- links
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean.startsWith('/')) continue;
    if (/\.[a-z0-9]{2,5}$/i.test(clean)) {
      if (!existsSync(join(DIST, clean))) note(page, `dead asset link ${href}`);
    } else {
      const target = join(DIST, clean, 'index.html');
      if (!existsSync(target)) note(page, `dead internal link ${href}`);
    }
  }

  // --- WhatsApp deep links
  for (const m of html.matchAll(/https:\/\/wa\.me\/(\d+)/g)) {
    if (!WA_DIGITS.includes(m[1])) {
      note(page, `wa.me link uses ${m[1]}, which is not one of our numbers`);
    }
  }

  // --- phone rendering: the visible string must be the canonical one
  //
  // <script> and <style> contents are dropped first. JSON-LD legitimately
  // carries the E.164 form (+917608924893), which is what schema.org requires
  // and is not a rendering of the number for a human to read — counting it as
  // one made every page fail on correct markup.
  const digitsOnly = PHONE_DISPLAY.replace(/\D/g, '');
  const text = strip(
    html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  );
  // any run of the number's digits that is NOT formatted the canonical way
  const loose = new RegExp(digitsOnly.replace(/(\d)/g, '$1[\\s-]?'), 'g');
  for (const m of text.match(loose) ?? []) {
    if (m !== PHONE_DISPLAY.replace('+91 ', '').trim() && !PHONE_DISPLAY.includes(m)) {
      note(page, `phone rendered as "${m}" — canonical is "${PHONE_DISPLAY}"`);
    }
  }
}

/* -- FAQ schema must match the visible answers ----------------------------
   Google drops the FAQ rich result when the marked-up answer and the on-page
   answer disagree, and that failure is silent — the page looks fine, the
   snippet just never appears. Both are rendered from one array in services.ts,
   so this asserts the thing that array exists to guarantee. */

const norm = (t) =>
  t
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

let faqPages = 0;
let faqQuestions = 0;

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .map((m) => {
      try {
        return JSON.parse(m[1]);
      } catch {
        return null;
      }
    })
    .filter((j) => j && j['@type'] === 'FAQPage');

  if (!blocks.length) continue;
  faqPages++;

  // `class="faq__a"` carries an Astro scope attribute after it, so match the
  // opening tag loosely rather than exactly.
  const visible = [...html.matchAll(/<p class="faq__a"[^>]*>(.*?)<\/p>/gs)].map((m) => norm(m[1]));

  for (const block of blocks) {
    for (const entry of block.mainEntity) {
      faqQuestions++;
      const answer = norm(entry.acceptedAnswer.text);
      if (!visible.includes(answer)) {
        note(page, `FAQ schema answer not found on the page: "${entry.name.slice(0, 60)}"`);
      }
      if (!norm(html).includes(norm(entry.name))) {
        note(page, `FAQ schema question not found on the page: "${entry.name.slice(0, 60)}"`);
      }
    }
  }
}

/* -- No credentials in the shipped bundle --------------------------------
   A Telegram bot token was once a module constant in src/scripts/lead-dispatcher.ts,
   which is imported from a bundled <script> — so it compiled straight into
   dist/_astro/lead-dispatcher.*.js and was served to every visitor. Nothing
   failed, nothing warned; the site worked perfectly while publishing the token.

   That class of mistake is invisible by nature, so it gets a test rather than a
   promise. Patterns below match the shapes of real credentials, not any specific
   value, so the check keeps working after the token is rotated. */

const SECRET_PATTERNS = [
  [/\b\d{8,10}:AA[\w-]{30,}/, 'Telegram bot token'],
  [/\bsk-[A-Za-z0-9]{20,}/, 'OpenAI-style API key'],
  [/\bAIza[0-9A-Za-z_-]{30,}/, 'Google API key'],
  [/\bghp_[A-Za-z0-9]{20,}/, 'GitHub token'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
];

let scanned = 0;
(function walkAssets(dir) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) { walkAssets(f); continue; }
    if (!/\.(js|mjs|css|html|json|xml|txt)$/i.test(e)) continue;
    scanned++;
    const body = readFileSync(f, 'utf8');
    for (const [re, label] of SECRET_PATTERNS) {
      if (re.test(body)) note(f, `${label} is present in the SHIPPED bundle — it is public`);
    }
  }
})(DIST);

/* -- Report -------------------------------------------------------------- */

const line = '-'.repeat(78);
console.log(`\n  Built-output audit — ${pages.length} pages in dist/\n  ${line}`);

if (problems.length) {
  for (const p of problems) console.log(`  FAIL  ${p}`);
  console.log(`  ${line}\n  ${problems.length} problem(s).\n`);
  process.exit(1);
}

console.log('  ok    every internal link resolves');
console.log('  ok    one h1 per page, no heading levels skipped');
console.log('  ok    no duplicate ids');
console.log('  ok    titles <= 60, descriptions <= 160');
console.log('  ok    canonical, lang and viewport present on every page');
console.log(`  ok    every wa.me link points at one of ${WA_DIGITS.join(' / ')}`);
console.log(`  ok    phone renders as "${PHONE_DISPLAY}" everywhere`);
console.log(
  `  ok    ${faqQuestions} FAQ answers across ${faqPages} pages match their schema verbatim`
);
console.log(`  ok    no credentials in ${scanned} shipped files`);
console.log(`  ${line}\n  Clean.\n`);
