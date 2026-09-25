#!/usr/bin/env python3
"""Encode a master for the site's self-hosted player and print the entry's `video:` frontmatter.

    python encode.py <master> public/media/<slug>.mp4 [--no-crop] [--width 1280]

H.264 High, CRF 22 capped at 5 Mb/s, AAC 160k, faststart; letterbox bars cropped off (unless --no-crop).
Every file must stay under 50 MB (GitHub warns above 50 and rejects above 100, and pushed files stay in
git history for good), so an encode that comes out too big is redone at 1280 wide, then at CRF 25.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _ff import aspect_label, detect_bars, probe, run  # noqa: E402

LIMIT_MB = 50


def encode(src: str, dest: Path, width: int, crf: int, crop: str | None) -> float:
    vf = ','.join(filter(None, [crop, f'scale={width}:-2:flags=lanczos']))
    res = run(['-i', src, '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-maxrate', '5M',
               '-bufsize', '10M', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k',
               '-ac', '2', '-movflags', '+faststart', '-y', str(dest)])
    if res.returncode or not dest.exists():
        sys.exit(f'Encode failed:\n{res.stderr[-1200:]}')
    mb = dest.stat().st_size / 1e6
    print(f'{width} wide, CRF {crf}: {mb:.1f} MB')
    return mb


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('master')
    ap.add_argument('dest', type=Path, help='public/media/<slug>.mp4')
    ap.add_argument('--width', type=int, default=1920)
    ap.add_argument('--no-crop', action='store_true')
    a = ap.parse_args()
    a.dest.parent.mkdir(parents=True, exist_ok=True)

    info = probe(a.master)
    crop = None if a.no_crop else detect_bars(a.master, info['duration'])
    if crop:
        print(f'Cropping letterbox bars: {crop}')
    print(f'Encoding {info["duration"]:.0f}s — about {info["duration"] / 60 * 14:.0f} MB at 1920; a few minutes …')

    small = min(a.width, 1280)
    attempts = dict.fromkeys([(a.width, 22), (small, 22), (small, 25)])  # ordered, without repeats
    for width, crf in attempts:
        mb = encode(a.master, a.dest, width, crf, crop)
        if mb < LIMIT_MB:
            break
    else:
        sys.exit(f'Still {mb:.0f} MB — too big to commit. Ask Chris for a shorter cut or host it elsewhere.')

    out = probe(str(a.dest))
    rel = '/' + a.dest.as_posix().split('public/', 1)[-1]
    print('\nvideo:')
    print('  provider: file')
    print(f'  id: {rel}')
    print(f'  duration: {round(out["duration"])}')
    aspect = aspect_label(out['width'], out['height'])
    if aspect != '16/9':
        print(f'  aspect: {aspect}')


if __name__ == '__main__':
    main()
