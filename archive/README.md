# chrishawk.net — archived Squarespace site

A static copy of the previous Squarespace site (captured September 2026), served at **old.chrishawk.net**
by its own Vercel project (root directory: `archive/`). It's plain HTML — no build step.

- Pages: `index.html`, `projects.html`, `resume.html`, `contact.html` (clean URLs via `vercel.json`).
- `_assets/` holds every image, stylesheet and font the pages used, downloaded from Squarespace's CDNs.
  Squarespace's scripts were removed; videos still play from YouTube, Vimeo and Wistia.
- The licensed display font (Adobe "Chinese Rocks") isn't copied; headings fall back to Bebas Neue (OFL).
- `_snapshots/` has full-page images of each page exactly as it looked live, including the original font.
- `noindex` + `robots.txt` keep it out of search results; a small banner links to the current site.
