// Analytics client — fire-and-forget, never blocks the UI.
// All failures are swallowed so tracking never disrupts the visitor's experience.

const BASE_URL = import.meta.env.VITE_ANALYTICS_URL || "http://localhost:3001";
const SESSION_KEY = "portfolio_session_id";
const SESSION_EXPIRY_KEY = "portfolio_session_expiry";
// Session lasts 30 minutes of inactivity
const SESSION_TTL_MS = 30 * 60 * 1000;
let memorySession: { id: string; expiry: number } | undefined;
const pendingSessions = new Map<string, Promise<boolean>>();

// ─── Session ID ────────────────────────────────────────────────────────────────

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    const expiry = parseInt(localStorage.getItem(SESSION_EXPIRY_KEY) ?? "0", 10);

    if (existing && Date.now() < expiry) {
      // Refresh TTL on activity
      localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_TTL_MS));
      return existing;
    }
  } catch {
    // localStorage unavailable (private browsing, etc.)
  }

  const id = memorySession && Date.now() < memorySession.expiry ? memorySession.id : generateId();
  memorySession = { id, expiry: Date.now() + SESSION_TTL_MS };
  try {
    localStorage.setItem(SESSION_KEY, id);
    localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_TTL_MS));
  } catch {
    // ignore
  }
  return id;
}

// ─── Internal fetch helper ─────────────────────────────────────────────────────

async function post(path: string, body: unknown): Promise<Response | null> {
  // Respect Do Not Track
  if (navigator.doNotTrack === "1") return null;

  try {
    return await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true, // allows request to outlive the page
    });
  } catch {
    return null;
  }
}

async function patch(path: string, body: unknown): Promise<void> {
  if (navigator.doNotTrack === "1") return;
  try {
    await fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // ignore
  }
}

// ─── Public API ────────────────────────────────────────────────────────────────

async function initSession(sessionId: string): Promise<boolean> {
  const params = new URLSearchParams(window.location.search);
  const response = await post("/api/analytics/session", {
    sessionId,
    referrer: document.referrer || null,
    language: navigator.language,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
  });
  return !!response?.ok;
}

export function trackingAllowed(path = window.location.pathname) {
  return navigator.doNotTrack !== "1" && !/^\/admin(?:\/|$)/.test(path);
}

// Share initialization across page tracking and action handlers. The server must
// have accepted the session before any dependent records are sent.
export async function readySession(): Promise<string | null> {
  if (!trackingAllowed()) return null;
  const id = getOrCreateSessionId();
  let pending = pendingSessions.get(id);
  if (!pending) {
    pending = initSession(id);
    pendingSessions.set(id, pending);
  }
  if (await pending) return id;
  pendingSessions.delete(id); // Retry on the next activity after a network failure.
  return null;
}

export async function trackPageView(sessionId: string, path: string, referrer?: string): Promise<string | null> {
  const res = await post("/api/analytics/pageview", {
    sessionId,
    path,
    title: document.title,
    referrer: referrer ?? null,
  });
  if (!res || !res.ok) return null;
  try {
    const json = await res.json() as { pageViewId?: string };
    return json.pageViewId ?? null;
  } catch {
    return null;
  }
}

export async function finalizePageView(pageViewId: string, duration: number, scrollDepth: number): Promise<void> {
  await patch(`/api/analytics/pageview/${pageViewId}`, { duration, scrollDepth });
}

export async function trackInteraction(
  sessionId: string,
  type: string,
  target?: string,
  metadata?: Record<string, unknown>,
  path = window.location.pathname
): Promise<void> {
  if (!trackingAllowed(path)) return;
  await post("/api/analytics/interaction", {
    sessionId,
    type,
    target: target ?? null,
    path,
    metadata: metadata ?? null,
  });
}
