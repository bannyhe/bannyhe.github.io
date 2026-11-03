import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

function roundedBox(w: number, h: number, depth: number, radius: number, material: THREE.Material) {
  return new THREE.Mesh(new RoundedBoxGeometry(w, h, depth, 5, radius), material);
}
function sparkleShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, .55);
  shape.bezierCurveTo(.08, .18, .18, .08, .55, 0);
  shape.bezierCurveTo(.18, -.08, .08, -.18, 0, -.55);
  shape.bezierCurveTo(-.08, -.18, -.18, -.08, -.55, 0);
  shape.bezierCurveTo(-.18, .08, -.08, .18, 0, .55);
  return shape;
}
function shieldShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.24);
  shape.bezierCurveTo(.35, 1.04, .70, .96, 1.02, .91);
  shape.bezierCurveTo(1.04, .58, 1.04, .22, .96, -.12);
  shape.bezierCurveTo(.84, -.67, .40, -1.04, 0, -1.28);
  shape.bezierCurveTo(-.40, -1.04, -.84, -.67, -.96, -.12);
  shape.bezierCurveTo(-1.04, .22, -1.04, .58, -1.02, .91);
  shape.bezierCurveTo(-.70, .96, -.35, 1.04, 0, 1.24);
  return shape;
}
// Shared vertices create a continuous domed surface and soft, rolling highlights.
function cushion(shape: THREE.Shape, halfDepth: number, material: THREE.Material) {
  const contour = shape.getSpacedPoints(96).slice(0, -1);
  const count = contour.length, rings = 28;
  const positions: number[] = [0, 0, halfDepth];
  const indices: number[] = [];
  for (let row = 1; row < rings; row++) {
    const angle = row / rings * Math.PI;
    const radius = Math.sin(angle), edgeBlend = Math.pow(radius, 8);
    contour.forEach(p => {
      // Keep the middle elliptical; introduce the shield contour near the rim.
      // This avoids radial creases running from the shield's point to its center.
      const ellipse = 1 / Math.hypot(p.x / 1.04, p.y / 1.28);
      const scale = radius * (ellipse + (1 - ellipse) * edgeBlend);
      positions.push(p.x * scale, p.y * scale, halfDepth * Math.cos(angle));
    });
  }
  const back = positions.length / 3;
  positions.push(0, 0, -halfDepth);
  for (let col = 0; col < count; col++) {
    const next = (col + 1) % count;
    indices.push(0, 1 + next, 1 + col);
    for (let row = 0; row < rings - 2; row++) {
      const a = 1 + row * count + col, b = 1 + row * count + next;
      indices.push(a, b, a + count, b, b + count, a + count);
    }
    const last = 1 + (rings - 2) * count;
    indices.push(last + col, last + next, back);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, material);
}

export function createGalaxyModels() {
  // Satin and matte finishes, so light rolls across each form instead of
  // glinting off it. Metals are brushed, not polished; lacquer is soft, not
  // wet; colours are dusted with a sheen. A thin film on the accents gives a
  // quiet shift of hue at grazing angles rather than a highlight.
  type Finish = { color: number; metalness: number; roughness: number; sheen?: number; sheenColor?: number; coat?: number };
  const finish = ({ color, metalness, roughness, sheen = 0, sheenColor = 0xffffff, coat = 0 }: Finish) =>
    new THREE.MeshPhysicalMaterial({
      color, metalness, roughness,
      sheen, sheenColor: new THREE.Color(sheenColor), sheenRoughness: .55,
      clearcoat: coat, clearcoatRoughness: .35,
    });
  const titanium = finish({ color: 0xa9b6c6, metalness: .6, roughness: .42 });                     // brushed pewter
  const porcelain = finish({ color: 0xeef2f7, metalness: 0, roughness: .58, sheen: .35, sheenColor: 0xd5e4ff, coat: .2 }); // bisque
  const midnight = finish({ color: 0x0d244a, metalness: .08, roughness: .45, sheen: .12, sheenColor: 0x6587c4, coat: .35 }); // soft-touch navy
  const edge = finish({ color: 0x223a5a, metalness: .42, roughness: .48 });                            // anodised
  const enamel = finish({ color: 0x255891, metalness: .04, roughness: .42, sheen: .2, sheenColor: 0xa6c8ff, coat: .3 }); // matte cobalt
  const filament = finish({ color: 0x86a3c2, metalness: .38, roughness: .44 });                       // satin wire
  const light = new THREE.MeshPhysicalMaterial({
    color: 0xe3f2ff, emissive: 0x5aa2e2, emissiveIntensity: .24, metalness: 0, roughness: .34,
    iridescence: .55, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 420],
  });

  const ai = new THREE.Group();
  ai.add(roundedBox(1.94, 1.94, .38, .17, edge));
  const rim = roundedBox(1.96, 1.96, .25, .12, titanium); rim.position.z = .13; ai.add(rim);
  const face = roundedBox(1.66, 1.66, .20, .10, midnight); face.position.z = .27; ai.add(face);
  const glyphGeometry = new THREE.ExtrudeGeometry(sparkleShape(), { depth: .055, bevelEnabled: true, bevelSegments: 8, bevelSize: .022, bevelThickness: .025, curveSegments: 32, steps: 1 });
  const glyph = new THREE.Mesh(glyphGeometry, porcelain); glyph.position.z = .39; glyph.scale.setScalar(.86); ai.add(glyph);
  const glint = new THREE.Mesh(glyphGeometry, light); glint.position.set(.43, .43, .39); glint.scale.setScalar(.23); ai.add(glint);
  const pinGeometry = new RoundedBoxGeometry(.105, .28, .12, 3, .035);
  const pins = new THREE.InstancedMesh(pinGeometry, titanium, 24);
  const pinPose = new THREE.Object3D(), pinAxis = new THREE.Vector3(0, 0, 1);
  for (let side = 0; side < 4; side++) {
    for (let index = 0; index < 6; index++) {
      pinPose.position.set((index - 2.5) * .265, 1.01, -.015).applyAxisAngle(pinAxis, side * Math.PI / 2);
      pinPose.rotation.z = side * Math.PI / 2; pinPose.updateMatrix();
      pins.setMatrixAt(side * 6 + index, pinPose.matrix);
    }
  }
  pins.instanceMatrix.needsUpdate = true; ai.add(pins);

  const network = new THREE.Group();
  network.add(roundedBox(1.2, .86, .58, .2, titanium));
  const hubFace = roundedBox(.97, .62, .14, .07, midnight); hubFace.position.z = .29; network.add(hubFace);
  const terminalGeometry = new THREE.SphereGeometry(.072, 20, 12);
  const portGeometry = new RoundedBoxGeometry(.16, .16, .03, 3, .015);
  for (const x of [-.26, 0, .26]) {
    const port = new THREE.Mesh(portGeometry, titanium); port.position.set(x, -.05, .37); network.add(port);
  }
  const status = roundedBox(.48, .025, .018, .009, light); status.position.set(0, .17, .37); network.add(status);
  const endpoints = [new THREE.Vector3(-1.03, .89, -.08), new THREE.Vector3(1.02, .87, -.2), new THREE.Vector3(-1.04, -.88, .12), new THREE.Vector3(1.03, -.88, .05)];
  const nodeGeometry = new THREE.SphereGeometry(.235, 32, 24);
  const curves: THREE.CubicBezierCurve3[] = [];
  const packets: THREE.Mesh[] = [];
  const packetGeometry = new THREE.SphereGeometry(.052, 16, 12);
  endpoints.forEach((end, index) => {
    const curve = new THREE.CubicBezierCurve3(new THREE.Vector3(end.x * .2, end.y * .2, -.1), new THREE.Vector3(end.x * .8, end.y * .16, -.1), new THREE.Vector3(end.x * .65, end.y * .9, end.z), end);
    curves.push(curve);
    network.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 32, .027, 10, false), filament));
    const node = new THREE.Mesh(nodeGeometry, index % 2 ? porcelain : enamel); node.position.copy(end); network.add(node);
    const dot = new THREE.Mesh(terminalGeometry, index % 2 ? enamel : porcelain); dot.position.copy(end).add(new THREE.Vector3(0, 0, .221)); dot.scale.set(.72, .72, .3); network.add(dot);
    const packet = new THREE.Mesh(packetGeometry, light); packets.push(packet); network.add(packet);
  });

  const security = new THREE.Group();
  const outline = shieldShape();
  security.add(cushion(outline, .29, titanium));
  const inset = cushion(outline, .23, enamel); inset.scale.set(.87, .87, 1); inset.position.z = .14; security.add(inset);
  const check = new THREE.CurvePath<THREE.Vector3>();
  check.add(new THREE.LineCurve3(new THREE.Vector3(-.38, -.015, .39), new THREE.Vector3(-.16, -.235, .39)));
  check.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-.16, -.235, .39), new THREE.Vector3(-.11, -.29, .39), new THREE.Vector3(-.06, -.23, .39)));
  check.add(new THREE.LineCurve3(new THREE.Vector3(-.06, -.23, .39), new THREE.Vector3(.40, .31, .39)));
  security.add(new THREE.Mesh(new THREE.TubeGeometry(check, 40, .058, 16, false), porcelain));
  const capGeometry = new THREE.SphereGeometry(.058, 16, 12);
  for (const at of [0, 1]) { const cap = new THREE.Mesh(capGeometry, porcelain); cap.position.copy(check.getPoint(at)); security.add(cap); }

  return {
    models: [ai, network, security],
    animate(time: number, active: number, dark: boolean) {
      // Both ends disappear inside a solid node, so the packet loop has no jump.
      packets.forEach((packet, index) => packet.position.copy(curves[index].getPoint((time * .12 + index * .23) % 1)));
      light.emissiveIntensity = (dark ? .36 : .18) + (active === 0 ? .06 * (1 + Math.sin(time * .7)) : 0);
    },
  };
}
