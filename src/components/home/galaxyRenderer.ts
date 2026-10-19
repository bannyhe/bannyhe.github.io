import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { galaxyLayout } from './galaxyLayout';
import { createGalaxyMotion } from './galaxyMotion';


// These are solid, beveled models, rather than symbols placed on a sphere.
function roundedShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(-w/2+r, -h/2); s.lineTo(w/2-r, -h/2);
  s.quadraticCurveTo(w/2, -h/2, w/2, -h/2+r); s.lineTo(w/2, h/2-r);
  s.quadraticCurveTo(w/2, h/2, w/2-r, h/2); s.lineTo(-w/2+r, h/2);
  s.quadraticCurveTo(-w/2, h/2, -w/2, h/2-r); s.lineTo(-w/2, -h/2+r);
  s.quadraticCurveTo(-w/2, -h/2, -w/2+r, -h/2);
  return s;
}
function extrude(shape: THREE.Shape, depth: number, material: THREE.Material, bevel = .055) {
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: bevel, bevelThickness: bevel, curveSegments: 20 });
  geometry.translate(0, 0, -depth / 2);
  return new THREE.Mesh(geometry, material);
}
function slab(w: number, h: number, depth: number, material: THREE.Material, r = .12) {
  return extrude(roundedShape(w, h, r), depth, material, Math.min(.045, depth / 3));
}
function rod(a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 8), material);
  mesh.position.copy(a).add(b).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return mesh;
}
function sparkle(material: THREE.Material) {
  const shape = new THREE.Shape();
  shape.moveTo(0, .54);
  shape.quadraticCurveTo(.1, .1, .54, 0); shape.quadraticCurveTo(.1, -.1, 0, -.54);
  shape.quadraticCurveTo(-.1, -.1, -.54, 0); shape.quadraticCurveTo(-.1, .1, 0, .54);
  return extrude(shape, .12, material, .025);
}

export function createGalaxyRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 130);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(environment, .04);
  scene.environment = envTarget.texture;
  environment.dispose(); pmrem.dispose();
  const ambient = new THREE.HemisphereLight(0xd6eaff, 0x6779a4, 1.5);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xe6f6ff, 2.5); key.position.set(-4, 7, 10); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8c8bff, 3); rim.position.set(6, -1, -2); scene.add(rim);
  const material = (color: number, metalness = .55, roughness = .26) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const silver = material(0xb9d5e7, .82, .2);
  const pale = material(0xd4e7f4, .55, .24);
  const blue = material(0x5f819a, .72, .3);
  const navy = material(0x182c52, .65, .23);
  const violet = material(0x8c8eae, .65, .3);
  const glow = new THREE.MeshStandardMaterial({ color: 0x8ce8ff, emissive: 0x2d99ca, emissiveIntensity: .75, metalness: .25, roughness: .24 });
  const gold = material(0xc6a987, .8, .25);
  const wire = material(0x5c9dc1, .55, .3);

  const ai = new THREE.Group();
  ai.add(slab(2.25, 2.25, .21, navy));
  const board = slab(2.1, 2.1, .11, silver); board.position.z = .19; ai.add(board);
  const core = new THREE.Group();
  core.add(slab(1.58, 1.58, .18, blue));
  const face = slab(1.34, 1.34, .055, navy); face.position.z = .13; core.add(face);
  const emblem = sparkle(pale); emblem.scale.setScalar(.72); emblem.position.z = .25; core.add(emblem);
  const smallSpark = sparkle(glow); smallSpark.scale.setScalar(.22); smallSpark.position.set(.44, .43, .23); core.add(smallSpark);
  core.position.z = .35; ai.add(core);
  for (let side = 0; side < 4; side++) {
    const bank = new THREE.Group(); bank.rotation.z = side * Math.PI / 2;
    for (let n = 0; n < 8; n++) {
      const pin = slab(.105, .33, .10, silver, .025); pin.position.set((n-3.5)*.235, 1.24, -.02); bank.add(pin);
      const trace = slab(.025, .30, .012, gold, .008); trace.position.set((n-3.5)*.235, .91, .27); bank.add(trace);
    }
    ai.add(bank);
  }
  for (const x of [-.91, .91]) for (const y of [-.91, .91]) {
    const screw = new THREE.Mesh(new THREE.CylinderGeometry(.055, .055, .03, 12), navy);
    screw.rotation.x = Math.PI/2; screw.position.set(x,y,.29); ai.add(screw);
  }

  const network = new THREE.Group();
  const router = new THREE.Group();
  router.add(slab(1.65, .93, .66, silver));
  const front = slab(1.45, .66, .035, navy, .08); front.position.z=.38; router.add(front);
  for (let i=0;i<5;i++) {
    const port = slab(.19,.17,.025,blue,.025); port.position.set(-.5+i*.25,-.08,.42); router.add(port);
    const led = slab(.075,.025,.025,glow,.008); led.position.set(-.5+i*.25,.17,.42); router.add(led);
  }
  network.add(router);
  const nodes: THREE.Group[] = [];
  const nodePositions = [new THREE.Vector3(-1.28,1.02,.15), new THREE.Vector3(1.27,.96,-.20), new THREE.Vector3(-1.21,-1.07,-.25), new THREE.Vector3(1.24,-1.07,.4)];
  const connections = new THREE.Group(); network.add(connections);
  const wireGeometry = new THREE.CylinderGeometry(.026,.026,1,8);
  const cables: THREE.Mesh[] = [];
  const packets: THREE.Mesh[] = [];
  nodePositions.forEach((position, i) => {
    const node = new THREE.Group();
    node.add(slab(.55,.55,.45,i%2?blue:violet,.10));
    const window = slab(.31,.21,.025,pale,.04); window.position.z=.27; node.add(window);
    node.position.copy(position); nodes.push(node); network.add(node);
    const cable = new THREE.Mesh(wireGeometry, wire); cables.push(cable); connections.add(cable);
    const packet = new THREE.Mesh(new THREE.SphereGeometry(.065,10,8), glow); packets.push(packet); connections.add(packet);
  });

  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(0,1.42); shieldShape.quadraticCurveTo(.55,1.09,1.10,1.02);
  shieldShape.lineTo(1.1,.05); shieldShape.bezierCurveTo(1.03,-.72,.45,-1.18,0,-1.45);
  shieldShape.bezierCurveTo(-.45,-1.18,-1.03,-.72,-1.1,.05); shieldShape.lineTo(-1.1,1.02);
  shieldShape.quadraticCurveTo(-.55,1.09,0,1.42);
  const shield = new THREE.Group();
  shield.add(extrude(shieldShape,.23,silver,.085));
  const shieldFace = new THREE.Group();
  const inset = extrude(shieldShape,.12,blue,.07); inset.scale.set(.85,.85,1); shieldFace.add(inset);
  const tickA=rod(new THREE.Vector3(-.45,.03,.14),new THREE.Vector3(-.12,-.30,.14),.085,pale);
  const tickB=rod(new THREE.Vector3(-.12,-.30,.14),new THREE.Vector3(.48,.40,.14),.085,pale);
  shieldFace.add(tickA,tickB); shieldFace.position.z=.26; shield.add(shieldFace);

  // Each domain has the same visual footprint. Scroll never changes its scale.
  const models = [ai, network, shield];
  const modelExtents = models.map(group => {
    scene.add(group);
    const size = new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());
    return Math.max(size.x, size.y, size.z);
  });
  nodes.forEach((node, i) => {
    const cable = cables[i];
    cable.position.copy(node.position).multiplyScalar(.5);
    cable.scale.y = node.position.length();
    cable.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), node.position.clone().normalize());
  });

  // A distant spiral field gives the route a larger setting. Only this backdrop
  // drifts; the three destinations remain in place and equally sized.
  let seed = 47;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const count = 3000;
  const dustPositions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    if (i < 2100) {
      const radius = Math.sqrt(random()) * 27;
      const arm = Math.floor(random() * 3) * Math.PI * 2 / 3;
      const angle = radius * .23 + arm + (random() - .5) * .7;
      dustPositions.set([
        Math.cos(angle) * radius + 9,
        Math.sin(angle) * radius * .42,
        -22 + (random() - .5) * 6,
      ], i * 3);
    } else {
      dustPositions.set([(random() - .5) * 70, (random() - .5) * 42, -8 - random() * 48], i * 3);
    }
    sizes[i] = .6 + random() * 2.4;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  const dustMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {
      color: { value: new THREE.Color(0x5277a7) },
      opacity: { value: .45 }, density: { value: 1 },
    },
    vertexShader: `attribute float size; uniform float density; varying float fade;
      void main() { vec4 p=modelViewMatrix*vec4(position,1.);
        gl_Position=projectionMatrix*p; gl_PointSize=clamp(size*38./max(5.,-p.z),.7,3.)*density;
        fade=1.-smoothstep(55.,95.,-p.z); }`,
    fragmentShader: `uniform vec3 color; uniform float opacity; varying float fade;
      void main() { float r=length(gl_PointCoord-.5);
        gl_FragColor=vec4(color,(1.-smoothstep(.05,.5,r))*opacity*fade); }`,
  });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dust);
  camera.position.set(0, 0, 18);
  camera.lookAt(0, 0, 0);
  let layout = galaxyLayout(1, 1, false);

  function resize(width: number, height: number) {
    const compact = window.matchMedia('(max-width: 767px)').matches;
    layout = galaxyLayout(width, height, compact);
    const density = Math.min(window.devicePixelRatio || 1, compact ? 1.35 : 1.5);
    renderer.setPixelRatio(density);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    dustMaterial.uniforms.density.value = density;
    const unitsPerPixel = 2 * 18 * Math.tan(THREE.MathUtils.degToRad(20)) / height;
    models.forEach((group, i) => {
      group.position.set(
        (layout.stops[i].x - width / 2) * unitsPerPixel,
        (height / 2 - layout.stops[i].y) * unitsPerPixel,
        0,
      );
      group.scale.setScalar(layout.radius * 1.65 * unitsPerPixel / modelExtents[i]);
    });
  }

  const motion = createGalaxyMotion();
  const pointerTilt = new THREE.Quaternion();
  const pointerEuler = new THREE.Euler();
  let previousTime = 0;

  function draw(progress: number, time: number, dark: boolean, pointer: { x: number; y: number }, activeIndex: number) {
    // Time freezes when ambience is paused and resets when reduced motion starts.
    if (time < previousTime) motion.reset();
    const delta = THREE.MathUtils.clamp(time - previousTime, 0, .1);
    previousTime = time;
    motion.advance(delta, activeIndex);
    dustMaterial.uniforms.color.value.set(dark ? 0xb4cdf6 : 0x5277a7);
    dustMaterial.uniforms.opacity.value = dark ? .66 : .36;
    scene.environmentIntensity = dark ? .85 : 1.05;
    renderer.toneMappingExposure = dark ? 1 : 1.15;
    pointerTilt.setFromEuler(pointerEuler.set(pointer.y * .045, pointer.x * .065, 0));
    models.forEach((group, index) => {
      // The quaternion preserves momentum on any axis and coasts to rest.
      // It never changes the object's position or its scale within the stop.
      group.quaternion.copy(pointerTilt).multiply(motion.orientations[index]);
    });
    packets.forEach((packet, i) => packet.position.copy(nodePositions[i]).multiplyScalar((time * .14 + i * .25) % 1));
    // Gentle parallax stays behind the route; it cannot push a stop over the copy.
    dust.position.set(pointer.x * .25, -pointer.y * .16 - progress * .45, 0);
    dust.rotation.z = -.18 + progress * .055;
    renderer.render(scene, camera);
  }

  return {
    resize, draw,
    dispose() {
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse(object => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) geometries.add(mesh.geometry);
        if (mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m => materials.add(m));
      });
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      envTarget.dispose();
      renderer.dispose();
    },
  };
}
