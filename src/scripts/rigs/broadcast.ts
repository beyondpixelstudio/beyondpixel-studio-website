/**
 * Broadcast — Event Coverage & Live Streaming
 *
 * A shoulder-style ENG camera on a heavy fluid-head tripod, rigged to push a
 * live feed rather than just record one. What separates "filming" from
 * "streaming" is a single part: the link transmitter bolted to the back with
 * its stub antenna. Everything else on this object also exists on a plain
 * broadcast camera, so that box is doing the storytelling and gets a coloured
 * light on it for exactly that reason.
 *
 * WHAT MAKES IT READ AS A FLUID HEAD rather than a camera glued to a pole is
 * that only the head assembly moves. The tripod is a planted, static object —
 * three heavy two-stage legs and a spreader that would look absurd swaying —
 * and the pan/tilt motion lives entirely above it, in its own pivot chain.
 */

import type { Kit, Rig } from './kit';

export default function broadcast(kit: Kit): Rig {
  const { THREE, roundedBox, cyl, band, accent, add, M, tally, logo } = kit;

  /* Four accents, cool-to-warm from base to lens exactly as the kit asks:
     Ocean marks the pan lock (the lowest axis, at the tripod head), Indigo
     the tilt lock a step above it, Magenta the transmitter's link light
     (mounted high on the back, a working indicator rather than a "look here"
     cue), and Ember — the warmest, most-advancing colour in the set — marks
     the lens ring, because the lens is the one thing on this object the eye
     is supposed to land on. */
  const panLock = accent(logo.ocean);
  const tiltLock = accent(logo.indigo);
  const linkLight = accent(logo.magenta);
  const lensRing = accent(logo.ember);

  const group = new THREE.Group();

  /* --- Static tripod ------------------------------------------------------
     Nothing under `tripod` ever rotates in update(). Splay is shallow (0.5rad
     off vertical, versus a mini gimbal tripod's ~0.95) because a heavy
     broadcast tripod stands closer to upright than a folding travel one. */
  const tripod = new THREE.Group();
  group.add(tripod);

  add(tripod, cyl(0.17, 0.14, 'y'), M.trim, 0, 0.07, 0); // top casting the legs bolt to
  add(tripod, cyl(0.16, 0.1, 'y'), M.trim, 0, 0.13, 0); // bowl adapter the head clamps into

  const SPLAY = 0.5;
  const legAngles: number[] = [];
  for (let i = 0; i < 3; i++) legAngles.push((i / 3) * Math.PI * 2 + Math.PI / 6);

  for (const angle of legAngles) {
    const legYaw = new THREE.Group();
    legYaw.rotation.y = angle;
    tripod.add(legYaw);
    const legPitch = new THREE.Group();
    // Negative: at this splay a point at local -Y (down the leg) must land at
    // positive local Z (outward, before legYaw carries that to the spoke's
    // own radial direction) — see kit.band comment for the same orient trick.
    legPitch.rotation.x = -SPLAY;
    legYaw.add(legPitch);

    // Two stages plus a visible lock collar between them, all built as plain
    // Y-axis cylinders because legPitch already carries the splay — no part
    // needs its own extra rotation.
    add(legPitch, cyl(0.1, 0.85, 'y'), M.body, 0, -0.425, 0); // upper, thicker
    add(legPitch, cyl(0.115, 0.09, 'y'), M.trim, 0, -0.895, 0); // lock collar
    add(legPitch, cyl(0.075, 0.75, 'y'), M.body, 0, -1.315, 0); // lower, thinner
    add(legPitch, cyl(0.09, 0.1, 'y'), M.grip, 0, -1.74, 0); // rubber foot
  }

  /* Spreader: a centre hub with three arms reaching to each leg's lock collar,
     at the same height as the collar so it reads as the thing actually
     holding the legs at that joint. Each arm's geometry is centred at its own
     origin (band-style symmetric cylinder), so it is positioned at HALF its
     length out from the hub and then rotated to the leg's own angle — the
     same yaw that placed the leg there in the first place. */
  const spreaderY = -0.895 * Math.cos(SPLAY);
  const armLen = 0.895 * Math.sin(SPLAY) * 2;
  add(tripod, cyl(0.06, 0.08, 'y'), M.trim, 0, spreaderY, 0);
  for (const angle of legAngles) {
    const arm = add(
      tripod,
      cyl(0.035, armLen, 'z'),
      M.trim,
      (armLen / 2) * Math.sin(angle),
      spreaderY,
      (armLen / 2) * Math.cos(angle)
    );
    arm.rotation.y = angle;
  }

  /* --- The head: pan, then tilt, exactly as a real fluid head is stacked --
     panPivot sits on the bowl adapter and owns yaw. tiltPivot is its CHILD,
     not a sibling, because tilting has to happen in the already-panned frame
     — flatten this into siblings and tilting one axis would drag the other
     off true the moment pan is non-zero. */
  const panPivot = new THREE.Group();
  panPivot.position.set(0, 0.13, 0);
  group.add(panPivot);

  add(panPivot, cyl(0.24, 0.22, 'y'), M.motor, 0, 0.11, 0); // pan housing
  add(panPivot, band(0.245, 0.05, 'y'), panLock, 0, 0.22, 0); // pan lock collar

  add(panPivot, roundedBox(0.08, 0.2, 0.14, 0.03), M.trim, 0.18, 0.32, 0); // yoke, right
  add(panPivot, roundedBox(0.08, 0.2, 0.14, 0.03), M.trim, -0.18, 0.32, 0); // yoke, left

  const tiltPivot = new THREE.Group();
  tiltPivot.position.set(0, 0.42, 0);
  panPivot.add(tiltPivot);

  add(tiltPivot, cyl(0.09, 0.28, 'x'), M.motor); // tilt axle
  add(tiltPivot, band(0.1, 0.04, 'x'), tiltLock, 0.14, 0, 0);

  /* --- Pan bar ------------------------------------------------------------
     Rides on panPivot (so it swings with pan the same as the housing it is
     bolted to) but through its own group, panBar, so update() can add a tiny
     independent lag on top of the shared pan rotation — see below. */
  const panBar = new THREE.Group();
  panBar.position.set(0.24, 0.16, -0.02);
  panBar.rotation.y = 2.4; // sweeps the bar back past the operator's shoulder
  panBar.rotation.x = 0.42; // ...and angles it down for a resting grip
  panPivot.add(panBar);
  add(panBar, cyl(0.045, 0.08, 'z'), M.trim, 0, 0, 0); // clamp at the housing
  add(panBar, cyl(0.02, 0.75, 'z'), M.trim, 0, 0, 0.4);
  add(panBar, cyl(0.036, 0.16, 'z'), M.grip, 0, 0, 0.86); // rubber grip end

  /* --- Camera body ---------------------------------------------------------
     Everything below hangs off tiltPivot, which is what makes it all tilt
     together as one rigid payload — exactly what happens on the real thing,
     where the transmitter and mic ride the camera's plate, not the tripod. */
  add(tiltPivot, roundedBox(0.5, 0.08, 0.9, 0.03), M.trim, 0, 0.09, 0.05); // mounting plate

  const BODY_Y = 0.43;
  add(tiltPivot, roundedBox(0.62, 0.6, 1.5, 0.09), M.body, 0, BODY_Y, 0.05);

  /* Top handle: a bar on two posts, offset from the mic bracket in Z so
     neither part has to dodge the other. */
  add(tiltPivot, roundedBox(0.06, 0.14, 0.06, 0.02), M.trim, 0, 0.79, -0.28);
  add(tiltPivot, roundedBox(0.06, 0.14, 0.06, 0.02), M.trim, 0, 0.79, 0.1);
  add(tiltPivot, roundedBox(0.07, 0.06, 0.85, 0.025), M.grip, 0, 0.88, -0.1);

  /* Record tally, front-left of the body. kit.tally's pulse is driven by the
     host every frame — nothing in update() below touches it. */
  add(tiltPivot, cyl(0.032, 0.02, 'z'), tally, -0.2, BODY_Y + 0.12, 0.81);

  /* --- Viewfinder: short arm off the left side, eyecup at the end -------- */
  add(tiltPivot, cyl(0.026, 0.3, 'x'), M.trim, -0.46, BODY_Y + 0.15, 0.32);
  add(tiltPivot, cyl(0.06, 0.14, 'z'), M.body, -0.61, BODY_Y + 0.15, 0.32); // eyepiece housing
  add(tiltPivot, cyl(0.045, 0.02, 'z'), M.screen, -0.61, BODY_Y + 0.15, 0.4); // tiny finder screen
  add(tiltPivot, cyl(0.065, 0.08, 'z'), M.grip, -0.61, BODY_Y + 0.15, 0.2); // eyecup, rear-facing

  /* --- Shotgun mic in a suspension mount ---------------------------------
     The two loops are washers, not tubes to look through — band() is used
     here because a solid cyl cap on a ring this thin would read as a filled
     disc the moment the camera turns, same reasoning as every coloured ring
     in this kit, just applied to an uncoloured one. */
  add(tiltPivot, roundedBox(0.14, 0.05, 0.36, 0.02), M.trim, 0, 0.76, 0.15); // bracket
  add(tiltPivot, cyl(0.05, 0.55, 'z'), M.trim, 0, 0.95, 0.1); // mic tube
  add(tiltPivot, band(0.075, 0.03, 'z'), M.grip, 0, 0.86, -0.02); // suspension loop, rear
  add(tiltPivot, band(0.075, 0.03, 'z'), M.grip, 0, 0.86, 0.22); // suspension loop, front

  /* --- Live-link transmitter box, back of the body -----------------------
     This is the part that says "streaming" instead of "filming" — a stubby
     whip antenna is not something anyone would invent from memory for a
     plain broadcast camera, which is exactly why it is here. */
  add(tiltPivot, roundedBox(0.34, 0.28, 0.18, 0.04), M.body, 0.06, BODY_Y, -0.83);
  add(tiltPivot, cyl(0.014, 0.34, 'y'), M.trim, 0.06, BODY_Y + 0.31, -0.83); // whip antenna
  add(tiltPivot, cyl(0.022, 0.014, 'z'), linkLight, 0.06, BODY_Y + 0.05, -0.735); // status LED

  /* --- Lens -----------------------------------------------------------
     A big zoom, built as a stepped stack rather than one tapered barrel —
     see gimbal.ts for why a smooth taper reads as moulded and a stack reads
     as assembled glass. */
  const LENS_Z0 = 0.8;
  add(tiltPivot, cyl(0.28, 0.08, 'z'), M.trim, 0, BODY_Y, LENS_Z0 + 0.04); // mount
  add(tiltPivot, cyl(0.3, 0.35, 'z'), M.body, 0, BODY_Y, LENS_Z0 + 0.255); // rear barrel
  add(tiltPivot, band(0.315, 0.06, 'z'), lensRing, 0, BODY_Y, LENS_Z0 + 0.46); // THE accent ring
  add(tiltPivot, cyl(0.29, 0.18, 'z'), M.body, 0, BODY_Y, LENS_Z0 + 0.58); // mid barrel
  add(tiltPivot, cyl(0.3, 0.3, 'z', 40), M.grip, 0, BODY_Y, LENS_Z0 + 0.82); // zoom ring, rubber

  // Flared hood: a taper, so it needs the raw tapered-cylinder trick from
  // gimbal.ts rather than kit.band() (band only does constant radius).
  const hoodGeo = new THREE.CylinderGeometry(0.42, 0.32, 0.32, 36, 1, true);
  hoodGeo.rotateX(Math.PI / 2);
  add(tiltPivot, hoodGeo, M.hood, 0, BODY_Y, LENS_Z0 + 1.13);

  // Front element sunk inside the hood so the rim actually casts on it.
  add(tiltPivot, new THREE.CircleGeometry(0.29, 40), M.glass, 0, BODY_Y, LENS_Z0 + 1.02);
  add(tiltPivot, new THREE.RingGeometry(0.29, 0.32, 40), M.trim, 0, BODY_Y, LENS_Z0 + 1.03);

  /** Current eased angles. Held outside the frame — see update(). */
  const state = { pan: 0, tilt: 0, barLag: 0 };

  return {
    group,

    /* The lens points along +Z (same convention as gimbal.ts), so this yaw
       maps it to (sin, 0, cos). Kept steep for the same reason as gimbal's
       lens: near zero the barrel foreshortens into a flat disc. Negative so
       the lens looks into the headline on the left rather than off-page. */
    yaw: -0.78,
    pitch: 0.08,
    scale: 1.15,
    // Geometry spans roughly y = -1.57 (feet) to y = 1.55 (mic tip), a span
    // of ~3.12 — centre is ~-0.01, so lift only needs a hair of correction.
    lift: 0.01,

    update(t, dt) {
      const ease = (cur: number, target: number, k: number) =>
        cur + (target - cur) * Math.min(dt * k, 1);

      /* Targets come from a couple of slow, unrelated sines — same reasoning
         as gimbal's handle sway: matched periods produce a visible repeating
         pattern that reads as a machine, not an operator. Pan gets the wider
         range; tilt stays subtle because a fluid head's tilt travel used to
         "follow action" is small compared to its pan sweep. */
      /* BIASED NEGATIVE, AND THE BIAS IS LOAD-BEARING.

         This pan is not free to sweep wherever it likes. It adds to the
         framing yaw, and the host adds a presentation turn of its own on top
         (+-0.3rad). Centred on zero with the +-0.77 range this first had, the
         three summed to roughly zero often enough that the lens turned to face
         the viewer and foreshortened into a flat disc — the object lost the
         one feature that identifies it, several times a minute.

         Centred on -0.35 with a +-0.3 range, the worst case is
         -0.78 - 0.05 + 0.30 = -0.53rad, which still shows half the barrel's
         length. The head still sweeps; it just sweeps inside the band where
         the camera stays readable. */
      const panTarget = -0.35 + Math.sin(t * 0.11) * 0.22 + Math.sin(t * 0.037 + 2.1) * 0.08;
      const tiltTarget = Math.sin(t * 0.15 + 1.0) * 0.12 + 0.03;

      // Eased rather than driven straight from the sine, so this reads as a
      // hand on a bar catching up to where it wants to be, not a motor
      // tracking a setpoint exactly.
      state.pan = ease(state.pan, panTarget, 1.1);
      state.tilt = ease(state.tilt, tiltTarget, 1.7);
      panPivot.rotation.y = state.pan;
      tiltPivot.rotation.x = state.tilt;

      /* The pan bar lags the housing it's bolted to: eased toward the SAME
         target the housing already reached, but slower, so it trails a beat
         behind. Since panBar is a child of panPivot (which already carries
         state.pan), only the residual needs adding on top of its static rest
         pose — the same trick as gimbal's motor correction, just for flavour
         instead of stabilisation. */
      state.barLag = ease(state.barLag, state.pan, 0.65);
      panBar.rotation.y = 2.4 + (state.barLag - state.pan);
    },
  };
}
