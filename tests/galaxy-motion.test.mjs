import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { createGalaxyMotion } from '../src/components/home/galaxyMotion.ts';
import { advanceGalaxyPointer, galaxyPointerTarget } from '../src/components/home/galaxyPointer.ts';
import { galaxyLayout, globeShellSlot } from '../src/components/home/galaxyLayout.ts';

test('a shortened draw range still shows the whole globe, not just its top', () => {
  const total = 2600;
  const slots = Array.from({ length: total }, (_, i) => globeShellSlot(i, total));
  assert.equal(new Set(slots).size, total, 'Some shell slots were skipped or repeated');
  // Mobile and the adaptive-quality step draw only a prefix of the particles.
  for (const share of [.25, .38, .5]) {
    const ys = slots.slice(0, Math.round(total * share)).map(k => 1 - 2 * (k + .5) / total);
    const below = ys.filter(y => y < 0).length / ys.length;
    assert.ok(Math.abs(below - .5) < .03, `Prefix of ${share} is lopsided: ${below.toFixed(2)} below the equator`);
    assert.ok(Math.min(...ys) < -.95 && Math.max(...ys) > .95, `Prefix of ${share} misses a pole`);
  }
});

test('the globe holds all three domains and stays clear of the copy', () => {
  const inside = (sphere, x, y, reach) => Math.hypot(x - sphere.x, y - sphere.y) + reach <= sphere.radius + 2;
  for (const [width, height] of [[1920, 1080], [1440, 900], [1440, 960], [1280, 800], [1100, 760]]) {
    const { sphere, stops, radius } = galaxyLayout(width, height, false);
    stops.forEach((stop, i) => assert.ok(inside(sphere, stop.x, stop.y, radius), `Domain ${i} outside the globe at ${width}x${height}`));
    // The widest label line sits 31px right of its symbol.
    const labelEnd = stops[2].x + radius + 31 + Math.min(160, width * .12);
    assert.ok(inside(sphere, labelEnd, stops[2].y, 0), `Security label outside the globe at ${width}x${height}`);
    assert.ok(sphere.x - sphere.radius >= width * .44, `Globe overlaps the copy at ${width}`);
    assert.ok(sphere.x + sphere.radius <= width, `Globe clipped at ${width}`);
  }
  for (const [width, height] of [[390, 844], [320, 568]]) {
    const { sphere, stops, radius } = galaxyLayout(width, height, true);
    stops.forEach((stop, i) => assert.ok(inside(sphere, stop.x, stop.y, radius), `Domain ${i} outside the globe at ${width}`));
    assert.ok(sphere.x - sphere.radius >= 0 && sphere.x + sphere.radius <= width, `Globe clipped at ${width}`);
  }
});

test('the spherical pointer effect stays in the galaxy and fades at its boundary', () => {
  assert.deepEqual(galaxyPointerTarget(.2, .5, false), { x: 0, y: 0 });
  assert.deepEqual(galaxyPointerTarget(.75, .02, false), { x: 0, y: 0 });
  assert.ok(galaxyPointerTarget(.9, .5, false).x > .5);
  assert.ok(galaxyPointerTarget(.75, .7, false).y > .4);
  assert.deepEqual(galaxyPointerTarget(.5, .5, true), { x: 0, y: 0 });
  const edge = galaxyPointerTarget(.75 + .27 * .999, .5, false);
  assert.ok(Math.abs(edge.x) < .001, 'Hot-area boundary snaps');
});

test('rapid mouse reversals stay bounded and settle at the same pace across refresh rates', () => {
  const simulatePointer = hz => {
    const pointer = { x: 0, y: 0 };
    for (let frame = 0; frame < hz * 8; frame++) {
      const previous = { ...pointer };
      const target = frame < hz * 2 ? { x: .7, y: .2 } : frame < hz * 4 ? { x: -.7, y: -.3 } : { x: 0, y: 0 };
      advanceGalaxyPointer(pointer, target, 1 / hz);
      assert.ok(Math.hypot(pointer.x - previous.x, pointer.y - previous.y) <= .7 / hz + 1e-12);
      assert.ok(Math.hypot(pointer.x, pointer.y) < 1);
    }
    return pointer;
  };
  const a = simulatePointer(60), b = simulatePointer(120);
  assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < .001);
  assert.ok(Math.hypot(a.x, a.y) < .001, 'Pointer exit did not settle');
  const frozen = { x: .4, y: -.2 };
  advanceGalaxyPointer(frozen, { x: -.4, y: .2 }, 0);
  assert.deepEqual(frozen, { x: .4, y: -.2 });
});

function simulate(hz) {
  const motion = createGalaxyMotion();
  let largestStep = 0, smallestFacing = 1;
  for (let frame = 0; frame < hz * 120; frame++) {
    const previous = motion.orientations.map(q => q.clone());
    motion.advance(1 / hz, Math.floor(frame / hz / 6) % 4 - 1);
    motion.orientations.forEach((q, index) => {
      largestStep = Math.max(largestStep, previous[index].angleTo(q));
      smallestFacing = Math.min(smallestFacing, new Vector3(0, 0, 1).applyQuaternion(q).z);
    });
  }
  return { motion, largestStep, smallestFacing };
}
test('chapter transitions stay smooth and keep the domain symbols facing the reader', () => {
  const result = simulate(60);
  assert.ok(result.largestStep < .02, 'Abrupt rotation between frames');
  assert.ok(result.smallestFacing > .65, 'The symbol turns away from the reader');
});
test('motion has the same pace on 60 Hz and 120 Hz displays', () => {
  const a = simulate(60).motion, b = simulate(120).motion;
  a.orientations.forEach((q, index) => assert.ok(q.angleTo(b.orientations[index]) < .01));
});
test('pause freezes orientation and reduced-motion reset restores the initial pose', () => {
  const motion = createGalaxyMotion(), initial = motion.orientations.map(q => q.clone());
  for (let i = 0; i < 100; i++) motion.advance(1 / 60, 0, 2);
  const paused = motion.orientations.map(q => q.clone());
  motion.advance(0, 1);
  motion.orientations.forEach((q, index) => assert.ok(q.equals(paused[index])));
  motion.reset();
  motion.orientations.forEach((q, index) => assert.ok(q.equals(initial[index])));
});
