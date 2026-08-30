/**
 * Rig kit — the shared vocabulary every service-hero 3D object is built from.
 *
 * There are six of these objects and they have to look like one family. The
 * only reliable way to get that is for them to share their actual materials,
 * their actual geometry helpers and their actual light, rather than six authors
 * each approximating the same look. So: one kit, built once by ServiceRig, and
 * handed to whichever builder the page asked for.
 *
 * A builder gets the kit, returns a Group and an update function, and knows
 * nothing about the renderer, the canvas, the gates or the page. That is what
 * lets the six live in six files instead of fighting over one.
 */

import type * as THREE_NS from 'three';

/** Which way a cylinder or band lies. Cylinders are authored along Y. */
export type Axis = 'x' | 'y' | 'z';

export interface Kit {
  THREE: typeof THREE_NS;

  /**
   * A rounded box, from an extruded rounded rectangle with a bevel.
   *
   * Nothing in this world has a sharp edge on it. A plain BoxGeometry catches
   * the key light along a hard line that immediately reads as "primitive"
   * rather than "product", and it is the single fastest way to make one of
   * these objects look cheap.
   */
  roundedBox(w: number, h: number, d: number, r: number): THREE_NS.BufferGeometry;

  /** A solid cylinder lying along an arbitrary axis. */
  cyl(r: number, h: number, axis: Axis, seg?: number): THREE_NS.BufferGeometry;

  /**
   * An accent BAND: an open-ended tube, and the open end is the point.
   *
   * Built as an ordinary cylinder these read correctly from the side and
   * catastrophically from the end — a cap is a filled disc, so the moment an
   * axis turns towards the viewer its ring becomes a solid coloured blob the
   * size of the part it sits on. Since these objects turn continuously, that is
   * not an edge case, it is the default view. Dropping the caps leaves a rim
   * that reads as a thin band from every angle.
   *
   * Use this for EVERY coloured ring. Never `cyl` for one.
   */
  band(r: number, h: number, axis: Axis): THREE_NS.BufferGeometry;

  /** An anodised accent material in an arbitrary colour. Lightly self-lit. */
  accent(hex: number): THREE_NS.Material;

  /** Add a mesh to a parent at a position, and hand it back. */
  add(
    parent: THREE_NS.Object3D,
    geo: THREE_NS.BufferGeometry,
    mat: THREE_NS.Material,
    x?: number,
    y?: number,
    z?: number
  ): THREE_NS.Mesh;

  /**
   * The shared palette.
   *
   * THESE ARE NOT THE COLOURS OF REAL EQUIPMENT, AND THAT IS DELIBERATE.
   * Real kit is near-black anodised aluminium. Built that way it is accurate
   * and invisible: a black object on a near-black page has no silhouette, and
   * rim light alone cannot carry it — you can see that something is there
   * without being able to tell what. Every tone is therefore lifted to a
   * graphite the page can hold, carrying the violet cast the elevation tokens
   * already have so it sits in this palette instead of reading as a grey
   * cut-out. Legibility beats accuracy on a page nobody studies from six
   * inches away.
   */
  M: {
    /** Main structural surfaces. */
    body: THREE_NS.Material;
    /** Machined collars, plates, rails — a step brighter than body. */
    trim: THREE_NS.Material;
    /** Motor housings and polished metal — the brightest surface here. */
    motor: THREE_NS.Material;
    /** Rubber: grips, focus rings, feet. Matte, no metal. */
    grip: THREE_NS.Material;
    /** Lens glass ONLY. Carries a faint Ocean coating flare. */
    glass: THREE_NS.Material;
    /** Switched-off screens. Dark on purpose — see below. */
    screen: THREE_NS.Material;
    /** Open-ended tubes (lens hoods, barrels you can see into). DoubleSide. */
    hood: THREE_NS.Material;
  };

  /**
   * The record tally — the one saturated thing allowed on an object.
   *
   * Shared, and its `emissiveIntensity` is driven by ServiceRig every frame so
   * every rig's tally breathes in step. Do not animate it yourself.
   */
  tally: THREE_NS.Material;

  /**
   * The mark's colours, for structural accents.
   *
   * Where these go is not decoration. They belong on details that mean
   * something — the ring that marks an axis, the collar on a motor, the band
   * on a lens. Paint body panels with them and a professional tool becomes a
   * toy; a thin anodised band is what real equipment actually carries.
   *
   * Warm advances and cool recedes, so run them cool at the base of an object
   * and warm towards whatever the viewer is meant to look at.
   */
  logo: {
    ember: number;
    orange: number;
    rose: number;
    magenta: number;
    violet: number;
    indigo: number;
    ocean: number;
  };
}

/** What a builder hands back to ServiceRig. */
export interface Rig {
  /** The object itself. ServiceRig parents this to its own animated root. */
  group: THREE_NS.Group;

  /**
   * Called once per frame while the hero is on screen.
   * `t` is elapsed seconds, `dt` is the frame delta clamped to 0.05.
   *
   * Animate the rig's INTERNALS here — spinning rotors, opening blades, a
   * stabiliser correcting. Do not touch `group.rotation` or `group.position`:
   * ServiceRig owns those for the presentation turn, pointer parallax and
   * scroll recession, and writing them here fights it.
   */
  update(t: number, dt: number): void;

  /**
   * Framing, chosen per object because no two of these compose the same way.
   * `yaw`/`pitch` in radians, `lift` in world units, `scale` a multiplier.
   * The visible frame is about 4.8 world units tall, so an object should span
   * roughly 3.2–3.9 units after `scale` to sit well.
   */
  yaw: number;
  pitch: number;
  scale: number;
  lift: number;
}

export type RigBuilder = (kit: Kit) => Rig;

/** Builds the kit. Called once, by ServiceRig, after three.js has loaded. */
export function makeKit(THREE: typeof THREE_NS): Kit {
  const roundedBox = (w: number, h: number, d: number, r: number) => {
    const bev = Math.min(0.03, d * 0.24);
    const x = w / 2;
    const y = h / 2;
    const s = new THREE.Shape();
    s.moveTo(-x + r, -y);
    s.lineTo(x - r, -y);
    s.quadraticCurveTo(x, -y, x, -y + r);
    s.lineTo(x, y - r);
    s.quadraticCurveTo(x, y, x - r, y);
    s.lineTo(-x + r, y);
    s.quadraticCurveTo(-x, y, -x, y - r);
    s.lineTo(-x, -y + r);
    s.quadraticCurveTo(-x, -y, -x + r, -y);

    const g = new THREE.ExtrudeGeometry(s, {
      depth: Math.max(d - bev * 2, 0.01),
      bevelEnabled: true,
      bevelThickness: bev,
      bevelSize: bev,
      bevelSegments: 2,
      curveSegments: 8,
    });
    g.center();
    return g;
  };

  const orient = (g: THREE_NS.BufferGeometry, axis: Axis) => {
    if (axis === 'x') g.rotateZ(Math.PI / 2);
    if (axis === 'z') g.rotateX(Math.PI / 2);
    return g;
  };

  const cyl = (r: number, h: number, axis: Axis, seg = 32) =>
    orient(new THREE.CylinderGeometry(r, r, h, seg), axis);

  const band = (r: number, h: number, axis: Axis) =>
    orient(new THREE.CylinderGeometry(r, r, h, 40, 1, true), axis);

  const accent = (hex: number) =>
    new THREE.MeshPhysicalMaterial({
      color: hex,
      emissive: hex,
      // Lightly self-lit so it holds its colour when that side turns away from
      // the key. An accent that goes black on the shadow side reads as a
      // rendering fault, not as shadow.
      emissiveIntensity: 0.34,
      roughness: 0.28,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide, // bands are open tubes
    });

  const M = {
    body: new THREE.MeshPhysicalMaterial({
      color: 0x433d52,
      roughness: 0.44,
      metalness: 0.36,
      clearcoat: 0.55,
      clearcoatRoughness: 0.38,
      envMapIntensity: 1.1,
    }),
    trim: new THREE.MeshPhysicalMaterial({
      color: 0x5d5670,
      roughness: 0.3,
      metalness: 0.72,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.35,
    }),
    motor: new THREE.MeshPhysicalMaterial({
      color: 0x6e6786,
      roughness: 0.24,
      metalness: 0.82,
      clearcoat: 0.7,
      clearcoatRoughness: 0.14,
      envMapIntensity: 1.15,
    }),
    grip: new THREE.MeshPhysicalMaterial({
      color: 0x282332,
      roughness: 0.92,
      metalness: 0.02,
      envMapIntensity: 0.4,
    }),
    /* Glass is the one surface allowed a coating flare, and even that is kept
       low: pushed up it stops being a reflection and becomes a lamp, and a
       camera with a glowing eye reads as a prop. Ocean, because a real
       multi-coating flares blue-green. */
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x04080e,
      roughness: 0.05,
      metalness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      emissive: 0x1b6ca8,
      emissiveIntensity: 0.1,
      envMapIntensity: 0.75,
    }),
    /* Screens share no material with the lens on purpose. They were `glass`
       once and lit up the same blue, which put three glowing eyes on one
       object. A dark screen is what an idle screen looks like. */
    screen: new THREE.MeshPhysicalMaterial({
      color: 0x0a0910,
      roughness: 0.12,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 0.55,
    }),
    /* For open-ended tubes. Without DoubleSide the near wall is culled and you
       see straight through the object. */
    hood: new THREE.MeshPhysicalMaterial({
      color: 0x39334a,
      roughness: 0.66,
      metalness: 0.18,
      side: THREE.DoubleSide,
      envMapIntensity: 0.7,
    }),
  };

  const tally = new THREE.MeshPhysicalMaterial({
    color: 0xc7431e,
    emissive: 0xf2704a,
    emissiveIntensity: 1.4,
    roughness: 0.35,
    metalness: 0.1,
  });

  const add: Kit['add'] = (parent, geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };

  return {
    THREE,
    roundedBox,
    cyl,
    band,
    accent,
    add,
    M,
    tally,
    /* Sampled left to right off the supplied logo artwork — the same sweep
       LotusBloom runs round the petals on the homepage. */
    logo: {
      ember: 0xc7431e,
      orange: 0xf0863c,
      rose: 0xc4485f,
      magenta: 0x9b2fc0,
      violet: 0x5b2ac0,
      indigo: 0x2e3a9e,
      ocean: 0x1b6ca8,
    },
  };
}
