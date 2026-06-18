import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Sankey,
} from "recharts";
import { Lock, RefreshCw, LogOut, Users, Eye, EyeOff, MousePointer, TrendingUp, Globe, Monitor, Smartphone, Tablet } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const BASE = import.meta.env.VITE_ANALYTICS_URL ?? "http://localhost:3001";
const KEY_STORAGE = "admin_api_key";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Overview {
  allTime: { totalSessions: number; totalPageViews: number; totalInteractions: number };
  last30Days: { sessions: number };
}
interface TimelineRow   { date: string; sessions: number; pageViews: number }
interface PageRow       { path: string; views: number; avg_duration_ms: number; avg_scroll_depth: number }
interface GeoRow        { location: string; country_code: string; visitors: number }
interface DeviceData    { byDevice: { device: string; count: number }[]; byBrowser: { browser: string; count: number }[] }
interface FlowData      { nodes: { name: string }[]; links: { source: number; target: number; value: number }[] }
interface VisitorRow    { id: string; country: string | null; city: string | null; device: string; browser: string | null; first_seen_at: string; page_view_count: number; ip_masked: string | null }

// ── API helper ─────────────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, key: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: { "x-api-key": key } });
    if (res.status === 401) return null;
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

type LoginResult = "ok" | "wrong-key" | "network-error";

async function loginCheck(key: string): Promise<LoginResult> {
  try {
    const res = await fetch(`${BASE}/api/dashboard/overview`, { headers: { "x-api-key": key } });
    if (res.ok) return "ok";
    return "wrong-key";
  } catch {
    return "network-error";
  }
}

// ── Login screen ───────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState<LoginResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await loginCheck(key);
    setLoading(false);
    if (result !== "ok") { setError(result); return; }
    localStorage.setItem(KEY_STORAGE, key);
    onLogin(key);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl"
      >
        {/* Full-width card matching nav content bounds */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-pink-50/90 dark:from-gray-900/80 dark:via-purple-950/30 dark:to-gray-900/80 border border-purple-200/50 dark:border-purple-700/30 rounded-2xl shadow-2xl py-14 px-6 md:px-12">
          {/* Form stays at a sensible width, centered */}
          <div className="max-w-sm mx-auto w-full">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-purple-700 dark:text-purple-300" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin</h1>
              <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">Enter your dashboard API key</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/*
                Container owns the border/background. Input is unstyled (transparent).
                right-4 = 16px from right border, mirrors pl-4 = 16px left text gap — symmetric.
              */}
              <div className="relative rounded-xl bg-white/80 dark:bg-gray-800/90 border border-purple-200/70 dark:border-purple-600/40 focus-within:ring-2 focus-within:ring-purple-500 transition">
                <input
                  id="api-key"
                  aria-label="API key"
                  type={showKey ? "text" : "password"}
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  placeholder="API key"
                  autoFocus
                  className="block w-full pl-6 pr-11 py-3 bg-transparent text-gray-800 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(v => !v)}
                  tabIndex={-1}
                  aria-label={showKey ? "Hide API key" : "Show API key"}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error === "wrong-key" && (
                <p className="text-sm text-red-700 dark:text-red-300 text-center" role="alert">Incorrect API key.</p>
              )}
              {error === "network-error" && (
                <p className="text-sm text-red-700 dark:text-red-300 text-center" role="alert">Cannot reach the analytics server.</p>
              )}
              {/*
                disabled:bg-purple-700/50 reduces ONLY the background opacity, so text-white
                stays at full opacity and remains readable. disabled:opacity-50 would fade the
                text too, making white invisible against the light card background.
              */}
              <button
                type="submit"
                disabled={!key || loading}
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-purple-700/50 disabled:cursor-not-allowed text-gray-900 dark:text-white font-semibold transition"
              >
                {loading ? "Checking…" : "Enter"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: number | string; sub?: string }) {
  return (
    <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/40 border border-white/40 dark:border-gray-600/30 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
          <Icon className="w-5 h-5 text-purple-700 dark:text-purple-300" />
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
      </div>
      <p className="text-3xl font-bold text-gray-800 dark:text-white">{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{sub}</p>}
    </div>
  );
}

const DEVICE_ICON: Record<string, React.ElementType> = { mobile: Smartphone, tablet: Tablet, desktop: Monitor };
const CHART_COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

// ── Dashboard ──────────────────────────────────────────────────────────────────
function Dashboard({ apiKey, onLogout }: { apiKey: string; onLogout: () => void }) {
  const { theme } = useTheme();
  const tickColor = theme === "dark" ? "#d1d5db" : "#4b5563"; // gray-300 : gray-600

  const [overview, setOverview] = useState<Overview | null>(null);
  const [timeline, setTimeline] = useState<TimelineRow[]>([]);
  const [pages, setPages]       = useState<PageRow[]>([]);
  const [geo, setGeo]           = useState<GeoRow[]>([]);
  const [devices, setDevices]   = useState<DeviceData | null>(null);
  const [flow, setFlow]         = useState<FlowData>({ nodes: [], links: [] });
  const [visitors, setVisitors] = useState<VisitorRow[]>([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [ov, tl, pg, geo, dv, fl, vs] = await Promise.all([
      apiFetch<Overview>("/api/dashboard/overview", apiKey),
      apiFetch<TimelineRow[]>("/api/dashboard/timeline?days=30", apiKey),
      apiFetch<PageRow[]>("/api/dashboard/pages", apiKey),
      apiFetch<GeoRow[]>("/api/dashboard/geo", apiKey),
      apiFetch<DeviceData>("/api/dashboard/devices", apiKey),
      apiFetch<FlowData>("/api/dashboard/flow", apiKey),
      apiFetch<{ visitors: VisitorRow[] }>("/api/dashboard/visitors?limit=10", apiKey),
    ]);
    if (ov === null) { onLogout(); return; }
    setOverview(ov);
    setTimeline(tl ?? []);
    setPages(pg ?? []);
    setGeo(geo ?? []);
    setDevices(dv ?? null);
    setFlow(fl ?? { nodes: [], links: [] });
    setVisitors(vs?.visitors ?? []);
    setLoading(false);
  }, [apiKey, onLogout]);

  useEffect(() => { load(); }, [load]);

  function formatMs(ms: number | null) {
    if (!ms) return "—";
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function formatPath(path: string): string {
    const MAP: Record<string, string> = {
      "/": "Home", "": "Home",
      "/about": "About",
      "/resume": "Resume",
      "/project/malware-prevention": "Malware Prevention",
      "/project/northstar-onboarding": "Northstar Onboarding",
      "/project/vcf-network": "VCF Network",
      "/project/xenith-website": "Xenith Website",
    };
    return MAP[path] ?? path;
  }

  // Remap node names in flow data to human-readable labels
  const sankeyData = flow.nodes.length > 1 ? {
    nodes: flow.nodes.map(n => ({ name: formatPath(n.name) })),
    links: flow.links,
  } : null;

  return (
    <div className="min-h-screen px-4 pt-32 pb-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics</h1>
          <p className="text-gray-700 dark:text-gray-200 text-sm mt-1">Your portfolio visitor insights</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/30 dark:bg-gray-800/40 border border-white/40 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 text-sm hover:bg-white/50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/30 dark:bg-gray-800/40 border border-white/40 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 text-sm hover:bg-white/50 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </div>

      {loading && !overview ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Users}        label="Total Visitors"   value={overview?.allTime.totalSessions ?? 0}     sub="All time" />
              <StatCard icon={Eye}          label="Page Views"       value={overview?.allTime.totalPageViews ?? 0}    sub="All time" />
              <StatCard icon={MousePointer} label="Interactions"     value={overview?.allTime.totalInteractions ?? 0} sub="All time" />
              <StatCard icon={TrendingUp}   label="Visitors (30d)"   value={overview?.last30Days.sessions ?? 0}       sub="Last 30 days" />
            </div>

            {/* Timeline chart */}
            <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/40 border border-white/40 dark:border-gray-600/30 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Traffic — last 30 days</h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={timeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gPV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" />
                  <XAxis dataKey="date" tickFormatter={d => d.slice(5)} tick={{ fontSize: 11, fill: tickColor }} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor }} />
                  <Tooltip
                    contentStyle={{ background: "rgba(17,24,39,0.8)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, color: "#e5e7eb" }}
                    labelFormatter={d => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  />
                  <Area type="monotone" dataKey="sessions"  stroke="#8b5cf6" fill="url(#gSessions)" strokeWidth={2} name="Visitors" />
                  <Area type="monotone" dataKey="pageViews" stroke="#a78bfa" fill="url(#gPV)"       strokeWidth={2} name="Page Views" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pages + Geo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top pages */}
              <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/40 border border-white/40 dark:border-gray-600/30 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Pages</h2>
                <div className="space-y-3">
                  {pages.slice(0, 8).map(p => (
                    <div key={p.path} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{p.path || "/"}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          avg {formatMs(p.avg_duration_ms)} · scroll {Math.round((p.avg_scroll_depth ?? 0) * 100)}%
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300 shrink-0">{p.views}</span>
                    </div>
                  ))}
                  {pages.length === 0 && <p className="text-sm text-gray-600 dark:text-gray-300">No data yet.</p>}
                </div>
              </div>

              {/* Geo */}
              <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/40 border border-white/40 dark:border-gray-600/30 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-500" /> Visitors by Location
                </h2>
                <div className="space-y-3">
                  {geo.slice(0, 8).map((g, i) => {
                    const max = geo[0]?.visitors ?? 1;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-lg w-7 shrink-0">{countryFlag(g.country_code)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{g.location}</span>
                            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300 ml-2">{g.visitors}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${(g.visitors / max) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {geo.length === 0 && <p className="text-sm text-gray-600 dark:text-gray-300">No data yet.</p>}
                </div>
              </div>
            </div>

            {/* Devices + Interactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device breakdown */}
              <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/40 border border-white/40 dark:border-gray-600/30 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Devices</h2>
                <div className="flex gap-6 mb-4">
                  {(devices?.byDevice ?? []).map(d => {
                    const Icon = DEVICE_ICON[d.device] ?? Monitor;
                    const total = (devices?.byDevice ?? []).reduce((s, x) => s + x.count, 0) || 1;
                    return (
                      <div key={d.device} className="flex flex-col items-center gap-1">
                        <Icon className="w-6 h-6 text-purple-500" />
                        <span className="text-lg font-bold text-gray-800 dark:text-white">{Math.round(d.count / total * 100)}%</span>
                        <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">{d.device}</span>
                      </div>
                    );
                  })}
                </div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-4">Top Browsers</h3>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={devices?.byBrowser.slice(0, 5) ?? []} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="browser" tick={{ fontSize: 11, fill: tickColor }} width={60} />
                    <Tooltip
                      contentStyle={{ background: "rgba(17,24,39,0.8)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, color: "#e5e7eb" }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Visitors">
                      {(devices?.byBrowser.slice(0, 5) ?? []).map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Navigation flow Sankey */}
              <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/40 border border-white/40 dark:border-gray-600/30 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <MousePointer className="w-5 h-5 text-purple-500" /> Navigation Flow
                </h2>
                {sankeyData ? (
                  <div className="overflow-x-auto">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Sankey
                      width={460}
                      height={260}
                      data={sankeyData as any}
                      nodeWidth={12}
                      nodePadding={24}
                      margin={{ top: 8, right: 120, bottom: 8, left: 8 }}
                      link={{ stroke: "#8b5cf6", strokeOpacity: 0.35, fill: "none" }}
                      node={{ fill: "#8b5cf6", stroke: "#7c3aed", strokeWidth: 1 }}
                    >
                      <Tooltip
                        contentStyle={{ background: "rgba(17,24,39,0.85)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 10, color: "#e5e7eb", fontSize: 12 }}
                      />
                    </Sankey>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300">Not enough navigation data yet — visit a few pages first.</p>
                )}
              </div>
            </div>

            {/* Recent visitors */}
            <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/40 border border-white/40 dark:border-gray-600/30 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Visitors</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 dark:text-gray-300 border-b border-white/20 dark:border-gray-700/30">
                      <th className="pb-3 pr-4 font-medium">Location</th>
                      <th className="pb-3 pr-4 font-medium">Device</th>
                      <th className="pb-3 pr-4 font-medium">Browser</th>
                      <th className="pb-3 pr-4 font-medium">Pages</th>
                      <th className="pb-3 font-medium">First Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.map(v => (
                      <tr key={v.id} className="border-b border-white/10 dark:border-gray-700/20 last:border-0 hover:bg-white/10 transition">
                        <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-300">
                          {v.country
                            ? `${countryFlag(null)} ${v.city ? v.city + ", " : ""}${v.country}`.trim()
                            : <span className="font-mono text-xs text-gray-600 dark:text-gray-300">{v.ip_masked ?? "—"}</span>}
                        </td>
                        <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-300 capitalize">{v.device}</td>
                        <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-300">{v.browser ?? "—"}</td>
                        <td className="py-2.5 pr-4 text-purple-700 dark:text-purple-300 font-medium">{v.page_view_count}</td>
                        <td className="py-2.5 text-gray-600 dark:text-gray-300 text-xs">{formatDate(v.first_seen_at)}</td>
                      </tr>
                    ))}
                    {visitors.length === 0 && (
                      <tr><td colSpan={5} className="py-6 text-center text-gray-600 dark:text-gray-300">No visitors yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// Country code → flag emoji
function countryFlag(code: string | null): string {
  if (!code) return "🌐";
  return code.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

// ── Main page ──────────────────────────────────────────────────────────────────
export function AdminPage() {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem(KEY_STORAGE));

  function handleLogout() {
    localStorage.removeItem(KEY_STORAGE);
    setApiKey(null);
  }

  return apiKey
    ? <Dashboard apiKey={apiKey} onLogout={handleLogout} />
    : <LoginScreen onLogin={setApiKey} />;
}
