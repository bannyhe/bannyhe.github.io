import { languageTag, isChinese, localize } from "../../i18n/locale.ts";
// PST is a fixed UTC-08:00 offset, including during daylight-saving months.
export const REPORT_TIME_ZONE = "Etc/GMT+8";
export const TIME_RANGES = [
  { value: "1h", label: "Last 1 hour", ms: 3600000, days: 1, granularity: "15min" },
  { value: "8h", label: "Last 8 hours", ms: 8 * 3600000, days: 1, granularity: "hour" },
  { value: "24h", label: "Last 24 hours", ms: 86400000, days: 1, granularity: "hour" },
  { value: "7d", label: "Last 7 days", ms: 7 * 86400000, days: 7, granularity: "day" },
  { value: "30d", label: "Last 30 days", ms: 30 * 86400000, days: 30, granularity: "day" },
] as const;
export type TimeRange = typeof TIME_RANGES[number]["value"];
export type View = "overview" | "content" | "audience" | "journeys";
export interface Overview { allTime: { totalSessions: number; totalPageViews: number; totalInteractions: number } }
export interface TimelineRow { date: string; sessions: number; pageViews: number }
export interface PageRow { path: string; views: number; avg_duration_ms: number | null; avg_scroll_depth: number | null }
export interface GeoRow { location: string; country_code: string | null; visitors: number; lat?: number; lon?: number }
export interface DeviceData { byDevice: { device: string; count: number }[]; byBrowser: { browser: string; count: number }[]; byOs?: { os: string; count: number }[] }
export interface FlowData { nodes: { name: string }[]; links: { source: number; target: number; value: number }[] }
export interface ReferrerRow { referrer: string; visitors: number }
export interface ActionRow { type: string; target: string | null; count: number }
export interface VisitorRow { id: string; country: string | null; country_code: string | null; region: string | null; city: string | null; device: string; browser: string | null; os?: string; first_seen_at: string; last_seen_at?: string; page_view_count: number; interaction_count?: number; referrer?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string }
export interface VisitList { visitors: VisitorRow[]; total: number; page: number; limit: number; totalPages: number }
export interface VisitDetail extends VisitorRow { pageViews: { id: string; path: string; entered_at: string; duration: number | null; scroll_depth: number | null }[]; interactions: { id: string; type: string; target: string; path: string; created_at: string }[] }
export const PAGE_NAMES: Record<string, string> = { "/": "Home", "/about": "About", "/resume": "Résumé", "/project/malware-prevention": "Malware Prevention", "/project/ai-assistant": "Network AI Assistant", "/project/northstar-onboarding": "Northstar Onboarding", "/project/vcf-network": "VCF Network Operations", "/project/xenith-website": "Xenith Website" };
export function canonicalPath(path: string) { return (path || "/").replace(/^\/?#(?=\/)/, "").split(/[?#]/)[0].replace(/\/$/, "") || "/"; }
export function pageName(path: string) { const canonical = canonicalPath(path); const chinese = /^\/zh(?:\/|$)/.test(canonical); const plain = canonical.replace(/^\/zh(?=\/|$)/, "") || "/"; return localize(PAGE_NAMES[plain] || path || "Home") + (chinese ? (isChinese ? " · 中文" : " · Chinese") : ""); }
export function formatNumber(value: number) { return Number(value || 0).toLocaleString(languageTag === "zh-CN" ? "zh-CN" : "en-US"); }
export function formatDuration(ms: number | null | undefined) {
  if (ms == null || !Number.isFinite(ms)) return "—";
  const seconds = Math.max(0, Math.round(ms / 1000));
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}
export function formatPercent(fraction: number | null | undefined) { return fraction == null || !Number.isFinite(fraction) ? "—" : `${Math.round(Math.max(0, Math.min(1, fraction)) * 100)}%`; }
export function formatDate(iso: string, short = false) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "—";
  return date.toLocaleString(languageTag === "zh-CN" ? "zh-CN" : "en-US", { timeZone: REPORT_TIME_ZONE, month: "short", day: "numeric", ...(short ? {} : { hour: "numeric", minute: "2-digit" }) });
}
export function formatTime(value: string | number | Date) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toLocaleTimeString(languageTag === "zh-CN" ? "zh-CN" : "en-US", { timeZone: REPORT_TIME_ZONE, hour: "numeric", minute: "2-digit" }) : "—";
}
export function formatExportDate(value: string | number | Date) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Date(date.getTime() - 8 * 3600000).toISOString().replace("Z", "-08:00");
}
// The API's bucket identifiers are UTC instants; convert the start time for display.
export function formatBucketLabel(value: string, compact = false) {
  const date = bucketDate(value);
  return compact && value.length > 10 ? formatTime(date) : formatDate(date.toISOString(), compact);
}
export function bucketDate(value: string) { return new Date(value.length === 10 ? `${value}T00:00:00Z` : value.length === 13 ? `${value}:00:00Z` : `${value}:00Z`); }
export function locationName(visit: Pick<VisitorRow, "city" | "region" | "country" | "country_code">) {
  return visit.country_code === "US" && visit.city && visit.region ? `${visit.city}, ${visit.region}` : [visit.city, visit.country].filter(Boolean).join(", ") || "Location unavailable";
}
export function referrerName(raw: string | null | undefined) { if (!raw) return "Direct / not reported"; try { return new URL(raw).hostname.replace(/^www\./, ""); } catch { return "Unrecognized source"; } }
export function actionName(type: string, target?: string | null) {
  if (type === "click" && target === "project_unlock") return "Project unlocks";
  return ({ project_view: "Project open clicks", contact_click: "Contact link clicks", resume_download: "Résumé download clicks" } as Record<string, string>)[type] || type.replace(/_/g, " ");
}
// A page view can be the password screen. Only a successful-submit event
// confirms access; missing events (including historical visits) remain unknown.
export function protectedProjectAccess(visit: Pick<VisitDetail, "pageViews" | "interactions">) {
  const projects = new Map<string, { path: string; unlockedAt: string | null }>();
  const include = (rawPath: string) => {
    const path = canonicalPath(rawPath);
    if (!/^\/(?:zh\/)?project\/(?:ai-assistant|vcf-network)$/.test(path)) return;
    if (!projects.has(path)) projects.set(path, { path, unlockedAt: null });
    return projects.get(path)!;
  };
  visit.pageViews.forEach(page => include(page.path));
  visit.interactions.forEach(action => {
    if (action.type !== "click" || action.target !== "project_unlock" || !Number.isFinite(Date.parse(action.created_at))) return;
    const project = include(action.path);
    if (project && (!project.unlockedAt || Date.parse(action.created_at) > Date.parse(project.unlockedAt))) project.unlockedAt = action.created_at;
  });
  return [...projects.values()];
}
// A stable minute boundary also lets the existing server's response cache work.
export function rangeStart(range: TimeRange, now = Date.now()) { return new Date(Math.floor(now / 60000) * 60000 - TIME_RANGES.find(item => item.value === range)!.ms).toISOString(); }
export function endpoint(name: string, since: string, extras: Record<string, string | number> = {}) {
  const query = new URLSearchParams({ since });
  Object.entries(extras).forEach(([key, value]) => query.set(key, String(value)));
  return `/api/dashboard/${name}?${query}`;
}
export function mergeReferrers(rows: ReferrerRow[]) {
  const groups = new Map<string, number>();
  rows.forEach(row => { const name = referrerName(row.referrer); groups.set(name, (groups.get(name) || 0) + Number(row.visitors)); });
  return [...groups].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}
export function rankTransitions(data: FlowData) {
  return data.links.flatMap(link => data.nodes[link.source] && data.nodes[link.target] && link.value > 0 ? [{ from: data.nodes[link.source].name, to: data.nodes[link.target].name, count: Number(link.value) }] : []).sort((a, b) => b.count - a.count);
}
export function toCsv(rows: (string | number | null | undefined)[][]) {
  return rows.map(row => row.map(value => {
    let text = value == null ? "" : String(value);
    if (typeof value === "string" && /^[\s]*[=+@\-]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  }).join(",")).join("\r\n");
}
export function downloadCsv(filename: string, rows: (string | number | null | undefined)[][]) {
  const url = URL.createObjectURL(new Blob(["\ufeff", toCsv(rows.map((row, index) => index === 0 ? row.map(value => typeof value === "string" ? localize(value) : value) : row))], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
