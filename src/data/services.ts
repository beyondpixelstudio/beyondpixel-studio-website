/**
 * The six services.
 *
 * ONE template renders all six pages from this file — adding or editing a
 * service is a data change, never a markup change. That is what stops six
 * separately-built pages drifting apart in structure, schema or tone.
 *
 * `name` is used verbatim as the card link text, so anchor text and target
 * keyword are the same string by construction. Internal linking does its SEO
 * work without anyone writing keyword-stuffed copy.
 *
 * Deliberately NOT in here: the phone number. It lives once, in business.ts.
 */

export interface Service {
  slug: string;
  /** Card title, link text, and target keyword — one string, three jobs. */
  name: string;
  /** Exactly one H1 per page. Keyword-led. */
  h1: string;
  /** <= 60 characters. Keyword first, brand last. */
  title: string;
  /** <= 160 characters, ends with a call to action. */
  description: string;
  /** One line on the card: what it is. */
  summary: string;
  /** One line on the card: who it is for. */
  audience: string;
  /** Prefilled WhatsApp enquiry — this market enquires with a message, not a form. */
  whatsapp: string;
  portfolio: 'corporate-institutional' | 'government-events';
  /** AI video has national reach, so its slug carries no location. */
  national?: boolean;
}

export const services: Service[] = [
  {
    slug: 'corporate-video-production-bhubaneswar',
    name: 'Corporate Video Production',
    h1: 'Corporate Video Production in Bhubaneswar',
    title: 'Corporate Video Production in Bhubaneswar | Beyond Pixel',
    description:
      'Corporate films, brand videos and CSR documentation for companies and institutions across Odisha. Own crew, own equipment. Request a custom quote.',
    summary: 'Brand films, CSR documentation, training and internal communication.',
    audience: 'For companies and institutions who need to be believed, not just seen.',
    whatsapp: 'Hello, I would like a quote for corporate video production.',
    portfolio: 'corporate-institutional',
  },
  {
    slug: 'live-event-streaming-bhubaneswar',
    name: 'Live Event Streaming',
    h1: 'Live Event Streaming in Bhubaneswar',
    title: 'Live Event Streaming in Bhubaneswar | Beyond Pixel',
    description:
      'Multi-camera live streaming and event coverage for conferences, convocations and official functions across Odisha. Request a custom quote.',
    summary: 'Multi-camera coverage streamed where your audience already is.',
    audience: 'For conferences, convocations and official functions.',
    whatsapp: 'Hello, I would like a quote for live event streaming.',
    portfolio: 'government-events',
  },
  {
    slug: 'commercial-photography-videography-bhubaneswar',
    name: 'Commercial Photography & Videography',
    h1: 'Commercial Photography & Videography in Bhubaneswar',
    title: 'Commercial Photography in Bhubaneswar | Beyond Pixel',
    description:
      'Product, architectural, campus and campaign photography and video for brands and institutions in Bhubaneswar. Request a custom quote.',
    summary: 'Product, architectural, campus and campaign work.',
    audience: 'For brands and institutions who need images they own.',
    whatsapp: 'Hello, I would like a quote for commercial photography and videography.',
    portfolio: 'corporate-institutional',
  },
  {
    slug: 'drone-aerial-videography-bhubaneswar',
    name: 'Drone & Aerial Videography',
    h1: 'Drone & Aerial Videography in Bhubaneswar',
    title: 'Drone & Aerial Videography in Bhubaneswar | Beyond Pixel',
    description:
      'Aerial cinematography for campuses, industrial sites, construction progress and events across Odisha. Request a custom quote.',
    summary: 'Aerial cinematography for campuses, plants, sites and events.',
    audience: 'For anyone whose scale only reads from the air.',
    whatsapp: 'Hello, I would like a quote for drone and aerial videography.',
    portfolio: 'corporate-institutional',
  },
  {
    slug: 'studio-rental-bhubaneswar',
    name: 'Studio Rental',
    h1: 'Studio Rental in Bhubaneswar',
    title: 'Studio Rental in Bhubaneswar | Beyond Pixel Studio',
    description:
      'Shooting floor with lighting, backdrops and grip available on hourly and day rates in Patia, Bhubaneswar. Check availability.',
    summary: 'Shooting floor with lighting, backdrops and grip.',
    audience: 'For teams who need a controlled space by the hour or the day.',
    whatsapp: 'Hello, I would like to check studio rental availability and rates.',
    portfolio: 'corporate-institutional',
  },
  {
    slug: 'ai-video-production',
    name: 'AI Video Production',
    h1: 'AI Video Production',
    title: 'AI Video Production Services India | Beyond Pixel',
    description:
      'AI-assisted video production for brands nationwide — concept, generation, editing and finishing, supervised by a working crew. Request a quote.',
    summary: 'AI-assisted concept, generation, edit and finish.',
    audience: 'For brands who want volume without losing a human eye on it.',
    whatsapp: 'Hello, I would like a quote for AI video production.',
    portfolio: 'corporate-institutional',
    national: true,
  },
];
