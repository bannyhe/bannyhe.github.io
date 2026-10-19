import { Euler, Quaternion, Vector3 } from 'three';

const bases = [
  new Quaternion().setFromEuler(new Euler(.12, -.24, -.10)),
  new Quaternion().setFromEuler(new Euler(.12, .15, .06)),
  new Quaternion().setFromEuler(new Euler(.12, -.19, .10)),
];
const axes = [
  new Vector3(.48, .76, .38),
  new Vector3(-.42, .66, .57),
  new Vector3(.58, .48, -.42),
];

/** Smooth rotation about oblique axes, independent of the display's frame rate. */
export function createGalaxyMotion() {
  const orientations = bases.map(base => base.clone());
  const speeds = [0, 0, 0];
  const axis = new Vector3();
  const increment = new Quaternion();
  let elapsed = 0;

  return {
    orientations,
    reset() {
      elapsed = 0;
      speeds.fill(0);
      orientations.forEach((orientation, index) => orientation.copy(bases[index]));
    },
    advance(delta: number, activeIndex: number) {
      if (delta <= 0) return;
      const midpoint = elapsed + delta / 2;
      elapsed += delta;
      const damping = 2.8;
      const decay = Math.exp(-damping * delta);
      orientations.forEach((orientation, index) => {
        const targetSpeed = index === activeIndex ? .30 : 0;
        // Integrate the easing curve exactly; dropped frames do not change pace.
        const angle = targetSpeed * delta + (speeds[index] - targetSpeed) * (1 - decay) / damping;
        speeds[index] = targetSpeed + (speeds[index] - targetSpeed) * decay;
        if (angle < 1e-8) return;
        axis.copy(axes[index]);
        axis.x += Math.sin(midpoint * .17 + index) * .12;
        axis.y += Math.cos(midpoint * .13 + index) * .09;
        axis.z += Math.sin(midpoint * .15 + index * .7) * .12;
        axis.normalize();
        increment.setFromAxisAngle(axis, angle);
        orientation.premultiply(increment).normalize();
      });
    },
  };
}
