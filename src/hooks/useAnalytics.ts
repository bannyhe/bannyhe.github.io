import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { readySession, trackingAllowed, trackPageView, finalizePageView, trackInteraction } from "../lib/analytics";

// Mount once in AppContent. Components that only record actions use useAnalytics.
export function usePageAnalytics() {
  const { pathname } = useLocation();
  const previousPath = useRef("");
  useEffect(() => {
    // BrowserRouter strips the locale base; analytics should retain the actual URL.
    const path = window.location.pathname;
    if (!trackingAllowed(path)) return;
    let disposed = false;
    let pageId: string | null = null;
    let elapsed = 0;
    let visibleSince: number | null = document.visibilityState === "visible" ? performance.now() : null;
    let maxDepth = 0;
    const duration = () => Math.round(elapsed + (visibleSince == null ? 0 : performance.now() - visibleSince));
    const measure = () => {
      if (document.visibilityState !== "visible") return;
      const height = document.documentElement.scrollHeight;
      maxDepth = Math.max(maxDepth, Math.min(1, height > 0 ? (window.scrollY + window.innerHeight) / height : 0));
    };
    const flush = () => { if (pageId) void finalizePageView(pageId, duration(), maxDepth); };
    const pause = () => {
      if (visibleSince != null) { elapsed += performance.now() - visibleSince; visibleSince = null; }
      flush();
    };
    const visibility = () => {
      if (document.visibilityState === "hidden") pause();
      else { if (visibleSince == null) visibleSince = performance.now(); measure(); }
    };
    const resume = () => { if (document.visibilityState === "visible" && visibleSince == null) visibleSince = performance.now(); };
    // Defer one tick so React Strict Mode's effect rehearsal never records a view.
    const timer = window.setTimeout(async () => {
      const referrer = previousPath.current;
      previousPath.current = path;
      const session = await readySession();
      if (!session) return;
      if (!disposed) measure();
      pageId = await trackPageView(session, path, referrer || undefined);
      // Finalize the correct visit even if its response arrives after navigation.
      if (disposed || document.visibilityState === "hidden") flush();
    }, 0);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pagehide", pause);
    window.addEventListener("pageshow", resume);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      pause();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pagehide", pause);
      window.removeEventListener("pageshow", resume);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [pathname]);
}

export function useAnalytics() {
  const trackEvent = useCallback((type: string, target?: string, metadata?: Record<string, unknown>) => {
    const path = window.location.pathname;
    if (!trackingAllowed(path)) return;
    void readySession().then(session => { if (session) void trackInteraction(session, type, target, metadata, path); });
  }, []);
  return { trackEvent };
}
