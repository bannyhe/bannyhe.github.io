import * as THREE from 'three';
import { galaxyLayout, globeShellSlot } from './galaxyLayout';
import { createGalaxyMotion } from './galaxyMotion';
import { createGalaxyModels } from './galaxyModels';
import { createNetworkField } from './galaxyField';

function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene();
  // A product-photography setup: a dark cyclorama so the lacquer reads deep,
  // a large soft key, a cool fill, a violet rim to catch the bevels, and a
  // thin strip that draws one clean highlight line along each tile.
  studio.background = new THREE.Color(0x141c2a);
  const panels: THREE.Mesh[] = [];
  const panel = (width: number, height: number, color: THREE.Color, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    mesh.position.set(x, y, z); mesh.lookAt(0, 0, 0); studio.add(mesh); panels.push(mesh);
  };
  panel(7, 8, new THREE.Color(3.6, 3.8, 4.2), -5.5, 4.5, 6);
  panel(4, 7, new THREE.Color(1.1, 1.5, 2.3), 6, .5, 3.5);
  panel(5, 6, new THREE.Color(2.1, 1.5, 3.4), 2, 1, -6);
  panel(9, .5, new THREE.Color(5, 5.2, 5.6), 0, 7, 2);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(studio, .05);
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

  // A particle globe: a Fibonacci shell you can read as a sphere, with a spiral
  // galaxy and bright core suspended inside it. Built at unit radius and scaled
  // to its on-screen footprint in resize(). Kinds are interleaved by index so a
  // shorter draw range on small screens keeps the same mix.
  let seed = 47;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const gauss = () => Math.sqrt(-2 * Math.log(random() + 1e-9)) * Math.cos(2 * Math.PI * random());
  const count = 5200;
  const shellTotal = Math.round(count * .5);
  const dustPositions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const prominence = new Float32Array(count);
  const tones = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const tilt = new THREE.Matrix4().makeRotationX(-1.08).multiply(new THREE.Matrix4().makeRotationZ(.32));
  const point = new THREE.Vector3();
  let shellIndex = 0;
  for (let i = 0; i < count; i++) {
    const kind = i % 20;
    if (kind < 10) {
      // Shell: even Fibonacci spacing reads as a globe once it turns.
      // Strided so any shortened draw range still covers the whole sphere.
      const k = globeShellSlot(shellIndex++, shellTotal) + .5;
      const y = 1 - 2 * k / shellTotal;
      const ring = Math.sqrt(1 - y * y), theta = golden * k;
      const r = 1 + (random() - .5) * .025;
      point.set(Math.cos(theta) * ring * r, y * r, Math.sin(theta) * ring * r);
      sizes[i] = 2.1 + random() * 1.2;
      tones[i] = .1 + random() * .15;
      prominence[i] = .55 + random() * .3;
    } else if (kind < 18) {
      // Spiral disk: three arms, tilted so the galaxy is seen at an angle.
      const radius = Math.pow(random(), .75) * .8 + .04;
      const arm = Math.floor(random() * 3) * Math.PI * 2 / 3;
      const angle = radius * 7.2 + arm + gauss() * .22;
      point.set(Math.cos(angle) * radius, gauss() * .025 * (1 - radius), Math.sin(angle) * radius).applyMatrix4(tilt);
      sizes[i] = 1.9 + random() * 1.7;
      tones[i] = .55 + (1 - radius) * .4;
      prominence[i] = .5 + random() * .35;
    } else {
      // Core: a dense, bright cluster at the centre of the disk.
      point.set(gauss() * .085, gauss() * .05, gauss() * .085).applyMatrix4(tilt);
      sizes[i] = 2.6 + random() * 1.8;
      tones[i] = 1;
      prominence[i] = .85;
    }
    // A handful of brighter anchor stars give the field a focal hierarchy.
    if (random() > .95) { sizes[i] += 2.2; prominence[i] = 1; }
    dustPositions.set([point.x, point.y, point.z], i * 3);
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  dustGeometry.setAttribute('prominence', new THREE.BufferAttribute(prominence, 1));
  dustGeometry.setAttribute('tone', new THREE.BufferAttribute(tones, 1));
  const dustMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false,
    uniforms: {
      shellColor: { value: new THREE.Color(0x3d6aa6) },
      coreColor: { value: new THREE.Color(0x1c3c74) },
      opacity: { value: .9 }, density: { value: 1 }, time: { value: 0 },
      spin: { value: 0 }, radius: { value: 1 }, sizeScale: { value: 1 }, backFade: { value: .3 },
      viewport: { value: new THREE.Vector2(1, 1) },
      clearAreas: { value: Array.from({ length: 8 }, () => new THREE.Vector4(-100, -100, -100, -100)) },
      icons: { value: Array.from({ length: 3 }, () => new THREE.Vector3(-1e4, -1e4, 0)) },
    },
    vertexShader: `attribute float size; attribute float prominence; attribute float tone;
      uniform float density; uniform float time; uniform float spin; uniform float radius;
      uniform float sizeScale; uniform float backFade; uniform vec2 viewport;
      uniform vec4 clearAreas[8]; uniform vec3 icons[3];
      varying float fade; varying float vTone;
      vec2 toScreen(vec4 clip) { vec2 s=(clip.xy/clip.w*.5+.5)*viewport; return vec2(s.x, viewport.y-s.y); }
      void main() {
        // Idle spin happens here, not in the object matrix, so the globe's
        // transform reflects only the pointer and scroll.
        float c=cos(spin), s=sin(spin);
        vec3 local=vec3(c*position.x+s*position.z, position.y, -s*position.x+c*position.z);
        local*=radius;
        vec4 p=modelViewMatrix*vec4(local,1.);
        gl_Position=projectionMatrix*p;
        // Depth cue: the far hemisphere recedes, so rotation reads as a sphere.
        float centerZ=(modelViewMatrix*vec4(0.,0.,0.,1.)).z;
        float front=clamp((p.z-centerZ)/radius*.5+.5,0.,1.);
        float anchor=step(.99,prominence);
        gl_PointSize=size*sizeScale*mix(.72,1.12,front)*(1.+anchor*.15)*density;
        float shimmer=.9+.1*sin(time*.7+position.x*9.+position.y*7.);
        fade=(.5+.5*prominence)*shimmer*mix(backFade,1.,front);
        vec2 screen=toScreen(gl_Position);
        for(int i=0;i<8;i++) {
          vec2 edge=max(clearAreas[i].xy-screen,screen-clearAreas[i].zw);
          fade*=smoothstep(0.,22.,max(edge.x,edge.y));
        }
        // Each 3D symbol gets clear air: particles thin out just past its
        // silhouette, so a turning icon is never lost in the field.
        for(int i=0;i<3;i++) fade*=smoothstep(icons[i].z*1.1,icons[i].z*1.95,distance(screen,icons[i].xy));
        vTone=tone;
      }`,
    fragmentShader: `uniform vec3 shellColor; uniform vec3 coreColor; uniform float opacity;
      varying float fade; varying float vTone;
      void main() { float r=length(gl_PointCoord-.5);
        float core=1.-smoothstep(.22,.42,r);
        float halo=1.-smoothstep(.3,.5,r);
        vec3 color=mix(shellColor,coreColor,vTone);
        gl_FragColor=vec4(color,min(1.,(core*.9+halo*.25)*opacity*fade));
        #include <colorspace_fragment>
      }`,
  });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  dust.renderOrder = 2;
  // Radius is applied in the shader, so the object-space bounds would be wrong.
  dust.frustumCulled = false;

  // A soft core glow behind the globe gives the galaxy a light source. It is a
  // mesh, not points, so it never competes with the star field for draw state.
  const glowMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false,
    uniforms: { color: { value: new THREE.Color(0x9db8e0) }, opacity: { value: .3 } },
    vertexShader: `varying vec2 vUv; void main() { vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform vec3 color; uniform float opacity; varying vec2 vUv;
      void main() { float r=length(vUv-.5)*2.;
        float glow=exp(-r*r*5.)*.85+exp(-r*r*40.)*.35;
        gl_FragColor=vec4(color,glow*opacity*(1.-smoothstep(.85,1.,r)));
        #include <colorspace_fragment>
      }`,
  });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMaterial);
  glow.renderOrder = 1;
  scene.add(glow);
  scene.add(dust);
  const field = createNetworkField(dustMaterial.uniforms.clearAreas.value);
  renderer.autoClear = false;
  let globeRadius = 1;
  camera.position.set(0, 0, 18);
  camera.lookAt(0, 0, 0);
  let layout = galaxyLayout(1, 1, false);
  // Adaptive quality: software-rendered or weak GPUs step down to 1x pixels,
  // then to half the particles. A capable GPU never leaves full quality.
  let quality = 0, size = { width: 1, height: 1 }, lastFrame = 0;
  const intervals: number[] = [];
  function adapt(now: number) {
    if (quality < 2 && lastFrame && now - lastFrame < 250) {
      intervals.push(now - lastFrame);
      if (intervals.length === 45) {
        const median = [...intervals].sort((a, b) => a - b)[22];
        intervals.length = 0;
        if (median > 26) { quality++; resize(size.width, size.height); }
      }
    }
    lastFrame = now;
  }

  function resize(width: number, height: number) {
    const compact = window.matchMedia('(max-width: 767px)').matches;
    layout = galaxyLayout(width, height, compact);
    size = { width, height };
    const density = quality ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(density);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    dustMaterial.uniforms.density.value = density;
    dustMaterial.uniforms.viewport.value.set(width, height);
    dustGeometry.setDrawRange(0, Math.round((compact ? 2000 : count) * (quality > 1 ? .5 : 1)));
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
    // Seat the globe behind the destinations: its near surface stays behind the
    // z=0 plane the 3D symbols live on, at the on-screen size the layout asks for.
    const slope = 2 * Math.tan(THREE.MathUtils.degToRad(20)) / height;
    const k = layout.sphere.radius * slope;
    const depth = 19.5 / (1 - k);
    globeRadius = k * depth;
    dust.position.set((layout.sphere.x - width / 2) * slope * depth, (height / 2 - layout.sphere.y) * slope * depth, 18 - depth);
    dustMaterial.uniforms.radius.value = globeRadius;
    dustMaterial.uniforms.sizeScale.value = compact ? .9 : 1;
    glow.position.copy(dust.position);
    glow.scale.setScalar(globeRadius * 2.7);
    // Icon centres and silhouette radius, in the same CSS pixels as the shader.
    dustMaterial.uniforms.icons.value.forEach((icon: THREE.Vector3, i: number) =>
      icon.set(layout.stops[i].x, layout.stops[i].y, layout.radius));
    field.resize(width, height, layout.sphere, compact, density);
  }

  const motion = createGalaxyMotion();
  const pointerTilt = new THREE.Quaternion();
  const pointerEuler = new THREE.Euler();
  let previousTime = 0;

  function draw(progress: number, time: number, dark: boolean, pointer: { x: number; y: number }, activeIndex: number, hoveredIndex = -1) {
    adapt(performance.now());
    if (restoreEnvironment) {
      envTarget.dispose(); envTarget = studioEnvironment(renderer); scene.environment = envTarget.texture; restoreEnvironment = false;
    }
    // Time freezes when ambience is paused and resets when reduced motion starts.
    if (time < previousTime) motion.reset();
    const delta = THREE.MathUtils.clamp(time - previousTime, 0, .1);
    previousTime = time;
    motion.advance(delta, activeIndex, hoveredIndex);
    // Dark mode glows additively; light mode needs ink-like particles that
    // darken the page instead, or the globe washes out against the gradient.
    const blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    dustMaterial.blending = glowMaterial.blending = blending;
    const u = dustMaterial.uniforms;
    u.shellColor.value.set(dark ? 0x9db9f5 : 0x2c5a99);
    u.coreColor.value.set(dark ? 0xf4f8ff : 0x142f62);
    u.opacity.value = dark ? .95 : .92;
    u.backFade.value = dark ? .24 : .3;
    u.time.value = time;
    u.spin.value = time * .045;
    glowMaterial.uniforms.color.value.set(dark ? 0x3b5fae : 0xa9c1e4);
    glowMaterial.uniforms.opacity.value = dark ? .24 : .34;
    scene.environmentIntensity = dark ? 1.05 : 1.15;
    renderer.toneMappingExposure = dark ? 1.05 : 1.12;
    pointerTilt.setFromEuler(pointerEuler.set(pointer.y * .06, pointer.x * .1, 0));
    models.forEach((group, index) => {
      // A fixed footprint, bounded turn and sub-pixel drift keep labels clear.
      group.quaternion.copy(pointerTilt).multiply(motion.orientations[index]);
      group.position.copy(centers[index]);
      group.position.y += Math.sin(time * .48 + index * 1.8) * .012;
    });
    sculpture.animate(time, activeIndex, dark, hoveredIndex);
    // A gentle parallax toward the cursor, easing back when it leaves; scroll
    // turns the globe across the journey. Its centre never moves.
    dust.rotation.set(.18 + pointer.y * .1, -.35 + progress * 1.4 + pointer.x * .16, pointer.x * .015);
    field.update(time, dark);
    renderer.clear();
    renderer.render(field.scene, field.camera);
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
      field.dispose();
      envTarget.dispose();
      renderer.dispose();
    },
  };
}
