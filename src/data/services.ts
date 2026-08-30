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
  /**
   * 3-5 questions per service, and every one of them is a question buyers
   * actually type. Sourced from live search rather than invented: the cost
   * question is the highest-volume query in this category, drone permissions
   * and upload bandwidth are the two that decide whether a shoot can happen at
   * all, and ownership is the one corporate and government buyers raise in
   * procurement.
   *
   * The visible accordion and the FAQPage schema are BOTH rendered from this
   * array. Google drops the rich result when the marked-up answer and the
   * on-page answer disagree, and keeping one copy is the only way that never
   * happens.
   *
   * No BPS prices anywhere in here. Cost answers explain what moves the number
   * and end at a quote, because a fabricated figure is the trust problem the
   * brief exists to avoid.
   */
  faqs: { q: string; a: string }[];
  /** Prefilled WhatsApp enquiry — this market enquires with a message, not a form. */
  whatsapp: string;
  portfolio: 'corporate-institutional' | 'government-events';
  /**
   * The 3D object in the hero, built by ServiceRig.astro. Optional: a service
   * without one gets the flat hero it has always had, which is why these can
   * be added one at a time rather than all six at once.
   *
   * The value names the OBJECT, not the service — the same rig could serve two
   * services if their kit is genuinely the same, and naming it 'corporate'
   * would hide that.
   */
  rig?: 'gimbal' | 'broadcast' | 'aperture' | 'drone' | 'studio' | 'neural';

  /**
   * Real work for this service, on YouTube.
   *
   * These replace the numbered SLATE placeholders that stood on every service
   * page. The slates were honest — "we would rather show you nothing than show
   * you stock" — and were the right thing to ship when there was nothing to put
   * there. There is now, so they go.
   *
   * A service with no matching footage KEEPS ITS SLATES. Studio Rental has none
   * on the channel, and padding it with a school annual day to fill three boxes
   * would break the exact promise the slates were making.
   *
   * `thumb` names the file that actually exists — maxresdefault only where the
   * upload was high enough resolution, checked per video with a live request.
   */
  videos?: { id: string; thumb: 'maxresdefault' | 'hq720' | 'hqdefault'; title: string }[];
  /** AI video has national reach, so its slug carries no location. */
  national?: boolean;
}

/**
 * Homepage FAQ. Deliberately NOT service-specific — these are the questions that
 * come before someone has decided which service they need: coverage, how to get
 * a price, and whether we have handled work like theirs.
 *
 * Rendered WITHOUT FAQPage schema. Six service pages already emit one each, and
 * marking up a seventh general set invites the duplicate-FAQ treatment Google
 * applies when the same site answers the same question in several places.
 */
export const generalFaqs: { q: string; a: string }[] = [
  {
    q: 'Which areas do you cover?',
    a:
      'Bhubaneswar, Cuttack and Puri are one working market for us — a crew based in Patia covers all three inside a day. We work across the rest of Odisha as well; travel and any overnight stay is itemised in the quote rather than absorbed into a vague day rate. AI video production is delivered nationwide.',
  },
  {
    q: 'How do we get a price?',
    a:
      'Send the date, the venue and roughly what you need — by WhatsApp, phone or the enquiry form. You get an itemised quote listing crew, kit, days and deliverables as separate lines, so you can see what each part costs and take out anything you do not need. We do not publish blanket per-video pricing, because the honest number depends on things that change per job.',
  },
  {
    q: 'Have you worked with government departments and PSUs?',
    a:
      'Yes — ministerial event coverage, PSU and university work, including NALCO, IIT Bhubaneswar, SOA University and KIMS. That work carries requirements ordinary corporate shoots do not: protocol, access clearances, fixed camera positions and someone who knows not to move during a dignitary address.',
  },
  {
    q: 'How soon can you start?',
    a:
      'For a shoot with a fixed date, the earlier the better — event coverage is booked against a calendar and popular dates go. For everything else, a brief usually turns into a quote within a couple of working days. If you are working to a deadline, say so in the first message and we will tell you plainly whether it is achievable.',
  },
  {
    q: 'Can we see examples of work like ours?',
    a:
      'Ask and we will send work from the closest sector we have — a campus film, a convocation stream, a plant shoot — rather than a generic showreel. Recent work also goes up on our Instagram and YouTube. If we have not done something close to your brief we will say so instead of stretching an unrelated example to fit.',
  },
  {
    q: 'Do we get the raw footage as well as the finished film?',
    a:
      'On request, and it is worth asking at the quote stage rather than after the shoot. Raw footage from a multi-camera day is large, so we agree the handover method — drive, or a transfer link — in advance. Say so up front and it is written into the quote rather than negotiated later.',
  },
  {
    q: 'How many people turn up on a shoot day?',
    a:
      'It depends on the job, and the quote says exactly who is coming rather than leaving you to find out on the day. A single-camera interview can be two people. A multi-camera event with live streaming is a larger crew because someone has to be on each camera, on sound, and on the stream itself. Nobody is billed who is not there.',
  },
  {
    q: 'Can you cover a multi-day or multi-city event?',
    a:
      'Yes. Multi-day coverage is planned as one job rather than several bookings, so kit and crew stay consistent across the days and the edit holds together. Travel, accommodation and any additional crew are separate lines in the quote, not folded into a vague day rate.',
  },
  {
    q: 'What do you need from us before the shoot?',
    a:
      'A date, a venue, a contact who will be on site, and whatever approvals the location needs — most delays we see come from access and permission, not from production. For events, a running order. For corporate films, whatever brand guidelines and logo files you want us to work to.',
  },
  {
    q: 'Do you use your own equipment and crew?',
    a:
      'Yes. Cameras, lighting and grip are ours and the crew are our own people, so the person quoting your job is the person who turns up to shoot it. Nothing is subcontracted out on the day, which is where most last-minute substitutions in this market come from.',
  },
];

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
    faqs: [
      {
        q: 'How much does a corporate video cost in Bhubaneswar?',
        a:
          'There is no single rate, because the cost is driven by things that change per job: how many shoot days, how many cameras and crew, whether there is scripting, a presenter, actors or voiceover, how much animation or motion graphics sit on top, and how many edits and language versions you need at the end. Two one-minute films can differ several times over on those alone. We quote per project and itemise it, so you can see what each line costs and remove anything you do not need.',
      },
      {
        q: 'How long does a corporate video take from brief to delivery?',
        a:
          'For a straightforward single-location film, plan on two to four weeks: a few days to agree the brief and script, one shoot day, then editing, grading and revisions. Multi-location shoots, animation, or several language versions extend that. If you have a fixed date — a launch, a conference, an inauguration — tell us at the brief stage and we plan backwards from it.',
      },
      {
        q: 'Do you write the script, or do we have to supply it?',
        a:
          'Either. Most clients come with the message rather than a script, and we write from that. If your team has already written one, we will read it against the shoot and tell you honestly where it will and will not work on camera.',
      },
      {
        q: 'Who owns the finished video and the raw footage?',
        a:
          'You own the finished film outright. Raw footage is handed over on request — say so at the quote stage so it is written in, rather than assumed on either side. This is worth settling before the shoot, not after.',
      },
    ],
    whatsapp: 'Hello, I would like a quote for corporate video production.',
    rig: 'gimbal',
    portfolio: 'corporate-institutional',
    videos: [
      { id: 'oaXWhSasxh4', thumb: 'maxresdefault', title: 'Audi — brand film' },
      { id: '3GWlQ35kLVM', thumb: 'maxresdefault', title: 'Aditya Ashray — full documentary' },
      { id: '6nQC1ylPrSw', thumb: 'maxresdefault', title: 'Jaleswar Motors — documentary' },
      { id: '2ahe6EOvGbg', thumb: 'maxresdefault', title: 'Aryan Public School — institutional film' },
      { id: 'xcl9sl0HL8Y', thumb: 'maxresdefault', title: 'Millennium Academy of Higher Education, Nayagarh' },
      { id: 'NrN7hkByhuk', thumb: 'maxresdefault', title: 'KC Public School' },
    ],
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
    faqs: [
      {
        q: 'What internet speed do you need to live stream our event?',
        a:
          'For a single 1080p stream the working figure is around 50 Mbps of dedicated upload — dedicated meaning not shared with the venue\'s guest WiFi. 4K or streaming to several platforms at once wants 100 Mbps or more. Venue WiFi is the most common cause of a stream failing, so we test the line in advance and carry a bonded mobile backup where the venue cannot guarantee it.',
      },
      {
        q: 'Can you stream to YouTube and Facebook at the same time?',
        a:
          'Yes. A single feed can be sent to several destinations at once — YouTube, Facebook, Instagram, LinkedIn, or a private page — so you are not choosing one audience over another. Tell us the destinations in advance, because each one adds to the upload the venue has to sustain.',
      },
      {
        q: 'What happens if the internet drops during the stream?',
        a:
          'The stream is recorded locally the whole time, independently of the connection, so a drop costs you the live audience for those minutes but never the footage. Where the venue\'s line is uncertain we run a mobile backup that takes over automatically.',
      },
      {
        q: 'Do we get a recording of the event afterwards?',
        a:
          'Yes. You get the full recording, and it can be cut down into shorter pieces for social afterwards. Ask for that at the quote stage so the shoot is planned with those cuts in mind.',
      },
    ],
    whatsapp: 'Hello, I would like a quote for event coverage and live streaming.',
    rig: 'broadcast',
    portfolio: 'government-events',
    videos: [
      { id: 'OmUSt1bdov4', thumb: 'maxresdefault', title: 'KIMS Laboratory Professional Week, Bhubaneswar' },
      { id: '1AsAeci0j1E', thumb: 'maxresdefault', title: 'Sankalp — Sagar Business Ventures Limited' },
      { id: '0HpTkjnyi04', thumb: 'maxresdefault', title: 'Veerodaya 2026 — Sri Sri University' },
      { id: 'IcTkxE3KcC0', thumb: 'maxresdefault', title: 'Aryan Public School — 27th Annual Day, Aska' },
      { id: 'Cr5NCGhq1OQ', thumb: 'maxresdefault', title: 'Silver Jubilee 2025 — SSVM Sridham' },
      { id: '2Zkj_Xjr9H8', thumb: 'maxresdefault', title: 'Euphoria 2026 — Radiance Group of Institutes' },
    ],
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
    faqs: [
      {
        q: 'Do we own the photographs, and can we use them in ads?',
        a:
          'You own the images we deliver and can use them across your own channels, print and paid advertising. If a shoot involves models or a location that carries its own restrictions we will say so before the shoot rather than after.',
      },
      {
        q: 'How long before we get the images?',
        a:
          'A selected, edited set usually goes out within a week of the shoot. Urgent selects — one or two images needed the same day for a press release or a post — can be turned around on the day if you flag them on set.',
      },
      {
        q: 'Can you shoot products on a plain white background for e-commerce?',
        a:
          'Yes, including the plain-white cutout format that most marketplaces require. Tell us which platform the images are for, because their size, ratio and background rules differ and it is cheaper to shoot to the right spec than to reprocess afterwards.',
      },
      {
        q: 'Do you shoot on location or in a studio?',
        a:
          'Both. Campuses, plants, offices and sites are shot on location; product and portrait work is usually faster and more controllable in the studio. For a mixed brief we will tell you which parts are worth bringing indoors.',
      },
    ],
    whatsapp: 'Hello, I would like a quote for commercial photography and videography.',
    rig: 'aperture',
    portfolio: 'corporate-institutional',
    videos: [
      { id: 'ePu-PXoIg5U', thumb: 'maxresdefault', title: 'Heartspace Property, Bhubaneswar' },
      { id: 'XIHhydeuwng', thumb: 'hqdefault', title: 'PBI Interiors' },
      { id: 'bcN3yVXVx0s', thumb: 'hqdefault', title: 'SPI Interiors' },
      { id: 'TS_IALlaLFw', thumb: 'maxresdefault', title: 'Commercial property shoot' },
      { id: 'Epkvgzk_aN4', thumb: 'maxresdefault', title: 'Heartspace Property' },
      { id: 'NIw72-G_CT0', thumb: 'maxresdefault', title: 'SSI — product shoot' },
    ],
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
    faqs: [
      {
        q: 'Do you need permission to fly a drone in Bhubaneswar?',
        a:
          'It depends where. India\'s airspace is mapped into green, yellow and red zones on the DGCA\'s DigiSky portal, and permission requirements follow the zone rather than the city. Green zones need no separate flight permission up to 400 feet; yellow zones need air-traffic clearance; red zones are prohibited without central government approval. Airports, defence installations and some government sites push the surrounding area into a restricted zone, so the honest answer for any specific address is that we check it on DigiSky before quoting.',
      },
      {
        q: 'What are the rules for commercial drone work in India?',
        a:
          'Drones must be registered and carry a Unique Identification Number, and the pilot must hold the DGCA Remote Pilot Certificate appropriate to the drone\'s weight class. Flights stay within the pilot\'s visual line of sight unless a BVLOS waiver has been granted, with a ceiling of 400 feet above ground level in green zones.',
      },
      {
        q: 'Can you fly at night, or indoors?',
        a:
          'Night flying requires a specific DGCA waiver and is not something to assume on a fixed event date — tell us early if the shot you want is after dark. Indoor flying sits outside the open-airspace rules and is usually straightforward, subject to the venue\'s own permission and the space being safe to fly in.',
      },
      {
        q: 'Can you film over our campus, plant or construction site?',
        a:
          'Usually yes, and it is the shot most worth having, because scale does not read from the ground. We need the exact location to check its airspace zone, and written permission from whoever controls the site.',
      },
    ],
    whatsapp: 'Hello, I would like a quote for drone and aerial videography.',
    rig: 'drone',
    portfolio: 'corporate-institutional',
    videos: [
      { id: 'ZCV0WhJPVKg', thumb: 'maxresdefault', title: 'Drone portfolio' },
      { id: '3SKW4GwPV20', thumb: 'maxresdefault', title: 'Live streaming from height — drone rental' },
      { id: 'gOj4y_jh1UE', thumb: 'maxresdefault', title: 'MSME Bhubaneswar — drone shoot' },
    ],
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
    faqs: [
      {
        q: 'What does the studio come with?',
        a:
          'A shooting floor with lighting, backdrops and grip. Tell us what you are shooting when you book and we will tell you plainly whether what is here covers it or whether something needs to be hired in.',
      },
      {
        q: 'Can we book by the hour, or only for a full day?',
        a:
          'Both hourly and day bookings. [PRICING TBD — confirm with Rajesh] Rates are not published here yet; ask and we will send the current rate card rather than quote you a number that has moved.',
      },
      {
        q: 'Can we bring our own crew and equipment?',
        a:
          'Yes. You can hire the floor alone and bring your own people, or add our crew and kit to whatever you are missing. Say which at the booking stage so the floor is set up before you arrive rather than during your slot.',
      },
      {
        q: 'Is there parking and somewhere to load in?',
        a:
          'Yes. If you are bringing heavy kit or a large team, tell us your arrival time so the load-in is clear and your booked hours are spent shooting rather than carrying.',
      },
    ],
    whatsapp: 'Hello, I would like to check studio rental availability and rates.',
    rig: 'studio',
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
    faqs: [
      {
        q: 'What is AI video production, exactly?',
        a:
          'It is conventional production with parts of the pipeline generated rather than filmed or drawn — concepts, b-roll, presenters, voiceover, motion, or variations of an existing cut. What it is not is a prompt and a hope: everything is directed, reviewed and finished by the same crew that shoots our conventional work, because that supervision is the difference between usable and obviously synthetic.',
      },
      {
        q: 'Is AI video cheaper than filming it?',
        a:
          'Often, and sometimes dramatically so for the kind of work that would otherwise need a location, a crew and a shoot day for thirty seconds of screen time. It is not automatically cheaper for everything — a single strong live-action scene can be quicker to shoot than to generate convincingly. We will tell you which of the two your brief actually wants.',
      },
      {
        q: 'Will it look artificial?',
        a:
          'That is the risk, and it is why the work is supervised rather than automated. Hands, faces, text and continuity are where generated video gives itself away, so shots are chosen to play to the method\'s strengths and anything that does not hold up gets filmed instead.',
      },
      {
        q: 'Do you disclose when video is AI-generated?',
        a:
          'Yes, whenever the footage could reasonably be mistaken for a real recording of real people or real events. Several platforms now require that label, and for corporate and government clients an undisclosed synthetic clip is a reputational risk that no saving justifies.',
      },
    ],
    whatsapp: 'Hello, I would like a quote for AI video production.',
    rig: 'neural',
    portfolio: 'corporate-institutional',
    videos: [
      { id: 'o8wH0lEVCcM', thumb: 'maxresdefault', title: 'Empty room to luxury interior, generated' },
    ],
    national: true,
  },
];
