#!/usr/bin/env python3
"""Pull exact frames from a cut: candidates to compare, then the entry's cover and stills.

Compare candidates (writes <out>/<t>.jpg at 1920 px plus <out>/candidates.jpg, a labelled grid to look at):
    python frames.py <video> --out <scratch>/cand 27.2 28.0 73.3 73.9 1:26.2

Write the finals straight into the entry folder (cover.jpg + stills/01.jpg, 02.jpg … in the order given):
    python frames.py <video> --entry src/content/work/<slug> --cover 151.9 --stills 20.9 44.5 73.9 86.2

Times are seconds or m:ss(.s). Letterbox bars are detected and cropped off unless --no-crop.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _ff import detect_bars, probe, run  # noqa: E402


def seconds(t: str) -> float:
    parts = [float(p) for p in t.split(':')]
    return sum(p * 60 ** i for i, p in enumerate(reversed(parts)))


def grab(video: str, t: float, dest: Path, crop: str | None) -> Path:
    vf = ','.join(filter(None, [crop, 'scale=1920:-2:flags=lanczos']))
    tmp = dest.with_suffix('.png')
    res = run(['-ss', f'{t:.3f}', '-i', video, '-frames:v', '1', '-vf', vf, '-y', str(tmp)])
    if not tmp.exists():
        sys.exit(f'Could not grab a frame at {t}s:\n{res.stderr[-600:]}')
    from PIL import Image

    # JPEG ~84 lands the 150–300 KB the site's stills use.
    Image.open(tmp).convert('RGB').save(dest, quality=84, optimize=True, progressive=True)
    tmp.unlink()
    return dest


def grid(paths: list[Path], labels: list[str], dest: Path) -> None:
    from PIL import Image, ImageDraw

    tw = 640
    ims = []
    for p, label in zip(paths, labels):
        im = Image.open(p)
        im = im.resize((tw, round(im.height * tw / im.width)))
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 90, 20], fill='black')
        d.text((6, 5), label, fill=(228, 240, 74))
        ims.append(im)
    cols = 3
    h = max(i.height for i in ims)
    sheet = Image.new('RGB', (tw * cols, h * ((len(ims) + cols - 1) // cols)), 'black')
    for k, im in enumerate(ims):
        sheet.paste(im, ((k % cols) * tw, (k // cols) * h))
    sheet.save(dest, quality=85)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('video')
    ap.add_argument('times', nargs='*', help='candidate times (with --out)')
    ap.add_argument('--out', type=Path, help='folder for candidates')
    ap.add_argument('--entry', type=Path, help='entry folder, e.g. src/content/work/carlos-customer-testimonial')
    ap.add_argument('--cover')
    ap.add_argument('--stills', nargs='*', default=[])
    ap.add_argument('--no-crop', action='store_true')
    a = ap.parse_intermixed_args()  # lets candidate times come after --out

    crop = None if a.no_crop else detect_bars(a.video, probe(a.video)['duration'])
    if crop:
        print(f'Cropping letterbox bars: {crop}')

    if a.entry:
        if not a.cover and not a.stills:
            sys.exit('--entry needs --cover and/or --stills')
        a.entry.mkdir(parents=True, exist_ok=True)
        written = []
        if a.cover:
            written.append(grab(a.video, seconds(a.cover), a.entry / 'cover.jpg', crop))
        if a.stills:
            (a.entry / 'stills').mkdir(parents=True, exist_ok=True)
            for old in (a.entry / 'stills').glob('*.jpg'):
                old.unlink()
            for i, t in enumerate(a.stills, 1):
                written.append(grab(a.video, seconds(t), a.entry / 'stills' / f'{i:02d}.jpg', crop))
        for p in written:
            print(f'{p}  {p.stat().st_size // 1024} KB')
        return

    if not (a.out and a.times):
        sys.exit('Give candidate times with --out, or finals with --entry.')
    a.out.mkdir(parents=True, exist_ok=True)
    paths = [grab(a.video, seconds(t), a.out / f'{t.replace(":", "m")}.jpg', crop) for t in a.times]
    grid(paths, a.times, a.out / 'candidates.jpg')
    print(a.out / 'candidates.jpg')


if __name__ == '__main__':
    main()
