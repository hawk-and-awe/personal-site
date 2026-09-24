---
# ─────────────────────────────────────────────────────────────────────────────
#  NEW PROJECT TEMPLATE
#  1. Copy this whole `_template` folder and rename it to your project's URL slug,
#     e.g. `src/content/work/nike-air-launch/` → chrishawk.net/work/nike-air-launch
#  2. Replace cover.jpg (16:9 or wider, ≥1920px) and drop stills into stills/.
#  3. Fill in the fields below, write the story underneath, and set draft: false.
#  Folders starting with "_" are ignored by the site.
# ─────────────────────────────────────────────────────────────────────────────

title: Project Title
summary: One sentence that makes someone want to press play.
client: Client or Brand
year: 2026
types: [motion]            # any of: motion, live-action
role: Lead Motion Designer # your role, in a few words

contributions:             # what YOU did — the most important part for hiring managers
  - Art direction and styleframes
  - 2D/3D animation
  - Edit, sound design and color

tools: [After Effects, Cinema 4D, Premiere Pro, DaVinci Resolve]
deliverables: [60s hero film, 3 × 15s social cutdowns]

credits:                   # the team around you
  - { role: Director, name: Jane Doe }
  - { role: Agency, name: Studio Name }

results:                   # impact numbers, if you have them
  - { value: "+42%", label: Watch-through rate }
  - { value: 2.1M, label: Views in the first month }

video:
  provider: vimeo          # youtube | vimeo | wistia | file
  id: "123456789"          # the ID from the video URL (or /media/file.mp4 for provider: file)
  # hash: abc123def        # Vimeo unlisted links only
  duration: 60             # seconds — shown as a timecode
  aspect: 16/9             # 9/16 for vertical, 1/1 for square

extras:                    # optional alternate cuts
  - { label: 15s cutdown, provider: vimeo, id: "123456790", aspect: 9/16 }

cover: ./cover.jpg
coverAlt: Describe the cover frame for screen readers.

stills:
  - src: ./stills/01.jpg
    alt: Describe the frame.
    caption: Optional caption shown under the still.

featured: false            # true = also show on the home page
order: 10                  # lower numbers appear first
draft: true                # set to false to publish
---

Write the story here in plain paragraphs. A good shape:

**The brief** — what the client needed and why.

**The approach** — the idea, the look, how you got there.

**The outcome** — what shipped and what it achieved.
