import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog posts.
 *
 * `hero` points at an SVG in /public/blog/. Deliberately DIAGRAMS rather than
 * photographs: the brief forbids stock imagery that could be mistaken for our
 * own work, and we have no shoot stills cleared for publication yet. A drawn
 * camera plan or airspace diagram is honest about what it is, explains the
 * thing the paragraph next to it is describing, weighs a few KB, and stays
 * sharp at any size. Real photography from our own shoots replaces or joins
 * these when it is available and cleared.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** <= 160 chars — becomes the meta description. */
    description: z.string(),
    /**
     * <title> when the headline is too long for one. Post titles are written to
     * be read on the page, and a good headline is often longer than the ~60
     * characters a search result will show — Google truncates the rest. The H1
     * keeps the full headline; this is what goes in the tab and the SERP.
     */
    seoTitle: z.string().max(60).optional(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    /** Shown on the card and above the article. */
    kicker: z.string(),
    hero: z.string(),
    heroAlt: z.string(),
    tags: z.array(z.string()).default([]),
    /** Pulled onto the homepage highlight strip. */
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
