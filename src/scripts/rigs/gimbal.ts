/**
 * Gimbal — Corporate Video Production
 *
 * A full-frame camera with a professional zoom, on a single-handle 3-axis
 * gimbal. Modelled against a real Weebill-class rig rather than against the
 * idea of one, which is what puts in the parts nobody invents from memory: the
 * mini tripod under the grip, the battery pack slung off the fixed body, the
 * diagonal sling arm, and the rail the camera actually bolts to.
 *
 * WHAT MAKES IT READ AS A GIMBAL is the behaviour, not the silhouette. The
 * handle sways as if being walked with and the three motors are driven to
 * cancel that sway, each with its own lag. You watch them catch up. Weld them
 * level and it becomes one rigid object turning; remove them and it is a camera
 * on a stick. The residual IS the effect.
 */

import type { Kit, Rig } from './kit';

export default function gimbal(kit: Kit): Rig {
  const { THREE, roundedBox, cyl, band, accent, add, M, tally, logo } = kit;

  /* The mark's colours run UP the object — Ocean at the base, through Violet,
     to Magenta, ending at the Ember ring on the lens. Each lands on a motor's
     seam ring, so the colour marks the pan, roll and tilt axes: the one detail
     that is genuinely structural, and the whole thing that makes this a gimbal
     rather than a camera on a pole. Cool recedes and warm advances, so the
     sequence walks the eye from the tripod up to the lens. Reversed, it drags
     attention down into the legs. */
  const axisPan = accent(logo.ocean);
  const axisRoll = accent(logo.violet);
  const axisTilt = accent(logo.magenta);
  const lensRing = accent(logo.ember);

  /* Hierarchy matters more than dimensions, because it is what makes the
     stabilisation possible:

       group
        sway -> the handle's motion, as if being walked with
         pan  (Y) -> motor 1
          roll (Z) -> motor 2
           tilt (X) -> motor 3
            cam       -> body, rail, lens

     Each motor group is a child of the one before, exactly as the real arm is
     assembled, so driving each rotation by the negation of the sway cancels it
     in the right order. Flatten this into siblings and the corrections apply in
     the wrong frames and the camera wobbles anyway. */
  const group = new THREE.Group();
  const sway = new THREE.Group();
  const pan = new THREE.Group();
  const roll = new THREE.Group();
  const tilt = new THREE.Group();
  const cam = new THREE.Group();

  group.add(sway);
  sway.add(pan);
  pan.add(roll);
  roll.add(tilt);
  tilt.add(cam);

  /* --- Mini tripod ------------------------------------------------------
     Three folding legs. The most recognisable thing on the object after the
     lens, and the part that says "gimbal" rather than "camera on a pole" even
     in silhouette. Offset by a sixth of a turn so a leg points at the viewer
     instead of a gap. */
  const hub = new THREE.Group();
  hub.position.set(0, -1.86, 0);
  sway.add(hub);
  add(hub, cyl(0.17, 0.2, 'y'), M.trim);
  for (let i = 0; i < 3; i++) {
    const leg = new THREE.Group();
    leg.rotation.y = (i / 3) * Math.PI * 2 + Math.PI / 6;
    // Splayed 0.95rad off vertical; the offsets are the leg's own half-length
    // resolved onto that angle, so the top of each leg meets the hub exactly.
    const shaft = add(leg, roundedBox(0.13, 0.62, 0.16, 0.05), M.body, 0, -0.18, 0.25);
    shaft.rotation.x = -0.95;
    add(leg, roundedBox(0.17, 0.06, 0.21, 0.03), M.grip, 0, -0.36, 0.5); // rubber foot
    hub.add(leg);
  }

  /* --- Handle -----------------------------------------------------------
     Lives on `sway`, NOT on `pan` — it is the part the operator holds, so it
     is the part that must visibly move while the camera does not. */
  add(sway, roundedBox(0.36, 0.98, 0.42, 0.14), M.grip, 0, -1.32, 0);
  add(sway, cyl(0.23, 0.14, 'y', 24), M.trim, 0, -1.72, 0); // knurled collar
  add(sway, roundedBox(0.4, 0.12, 0.46, 0.05), M.trim, 0, -0.86, 0); // top collar
  add(sway, cyl(0.05, 0.03, 'z', 16), tally, 0.09, -1.02, 0.23); // record lamp
  add(sway, roundedBox(0.12, 0.045, 0.02, 0.015), M.motor, -0.08, -1.02, 0.23);

  /* Battery / monitor pack. On `sway`, not `pan`: on the real thing it is
     bolted to the fixed body and does NOT spin with the pan motor. Parented to
     `pan` it swings around the handle like a fairground ride. */
  add(sway, roundedBox(0.46, 0.48, 0.28, 0.06), M.body, 0.46, -0.52, 0);
  add(sway, roundedBox(0.3, 0.34, 0.02, 0.02), M.screen, 0.7, -0.52, 0);

  /* --- Motor 1: PAN, vertical axis, above the handle -------------------- */
  pan.position.set(0, -0.54, 0);
  add(pan, cyl(0.3, 0.52, 'y'), M.motor);
  add(pan, band(0.315, 0.07, 'y'), axisPan, 0, 0.21, 0);
  /* The sling arm. Diagonal, not a right angle: this is the line that gives
     the object its lean, and squaring it off makes it read as a lamp. */
  const armA = add(pan, roundedBox(0.18, 0.9, 0.2, 0.06), M.body, -0.28, 0.08, 0);
  armA.rotation.z = 0.68;

  /* --- Motor 2: ROLL, axis along the lens ------------------------------- */
  roll.position.set(-0.55, 0.44, 0);
  add(roll, cyl(0.27, 0.36, 'z'), M.motor, 0, 0, 0.04);
  add(roll, band(0.285, 0.07, 'z'), axisRoll, 0, 0, 0.22);
  const armB = add(roll, roundedBox(0.17, 0.56, 0.19, 0.055), M.body, -0.13, 0.41, 0);
  armB.rotation.z = 0.55;

  /* --- Motor 3: TILT, axis across the camera ---------------------------- */
  tilt.position.set(-0.28, 0.66, 0);
  add(tilt, cyl(0.25, 0.36, 'x'), M.motor);
  add(tilt, band(0.265, 0.07, 'x'), axisTilt, 0.185, 0, 0);
  add(tilt, roundedBox(0.2, 0.36, 0.32, 0.05), M.body, 0.22, -0.2, 0); // riser
  add(tilt, roundedBox(1.5, 0.11, 0.36, 0.04), M.trim, 0.95, -0.38, 0); // rail
  add(tilt, roundedBox(1.12, 0.07, 0.3, 0.02), M.motor, 1.0, -0.29, 0); // QR plate

  /* --- The camera -------------------------------------------------------
     Pentaprism hump on the centre line, deep grip on the right, and a zoom
     that is a stack of rings rather than one tube. The stack is what sells it:
     a single cylinder reads as a telescope. */
  cam.position.set(1.02, -0.24, 0);

  add(cam, roundedBox(1.05, 0.82, 0.64, 0.09), M.body, 0, 0.45, 0);
  add(cam, roundedBox(0.36, 0.24, 0.42, 0.06), M.body, -0.06, 0.97, -0.02); // pentaprism
  add(cam, roundedBox(0.19, 0.06, 0.2, 0.02), M.trim, -0.06, 1.11, -0.02); // hot shoe
  add(cam, roundedBox(0.34, 0.76, 0.6, 0.11), M.grip, 0.6, 0.44, 0.03); // grip
  add(cam, cyl(0.12, 0.08, 'y'), M.trim, 0.34, 0.9, -0.05); // mode dial
  add(cam, cyl(0.1, 0.07, 'y'), M.trim, 0.12, 0.9, 0.14); // top dial
  add(cam, roundedBox(0.5, 0.36, 0.03, 0.02), M.screen, 0.05, 0.45, -0.33); // rear screen
  add(cam, cyl(0.05, 0.03, 'z', 16), tally, -0.42, 0.72, 0.33); // record tally

  /* Lens. Diameters step in and out deliberately: a smooth taper looks
     moulded, a stepped stack looks assembled. */
  const lens = new THREE.Group();
  lens.position.set(-0.07, 0.45, 0.32);
  cam.add(lens);
  add(lens, cyl(0.3, 0.1, 'z'), M.trim, 0, 0, 0.05); // mount
  add(lens, cyl(0.335, 0.28, 'z'), M.body, 0, 0, 0.24); // rear barrel
  add(lens, cyl(0.375, 0.3, 'z', 48), M.grip, 0, 0, 0.53); // zoom ring, rubber
  /* THE RED RING. On the reference lens it is a manufacturer's marque for its
     professional line, and it is the single highest-contrast detail on the
     object. Ours is Ember — the site's own persuasive colour — so the one thing
     the eye lands on is brand rather than someone else's badge. It is also why
     no logo is modelled anywhere on this camera. */
  add(lens, band(0.385, 0.055, 'z'), lensRing, 0, 0, 0.71);
  add(lens, cyl(0.36, 0.1, 'z'), M.body, 0, 0, 0.79); // mid barrel
  add(lens, cyl(0.37, 0.22, 'z', 48), M.grip, 0, 0, 0.95); // focus ring
  // Petal hood, flaring forward. Open-ended, so it is a tube you can see into.
  const hoodGeo = new THREE.CylinderGeometry(0.5, 0.385, 0.36, 36, 1, true);
  hoodGeo.rotateX(Math.PI / 2);
  add(lens, hoodGeo, M.hood, 0, 0, 1.24);
  // Front element, sunk inside the hood so the rim casts on it — a disc flush
  // with the front reads as a lens cap.
  add(lens, new THREE.CircleGeometry(0.34, 44), M.glass, 0, 0, 1.13);
  add(lens, new THREE.RingGeometry(0.34, 0.378, 44), M.trim, 0, 0, 1.145);

  /** The motors' current angles. Held outside the frame because the whole
      point is that they LAG the sway rather than tracking it exactly. */
  const corr = { x: 0, y: 0, z: 0 };

  return {
    group,

    /* YAW IS THE WHOLE COMPOSITION, and it is not a taste call.

       The lens points along the rig's +Z, so yaw maps it to (sin, 0, cos).
       Near zero the barrel foreshortens into a flat black disc and the object
       loses its most recognisable feature — it becomes a box with a hole in it.
       The barrel's LENGTH only appears as the magnitude approaches a right
       angle, so this is deliberately steep. Negative, not positive, so the lens
       looks INTO the headline rather than off the right edge of the page. */
    yaw: -0.82,
    pitch: 0.1,
    scale: 0.99,
    lift: 0.3,

    update(t, dt) {
      /* THE HANDLE'S MOTION. Three sines on deliberately unrelated periods so
         the pattern never visibly repeats. Equal or harmonic periods produce a
         clean figure-of-eight, which reads as a machine on a turntable rather
         than as a person walking. */
      const sx = Math.sin(t * 0.68) * 0.13; // pitch, the walking bob
      const sz = Math.sin(t * 0.51 + 1.1) * 0.16; // roll, the side-to-side
      const sy = Math.sin(t * 0.34 + 2.4) * 0.1; // yaw, the drift
      sway.rotation.set(sx, sy, sz);

      /* THE CORRECTION. Each motor drives toward the negation of the sway, but
         eased rather than snapped. The residual is what you actually watch: the
         horizon dips a few degrees and is pulled back. At a very high factor
         the camera is welded level and the arm looks like one solid object; at
         a very low one the stabilisation visibly fails. Roll gets the fastest
         motor because roll is the axis a viewer reads as "level" — a tilted
         horizon is obvious in a way a little pitch is not. */
      const ease = (cur: number, target: number, k: number) =>
        cur + (target - cur) * Math.min(dt * k, 1);
      corr.x = ease(corr.x, -sx, 4.4);
      corr.y = ease(corr.y, -sy, 3.6);
      corr.z = ease(corr.z, -sz, 5.6);

      pan.rotation.y = corr.y;
      roll.rotation.z = corr.z;
      tilt.rotation.x = corr.x;
    },
  };
}
