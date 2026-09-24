# chrishawk.net

Portfolio of Chris Hawk — motion designer & video producer.
Built with [Astro](https://astro.build) as a fast static site: no framework, no tracking, just HTML, CSS and a little TypeScript.

**Art direction — "Future Medieval × cinema":** ink-black pages, parchment type, one acid-chartreuse accent, film grain, blurred neon photography, a woodcut-printed hawk in flight (a perched pose on a film reel is one config switch away), Jacquard 24 pixel-blackletter for display moments, Geist for everything you read, and manuscript details (☞ manicules, roman numerals, a boxed initial).

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
| Photographs (page currently hidden)          | `src/content/stills/<trip>/`                  |
| Colors, type scale, grain                    | `src/styles/global.css` (tokens at the top)   |
| The hawk (woodcut) and header roundel        | `src/components/Hawk.astro` / `HawkMark.astro` |

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

## Photographs (hidden for now)

The Stills page is switched off: its file is `src/pages/_stills.astro` (a leading `_` stops Astro from publishing
it). To bring it back, rename it to `stills.astro` and uncomment the Stills line in `site.nav` in
`src/site.config.ts`. Each trip is a folder in `src/content/stills/` with the photos and an `index.yaml`
listing them in order (`src`, `alt`, optional `place`); export JPEGs at about 2000 px on the long edge.

## The Lab

R&D entries live in `src/content/lab/`, one markdown file each, grouped as Production & Pipeline, Look
Development (Midjourney) and Methods. An entry is **published only when its `pending:` list is empty** — delete
each item as you clear it. The `/lab` page and its nav link don't exist until at least one entry is published;
`npm run dev` shows every entry with a red "Not published" note listing what's outstanding. Images go next to the
file (`images:`), clips in `public/media/lab/` (`clips:`). Held-back ideas are noted in `src/content/lab/_held.md`.

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
