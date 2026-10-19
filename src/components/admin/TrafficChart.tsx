import { useEffect, useId, useRef, useState } from "react";
import { formatBucketLabel, formatNumber, type TimelineRow } from "./adminModel";
/** Small SVG chart: no charting library needs to load before the dashboard. */
export function TrafficChart({ rows }: { rows: TimelineRow[] }) {
  const host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(700);
  const [active, setActive] = useState<number | null>(null);
  const [metric, setMetric] = useState<"sessions" | "pageViews">("sessions");
  const id = useId().replace(/:/g, "");
  useEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(Math.max(240, entries[0].contentRect.width)));
    if (host.current) observer.observe(host.current); return () => observer.disconnect();
  }, []);
  useEffect(() => setActive(null), [rows]);
  const height = 225, left = 38, right = 14, top = 18, bottom = 30;
  const maximum = Math.max(1, ...rows.map(row => Number(row[metric])));
  const x = (index: number) => left + index / Math.max(1, rows.length - 1) * (width - left - right);
  const y = (value: number) => height - bottom - value / maximum * (height - top - bottom);
  const line = rows.map((row, i) => `${i ? "L" : "M"}${x(i)},${y(Number(row[metric]))}`).join(" ");
  const dateLabel = (date: string) => formatBucketLabel(date, true);
  const selected = active == null ? undefined : rows[active];
  return <div ref={host} className="admin-traffic">
    <div className="admin-segmented" aria-label="Traffic metric">{(["sessions", "pageViews"] as const).map(key => <button key={key} type="button" aria-pressed={metric === key} onClick={() => setMetric(key)}>{key === "sessions" ? "Visits" : "Page views"}</button>)}</div>
    <svg className="admin-traffic-chart" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="group" tabIndex={0} aria-label={`${metric === "sessions" ? "Visits" : "Page views"} over time. Use left and right arrow keys to inspect dates.`}
      onFocus={() => setActive(rows.length - 1)} onBlur={() => setActive(null)}
      onKeyDown={event => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); setActive(index => event.key === "Home" ? 0 : event.key === "End" ? rows.length - 1 : Math.max(0, Math.min(rows.length - 1, (index ?? rows.length - 1) + (event.key === "ArrowLeft" ? -1 : 1)))); } }}
      onPointerMove={event => { const rect = event.currentTarget.getBoundingClientRect(); setActive(Math.max(0, Math.min(rows.length - 1, Math.round((event.clientX - rect.left - left) / (width - left - right) * (rows.length - 1))))); }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--admin-accent)" stopOpacity=".22" /><stop offset="100%" stopColor="var(--admin-accent)" stopOpacity=".02" /></linearGradient></defs>
      {[0, .5, 1].map(tick => <g key={tick}><line x1={left} y1={y(maximum * tick)} x2={width - right} y2={y(maximum * tick)} className="admin-chart-grid" /><text x={left - 8} y={y(maximum * tick) + 4} textAnchor="end">{formatNumber(Math.round(maximum * tick))}</text></g>)}
      {rows.length > 0 && <><path d={`${line} L${x(rows.length - 1)},${height - bottom} L${left},${height - bottom} Z`} fill={`url(#${id})`} /><path d={line} fill="none" stroke="var(--admin-accent)" strokeWidth="2.5" strokeLinejoin="round" /></>}
      {[...new Set([0, Math.floor((rows.length - 1) / 2), rows.length - 1])].filter(i => rows[i]).map(i => <text key={i} x={x(i)} y={height - 5} textAnchor={i === 0 ? "start" : i === rows.length - 1 ? "end" : "middle"}>{dateLabel(rows[i].date)}</text>)}
      {selected && active != null && <g><line x1={x(active)} x2={x(active)} y1={top} y2={height - bottom} stroke="var(--admin-muted)" strokeDasharray="3 4" /><circle cx={x(active)} cy={y(Number(selected[metric]))} r="5" fill="var(--admin-accent)" stroke="var(--admin-surface)" strokeWidth="2" /></g>}
    </svg>
    <p className="admin-chart-readout" aria-live="polite">{selected ? <><strong>{formatBucketLabel(selected.date)} PST</strong><span>{formatNumber(selected.sessions)} visits · {formatNumber(selected.pageViews)} page views</span></> : "Point at the chart or use arrow keys to inspect traffic."}</p>
    <details className="admin-chart-data"><summary>View traffic data</summary><div className="admin-table-scroll"><table><thead><tr><th scope="col">Period starting (PST)</th><th scope="col">Visits</th><th scope="col">Page views</th></tr></thead><tbody>{rows.map(row => <tr key={row.date}><th scope="row">{formatBucketLabel(row.date)}</th><td>{formatNumber(row.sessions)}</td><td>{formatNumber(row.pageViews)}</td></tr>)}</tbody></table></div></details>
  </div>;
}
