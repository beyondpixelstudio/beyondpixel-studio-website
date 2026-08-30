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
 * The five playlists, in the order Rajesh gave them.
 *
 * Every id here was checked against YouTube before being written down, and two
 * of them are the reason that was worth doing: PLM26VPInUGKY and PLUo81h8uo2Tg
 * are only 13 characters where the other three are 34, which looks exactly like
 * a truncated paste. They are not — YouTube has issued short playlist ids as
 * well as long ones, and both resolve to real public playlists. Guessing they
 * were broken and "fixing" them would have silently dropped two sections.
 *
 * `title` is set on all five because YouTube's own names are internal
 * shorthand — "Commercial", "Drone", "Live Stream - School Annual Function" —
 * and this page is read by buyers, not by the person who filed the uploads.
 * The override is the only difference; the videos still come from YouTube, so
 * adding one there still adds it here.
 */
export const playlists: PlaylistConfig[] = [
  {
    id: 'PLM26VPInUGKY',
    title: 'Commercial Photography & Videography',
    blurb: 'Brand and product work, shot so the footage still holds up cropped to a banner or blown up on a stall wall.',
  },
  {
    id: 'PLVV9ojp8fN9sgBr_eYzVmmHXF14slDlo1',
    title: 'Documentary',
    blurb: 'Longer pieces carried by people talking, where the edit has to hold attention without music doing the work.',
  },
  {
    id: 'PLUo81h8uo2Tg',
    title: 'Drone & Aerial',
    blurb: 'Aerial coverage of sites, campuses and events. Whether a location can legally be flown is settled before anything is promised.',
  },
  {
    id: 'PLVV9ojp8fN9slxtrji32qug7l3E65BK3c',
    title: 'Live Streams',
    blurb: 'Multi-camera streams as they went out. This is the one job that cannot be done again if it goes wrong.',
  },
  {
    id: 'PLVV9ojp8fN9sFzDm7qkgHkGSjQECrwGyr',
    title: 'Annual Functions',
    blurb: 'School and college annual days, streamed live and cut afterwards. Fixed running order, no second take.',
  },
];

/** How many videos each playlist section shows: four across, two rows. */
export const PER_PLAYLIST = 8;

/** How many reels the Instagram section shows. */
export const REEL_COUNT = 12;
