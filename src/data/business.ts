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
   * Real and verifiable — 5.0 across 91 reviews on JustDial.
   *
   * DISPLAYED on the site, but deliberately NOT emitted as schema.org
   * `aggregateRating`. Google's structured-data guidelines disallow marking up
   * ratings collected on a third-party platform as if they were first-party,
   * and self-serving aggregateRating is the one schema abuse that draws manual
   * actions. The RP Films system reached the same conclusion.
   *
   * Once real Google Business Profile reviews are collected, revisit this.
   */
  rating: {
    source: 'JustDial',
    value: 5.0,
    count: 91,
    schemaSafe: false,
  },

  /**
   * Named for credibility, as text rather than logos — indexable, and it needs
   * no trademark permission. Logo slots exist in the TrustBar component for
   * when/if sign-off is obtained.
   */
  clients: [
    'HCL Tech',
    'NALCO',
    'Reliance Foundation',
    'Housing.com',
    'IIT Bhubaneswar',
    'SOA University',
    'KIMS',
  ],

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
