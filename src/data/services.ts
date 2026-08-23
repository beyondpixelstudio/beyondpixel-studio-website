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
  /**
   * Card title, link text, and target keyword — one string, three jobs.
   *
   * EXCEPTION, 2026-08-23: "Event Coverage & Live Streaming" is Rajesh's own
   * name for the service and is what goes on the card, but the page still
   * targets "live event streaming Bhubaneswar" in its h1 and title. Anchor text
   * and keyword are no longer the same string for that one entry. That is a
   * deliberate trade — the client's service name wins on the card, the keyword
   * wins in the heading, and the anchor still contains "Live Streaming".
   */
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
  /** Opening paragraph of the service page. Plain, specific, no adjectives. */
  intro: string;
  /**
   * What is actually in the job. Written as things a client can check we did,
   * not as capabilities — "two-camera minimum" is verifiable, "world-class
   * production values" is not, and this market has been sold the second one
   * often enough to discount it.
   */
  includes: string[];
  /** What lands in their hands at the end. */
  deliverables: string[];
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
    title: 'Corporate Video Production Bhubaneswar | Beyond Pixel Studio',
    description:
      'Corporate films, brand videos and CSR documentation for companies and institutions across Odisha. Own crew, own equipment. Request a custom quote.',
    summary: 'Brand films, CSR documentation, training and internal communication.',
    audience: 'For companies and institutions who need to be believed, not just seen.',
    intro:
      'A corporate film is usually made because someone has to be convinced of something — a board, a regulator, a funder, or a room of new joiners. We plan the shoot around that decision, not around a shot list.',
    includes: [
      'A pre-production call to establish who the film has to convince and of what',
      'Scripting and storyboard, revised with you before anyone travels',
      'Two-camera minimum on interviews, so cuts never jump',
      'Lit interviews — not a window and a hope',
      'Clean audio on lapel and boom, recorded on separate tracks',
      'Location sound and B-roll gathered on the same visit, not a second call-out',
    ],
    deliverables: [
      'Master film, graded and mixed',
      'Cut-downs for LinkedIn, YouTube and internal screens',
      'Subtitle file (English) for silent autoplay',
      'Raw footage on request, on your drive',
    ],
    whatsapp: 'Hello, I would like a quote for corporate video production.',
    portfolio: 'corporate-institutional',
  },
  {
    slug: 'live-event-streaming-bhubaneswar',
    name: 'Event Coverage & Live Streaming',
    h1: 'Live Event Streaming in Bhubaneswar',
    title: 'Live Event Streaming Bhubaneswar | Beyond Pixel Studio',
    description:
      'Multi-camera live streaming and event coverage for conferences, convocations and official functions across Odisha. Request a custom quote.',
    summary: 'Multi-camera coverage streamed where your audience already is.',
    audience: 'For conferences, convocations and official functions.',
    intro:
      'A live stream has one property no other job has: it cannot be done again. Everything below exists because of that — the redundancy, the early load-in, and the site survey we would rather do a week out than discover on the day.',
    includes: [
      'Venue recce ahead of the date — power, sightlines, and the uplink',
      'Multi-camera switched live, with a vision mixer and an operator on it',
      'Bonded connection: a second carrier standing by if the venue line drops',
      'Feed taken from the house PA where there is one, miked independently where there is not',
      'Lower thirds and title cards prepared in advance from your run sheet',
      'Simultaneous recording at full quality, independent of what the stream does',
    ],
    deliverables: [
      'Live output to YouTube, Facebook, or your own player',
      'Full-length recording, cleaned of the pre-roll and the gaps',
      'Highlight cut, typically two to three minutes',
      'Stills pulled from the day for press and social',
    ],
    whatsapp: 'Hello, I would like a quote for event coverage and live streaming.',
    portfolio: 'government-events',
  },
  {
    slug: 'commercial-photography-videography-bhubaneswar',
    name: 'Commercial Photography & Videography',
    h1: 'Commercial Photography & Videography in Bhubaneswar',
    title: 'Commercial Photography Bhubaneswar | Beyond Pixel Studio',
    description:
      'Product, architectural, campus and campaign photography and video for brands and institutions in Bhubaneswar. Request a custom quote.',
    summary: 'Product, architectural, campus and campaign work.',
    audience: 'For brands and institutions who need images they own.',
    intro:
      'Stock photography is cheap and everyone can tell. These are images of your actual product, your actual building and your actual people, shot so they hold up cropped to a banner or blown up on a stall wall.',
    includes: [
      'Shot list agreed in writing, so the count is known before the day',
      'Studio or on-location lighting — we bring it either way',
      'Tethered shooting on product work, so you approve frames as they happen',
      'Colour reference card in the first frame of every setup',
      'Architectural work shot at the hour the building actually looks best',
      'Retouching to a fixed brief: cleanup and colour, no reshaping of people',
    ],
    deliverables: [
      'Full-resolution TIFFs and web-optimised JPEGs',
      'Crops pre-made for your platforms — square, 4:5, 16:9',
      'Full commercial usage rights, in writing, in perpetuity',
      'Catalogued and named to your SKU or department scheme',
    ],
    whatsapp: 'Hello, I would like a quote for commercial photography and videography.',
    portfolio: 'corporate-institutional',
  },
  {
    slug: 'drone-aerial-videography-bhubaneswar',
    name: 'Drone & Aerial Videography',
    h1: 'Drone & Aerial Videography in Bhubaneswar',
    title: 'Drone & Aerial Videography Bhubaneswar | Beyond Pixel Studio',
    description:
      'Aerial cinematography for campuses, industrial sites, construction progress and events across Odisha. Request a custom quote.',
    summary: 'Aerial cinematography for campuses, plants, sites and events.',
    audience: 'For anyone whose scale only reads from the air.',
    /**
     * WORDING NOTE — no pilot certification is claimed anywhere in this entry,
     * because none has been verified. Everything below is a description of
     * PROCESS ("we check the airspace category before quoting"), which is a
     * commitment Rajesh can keep, rather than a CREDENTIAL, which would be an
     * unverified claim on a regulated activity. If a DGCA Remote Pilot
     * Certificate exists, it is a strong trust signal and belongs here — but it
     * has to be produced first.
     */
    intro:
      'Aerial footage sells scale — a campus, a plant, a site at the halfway mark. In India it is also regulated airspace, so the first thing we do on any aerial job is establish whether the site can legally be flown before anyone talks about shots.',
    includes: [
      'Airspace category checked on the DGCA map against your exact coordinates, before we quote',
      'Written permission obtained where the zone requires it — we do not fly on a maybe',
      'A ground brief with your site or security team ahead of the flight',
      'Flights planned around light, not around our schedule',
      'Ground-level coverage on the same visit, so the edit is not all aerial',
      'A weather contingency date agreed in the quote, not negotiated after a washout',
    ],
    deliverables: [
      'Graded aerial footage, 4K',
      'Orbit, reveal and top-down passes of each agreed subject',
      'Vertical cut-downs for social',
      'Progress sets shot to a repeatable flight path, for construction timelines',
    ],
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
    /**
     * DELIBERATELY UNSPECIFIC ON DIMENSIONS AND RATES. A studio listing lives or
     * dies on floor size, ceiling height and the day rate, and publishing a
     * guessed number is worse than publishing none — someone books on it and
     * arrives to a floor that will not take their setup.
     *
     * TODO — replace the first bullet with the real measurements and add a rate
     * card once Rajesh supplies them. This is the highest-value missing content
     * on the site: it is the one service where people search with intent to book
     * the same week.
     */
    intro:
      'A controlled space in Patia with the lights already rigged, so a half-day shoot is a half-day shoot rather than two hours of setup and a scramble.',
    includes: [
      'Shooting floor with a lit cyclorama and seamless paper backdrops',
      'Continuous LED and strobe lighting, with modifiers and stands',
      'Grip: C-stands, flags, reflectors and sandbags',
      'Tethering station and a monitor for client viewing',
      'Changing area, and power for hair and makeup',
      'Hourly and full-day rates, with the equipment included rather than itemised',
    ],
    deliverables: [
      'The floor, on your date, set up before your call time',
      'A crew member on site who knows where everything is',
      'Optional: our camera operator or gaffer added to the booking',
    ],
    whatsapp: 'Hello, I would like to check studio rental availability and rates.',
    portfolio: 'corporate-institutional',
  },
  {
    slug: 'ai-video-production',
    name: 'AI Video Production',
    h1: 'AI Video Production',
    title: 'AI Video Production India | Beyond Pixel Studio',
    description:
      'AI-assisted video production for brands nationwide — concept, generation, editing and finishing, supervised by a working crew. Request a quote.',
    summary: 'AI-assisted concept, generation, edit and finish.',
    audience: 'For brands who want volume without losing a human eye on it.',
    intro:
      'Generated video is fast and cheap and mostly looks it. The useful version of this service is not "we press generate" — it is a working crew using generation for the shots that suit it, and a camera for the shots that do not, on the same timeline.',
    includes: [
      'Concept and script written first, before anything is generated',
      'Generated sequences supervised shot by shot, not accepted as they come',
      'Live-action or stock inserted wherever generation cannot hold up',
      'Faces and hands checked frame by frame — this is where generated video fails',
      'Voiceover: synthetic or human, your call, quoted either way',
      'Written disclosure of which sequences are AI-generated, for your compliance team',
    ],
    deliverables: [
      'Master film, graded and mixed',
      'Platform cut-downs and vertical variants',
      'Project file and generation prompts, so the work can be extended later',
      'A note on model and licence terms for every generated asset used',
    ],
    whatsapp: 'Hello, I would like a quote for AI video production.',
    portfolio: 'corporate-institutional',
    national: true,
  },
];
