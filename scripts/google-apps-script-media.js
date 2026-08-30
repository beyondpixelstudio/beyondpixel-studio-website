/**
 * Media proxy — Google Apps Script
 * =============================================================================
 * Serves the Work page the one thing the browser must not fetch for itself:
 *
 *   ?src=youtube&playlist=PL...   latest videos in a playlist
 *
 * WHY A PROXY AT ALL. A YouTube API key can be referrer-restricted, but it is
 * still a key in dist/ that the credential scan in scripts/audit-build.mjs
 * would have to be taught to ignore — and a scan with an exception in it is a
 * scan that will one day miss the real thing. Here it lives in Script
 * Properties and never leaves Google's side.
 *
 * THE INSTAGRAM ENDPOINT IS GONE, along with the reels section it fed. It
 * proxied /me/media and refreshed a long-lived token on a weekly trigger. All
 * of that is deleted rather than left dormant: dormant code here is not
 * harmless, because its setup instructions would have sent Rajesh off to build
 * a Meta app and mint a token for a section that no longer exists.
 *
 * =============================================================================
 * THIS IS A SEPARATE APPS SCRIPT PROJECT FROM THE LEADS ONE. DO NOT MERGE THEM.
 *
 * Lead capture is the only thing on this site that loses money when it breaks.
 * A media proxy is a decoration that talks to a third-party API which will
 * rate-limit, change shape and go down. One project would mean a bad media
 * deploy takes the enquiry form with it. Separate, the worst a media failure
 * can do is leave a grid showing what was baked at build time.
 *
 * =============================================================================
 * SETUP
 *
 * 1. script.google.com -> New project -> paste this file.
 * 2. Project Settings -> Script Properties, add:
 *
 *      YOUTUBE_API_KEY   from console.cloud.google.com, YouTube Data API v3
 *
 *    IMPORTANT: that key must have Application restrictions set to "None" and
 *    API restrictions set to YouTube Data API v3. An HTTP-referrer restriction
 *    cannot work here — Apps Script sends no Referer, so every call 403s.
 *
 *    Script Properties are not in this file and not in the repo. Nothing here
 *    should ever be edited to contain a real key.
 *
 * 3. Deploy -> New deployment -> Web app
 *      Execute as:        Me
 *      Who has access:    Anyone
 *    Copy the /exec URL into business.ts as `mediaScriptUrl`.
 *
 */

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

/** Cache lifetimes, in seconds. */
var CACHE_YT = 1800; // 30 min — playlists change when Rajesh uploads, not often

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

/**
 * Health check. Run from the editor to confirm the key is set. Reports
 * presence, never the value — a key echoed into a log is a leaked key.
 */
function health() {
  var p = PropertiesService.getScriptProperties();
  console.log(
    JSON.stringify(
      {
        youtubeKey: !!p.getProperty('YOUTUBE_API_KEY'),
      },
      null,
      2
    )
  );
}
