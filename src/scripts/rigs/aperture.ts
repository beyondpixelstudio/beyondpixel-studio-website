/**
 * Aperture — Commercial Photography & Videography
 *
 * A fast prime lens on a small machined stand, presented on its own rather
 * than mounted to a body. This is the hero object for the photography page,
 * and it exists to do ONE thing the other five rigs don't: show a working
 * iris. Everything else on the object — the stepped barrel, the rings, the
 * hood — is staging for the nine blades breathing at its heart.
 *
 * HOW THE IRIS WORKS. A real diaphragm is not a shutter that scales; it is a
 * ring of overlapping blades, each pivoting about a point near the rim, all
 * driven by one shared angle (physically, a pin riding in a slotted retaining
 * ring). This rebuilds that mechanism rather than faking it with a scale
 * tween:
 *
 *   irisGroup
 *    pivot_0 (positioned on the rim circle, base rotation aims it inward)
 *     blade mesh (an extruded kite: a flat outer chord, a curved point)
 *    pivot_1 ... pivot_8
 *
 * Each pivot sits at a fixed point on a circle of radius IRIS_RP. Its OWN
 * rotation is `base_i + irisAngle`, where `base_i` just orients the blade so
 * its tip points at the centre, and `irisAngle` is the one shared value that
 * actually drives the mechanism. At irisAngle 0 every tip swings to its
 * closest approach to the centre — a small ring of blade tips, i.e. a
 * polygon. As irisAngle grows each tip swings tangentially away from the
 * radial line, which INCREASES its distance from the centre (rotating a
 * point off a line through the centre can only move it further from that
 * centre), so the opening grows and, because nine overlapping chords
 * approximate a circle far better than they approximate a nonagon, it reads
 * as round. This is why a single float opens all nine blades in step.
 */

import type { Kit, Rig } from './kit';

export default function aperture(kit: Kit): Rig {
  const { THREE, roundedBox, cyl, band, accent, add, M, logo } = kit;

  const group = new THREE.Group();

  /* --- Stand -------------------------------------------------------------
     A lens on a shelf rests on something; without this the barrel reads as
     floating in front of the camera rather than as a physical object at
     rest. Two machined posts, not a cradle — a cradle would need to wrap the
     barrel and either clip through it or need a boolean cut we don't have.
     Posts read as "resting on" just as well and cost two meshes instead of a
     custom profile. */
  add(group, roundedBox(0.55, 0.18, 1.1, 0.05), M.trim, 0, -0.94, -0.25);
  add(group, roundedBox(0.14, 0.33, 0.14, 0.05), M.motor, 0, -0.685, -0.65);
  add(group, roundedBox(0.14, 0.32, 0.14, 0.05), M.motor, 0, -0.69, 0.15);

  /* --- Rear mount + bayonet lugs ------------------------------------- */
  add(group, cyl(0.58, 0.14, 'z', 40), M.trim, 0, 0, -0.98);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const lug = add(group, roundedBox(0.18, 0.06, 0.14, 0.02), M.trim, Math.cos(a) * 0.6, Math.sin(a) * 0.6, -0.98);
    lug.rotation.z = a;
  }
  // Cool base ring: the mark's colours run cool-to-warm from mount to hood,
  // same logic gimbal uses, so the eye is drawn forward along the barrel.
  add(group, band(0.585, 0.05, 'z'), accent(logo.ocean), 0, 0, -0.9);

  /* --- Rear barrel --------------------------------------------------- */
  add(group, cyl(0.52, 0.46, 'z', 40), M.body, 0, 0, -0.65);

  /* --- Focus ring: rubber, ribbed, and the one part that twists ------
     Lives in its own group purely so `update` can give it the small
     counter-twist without touching anything else. More radial segments than
     a structural cylinder needs, because a facetted rubber ring under a
     grazing key light shows every facet as a flat. */
  const focusRing = new THREE.Group();
  focusRing.position.z = -0.2;
  group.add(focusRing);
  add(focusRing, cyl(0.55, 0.34, 'z', 56), M.grip);
  const RIB_N = 14;
  for (let i = 0; i < RIB_N; i++) {
    const a = (i / RIB_N) * Math.PI * 2;
    const rib = add(
      focusRing,
      roundedBox(0.05, 0.035, 0.29, 0.012),
      M.grip,
      Math.cos(a) * 0.5675,
      Math.sin(a) * 0.5675,
      0
    );
    rib.rotation.z = a;
  }

  /* THE MARQUE. On a real fast prime this is the manufacturer's badge ring —
     the single highest-contrast detail on the barrel. Ours is Ember, the
     site's own persuasive colour, so the one thing that badge draws the eye
     to is our brand rather than someone else's. No lettering is modelled
     anywhere on the object for the same reason. */
  add(group, band(0.565, 0.055, 'z'), accent(logo.ember), 0, 0, 0);

  /* --- Distance-scale ring, with hash ticks ---------------------------- */
  add(group, cyl(0.53, 0.22, 'z', 40), M.trim, 0, 0, 0.15);
  const TICK_N = 8;
  for (let i = 0; i < TICK_N; i++) {
    const a = (i / TICK_N) * Math.PI * 2;
    const tick = add(
      group,
      roundedBox(0.035, 0.05, 0.04, 0.01),
      accent(logo.magenta),
      Math.cos(a) * 0.555,
      Math.sin(a) * 0.555,
      0.15
    );
    tick.rotation.z = a;
  }
  add(group, band(0.545, 0.045, 'z'), accent(logo.violet), 0, 0, 0.29);

  /* --- Front barrel + petal hood --------------------------------------- */
  add(group, cyl(0.56, 0.42, 'z', 40), M.body, 0, 0, 0.5);
  // Open-ended, flaring forward — see it into, never see it capped.
  const hoodGeo = new THREE.CylinderGeometry(0.72, 0.56, 0.44, 44, 1, true);
  hoodGeo.rotateX(Math.PI / 2);
  add(group, hoodGeo, M.hood, 0, 0, 0.93);

  /* --- The iris ----------------------------------------------------------
     Sits well inside the hood's open throat (hood spans z 0.71–1.15; the
     bore there is already ~0.72 in radius, comfortably past the blades'
     ~0.68 max reach) so nothing about the solid front barrel has to be cut
     away to see it. */
  const IRIS_N = 9;
  const IRIS_RP = 0.4; // pivot circle radius
  const TIP_LEN = 0.3; // how far each blade's tip reaches past its pivot

  // Behind the blades: a disc that reads as a HOLE, not a window through to
  // whatever sits behind the object. `M.screen` is the kit's one material
  // built to look switched off, which is exactly the job here — the kit has
  // no unlit material, so this is the closest honest fit.
  add(group, new THREE.CircleGeometry(0.5, 40), M.screen, 0, 0, 0.9);

  /* Blade shape, authored in the PIVOT's own local frame: local origin
     (0,0) is the pivot point itself, +Y is "outward, toward the rim". A flat
     chord facing the rim, and two curves sweeping down to a point facing the
     centre — a kite, not a wedge, which is what lets neighbours overlap
     instead of tiling edge-to-edge. Built once and shared by all nine
     meshes; only the pivot transform differs per blade. */
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(-0.2, 0.1);
  bladeShape.quadraticCurveTo(-0.28, -0.12, 0, -TIP_LEN);
  bladeShape.quadraticCurveTo(0.28, -0.12, 0.2, 0.1);
  bladeShape.lineTo(-0.2, 0.1);
  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.008,
    bevelSegments: 1,
    curveSegments: 10,
  });
  bladeGeo.translate(0, 0, -0.0175); // centre the thickness only — NOT .center(),
  // which would recentre X/Y onto the shape's centroid and drag the pivot
  // origin away from (0,0), breaking the whole mechanism above.

  // A cool-to-warm-ish sweep round the ring, not the full seven-colour mark
  // — LotusBloom's shutter runs a similar restrained run, and this is the
  // one place on the object that sweep is licensed to happen.
  const bladeCols = [logo.violet, logo.indigo, logo.ocean, logo.rose, logo.magenta];

  /* BLADES ARE BLACKENED STEEL, NOT COLOURED PLASTIC.

     Built with `accent()` first, and it failed on sight: `accent` is a
     saturated, self-lit anodised band material, and nine of them fanned out at
     this size stopped being a lens and became a rainbow pinwheel. It is the
     right material for a thin ring on a barrel and completely wrong for a
     surface with real area.

     A real iris blade is blackened metal that picks up a faint coloured sheen
     off whatever the lens is pointed at. So: a dark graphite base, high
     metalness, and the mark's colour carried only as a low emissive tint. The
     sweep round the ring survives; the toy does not. */
  const bladeMat = (hex: number) =>
    new THREE.MeshPhysicalMaterial({
      color: 0x2b2735,
      emissive: hex,
      emissiveIntensity: 0.14,
      roughness: 0.34,
      metalness: 0.78,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.2,
      // Extruded caps come out with winding opposed to their normals, so with
      // FrontSide the front cap is culled and the blade renders black.
      side: THREE.DoubleSide,
    });

  const irisGroup = new THREE.Group();
  irisGroup.position.z = 0.95;
  group.add(irisGroup);

  const bladeBase: number[] = [];
  const bladePivots = Array.from({ length: IRIS_N }, (_, i) => {
    const a = (i / IRIS_N) * Math.PI * 2;
    // Rotating a group by (a - PI/2) makes its local +Y axis point radially
    // outward at angle `a` — so pivot.position sits on the rim circle, and a
    // blade authored with +Y = "outward" needs no further orientation.
    const base = a - Math.PI / 2;
    bladeBase.push(base);
    const pivot = new THREE.Group();
    pivot.position.set(Math.cos(a) * IRIS_RP, Math.sin(a) * IRIS_RP, 0);
    pivot.rotation.z = base;
    add(pivot, bladeGeo, bladeMat(bladeCols[i % bladeCols.length]));
    irisGroup.add(pivot);
    return pivot;
  });

  // Front glass, in front of the blades and sunk inside the hood — smaller
  // in radius than the iris's outer reach (0.4 vs ~0.68) so the blade ring
  // shows around it rather than being hidden behind an opaque disc, which is
  // the one thing this object cannot afford: M.glass is opaque, not a real
  // refractive surface, so anything directly behind its full radius would
  // simply vanish.
  add(group, new THREE.CircleGeometry(0.4, 44), M.glass, 0, 0, 1.08);
  add(group, new THREE.RingGeometry(0.4, 0.44, 44), M.trim, 0, 0, 1.085);

  return {
    group,

    /* Local Y spans plinth-bottom (-1.03) to the hood's widest point
       (+0.85) — centre -0.09, half-span 0.94. Local Z spans the mount's
       rear face (-1.05) to the hood's front rim (+1.15) — 2.2 total, the
       object's real long axis.

       Scale is chosen off the Z length, not the Y height: this is a tube,
       and the yaw below is chosen specifically to show that length, so
       length is what has to land in frame. 2.2 * 1.65 = 3.63, mid-range.
       Height comes along for the ride at 1.88 * 1.65 = 3.10 — a touch under
       3.2, and left there rather than scaled further, since forcing height
       to 3.2 would push the length past 3.9. */
    scale: 1.24,
    lift: -1.24 * -0.09, // = 0.1116 — recentre the local -0.09 midpoint at scale

    /* A THIRD OF A RIGHT ANGLE, roughly. Square-on (yaw 0) the barrel
       foreshortens to a flat ringed disc and the iris is the only thing
       legible — which sounds right for an object about an iris, but it also
       flattens the stepped-barrel silhouette to nothing and the whole piece
       reads as a coin. Steep (gimbal's -0.82) swings the barrel edge-on and
       the opening disappears into an ellipse too thin to read. -0.5 keeps
       the bore close enough to face-on that all nine blades and the hole
       between them stay legible, while still showing the barrel has depth.
       Negative for the same reason as gimbal: it aims the lens into the
       page rather than off its right edge. */
    yaw: -0.9,
    pitch: 0.08,

    update(t) {
      /* Ease a triangle wave through smoothstep rather than driving irisAngle
         with a raw sine: a sine's velocity is highest exactly at the middle
         of the stroke and zero at the extremes, which looks fluid but never
         actually holds fully open or fully closed — it's always mid-move.
         A smoothstepped triangle spends real time sitting near both ends. */
      const HALF = 5.5; // seconds per stroke — open and close both readable
      const phase = (t % (HALF * 2)) / HALF; // 0..2
      const tri = phase <= 1 ? phase : 2 - phase; // 0..1..0
      const eased = tri * tri * (3 - 2 * tri);
      const irisAngle = eased * 1.1; // 0 (closed, r≈0.12) .. 1.1 (open, r≈0.43)

      for (let i = 0; i < IRIS_N; i++) {
        bladePivots[i].rotation.z = bladeBase[i] + irisAngle;
      }

      // The ring twists a few degrees against the iris's motion — a focus
      // pull happening in counterpoint to the aperture racking, the way a
      // photographer's two hands move independently on the same lens.
      focusRing.rotation.z = (0.5 - eased) * 0.2;
    },
  };
}
