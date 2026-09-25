# chrishawk.net — notes for Claude

Chris Hawk's portfolio (motion designer & video producer, Oklahoma City). Static Astro site, no framework.
`README.md` is the owner-facing guide; this file is the working knowledge a new session needs.

## Run and deploy

- Node 22.12+. `npm install`, then `npm run dev` (http://localhost:4321, drafts visible), `npm run build`,
  `npm run check` (type-checks content frontmatter too — run it after editing any entry).
- Hosted on Vercel from this GitHub repo (`hawk-and-awe/personal-site`). **Merging into `main` publishes to
  www.chrishawk.net**, so work on a branch; every branch gets a preview URL. Don't push to `main` unasked.
- `archive/` is the old Squarespace site served at old.chrishawk.net — leave it alone.

## Where things live

| What                                   | Where                                        |
| -------------------------------------- | -------------------------------------------- |
| Name, email, socials, reel, nav        | `src/site.config.ts`                         |
| Bio, experience, tools (About page)    | `src/data/resume.ts`                         |
| Work entries (case studies)            | `src/content/work/<slug>/`                   |
| Lab entries (R&D)                      | `src/content/lab/*.md` — see README          |
| Frontmatter schemas                    | `src/content.config.ts`                      |
| Colors, type, grain                    | `src/styles/global.css`                      |
| Self-hosted video                      | `public/media/`                              |

## Work entries

One folder per project: `src/content/work/<slug>/` with `index.md`, `cover.jpg` and `stills/01.jpg…`.
The folder name is the URL (`/work/<slug>`). `_template/` shows every field; the schema is in
`src/content.config.ts`. Required: `title`, `summary`, `client`, `types`, `role`, `video`, `cover`, `coverAlt`.

House style, taken from the existing entries (match it):

- **Client** is `American Fidelity` for all the corporate work so far.
- **title**: plain and descriptive — `Danny — Customer Testimonial`, `Hands-Free Billing Promo`.
- **summary**: one sentence, a hook, no period-stacking. E.g. "A documentary-style story filmed in Fresno,
  California, about an employee whose cancer coverage carried him through the hardest stretch of his life."
- **types**: `[live-action]`, `[motion]`, or both.
- **role**: a few words — `Production & Post-Production`, `Motion Designer`, `Production, Color & Animation`.
- **contributions**: short noun phrases for what *Chris* did (`Pre-production planning`, `Travel logistics`,
  `On-location production`, `Post-production`). Never invent these — ask Chris.
- **Body**: two short first-person paragraphs. First: the context ("In early 2020 we traveled to Fresno…").
  Second: Chris's part ("I took part in the planning and travel logistics, and supported the full production
  and post-production…"). Plain, modest, no marketing voice.
- **cover.jpg**: a strong frame, ≥1920 px wide, letterbox bars cropped off (the testimonials are 1920×811).
- **stills/**: 3–6 frames at 1920 px wide, JPEG ~150–300 KB each, every one with a short factual `alt`
  in double quotes (`alt: "Danny at his desk in profile."`).
- **video**: Chris prefers self-hosting: `provider: file`, `id: /media/<slug>.mp4` (see "Adding a video"
  below). Older entries still use `wistia` / `youtube` / `vimeo` IDs. `duration` is in seconds; set `aspect`
  when it isn't 16:9 (e.g. `2.39/1` for scope).
- **order** / **featured**: lower `order` sorts first; the home page shows the first four `featured: true`.
  Current orders: 1 carlos, 2 billing-new-feature-promo, 3 danny, 4 sales-conference-infographic,
  5 guided-enrollment-pandemic-safety, 6 enrollment-platform-promo, 7 hands-free-billing-promo, 8 indiana
  (kept last and unfeatured on purpose — it's the oldest).
- New entries start as `draft: true` until Chris has confirmed role, contributions and copy.

## Adding a video

Use the **`add-work-video` skill** (`.claude/skills/add-work-video/`, or `/add-work-video`): it scans the cut,
picks frames, drafts the entry, encodes and self-hosts the film, and checks it, with scripts for each step.
The facts it relies on:

- Masters live on Chris's PC under `D:\AE_PROJECTS\PortfolioSite 2026\` and in the **thechrishawk@gmail.com**
  Google Drive ("Chris AF Projects"). A cloud session can reach neither: the Drive connector is signed in as
  hawk@chrishawk.net, so ask Chris for a Drive link shared as "Anyone with the link".
- Self-hosted films live in `public/media/<slug>.mp4` and play in the site's own player (`VideoPlayer.astro` +
  `PlayerControls.astro`, wired in `src/scripts/players.ts`; the theater modal uses the same controls).
  **Keep every file under 50 MB**: GitHub warns above 50 MB, rejects files over 100 MB, and keeps every pushed
  file in history for good.
