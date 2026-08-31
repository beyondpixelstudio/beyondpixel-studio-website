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
    image: '/work/national-para-athletics-kalinga.webp',
    alt:
      'The camera crew in accreditation bibs standing with their tripod-mounted cameras on the stadium infield',
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
    image: '/work/para-athletics-broadcast-gallery.webp',
    alt:
      'Outdoor broadcast desk at trackside — monitors, vision switcher and laptop rigged on a table beside the running track',
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
    alt:
      'Two frames: an operator adjusting a camera at the lit event, and the monitor wall and switcher of the broadcast gallery',
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
    image: '/work/indian-indoor-open-pole-vault.webp',
    alt:
      'Two frames: cameras on tripods positioned around the field, and athletes mid-race on the blue indoor track',
    blurb:
      'Competition photography and multi-camera coverage across combined events and the pole vault.',
  },
  {
    slug: 'film-preservation-restoration-workshop',
    title: '10th Film Preservation & Restoration Workshop India',
    client: 'Chief Minister events',
    category: 'chief-minister-events',
    service: 'Event coverage & media production',
    image: '/work/film-preservation-restoration-workshop.webp',
    alt:
      'Delegates on stage holding printed artwork at the Film Heritage Foundation workshop, framed prints displayed behind them',
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
    alt:
      'The NALCO Foundation Day stage under a full-width branded backdrop reading "Indian Essence, Global Presence"',
    blurb: 'Foundation Day coverage for a public sector undertaking, shot as a full event record.',
  },
  {
    slug: 'swamashree-conclave',
    title: 'Swayamshree Conclave – II',
    client: 'Conference production',
    category: 'conferences',
    service: 'Conference coverage & live production',
    image: '/work/swamashree-conclave.webp',
    alt:
      'Panel session in progress at Swayamshree Conclave II, speakers seated at the table with their portraits on the screen behind',
    blurb: 'Coverage of the panel discussion on partnership and innovation across the conclave programme.',
  },
  {
    slug: 'hcl-foundation',
    title: 'HCLTech Grant Pan India Symposium',
    client: 'HCL Foundation',
    category: 'conferences',
    service: 'Conference coverage & live production',
    image: '/work/hcl-foundation.webp',
    alt:
      'A speaker at the lectern at the HCLTech Grant Pan India Symposium, with a wide shot of the seated audience inset',
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
    alt:
      'The graduating class in convocation robes posed on the steps beneath the Class of 2025 banner',
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
    image: '/work/sagar-venture.webp',
    alt:
      'Site visit group in hi-vis vests and hard hats photographed inside the industrial shed',
    blurb: 'On-site and event photography for an industrial and engineering client.',
  },
  {
    slug: 'reliance-foundation-podcast',
    title: 'Podcast production',
    client: 'Reliance Foundation',
    category: 'podcasts',
    service: 'Podcast production',
    image: '/work/reliance-foundation-podcast.webp',
    alt:
      'The podcast set lit and rigged before the guests arrive — armchairs, boom microphones and planting against a glazed wall',
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
    alt:
      'Three guests seated on the podcast set in front of a backdrop of Odia newspaper mastheads',
    blurb: 'Studio podcast production, recorded and cut as an ongoing series.',
  },
  /* ------------------------------------------------------------------
     THREE ENTRIES ADDED FROM PHOTOGRAPHS, NOT FROM THE BROCHURE.

     The other sixteen projects here were read off the brochure and then given
     their photograph. These three arrived the other way round: Rajesh supplied
     images with no matching entry, so the entry is built from what the
     photograph actually shows plus the name on the file, and nothing else.
     Where the file gives only a name — "Ollyood Podcast" — the client is that
     name and no more, in the same shape as the Samaj entry above. No dates, no
     episode counts, no claims the picture does not support.
     ------------------------------------------------------------------ */
  {
    slug: 'sri-sri-university-podcast',
    title: 'Podcast with Sri Sri Ravi Shankar',
    client: 'Sri Sri University',
    category: 'podcasts',
    service: 'Podcast production',
    image: '/work/sri-sri-university-podcast.webp',
    alt:
      'A seated speaker recording on a lit set with a boom microphone, with an inset frame showing the multi-camera rig covering it',
    blurb: 'Multi-camera podcast recorded on location at the university.',
    featured: true,
  },
  {
    slug: 'ollywood-podcast',
    title: 'Ollywood Podcast',
    client: 'Ollywood',
    category: 'podcasts',
    service: 'Podcast production',
    image: '/work/ollywood-podcast.webp',
    alt: 'Two guests mid-conversation on the podcast set, seated either side of a low glass table',
    blurb: 'Two-guest interview podcast, recorded on set and cut for release.',
  },
  {
    slug: 'in-studio-podcast',
    title: 'In-studio podcast production',
    client: 'Beyond Pixel Studio, Patia',
    category: 'podcasts',
    service: 'Studio rental & podcast production',
    image: '/work/in-studio-podcast.webp',
    alt:
      'The studio rigged for a podcast — presenter at the desk behind a vision switcher, key light and camera in the foreground, branded backdrop behind',
    blurb: 'Our own room in Patia, rigged for podcast recording: cameras, lighting, sound and a switcher on the desk.',
  },
  {
    slug: 'ministry-event-coverage',
    title: 'Ministerial event coverage',
    client: 'Government of Odisha',
    category: 'ministry-events',
    service: 'Event coverage & media production',
    image: '/work/ministry-event-coverage.webp',
    alt:
      'A speaker addressing a garlanded ceremonial event, framed portraits arranged on the stage behind him',
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
    image: '/work/free-fire-beyond-horizon.webp',
    alt:
      'The esports production desk under stage lighting — operators working a long row of monitors and control surfaces',
    blurb: 'Championship coverage and real-time streaming for a competitive gaming final.',
  },
  {
    slug: 'cricket-coverage',
    title: 'Match coverage',
    client: 'Cricket',
    category: 'cricket',
    service: 'Live, broadcast & record',
    image: '/work/cricket-coverage.webp',
    alt:
      'An operator in headphones at the vision switcher, the match live on the monitor in front of him',
    blurb: 'Multi-camera coverage from the boundary, streamed live and recorded for the archive.',
  },
  {
    slug: 'music-concert-coverage',
    title: 'Concert coverage across Odisha',
    client: 'XIM, KIIT, IIIT, Rabindra Mandap and more',
    category: 'music-concerts',
    service: 'Multi-camera stage coverage',
    image: '/work/music-concert-coverage.webp',
    alt:
      'Frames from concerts across Odisha, each labelled with its venue — XIM University, Berhampur, Salepur, KIIT and Rabindra Mandap',
    blurb:
      'Stage coverage at university and public venues \u2014 Berhampur, Sambalpur, Angul, Puri and Bhubaneswar.',
  },
  {
    slug: 'drone-aerial-services',
    title: 'Aerial photography & mapping',
    client: 'Businesses, developers and organisations',
    category: 'drone-services',
    service: 'Drone & aerial videography',
    /* THE STOCK PHOTOGRAPH IS GONE, AND THAT IS THE POINT.

       This card carried a licensed Unsplash image of a quadcopter over a city
       at dusk — the only frame on the site that was not BPS work. I argued
       against it, Rajesh overruled that, and it shipped with its provenance
       recorded here.

       It is now a frame from DJI_0114.MP4: Rath Yatra at Puri, the chariot on
       Grand Road with the crowd running the length of it. Rajesh's own 4K
       footage, pulled at one second in and resized — 3840x2160 is natively
       16:9, so nothing is cropped and the composition is exactly as flown.

       Every image on this page is now the studio's own work, which is what the
       page claimed all along. Nothing on the site is licensed from anyone. */
    image: '/work/drone-aerial-services.webp',
    alt:
      'Aerial view of the Rath Yatra procession at Puri — the chariot on Grand Road with crowds filling the street to the horizon',
    blurb:
      'Aerial photography, public festivals, project monitoring, land survey and mapping, 360 virtual tours and real estate.',
  },
];

export const featuredWork = work.filter((w) => w.featured);
