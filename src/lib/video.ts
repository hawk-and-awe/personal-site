export type Provider = 'youtube' | 'vimeo' | 'wistia' | 'file';

export interface Video {
  provider: Provider;
  id: string;
  hash?: string;
  duration?: number;
  aspect?: string;
}

const ACCENT = 'e4f04a';

/** Embed URL for a provider, set to start playing immediately (the user already pressed play). */
export function embedUrl(v: Pick<Video, 'provider' | 'id' | 'hash'>): string {
  switch (v.provider) {
    case 'youtube':
      return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    case 'vimeo': {
      const h = v.hash ? `h=${encodeURIComponent(v.hash)}&` : '';
      return `https://player.vimeo.com/video/${encodeURIComponent(v.id)}?${h}autoplay=1&title=0&byline=0&portrait=0&dnt=1&color=${ACCENT}`;
    }
    case 'wistia':
      return `https://fast.wistia.net/embed/iframe/${encodeURIComponent(v.id)}?autoPlay=true&playerColor=${ACCENT}&fitStrategy=contain`;
    case 'file':
      return v.id;
  }
}

/** Public watch page, used for structured data and "watch elsewhere" links. */
export function watchUrl(v: Pick<Video, 'provider' | 'id' | 'hash'>): string {
  switch (v.provider) {
    case 'youtube':
      return `https://www.youtube.com/watch?v=${v.id}`;
    case 'vimeo':
      return `https://vimeo.com/${v.id}${v.hash ? `/${v.hash}` : ''}`;
    case 'wistia':
      return `https://fast.wistia.net/embed/iframe/${v.id}`;
    case 'file':
      return v.id;
  }
}

/** 69 → "01:09", 3725 → "1:02:05" */
export function timecode(seconds?: number): string {
  if (seconds == null || !Number.isFinite(seconds)) return '--:--';
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`;
}

/** ISO 8601 duration for schema.org, e.g. PT1M9S. */
export function isoDuration(seconds?: number): string | undefined {
  if (seconds == null) return undefined;
  const s = Math.round(seconds);
  return `PT${Math.floor(s / 60)}M${s % 60}S`;
}

const ROMAN: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];
export function roman(n: number): string {
  let out = '';
  for (const [v, s] of ROMAN) while (n >= v) { out += s; n -= v; }
  return out;
}
