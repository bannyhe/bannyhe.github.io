import * as THREE from 'three';
import { galaxyLayout } from './galaxyLayout';
import { createGalaxyMotion } from './galaxyMotion';
import { createGalaxyModels } from './galaxyModels';

function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x263442);
  const panels: THREE.Mesh[] = [];
  const panel = (width: number, height: number, color: THREE.Color, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    mesh.position.set(x, y, z); mesh.lookAt(0, 0, 0); studio.add(mesh); panels.push(mesh);
  };
  panel(6, 9, new THREE.Color(3.2, 3.5, 4), -5, 4, 6);
  panel(3, 7, new THREE.Color(1.4, 1.8, 2.4), 5, 1, 3);
  panel(7, 3, new THREE.Color(2, 2.3, 2.8), 0, 6, -4);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(studio, .12);
  panels.forEach(mesh => { mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); });
  pmrem.dispose();
  return target;
}

export function createGalaxyRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'default' });
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 130);
  let envTarget = studioEnvironment(renderer), restoreEnvironment = false;
  scene.environment = envTarget.texture;
  scene.add(new THREE.HemisphereLight(0xe1edff, 0x344a64, 1.0));
  const key = new THREE.DirectionalLight(0xf0f5ff, 2.3); key.position.set(-4, 6, 8); scene.add(key);
  const rim = new THREE.DirectionalLight(0x89b9eb, 1.5); rim.position.set(5, 2, -3); scene.add(rim);
  const sculpture = createGalaxyModels();
  const models = sculpture.models;
  const centers = models.map(() => new THREE.Vector3());
  const modelExtents = models.map(group => {
    scene.add(group);
    const size = new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());
    return Math.max(size.x, size.y, size.z);
  });

  // A spiral suspended inside a distant sphere turns around its own center.
  // The camera and domain destinations retain their fixed, readable footprint.
  let seed = 47;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const count = 850;
  const dustPositions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const prominence = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    if (i % 11 < 8) {
      const radius = Math.sqrt(random()) * 26;
      const arm = Math.floor(random() * 3) * Math.PI * 2 / 3;
      const angle = radius * .23 + arm + (random() - .5) * .7;
      dustPositions.set([
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * .56,
        Math.sin(angle) * radius * .48 + (random() - .5) * 5,
      ], i * 3);
    } else {
      const radius = 24 + random() * 7;
      const latitude = random() * 2 - 1;
      const longitude = random() * Math.PI * 2;
      const ring = Math.sqrt(1 - latitude * latitude);
      dustPositions.set([
        radius * ring * Math.cos(longitude),
        radius * latitude,
        radius * ring * Math.sin(longitude),
      ], i * 3);
    }
    const anchor = random() > .87;
    sizes[i] = anchor ? 2.8 + random() * 1.1 : 1.15 + random() * 1.15;
    prominence[i] = anchor ? 1 : .45 + random() * .35;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  dustGeometry.setAttribute('prominence', new THREE.BufferAttribute(prominence, 1));
  const dustMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false,
    uniforms: {
      color: { value: new THREE.Color(0x375b83) },
      opacity: { value: .52 }, density: { value: 1 }, time: { value: 0 },
      viewport: { value: new THREE.Vector2(1, 1) },
      clearAreas: { value: Array.from({ length: 8 }, () => new THREE.Vector4(-100, -100, -100, -100)) },
    },
    vertexShader: `attribute float size; attribute float prominence;
      uniform float density; uniform float time; uniform vec2 viewport;
      uniform vec4 clearAreas[8]; varying float fade;
      void main() { vec4 p=modelViewMatrix*vec4(position,1.);
        gl_Position=projectionMatrix*p;
        float distant=clamp(size*42./max(20.,-p.z),1.45,2.6);
        float anchor=clamp(size*48./max(20.,-p.z),2.5,4.4);
        gl_PointSize=mix(distant,anchor,step(.95,prominence))*density;
        float shimmer=.94+.06*sin(time*.55+position.x*1.7+position.y);
        fade=(.55+.45*prominence)*shimmer*(1.-smoothstep(65.,105.,-p.z));
        vec2 screen=(gl_Position.xy/gl_Position.w*.5+.5)*viewport;
        screen.y=viewport.y-screen.y;
        for(int i=0;i<8;i++) {
          vec2 edge=max(clearAreas[i].xy-screen,screen-clearAreas[i].zw);
          fade*=smoothstep(0.,14.,max(edge.x,edge.y));
        }
      }`,
    fragmentShader: `uniform vec3 color; uniform float opacity; varying float fade;
      void main() { float r=length(gl_PointCoord-.5);
        float core=1.-smoothstep(.12,.34,r);
        float halo=1.-smoothstep(.18,.5,r);
        gl_FragColor=vec4(color,(core*.8+halo*.2)*opacity*fade);
        #include <colorspace_fragment>
      }`,
  });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dust);
  camera.position.set(0, 0, 18);
  camera.lookAt(0, 0, 0);
  let layout = galaxyLayout(1, 1, false);

  function resize(width: number, height: number) {
    const compact = window.matchMedia('(max-width: 767px)').matches;
    layout = galaxyLayout(width, height, compact);
    const density = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(density);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    dustMaterial.uniforms.density.value = density;
    dustMaterial.uniforms.viewport.value.set(width, height);
    dustGeometry.setDrawRange(0, compact ? 480 : count);
    const unitsPerPixel = 2 * 18 * Math.tan(THREE.MathUtils.degToRad(20)) / height;
    models.forEach((group, i) => {
      group.position.set(
        (layout.stops[i].x - width / 2) * unitsPerPixel,
        (height / 2 - layout.stops[i].y) * unitsPerPixel,
        0,
      );
      centers[i].copy(group.position);
      group.scale.setScalar(layout.radius * 1.95 * unitsPerPixel / modelExtents[i]);
    });
  }

  const motion = createGalaxyMotion();
  const pointerTilt = new THREE.Quaternion();
  const pointerEuler = new THREE.Euler();
  let previousTime = 0;

  function draw(progress: number, time: number, dark: boolean, pointer: { x: number; y: number }, activeIndex: number, hoveredIndex = -1) {
    if (restoreEnvironment) {
      envTarget.dispose(); envTarget = studioEnvironment(renderer); scene.environment = envTarget.texture; restoreEnvironment = false;
    }
    // Time freezes when ambience is paused and resets when reduced motion starts.
    if (time < previousTime) motion.reset();
    const delta = THREE.MathUtils.clamp(time - previousTime, 0, .1);
    previousTime = time;
    motion.advance(delta, activeIndex, hoveredIndex);
    dustMaterial.uniforms.color.value.set(dark ? 0xc4daf5 : 0x375b83);
    dustMaterial.uniforms.opacity.value = dark ? .66 : .52;
    dustMaterial.uniforms.time.value = time;
    scene.environmentIntensity = dark ? 1.05 : 1.15;
    renderer.toneMappingExposure = dark ? 1.05 : 1.12;
    pointerTilt.setFromEuler(pointerEuler.set(pointer.y * .06, pointer.x * .1, 0));
    models.forEach((group, index) => {
      // A fixed footprint, bounded turn and sub-pixel drift keep labels clear.
      group.quaternion.copy(pointerTilt).multiply(motion.orientations[index]);
      group.position.copy(centers[index]);
      group.position.y += Math.sin(time * .48 + index * 1.8) * .012;
    });
    sculpture.animate(time, activeIndex, dark);
    // Bounded spherical rotation follows the mouse without camera travel or zoom.
    dust.position.set(10, -progress * .45, -32);
    dust.rotation.set(pointer.y * .16, pointer.x * .24, -.18 + progress * .055 + pointer.x * .025);
    renderer.render(scene, camera);
  }

  return {
    resize, draw,
    setReadabilityAreas(areas: { x: number; y: number; width: number; height: number }[]) {
      dustMaterial.uniforms.clearAreas.value.forEach((area: THREE.Vector4, index: number) => {
        const bounds = areas[index];
        if (bounds) area.set(bounds.x - 6, bounds.y - 6, bounds.x + bounds.width + 6, bounds.y + bounds.height + 6);
        else area.set(-100, -100, -100, -100);
      });
    },
    restore() { restoreEnvironment = true; },
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
