/**
 * Neural — AI Video Production
 *
 * A cine camera that assembles itself out of a point cloud, holds long enough
 * to be read, then disperses and reforms.
 *
 * This is the one abstract object in the set, and that is deliberate: the other
 * five are real equipment, and AI video is not a piece of equipment. It is also
 * why there is no brain, no robot, no circuit-board texture and no glowing cube
 * anywhere in here — those are the four things this subject is always drawn as,
 * and all four say "we could not think of anything".
 *
 * WHAT IT IS ACTUALLY SAYING. The camera is the same object the other pages
 * carry; here it is being computed rather than held. The form resolves out of
 * nothing, holds, and lets go. That is the honest description of the service,
 * and it needed no icon to say it.
 *
 * -------------------------------------------------------------------------
 * HOW IT IS BUILT
 *
 * Two objects, not hundreds: one `Points` and one `LineSegments`, sharing one
 * position buffer that is rewritten each frame. A mesh per point would be a
 * few hundred draw calls for something that must stay cheaper than the solid
 * rigs, not dearer.
 *
 * The target positions are sampled off the SURFACES of primitives that
 * together describe a camera's silhouette — a box shell for the body, a tube
 * for the lens, a rectangle for the matte box, and so on. Sampling surfaces
 * rather than volumes matters: a filled volume renders as a fog with a vague
 * outline, and the outline is the entire point.
 *
 * The link pairs are computed ONCE, against the assembled positions, and then
 * only their endpoints move. Nearest-neighbour search per frame would be
 * O(n^2) sixty times a second for a result that never changes — the links
 * belong to the assembled form, so they are a property of it, not of the
 * animation.
 *
 * The scatter is seeded deterministically. An unseeded scatter is different on
 * every reload, which sounds harmless until the object has to be judged: two
 * screenshots of the same code would not be comparable.
 */

import type { Kit, Rig } from './kit';

export default function neural(kit: Kit): Rig {
  const { THREE, logo } = kit;
  const group = new THREE.Group();

  /* Deterministic PRNG — see the header. Mulberry32: small, fast, good enough
     for scattering points, and it is not doing cryptography. */
  let seed = 0x9e3779b9;
  const rnd = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };

  /* ---- The target form ---------------------------------------------------
     Sampled on SURFACES. The lens runs along +Z, matching every other rig in
     the set, so the framing yaw below reads the same way theirs do. */
  const target: number[] = [];

  /** Points scattered over the six faces of a box, weighted by face area so a
      long thin box does not end up with dense caps and a sparse middle. */
  const boxShell = (
    cx: number, cy: number, cz: number,
    w: number, h: number, d: number,
    n: number
  ) => {
    const areas = [w * h, w * h, w * d, w * d, h * d, h * d];
    const total = areas.reduce((a, b) => a + b, 0);
    for (let i = 0; i < n; i++) {
      let r = rnd() * total;
      let f = 0;
      while (r > areas[f] && f < 5) r -= areas[f++];
      const u = rnd() - 0.5;
      const v = rnd() - 0.5;
      const p =
        f < 2
          ? [u * w, v * h, (f === 0 ? 0.5 : -0.5) * d]
          : f < 4
            ? [u * w, (f === 2 ? 0.5 : -0.5) * h, v * d]
            : [(f === 4 ? 0.5 : -0.5) * w, u * h, v * d];
      target.push(cx + p[0], cy + p[1], cz + p[2]);
    }
  };

  /** Points on the wall of a tube running along Z. Open-ended: a capped tube
      fills the lens mouth with points and the barrel stops reading as hollow. */
  const tubeShell = (cx: number, cy: number, z0: number, z1: number, r: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2;
      target.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z0 + rnd() * (z1 - z0));
    }
  };

  /** A flat ring, for the front element's rim and the matte box's mouth. */
  const ringPts = (cz: number, r0: number, r1: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2;
      const r = r0 + rnd() * (r1 - r0);
      target.push(Math.cos(a) * r, Math.sin(a) * r, cz);
    }
  };

  boxShell(0, 0, 0, 1.5, 0.9, 0.86, 170); // body
  boxShell(0, 0.62, -0.05, 1.12, 0.16, 0.3, 54); // top handle
  boxShell(0, 0.44, -0.05, 0.1, 0.2, 0.1, 10); // handle post, front
  boxShell(0, 0.44, -0.05, 0.1, 0.2, 0.1, 10); // handle post, rear
  tubeShell(0, 0, 0.43, 1.34, 0.33, 96); // lens barrel
  ringPts(1.36, 0.2, 0.34, 34); // front element rim
  boxShell(0, 0, 1.52, 0.86, 0.86, 0.12, 62); // matte box
  boxShell(-0.86, 0.18, -0.1, 0.06, 0.42, 0.54, 40); // side monitor

  const N = target.length / 3;

  /* ---- Scatter, links, colour, delays ------------------------------------ */

  const scatter = new Float32Array(N * 3);
  const delay = new Float32Array(N);
  const colors = new Float32Array(N * 3);
  const live = new Float32Array(N * 3); // the buffer actually drawn

  /* The mark's sweep, read along the object's own length. Sampling by Z rather
     than at random means the colour belongs to the FORM — the run only becomes
     visible as the camera assembles, and dissolves with it. A random
     assignment would look identical scattered and assembled, which would waste
     the one moment this object has. */
  const RAMP = [logo.ember, logo.orange, logo.rose, logo.magenta, logo.violet, logo.indigo, logo.ocean].map(
    (h) => new THREE.Color(h)
  );
  const rampAt = (u: number) => {
    const x = Math.min(Math.max(u, 0), 1) * (RAMP.length - 1);
    const i = Math.min(Math.floor(x), RAMP.length - 2);
    return RAMP[i].clone().lerp(RAMP[i + 1], x - i);
  };

  const SCATTER_R = 1.9;
  for (let i = 0; i < N; i++) {
    // Scatter on a shell, not through a ball: a solid ball of points is dense
    // in the middle and reads as a blob with a halo. A shell reads as a cloud.
    const th = rnd() * Math.PI * 2;
    const ph = Math.acos(2 * rnd() - 1);
    const r = SCATTER_R * (0.55 + rnd() * 0.45);
    scatter[i * 3] = Math.sin(ph) * Math.cos(th) * r;
    scatter[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * r * 0.7;
    scatter[i * 3 + 2] = Math.cos(ph) * r;

    delay[i] = rnd() * 0.34;

    const c = rampAt((target[i * 3 + 2] + 0.5) / 2.2);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  /* Links, computed once against the ASSEMBLED positions. Capped at two per
     point and deduped by ordered pair, which keeps the count near N rather
     than near N^2 — an uncapped radius search on a dense body face produces a
     solid sheet of lines and the form disappears inside it. */
  const LINK_R2 = 0.3 * 0.3;
  const pairs: number[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < N; i++) {
    let found = 0;
    for (let j = i + 1; j < N && found < 2; j++) {
      const dx = target[i * 3] - target[j * 3];
      const dy = target[i * 3 + 1] - target[j * 3 + 1];
      const dz = target[i * 3 + 2] - target[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz > LINK_R2) continue;
      const k = i * N + j;
      if (seen.has(k)) continue;
      seen.add(k);
      pairs.push(i, j);
      found++;
    }
  }
  const L = pairs.length / 2;

  /* ---- Objects ----------------------------------------------------------- */

  /* Points render as squares by default, and a field of squares reads as
     pixels rather than as a cloud. A 32px radial alpha ramp is the cheapest
     way to make them round and soft-edged. */
  const dotC = document.createElement('canvas');
  dotC.width = dotC.height = 32;
  const dctx = dotC.getContext('2d')!;
  const dg = dctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  dg.addColorStop(0, 'rgba(255,255,255,1)');
  dg.addColorStop(0.4, 'rgba(255,255,255,.75)');
  dg.addColorStop(1, 'rgba(255,255,255,0)');
  dctx.fillStyle = dg;
  dctx.fillRect(0, 0, 32, 32);
  const dot = new THREE.CanvasTexture(dotC);

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(live, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.115,
    map: dot,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    // Additive would bloom every overlap into white and the colour run would
    // be lost exactly where the points are densest — which is on the form.
    blending: THREE.NormalBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  group.add(new THREE.Points(pGeo, pMat));

  const lPos = new Float32Array(L * 6);
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  /* One colour for the lines, not the ramp. Coloured links turn the object
     into noise: the eye reads a rainbow web as texture and stops seeing the
     shape underneath. A single dim wire lets the points carry the colour. */
  const lMat = new THREE.LineBasicMaterial({
    color: 0x9b7fd0,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  group.add(new THREE.LineSegments(lGeo, lMat));

  /* ---- Cycle -------------------------------------------------------------
     Assemble, HOLD, disperse. The hold is not padding — it is the only window
     in which the object is legible, and without it the camera flickers past
     and the viewer never resolves what they saw. */
  const CYCLE = 9;
  const IN_END = 0.28;
  const HOLD_END = 0.66;
  /* IT NEVER FULLY DISPERSES, and that is a fix rather than a compromise.

     Running the morph to zero left the hero genuinely empty for about a third
     of every cycle — a visitor arriving at the wrong moment saw a blank right
     column and no reason to think anything was there. Flooring the morph keeps
     a loose cloud in the frame at all times: the form still clearly gathers and
     lets go, but the object never stops existing. */
  const FLOOR = 0.2;
  const smooth = (x: number) => x * x * (3 - 2 * x);

  return {
    group,

    /* Steep, for the same reason as every other rig here: the lens runs along
       +Z, and near zero yaw the barrel foreshortens into a disc and the form
       stops reading as a camera at the one moment it is supposed to. Negative
       so it faces the headline. */
    yaw: -0.85,
    pitch: 0.06,
    /* Longest axis is Z: the body's back face at -0.43 to the matte box front
       at 1.58, about 2.0 units. 1.5x puts that at ~3.0, the bottom of the
       target band — the scattered cloud is much larger than the assembled form
       and would crowd the hero if the form itself were sized to the top of it. */
    scale: 1.5,
    /* Assembled extent in Y is -0.45 (body base) to 0.70 (handle top), midpoint
       0.125. Lift cancels it at scale so the CAMERA sits centred, not the
       cloud. */
    lift: -1.5 * 0.125,

    update(t) {
      const ph = (t % CYCLE) / CYCLE;
      const raw =
        ph < IN_END
          ? ph / IN_END
          : ph < HOLD_END
            ? 1
            : 1 - (ph - HOLD_END) / (1 - HOLD_END);
      const g = FLOOR + raw * (1 - FLOOR);

      let assembled = 0;
      for (let i = 0; i < N; i++) {
        // Per-point delay staggers arrival so the form resolves progressively
        // rather than snapping into place all at once.
        const u = smooth(Math.min(Math.max((g - delay[i]) / (1 - 0.34), 0), 1));
        assembled += u;
        const o = i * 3;
        // A slow drift on the scatter end only, so the cloud is never static
        // between cycles while the assembled form stays exact.
        const dz = Math.sin(t * 0.23 + i) * 0.12 * (1 - u);
        live[o] = scatter[o] + (target[o] - scatter[o]) * u;
        live[o + 1] = scatter[o + 1] + (target[o + 1] - scatter[o + 1]) * u + dz;
        live[o + 2] = scatter[o + 2] + (target[o + 2] - scatter[o + 2]) * u;
      }
      pGeo.attributes.position.needsUpdate = true;

      for (let k = 0; k < L; k++) {
        const a = pairs[k * 2] * 3;
        const b = pairs[k * 2 + 1] * 3;
        const o = k * 6;
        lPos[o] = live[a];
        lPos[o + 1] = live[a + 1];
        lPos[o + 2] = live[a + 2];
        lPos[o + 3] = live[b];
        lPos[o + 4] = live[b + 1];
        lPos[o + 5] = live[b + 2];
      }
      lGeo.attributes.position.needsUpdate = true;

      /* Links fade in only near full assembly, and on a steep curve. Faded
         linearly they are visible while the points are still spread out, and
         what you see is a tangle of long wires between unrelated points — the
         links only mean anything once their endpoints are neighbours. */
      const a = assembled / N;
      /* 0.42 put more ink in the wires than in the points, and the assembled
         camera read as a tangle rather than as a form with structure. The
         points carry the shape; the links only have to imply that they are
         related. */
      lMat.opacity = Math.pow(Math.max(a - 0.55, 0) / 0.45, 2) * 0.24;
    },
  };
}
