/**
 * Monitor — the Work page
 *
 * A director's monitor with a sunhood, on an articulated arm.
 *
 * WHY NOT A FILM REEL. The obvious object for a portfolio page is a spool of
 * film, and it is wrong here for a reason written into the page itself: the
 * headline is "The work, not the showreel". Putting a showreel on it would have
 * the picture arguing with the sentence beside it. A monitor is what you watch
 * finished work back on, which is what the page is for.
 *
 * The sunhood is the part that makes it readable. A bare rectangle on an arm is
 * a television; the four flared panels are what say "this is on a set" at a
 * glance and in silhouette, which is how anyone will actually see it.
 *
 * MOTION IS THE ARM BEING POSITIONED, not the object spinning. Someone is
 * nudging the head into place: it drifts toward a target, eases, overshoots
 * nothing, and settles. The screen carries a slow luminance drift underneath —
 * a cut changing, not a blink — because a monitor that holds one exact
 * brightness reads as switched off with a grey card on it.
 */

import type { Kit, Rig } from './kit';

export default function monitor(kit: Kit): Rig {
  const { THREE, roundedBox, cyl, band, accent, add, M, tally, logo } = kit;

  /* Cool at the base, warming as it climbs to the screen — the same run the
     other rigs use, on the three knuckles, which are this object's equivalent
     of the gimbal's motor rings: the joints are what make it an arm rather
     than a pole, so the joints are what carry the colour. */
  const jointA = accent(logo.ocean);
  const jointB = accent(logo.violet);
  const jointC = accent(logo.magenta);

  const group = new THREE.Group();

  /* head is a child of the arm so the arm's own angle is inherited; the head
     then adds its own pan and tilt on top, exactly as a monitor yoke does. */
  const arm = new THREE.Group();
  const head = new THREE.Group();
  group.add(arm);
  arm.add(head);

  /* --- Base and riser --------------------------------------------------- */
  add(group, cyl(0.52, 0.1, 'y', 40), M.trim, 0, -1.5, 0);
  add(group, cyl(0.44, 0.05, 'y', 40), M.motor, 0, -1.43, 0);
  add(group, cyl(0.1, 0.95, 'y'), M.body, 0, -0.95, 0); // riser post
  add(group, band(0.13, 0.07, 'y'), jointA, 0, -0.5, 0); // first joint

  /* --- The arm ----------------------------------------------------------
     Two segments meeting at a knuckle, both angled. A single straight boom
     reads as a lamp; the elbow is what makes it a magic arm. */
  arm.position.set(0, -0.48, 0);
  const segA = add(arm, roundedBox(0.13, 0.86, 0.15, 0.05), M.body, -0.2, 0.36, 0);
  segA.rotation.z = 0.46;

  const elbow = new THREE.Group();
  elbow.position.set(-0.39, 0.74, 0);
  arm.add(elbow);
  add(elbow, cyl(0.13, 0.22, 'z'), M.motor);
  add(elbow, band(0.145, 0.07, 'z'), jointB, 0, 0, 0.13);

  const segB = add(elbow, roundedBox(0.12, 0.8, 0.14, 0.05), M.body, 0.24, 0.34, 0);
  segB.rotation.z = -0.58;

  /* --- Head yoke --------------------------------------------------------- */
  head.position.set(-0.02, 1.36, 0);
  add(head, cyl(0.12, 0.2, 'x'), M.motor);
  add(head, band(0.135, 0.065, 'x'), jointC, 0.11, 0, 0);
  add(head, roundedBox(0.1, 0.24, 0.1, 0.03), M.trim, 0, 0.17, 0); // stem to the body

  /* --- The monitor body --------------------------------------------------
     A slab, not a box: 1.86 x 1.12 at 0.11 deep is the proportion of a
     seven-inch field monitor, and getting the thinness right is most of what
     separates it from a television. */
  add(head, roundedBox(1.86, 1.12, 0.11, 0.05), M.body, 0, 0.72, 0);
  add(head, roundedBox(1.9, 1.16, 0.03, 0.05), M.trim, 0, 0.72, -0.06); // rear plate
  add(head, roundedBox(0.52, 0.42, 0.14, 0.04), M.grip, 0.42, 0.72, -0.14); // battery
  add(head, cyl(0.05, 0.03, 'z', 16), tally, -0.72, 0.24, 0.07); // record lamp
  for (let i = 0; i < 3; i++) {
    add(head, cyl(0.045, 0.03, 'z', 16), M.motor, -0.5 + i * 0.16, 0.24, 0.07); // buttons
  }

  /* THE SCREEN IS LIT, BUT ONLY JUST.

     `M.screen` is the kit's switched-off display and would be wrong here — the
     whole point of this object is that something is playing on it. It is also
     not allowed to be bright, and the first attempt proved the point: at 0.5
     over a mid-blue emissive it was the most luminous thing on the page and the
     object stopped being a monitor and became a lamp with legs. A screen in a
     dark room is DIM — it is the only lit thing, not a strong one. Down to 0.22
     over a much darker blue, and the loop drifts it rather than holding it. */
  const screenMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a1018,
    emissive: 0x1b3a52,
    emissiveIntensity: 0.22,
    roughness: 0.16,
    metalness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });
  add(head, roundedBox(1.7, 0.96, 0.02, 0.02), screenMat, 0, 0.72, 0.06);

  /* --- Sunhood -----------------------------------------------------------
     Four panels flaring forward off the screen edges. Built as rotated slabs
     rather than a single tapered shell: the shell would need a custom profile
     and would lose the visible seams at the corners, and those seams are what
     make it read as folding hardware rather than as a moulded shroud. */
  const hoodTB = roundedBox(1.86, 0.34, 0.03, 0.02);
  const hoodLR = roundedBox(0.34, 1.12, 0.03, 0.02);
  const FLARE = 0.42;

  const top = add(head, hoodTB, M.hood, 0, 1.42, 0.2);
  top.rotation.x = FLARE;
  const bot = add(head, hoodTB, M.hood, 0, 0.02, 0.2);
  bot.rotation.x = -FLARE;
  const left = add(head, hoodLR, M.hood, -1.06, 0.72, 0.2);
  left.rotation.y = -FLARE;
  const right = add(head, hoodLR, M.hood, 1.06, 0.72, 0.2);
  right.rotation.y = FLARE;

  /* Eased state, held outside the frame — the head lags its target so it reads
     as a hand adjusting rather than a servo tracking. */
  const st = { pan: 0, tilt: 0 };

  return {
    group,

    /* Unlike the lens rigs, a shallow yaw is CORRECT here. On those, turning
       the barrel toward the viewer collapses it into a disc; on this, the
       screen is the subject and a hard three-quarter hides it. But flat-on
       flattens the sunhood to a rectangle and loses the depth that identifies
       the object, so this is the compromise: enough turn to see the hood's
       inside face and the arm behind, not enough to lose the screen. */
    yaw: -0.55,
    pitch: 0.05,
    scale: 0.95,
    /* TRACED, NOT ESTIMATED — the first pass guessed a top of 1.85 and cropped
       the hood off the top of the hero. The real chain: base bottom -1.55; arm
       sits at -0.48 and head at +1.36 inside it, so the head is at world 0.88;
       the hood's top edge is 1.59 above that, at 2.47. Span 4.02, midpoint
       0.46. At 0.95 that is 3.82 units in a 4.82-unit frame — filling it
       without the hood running off the top, which 1.06 did. */
    lift: -0.95 * 0.46,

    update(t, dt) {
      const ease = (cur: number, target: number, k: number) =>
        cur + (target - cur) * Math.min(dt * k, 1);

      /* BIASED, LIKE THE BROADCAST HEAD, AND FOR THE SAME REASON.

         This pan adds to the framing yaw and to the host's own presentation
         turn. Centred on zero it would periodically cancel both, swinging the
         screen edge-on to the viewer — the one angle at which this object is
         unreadable. Held negative, the head still moves and the screen never
         turns away. */
      st.pan = ease(st.pan, -0.16 + Math.sin(t * 0.13) * 0.13, 1.3);
      st.tilt = ease(st.tilt, Math.sin(t * 0.19 + 1.4) * 0.07, 1.6);
      head.rotation.y = st.pan;
      head.rotation.x = st.tilt;

      // The arm breathes very slightly under the weight it is holding.
      arm.rotation.z = Math.sin(t * 0.11 + 0.6) * 0.018;

      /* A cut changing, not a blink. Two unrelated periods so the level never
         settles into a visible rhythm, and a range narrow enough that it never
         becomes the brightest thing in the hero. */
      screenMat.emissiveIntensity =
        0.22 + Math.sin(t * 0.37) * 0.05 + Math.sin(t * 0.83 + 2.1) * 0.025;
    },
  };
}
