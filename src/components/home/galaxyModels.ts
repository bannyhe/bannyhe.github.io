import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// One family: every domain shares the same enamel tile, satin rim and recessed
// face. Only the embossed glyph changes, and each glyph's accent is a hue from
// the headline gradient, so the symbols and the type read as one system.
const TILE = 1.86, DEPTH = .34, FACE = 1.5;
const FRONT = DEPTH / 2;

function roundedRect(width: number, height: number, radius: number) {
  const shape = new THREE.Shape(), x = -width / 2, y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}
function sparkleShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, .55);
  shape.bezierCurveTo(.07, .17, .17, .07, .55, 0);
  shape.bezierCurveTo(.17, -.07, .07, -.17, 0, -.55);
  shape.bezierCurveTo(-.07, -.17, -.17, -.07, -.55, 0);
  shape.bezierCurveTo(-.17, .07, -.07, .17, 0, .55);
  return shape;
}
function shieldPoints(scale: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.24);
  shape.bezierCurveTo(.35, 1.04, .70, .96, 1.02, .91);
  shape.bezierCurveTo(1.04, .58, 1.04, .22, .96, -.12);
  shape.bezierCurveTo(.84, -.67, .40, -1.04, 0, -1.28);
  shape.bezierCurveTo(-.40, -1.04, -.84, -.67, -.96, -.12);
  shape.bezierCurveTo(-1.04, .22, -1.04, .58, -1.02, .91);
  shape.bezierCurveTo(-.70, .96, -.35, 1.04, 0, 1.24);
  return shape.getSpacedPoints(120).map(p => p.multiplyScalar(scale));
}

// Soft, pebble-like emboss: generous bevels, no sharp CG edges.
const EMBOSS = { depth: .07, bevelEnabled: true, bevelThickness: .045, bevelSize: .035, bevelSegments: 10, curveSegments: 48, steps: 1 };
const softTube = (curve: THREE.Curve<THREE.Vector3>, radius: number, material: THREE.Material) => {
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, radius, 16, false), material);
  mesh.scale.z = .62;                      // flattened, so it reads as embossed, not as wire
  return mesh;
};
const pebble = (radius: number, material: THREE.Material) => {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 40, 24), material);
  mesh.scale.z = .5;
  return mesh;
};

export function createGalaxyModels() {
  // Satin navy ceramic: a restrained sheen on the body, a soft lacquer on top.
  const enamel = new THREE.MeshPhysicalMaterial({
    color: 0x10264a, roughness: .52, metalness: .06, clearcoat: 1, clearcoatRoughness: .2,
    sheen: .24, sheenColor: new THREE.Color(0x4d6fa8), sheenRoughness: .6,
  });
  const face = new THREE.MeshPhysicalMaterial({ color: 0x0e2142, roughness: .32, metalness: .04, clearcoat: 1, clearcoatRoughness: .08 });
  // A machined edge, not an outline: darker satin metal, hairline thin.
  const rim = new THREE.MeshPhysicalMaterial({ color: 0x93a6bf, metalness: .92, roughness: .32 });
  const accents = [0x8f7dff, 0x5aa6ff, 0x38c9bf];   // AI violet, Network blue, Security teal
  const glyphs = accents.map(accent => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xeef5ff).lerp(new THREE.Color(accent), .12),
    emissive: new THREE.Color(accent), emissiveIntensity: .22,
    roughness: .24, metalness: 0, clearcoat: 1, clearcoatRoughness: .1,
  }));

  const facePlate = new THREE.ExtrudeGeometry(roundedRect(FACE, FACE, .32), { depth: .01, bevelEnabled: true, bevelThickness: .018, bevelSize: .018, bevelSegments: 4, curveSegments: 24 });
  const rimCurve = new THREE.CatmullRomCurve3(
    roundedRect(FACE + .05, FACE + .05, .34).getSpacedPoints(160).slice(0, -1).map(p => new THREE.Vector3(p.x, p.y, 0)), true);
  const rimGeometry = new THREE.TubeGeometry(rimCurve, 240, .02, 12, true);
  const body = new RoundedBoxGeometry(TILE, TILE, DEPTH, 8, .26);

  const tile = (glyph: THREE.Object3D) => {
    const group = new THREE.Group();
    group.add(new THREE.Mesh(body, enamel));
    const plate = new THREE.Mesh(facePlate, face); plate.position.z = FRONT - .012; group.add(plate);
    const edge = new THREE.Mesh(rimGeometry, rim); edge.position.z = FRONT + .004; group.add(edge);
    glyph.position.z = FRONT + .03; group.add(glyph);
    return group;
  };

  // AI — a four-point spark with a smaller companion.
  const ai = new THREE.Group();
  const spark = new THREE.ExtrudeGeometry(sparkleShape(), EMBOSS);
  const main = new THREE.Mesh(spark, glyphs[0]); main.scale.set(.98, .98, 1); main.position.set(-.06, -.06, 0); ai.add(main);
  const small = new THREE.Mesh(spark, glyphs[0]); small.scale.set(.3, .3, .8); small.position.set(.42, .42, 0); ai.add(small);

  // Network — a hub and three peers, linked.
  const network = new THREE.Group();
  network.add(pebble(.2, glyphs[1]));
  [90, 210, 330].forEach(deg => {
    const a = THREE.MathUtils.degToRad(deg), end = new THREE.Vector3(Math.cos(a) * .5, Math.sin(a) * .5, 0);
    network.add(softTube(new THREE.LineCurve3(new THREE.Vector3(), end), .045, glyphs[1]));
    const peer = pebble(.135, glyphs[1]); peer.position.copy(end); network.add(peer);
  });

  // Security — a shield ring with a check inside.
  const security = new THREE.Group();
  const ring = new THREE.Shape(shieldPoints(.56));
  ring.holes.push(new THREE.Path(shieldPoints(.43).reverse()));
  security.add(new THREE.Mesh(new THREE.ExtrudeGeometry(ring, EMBOSS), glyphs[2]));
  const check = new THREE.CurvePath<THREE.Vector3>();
  check.add(new THREE.LineCurve3(new THREE.Vector3(-.2, -.01, 0), new THREE.Vector3(-.06, -.15, 0)));
  check.add(new THREE.LineCurve3(new THREE.Vector3(-.06, -.15, 0), new THREE.Vector3(.21, .16, 0)));
  security.add(softTube(check, .052, glyphs[2]));
  for (const at of [0, 1]) { const cap = pebble(.052, glyphs[2]); cap.scale.z = .62; cap.position.copy(check.getPoint(at)); security.add(cap); }

  const levels = [0, 0, 0];
  let previous = 0;
  return {
    models: [tile(ai), tile(network), tile(security)],
    animate(time: number, active: number, dark: boolean, hovered = -1) {
      // Reduced motion resets time to 0; paused time leaves everything still.
      if (time < previous) levels.fill(0);
      const delta = Math.max(0, Math.min(time - previous, .1));
      previous = time;
      glyphs.forEach((material, index) => {
        const selected = index === active || index === hovered ? 1 : 0;
        levels[index] += (selected - levels[index]) * (1 - Math.exp(-3 * delta));
        // The glyph warms when its domain is in focus, with a slow breath.
        const breath = .5 + .5 * Math.sin(time * 1.1 + index * 1.7);
        material.emissiveIntensity = (dark ? .3 : .2) + levels[index] * (.5 + .18 * breath);
      });
    },
  };
}
