/**
 * Work page — the live half.
 *
 * Two jobs, and they are not the same job:
 *
 *   YOUTUBE is a TOP-UP. The grids already have videos in them, baked into the
 *   HTML at build time. This replaces them only when the proxy answers with
 *   something different, so a visitor sees content immediately and a video
 *   uploaded an hour ago still appears without waiting for a rebuild. If the
 *   proxy is down, nothing happens and nobody can tell.
 *
 *   INSTAGRAM is an UPGRADE, not the only source. The page ships four real
 *   reels as poster cards that link out. This replaces them with live <video>
 *   elements that play in place — which is the part that genuinely cannot be
 *   baked, because `media_url` is a signed CDN link that expires long before
 *   anyone loads a page built with it in. If this fails, the posters stay.
 *
 * Both are deferred to idle. Neither is allowed to compete with LCP, and
 * neither is worth a single frame of jank on a page whose first screen is
 * already complete without them.
 */

import { business } from '../data/business';

interface Video {
  id: string;
  title: string;
  thumb: string;
}
interface Reel {
  id: string;
  caption: string;
  video: string;
  poster: string;
  permalink: string;
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
/* Instagram                                                                   */
/* -------------------------------------------------------------------------- */

function renderReels(wrap: HTMLElement, reels: Reel[]) {
  const frag = document.createDocumentFragment();

  for (const r of reels) {
    const fig = el('figure', 'reel');

    const v = el('video');
    v.src = r.video;
    if (r.poster) v.poster = r.poster;
    /* preload="none" is load-bearing. Twelve vertical videos preloading their
       metadata is twelve extra connections to Meta's CDN before anyone has
       asked to watch anything. Nothing is fetched until a play. */
    v.preload = 'none';
    v.playsInline = true;
    v.controls = true;
    v.loop = true;
    v.muted = false;

    /* One at a time. Twelve reels that can all play at once is twelve
       soundtracks over each other, and on a phone it is also twelve video
       decoders. Starting one pauses the rest. */
    v.addEventListener('play', () => {
      wrap.querySelectorAll('video').forEach((o) => {
        if (o !== v) o.pause();
      });
    });

    const cap = el('figcaption', 'reel__cap');
    const link = el('a');
    link.href = r.permalink;
    link.target = '_blank';
    link.rel = 'noopener';
    // Untrusted, like the video titles — captions are user-authored text.
    link.textContent = r.caption || 'View on Instagram';
    cap.appendChild(link);

    fig.append(v, cap);
    frag.appendChild(fig);
  }

  wrap.replaceChildren(frag);
}

async function loadReels(base: string) {
  const wrap = document.querySelector<HTMLElement>('[data-reels]');
  if (!wrap) return;
  const note = document.querySelector<HTMLElement>('[data-reels-note]');

  try {
    const res = await fetch(`${base}?src=instagram`);
    const data = res.ok ? await res.json() : { error: 'http ' + res.status };

    if (data.error || !Array.isArray(data.reels) || !data.reels.length) return;

    if (note) note.hidden = true;
    renderReels(wrap, data.reels);
  } catch {
    /* LEAVE THE SEED ALONE.

       This used to call wrap.replaceChildren() and show a failure note, which
       was right when the section rendered empty and the fetch was its only
       source. It is now seeded server-side with real posters, so clearing on
       failure would DELETE working content because a proxy that may not even
       be configured yet did not answer. Failing quietly leaves the visitor with
       four real reels instead of an apology. */
  }
}

/* -------------------------------------------------------------------------- */

const base = business.mediaScriptUrl;

/* An unconfigured proxy is the normal state before Rajesh deploys the Apps
   Script, and it must not produce console noise or a broken section. The baked
   YouTube grids stand on their own; the reels section keeps its static note. */
if (base) {
  idle(() => {
    void topUpYouTube(base);
    void loadReels(base);
  });
}
