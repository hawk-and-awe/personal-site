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
- **video**: `wistia` / `youtube` / `vimeo` ID, or `provider: file` with an MP4 in `public/media/`.
  `duration` is in seconds.
- **order** / **featured**: lower `order` sorts first; the home page shows the first four `featured: true`.
  Current orders: 1 carlos, 2 billing-new-feature-promo, 3 danny, 4 sales-conference-infographic,
  5 indiana, 6 guided-enrollment-pandemic-safety, 7 enrollment-platform-promo, 8 hands-free-billing-promo.
- New entries start as `draft: true` until Chris has confirmed role, contributions and copy.

## Source footage

- Masters and exports live on Chris's PC under `D:\AE_PROJECTS\PortfolioSite 2026\`, and in the
  **thechrishawk@gmail.com** Google Drive under "Chris AF Projects". The Drive connector, when present, is signed
  in as hawk@chrishawk.net and can't see that account's files.
- A cloud session can't reach the D: drive. Scanning local footage needs a session running on Chris's PC.

### Scanning a video for an entry

Needs ffmpeg (Windows: `winget install Gyan.FFmpeg`, or `pip install imageio-ffmpeg`) and, for the transcript,
`pip install faster-whisper`. Work in a scratch folder, never in the repo.

```bash
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of default=nw=1 "in.mov"
# Contact sheet: one frame every 5 s, tiled, to see the whole film at a glance
ffmpeg -i "in.mov" -vf "fps=1/5,scale=480:-1,tile=6x6" -frames:v 1 sheet-%02d.jpg
# Scene-change frames, full size, as candidate stills
ffmpeg -i "in.mov" -vf "select='gt(scene,0.3)',scale=1920:-1" -vsync vfr -q:v 3 scene-%03d.jpg
# One exact frame (for the cover or a chosen still); add crop=1920:811 to trim letterbox bars
ffmpeg -ss 00:00:42.5 -i "in.mov" -frames:v 1 -vf "scale=1920:-1" -q:v 3 still.jpg
# Audio for transcription
ffmpeg -i "in.mov" -vn -ac 1 -ar 16000 audio.wav
```

```python
from faster_whisper import WhisperModel
m = WhisperModel("small.en", device="cpu", compute_type="int8")
for s in m.transcribe("audio.wav")[0]:
    print(f"[{s.start:6.1f}] {s.text.strip()}")
```

Use the transcript and frames to draft the title, summary, story and alt text, then ask Chris for anything the
footage can't show: his role, contributions, year, location, and where the public cut is hosted.
