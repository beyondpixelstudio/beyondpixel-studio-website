/**
 * NAP SINGLE SOURCE OF TRUTH
 * ---------------------------------------------------------------------------
 * The brief calls NAP consistency non-negotiable, because the previous site had
 * phone and address rendered differently across platforms. That is not solved by
 * being careful — it is solved by making it impossible to get wrong.
 *
 * The phone numbers are typed ONCE in this codebase, here. Every page, footer,
 * meta tag and JSON-LD block imports from this file. If one is ever wrong it is
 * wrong everywhere at once, and one edit fixes it.
 *
 * Verification: `npm run nap` fails if any digit string appears outside this file.
 *
 * ---------------------------------------------------------------------------
 * 2026-08-23 — NUMBERS REPLACED AT RAJESH'S DIRECTION.
 *
 * The previous canonical number here was +91 89173 98179. Rajesh supplied
 * 7608924893 and 6371227153 directly, so those are now canonical and the old
 * one is gone from the codebase.
 *
 * OPEN ITEM: 89173 98179 may still be published on JustDial, the Google
 * Business Profile and the old lockup image (BPS.png). Until those are updated
 * the business has inconsistent NAP *off* the site, which is the exact ranking
 * problem this file exists to prevent on it. Retiring a number in the code does
 * not retire it from the directories.
 * ---------------------------------------------------------------------------
 */

export const business = {
  name: 'Beyond Pixel Studio',
  tagline: 'Media & Tech Solutions',
  url: 'https://beyondpixel.studio',

  founder: {
    name: 'Rajesh Kumar Gouda',
    role: 'Founder & CEO',
  },

  /**
   * Two lines, both of which are also WhatsApp.
   *
   * `phone` is the PRIMARY and the only one that goes into schema.org, into the
   * header, and into `<meta>`. A second number in structured data does not help
   * anyone — Google takes the first and directories copy whatever is most
   * prominent, which is how a business ends up with two "official" numbers in
   * circulation. The alternate is offered on the contact page only, labelled as
   * an alternate, which is what it is.
   *
   * Four renderings of each number. Never hand-type a fifth.
   */
  phone: {
    display: '+91 76089 24893', // what a human reads
    href: 'tel:+917608924893', // what a tap dials
    e164: '+917608924893', // what schema.org requires
    wa: '917608924893', // what wa.me expects: digits, no plus
  },

  phoneAlt: {
    display: '+91 63712 27153',
    href: 'tel:+916371227153',
    e164: '+916371227153',
    wa: '916371227153',
  },

  /**
   * Note: both mailboxes are on beyondpixel.online while the site is .studio.
   * Flagged during planning as the same category of inconsistency the brief
   * warns against; kept deliberately at Rajesh's direction.
   *
   * `email` is the general enquiry box and the one schema.org carries.
   * `emailManager` is routed to on the contact page for live/booked jobs, where
   * a shoot in progress should not queue behind general enquiries.
   */
  email: 'admin@beyondpixel.online',
  emailManager: 'manager@beyondpixel.online',

  address: {
    /** Canonical display string. Render THIS, verbatim, everywhere. */
    display: 'Patia / Nandan Vihar, Bhubaneswar, Odisha, India — 751024',
    street: 'Nandan Vihar, Patia',
    locality: 'Bhubaneswar',
    region: 'Odisha',
    postalCode: '751024',
    country: 'IN',
  },

  social: {
    instagram: 'https://instagram.com/beyondpixel.studio',
    facebook: 'https://facebook.com/beyond.pixel.studioo',
    youtube: 'https://youtube.com/channel/UCA4B7o_Cle_tHZ82DBJ-lyw',
    googleBusiness: 'https://share.google/B92t3U7I2wQZpp4SS',
  },

  /**
   * INTEGRATIONS & AUTOMATION
   * -------------------------------------------------------------------------
   * - Meta Pixel ID for tracking PageViews & Lead Custom Audiences
   * - Google Apps Script Webhook URL for Google Sheets logging & Telegram bot
   */
  metaPixelId: '1058011239388287',
  /**
   * Apps Script Web App endpoint. Receives every lead, appends a row to the
   * "Beyond Pixel Studio Leads" sheet, and sends the Telegram alert server-side.
   *
   * The deployment must be set to "Who has access: ANYONE" — not "Anyone with a
   * Google account". Website visitors are not signed in, so anything stricter
   * returns 403 Access denied. Tested 2026-08-29 and it did exactly that.
   *
   * That failure is INVISIBLE from the browser: the client posts with
   * mode:'no-cors', which makes the response opaque, so a 403 looks identical
   * to success from the page's side. If leads stop arriving in the sheet, curl
   * this URL directly rather than trusting the form.
   */
  googleScriptUrl:
    'https://script.google.com/macros/s/AKfycbyVTuMtsgkVo3kzX6eKp7cTjiyVttA0ambKHsc57Z5-L67gDLCxzryYn-R-eE4H_8qmdA/exec',
  telegramBot: '@beyondpixelstudio_bot',

  /**
   * MEDIA PROXY — a SEPARATE Apps Script deployment from googleScriptUrl above.
   *
   * Serves the Work page its YouTube playlists, holding the API key on Google's
   * side so it never ships to a browser. Source:
   * scripts/google-apps-script-media.js.
   *
   * Deliberately not the same project as the leads script. Lead capture is the
   * only thing here that loses money when it breaks; a media proxy talks to a
   * third-party API that rate-limits and goes down. Sharing a deployment would
   * mean one bad media fix could take the enquiry form down.
   *
   * EMPTY IS A VALID STATE, and it is the current one. The grids are filled at
   * build time — from the API where the key allows it, otherwise from the
   * hand-picked seed in works.ts — so nothing on the page depends on this. All
   * it adds is same-day freshness for a video uploaded since the last deploy.
   */
  mediaScriptUrl: '',

  /**
   * The WRITE-a-review link, which is not the same thing as the read link in
   * `reviews` below and cannot be derived from it.
   *
   * Google's own share links point at the listing, where a visitor still has to
   * find "Write a review" among the photos, hours and directions. Most people
   * asked for a favour do not go looking, so the ask has to land on the review
   * box itself. Only two URLs do that:
   *
   *   https://g.page/r/CODE/review                         — from the Business
   *     Profile dashboard: "Ask for reviews" / "Get more reviews"
   *   https://search.google.com/local/writereview?placeid=PLACE_ID
   *
   * Rajesh has to fetch this: it comes from the Google Business Profile he owns
   * and there is no way to look it up from outside.
   *
   * EMPTY IS A VALID STATE. The CTA falls back to the read link rather than
   * disappearing, so the section is useful the day it ships and better the day
   * this is filled in.
   */
  googleReviewUrl: '',

  /**
   * REVIEW SOURCES.
   *
   * Displayed on the site, but deliberately NOT emitted as schema.org
   * `aggregateRating`. Google's structured-data guidelines disallow marking up
   * ratings collected on a third-party platform as if they were first-party,
   * and self-serving aggregateRating is the one schema abuse that draws manual
   * actions. The ratings are shown visually instead, where they still do their
   * job.
   *
   * `value`/`count` are NULL until someone has read the real figure off the
   * platform. A review count is a factual claim about other people's opinions;
   * inventing a plausible-looking one is the single most damaging thing that
   * could be put on this page, so the UI renders an unnumbered link instead and
   * the number simply appears when it is known.
   *
   * TODO — Rajesh to supply the live Google rating and review count.
   */

  reviews: [
    {
      source: 'JustDial',
      value: 5.0,
      count: 91,
      url: null,
      note: 'Rated by clients on JustDial',
    },
    {
      source: 'Google',
      value: null,
      count: null,
      url: 'https://share.google/B92t3U7I2wQZpp4SS',
      note: 'Read the reviews on our Google Business Profile',
    },
  ] as const,

  /**
   * The client list moved to src/data/clients.ts, which carries the logos as
   * well as the names — one list, not a text copy here and an image copy there
   * that drift apart the first time a client is added.
   */

  /**
   * Narrowed deliberately. Bhubaneswar, Cuttack and Puri are one working market —
   * a studio based in Patia genuinely covers all three inside a day. Naming
   * Rourkela or Sambalpur (300–500km away) implies a presence there, and an
   * unverified coverage claim is exactly the trust problem the brief warns
   * against. Wider reach is stated as "across Odisha", which is true and still
   * earns the regional relevance.
   *
   * TODO — widen only if Rajesh confirms the studio regularly travels further.
   */
  areaServed: ['Bhubaneswar', 'Cuttack', 'Puri'],
  areaServedBroad: 'Odisha',
} as const;

/** Entity links for JSON-LD `sameAs`. Derived — never maintained separately. */
export const sameAs = Object.values(business.social);

/**
 * Prefilled WhatsApp deep link.
 *
 * This market enquires with a message, not a contact form — so the enquiry path
 * that actually gets used has to be one tap, land in the right thread, and
 * arrive with the service already named. A form that emails a shared inbox is
 * the path nobody takes.
 *
 * Always built from `business.phone.wa`, never a literal, so the deep link can
 * never point at a retired number while the visible text points at the new one.
 */
export const wa = (message: string, line: 'primary' | 'alt' = 'primary') =>
  `https://wa.me/${(line === 'alt' ? business.phoneAlt : business.phone).wa}` +
  `?text=${encodeURIComponent(message)}`;
