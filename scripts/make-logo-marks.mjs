#!/usr/bin/env node
/**
 * Bake white variants of the client logos.
 *
 * The wall is dark, so the marks have to be light. Doing that with a live CSS
 * `filter: brightness(0) invert(1)` costs one rasterisation boundary PER IMAGE,
 * and there are 92 tiles inside three continuously transforming rows — measured
 * at 25fps with a 167ms worst frame, which is the flicker.
 *
 * Baking it removes all 92 filters: the browser just draws an image.
 *
 * Method: take the source alpha channel and use it as a mask over solid white,
 * so the mark's silhouette is preserved exactly and every colour is discarded.
 * Every source logo has real transparency (verified), so this is lossless as to
 * shape.
 *
 * Run: node scripts/make-logo-marks.mjs
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';

const SRC = 'public/clients';
const OUT = 'public/clients/mark';
mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => /\.webp$/i.test(f));
let done = 0;

for (const f of files) {
  const { data: alpha, info } = await sharp(`${SRC}/${f}`)
    .ensureAlpha()
    .extractChannel('alpha')
    .raw()
    .toBuffer({ resolveWithObject: true });

  await sharp({
    create: { width: info.width, height: info.height, channels: 3, background: '#ffffff' },
  })
    .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(`${OUT}/${f}`);
  done++;
}
console.log(`baked ${done} white marks -> ${OUT}/`);
