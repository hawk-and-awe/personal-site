# Adding a project

1. Copy this `_template` folder and rename it — the folder name becomes the URL
   (`src/content/work/my-project/` → `/work/my-project`).
2. Replace `cover.jpg` with a hero frame (16:9 or wider, at least 1920px wide).
   Letterboxed frames look best with the black bars cropped off.
3. Put 3–6 stills in `stills/` (`01.jpg`, `02.jpg`, …).
4. Fill in `index.md`. Every field is explained inline; only `title`, `summary`,
   `client`, `types`, `role`, `video`, `cover` and `coverAlt` are required.
5. Set `draft: false`, commit, and push — the site rebuilds itself.

Video IDs:

- **YouTube** `https://youtu.be/ZYglgI-zBw8` → `id: ZYglgI-zBw8`
- **Vimeo** `https://vimeo.com/685534017/edabc44f4b` → `id: "685534017"`, `hash: edabc44f4b`
- **Wistia** `https://fast.wistia.net/embed/iframe/4tps7qcafr` → `id: 4tps7qcafr`
- **Self-hosted** put `my-film.mp4` in `public/media/` → `provider: file`, `id: /media/my-film.mp4`
