/**
 * The Work page — which YouTube playlists get a section, and in what order.
 *
 * THIS IS THE ONE FILE RAJESH EDITS to change what the page shows. Adding a
 * playlist is a line here; nothing else changes. The videos inside a playlist
 * are never listed — those come from YouTube, so adding a video on YouTube is
 * all it takes for it to appear here.
 *
 * -------------------------------------------------------------------------
 * WHERE A PLAYLIST ID COMES FROM
 *
 * Open the playlist on YouTube. The URL contains `list=PL...`; the id is that
 * value, starting `PL`. For example:
 *
 *   https://www.youtube.com/playlist?list=PLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *                                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *
 * A playlist must be PUBLIC or UNLISTED. Private playlists return nothing from
 * the API key, and the section will render empty rather than erroring.
 *
 * -------------------------------------------------------------------------
 * TITLES
 *
 * `title` is optional and OVERRIDES the name YouTube holds. Leave it out and
 * the page uses YouTube's own playlist title, which is the automatic
 * behaviour. Set it when the YouTube name is internal shorthand and the site
 * needs a heading that reads as a service — the two audiences are different
 * and there is no reason the same string has to serve both.
 *
 * `blurb` is ours in every case. YouTube playlist descriptions are usually
 * empty or a dump of hashtags, so nothing is gained by reading them.
 */

export interface PlaylistConfig {
  /** YouTube playlist id, starting `PL`. */
  id: string;
  /** Optional heading override. Omit to use YouTube's own playlist title. */
  title?: string;
  /** One line under the heading. Always ours. */
  blurb?: string;
}

/**
 * TODO — RAJESH: paste the playlist ids here, in the order you want the
 * sections to appear.
 *
 * The page is built to handle this list being empty: with no playlists it
 * renders the Instagram section and an honest note, rather than a broken
 * grid. So the site keeps building and deploying until these arrive.
 */
export const playlists: PlaylistConfig[] = [
  // {
  //   id: 'PL................................',
  //   title: 'Chief Minister Events',
  //   blurb: 'Multi-camera coverage where the running order is fixed and there is no second take.',
  // },
];

/** How many videos each playlist section shows: four across, two rows. */
export const PER_PLAYLIST = 8;

/** How many reels the Instagram section shows. */
export const REEL_COUNT = 12;
