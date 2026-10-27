import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { createGalaxyMotion } from '../src/components/home/galaxyMotion.ts';

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
