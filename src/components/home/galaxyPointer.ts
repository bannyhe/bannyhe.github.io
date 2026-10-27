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

/** Damped and speed-limited, including fast mouse movements and pointer exit. */
export function advanceGalaxyPointer(current: Point, target: Point, delta: number) {
  const step = Math.max(0, Math.min(delta, .1));
  const distance = Math.hypot(target.x - current.x, target.y - current.y);
  if (!distance || !step) return;
  const blend = Math.min(1 - Math.exp(-2.8 * step), .7 * step / distance);
  current.x += (target.x - current.x) * blend;
  current.y += (target.y - current.y) * blend;
}
