import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  getOrCreateSessionId,
  initSession,
  trackPageView,
  finalizePageView,
  trackInteraction,
} from "../lib/analytics";

// Tracks session init, page views (with duration + scroll depth), and exposes
// a trackEvent helper for components to call directly.
export function useAnalytics() {
  const location = useLocation();
  const sessionId = useRef<string>("");
  const sessionInitialized = useRef(false);
  const pageViewId = useRef<string | null>(null);
  const pageEnteredAt = useRef<number>(Date.now());
  const maxScrollDepth = useRef(0);

  // ── Session init (once per app load) ────────────────────────────────────────
  useEffect(() => {
    if (sessionInitialized.current) return;
    sessionInitialized.current = true;

    const sid = getOrCreateSessionId();
    sessionId.current = sid;
    initSession(sid);
  }, []);

  // ── Scroll depth tracker ─────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const depth = total > 0 ? scrolled / total : 0;
      if (depth > maxScrollDepth.current) {
        maxScrollDepth.current = depth;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Page view tracking on route change ──────────────────────────────────────
  const prevPath = useRef<string>("");
  useEffect(() => {
    const currentPath = location.pathname;

    // Finalize the previous page view before starting a new one
    const finalize = () => {
      if (pageViewId.current) {
        const duration = Date.now() - pageEnteredAt.current;
        finalizePageView(pageViewId.current, duration, maxScrollDepth.current);
      }
    };

    finalize();

    // Reset for new page
    pageViewId.current = null;
    pageEnteredAt.current = Date.now();
    maxScrollDepth.current = 0;

    const sid = sessionId.current;
    if (!sid) return;

    trackPageView(sid, currentPath, prevPath.current || undefined).then((id) => {
      pageViewId.current = id;
    });

    prevPath.current = currentPath;
  }, [location.pathname]);

  // ── Finalize on tab close / navigation away ──────────────────────────────────
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden" && pageViewId.current) {
        const duration = Date.now() - pageEnteredAt.current;
        finalizePageView(pageViewId.current, duration, maxScrollDepth.current);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // ── Public helper for components ─────────────────────────────────────────────
  const trackEvent = useCallback(
    (type: string, target?: string, metadata?: Record<string, unknown>) => {
      const sid = sessionId.current;
      if (sid) trackInteraction(sid, type, target, metadata);
    },
    []
  );

  return { trackEvent };
}
