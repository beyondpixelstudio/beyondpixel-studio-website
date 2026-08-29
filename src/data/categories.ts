/**
 * What the studio covers, as categories rather than as individual jobs.
 *
 * The headings are the brochure's own section titles, in the brochure's order of
 * seniority — Chief Minister and Ministry work first, because for the buyer this
 * site targets that is the hardest thing to claim and the easiest to check.
 *
 * Every photograph is the studio's own, from that category of work. `note` says
 * what was actually delivered, so a category reads as a capability with evidence
 * rather than as a word over a picture.
 *
 * `feature` marks the two that get a double-width card. Not decoration: the
 * government work is the differentiator in this market, and a grid of ten equal
 * tiles would flatten it into the same weight as everything else.
 */

export interface Category {
  slug: string;
  title: string;
  note: string;
  image: string;
  alt: string;
  feature?: boolean;
}

export const categories: Category[] = [
  {
    slug: 'chief-minister-events',
    title: 'Chief Minister events',
    note: 'State programmes and official functions, including the 10th Film Preservation & Restoration Workshop India.',
    image: '/categories/chief-minister-events.webp',
    alt: 'Dignitaries on stage at a state cultural programme, photographed by the studio',
    feature: true,
  },
  {
    slug: 'ministry-events',
    title: 'Ministry events',
    note: 'Coverage for ministers and departments, including Suryabanshi Suraj, Bhartruhari Mahtab and Gokula Nanda Mallik.',
    image: '/categories/ministry-events.webp',
    alt: 'A minister addressing an audience from a lectern at an official function',
    feature: true,
  },
  {
    slug: 'athletic-events',
    title: 'Athletic events',
    note: 'National and international para athletics, broadcast live from Kalinga Stadium.',
    image: '/categories/athletic-events.webp',
    alt: 'Sprinter mid-stride on the track during a national athletics championship',
  },
  {
    slug: 'esports-live-production',
    title: 'Esports live production',
    note: 'Multi-camera competitive gaming coverage, streamed in real time.',
    image: '/categories/esports-live-production.webp',
    alt: 'Esports competitors seated on stage during a live-streamed tournament',
  },
  {
    slug: 'cricket',
    title: 'Cricket',
    note: 'Live, broadcast and recorded match coverage from the boundary.',
    image: '/categories/cricket.webp',
    alt: 'Broadcast camera rigged at the boundary of a cricket ground with an operator',
  },
  {
    slug: 'podcasts',
    title: 'Podcasts',
    note: 'Studio and on-location episodes for Reliance Foundation, Sri Sri University and Samaj.',
    image: '/categories/podcasts.webp',
    alt: 'Four guests seated for a podcast recording with microphones and cameras rigged',
  },
  {
    slug: 'convocation',
    title: 'Convocation',
    note: 'Multi-camera live streaming of degree ceremonies, including Birla Global University.',
    image: '/categories/convocation.webp',
    alt: 'Graduating students assembled in academic dress in a university hall',
  },
  {
    slug: 'conferences',
    title: 'Conferences',
    note: 'Panels, plenaries and foundation days for NALCO, HCL Foundation and Sagar Venture.',
    image: '/categories/conferences.webp',
    alt: 'Speakers seated on stage during a conference panel discussion',
  },
  {
    slug: 'music-concerts',
    title: 'Music concerts',
    note: 'Stage coverage across XIM, KIIT, IIIT, Rabindra Mandap and venues around Odisha.',
    image: '/categories/music-concerts.webp',
    alt: 'Singer performing at a microphone under stage lighting at a live concert',
  },
  {
    slug: 'drone-services',
    title: 'Drone services',
    note: 'Aerial photography, project monitoring, land survey and 360 virtual tours.',
    image: '/categories/drone-services.webp',
    alt: 'Aerial view of a large construction site with a tower crane',
  },
];
