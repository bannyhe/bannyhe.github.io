import { lazy, Suspense, useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUp, ChevronLeft, ChevronRight, Download, Eye, LayoutDashboard, List, LogOut, Map as MapIcon, MousePointer2, RefreshCw, Route, Search, Users, X, FileText } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { AdminDataProvider, useAdminQuery, type Seed } from "./adminApi";
import { TIME_RANGES, actionName, downloadCsv, endpoint, formatDate, formatDuration, formatNumber, formatPercent, locationName, mergeReferrers, pageName, rangeStart, rankTransitions, referrerName, type ActionRow, type DeviceData, type FlowData, type GeoRow, type Overview, type PageRow, type ReferrerRow, type TimeRange, type TimelineRow, type View, type VisitDetail, type VisitList } from "./adminModel";
import { TrafficChart } from "./TrafficChart";
import { countryFlag } from "./countryFlag";
const VisitorMap = lazy(() => import("./VisitorMap").then(module => ({ default: module.VisitorMap })).catch(() => ({ default: () => <p className="admin-muted">The map could not load. Please use the location list.</p> })));
type Query<T> = { data?: T; loading: boolean; error?: string; at?: number; retry: () => void };
function Loading() {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setSlow(true), 6000); return () => clearTimeout(timer); }, []);
  return <div className="admin-loading" role="status"><span className="admin-spinner" aria-hidden="true" /><span>{slow ? "Waiting for the analytics service…" : "Loading insights…"}</span></div>;
}
function Empty({ children }: { children: ReactNode }) { return <p className="admin-empty">{children}</p>; }
function Panel<T>({ title, description, query, children, tools, className = "" }: { title: string; description?: string; query: Query<T>; children: ReactNode; tools?: ReactNode; className?: string }) {
  const id = useId();
  return <section className={`admin-panel ${className}`} aria-labelledby={id} aria-busy={query.loading}>
    <div className="admin-panel-heading"><div><h2 id={id}>{title}</h2>{description && <p>{description}</p>}</div>{tools}</div>
    {query.error && <div className="admin-error" role="alert"><span>{query.data ? "Refresh failed. Showing the previous results. " : ""}{query.error}</span><button type="button" onClick={query.retry}>Retry</button></div>}
    {query.loading && !query.data ? <Loading /> : children}
    {query.loading && query.data && <p className="admin-updating" role="status">Updating…</p>}
  </section>;
}
function Rankings({ rows, empty = "No data in this period." }: { rows: { name: string; count: number; detail?: string }[]; empty?: string }) {
  const maximum = Math.max(1, ...rows.map(row => row.count));
  return rows.length ? <ul className="admin-rankings">{rows.map((row, index) => <li key={`${row.name}-${index}`}><div><span>{row.name}{row.detail && <small>{row.detail}</small>}</span><strong>{formatNumber(row.count)}</strong></div><div className="admin-meter" aria-hidden="true"><span style={{ width: `${row.count / maximum * 100}%` }} /></div></li>)}</ul> : <Empty>{empty}</Empty>;
}
function OverviewPanels({ since, range }: { since: string; range: TimeRange }) {
  const config = TIME_RANGES.find(item => item.value === range)!;
  const timeline = useAdminQuery<TimelineRow[]>(endpoint("timeline", since, { days: config.days, granularity: config.granularity }));
  const sources = useAdminQuery<ReferrerRow[]>(endpoint("referrers", since));
  const actions = useAdminQuery<ActionRow[]>(endpoint("interactions", since));
  const sourceRows = mergeReferrers(sources.data || []);
  const grouped = new Map<string, number>();
  (actions.data || []).forEach(row => grouped.set(row.type, (grouped.get(row.type) || 0) + Number(row.count)));
  return <>
    <Panel title="Traffic over time" description="See when people discover and return to your portfolio. Times are in UTC." query={timeline} tools={<button className="admin-button admin-button-quiet" type="button" disabled={!timeline.data?.length} onClick={() => downloadCsv(`portfolio-traffic-${range}.csv`, [["Date / time (UTC)", "Visits", "Page views"], ...(timeline.data || []).map(row => [row.date, row.sessions, row.pageViews])])}><Download size={16} /> Export</button>}>
      {timeline.data && (timeline.data.length ? <><TrafficChart rows={timeline.data} /><p className="admin-footnote">Totals cover the full period; the chart may omit the first partial hour or day.</p></> : <Empty>No traffic recorded in this period.</Empty>)}
    </Panel>
    <div className="admin-two-column">
      <Panel title="Where visits come from" description="External referral sources, grouped by website." query={sources}>
        {sources.data && <><Rankings rows={sourceRows} empty="No external referrals recorded in this period." /><p className="admin-footnote">Top reported referrers. Direct visits and unreported sources are not included.</p></>}
      </Panel>
      <Panel title="Actions that signal interest" description="See which next steps visitors choose." query={actions}>
        {actions.data && <><Rankings rows={[...grouped].sort((a, b) => b[1] - a[1]).map(([type, count]) => ({ name: actionName(type), count }))} empty="No tracked actions in this period." />
          {actions.data.length > 0 && <details className="admin-action-details"><summary>Break down actions by destination</summary><ul>{actions.data.map((row, i) => <li key={i}><span>{actionName(row.type)}<small>{row.type === "project_view" ? pageName(`/project/${row.target}`) : row.target || "Not specified"}</small></span><strong>{formatNumber(row.count)}</strong></li>)}</ul></details>}
          <p className="admin-footnote">Top 50 action destinations. Counts represent clicks, not completed downloads or conversations.</p></>}
      </Panel>
    </div>
  </>;
}
function ContentPanel({ since, range }: { since: string; range: TimeRange }) {
  const pages = useAdminQuery<PageRow[]>(endpoint("pages", since));
  const [search, setSearch] = useState("");
  const [projectsOnly, setProjectsOnly] = useState(false);
  const [sort, setSort] = useState<{ key: "views" | "avg_duration_ms" | "avg_scroll_depth"; ascending: boolean }>({ key: "views", ascending: false });
  const rows = (pages.data || []).filter(row => row.path !== "/admin" && (!projectsOnly || row.path.startsWith("/project/")) && `${pageName(row.path)} ${row.path}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
    if (a[sort.key] == null) return b[sort.key] == null ? 0 : 1;
    if (b[sort.key] == null) return -1;
    return (Number(a[sort.key]) - Number(b[sort.key])) * (sort.ascending ? 1 : -1);
  });
  function sortBy(key: typeof sort.key) { setSort(value => ({ key, ascending: value.key === key ? !value.ascending : false })); }
  return <Panel title="Page performance" description="Find the work visitors explore most, and where they spend time." query={pages} tools={<button className="admin-button" type="button" disabled={!rows.length} onClick={() => downloadCsv(`portfolio-pages-${range}.csv`, [["Page", "Path", "Views", "Average recorded time (seconds)", "Average scroll (%)", "Since (UTC)"], ...rows.map(row => [pageName(row.path), row.path, row.views, row.avg_duration_ms == null ? null : Math.round(row.avg_duration_ms / 1000), row.avg_scroll_depth == null ? null : Math.round(row.avg_scroll_depth * 100), since])])}><Download size={16} /> Export CSV</button>}>
    <div className="admin-content-tools"><div className="admin-segmented" aria-label="Page category"><button type="button" aria-pressed={!projectsOnly} onClick={() => setProjectsOnly(false)}>All pages</button><button type="button" aria-pressed={projectsOnly} onClick={() => setProjectsOnly(true)}>Projects</button></div><label className="admin-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search pages</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Find a page or project" /></label></div>
    {pages.data && <><div className="admin-table-scroll"><table className="admin-pages-table"><caption className="sr-only">Page engagement for the selected time range</caption><thead><tr><th scope="col">Page</th>{([["views", "Views"], ["avg_duration_ms", "Avg. time"], ["avg_scroll_depth", "Avg. scroll"]] as const).map(([key, label]) => <th key={key} scope="col" aria-sort={sort.key === key ? sort.ascending ? "ascending" : "descending" : "none"}><button type="button" onClick={() => sortBy(key)}>{label}{sort.key === key && (sort.ascending ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}</button></th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.path}><th scope="row"><span>{pageName(row.path)}</span><small>{row.path || "/"}</small></th><td><strong>{formatNumber(row.views)}</strong></td><td>{formatDuration(row.avg_duration_ms)}</td><td><span className="admin-depth"><span className="admin-meter" aria-hidden="true"><span style={{ width: `${Math.max(0, Math.min(1, row.avg_scroll_depth || 0)) * 100}%` }} /></span>{formatPercent(row.avg_scroll_depth)}</span></td></tr>)}</tbody></table></div>{!rows.length && <Empty>{search || projectsOnly ? "No pages match these filters." : "No page views recorded in this period."}</Empty>}<p className="admin-footnote">Up to 50 pages. Time and scroll averages include only views with reported measurements.</p></>}
  </Panel>;
}
function VisitDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const query = useAdminQuery<VisitDetail>(`/api/dashboard/visitors/${encodeURIComponent(id)}`);
  const dialog = useRef<HTMLDialogElement>(null), closeCallback = useRef(onClose); closeCallback.current = onClose;
  useEffect(() => {
    const element = dialog.current!, opener = document.activeElement, overflow = document.body.style.overflow;
    const closed = () => { if (!element.open) closeCallback.current(); };
    element.addEventListener("close", closed); document.body.style.overflow = "hidden"; element.showModal();
    return () => { element.removeEventListener("close", closed); element.close(); document.body.style.overflow = overflow; if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true }); };
  }, []);
  const visit = query.data;
  return <dialog className="admin-visit-dialog" ref={dialog} aria-labelledby="admin-visit-title" onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current?.close(); } }}>
    <header><div><p className="admin-eyebrow">Visit details</p><h2 id="admin-visit-title">{visit ? locationName(visit) : "Visit history"}</h2></div><button className="admin-icon-button" type="button" aria-label="Close visit details" onClick={() => dialog.current?.close()} autoFocus><X size={22} /></button></header>
    <div className="admin-visit-body">
      {query.loading && !visit && <Loading />}{query.error && <div className="admin-error" role="alert"><span>{query.error}</span><button type="button" onClick={query.retry}>Retry</button></div>}
      {visit && <><div className="admin-visit-meta"><div><span>Started (UTC)</span><strong>{formatDate(visit.first_seen_at)}</strong></div><div><span>Device</span><strong>{visit.device} · {visit.browser || "Unknown browser"}</strong></div><div><span>Source</span><strong>{referrerName(visit.referrer)}</strong></div><div><span>Campaign</span><strong>{[visit.utm_source, visit.utm_medium, visit.utm_campaign].filter(Boolean).join(" / ") || "Not reported"}</strong></div></div>
        <h3>Pages explored</h3><p className="admin-footnote">Full history for this visit, in UTC.</p>
        {visit.pageViews.length ? <ol className="admin-journey-timeline">{visit.pageViews.map(page => <li key={page.id}><div><strong>{pageName(page.path)}</strong><time>{formatDate(page.entered_at)}</time></div><p>{formatDuration(page.duration)} recorded · {formatPercent(page.scroll_depth)} scroll depth</p></li>)}</ol> : <Empty>No page history was recorded for this visit.</Empty>}
        <h3>Tracked actions</h3>{visit.interactions.length ? <ul className="admin-detail-actions">{visit.interactions.map(action => <li key={action.id}><strong>{actionName(action.type)}</strong><span>{pageName(action.path)} · {formatDate(action.created_at)}</span></li>)}</ul> : <Empty>No actions recorded during this visit.</Empty>}
      </>}
    </div>
  </dialog>;
}
function VisitsPanel({ since, location, onClear }: { since: string; location: string; onClear: () => void }) {
  const [page, setPage] = useState(1), [selected, setSelected] = useState<string | null>(null);
  const query = useAdminQuery<VisitList>(endpoint("visitors", since, { page, limit: 20, ...(location ? { location } : {}) }));
  const rows = query.data?.visitors || [];
  return <><Panel title="Recent visits" description={location ? `Visits from ${location}. This filter applies to the visit list.` : "Open a visit to see its page history, source, campaign, and actions."} query={query} tools={location && <button className="admin-button admin-button-quiet" type="button" onClick={onClear}><X size={16} /> Clear location</button>}>
    {query.data && <><div className="admin-table-scroll"><table className="admin-visits-table"><thead><tr><th scope="col">Location / visit</th><th scope="col">Device & browser</th><th scope="col">Pages</th><th scope="col">Started (UTC)</th></tr></thead><tbody>{rows.map(visit => <tr key={visit.id}><th scope="row"><button className="admin-visit-link" type="button" onClick={() => setSelected(visit.id)} aria-label={`Open visit from ${locationName(visit)}, ${formatDate(visit.first_seen_at)} UTC`}><span>{countryFlag(visit.country_code)} {locationName(visit)}</span><ChevronRight size={17} /></button></th><td><span className="admin-capitalize">{visit.device}</span><small>{visit.browser || "Unknown browser"}</small></td><td>{formatNumber(visit.page_view_count)}</td><td>{formatDate(visit.first_seen_at)}</td></tr>)}</tbody></table></div>{!rows.length && <Empty>No visits match this period and location.</Empty>}
      <div className="admin-pagination"><span>{query.data.total ? `${(page - 1) * 20 + 1}–${Math.min(page * 20, query.data.total)} of ${formatNumber(query.data.total)} visits` : "0 visits"}</span><div><button className="admin-button" type="button" disabled={page === 1 || query.loading} onClick={() => setPage(value => value - 1)}><ChevronLeft size={16} /> Previous</button><button className="admin-button" type="button" disabled={page >= query.data.totalPages || query.loading} onClick={() => setPage(value => value + 1)}>Next <ChevronRight size={16} /></button></div></div></>}
    </Panel>{selected && <VisitDrawer id={selected} onClose={() => setSelected(null)} />}</>;
}
function AudiencePanels({ since }: { since: string }) {
  const { theme } = useTheme();
  const geo = useAdminQuery<GeoRow[]>(endpoint("geo", since));
  const devices = useAdminQuery<DeviceData>(endpoint("devices", since));
  const [geoView, setGeoView] = useState<"list" | "map">("list"), [location, setLocation] = useState("");
  const [deviceView, setDeviceView] = useState<"device" | "browser" | "os">("device");
  const rows = deviceView === "device" ? devices.data?.byDevice.map(row => ({ name: row.device, count: Number(row.count) })) : deviceView === "browser" ? devices.data?.byBrowser.map(row => ({ name: row.browser, count: Number(row.count) })) : devices.data?.byOs?.map(row => ({ name: row.os, count: Number(row.count) }));
  const chooseLocation = (value: string) => setLocation(previous => previous === value ? "" : value);
  return <><div className="admin-two-column">
    <Panel title="Audience locations" description="Choose a location to filter the visit list below." query={geo} tools={<div className="admin-segmented" aria-label="Location display"><button type="button" aria-pressed={geoView === "list"} onClick={() => setGeoView("list")}><List size={16} /> List</button><button type="button" aria-pressed={geoView === "map"} onClick={() => setGeoView("map")}><MapIcon size={16} /> Map</button></div>}>
      {geo.data && <>{geoView === "map" ? <Suspense fallback={<Loading />}><VisitorMap rows={geo.data} theme={theme} selectedLocation={location || null} onSelect={chooseLocation} /></Suspense> : <div className="admin-location-list">{geo.data.map(row => <button key={row.location} type="button" aria-pressed={location === row.location} onClick={() => chooseLocation(row.location)}><span>{countryFlag(row.country_code)} {row.location}</span><strong>{formatNumber(row.visitors)}</strong></button>)}{!geo.data.length && <Empty>No location data in this period.</Empty>}</div>}<p className="admin-footnote">Approximate locations for all visits in this period. Up to 50 locations are reported.</p></>}
    </Panel>
    <Panel title="Devices & browsers" description="Understand how visitors experience your work." query={devices}>
      <div className="admin-segmented" aria-label="Audience breakdown">{(["device", "browser", "os"] as const).map(value => <button key={value} type="button" aria-pressed={deviceView === value} onClick={() => setDeviceView(value)}>{value === "device" ? "Devices" : value === "browser" ? "Browsers" : "Operating systems"}</button>)}</div>
      {devices.data && <Rankings rows={rows || []} empty="No device data in this period." />}
    </Panel>
  </div><VisitsPanel key={`${since}|${location}`} since={since} location={location} onClear={() => setLocation("")} /></>;
}
function JourneyPanel({ since, range, onAudience }: { since: string; range: TimeRange; onAudience: () => void }) {
  const query = useAdminQuery<FlowData>(endpoint("flow", since));
  const paths = rankTransitions(query.data || { nodes: [], links: [] });
  return <Panel title="Popular navigation paths" description="See which page visitors explore next. Each row represents a recorded transition." query={query} tools={<button className="admin-button" type="button" disabled={!paths.length} onClick={() => downloadCsv(`portfolio-paths-${range}.csv`, [["From", "To", "Transitions"], ...paths.map(path => [path.from, path.to, path.count])])}><Download size={16} /> Export CSV</button>}>
    {query.data && <>{paths.length ? <ol className="admin-paths">{paths.map((path, index) => <li key={`${path.from}-${path.to}`}><span className="admin-path-rank">{String(index + 1).padStart(2, "0")}</span><span>{pageName(path.from)}</span><ArrowRight size={18} aria-hidden="true" /><span>{pageName(path.to)}</span><strong>{formatNumber(path.count)}<small>transitions</small></strong></li>)}</ol> : <Empty>No page-to-page transitions recorded in this period.</Empty>}<p className="admin-footnote">Up to 30 paths. Repeated views of the same page and returns to Home are excluded from this report.</p><button className="admin-text-button" type="button" onClick={onAudience}>Explore individual visit histories <ArrowRight size={16} /></button></>}
  </Panel>;
}
const VIEWS = [{ id: "overview", label: "Overview", icon: LayoutDashboard }, { id: "content", label: "Content", icon: FileText }, { id: "audience", label: "Audience", icon: Users }, { id: "journeys", label: "Journeys", icon: Route }] as const;
function Workspace({ range, since, view, setView, changeRange, refresh, onLogout, autoRefresh, setAutoRefresh }: { range: TimeRange; since: string; view: View; setView: (view: View) => void; changeRange: (range: TimeRange) => void; refresh: () => void; onLogout: () => void; autoRefresh: boolean; setAutoRefresh: (value: boolean) => void }) {
  const overview = useAdminQuery<Overview>(endpoint("overview", since));
  const data = overview.data?.allTime;
  const metrics = [{ label: "Visits", value: data ? formatNumber(data.totalSessions) : "—", note: "Browser sessions", icon: Users }, { label: "Page views", value: data ? formatNumber(data.totalPageViews) : "—", note: "Pages opened", icon: Eye }, { label: "Tracked actions", value: data ? formatNumber(data.totalInteractions) : "—", note: "Project, résumé & contact clicks", icon: MousePointer2 }, { label: "Views per visit", value: data ? data.totalSessions ? (data.totalPageViews / data.totalSessions).toFixed(1) : "—" : "—", note: "Page views ÷ visits", icon: FileText }];
  return <main className="admin-page">
    <header className="admin-header"><div><p className="admin-eyebrow">Your portfolio, in perspective</p><h1>Portfolio analytics</h1><p>Understand what brings people in—and what keeps their attention.</p></div><button className="admin-button admin-button-quiet" type="button" onClick={onLogout}><LogOut size={17} /> Sign out</button></header>
    <div className="admin-toolbar"><label className="admin-range">Time range<select value={range} onChange={event => changeRange(event.target.value as TimeRange)}>{TIME_RANGES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><div className="admin-toolbar-status"><span className="admin-connection-dot" data-loading={overview.loading} aria-hidden="true" /><span role="status">{overview.loading ? "Updating insights…" : overview.error ? "Connection needs attention" : overview.at ? `Updated ${new Date(overview.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "Connecting…"}</span></div><label className="admin-auto-refresh"><input type="checkbox" checked={autoRefresh} onChange={event => setAutoRefresh(event.target.checked)} /> Update every minute</label><button className="admin-button" type="button" onClick={refresh} disabled={overview.loading}><RefreshCw size={17} /> Refresh</button></div>
    {overview.error && <div className="admin-error" role="alert"><span>{overview.data ? "Showing earlier totals. " : ""}{overview.error}</span><button type="button" onClick={overview.retry}>Retry totals</button></div>}
    <section className="admin-metrics" aria-label="Traffic summary" aria-busy={overview.loading}>{metrics.map(({ label, value, note, icon: Icon }) => <div className="admin-metric" key={label}><div><span>{label}</span><Icon size={19} aria-hidden="true" /></div><strong className={overview.loading && !data ? "admin-metric-pending" : ""}>{value}</strong><p>{note}</p></div>)}</section>
    <nav className="admin-view-nav" aria-label="Analytics views">{VIEWS.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-current={view === id ? "page" : undefined} onClick={() => setView(id)}><Icon size={18} aria-hidden="true" />{label}</button>)}</nav>
    <div className="admin-view-content" key={view}>{view === "overview" ? <OverviewPanels since={since} range={range} /> : view === "content" ? <ContentPanel since={since} range={range} /> : view === "audience" ? <AudiencePanels since={since} /> : <JourneyPanel since={since} range={range} onAudience={() => setView("audience")} />}</div>
    <p className="admin-bottom-note">Visits are browser sessions, not identified people. Report dates and times use UTC. Tracking respects Do Not Track.</p>
  </main>;
}
export default function AdminDashboard({ apiKey, seed, onLogout, onUnauthorized }: { apiKey: string; seed?: Seed; onLogout: () => void; onUnauthorized: () => void }) {
  const [range, setRange] = useState<TimeRange>("30d"), [since, setSince] = useState(() => seed?.since || rangeStart("30d")), [view, setView] = useState<View>("overview"), [revision, setRevision] = useState(0), [autoRefresh, setAutoRefresh] = useState(false);
  const refresh = useCallback(() => { setSince(rangeStart(range)); setRevision(value => value + 1); }, [range]);
  useEffect(() => { if (!autoRefresh) return; const timer = setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 60000); return () => clearInterval(timer); }, [autoRefresh, refresh]);
  function changeRange(value: TimeRange) { setRange(value); setSince(rangeStart(value)); }
  return <AdminDataProvider apiKey={apiKey} revision={revision} seed={seed} onUnauthorized={onUnauthorized}><Workspace range={range} since={since} view={view} setView={setView} changeRange={changeRange} refresh={refresh} onLogout={onLogout} autoRefresh={autoRefresh} setAutoRefresh={setAutoRefresh} /></AdminDataProvider>;
}
