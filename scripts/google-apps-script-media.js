/**
 * Media proxy — Google Apps Script
 * =============================================================================
 * Serves the Work page two things the browser must not fetch for itself:
 *
 *   ?src=youtube&playlist=PL...   latest videos in a playlist
 *   ?src=instagram                latest reels, with playable video URLs
 *
 * WHY A PROXY AT ALL. Both upstreams need a secret. A YouTube API key can be
 * referrer-restricted, but it is still a key in dist/ that the credential scan
 * in scripts/audit-build.mjs would have to be taught to ignore — and a scan
 * with an exception in it is a scan that will one day miss the real thing. The
 * Instagram token is worse: it cannot be restricted at all, it grants read
 * access to the account, and it must be refreshed on a schedule. Neither
 * belongs in a browser. Here they live in Script Properties and never leave
 * Google's side.
 *
 * =============================================================================
 * THIS IS A SEPARATE APPS SCRIPT PROJECT FROM THE LEADS ONE. DO NOT MERGE THEM.
 *
 * Lead capture is the only thing on this site that loses money when it breaks.
 * A media proxy is a decoration that talks to two third-party APIs which will
 * rate-limit, expire tokens and change shape. Putting them in one project
 * means one bad deploy takes both down, and it means every media fix is a
 * deploy that risks the enquiry form. They are deployed separately so that the
 * worst a media failure can do is leave a grid empty.
 *
 * =============================================================================
 * SETUP
 *
 * 1. script.google.com -> New project -> paste this file.
 * 2. Project Settings -> Script Properties, add:
 *
 *      YOUTUBE_API_KEY   from console.cloud.google.com, YouTube Data API v3
 *      IG_TOKEN          a LONG-LIVED Instagram token (see below)
 *      IG_USER_ID        the Instagram professional account's id
 *
 *    Script Properties are not in this file and not in the repo. Nothing here
 *    should ever be edited to contain a real key.
 *
 * 3. Deploy -> New deployment -> Web app
 *      Execute as:        Me
 *      Who has access:    Anyone
 *    Copy the /exec URL into business.ts as `mediaScriptUrl`.
 *
 * 4. Triggers -> Add trigger -> refreshInstagramToken, time-driven, WEEKLY.
 *    See refreshInstagramToken() for why weekly and not monthly.
 *
 * =============================================================================
 * GETTING THE FIRST INSTAGRAM TOKEN (once, by hand)
 *
 * Requires a PROFESSIONAL Instagram account (Business or Creator). Meta shut
 * down the Basic Display API on 4 December 2024; personal accounts have no
 * API access of any kind now.
 *
 *   a. developers.facebook.com -> Create App -> use case "Other" -> Business.
 *   b. Add the "Instagram" product, set up "Instagram API with Instagram
 *      Login", and add the account as an Instagram Tester.
 *   c. Generate a short-lived user token with the `instagram_business_basic`
 *      scope.
 *   d. Exchange it for a long-lived one (valid 60 days):
 *
 *        https://graph.instagram.com/access_token
 *          ?grant_type=ig_exchange_token
 *          &client_secret=APP_SECRET
 *          &access_token=SHORT_LIVED_TOKEN
 *
 *   e. Put the result in IG_TOKEN. From then on the weekly trigger keeps it
 *      alive and it never has to be touched again.
 */

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

/** Cache lifetimes, in seconds. */
var CACHE_YT = 1800; // 30 min — playlists change when Rajesh uploads, not often
var CACHE_IG = 900; //  15 min — SHORTER ON PURPOSE, see fetchInstagram()

var MAX_REELS = 12;

/* -------------------------------------------------------------------------- */
/* Entry point                                                                 */
/* -------------------------------------------------------------------------- */

function doGet(e) {
  var src = (e && e.parameter && e.parameter.src) || '';

  try {
    if (src === 'youtube') {
      var pl = e.parameter.playlist || '';
      /* Validate the shape before putting it in a URL. This value arrives from
         a query string, so it is attacker-controlled: without this, `playlist`
         could carry `&key=` or a path segment and turn this endpoint into an
         open relay for arbitrary YouTube API calls signed with our key. */
      if (!/^[A-Za-z0-9_-]{12,64}$/.test(pl)) return json({ error: 'bad playlist id' });
      var max = Math.min(parseInt(e.parameter.max, 10) || 8, 50);
      return json(fetchYouTube(pl, max));
    }

    if (src === 'instagram') return json(fetchInstagram());

    return json({ error: 'unknown src' });
  } catch (err) {
    /* Never surface a raw exception: Apps Script stack traces can contain the
       request URL, and for YouTube that URL contains the API key. */
    console.error(src + ': ' + err);
    return json({ error: 'upstream unavailable' });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function prop(name) {
  return PropertiesService.getScriptProperties().getProperty(name);
}

/* -------------------------------------------------------------------------- */
/* YouTube                                                                     */
/* -------------------------------------------------------------------------- */

function fetchYouTube(playlistId, max) {
  var cache = CacheService.getScriptCache();
  var ck = 'yt_' + playlistId + '_' + max;
  var hit = cache.get(ck);
  if (hit) return JSON.parse(hit);

  var key = prop('YOUTUBE_API_KEY');
  if (!key) return { error: 'not configured' };

  var base = 'https://www.googleapis.com/youtube/v3/';
  var res = UrlFetchApp.fetchAll([
    {
      url: base + 'playlists?part=snippet,contentDetails&id=' + playlistId + '&key=' + key,
      muteHttpExceptions: true,
    },
    {
      url:
        base +
        'playlistItems?part=snippet&playlistId=' +
        playlistId +
        '&maxResults=' +
        max +
        '&key=' +
        key,
      muteHttpExceptions: true,
    },
  ]);

  if (res[0].getResponseCode() !== 200 || res[1].getResponseCode() !== 200) {
    return { error: 'youtube ' + res[0].getResponseCode() + '/' + res[1].getResponseCode() };
  }

  var meta = JSON.parse(res[0].getContentText());
  var items = JSON.parse(res[1].getContentText());
  var pl = meta.items && meta.items[0];
  if (!pl) return { error: 'no such playlist' };

  var videos = [];
  (items.items || []).forEach(function (i) {
    var s = i.snippet || {};
    var vid = s.resourceId && s.resourceId.videoId;
    // Deleted and private videos remain in a playlist as tombstones. Dropping
    // them here keeps the page from rendering dead grey cards.
    if (!vid || !s.title || s.title === 'Deleted video' || s.title === 'Private video') return;
    var t = s.thumbnails || {};
    videos.push({
      id: vid,
      title: s.title,
      thumb: (t.maxres || t.standard || t.high || t.medium || t.default || {}).url || '',
      published: s.publishedAt || '',
    });
  });

  var out = {
    id: playlistId,
    title: (pl.snippet && pl.snippet.title) || '',
    total: (pl.contentDetails && pl.contentDetails.itemCount) || videos.length,
    videos: videos,
  };
  cache.put(ck, JSON.stringify(out), CACHE_YT);
  return out;
}

/* -------------------------------------------------------------------------- */
/* Instagram                                                                   */
/* -------------------------------------------------------------------------- */

function fetchInstagram() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('ig_reels');
  if (hit) return JSON.parse(hit);

  var token = prop('IG_TOKEN');
  var user = prop('IG_USER_ID') || 'me';
  if (!token) return { error: 'not configured' };

  /* `media_url` on a VIDEO is a signed CDN link that EXPIRES, which is the
     single fact that shapes this whole section. It is why reels cannot be
     baked into the HTML at build time the way YouTube videos are, why this
     cache is 15 minutes rather than hours, and why the page fetches on every
     load. Cache these for a day and visitors get a grid of dead <video> tags
     that fail silently. */
  var url =
    'https://graph.instagram.com/v21.0/' +
    user +
    '/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp' +
    '&limit=40&access_token=' +
    token;

  var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) {
    console.error('instagram ' + res.getResponseCode() + ' ' + res.getContentText().slice(0, 300));
    return { error: 'instagram ' + res.getResponseCode() };
  }

  var data = JSON.parse(res.getContentText());
  var reels = [];
  (data.data || []).forEach(function (m) {
    if (reels.length >= MAX_REELS) return;
    // Reels report as VIDEO here; the API does not expose a distinct REELS
    // type on this edge. Photos and carousels are excluded because this
    // section is specifically the reels wall.
    if (m.media_type !== 'VIDEO') return;
    if (!m.media_url) return;
    reels.push({
      id: m.id,
      // Captions are long and hashtag-heavy. The page needs a label, not an
      // essay, so this is trimmed here rather than in CSS — a clamp would
      // still ship the whole caption to every visitor.
      caption: (m.caption || '').split('\n')[0].slice(0, 110),
      video: m.media_url,
      poster: m.thumbnail_url || '',
      permalink: m.permalink || '',
      timestamp: m.timestamp || '',
    });
  });

  var out = { reels: reels };
  cache.put('ig_reels', JSON.stringify(out), CACHE_IG);
  return out;
}

/* -------------------------------------------------------------------------- */
/* Token maintenance                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Refresh the long-lived Instagram token.
 *
 * RUN THIS WEEKLY, not monthly. A long-lived token lasts 60 days and can only
 * be refreshed once it is at least 24 hours old. Monthly looks sufficient on
 * paper and is not: one missed run — a Google outage, a quota block, a trigger
 * silently disabled after an auth change — and the next attempt is 60 days
 * later, by which point the token is dead and the only fix is redoing the
 * manual browser flow. Weekly means eight consecutive failures before anything
 * breaks, and eight weeks is long enough that the error mail will have been
 * noticed.
 */
function refreshInstagramToken() {
  var token = prop('IG_TOKEN');
  if (!token) return;

  var res = UrlFetchApp.fetch(
    'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' +
      token,
    { muteHttpExceptions: true }
  );

  if (res.getResponseCode() !== 200) {
    console.error('token refresh failed: ' + res.getContentText().slice(0, 300));
    return;
  }

  var data = JSON.parse(res.getContentText());
  if (!data.access_token) return;

  PropertiesService.getScriptProperties().setProperty('IG_TOKEN', data.access_token);
  PropertiesService.getScriptProperties().setProperty(
    'IG_TOKEN_REFRESHED',
    new Date().toISOString()
  );
  // Drop the cache so the next request cannot serve URLs signed by the old
  // token, which stop working the moment it is replaced.
  CacheService.getScriptCache().remove('ig_reels');
}

/**
 * Health check. Run from the editor to see what is configured and when the
 * token was last refreshed. Reports presence, never values.
 */
function health() {
  var p = PropertiesService.getScriptProperties();
  console.log(
    JSON.stringify(
      {
        youtubeKey: !!p.getProperty('YOUTUBE_API_KEY'),
        igToken: !!p.getProperty('IG_TOKEN'),
        igUserId: !!p.getProperty('IG_USER_ID'),
        tokenRefreshed: p.getProperty('IG_TOKEN_REFRESHED') || 'never',
      },
      null,
      2
    )
  );
}
