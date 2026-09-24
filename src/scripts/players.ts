import { timecode } from '../lib/video';

let bound = false;

/** Wire up every player on the site. Safe to call more than once. */
export function initPlayers() {
  if (bound) return;
  bound = true;

  document.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    const start = target?.closest<HTMLElement>('[data-player-start]');
    if (start) {
      const player = start.closest<HTMLElement>('[data-player]');
      if (player) play(player);
      return;
    }
    const opener = target?.closest<HTMLElement>('[data-theater]');
    if (opener) {
      e.preventDefault();
      openTheater(opener);
    }
  });

  // Leaving the page (or swapping pages with view transitions) stops anything playing.
  document.addEventListener('astro:before-swap', () => {
    document.querySelectorAll<HTMLElement>('[data-player].is-playing').forEach(reset);
    closeTheater();
  });
}

function play(player: HTMLElement) {
  const provider = player.dataset.provider;
  const src = player.dataset.src;
  const title = player.dataset.title ?? 'Video';
  if (!src) return;

  if (provider === 'file') {
    const video = player.querySelector<HTMLVideoElement>('video');
    if (!video) return;
    setupFile(player, video);
    player.classList.add('is-playing');
    video.play().catch(() => player.classList.add('is-paused'));
    video.focus({ preventScroll: true });
    return;
  }

  const stage = player.querySelector<HTMLElement>('.player__stage');
  if (!stage || stage.querySelector('iframe')) return;
  player.classList.add('is-loading');
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title;
  iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.addEventListener(
    'load',
    () => {
      player.classList.remove('is-loading');
      player.classList.add('is-playing');
      iframe.focus({ preventScroll: true });
    },
    { once: true },
  );
  stage.prepend(iframe);
}

function reset(player: HTMLElement) {
  player.classList.remove('is-playing', 'is-loading');
  player.querySelector('iframe')?.remove();
  player.querySelector('video')?.pause();
}

/* ── Self-hosted files: custom controls ───────────────────────────────── */

function setupFile(player: HTMLElement, video: HTMLVideoElement) {
  if (player.dataset.ready) return;
  player.dataset.ready = '1';

  const controls = player.querySelector<HTMLElement>('[data-controls]');
  const seek = player.querySelector<HTMLInputElement>('[data-seek]');
  const fill = player.querySelector<HTMLElement>('[data-fill]');
  const buffer = player.querySelector<HTMLElement>('[data-buffer]');
  const time = player.querySelector<HTMLElement>('[data-time]');
  const total = player.querySelector<HTMLElement>('[data-total]');
  const toggleBtn = player.querySelector<HTMLButtonElement>('[data-ctl="toggle"]');
  const muteBtn = player.querySelector<HTMLButtonElement>('[data-ctl="mute"]');
  controls?.removeAttribute('hidden');
  video.setAttribute('tabindex', '0');

  const toggle = () => (video.paused ? video.play() : video.pause());
  const sync = () => {
    const p = video.duration ? video.currentTime / video.duration : 0;
    if (fill) fill.style.width = `${p * 100}%`;
    if (seek && document.activeElement !== seek) seek.value = String(Math.round(p * 1000));
    if (time) time.textContent = timecode(video.currentTime);
  };

  video.addEventListener('timeupdate', sync);
  video.addEventListener('loadedmetadata', () => total && (total.textContent = timecode(video.duration)));
  video.addEventListener('progress', () => {
    if (!buffer || !video.duration || !video.buffered.length) return;
    buffer.style.width = `${(video.buffered.end(video.buffered.length - 1) / video.duration) * 100}%`;
  });
  video.addEventListener('play', () => {
    player.classList.remove('is-paused');
    toggleBtn?.setAttribute('aria-label', 'Pause');
    // One film at a time.
    document.querySelectorAll<HTMLVideoElement>('[data-player] video').forEach((v) => v !== video && v.pause());
  });
  video.addEventListener('pause', () => {
    player.classList.add('is-paused');
    toggleBtn?.setAttribute('aria-label', 'Play');
  });
  video.addEventListener('volumechange', () => {
    player.classList.toggle('is-muted', video.muted);
    muteBtn?.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
  });
  video.addEventListener('click', toggle);
  seek?.addEventListener('input', () => {
    if (video.duration) video.currentTime = (Number(seek.value) / 1000) * video.duration;
    sync();
  });
  toggleBtn?.addEventListener('click', toggle);
  muteBtn?.addEventListener('click', () => (video.muted = !video.muted));
  player.querySelector('[data-ctl="fullscreen"]')?.addEventListener('click', () => {
    const stage = player.querySelector<HTMLElement>('.player__stage');
    if (document.fullscreenElement) document.exitFullscreen();
    else if (stage?.requestFullscreen) stage.requestFullscreen();
    else (video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen?.();
  });
  player.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).matches('input')) return;
    const k = e.key.toLowerCase();
    if (k === ' ' || k === 'k') { e.preventDefault(); toggle(); }
    else if (k === 'arrowright') video.currentTime += 5;
    else if (k === 'arrowleft') video.currentTime -= 5;
    else if (k === 'm') video.muted = !video.muted;
    else if (k === 'f') player.querySelector<HTMLButtonElement>('[data-ctl="fullscreen"]')?.click();
  });
}

/* ── Theater: watch any film in a modal without leaving the page ──────── */

function openTheater(opener: HTMLElement) {
  const dialog = document.querySelector<HTMLDialogElement>('#theater');
  const stage = dialog?.querySelector<HTMLElement>('[data-theater-stage]');
  if (!dialog || !stage) return;
  const { src, provider, title = 'Video', href, aspect = '16/9' } = opener.dataset;
  if (!src) return;

  stage.style.setProperty('--aspect', aspect);
  stage.replaceChildren();
  if (provider === 'file') {
    const video = Object.assign(document.createElement('video'), { src, controls: true, autoplay: true, playsInline: true });
    video.setAttribute('aria-label', title);
    stage.append(video);
  } else {
    const iframe = document.createElement('iframe');
    Object.assign(iframe, { src, title, allowFullscreen: true, referrerPolicy: 'strict-origin-when-cross-origin' });
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    stage.append(iframe);
  }

  const heading = dialog.querySelector('[data-theater-title]');
  if (heading) heading.textContent = title;
  const link = dialog.querySelector<HTMLAnchorElement>('[data-theater-link]');
  if (link) {
    link.hidden = !href;
    if (href) link.href = href;
  }

  dialog.showModal();
  document.documentElement.classList.add('theater-open');
}

function closeTheater() {
  const dialog = document.querySelector<HTMLDialogElement>('#theater');
  if (!dialog) return;
  dialog.querySelector('[data-theater-stage]')?.replaceChildren();
  if (dialog.open) dialog.close();
  document.documentElement.classList.remove('theater-open');
}

// Closing wiring lives here so the Theater component stays markup-only.
document.addEventListener('click', (e) => {
  const t = e.target as Element;
  if (t.closest('[data-theater-close]') || (t instanceof HTMLDialogElement && t.id === 'theater')) closeTheater();
});
document.addEventListener('close', (e) => {
  if ((e.target as Element).id === 'theater') closeTheater();
}, true);
document.addEventListener('click', (e) => {
  // Following the "view case study" link out of the theater closes it first.
  if ((e.target as Element).closest('[data-theater-link]')) closeTheater();
}, true);
