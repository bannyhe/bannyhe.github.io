import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { createGalaxyMotion } from '../src/components/home/galaxyMotion.ts';
import { advanceGalaxyLens, advanceGalaxyPointer, galaxyLensTarget, galaxyPointerTarget } from '../src/components/home/galaxyPointer.ts';
import { galaxyLayout } from '../src/components/home/galaxyLayout.ts';

test('the cursor lens is live over the globe and fades out just past its rim', () => {
  const { sphere } = galaxyLayout(1440, 960, false);
  assert.equal(galaxyLensTarget(sphere.x, sphere.y, sphere).strength, 1);
  assert.equal(galaxyLensTarget(sphere.x + sphere.radius * .9, sphere.y, sphere).strength, 1);
  const rim = galaxyLensTarget(sphere.x + sphere.radius * 1.12, sphere.y, sphere).strength;
  assert.ok(rim > 0 && rim < 1, 'No soft edge at the rim');
  assert.equal(galaxyLensTarget(sphere.x + sphere.radius * 1.3, sphere.y, sphere).strength, 0);
  assert.equal(galaxyLensTarget(80, 480, sphere).strength, 0, 'Lens reached the copy column');
});

test('the globe sits right of the copy and inside the stage on every breakpoint', () => {
  for (const [width, height, compact] of [[1440, 960, false], [1024, 768, false], [768, 960, false], [390, 844, true], [320, 568, true]]) {
    const { sphere } = galaxyLayout(width, height, compact);
    assert.ok(sphere.x - sphere.radius >= 0 && sphere.x + sphere.radius <= width, `Globe clipped at ${width}`);
    assert.ok(sphere.y - sphere.radius >= 0 && sphere.y + sphere.radius <= height, `Globe clipped vertically at ${width}`);
    if (!compact) assert.ok(sphere.x - sphere.radius > width * .45, `Globe overlaps the copy at ${width}`);
  }
});

test('the lens appears under the cursor, follows it, and fades without popping', () => {
  const lens = { x: -1e4, y: -1e4, strength: 0 };
  advanceGalaxyLens(lens, { x: 1000, y: 500, strength: 1 }, 1 / 60);
  assert.deepEqual([lens.x, lens.y], [1000, 500], 'Lens slid in from off-screen');
  assert.ok(lens.strength > 0 && lens.strength < .2, 'Lens popped in');
  for (let i = 0; i < 120; i++) advanceGalaxyLens(lens, { x: 1100, y: 450, strength: 1 }, 1 / 60);
  assert.ok(Math.hypot(lens.x - 1100, lens.y - 450) < .5 && lens.strength > .99);
  let previous = lens.strength;
  for (let i = 0; i < 300; i++) {
    advanceGalaxyLens(lens, { x: 1100, y: 450, strength: 0 }, 1 / 60);
    assert.ok(previous - lens.strength < .1, 'Lens dropped out abruptly');
    previous = lens.strength;
  }
  assert.equal(lens.strength, 0, 'Lens never fully released');
  const frozen = { x: 10, y: 20, strength: .5 };
  advanceGalaxyLens(frozen, { x: 900, y: 900, strength: 1 }, 0);
  assert.deepEqual(frozen, { x: 10, y: 20, strength: .5 }, 'Lens moved while paused');
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
