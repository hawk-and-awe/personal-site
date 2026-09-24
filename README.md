# chrishawk.net

Portfolio of Chris Hawk — motion designer & video producer.
Built with [Astro](https://astro.build) as a fast static site: no framework, no tracking, just HTML, CSS and a little TypeScript.

**Art direction — "Future Medieval × cinema":** ink-black pages, parchment type, one acid-chartreuse accent, film grain, blurred neon photography, a hand-inked heraldic hawk bearing a film reel, Jacquard 24 pixel-blackletter for display moments, Geist for everything you read, and manuscript details (☞ manicules, roman numerals, a boxed initial).

## Run it

```bash
npm install
npm run dev      # http://localhost:4321 — drafts are visible here
npm run build    # static site in dist/
npm run preview  # serve the build
npm run check    # type-check everything
```

Node 22.12+ is required.

## Where things live

| To change…                                   | Edit                                          |
| -------------------------------------------- | --------------------------------------------- |
| Name, email, socials, résumé link, "open to new roles" badge, the reel | `src/site.config.ts` |
| Bio, experience, impact numbers, tools, fun facts | `src/data/resume.ts`                     |
| Projects (case studies)                      | `src/content/work/<slug>/`                    |
| Photographs                                  | `src/content/stills/<trip>/`                  |
| Colors, type scale, grain                    | `src/styles/global.css` (tokens at the top)   |
| The hawk emblem                              | `src/components/Hawk.astro` / `HawkMark.astro` |

## Add a project

1. Copy `src/content/work/_template/` and rename the folder — that becomes the URL (`/work/<folder>`).
2. Replace `cover.jpg` (16:9 or wider, ≥ 1920 px, letterbox bars cropped off) and put 3–6 frames in `stills/`.
3. Fill in `index.md`. Every field is explained in the template. The most important for hiring managers is
   `contributions` — what *you* did.
4. Set `draft: false`, and `featured: true` if it should appear on the home page (the home page shows the first
   four featured projects: one wide, three below). `order` controls sorting.

Video sources: `youtube`, `vimeo` (add `hash` for unlisted links), `wistia`, or `file` for a self-hosted MP4 in
`public/media/` — self-hosted files get the site's own custom player controls.

Projects marked `# TODO(chris)` in their frontmatter still need your role and contributions confirmed.

## Add photographs

Each trip is a folder in `src/content/stills/` with the photos and an `index.yaml` listing them in order
(`src`, `alt`, optional `place`). Export JPEGs at about 2000 px on the long edge — the site makes the smaller sizes.

## Swap in a new reel

- **Hero loop** (`public/media/reel-loop.mp4`): a short, silent, looping cut. Aim for 10–20 s, H.264 MP4,
  ~1600 px wide, under ~3 MB, no audio track. Update `src/assets/reel/loop-poster.jpg` with its first frame.
- **Full reel with sound**: set `reel.video` in `src/site.config.ts` (Vimeo/YouTube/Wistia ID, or `provider: 'file'`
  with a path under `public/media/`).

## Contact form

With `contactFormEndpoint` empty (the default) the form opens the visitor's email app with the message filled in.
To receive submissions directly, create a free form at [Formspree](https://formspree.io) and paste its endpoint
(`https://formspree.io/f/…`) into `src/site.config.ts`.

## Deploy

Any static host works — Vercel, Netlify or Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`

Then point `chrishawk.net` at the new host in your domain's DNS settings (and cancel the Squarespace site once
it's live). The old Squarespace URLs `/projects` and `/resume` redirect to `/work` and `/about`.
