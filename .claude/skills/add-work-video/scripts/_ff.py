"""Shared helpers for the add-work-video scripts: find ffmpeg, probe a video, detect letterbox bars.

Works with a system ffmpeg or the static build from `pip install imageio-ffmpeg` (which has no ffprobe
and no drawtext filter, so everything here parses `ffmpeg -i` output and labels images with Pillow).
"""
from __future__ import annotations

import re
import shutil
import subprocess
import sys
from collections import Counter
from fractions import Fraction


def ffmpeg() -> str:
    exe = shutil.which('ffmpeg')
    if exe:
        return exe
    try:
        import imageio_ffmpeg
    except ImportError:
        sys.exit('ffmpeg not found. Install it (Windows: winget install Gyan.FFmpeg) or: pip install imageio-ffmpeg')
    return imageio_ffmpeg.get_ffmpeg_exe()


def run(args: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run([ffmpeg(), '-hide_banner', *args], capture_output=True, text=True, errors='replace')


def probe(path: str) -> dict:
    """Duration, size, fps and audio presence, parsed from `ffmpeg -i`."""
    err = run(['-i', path]).stderr
    d = re.search(r'Duration: (\d+):(\d+):([\d.]+)', err)
    v = re.search(r'Stream #.*Video:.*?(\d{2,5})x(\d{2,5})', err)
    fps = re.search(r'([\d.]+) fps', err)
    if not (d and v):
        sys.exit(f'Could not read {path} as a video:\n{err[-800:]}')
    h, m, s = d.groups()
    w, ht = int(v.group(1)), int(v.group(2))
    return {
        'duration': round(int(h) * 3600 + int(m) * 60 + float(s), 2),
        'width': w,
        'height': ht,
        'fps': float(fps.group(1)) if fps else None,
        'audio': 'Audio:' in err,
    }


def aspect_label(w: int, h: int) -> str:
    """Frontmatter `aspect` value: snap to the common ratios, else the reduced fraction."""
    r = w / h
    for label, val in [('16/9', 16 / 9), ('2.39/1', 2.39), ('2/1', 2.0), ('1.85/1', 1.85), ('4/3', 4 / 3),
                       ('1/1', 1.0), ('4/5', 0.8), ('9/16', 9 / 16)]:
        if abs(r - val) / val < 0.012:
            return label
    f = Fraction(w, h).limit_denominator(100)
    return f'{f.numerator}/{f.denominator}'


def detect_bars(path: str, duration: float) -> str | None:
    """A crop=w:h:x:y filter that removes baked-in letterbox bars, or None.

    Samples five points; only crops when every sample agrees (so fades, white title cards and dark shots
    can't trick it) and the bars are at least 2% of the frame height.
    """
    info = probe(path)
    found = []
    for frac in (0.15, 0.3, 0.5, 0.7, 0.85):
        err = run(['-ss', f'{duration * frac:.2f}', '-i', path, '-t', '2', '-vf', 'cropdetect=24:2:0',
                   '-f', 'null', '-']).stderr
        crops = re.findall(r'crop=(\d+):(\d+):(\d+):(\d+)', err)
        if crops:
            found.append(crops[-1])
    if len(found) < 5:
        return None
    (w, h, x, y), n = Counter(found).most_common(1)[0]
    w, h, x, y = int(w), int(h), int(x), int(y)
    if n < 5 or w < info['width'] - 8 or info['height'] - h < info['height'] * 0.02:
        return None
    return f'crop={info["width"]}:{h - h % 2}:0:{y}'
