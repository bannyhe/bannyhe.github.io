import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Tracks the user's reduced-motion preference, and keeps tracking it — the
 * setting can change while the page is open (macOS and iOS both allow it), so
 * a one-time read at mount would go stale.
 *
 * The stylesheet already neutralizes CSS animation and transition under this
 * preference, but motion driven from JavaScript escapes that: the hero's
 * typewriter runs on setTimeout, and its gradient shimmer and scroll indicator
 * are Framer Motion loops with `repeat: Infinity`. Those need this hook to know
 * to stand down.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}
