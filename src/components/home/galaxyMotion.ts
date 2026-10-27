import { Euler, Quaternion } from 'three';

const bases = [new Euler(.22, -.30, -.09), new Euler(.22, .24, .04), new Euler(.13, -.24, .07)]
  .map(euler => new Quaternion().setFromEuler(euler));

/** Slow, bounded turns keep each symbol readable; selection eases into motion. */
export function createGalaxyMotion() {
  const orientations = bases.map(base => base.clone());
  const weights = [0, 0, 0], phases = [0, 1.7, 3.4];
  const tilt = new Quaternion(), target = new Quaternion(), euler = new Euler();
  return {
    orientations, weights,
    reset() {
      weights.fill(0); phases.splice(0, 3, 0, 1.7, 3.4);
      orientations.forEach((value, index) => value.copy(bases[index]));
    },
    advance(delta: number, activeIndex: number, hoveredIndex = -1) {
      if (delta <= 0) return;
      const blend = 1 - Math.exp(-3.2 * delta);
      orientations.forEach((orientation, index) => {
        const selected = index === activeIndex || index === hoveredIndex ? 1 : 0;
        weights[index] += (selected - weights[index]) * blend;
        phases[index] += delta * (.22 + weights[index] * .2);
        const phase = phases[index], amount = weights[index];
        tilt.setFromEuler(euler.set(
          Math.sin(phase * .8) * (.035 + amount * .13),
          Math.sin(phase) * (.07 + amount * .38),
          Math.sin(phase * .67) * (.025 + amount * .08),
        ));
        target.copy(bases[index]).multiply(tilt);
        orientation.slerp(target, blend).normalize();
      });
    },
  };
}
