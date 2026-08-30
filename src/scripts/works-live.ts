/**
 * Work page — the live half. One job.
 *
 * The playlist grids already have videos in them, baked into the HTML at build
 * time. This replaces them only when the proxy answers with something
 * different, so a visitor sees content immediately and a video uploaded an hour
 * ago still appears without waiting for a rebuild. If the proxy is down or
 * unconfigured, nothing happens and nobody can tell.
 *
 * The Instagram half of this file is gone with the section it fed. It fetched
 * reels live because their playable URLs are signed and expire, so they could
 * never be baked — none of which mattered once the section itself was cut.
 *
 * Deferred to idle: this is not allowed to compete with LCP, and it is not
 * worth a frame of jank on a page whose first screen is already complete.
 */

import { business } from '../data/business';

interface Video {
  id: string;
  title: string;
  thumb: string;
}
const idle = (fn: () => void) =>
  'requestIdleCallback' in window
    ? (window as any).requestIdleCallback(fn, { timeout: 3000 })
    : setTimeout(fn, 1200);

/** Text is inserted with textContent, never innerHTML — see renderVideos(). */
const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string
): HTMLElementTagNameMap[K] => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  return n;
};

/* -------------------------------------------------------------------------- */
/* YouTube                                                                     */
/* -------------------------------------------------------------------------- */

function renderVideos(grid: HTMLElement, videos: Video[]) {
  const frag = document.createDocumentFragment();

  for (const v of videos) {
    /* A link, not a click handler on a div. This is the difference between a
       card a visitor can middle-click, copy, or open in a new tab and one that
       only works if our JavaScript is behaving. */
    const a = el('a', 'vcard');
    a.href = `https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}`;
    a.target = '_blank';
    a.rel = 'noopener';

    const shot = el('span', 'vcard__shot');
    const img = el('img');
    img.src = v.thumb;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 480;
    img.height = 270;
    shot.appendChild(img);

    const play = el('span', 'vcard__play');
    play.setAttribute('aria-hidden', 'true');
    shot.appendChild(play);

    const h = el('span', 'vcard__t');
    /* TITLES ARE UNTRUSTED. They come back from an API as arbitrary text and
       are written with textContent so a title containing markup is shown as
       characters rather than parsed. innerHTML here would be an XSS hole that
       anyone able to get a video into one of these playlists could use. */
    h.textContent = v.title;

    a.append(shot, h);
    frag.appendChild(a);
  }

  grid.replaceChildren(frag);
}

async function topUpYouTube(base: string) {
  const grids = document.querySelectorAll<HTMLElement>('[data-playlist]');

  await Promise.all(
    [...grids].map(async (grid) => {
      const id = grid.dataset.playlist!;
      const max = Number(grid.dataset.max || 8);
      try {
        const res = await fetch(`${base}?src=youtube&playlist=${encodeURIComponent(id)}&max=${max}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.error || !Array.isArray(data.videos) || !data.videos.length) return;

        /* Only touch the DOM if the answer actually differs from what was
           baked. Replacing an identical grid would drop the browser's decoded
           images and re-request every thumbnail for no visible change. */
        const now = [...grid.querySelectorAll('a')].map((a) =>
          new URL((a as HTMLAnchorElement).href).searchParams.get('v')
        );
        const next = data.videos.map((v: Video) => v.id);
        if (now.length === next.length && now.every((v, i) => v === next[i])) return;

        renderVideos(grid, data.videos);

        const count = document.querySelector<HTMLElement>(`[data-count="${id}"]`);
        if (count && data.total) count.textContent = String(data.total);
      } catch {
        /* Baked content is already on screen. Silence is the correct
           behaviour — there is nothing for a visitor to do about it. */
      }
    })
  );
}

/* -------------------------------------------------------------------------- */

const base = business.mediaScriptUrl;

/* An unconfigured proxy is the normal state before Rajesh deploys the Apps
   Script, and it must not produce console noise. The baked grids stand on their
   own — this only ever adds to them. */
if (base) {
  idle(() => void topUpYouTube(base));
}
