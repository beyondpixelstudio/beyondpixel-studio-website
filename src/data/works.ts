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

  /**
   * A hand-picked fallback, shown when the build-time API call returns nothing.
   *
   * IT EXISTS BECAUSE THE PAGE HAD TO WORK TODAY. The API key is currently
   * referrer-restricted, so it cannot be used server-side and the bake returns
   * 403 for every playlist — the grids shipped empty. These were read off the
   * public playlist pages, which need no key, and picked rather than taken in
   * order: full productions with a named client, not the twenty individual
   * dance clips a school annual day breaks into.
   *
   * It is a FALLBACK, not the source. The moment a server-usable key exists,
   * the bake overrides this and the page goes back to following YouTube. So
   * this list going stale costs nothing — it is only ever seen when the live
   * path is already broken.
   */
  seed?: SeedVideo[];
  /** True length of the playlist, for the "see all N" link. */
  seedTotal?: number;
}

export interface SeedVideo {
  id: string;
  /** Ours, not YouTube's — see the note on `title` above. */
  title: string;
  /**
   * Which thumbnail file to use. `maxresdefault` and `hq720` only exist if the
   * upload was high enough resolution; `hqdefault` always does. Each of these
   * was checked with a live request rather than assumed, because a 404 here is
   * a broken card. Five of the thirty-five only have `hqdefault`.
   */
  thumb: 'maxresdefault' | 'hq720' | 'hqdefault';
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
    seedTotal: 14,
    seed: [
      { id: 'o8wH0lEVCcM', thumb: 'maxresdefault', title: 'Empty Room to Luxury Interior with AI | Dream Home Transformation' },
      { id: 'ePu-PXoIg5U', thumb: 'maxresdefault', title: 'Heartspace Property | Commercial Shoot | Bhubaneswar' },
      { id: 'Epkvgzk_aN4', thumb: 'maxresdefault', title: 'Heartspace Property | Commercial Shoot' },
      { id: 'XIHhydeuwng', thumb: 'hqdefault', title: 'Commercial shoot | PBI Interiors' },
      { id: 'l6ypZnYhasE', thumb: 'hqdefault', title: 'Commercial Video Shoot | PBI Interiors' },
      { id: 'bcN3yVXVx0s', thumb: 'hqdefault', title: 'Commercial Shoot for SPI Interiors' },
      { id: 'SY5lDkMfB8Q', thumb: 'hqdefault', title: 'Commercial Shoot | SPI Interiors' },
      { id: 'TS_IALlaLFw', thumb: 'maxresdefault', title: 'Commercial Property Shoot | Video Production' },
    ],
  },
  {
    id: 'PLVV9ojp8fN9sgBr_eYzVmmHXF14slDlo1',
    title: 'Documentary',
    blurb: 'Longer pieces carried by people talking, where the edit has to hold attention without music doing the work.',
    seedTotal: 16,
    seed: [
      { id: '2ahe6EOvGbg', thumb: 'maxresdefault', title: 'Aryan Public School — documentary' },
      { id: 'n5yNUvzTQYM', thumb: 'maxresdefault', title: 'Takshashila Residential School — documentary' },
      { id: 'xcl9sl0HL8Y', thumb: 'maxresdefault', title: 'Millennium Academy of Higher Education, Nayagarh' },
      { id: 'wH9R8SRwPkg', thumb: 'maxresdefault', title: 'Takshashila Residential School, Ankushpur, Ganjam' },
      { id: '9M3WQpLPgUg', thumb: 'maxresdefault', title: 'Saraswati Vidya Mandir, Gadakana, Bhubaneswar' },
      { id: 'NrN7hkByhuk', thumb: 'maxresdefault', title: 'KC Public School' },
      { id: 'oaXWhSasxh4', thumb: 'maxresdefault', title: 'Audi — brand film' },
      { id: '3GWlQ35kLVM', thumb: 'maxresdefault', title: 'Aditya Ashray — full documentary' },
    ],
  },
  {
    id: 'PLUo81h8uo2Tg',
    title: 'Drone & Aerial',
    blurb: 'Aerial coverage of sites, campuses and events. Whether a location can legally be flown is settled before anything is promised.',
    seedTotal: 3,
    seed: [
      { id: 'ZCV0WhJPVKg', thumb: 'maxresdefault', title: 'Drone portfolio' },
      { id: '3SKW4GwPV20', thumb: 'maxresdefault', title: 'Live streaming from height — drone rental' },
      { id: 'gOj4y_jh1UE', thumb: 'maxresdefault', title: 'MSME Bhubaneswar — drone shoot' },
    ],
  },
  {
    id: 'PLVV9ojp8fN9slxtrji32qug7l3E65BK3c',
    title: 'Live Streams',
    blurb: 'Multi-camera streams as they went out. This is the one job that cannot be done again if it goes wrong.',
    seedTotal: 16,
    seed: [
      { id: '1AsAeci0j1E', thumb: 'maxresdefault', title: 'Sankalp — Sagar Business Ventures Limited' },
      { id: '0HpTkjnyi04', thumb: 'maxresdefault', title: 'Veerodaya 2026, Volleyball Semi Final — Sri Sri University' },
      { id: 'OmUSt1bdov4', thumb: 'maxresdefault', title: 'KIMS Laboratory Professional Week, Bhubaneswar' },
      { id: 'RtWq8Cf58G4', thumb: 'maxresdefault', title: 'KIMS Laboratory Professional Week 2025' },
      { id: 'Cr5NCGhq1OQ', thumb: 'maxresdefault', title: 'Silver Jubilee 2025 — SSVM Sridham, Padmanavpur' },
      { id: '-n-oo1j4LYc', thumb: 'maxresdefault', title: 'Rajabahadur Ramchandra Mardaraj Deo — 126th birth anniversary' },
      { id: '_5V4wriEx_g', thumb: 'maxresdefault', title: 'Malika Bachana, Kalamba, Polasara, Ganjam' },
      { id: 'CuIXXTU7Vw8', thumb: 'hqdefault', title: 'Shiv Tandav Stotram — Srajan Ensemble' },
    ],
  },
  {
    id: 'PLVV9ojp8fN9sFzDm7qkgHkGSjQECrwGyr',
    title: 'Annual Functions',
    blurb: 'School and college annual days, streamed live and cut afterwards. Fixed running order, no second take.',
    seedTotal: 63,
    seed: [
      { id: 'IcTkxE3KcC0', thumb: 'maxresdefault', title: 'Aryan Public School — 27th Annual Day 2026, Aska' },
      { id: 'YTnaWGN1dyQ', thumb: 'maxresdefault', title: 'Aryan Public School — Silver Jubilee Annual Day, Aska' },
      { id: 'xBiIe2cPs4k', thumb: 'maxresdefault', title: 'Sankalp Senior Secondary School — Annual Day' },
      { id: '2fRJalUW4ZI', thumb: 'maxresdefault', title: '30th Annual Function — SSVM Niladri Vihar, Bhubaneswar' },
      { id: '55besFIOBk8', thumb: 'maxresdefault', title: '35th Annual Function — SSVM Ramahari Nagar' },
      { id: 'GgilBo5Blbs', thumb: 'maxresdefault', title: '21st Annual Function — SSVM Mancheswar Railway Colony' },
      { id: '2Zkj_Xjr9H8', thumb: 'maxresdefault', title: 'Euphoria 2026 — Radiance Group of Institutes, Bijepur' },
      { id: 'mYr91iMUgqA', thumb: 'maxresdefault', title: 'Silver Jubilee 2025 — SSVM Sridham, Padmanavpur' },
    ],
  },
];

/** How many videos each playlist section shows: four across, two rows. */
export const PER_PLAYLIST = 8;

/** How many reels the Instagram section shows. */
export const REEL_COUNT = 12;
