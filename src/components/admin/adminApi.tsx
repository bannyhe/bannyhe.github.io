import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
export const KEY_STORAGE = "admin_api_key";
const SERVER_STORAGE = "admin_server_url";
const DEFAULT_BASE = import.meta.env.VITE_ANALYTICS_URL || "http://localhost:3001";
export function getServerBase() { try { return (localStorage.getItem(SERVER_STORAGE) || DEFAULT_BASE).replace(/\/+$/, ""); } catch { return DEFAULT_BASE; } }
export function readKey() { try { return sessionStorage.getItem(KEY_STORAGE) || localStorage.getItem(KEY_STORAGE); } catch { return null; } }
export function saveKey(key: string, remember: boolean) { try { localStorage.removeItem(KEY_STORAGE); sessionStorage.removeItem(KEY_STORAGE); (remember ? localStorage : sessionStorage).setItem(KEY_STORAGE, key); } catch { /* The current sign-in remains valid without storage. */ } }
export function clearKey() { try { localStorage.removeItem(KEY_STORAGE); sessionStorage.removeItem(KEY_STORAGE); } catch { /* Storage may be disabled. */ } }
export function saveServerBase(value: string) {
  const url = new URL(value || DEFAULT_BASE);
  if (url.username || url.password || url.search || url.hash || (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)))) throw new Error("Use an HTTPS server address, or HTTP for localhost.");
  const base = url.toString().replace(/\/+$/, "");
  try { localStorage.setItem(SERVER_STORAGE, base); } catch { throw new Error("This browser cannot save the server address."); }
  return base;
}
export class AdminApiError extends Error { constructor(message: string, public status = 0) { super(message); this.name = "AdminApiError"; } }
export async function request<T>(base: string, path: string, key: string, signal?: AbortSignal, timeout = 75000): Promise<T> {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener("abort", cancel, { once: true });
  const timer = setTimeout(cancel, timeout);
  try {
    const response = await fetch(`${base}${path}`, { headers: { "x-api-key": key }, signal: controller.signal, cache: "no-store" });
    if (response.status === 401 || response.status === 403) throw new AdminApiError("Your API key was not accepted. Please sign in again.", response.status);
    if (!response.ok) throw new AdminApiError(`The analytics service returned an error (${response.status}). Please retry.`, response.status);
    return await response.json() as T;
  } catch (error) {
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
    if (error instanceof AdminApiError) throw error;
    throw new AdminApiError(controller.signal.aborted ? "The analytics service took too long to respond. Please retry." : "Unable to reach the analytics service. Check your connection or server address.");
  } finally { clearTimeout(timer); signal?.removeEventListener("abort", cancel); }
}
export interface CacheEntry { data: unknown; at: number; revision: number }
export interface Seed { path: string; data: unknown; since: string; at: number }
interface DataContext { base: string; apiKey: string; revision: number; cache: Map<string, CacheEntry>; onUnauthorized: () => void }
const Context = createContext<DataContext | null>(null);
export function AdminDataProvider({ apiKey, revision, seed, onUnauthorized, children }: { apiKey: string; revision: number; seed?: Seed; onUnauthorized: () => void; children: ReactNode }) {
  const cache = useRef(new Map<string, CacheEntry>());
  const initialized = useRef(false);
  if (!initialized.current) { initialized.current = true; if (seed) cache.current.set(seed.path, { data: seed.data, at: seed.at, revision: 0 }); }
  return <Context.Provider value={{ apiKey, base: getServerBase(), revision, cache: cache.current, onUnauthorized }}>{children}</Context.Provider>;
}
export function useAdminQuery<T>(path: string) {
  const context = useContext(Context)!;
  const { base, apiKey, revision, cache, onUnauthorized } = context;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ path: string; data?: T; loading: boolean; error?: string; at?: number }>(() => ({ path, data: cache.get(path)?.data as T, loading: !cache.has(path), at: cache.get(path)?.at }));
  useEffect(() => {
    const cached = cache.get(path);
    if (cached && cached.revision === revision && Date.now() - cached.at < 60000 && attempt === 0) {
      setState({ path, data: cached.data as T, loading: false, at: cached.at }); return;
    }
    const controller = new AbortController();
    setState({ path, data: cached?.data as T, loading: true, at: cached?.at });
    request<T>(base, path, apiKey, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      const at = Date.now(); cache.set(path, { data, at, revision }); setState({ path, data, loading: false, at });
    }).catch(error => {
      if (controller.signal.aborted) return;
      if (error instanceof AdminApiError && [401, 403].includes(error.status)) { onUnauthorized(); return; }
      setState({ path, data: cached?.data as T, loading: false, error: error.message, at: cached?.at });
    });
    return () => controller.abort();
  }, [base, apiKey, path, revision, attempt, cache, onUnauthorized]);
  return { ...(state.path === path ? state : { path, loading: true, data: undefined, error: undefined, at: undefined }), retry: () => setAttempt(value => value + 1) };
}
