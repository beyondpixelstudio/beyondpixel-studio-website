/**
 * The client wall.
 *
 * Logos were cut from the studio's own "Our Clients" poster: the tile grid was
 * detected by scanning for the white tile interiors (208x208 each) rather than
 * by eye, so every mark is complete and none is clipped. They are the client's
 * own artwork, used with the client's own relationships — no trademark
 * permission is implied beyond that, and `name` carries the readable text so
 * the wall is still meaningful to a screen reader and to a crawler.
 *
 * ORDER IS DELIBERATE: the most recognisable marks are spread through the list
 * rather than front-loaded, because a marquee is seen a few items at a time and
 * a strong name should be on screen at most moments.
 */
export interface Client {
  /** Readable name — used as the image's alt text. */
  name: string;
  /** File in /public/clients/. */
  logo: string;
}

export const clients: Client[] = [
  { name: 'HCLTech', logo: 'hcltech' },
  { name: 'KIIT', logo: 'kiit' },
  { name: 'Reliance Foundation', logo: 'reliance-foundation' },
  { name: 'Birla Global University', logo: 'bgu' },
  { name: 'Housing.com', logo: 'housing-com' },
  { name: 'IIIT Bhubaneswar', logo: 'iiit-bhubaneswar' },
  { name: 'Apollo Paints', logo: 'apollo-paints' },
  { name: 'SOA University', logo: 'soa-university' },
  { name: 'Assotech', logo: 'assotech' },
  { name: 'XIM University', logo: 'xim-university' },
  { name: 'Sri Sri University', logo: 'sri-sri-university' },
  { name: 'KIMS Bhubaneswar', logo: 'kims' },
  { name: 'Indian Athletics', logo: 'indian-athletics' },
  { name: 'Resonate Productions', logo: 'resonate' },
  { name: 'Sagar Business', logo: 'sagar-business' },
  { name: 'Oxford Public School', logo: 'oxford-public-school' },
  { name: 'CarpeDiem Media', logo: 'carpediem' },
  { name: 'Takshashila', logo: 'takshashila' },
  { name: 'Sankalp Senior Secondary School', logo: 'sankalp' },
  { name: 'Sonikh', logo: 'sonikh' },
  { name: 'K C Public School, Khallikote', logo: 'kc-public-school' },
  { name: 'Aryan Public School', logo: 'aryan-public-school' },
  { name: 'Radiance', logo: 'radiance' },
];
