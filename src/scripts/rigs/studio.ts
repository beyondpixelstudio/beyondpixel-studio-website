/**
 * Studio — Studio Rental
 *
 * A C-stand carrying a grip head, a boom arm with a counterweight, and a
 * softbox at the working end. This is the object a renter is actually paying
 * for, so it is built off a real grip stand rather than a generic light pole:
 * three legs of deliberately UNEQUAL length rising from one collar (so real
 * stands can nest into each other on a truck), a two-stage riser with a
 * knuckle between the stages, and a boom that is a separate pivot from the
 * stand it rides on.
 *
 * WHAT MAKES IT READ AS A C-STAND rather than a lamp post is the same
 * distinction gimbal.ts draws for its motors: the legs are unequal, not
 * decorative-symmetric, and the boom is a hinge a gaffer nudges, not a rigid
 * weld. Everything below the grip head is bolted down and never moves;
 * everything from the grip head outward drifts, as if someone keeps coming
 * back to nudge the aim a few degrees.
 */

import type { Kit, Rig } from './kit';

export default function studio(kit: Kit): Rig {
  const { THREE, roundedBox, cyl, band, accent, add, M, logo } = kit;

  /* The mark's colours climb the stand cool-to-warm: Ocean on the floor
     collar, Indigo on the riser knuckle, Violet on the grip head — and Ember,
     the hottest colour in the set, on the collar where the fixture meets the
     softbox. That last ring is not incidental: it is the one thing on this
     object that is actually a light, so it is the one thing that should pull
     the eye, and warm-advances/cool-recedes does that work for free if the
     sequence walks bottom to top. */
  const ringBase = accent(logo.ocean);
  const ringRiser = accent(logo.indigo);
  const ringHead = accent(logo.violet);
  const ringLamp = accent(logo.ember);

  /* The kit has no material for a lit diffusion face, and for good reason —
     nothing else on these six objects is meant to glow. This page is
     near-black, so a bright emissive rectangle the size of a softbox would be
     the single brightest thing in the composition and read as a UI bug, not
     as a light that's on. The fix is the same one a gaffer actually uses:
     keep the base colour DARK (near the body/grip tones, not white) and let a
     LOW, warm emissive do the "this is switched on" signalling instead of the
     surface colour. Matte, not glossy — a diffusion panel is fabric, not
     glass, so no clearcoat and no metalness. */
  const diffusion = new THREE.MeshPhysicalMaterial({
    color: 0x3a2b1e,
    emissive: 0xffb877,
    /* 0.2 was the right instinct pushed too far: the panel was so dim it read
       as an unlit frame, and the object became a boom stand holding nothing.
       A softbox is the subject here, so it has to be visibly ON — but a large
       white-hot rectangle on a near-black page blows the composition out. This
       sits where it reads as a lit source seen from an angle. */
    emissiveIntensity: 0.72,
    roughness: 0.9,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  const group = new THREE.Group();

  /* A helper for the four softbox struts, which are the one part of this rig
     that genuinely needs an arbitrary 3-D direction rather than an axis-
     aligned rotation. roundedBox's long dimension is its `h` (second) arg —
     same convention gimbal's leg shafts rely on — so aligning local +Y to the
     strut's direction with a quaternion orients it correctly regardless of
     which way it points. */
  const strut = (
    parent: THREE.Object3D,
    from: THREE.Vector3,
    to: THREE.Vector3,
    r: number
  ) => {
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const m = add(parent, roundedBox(r, len, r, r * 0.4), M.trim, mid.x, mid.y, mid.z);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return m;
  };

  /* --- C-stand base -------------------------------------------------------
     One collar, three legs of DIFFERENT lengths. Real C-stand legs share a
     single boss and still splay to different reaches — that is the detail
     that lets one stand's legs slide under another's on a crowded set, and
     it is the single fastest way to make this read as grip equipment instead
     of a music stand. Length varies; the vertical drop to the floor does not,
     so the splay angle widens as the legs get longer (a short leg stands
     nearly straight, a long leg lies almost flat) and all three feet land on
     the same floor plane. */
  const hub = new THREE.Group();
  hub.position.set(0, -1.5, 0);
  group.add(hub);
  add(hub, cyl(0.14, 0.16, 'y'), M.trim);
  add(hub, band(0.15, 0.05, 'y'), ringBase, 0, 0.09, 0);

  const legLen = [0.9, 1.1, 1.3];
  const drop = 0.4; // constant vertical reach so every foot meets the same floor
  for (let i = 0; i < 3; i++) {
    const L = legLen[i];
    const a = Math.acos(drop / L); // splay from vertical — bigger for the longer legs
    const leg = new THREE.Group();
    leg.rotation.y = (i / 3) * Math.PI * 2 + Math.PI / 6; // offset so a leg faces the viewer, not a gap
    hub.add(leg);
    const shaft = add(
      leg,
      roundedBox(0.1, L, 0.13, 0.04),
      M.body,
      0,
      -(L / 2) * Math.cos(a),
      (L / 2) * Math.sin(a)
    );
    shaft.rotation.x = -a;
    add(leg, roundedBox(0.14, 0.05, 0.17, 0.02), M.grip, 0, -L * Math.cos(a), L * Math.sin(a)); // rubber foot
  }

  /* --- Riser column, two stages -------------------------------------------
     Stage 1 (thicker, -1.5 to -0.5), a knuckle with a wing-knob at -0.5,
     stage 2 (thinner, -0.5 to 0.5) telescoping up out of it. */
  add(group, cyl(0.1, 1.0, 'y'), M.body, 0, -1.0, 0);

  add(group, cyl(0.135, 0.14, 'y'), M.trim, 0, -0.5, 0);
  add(group, band(0.145, 0.05, 'y'), ringRiser, 0, -0.5, 0);
  add(group, cyl(0.025, 0.22, 'x'), M.motor, 0.17, -0.5, 0); // knob stub
  add(group, roundedBox(0.03, 0.16, 0.03, 0.012), M.grip, 0.29, -0.5, 0); // T-handle, rubber grip

  add(group, cyl(0.085, 1.0, 'y'), M.body, 0, 0, 0);

  /* --- Grip head ------------------------------------------------------
     The knuckle that clamps the boom to the column. This whole assembly
     stays put — the swivel it enables lives one level up, in `boomPivot`,
     which is positioned here but is a separate node so the head itself
     never has to move for the boom to. */
  add(group, roundedBox(0.26, 0.26, 0.22, 0.05), M.trim, 0, 0.5, 0);
  add(group, band(0.15, 0.045, 'x'), ringHead, 0, 0.5, 0);
  add(group, cyl(0.028, 0.26, 'x'), M.motor, 0.19, 0.5, 0); // knob stub
  add(group, roundedBox(0.03, 0.18, 0.03, 0.012), M.grip, 0.32, 0.5, 0); // T-handle

  /* --- Boom + softbox, everything from here out rides the swivel ---------
     `boomPivot` sits exactly at the grip head's clamp point. Its local +Z is
     "out along the boom" — the long arm is authored straight down that axis
     with no extra rotation, the short counterweight arm down -Z, so the
     pivot's own rotation is the ONLY thing that has to move for the whole
     assembly to pan and tilt together, the way a real boom swings as one
     rigid piece around its clamp. */
  const boomPivot = new THREE.Group();
  boomPivot.position.set(0, 0.5, 0);
  group.add(boomPivot);

  const armLong = 1.05;
  const armShort = 0.35;
  const baseTiltX = -0.3; // resting angle: out, and only slightly up

  add(boomPivot, roundedBox(0.09, 0.09, armLong, 0.03), M.body, 0, 0, armLong / 2);
  add(boomPivot, roundedBox(0.09, 0.09, armShort, 0.03), M.body, 0, 0, -armShort / 2);

  // Counterweight on the short end, balancing the softbox on the long one.
  add(boomPivot, cyl(0.13, 0.2, 'z'), M.trim, 0, 0, -armShort - 0.08);

  /* Softbox rig, parented at the tip of the long arm so it inherits the
     boom's pan/tilt automatically — nothing below needs its own rotation
     logic. Square, not octagonal: four struts is a third the mesh cost of
     eight for a shape that reads identically at this scale. */
  const softbox = new THREE.Group();
  softbox.position.set(0, 0, armLong);
  boomPivot.add(softbox);

  // Lamp housing: compact fixture sitting just behind the softbox mouth.
  add(softbox, roundedBox(0.22, 0.24, 0.18, 0.04), M.body, 0, 0, -0.07);
  add(softbox, roundedBox(0.16, 0.02, 0.13, 0.006), M.trim, 0, 0.1, -0.1); // cooling fins
  add(softbox, roundedBox(0.16, 0.02, 0.13, 0.006), M.trim, 0, 0.14, -0.1);
  add(softbox, roundedBox(0.16, 0.02, 0.13, 0.006), M.trim, 0, 0.18, -0.1);
  add(softbox, roundedBox(0.09, 0.065, 0.014, 0.006), M.screen, 0.115, 0, -0.09); // control panel, dark/off
  add(softbox, band(0.115, 0.03, 'z'), ringLamp, 0, 0, 0.02); // collar where housing meets the frame

  const rim = 0.62;
  const depth = 0.42;
  const corners: [number, number, number][] = [
    [-rim, rim, depth],
    [rim, rim, depth],
    [rim, -rim, depth],
    [-rim, -rim, depth],
  ];
  for (const [cx, cy, cz] of corners) {
    strut(softbox, new THREE.Vector3(0, 0, 0.03), new THREE.Vector3(cx, cy, cz), 0.02);
  }
  // Front rim, four axis-aligned edges — no rotation needed since the frame
  // is authored in its own local space with the rim square to the boom axis.
  add(softbox, roundedBox(rim * 2 + 0.04, 0.03, 0.03, 0.01), M.trim, 0, rim, depth);
  add(softbox, roundedBox(rim * 2 + 0.04, 0.03, 0.03, 0.01), M.trim, 0, -rim, depth);
  add(softbox, roundedBox(0.03, rim * 2, 0.03, 0.01), M.trim, rim, 0, depth);
  add(softbox, roundedBox(0.03, rim * 2, 0.03, 0.01), M.trim, -rim, 0, depth);

  // The diffusion face — see the material comment up top for why it's dim.
  add(softbox, roundedBox(rim * 2 - 0.06, rim * 2 - 0.06, 0.02, 0.02), diffusion, 0, 0, depth + 0.02);

  /* --- Power cable ----------------------------------------------------
     A simple curved tube looping from the head down past the riser knuckle.
     Anchored on the static column rather than tracked to the moving fixture
     — a real cable would be clipped along the boom for most of its run
     anyway, so this reads correctly without having to rebuild the curve
     every frame as the boom moves. It gets its "sways with the boom" cue
     from a small rotation on its own pivot in `update`, not from following
     the fixture exactly. */
  const cablePivot = new THREE.Group();
  cablePivot.position.set(0, 0.42, 0.05);
  group.add(cablePivot);
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.06, -0.34, 0.05),
    new THREE.Vector3(-0.08, -0.58, 0.1),
    new THREE.Vector3(0.02, -0.8, 0.04),
  ]);
  add(cablePivot, new THREE.TubeGeometry(cableCurve, 32, 0.018, 8, false), M.grip);

  /* Eased targets, not raw drivers. A raw sine on the boom's rotation would
     read as a motor sweeping back and forth; a slow sine used only as a
     TARGET, with the actual angle chasing it on a lag, reads as a hand
     nudging the stand and letting it settle — which is what "aimed by a
     gaffer" actually looks like. The lag constants are far gentler than
     gimbal's motor correction (0.7-0.9 here vs 3.6-5.6 there) because a
     C-stand's boom is adjusted by hand every so often, not stabilised in
     real time. */
  const aim = { pan: 0, tilt: 0, cable: 0 };

  return {
    group,

    /* Positive yaw, for two reasons at once. First, the diffusion panel's
       resting normal is along local +Z (the boom's own forward axis) with no
       yaw baked into the rig itself, so the OBJECT's yaw is what turns it
       into a three-quarter view — near zero it stares straight at the
       camera as a flat rectangle, near a right angle it vanishes edge-on.
       Second, and just as load-bearing for this page: the sign controls
       which way the boom physically swings. A negative yaw (gimbal's choice,
       for a lens pointing INTO its headline) would swing this boom and its
       softbox toward the LEFT, straight at this page's headline text.
       Positive yaw swings it right instead, which is both the safer
       direction for layout and, at this magnitude, a clean three-quarter
       read on the panel. */
    yaw: -0.5,
    pitch: 0.08,
    /* Hand-computed from the rest pose (no Box3 available at authoring
       time): the lowest point is a foot pad at y ≈ -1.925 (hub at -1.5, legs
       drop a constant 0.4, pad half-height 0.025); the highest is a softbox
       rim corner at y ≈ +1.40 (grip head at 0.5, the arm's tilted reach
       carries the rim center to roughly y ≈ 1.02, and the rim's own local
       half-height of 0.4 — rotated through the same tilt — adds another
       ≈0.38). That's a ≈3.33-unit span before scale; 1.08 lands it at
       ≈3.6, mid-target. Centre of that span is y ≈ -0.26, so lift undoes it. */
    scale: 1.06,
    lift: -0.04,

    update(t, dt) {
      const ease = (cur: number, target: number, k: number) => cur + (target - cur) * Math.min(dt * k, 1);

      const panTarget = Math.sin(t * 0.11 + 0.4) * 0.35;
      const tiltTarget = Math.sin(t * 0.08 + 2.1) * 0.14;
      aim.pan = ease(aim.pan, panTarget, 0.9);
      aim.tilt = ease(aim.tilt, tiltTarget, 0.7);

      boomPivot.rotation.y = aim.pan;
      boomPivot.rotation.x = baseTiltX + aim.tilt;

      // The cable lags further behind the boom's own lag — a second-order
      // follow, which is what keeps it from looking rigidly welded to it.
      aim.cable = ease(aim.cable, aim.pan * 0.4, 0.5);
      cablePivot.rotation.z = aim.cable;
    },
  };
}
