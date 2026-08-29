/**
 * Real work, taken from the studio's own 2026 portfolio brochure.
 *
 * Every entry names a real client and a real event, and every photograph is the
 * studio's own from that job. Nothing here is stock and nothing is illustrative
 * — the empty "SLATE" placeholders this replaced existed precisely because that
 * was the honest state of the site until these arrived.
 *
 * Claims are limited to what the brochure itself states. Where it gives no year,
 * none is invented; where it names a service, that is the service listed.
 */

export interface Project {
  slug: string;
  /** What the job was. */
  title: string;
  /** Who it was for, as they are named in the brochure. */
  client: string;
  /** Which brochure category this sits under. Drives the grouping on the page. */
  category:
    | 'chief-minister-events'
    | 'ministry-events'
    | 'athletic-events'
    | 'esports-live-production'
    | 'cricket'
    | 'podcasts'
    | 'convocation'
    | 'conferences'
    | 'music-concerts'
    | 'drone-services';
  /** The service delivered, in our own service vocabulary. */
  service: string;
  /** Only where the brochure states one. */
  year?: string;
  image: string;
  /** Describes the photograph, not the project. */
  alt: string;
  blurb: string;
  featured?: boolean;
}

export const work: Project[] = [
  {
    slug: 'national-para-athletics-kalinga',
    title: '24th National Para Athletics Championships',
    client: 'Kalinga Stadium, Bhubaneswar',
    category: 'athletic-events',
    service: 'Live streaming & broadcast production',
    image: '/work/para-athletics-crew-kalinga.webp',
    alt: 'Beyond Pixel Studio camera crew in high-visibility vests lined up with broadcast cameras on the infield at Kalinga Stadium',
    blurb:
      'Multi-camera broadcast production and live streaming across the championships, run from the stadium floor.',
    featured: true,
  },
  {
    slug: 'para-athletics-broadcast-gallery',
    title: 'Broadcast gallery, Kalinga Stadium',
    client: '24th National Para Athletics Championships',
    category: 'athletic-events',
    service: 'Multi-camera live production',
    image: '/work/para-athletics-broadcast-desk.webp',
    alt: 'Broadcast control position with switcher, monitors and audio desk set up trackside inside the stadium',
    blurb:
      'The gallery the event was cut from — switcher, monitoring and audio, built on site for the run of the championships.',
  },
  {
    slug: 'indian-open-para-athletics',
    title: '8th Indian Open Para Athletics International Championship',
    client: 'Indian Open Para Athletics',
    category: 'athletic-events',
    service: 'Live streaming & event production',
    year: '2026',
    image: '/work/indian-open-para-athletics.webp',
    alt: 'Broadcast camera on a tripod at the trackside with an operator, shot against low evening sun',
    blurb:
      'International-level para athletics covered end to end, from trackside positions through to the outgoing stream.',
    featured: true,
  },
  {
    slug: 'indian-indoor-open-pole-vault',
    title: '1st Indian Indoor Open Combined Events & Pole Vault',
    client: 'Indian Indoor Open',
    category: 'athletic-events',
    service: 'Event photography & multi-camera coverage',
    image: '/work/indian-indoor-open-athletics.webp',
    alt: 'Sprinter mid-stride on an indoor athletics track, captured by the Beyond Pixel Studio team',
    blurb:
      'Competition photography and multi-camera coverage across combined events and the pole vault.',
  },
  {
    slug: 'film-preservation-restoration-workshop',
    title: '10th Film Preservation & Restoration Workshop India',
    client: 'Chief Minister events',
    category: 'chief-minister-events',
    service: 'Event coverage & media production',
    image: '/work/cm-film-preservation-workshop.webp',
    alt: 'Dignitaries on stage during the Film Preservation and Restoration Workshop, covered by the studio',
    blurb:
      'Coverage of a state-level cultural programme, alongside ministerial and Chief Minister event work.',
    featured: true,
  },
  {
    slug: 'nalco-foundation-day',
    title: '46th Foundation Day',
    client: 'NALCO',
    category: 'conferences',
    service: 'Conference coverage',
    image: '/work/nalco-foundation-day.webp',
    alt: 'NALCO Foundation Day staging and branding photographed during the event',
    blurb: 'Foundation Day coverage for a public sector undertaking, shot as a full event record.',
  },
  {
    slug: 'swamashree-conclave',
    title: 'Swayamshree Conclave – II',
    client: 'Conference production',
    category: 'conferences',
    service: 'Conference coverage & live production',
    image: '/work/swamashree-conclave.webp',
    alt: 'Panel discussion at Swayamshree Conclave II on partnership and innovation, five speakers seated on stage',
    blurb: 'Coverage of the panel discussion on partnership and innovation across the conclave programme.',
  },
  {
    slug: 'hcl-foundation',
    title: 'HCLTech Grant Pan India Symposium',
    client: 'HCL Foundation',
    category: 'conferences',
    service: 'Conference coverage & live production',
    image: '/work/hcl-foundation-conference.webp',
    alt: 'Speaker at the HCLTech Grant Pan India Symposium addressing the room from the stage',
    blurb: 'Corporate conference coverage for a foundation programme, from keynote through to sessions.',
    featured: true,
  },
  {
    slug: 'bgu-convocation',
    title: 'Convocation 2026',
    client: 'Birla Global University, Bhubaneswar',
    category: 'convocation',
    service: 'Multi-camera live streaming & event production',
    year: '2026',
    image: '/work/bgu-convocation.webp',
    alt: 'Graduating cohort assembled in academic dress in the university hall during the convocation',
    blurb:
      'Multi-camera live streaming of the convocation, bringing the ceremony to families watching remotely.',
    featured: true,
  },
  {
    slug: 'sagar-venture',
    title: 'Site and event coverage',
    client: 'Sagar Venture Pvt. Ltd.',
    category: 'conferences',
    service: 'Commercial photography & videography',
    image: '/work/sagar-venture-site.webp',
    alt: 'Site team in high-visibility vests and safety helmets photographed on location',
    blurb: 'On-site and event photography for an industrial and engineering client.',
  },
  {
    slug: 'reliance-foundation-podcast',
    title: 'Podcast production',
    client: 'Reliance Foundation',
    category: 'podcasts',
    service: 'Podcast production',
    image: '/work/reliance-foundation-podcast.webp',
    alt: 'Multi-person podcast recording in progress with guests seated around a low table and cameras rigged',
    blurb:
      'Multi-camera podcast production — set, lighting, sound and edit — for a national foundation.',
    featured: true,
  },
  {
    slug: 'samaj-podcast',
    title: 'Samaj Podcast',
    client: 'Samaj',
    category: 'podcasts',
    service: 'Podcast production',
    image: '/work/samaj-podcast.webp',
    alt: 'Two guests seated for a podcast recording in front of the branded set',
    blurb: 'Studio podcast production, recorded and cut as an ongoing series.',
  },
  {
    slug: 'ministry-event-coverage',
    title: 'Ministerial event coverage',
    client: 'Government of Odisha',
    category: 'ministry-events',
    service: 'Event coverage & media production',
    image: '/categories/ministry-events.webp',
    alt: 'A minister addressing an audience from a lectern at an official function',
    blurb:
      'Coverage for ministers and departments, including Suryabanshi Suraj, Bhartruhari Mahtab and Gokula Nanda Mallik.',
  },
  {
    slug: 'free-fire-beyond-horizon',
    title: 'Free Fire Esports \u2014 Beyond Horizon',
    client: 'Esports championship',
    category: 'esports-live-production',
    service: 'Multi-camera live streaming',
    year: '2026',
    image: '/categories/esports-live-production.webp',
    alt: 'Esports competitors seated on stage during a live-streamed tournament',
    blurb: 'Championship coverage and real-time streaming for a competitive gaming final.',
  },
  {
    slug: 'cricket-coverage',
    title: 'Match coverage',
    client: 'Cricket',
    category: 'cricket',
    service: 'Live, broadcast & record',
    image: '/categories/cricket.webp',
    alt: 'Broadcast camera rigged at the boundary of a cricket ground with an operator',
    blurb: 'Multi-camera coverage from the boundary, streamed live and recorded for the archive.',
  },
  {
    slug: 'music-concert-coverage',
    title: 'Concert coverage across Odisha',
    client: 'XIM, KIIT, IIIT, Rabindra Mandap and more',
    category: 'music-concerts',
    service: 'Multi-camera stage coverage',
    image: '/categories/music-concerts.webp',
    alt: 'Singer performing at a microphone under stage lighting at a live concert',
    blurb:
      'Stage coverage at university and public venues \u2014 Berhampur, Sambalpur, Angul, Puri and Bhubaneswar.',
  },
  {
    slug: 'drone-aerial-services',
    title: 'Aerial photography & mapping',
    client: 'Businesses, developers and organisations',
    category: 'drone-services',
    service: 'Drone & aerial videography',
    image: '/categories/drone-services.webp',
    alt: 'Aerial view of a large construction site with a tower crane',
    blurb:
      'Aerial photography, public festivals, project monitoring, land survey and mapping, 360 virtual tours and real estate.',
  },
];

export const featuredWork = work.filter((w) => w.featured);
