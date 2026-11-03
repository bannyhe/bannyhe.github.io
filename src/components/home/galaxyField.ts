import * as THREE from 'three';

type Sphere = { x: number; y: number; radius: number };

// Every vertex carries its node as (x, y, phase, frequency). Nodes, both ends
// of each link and both ends of each packet run the same drift, so links stay
// attached to their nodes without a CPU update per frame.
const DRIFT = `vec2 drift(vec4 node, float time) {
    return node.xy + vec2(sin(time*node.w+node.z), cos(time*node.w*.83+node.z*1.7))*12.;
  }`;
const SHARED = `uniform vec4 clearAreas[8]; uniform vec3 globe; uniform vec2 viewport; uniform float time; uniform float opacity;
  ${DRIFT}
  // Text keeps its full contrast: the field fades out under every live label.
  float readable(vec2 p) {
    float f=1.;
    for(int i=0;i<8;i++) { vec2 e=max(clearAreas[i].xy-p,p-clearAreas[i].zw); f*=smoothstep(0.,18.,max(e.x,e.y)); }
    return f;
  }
  // The globe stays the focal point, and the field softens toward the edges.
  float presence(vec2 p) {
    float outside=smoothstep(globe.z*.78,globe.z*1.12,distance(p,globe.xy));
    vec2 m=min(p,viewport-p);
    return outside*smoothstep(0.,70.,min(m.x,m.y));
  }`;
const FRAGMENT = `uniform vec3 color; varying float vAlpha;
  void main() { gl_FragColor=vec4(color,vAlpha);
    #include <colorspace_fragment>
  }`;
const POINT_FRAGMENT = `uniform vec3 color; varying float vAlpha;
  void main() { float r=length(gl_PointCoord-.5);
    gl_FragColor=vec4(color,vAlpha*(1.-smoothstep(.25,.5,r)));
    #include <colorspace_fragment>
  }`;

function material(vertexShader: string, fragmentShader: string, shared: Record<string, THREE.IUniform>) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false, toneMapped: false,
    uniforms: { ...shared, color: { value: new THREE.Color() }, opacity: { value: 1 } },
    vertexShader, fragmentShader,
  });
}

/**
 * A quiet network topology behind the globe: drifting nodes, links between
 * near neighbours, and an occasional packet crossing a link. Laid out in CSS
 * pixels with an orthographic camera, so readability areas apply directly.
 */
export function createNetworkField(clearAreas: THREE.Vector4[]) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -1, 1);
  const shared = {
    clearAreas: { value: clearAreas },
    globe: { value: new THREE.Vector3(-1e4, -1e4, 0) },
    viewport: { value: new THREE.Vector2(1, 1) },
    time: { value: 0 },
    density: { value: 1 },
  };

  const nodeMaterial = material(`attribute vec4 node; uniform float density; varying float vAlpha;
    ${SHARED}
    void main() { vec2 p=drift(node,time);
      gl_Position=projectionMatrix*modelViewMatrix*vec4(p,0.,1.);
      gl_PointSize=(1.6+fract(node.z*7.3)*1.2)*density;
      vAlpha=opacity*readable(p)*presence(p);
    }`, POINT_FRAGMENT, shared);

  const linkMaterial = material(`attribute vec4 node; attribute vec4 other; varying float vAlpha;
    ${SHARED}
    void main() { vec2 p=drift(node,time), q=drift(other,time);
      gl_Position=projectionMatrix*modelViewMatrix*vec4(p,0.,1.);
      // Longer links are fainter, so the mesh reads as local clusters.
      float reach=distance(node.xy,other.xy);
      vAlpha=opacity*(1.-smoothstep(60.,170.,reach))*readable(p)*presence(p)*presence(q);
    }`, FRAGMENT, shared);

  const packetMaterial = material(`attribute vec4 node; attribute vec4 other; attribute vec2 travel;
    uniform float density; varying float vAlpha;
    ${SHARED}
    void main() {
      // Each packet crosses its link, then rests for a longer while.
      float cycle=fract(time*travel.x+travel.y)*3.2, t=clamp(cycle,0.,1.);
      vec2 p=mix(drift(node,time),drift(other,time),t*t*(3.-2.*t));
      gl_Position=projectionMatrix*modelViewMatrix*vec4(p,0.,1.);
      gl_PointSize=2.6*density;
      vAlpha=opacity*step(cycle,1.)*sin(3.14159*t)*readable(p)*presence(p);
    }`, POINT_FRAGMENT, shared);

  const nodes = new THREE.Points(new THREE.BufferGeometry(), nodeMaterial);
  const links = new THREE.LineSegments(new THREE.BufferGeometry(), linkMaterial);
  const packets = new THREE.Points(new THREE.BufferGeometry(), packetMaterial);
  [links, nodes, packets].forEach((object, index) => { object.frustumCulled = false; object.renderOrder = index; scene.add(object); });

  function resize(width: number, height: number, sphere: Sphere, compact: boolean, density: number) {
    camera.right = width; camera.bottom = height; camera.updateProjectionMatrix();
    shared.viewport.value.set(width, height);
    shared.globe.value.set(sphere.x, sphere.y, sphere.radius);
    shared.density.value = density;

    // Jittered grid: even coverage without a visible lattice. Seeded, so the
    // topology is stable across resizes of the same size.
    let seed = 91;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const cell = compact ? 92 : 118;
    const points: number[][] = [];
    for (let y = 0; y < height + cell; y += cell) {
      for (let x = 0; x < width + cell; x += cell) {
        const px = x + (.15 + random() * .7) * cell, py = y + (.15 + random() * .7) * cell;
        // Nodes deep inside the globe would be faded out anyway.
        if (Math.hypot(px - sphere.x, py - sphere.y) < sphere.radius * .74) continue;
        points.push([px, py, random() * Math.PI * 2, .05 + random() * .07]);
      }
    }
    const pairs: [number, number][] = [];
    const seen = new Set<string>();
    points.forEach((a, i) => {
      points
        .map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1]) }))
        .filter(({ j, d }) => j !== i && d < cell * 1.5)
        .sort((m, n) => m.d - n.d).slice(0, 3)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!seen.has(key)) { seen.add(key); pairs.push([i, j]); }
        });
    });

    const nodeData = new Float32Array(points.flat());
    const linkNode = new Float32Array(pairs.length * 8), linkOther = new Float32Array(pairs.length * 8);
    pairs.forEach(([i, j], k) => {
      linkNode.set(points[i], k * 8); linkOther.set(points[j], k * 8);
      linkNode.set(points[j], k * 8 + 4); linkOther.set(points[i], k * 8 + 4);
    });
    const packetCount = Math.min(pairs.length, compact ? 6 : 12);
    const packetNode = new Float32Array(packetCount * 4), packetOther = new Float32Array(packetCount * 4);
    const travel = new Float32Array(packetCount * 2);
    for (let k = 0; k < packetCount; k++) {
      const [i, j] = pairs[Math.floor(random() * pairs.length)];
      packetNode.set(points[i], k * 4); packetOther.set(points[j], k * 4);
      travel.set([1 / (10 + random() * 8), random()], k * 2);
    }

    const build = (count: number, attributes: Record<string, [Float32Array, number]>) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      Object.entries(attributes).forEach(([name, [data, size]]) => geometry.setAttribute(name, new THREE.BufferAttribute(data, size)));
      return geometry;
    };
    nodes.geometry.dispose(); links.geometry.dispose(); packets.geometry.dispose();
    nodes.geometry = build(points.length, { node: [nodeData, 4] });
    links.geometry = build(pairs.length * 2, { node: [linkNode, 4], other: [linkOther, 4] });
    packets.geometry = build(packetCount, { node: [packetNode, 4], other: [packetOther, 4], travel: [travel, 2] });
  }

  function update(time: number, dark: boolean) {
    shared.time.value = time;
    const blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    nodeMaterial.blending = linkMaterial.blending = packetMaterial.blending = blending;
    linkMaterial.uniforms.color.value.set(dark ? 0x7f9fe0 : 0x3a659e);
    linkMaterial.uniforms.opacity.value = dark ? .17 : .14;
    nodeMaterial.uniforms.color.value.set(dark ? 0xa8c0f5 : 0x2c5a99);
    nodeMaterial.uniforms.opacity.value = dark ? .5 : .38;
    packetMaterial.uniforms.color.value.set(dark ? 0xa8ecff : 0x1f72dd);
    packetMaterial.uniforms.opacity.value = dark ? .9 : .78;
  }

  return {
    scene, camera, resize, update,
    dispose() {
      [nodes, links, packets].forEach(object => object.geometry.dispose());
      [nodeMaterial, linkMaterial, packetMaterial].forEach(m => m.dispose());
    },
  };
}
