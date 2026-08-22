// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output: `npm run build` emits dist/ as plain HTML, CSS, JS and
// pre-optimised images. That folder IS the site — Hostinger needs no Node
// runtime. The sharp image pipeline runs here at build time, not on the host.
export default defineConfig({
  site: 'https://beyondpixel.studio',
  output: 'static',
  integrations: [sitemap()],
  build: {
    // /about/index.html served at /about/ — clean URLs without .htaccess
    // rewriting, which keeps the LiteSpeed config on Hostinger simple.
    format: 'directory',
  },
});
