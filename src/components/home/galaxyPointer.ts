type Point = { x: number; y: number };

/** Only the star field is a hot area; its soft edge avoids an abrupt entry/exit. */
export function galaxyPointerTarget(x: number, y: number, compact: boolean): Point {
  const horizontal = (x - (compact ? .5 : .75)) / (compact ? .5 : .27);
  const vertical = (y - .5) / .43;
  const radius = Math.hypot(horizontal, vertical);
  if (radius >= 1) return { x: 0, y: 0 };
  const edge = Math.max(0, (radius - .72) / .28);
  const weight = 1 - edge * edge * (3 - 2 * edge);
  return { x: horizontal * weight, y: vertical * weight };
}

type Lens = { x: number; y: number; strength: number };
type Sphere = { x: number; y: number; radius: number };

/**
 * The cursor lens is live over the globe and fades out just past its rim, so
 * particles bulge toward the mouse only where there are particles to move.
 */
export function galaxyLensTarget(x: number, y: number, sphere: Sphere): Lens {
  const reach = Math.hypot(x - sphere.x, y - sphere.y) / (sphere.radius * 1.18);
  const edge = Math.max(0, Math.min(1, (reach - .82) / .18));
  return { x, y, strength: reach >= 1 ? 0 : 1 - edge * edge * (3 - 2 * edge) };
}

/**
 * Position eases quickly so the bulge tracks the cursor; strength eases more
 * slowly so entering or leaving the globe never pops.
 */
export function advanceGalaxyLens(current: Lens, target: Lens, delta: number) {
  const step = Math.max(0, Math.min(delta, .1));
  if (!step) return;
  // A lens appearing from nothing starts under the cursor rather than sliding in.
  if (current.strength < .01) { current.x = target.x; current.y = target.y; }
  const follow = 1 - Math.exp(-14 * step);
  current.x += (target.x - current.x) * follow;
  current.y += (target.y - current.y) * follow;
  current.strength += (target.strength - current.strength) * (1 - Math.exp(-5 * step));
  if (target.strength === 0 && current.strength < .002) current.strength = 0;
}

/** Damped and speed-limited, including fast mouse movements and pointer exit. */
export function advanceGalaxyPointer(current: Point, target: Point, delta: number) {
  const step = Math.max(0, Math.min(delta, .1));
  const distance = Math.hypot(target.x - current.x, target.y - current.y);
  if (!distance || !step) return;
  const blend = Math.min(1 - Math.exp(-2.8 * step), .7 * step / distance);
  current.x += (target.x - current.x) * blend;
  current.y += (target.y - current.y) * blend;
}
