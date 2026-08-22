/**
 * NAP SINGLE SOURCE OF TRUTH
 * ---------------------------------------------------------------------------
 * The brief calls NAP consistency non-negotiable, because the previous site had
 * phone and address rendered differently across platforms. That is not solved by
 * being careful — it is solved by making it impossible to get wrong.
 *
 * The phone number is typed ONCE in this codebase, here. Every page, footer,
 * meta tag and JSON-LD block imports from this file. If it is ever wrong it is
 * wrong everywhere at once, and one edit fixes it.
 *
 * Verification: `grep -rln "89173" src/` must return exactly ONE file — this one.
 */

export const business = {
  name: 'Beyond Pixel Studio',
  tagline: 'Media & Tech Solutions',
  url: 'https://beyondpixel.studio',

  founder: {
    name: 'Rajesh Kumar Gouda',
    role: 'Founder & CEO',
  },

  /** Three renderings of one number. Never hand-type a fourth. */
  phone: {
    display: '+91 89173 98179', // what a human reads
    href: 'tel:+918917398179', // what a tap dials
    e164: '+918917398179', // what schema.org requires
  },

  /**
   * Note: the contact address is on beyondpixel.online while the site is
   * .studio. Flagged during planning as the same category of inconsistency the
   * brief warns against; kept deliberately at Rajesh's direction.
   */
  email: 'admin@beyondpixel.online',

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
