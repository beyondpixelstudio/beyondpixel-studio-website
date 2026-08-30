/**
 * Drone — Drone & Aerial Videography
 *
 * A professional camera quadcopter, in flight, seen from slightly above on a
 * three-quarter. Built as an X-frame (not a plus — a plus reads as a toy),
 * with a small 3-axis gimbal underslung off the nose exactly the way a real
 * aerial rig carries its camera below and ahead of the airframe.
 *
 * WHAT MAKES IT READ AS A DRONE IN FLIGHT is the same trick as the gimbal
 * rig: the body hovers — a slow bob, a gentle bank, a gentle pitch — and the
 * underslung camera fights that motion with a beat of lag, exactly like a
 * real 3-axis gimbal fighting airframe motion. Weld the camera to the body
 * and this becomes a toy on a stick; let it correct with a visible residual
 * and it becomes a camera platform that happens to fly.
 */

import type { Kit, Rig } from './kit';

export default function drone(kit: Kit): Rig {
  const { THREE, roundedBox, cyl, band, accent, add, M, tally, logo } = kit;

  /* Four accents, reused everywhere rather than inventing new ones per part.
     The motor bands run a warm sweep — Ember, Orange, Rose, Magenta — front
     to back, and the gimbal reuses the same four: Magenta at the axis
     closest to the body, warming through Rose and Orange to the Ember ring
     on the lens itself, so the eye is walked from the airframe down to the
     one thing the whole object exists to point at. */
  const cEmber = accent(logo.ember);
  const cOrange = accent(logo.orange);
  const cRose = accent(logo.rose);
  const cMagenta = accent(logo.magenta);

  /* `group` is what ServiceRig turns and parks. `airframe` is what actually
     hovers — everything but the top-level group lives under it, per the
     kit's rule that `update()` must never touch `group` itself. */
  const group = new THREE.Group();
  const airframe = new THREE.Group();
  group.add(airframe);

  // ---------------------------------------------------------------------
  // Fuselage: narrow tail carrying the battery, wide nose up front.
  // ---------------------------------------------------------------------
  add(airframe, roundedBox(0.6, 0.34, 0.7, 0.1), M.body, 0, 0, -0.3); // tail shell
  add(airframe, roundedBox(0.48, 0.2, 0.3, 0.05), M.grip, 0, -0.13, -0.62); // battery, visible aft
  add(airframe, roundedBox(0.7, 0.36, 0.8, 0.13), M.body, 0, 0.02, 0.28); // nose, wider than the tail
  add(airframe, roundedBox(0.32, 0.06, 0.46, 0.02), M.trim, 0, 0.21, 0.06); // top spine plate
  add(airframe, cyl(0.09, 0.06, 'y', 20), M.trim, 0, 0.24, -0.35); // GPS/compass puck

  // Forward obstacle-sensor lenses, a pair either side of the nose.
  for (const sx of [-0.16, 0.16]) {
    add(airframe, cyl(0.045, 0.04, 'z', 16), M.trim, sx, 0.04, 0.66); // housing
    add(airframe, new THREE.CircleGeometry(0.03, 20), M.glass, sx, 0.04, 0.685); // lens, faces +Z with the nose
  }

  // Single nav lamp. Kit's tally material only — ServiceRig drives its pulse.
  add(airframe, cyl(0.035, 0.03, 'z', 16), tally, 0, 0.09, 0.7);

  // Two stubby antennas off the tail, splayed apart.
  for (const sx of [-1, 1]) {
    const rod = add(airframe, roundedBox(0.045, 0.16, 0.045, 0.018), M.trim, sx * 0.11, 0.27, -0.52);
    rod.rotation.z = -sx * 0.22;
  }

  // ---------------------------------------------------------------------
  // Landing legs: two, each a single arched strut plus a rubber foot,
  // splayed down and out — the same idiom as the gimbal's tripod legs.
  // ---------------------------------------------------------------------
  function buildLeg(side: 1 | -1) {
    const leg = new THREE.Group();
    leg.position.set(side * 0.34, -0.15, 0);
    const shaft = add(leg, roundedBox(0.11, 1.3, 0.14, 0.045), M.body, 0, -0.55, 0);
    shaft.rotation.z = -side * 0.48; // arches out and down from the belly
    add(leg, roundedBox(0.2, 0.07, 0.26, 0.025), M.grip, side * 0.5, -1.18, 0); // rubber foot
    return leg;
  }
  airframe.add(buildLeg(-1));
  airframe.add(buildLeg(1));

  // ---------------------------------------------------------------------
  // Arms + motors + props, geometry built once and instanced four times.
  //
  // An X-frame, not a plus: each arm group sits at the fuselage centre and
  // is rotated in Y by its corner's angle before the strut extends along
  // its own local +X, so the four corners come from rotation alone, not
  // four different struts. ±45°/±135° puts the front pair angled forward
  // and the rear pair angled back, which is the whole X silhouette.
  // ---------------------------------------------------------------------
  const armLen = 1.9;
  const armRise = 0.12;
  const bladeLen = 0.5; // tip distance from hub — this is what sets the prop-span width

  const armGeo = roundedBox(armLen, 0.11, 0.15, 0.04);
  const motorGeo = cyl(0.15, 0.22, 'y');
  const motorBandGeo = band(0.155, 0.045, 'y');
  const hubCapGeo = cyl(0.045, 0.05, 'y');
  const bladeGeo = roundedBox(bladeLen, 0.025, 0.1, 0.008);

  type Corner = { angle: number; bandMat: typeof cEmber; spin: 1 | -1 };
  const corners: Corner[] = [
    { angle: -Math.PI / 4, bandMat: cEmber, spin: 1 }, // front-right
    { angle: -(3 * Math.PI) / 4, bandMat: cOrange, spin: -1 }, // front-left
    { angle: Math.PI / 4, bandMat: cMagenta, spin: -1 }, // rear-right
    { angle: (3 * Math.PI) / 4, bandMat: cRose, spin: 1 }, // rear-left
  ];
  // Diagonal pairs (FR+RL, FL+RR) share a spin direction and the two pairs
  // oppose each other — real torque cancellation, not decoration. Rate is
  // picked to read as fast, blur-free rotation rather than a realistic RPM,
  // which would strobe badly at 60fps.
  const PROP_RATE = 15.5; // rad/s, ≈2.5 turns/sec

  const propGroups: InstanceType<typeof THREE.Group>[] = [];
  for (const c of corners) {
    const arm = new THREE.Group();
    arm.position.set(0, 0.07, 0);
    arm.rotation.y = c.angle;
    airframe.add(arm);

    const strut = add(arm, armGeo, M.body, armLen / 2, armRise / 2, 0);
    strut.rotation.z = 0.06; // a slight rise from body to motor, not dead flat

    add(arm, motorGeo, M.motor, armLen, armRise, 0);
    add(arm, motorBandGeo, c.bandMat, armLen, armRise + 0.09, 0);
    add(arm, hubCapGeo, M.trim, armLen, armRise + 0.13, 0);

    const prop = new THREE.Group();
    prop.position.set(armLen, armRise + 0.15, 0);
    add(prop, hubCapGeo, M.trim, 0, 0, 0); // spinning centre nut
    const bladeA = add(prop, bladeGeo, M.grip, bladeLen / 2, 0, 0);
    bladeA.rotation.z = 0.15;
    const bladeB = add(prop, bladeGeo, M.grip, -bladeLen / 2, 0, 0);
    bladeB.rotation.z = -0.15;
    arm.add(prop);

    propGroups.push(prop);
  }
  const [propFR, propFL, propRR, propRL] = propGroups;

  // ---------------------------------------------------------------------
  // Underslung 3-axis gimbal, below and ahead of the nose. Nested groups,
  // the same skeleton as gimbal.ts:
  //
  //   airframe -> yoke -> pan (Y) -> roll (Z) -> tilt (X) -> cam
  //
  // Each stage is a CHILD of the one above it, so driving pan/roll/tilt by
  // the negation of the airframe's own bank and pitch cancels it in the
  // right frame — the whole reason this reads as a stabilised camera
  // instead of a camera bolted to the body.
  // ---------------------------------------------------------------------
  const yoke = new THREE.Group();
  yoke.position.set(0, -0.22, 0.55);
  airframe.add(yoke);
  add(yoke, roundedBox(0.06, 0.14, 0.06, 0.02), M.trim, 0, 0.07, 0); // fixed mount bracket

  const pan = new THREE.Group();
  pan.position.set(0, -0.02, 0);
  yoke.add(pan);
  add(pan, cyl(0.09, 0.1, 'y'), M.motor);
  add(pan, band(0.095, 0.03, 'y'), cMagenta, 0, -0.03, 0);

  const roll = new THREE.Group();
  roll.position.set(0, -0.12, 0);
  pan.add(roll);
  // Yoke fork, two thin arms either side holding the ball.
  for (const sx of [-1, 1]) {
    add(roll, roundedBox(0.03, 0.16, 0.03, 0.012), M.body, sx * 0.11, -0.02, 0);
  }
  add(roll, band(0.1, 0.03, 'z'), cRose, 0, -0.1, 0);

  const tilt = new THREE.Group();
  tilt.position.set(0, -0.1, 0);
  roll.add(tilt);
  add(tilt, band(0.1, 0.03, 'x'), cOrange, 0, 0, 0);

  // The camera itself: a small ball housing with a lens on the front.
  const cam = new THREE.Group();
  tilt.add(cam);
  add(cam, new THREE.SphereGeometry(0.11, 20, 16), M.motor, 0, 0, 0);
  add(cam, cyl(0.06, 0.06, 'z'), M.trim, 0, 0, 0.1); // lens mount
  add(cam, cyl(0.058, 0.05, 'z', 28), M.body, 0, 0, 0.15); // barrel
  add(cam, new THREE.CircleGeometry(0.05, 24), M.glass, 0, 0, 0.185); // front element
  add(cam, band(0.058, 0.02, 'z'), cEmber, 0, 0, 0.185); // the one Ember ring, right at the lens

  // Motors' current correction angles, held outside the frame because the
  // whole point is that they LAG the airframe rather than tracking exactly.
  const corr = { x: 0, z: 0 };

  return {
    group,

    /* Pitch looks DOWN on the rig (positive) so the X-frame and all four
       props read as a frame rather than a flat cross — dead overhead flattens
       it, dead level turns it into an unreadable stick end-on. Yaw is a
       three-quarter turn, negative so the nose (and the underslung gimbal
       hanging off it) points in toward the headline rather than off the
       page, matching the convention the other rigs use. Together this is the
       one angle that shows the X silhouette, the props, and the gimbal all
       at once. */
    yaw: -0.68,
    pitch: 0.4,
    scale: 1,
    /* Lift: hand-walked from the extreme points actually authored above —
       highest is an antenna tip at roughly y=0.35 (0.27 base + 0.16 length,
       tilted), lowest is a landing foot at roughly y=-1.37 (leg root -0.15,
       shaft to -0.55 then rotated, foot pad at -1.18 more). Midpoint of that
       span is about -0.51, so lift raises the whole rig 0.51 to centre it. */
    lift: 0.51,

    update(t, dt) {
      // The hover. Three unrelated periods so the cycle never visibly
      // repeats — matched periods would read as a machine on a turntable.
      const bob = Math.sin(t * 0.42) * 0.05;
      const bank = Math.sin(t * 0.31 + 0.7) * 0.09; // roll, about Z
      const pitchA = Math.sin(t * 0.53 + 2.1) * 0.06; // pitch, about X

      airframe.position.y = bob;
      airframe.rotation.z = bank;
      airframe.rotation.x = pitchA;

      // The gimbal fights the bank and pitch, eased rather than snapped, so
      // the correction has a visible beat instead of welding the camera dead
      // level. Roll gets the faster motor: roll is the axis a viewer reads
      // as "horizon", so it is the one that must not lag long.
      const ease = (cur: number, target: number, k: number) => cur + (target - cur) * Math.min(dt * k, 1);
      corr.z = ease(corr.z, -bank, 5.2);
      corr.x = ease(corr.x, -pitchA, 3.6);
      roll.rotation.z = corr.z;
      tilt.rotation.x = corr.x;
      pan.rotation.y = Math.sin(t * 0.22) * 0.05; // a slow independent scan, not correction

      // Prop spin. Diagonal pairs share a direction; the two pairs oppose,
      // same as a real quad's torque cancellation.
      propFR.rotation.y += PROP_RATE * dt;
      propRL.rotation.y += PROP_RATE * dt;
      propFL.rotation.y -= PROP_RATE * dt;
      propRR.rotation.y -= PROP_RATE * dt;
    },
  };
}
