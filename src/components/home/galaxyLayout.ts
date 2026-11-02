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
  // The particle globe frames the destinations and their labels. On desktop it
  // sits over the right column, centred where the pointer hot area is centred.
  const sphere = compact
    ? { x: width * .5, y: height * .46, radius: Math.min(width * .42, height * .3) }
    // Centred in the gap between the first two rows so the bright core is
    // never under a label, where the readability knockout would erase it.
    : { x: width * .73, y: height * .41, radius: Math.min(height * .36, width * .22) };
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
