/**
 * Client video testimonials, played from Instagram.
 *
 * ONLY REELS THAT ARE ACTUALLY TESTIMONIALS BELONG HERE. Of the four links
 * supplied, one is a recruitment advert ("We are hiring — salesman"), one is a
 * felicitation photo that belongs under Recognition, and one is client-branded
 * project work rather than a client speaking. Putting any of those under
 * "what our clients say" on a page read by government buyers would be worse
 * than having no section at all, so they are left out until confirmed.
 *
 * `poster` is stored locally on purpose. Instagram's CDN URLs are signed and
 * expire within days, so hotlinking them breaks silently — and a local poster
 * means the page makes NO request to Instagram until someone presses play.
 */

export interface Testimonial {
  /** Instagram reel shortcode — the bit after /reel/. */
  code: string;
  /** Who is speaking. Never inferred; only what the client has confirmed. */
  name: string;
  role: string;
  poster: string;
  alt: string;
}

export const testimonials: Testimonial[] = [
  {
    code: 'DULm-YYk0fI',
    name: 'Director',
    role: 'Aryan Public School, Aska',
    poster: '/testimonials/aps-aska-director.webp',
    alt: 'The Director of Aryan Public School, Aska, speaking to camera in a video review of Beyond Pixel Studio',
  },
];
