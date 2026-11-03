/** Shared layout keeps the 3D objects, route, and accessible links aligned. */
export function galaxyLayout(width: number, height: number, compact: boolean) {
  const radius = compact
    ? Math.max(23, Math.min(32, width * .075))
    : Math.max(34, Math.min(54, height * .054));
  const stops = compact
    ? [0, 1, 2].map(i => ({ x: width * (.19 + i * .31), y: height * .46 }))
    : [0, 1, 2].map(i => ({ x: width * .64 + Math.min(50, width * .04) * i, y: height * (.30 + i * .20) }));
  const start = compact
    ? { x: width * .06, y: stops[0].y }
    : { x: stops[0].x - (stops[1].x - stops[0].x) * .7, y: stops[0].y - (stops[1].y - stops[0].y) * .7 };
  // The particle globe holds all three domains, symbols and labels together.
  let sphere;
  if (compact) {
    const cover = Math.hypot(stops[2].x - width * .5 + radius, 30) + 14;
    sphere = { x: width * .5, y: stops[1].y + 18, radius: Math.min(width * .48, Math.max(cover, width * .4)) };
  } else {
    // Labels sit 31px right of each symbol; their width is estimated here.
    const left = stops[0].x - radius, top = stops[0].y - radius, bottom = stops[2].y + radius;
    const right = Math.min(width - 16, stops[2].x + radius + 31 + Math.min(160, width * .12));
    let x = (left + right) / 2;
    let r = Math.min(Math.hypot((right - left) / 2, (bottom - top) / 2) + 18, height * .49);
    // Fit on the stage where there is room; an off-axis sphere projects up to ~15%
    // wider than its radius at this field of view. The copy column wins over
    // fitting, so on narrow screens the globe runs off the right edge instead.
    x = Math.max(Math.min(x, width - r * 1.18 - 20), width * .47 + r);
    r = Math.min(r, x - width * .44);
    sphere = { x, y: (top + bottom) / 2, radius: r };
  }
  return { width, height, radius, stops, start, end: stops[2], sphere };
}

export function journeyPoint(layout: ReturnType<typeof galaxyLayout>, progress: number) {
  const points = [layout.start, ...layout.stops];
  const times = [0, .30, .64, 1];
  let index = 0;
  while (index < 2 && progress > times[index + 1]) index++;
  const t = Math.max(0, Math.min(1, (progress - times[index]) / (times[index + 1] - times[index])));
  return {
    x: points[index].x + (points[index + 1].x - points[index].x) * t,
    y: points[index].y + (points[index + 1].y - points[index].y) * t,
  };
}

/**
 * Fibonacci order runs pole to pole, so a shortened draw range (mobile, or
 * adaptive quality) would show only the top of the globe. Striding by a
 * golden-ratio step, coprime with the total, visits every slot once and makes
 * every prefix sample the whole sphere evenly.
 */
export function globeShellSlot(index: number, total: number) {
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  let stride = Math.round(total * .618);
  while (gcd(stride, total) !== 1) stride++;
  return (index * stride) % total;
}
