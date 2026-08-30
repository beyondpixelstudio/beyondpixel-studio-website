/**
 * YouTube, at BUILD TIME.
 *
 * This runs in Node during `astro build`, never in a browser. That is the whole
 * point of it existing separately from the live top-up: the videos end up in
 * the HTML as real text, so the page paints instantly, works with JavaScript
 * off, and Google can index the titles. A grid that is only ever filled by
 * client-side fetch is invisible to search, which for this site would be
 * throwing away the reason the page exists.
 *
 * -------------------------------------------------------------------------
 * THE BUILD MUST NEVER FAIL BECAUSE OF THIS
 *
 * No API key, no network, YouTube down, quota exhausted, a playlist made
 * private — every one of those returns an empty result and logs a warning. It
 * does not throw. `npm run verify` has to keep working on a laptop with no
 * key configured, and a deploy must never be blocked by someone else's API
 * being unavailable. When baking yields nothing, the live top-up still fills
 * the grid in the browser, so the page degrades to "works but unindexed"
 * rather than to "broken".
 *
 * -------------------------------------------------------------------------
 * THE KEY
 *
 * Read from the YOUTUBE_API_KEY environment variable, which lives in `.env`
 * (gitignored) and in the deploy environment. It is used ONLY here, in Node.
 * It is never referenced from anything that ships to a browser — the live
 * top-up goes through the Apps Script proxy for exactly that reason, so no key
 * is ever in dist/ for the credential scan to find.
 */

export interface Video {
  id: string;
  title: string;
  /** i.ytimg.com URL. Stable and intended to be hotlinked, unlike Instagram's. */
  thumb: string;
  /** ISO date the video was added to the playlist. */
  published: string;
}

export interface PlaylistData {
  id: string;
  /** YouTube's own title. The page may override it. */
  title: string;
  videos: Video[];
  /** Total in the playlist, which may exceed the number shown. */
  total: number;
}

const API = 'https://www.googleapis.com/youtube/v3';

/**
 * Pick the largest thumbnail YouTube actually returned.
 *
 * Not every video has every size — `maxres` in particular only exists if the
 * uploader supplied a custom thumbnail at that resolution, and reading it
 * blindly yields `undefined` and a broken image for exactly the older videos
 * most likely to be in an archive playlist.
 */
const bestThumb = (t: Record<string, { url: string }> | undefined): string =>
  t?.maxres?.url ?? t?.standard?.url ?? t?.high?.url ?? t?.medium?.url ?? t?.default?.url ?? '';

/**
 * Fetch one playlist's title, total count and first `max` videos.
 * Returns null on any failure — see the header.
 */
export async function fetchPlaylist(id: string, max: number): Promise<PlaylistData | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;

  try {
    /* Two calls, because they answer different questions and only one of them
       is per-video. `playlists.list` gives the title and the true total, which
       `playlistItems.list` cannot: its `totalResults` counts what the page
       size allowed, not what the playlist holds. Without the real total the
       "see all N" link would lie. Two units of quota out of 10,000 a day. */
    const [metaRes, itemsRes] = await Promise.all([
      fetch(`${API}/playlists?part=snippet,contentDetails&id=${id}&key=${key}`),
      fetch(
        `${API}/playlistItems?part=snippet&playlistId=${id}&maxResults=${max}&key=${key}`
      ),
    ]);

    if (!metaRes.ok || !itemsRes.ok) {
      console.warn(
        `[youtube] ${id}: HTTP ${metaRes.status}/${itemsRes.status} — section will rely on the live top-up`
      );
      return null;
    }

    const meta = await metaRes.json();
    const items = await itemsRes.json();
    const pl = meta.items?.[0];
    if (!pl) {
      console.warn(`[youtube] ${id}: no such public playlist`);
      return null;
    }

    const videos: Video[] = (items.items ?? [])
      /* Deleted and private videos stay in a playlist as tombstones: the item
         still exists, but its snippet has no usable resourceId and the title
         reads "Deleted video". Rendering those would put dead grey cards in a
         portfolio grid, so they are dropped here rather than filtered in the
         template — the template should not have to know YouTube's failure
         modes. */
      .filter((i: any) => {
        const vid = i.snippet?.resourceId?.videoId;
        const t = i.snippet?.title;
        return vid && t && t !== 'Deleted video' && t !== 'Private video';
      })
      .map((i: any) => ({
        id: i.snippet.resourceId.videoId,
        title: i.snippet.title,
        thumb: bestThumb(i.snippet.thumbnails),
        published: i.snippet.publishedAt ?? '',
      }));

    return {
      id,
      title: pl.snippet?.title ?? '',
      videos,
      total: pl.contentDetails?.itemCount ?? videos.length,
    };
  } catch (err) {
    console.warn(`[youtube] ${id}: ${(err as Error).message} — section will rely on the live top-up`);
    return null;
  }
}
