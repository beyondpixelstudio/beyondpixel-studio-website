/**
 * Video testimonials, played from Instagram.
 *
 * `poster` is stored locally on purpose. Instagram's CDN URLs are signed and
 * expire within days, so hotlinking them breaks silently — and a local poster
 * is what lets the page make NO request to Instagram until someone presses
 * play.
 *
 * NAMES ARE NOT INVENTED. Where the cover frame states who is speaking, that is
 * used verbatim. Where it does not, the entry carries what can actually be
 * seen and is marked for Rajesh to correct — a fabricated name under a video
 * testimonial is the one thing on this page a viewer could immediately catch.
 */

export interface Testimonial {
  /** Instagram reel shortcode — the part after /reel/. */
  code: string;
  name: string;
  role: string;
  poster: string;
  alt: string;
}

export const testimonials: Testimonial[] = [
  {
    code: 'DULm-YYk0fI',
    // Cover frame reads "Review- Director, APS-Aska".
    name: 'Director',
    role: 'Aryan Public School, Aska',
    poster: '/testimonials/aps-aska-director.webp',
    alt: 'The Director of Aryan Public School, Aska, speaking to camera in a video review',
  },
  {
    code: 'DB4Dho6yiJQ',
    // TODO — CONFIRM NAME. Cover shows a seated speaker wearing a lapel mic.
    name: 'Client review',
    role: 'On camera',
    poster: '/testimonials/beyond-pixel-reel.webp',
    alt: 'A client seated with a lapel microphone, speaking to camera in a video review',
  },
  {
    code: 'DYWDKGdx_N6',
    // Cover frame carries the client's name.
    name: 'Sagar Business Private Limited',
    role: 'Event coverage',
    poster: '/testimonials/sagar-business.webp',
    alt: 'Beyond Pixel Studio camera operator filming at a Sagar Business Private Limited event',
  },
  {
    code: 'DMrkZsPil_B',
    // TODO — CONFIRM. Cover shows a certificate being presented.
    name: 'Felicitation',
    role: 'Award presentation',
    poster: '/testimonials/felicitation-reel.webp',
    alt: 'A framed certificate being presented to the studio at a felicitation ceremony',
  },
];
