#!/usr/bin/env python3
"""Scan a finished cut for a Work entry: fetch it, probe it, tile timestamped contact sheets, transcribe it.

    python scan.py <video path | Google Drive file or folder link> --out <scratch dir> [--name "Carolos"]

--name picks the file when a Drive folder holds several videos (case-insensitive substring match).
Drive links must be shared as "Anyone with the link". Writes into --out:
    source.<ext>      the downloaded video (skipped when a local path is given)
    probe.json        duration, size, fps, suggested frontmatter aspect, letterbox crop if any
    sheet-NN.jpg      4x4 contact sheets, one frame every --every seconds, each labelled m:ss
    transcript.txt    [m:ss.ss] timestamped transcript (faster-whisper, small.en)
Needs: pip install imageio-ffmpeg faster-whisper pillow gdown   (a system ffmpeg is used if present)
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _ff import aspect_label, detect_bars, probe, run  # noqa: E402

VIDEO_EXT = ('.mp4', '.mov', '.m4v', '.mkv', '.mxf', '.avi', '.webm')


def fetch(src: str, out: Path, name: str | None) -> Path:
    if Path(src).exists():
        return Path(src)
    if 'drive.google.com' not in src:
        sys.exit(f'Not a file or a Google Drive link: {src}')
    import gdown

    folder = re.search(r'/folders/([\w-]+)', src)
    if folder:
        files = gdown.download_folder(id=folder.group(1), skip_download=True, quiet=True) or []
        vids = [f for f in files if f.path.lower().endswith(VIDEO_EXT)]
        if name:
            vids = [f for f in vids if name.lower() in f.path.lower()]
        if len(vids) != 1:
            listing = '\n  '.join(f.path for f in files) or '(nothing — is it shared as "Anyone with the link"?)'
            sys.exit(f'Found {len(vids)} matching videos; pass --name to pick one. Folder holds:\n  {listing}')
        file_id, filename = vids[0].id, vids[0].path
    else:
        m = re.search(r'/d/([\w-]+)|[?&]id=([\w-]+)', src)
        if not m:
            sys.exit(f'No file ID in {src}')
        file_id, filename = m.group(1) or m.group(2), 'source.mp4'
    dest = out / f'source{Path(filename).suffix.lower() or ".mp4"}'
    if dest.exists():
        print(f'Using the copy already downloaded: {dest}')
    else:
        print(f'Downloading {filename} …')
        if not gdown.download(id=file_id, output=str(dest), quiet=False):
            sys.exit('Download failed — check the link is shared as "Anyone with the link".')
    (out / 'source-name.txt').write_text(filename)
    return dest


def contact_sheets(video: Path, out: Path, every: float) -> list[Path]:
    from PIL import Image, ImageDraw

    thumbs = out / 'thumbs'
    thumbs.mkdir(exist_ok=True)
    for old in thumbs.glob('*.jpg'):
        old.unlink()
    run(['-i', str(video), '-vf', f'fps=1/{every},scale=640:-2', '-q:v', '4', '-y', str(thumbs / '%04d.jpg')])
    frames = sorted(thumbs.glob('*.jpg'))
    if not frames:
        sys.exit('No frames extracted.')
    w, h = Image.open(frames[0]).size
    sheets = []
    for s in range(0, len(frames), 16):
        sheet = Image.new('RGB', (w * 4, h * 4), 'black')
        for k, f in enumerate(frames[s:s + 16]):
            t = int((s + k) * every)
            im = Image.open(f)
            d = ImageDraw.Draw(im)
            d.rectangle([0, 0, 58, 20], fill='black')
            d.text((6, 5), f'{t // 60}:{t % 60:02d}', fill=(228, 240, 74))
            sheet.paste(im, ((k % 4) * w, (k // 4) * h))
        path = out / f'sheet-{s // 16 + 1:02d}.jpg'
        sheet.save(path, quality=85)
        sheets.append(path)
    return sheets


def transcribe(video: Path, out: Path) -> Path | None:
    wav = out / 'audio.wav'
    run(['-i', str(video), '-vn', '-ac', '1', '-ar', '16000', '-y', str(wav)])
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print('faster-whisper not installed; skipping the transcript (pip install faster-whisper).')
        return None
    model = WhisperModel('small.en', device='cpu', compute_type='int8')
    segments, _ = model.transcribe(str(wav), vad_filter=True, beam_size=5)
    path = out / 'transcript.txt'
    with path.open('w', encoding='utf-8') as fh:
        for seg in segments:
            fh.write(f'[{int(seg.start // 60)}:{seg.start % 60:05.2f}] {seg.text.strip()}\n')
    return path


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('source')
    ap.add_argument('--out', required=True, type=Path)
    ap.add_argument('--name', help='substring of the file name when a Drive folder holds several videos')
    ap.add_argument('--every', type=float, help='seconds between contact-sheet frames (default: 3, or 5 over 5 min)')
    ap.add_argument('--no-transcript', action='store_true')
    a = ap.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)

    video = fetch(a.source, a.out, a.name)
    info = probe(str(video))
    crop = detect_bars(str(video), info['duration'])
    content_h = int(crop.split(':')[1]) if crop else info['height']
    info.update(source=str(video), crop=crop, aspect=aspect_label(info['width'], content_h))
    (a.out / 'probe.json').write_text(json.dumps(info, indent=2))
    print(json.dumps(info, indent=2))

    every = a.every or (3 if info['duration'] <= 300 else 5)
    for sheet in contact_sheets(video, a.out, every):
        print('sheet:', sheet)
    if not a.no_transcript:
        t = transcribe(video, a.out)
        if t:
            print('transcript:', t)


if __name__ == '__main__':
    main()
