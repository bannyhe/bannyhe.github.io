import { lazy, Suspense, useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Settings2 } from "lucide-react";
import { clearKey, getServerBase, readKey, request, saveKey, saveServerBase, type Seed } from "../components/admin/adminApi";
import { endpoint, rangeStart, type Overview } from "../components/admin/adminModel";
import "../styles/admin.css";
const loadDashboard = () => import("../components/admin/AdminDashboard");
const AdminDashboard = lazy(loadDashboard);
function LoginScreen({ onLogin, message }: { onLogin: (key: string, seed: Seed) => void; message?: string }) {
  const [key, setKey] = useState(""), [showKey, setShowKey] = useState(false), [remember, setRemember] = useState(false), [error, setError] = useState(message || ""), [loading, setLoading] = useState(false), [slow, setSlow] = useState(false), [settings, setSettings] = useState(false), [server, setServer] = useState(getServerBase), [draft, setDraft] = useState(getServerBase);
  const active = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 75000);
    // One user-initiated visit can wake an idle host while the key is entered.
    fetch(`${server}/health`, { signal: controller.signal, cache: "no-store" }).catch(() => {});
    return () => { clearTimeout(timer); controller.abort(); active.current?.abort(); };
  }, [server]);
  useEffect(() => { if (!loading) { setSlow(false); return; } const timer = setTimeout(() => setSlow(true), 6000); return () => clearTimeout(timer); }, [loading]);
  async function submit(event: FormEvent) {
    event.preventDefault(); if (!key.trim() || loading) return;
    const controller = new AbortController(); active.current = controller; setLoading(true); setError("");
    const since = rangeStart("30d"), path = endpoint("overview", since);
    // Download the dashboard while authentication is in flight, not beforehand.
    void loadDashboard().catch(() => {});
    try {
      const data = await request<Overview>(server, path, key.trim(), controller.signal);
      if (controller.signal.aborted) return;
      saveKey(key.trim(), remember); onLogin(key.trim(), { path, data, since, at: Date.now() });
    } catch (failure) { if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "Unable to sign in. Please retry."); }
    finally { if (active.current === controller) { active.current = null; setLoading(false); } }
  }
  function cancel() { active.current?.abort(); active.current = null; setLoading(false); }
  function saveServer(event: FormEvent) { event.preventDefault(); try { const base = saveServerBase(draft.trim()); setServer(base); setDraft(base); setSettings(false); setError(""); } catch (failure) { setError((failure as Error).message); } }
  return <main className="admin-page admin-login-page"><section className="admin-login-card" aria-labelledby="admin-login-title">
    <div className="admin-login-mark"><LockKeyhole size={27} aria-hidden="true" /></div><p className="admin-eyebrow">Portfolio workspace</p><h1 id="admin-login-title">Welcome back.</h1><p className="admin-login-intro">See how people discover, explore, and connect with your work.</p>
    <form onSubmit={submit}><label className="admin-field-label" htmlFor="api-key">Dashboard API key</label><div className="admin-key-field"><input id="api-key" type={showKey ? "text" : "password"} autoComplete="current-password" value={key} onChange={event => setKey(event.target.value)} placeholder="Enter your API key" disabled={loading} required autoFocus /><button type="button" className="admin-icon-button" aria-label={showKey ? "Hide API key" : "Show API key"} aria-pressed={showKey} onClick={() => setShowKey(value => !value)}>{showKey ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>
      <label className="admin-remember"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} /> Stay signed in on this device</label>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <button className="admin-button admin-button-primary admin-sign-in" type="submit" disabled={loading || !key.trim()}>{loading ? <><span className="admin-spinner" aria-hidden="true" /> Connecting…</> : <>Open analytics <ArrowRight size={18} /></>}</button>
      {loading && <div className="admin-login-status" role="status"><p>{slow ? "The analytics service may be waking up. This can take about a minute." : "Connecting to your analytics service…"}</p><button type="button" className="admin-text-button" onClick={cancel}>Cancel</button></div>}
    </form>
    <button type="button" className="admin-server-toggle" aria-expanded={settings} aria-controls="admin-server-settings" disabled={loading} onClick={() => setSettings(value => !value)}><Settings2 size={16} /> Connection settings</button>
    {settings && <form id="admin-server-settings" className="admin-server-settings" onSubmit={saveServer}><label className="admin-field-label" htmlFor="analytics-server">Analytics server URL</label><input id="analytics-server" type="url" value={draft} onChange={event => setDraft(event.target.value)} required /><p>Use the address of your analytics service.</p><div><button className="admin-button" type="submit">Save address</button><button className="admin-button admin-button-quiet" type="button" onClick={() => { setDraft(server); setSettings(false); }}>Cancel</button></div></form>}
  </section></main>;
}
export function AdminPage() {
  const [apiKey, setApiKey] = useState(readKey), [seed, setSeed] = useState<Seed | undefined>(), [message, setMessage] = useState("");
  const logout = useCallback(() => { clearKey(); setApiKey(null); setSeed(undefined); setMessage(""); }, []);
  const unauthorized = useCallback(() => { clearKey(); setApiKey(null); setSeed(undefined); setMessage("Your API key was not accepted. Please sign in again."); }, []);
  return apiKey ? <Suspense fallback={<main className="admin-page"><div className="admin-loading" role="status"><span className="admin-spinner" aria-hidden="true" /> Opening your workspace…</div></main>}><AdminDashboard apiKey={apiKey} seed={seed} onLogout={logout} onUnauthorized={unauthorized} /></Suspense> : <LoginScreen message={message} onLogin={(key, data) => { setSeed(data); setApiKey(key); }} />;
}
