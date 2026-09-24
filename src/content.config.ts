import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const video = z.object({
  provider: z.enum(['youtube', 'vimeo', 'wistia', 'file']),
  /** YouTube/Vimeo/Wistia video ID, or a path/URL to an .mp4 when provider is "file". */
  id: z.string(),
  /** Vimeo private-link hash (the part after the ID in unlisted links). */
  hash: z.string().optional(),
  /** Runtime in seconds — shown as a timecode on the player. */
  duration: z.number().optional(),
  /** Display aspect ratio, e.g. "16/9", "9/16", "1/1", "4/5". */
  aspect: z.string().default('16/9'),
});

/**
 * One folder per project in src/content/work/<slug>/ holding index.md, cover.jpg and stills/.
 * Copy src/content/work/_template to start a new one.
 */
const work = defineCollection({
  loader: glob({
    pattern: ['*/index.md', '!_*/**'],
    base: './src/content/work',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One-line hook shown under the title. */
      summary: z.string(),
      client: z.string(),
      year: z.number().optional(),
      /** Drives the library filters. */
      types: z.array(z.enum(['motion', 'live-action'])).min(1),
      /** Your role in a few words, e.g. "Producer & Editor". */
      role: z.string(),
      /** What you personally did — the heart of the case study. */
      contributions: z.array(z.string()).default([]),
      tools: z.array(z.string()).default([]),
      deliverables: z.array(z.string()).default([]),
      credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),
      results: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      video,
      /** Extra cuts: social versions, BTS, alternates. */
      extras: z.array(video.extend({ label: z.string() })).default([]),
      cover: image(),
      coverAlt: z.string(),
      stills: z.array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() })).default([]),
      featured: z.boolean().default(false),
      /** Lower numbers sort first. */
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

/** Photography, one folder per trip in src/content/stills/<slug>/ with an index.yaml and the photos. */
const stills = defineCollection({
  loader: glob({
    pattern: ['*/index.yaml', '!_*/**'],
    base: './src/content/stills',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      places: z.string().optional(),
      year: z.number(),
      order: z.number().default(100),
      photos: z.array(z.object({ src: image(), alt: z.string(), place: z.string().optional() })),
    }),
});

/**
 * The Lab: R&D, pipelines and look development. One markdown file per entry in src/content/lab/.
 * An entry stays unpublished while its `pending` list has anything in it — delete the items as you clear them.
 */
const lab = defineCollection({
  loader: glob({ pattern: ['*.md', '!_*'], base: './src/content/lab' }),
  schema: ({ image }) =>
    z.object({
      code: z.string(),
      title: z.string(),
      group: z.enum(['production', 'midjourney', 'methods']),
      oneLiner: z.string().max(140),
      status: z.enum(['in-use', 'shipped', 'experiment', 'ongoing']).optional(),
      years: z.string().optional(),
      role: z.string().optional(),
      format: z.string().optional(),
      tools: z.array(z.string()).default([]),
      highlights: z.array(z.string()).default([]),
      numbers: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      /** Shown as a monospace snippet; [bracketed] parts are highlighted as slots. */
      promptFormula: z.string().optional(),
      /** A left-to-right flow. A nested list is a group of inputs joined with "+". */
      diagram: z.array(z.union([z.string(), z.array(z.string())])).optional(),
      images: z.array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() })).default([]),
      /** Short clips in public/media/lab/, e.g. /media/lab/news-01.mp4 */
      clips: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() })).default([]),
      related: z.array(z.string()).default([]),
      pending: z.array(z.string()).default([]),
      order: z.number().default(100),
    }),
});

export const collections = { work, stills, lab };
