// Screenshot a page of the running site (npm run dev) so Chris can see an entry before it ships.
//
//   node shot.mjs http://localhost:4321/work/<slug>/ out.png            full page, cropped to the top 3200 px
//   node shot.mjs http://localhost:4321/work/<slug>/ out.png --play 74 --webm preview.webm
//        the player itself, paused at 74 s. Playwright's bundled Chromium can't decode H.264, so --webm
//        serves a VP9 copy in place of the MP4 (make one with: ffmpeg -t 100 -i <slug>.mp4
//        -vf scale=1280:-2 -c:v libvpx-vp9 -deadline realtime -cpu-used 8 -b:v 1500k -c:a libopus preview.webm).
//
// Finds Playwright from the project, then the global install (set PWPATH to point at it otherwise).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const [url, out, ...rest] = process.argv.slice(2);
if (!url || !out) {
  console.error('usage: node shot.mjs <url> <out.png> [--play <seconds> --webm <file.webm>]');
  process.exit(1);
}
const flag = (name) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : undefined;
};
const playAt = flag('--play');
const webm = flag('--webm');

const require = createRequire(import.meta.url);
let playwright;
for (const p of [process.env.PWPATH, 'playwright', path.join(execSync('npm root -g').toString().trim(), 'playwright')]) {
  try {
    if (p) { playwright = require(p); break; }
  } catch {}
}
if (!playwright) {
  console.error('Playwright not found. Skip the screenshot and ask Chris to look at npm run dev instead.');
  process.exit(1);
}

// Serve the WebM with byte ranges so the player can seek.
async function ranged(route) {
  const buf = fs.readFileSync(webm);
  const h = route.request().headers()['range'];
  const headers = { 'content-type': 'video/webm', 'accept-ranges': 'bytes' };
  if (!h) return route.fulfill({ status: 200, body: buf, headers });
  let [a, z] = h.replace('bytes=', '').split('-');
  a = Number(a);
  z = z ? Number(z) : Math.min(buf.length - 1, a + 4e6);
  return route.fulfill({
    status: 206,
    body: buf.subarray(a, z + 1),
    headers: { ...headers, 'content-range': `bytes ${a}-${z}/${buf.length}`, 'content-length': String(z - a + 1) },
  });
}

const browser = await playwright.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
if (webm) await page.route('**/media/*.mp4', ranged);
await page.goto(url, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });

if (playAt) {
  await page.click('[data-player-start]');
  await page.waitForTimeout(1200);
  await page.evaluate(async (t) => {
    const v = document.querySelector('[data-player] video');
    v.muted = true;
    v.pause();
    v.currentTime = t;
    await new Promise((r) => v.addEventListener('seeked', r, { once: true }));
  }, Number(playAt));
  await page.locator('[data-player]').first().screenshot({ path: out });
} else {
  // Scroll through once so lazy images load, then capture the top of the page.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  const height = await page.evaluate(() => Math.min(document.body.scrollHeight, 3200));
  await page.screenshot({ path: out, fullPage: true, clip: { x: 0, y: 0, width: 1440, height } });
}
await browser.close();
console.log(out);
