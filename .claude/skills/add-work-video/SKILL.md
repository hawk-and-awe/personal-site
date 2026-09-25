---
name: add-work-video
description: Add a new film to chrishawk.net as a Work entry, end to end — scan the finished cut (contact sheets and a transcript), pick the cover and stills, draft the case study in the house style, compress and self-host the video in the site's chartreuse player, check it and push a preview. Use this whenever Chris wants a new video, film, cut, testimonial, promo or export on the website or portfolio, points at a file in D:\AE_PROJECTS or a Google Drive link to footage, or asks to write up, add or post a project or Work entry — even if he doesn't name the skill. Also use it to move an existing Wistia/YouTube/Vimeo entry over to self-hosting.
argument-hint: <video path or Google Drive link>
---

# Add a video to the Work section

This is the process that produced `src/content/work/carlos-customer-testimonial/`. Use that entry as the worked
example. `CLAUDE.md` (already loaded) holds the house style and where everything lives; this file is the order
of work. The scripts in `.claude/skills/add-work-video/scripts/` do the mechanical parts; every script has
usage notes at the top. Run everything from the repo root.

Chris wants low friction: short messages, questions batched into one, results he can look at. Don't narrate
dead ends at him.

## 0. Setup

Keep footage, frames and transcripts in a scratch folder **outside the repo** (the cloud scratchpad, or
`%TEMP%\work-video\<slug>` on Chris's PC). Only the final encode and the chosen cover and stills enter the repo.

```bash
python3 -m venv <scratch>/venv && <scratch>/venv/bin/pip install -q imageio-ffmpeg faster-whisper pillow gdown
```

On Windows: `py -m pip install imageio-ffmpeg faster-whisper pillow gdown`, then call the scripts with `py`.
The scripts use a system ffmpeg when there is one, otherwise the one from imageio-ffmpeg.

## 1. Get the footage

- **Session on Chris's PC:** the masters are under `D:\AE_PROJECTS\PortfolioSite 2026\`. Use the path directly.
- **Cloud session:** it can't reach the D: drive, and the Google Drive connector is signed in as
  hawk@chrishawk.net, which can't see the **thechrishawk@gmail.com** Drive where the masters live. Don't
  search for the file; ask straight away for a Drive link (to the file, or to the "Chris AF Projects" folder)
  with **General access set to "Anyone with the link"**. He can set it back to Restricted afterwards.
  If the scan reports a 401 or an empty folder, the sharing is still Restricted.

## 2. Scan

```bash
python .claude/skills/add-work-video/scripts/scan.py "<path or Drive link>" --out <scratch>/<slug> --name "<part of the file name>"
```

This downloads the file (`--name` picks it out of a folder), writes `probe.json` (duration, size, suggested
`aspect`, any letterbox crop), timestamped contact sheets (`sheet-NN.jpg`) and `transcript.txt`. A 3-minute film
takes a few minutes, mostly the download and the transcript, so run it in the background.

Look at every contact sheet and read the whole transcript, then work out:

- **Who:** take names from on-screen titles and lower thirds, not the file name (the Carlos master was called
  "Carolos"; his lower third says Carlos). Use **first names only** in everything you write (title,
  summary, body, alt text), because search engines read all of it and Chris doesn't want subjects finding
  the films by searching their own names.
- **Where, and the story** in one sentence: that sentence becomes the summary.
- **What shows Chris's craft:** kinetic type, graphics, archival compositing, color. The second paragraph and
  the stills should show it off.
- **types:** `live-action`, `motion`, or both.

## 3. Pick the cover and stills

Compare a few candidate times around each moment you like, then look at `candidates.jpg`:

```bash
python .claude/skills/add-work-video/scripts/frames.py <video> --out <scratch>/<slug>/cand 27.2 28.0 1:13.6 1:13.9
```

Choose frames where typed text has finished, lower thirds are fully on and eyes are open. Then write the finals
straight into the entry folder; stills are numbered in the order you give them:

```bash
python .claude/skills/add-work-video/scripts/frames.py <video> --entry src/content/work/<slug> --cover 2:31.9 --stills 20.9 44.5 1:13.9 1:26.2 2:34.6 2:39.4
```

- **Cover:** a clean, strong frame with **nothing in the bottom-left**. The site draws its play button and
  runtime there; on Carlos a lower-third frame collided with it. An interview close-up usually works.
- **Stills:** six, in film order, mixing live action with the graphic and motion moments. Leave out
  near-duplicates and the logo end card. Each gets a short, factual `alt` in double quotes.

Letterbox bars are detected and cropped automatically (`--no-crop` to keep them).

## 4. Draft the entry

Copy `src/content/work/_template/` to `src/content/work/<slug>/`, keeping the frames you just wrote. Slugs
follow the existing ones: `<firstname>-customer-testimonial` for testimonials, otherwise a short title.
Follow the house style in `CLAUDE.md`. For the body:

1. **Context:** who and what happened, in plain words.
2. **Chris's part:** "In <year> I …", naming exactly what he did, then a sentence on the craft you spotted in
   step 2. Give just the year, not a date range.

Anything you don't know yet gets a `# TODO(chris)` comment, and the entry stays `draft: true`.

## 5. Ask Chris: once, in one message

Send the page screenshot (step 8) and ask only what the footage can't tell you:

1. **His role and exactly what he did.** Never guess. On Carlos I assumed pre-production, then on-location
   work, and was wrong both times: he did post only (edit, color correction and grading, audio mastering,
   original motion design and animation).
2. **Tools** (so far DaVinci Resolve and After Effects).
3. **Year** it was finished.
4. **Was he on the shoot or did he travel?** This decides whether the first paragraph can say "we traveled".
5. **Where it sorts, and is it featured?** The home page shows the first four featured entries; new work
   usually goes first.

## 6. Encode and self-host

Self-hosting is Chris's standing choice, so don't ask again. It runs about a minute per minute of film, so run it
in the background:

```bash
python .claude/skills/add-work-video/scripts/encode.py <video> public/media/<slug>.mp4
```

It crops bars, keeps the file under 50 MB (dropping to 1280 wide if it has to), and prints the `video:` block
to paste into the frontmatter. Commit only final cuts, because every pushed file stays in git history for good.
If Chris asks about cost: about 14 MB a minute, and Vercel's free plan includes 100 GB of transfer a month
(about 2,400 plays of a 3-minute film). The player (`preload="none"`) downloads nothing until someone presses play.

## 7. Order and the home page

To put the new entry first, give it `order: 1` and shift every other entry down one, keeping their order.
Indiana stays last and unfeatured. Update the "Current orders" line in `CLAUDE.md` to match.

## 8. Check it

- `npx astro sync` validates the frontmatter, and `npm run build` must pass. In the cloud container
  `npm run check` runs out of memory; use `npx tsc --noEmit -p . --ignoreDeprecations 6.0` for the TypeScript.
- Start `npm run dev`, then screenshot the page and send it to Chris:
  `node .claude/skills/add-work-video/scripts/shot.mjs http://localhost:4321/work/<slug>/ <scratch>/page.png`.
  Drafts show in dev. Look at the screenshot yourself first: check the cover against the play button, the
  stills grid and the copy.
- For a shot of the player mid-film, see `--play`/`--webm` in `shot.mjs`; the bundled Chromium can't play H.264.

## 9. Ship

- Once Chris has confirmed the details, set `draft: false`. Vercel previews are production builds, so drafts
  don't appear on them.
- Commit the entry, frames and video together on the working branch, then push.
- Find the preview: Vercel `list_deployments` (team `team_am4utDbjxXDZrifP1EbP6CsM`, project `personal-site`,
  your branch); `get_deployment` gives the stable branch alias. Previews sit behind Chris's Vercel login.
- Merging to `main` publishes www.chrishawk.net. Open the pull request only when Chris says it's ready.

**Moving an existing Wistia/YouTube entry to self-hosting:** get the master (step 1), run step 6, switch the
entry's `video:` block, then steps 8–9.
