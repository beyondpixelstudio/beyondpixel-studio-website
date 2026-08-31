/**
 * Google reviews, quoted verbatim.
 *
 * -------------------------------------------------------------------------
 * ONLY COMPLETE REVIEWS ARE HERE.
 *
 * Rajesh supplied the list from the Business Profile, and most of the longer
 * ones arrived truncated — "Planning and preparation was excellent. Had…
 * View full review". Not one of those is on the site. Finishing someone else's
 * sentence and printing it inside quotation marks under their name is
 * fabricating a testimonial, and it is the single most damaging thing that
 * could go on this site: it is attributed, checkable against a public profile,
 * and wrong.
 *
 * So every entry below is a review whose text was complete in the source.
 * Where a reviewer's grammar is their own, it stays their own — these are
 * quotations, and tidying them would make them ours.
 *
 * -------------------------------------------------------------------------
 * NOT MARKED UP AS schema.org Review, AND THAT IS DELIBERATE.
 *
 * Same reasoning already recorded against `reviews` in business.ts: Google's
 * structured-data guidelines exclude reviews collected on a third-party
 * platform from review rich results when a business republishes them on its
 * own site. Marking these up would be asking for a rich result the guidelines
 * do not allow and risking a manual action against the whole domain.
 *
 * They earn their place visually and as indexable text on the page — which is
 * where the actual SEO value is anyway: real sentences containing "live
 * streaming", "photography studio", "equipment rental" and "Bhubaneswar",
 * written by other people rather than by us.
 *
 * -------------------------------------------------------------------------
 * ONE REVIEW WAS DELIBERATELY EXCLUDED. A five-star review from Akash Gouda
 * opens "Visionary Studios excels in digital services and photography" — it
 * names a different company. It is on the profile and it is glowing, and it is
 * not usable: quoting a review that praises somebody else is the kind of detail
 * a competitor screenshots. Flagged to Rajesh separately.
 */

export interface Review {
  /** Reviewer's name, as it appears on the Google profile. */
  name: string;
  /** Verbatim. Never edited, never completed, never tidied. */
  text: string;
  /** Shown as supplied by Google — relative, because that is what Google shows. */
  when: string;
  /** Google's own "Local Guide" badge, where the reviewer carries one. */
  localGuide?: boolean;
  /**
   * Which service page this review belongs beside, where it names one
   * specifically. Undefined means general — homepage only.
   */
  service?: 'studio-rental-bhubaneswar' | 'live-event-streaming-bhubaneswar' | 'commercial-photography-videography-bhubaneswar';
}

export const reviews: Review[] = [
  {
    name: 'Nibedita Sahu',
    text: 'A well-equipped photography studio with modern lighting, backdrops, and a professional environment. Ideal for portraits, product shoots, and commercial work.',
    when: '41 weeks ago',
    service: 'studio-rental-bhubaneswar',
  },
  {
    name: 'Saswat Kumar Padhy',
    text: "They've the best equipments and accessories that you can rent.",
    when: '46 weeks ago',
    service: 'studio-rental-bhubaneswar',
  },
  {
    name: 'Kuldeep Das',
    text: 'Perfectly managed the video switching work with photography.',
    when: '47 weeks ago',
    localGuide: true,
    service: 'live-event-streaming-bhubaneswar',
  },
  {
    name: 'Dibakar Kumar Nayak',
    text: 'This Studio Provides Best photography, videography and live streaming services.',
    when: '41 weeks ago',
  },
  {
    name: 'Sunaina Creations (Om Prakash)',
    text: 'Nice video & live streaming team',
    when: '41 weeks ago',
    localGuide: true,
    service: 'live-event-streaming-bhubaneswar',
  },
  {
    name: 'Dp Mahapatra',
    text: 'Well organised professional team.',
    when: '41 weeks ago',
  },
  {
    name: 'Ajay Kumar subudhi',
    text: 'very nice service . fully satisfied with the work. solved a complex proved in real time.',
    when: '47 weeks ago',
    service: 'live-event-streaming-bhubaneswar',
  },
  {
    name: 'ANURAG KANSARI',
    text: 'Very Good video and photo graphics and and cooperation with us',
    when: '47 weeks ago',
    service: 'commercial-photography-videography-bhubaneswar',
  },
];
