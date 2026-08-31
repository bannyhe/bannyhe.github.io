import { useMemo, useState, type ReactNode } from "react";
import { COUNTRIES, COUNTRY_CENTROIDS, project } from "./worldLand";
import { countryFlag } from "./countryFlag";

export interface MapRow {
  location: string;
  country_code: string | null;
  visitors: number;
  /** Average of the visitors' geolocated coordinates. Absent on older API builds. */
  lat?: number | null;
  lon?: number | null;
}

interface Props {
  rows: MapRow[];
  theme: "light" | "dark";
  selectedLocation: string | null;
  onSelect: (location: string) => void;
}

// Crop the poles: Natural Earth land runs to Antarctica, which is dead space here.
const VIEW = { x: 0, y: 20, w: 1000, h: 390 };
const R_MIN = 5;
const R_MAX = 22;
const MAX_ZOOM = 12;

const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Blend two hex colors. t=0 -> a, t=1 -> b. */
function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${c(ar, br)},${c(ag, bg)},${c(ab, bb)})`;
}

export function VisitorMap({ rows, theme, selectedLocation, onSelect }: Props) {
  const [hoverCountry, setHoverCountry] = useState<string | null>(null);
  const [hoverPoint, setHoverPoint] = useState<string | null>(null);
  const [zoomTo, setZoomTo] = useState<string | null>(null);
  const dark = theme === "dark";

  // ── Aggregate ────────────────────────────────────────────────────────────
  const { points, unmapped, byCountry, maxCountry } = useMemo(() => {
    const maxVisitors = rows.reduce((m, r) => Math.max(m, r.visitors), 0) || 1;
    const mapped: Array<MapRow & { x: number; y: number; r: number; approx: boolean }> = [];
    const totals = new Map<string, { visitors: number; places: number }>();
    let missed = 0;

    for (const row of rows) {
      const cc = row.country_code?.toUpperCase() ?? null;
      if (cc && COUNTRIES[cc]) {
        const t = totals.get(cc) ?? { visitors: 0, places: 0 };
        t.visitors += row.visitors;
        t.places += 1;
        totals.set(cc, t);
      }

      let lon = num(row.lon);
      let lat = num(row.lat);
      let approx = false;
      // No per-visitor coordinates (older API build, or a private IP) — fall back
      // to the country's centroid so the pin still lands somewhere truthful.
      if (lon === null || lat === null) {
        const centroid = cc ? COUNTRY_CENTROIDS[cc] : undefined;
        if (centroid) { [lon, lat] = centroid; approx = true; }
      }
      if (lon === null || lat === null) { missed++; continue; }

      const { x, y } = project(lon, lat);
      mapped.push({ ...row, x, y, approx, r: R_MIN + (R_MAX - R_MIN) * Math.sqrt(row.visitors / maxVisitors) });
    }

    // Draw the biggest first so small pins stay clickable on top of them.
    mapped.sort((a, b) => b.r - a.r);
    const max = [...totals.values()].reduce((m, t) => Math.max(m, t.visitors), 0) || 1;
    return { points: mapped, unmapped: missed, byCountry: totals, maxCountry: max };
  }, [rows]);

  // ── Zoom transform ───────────────────────────────────────────────────────
  const { scale, tx, ty } = useMemo(() => {
    const shape = zoomTo ? COUNTRIES[zoomTo] : null;
    if (!shape) return { scale: 1, tx: 0, ty: 0 };

    let [x0, y0, x1, y1] = shape.b;
    // Countries whose main landmass crosses the antimeridian (Russia) get a box
    // spanning the whole world, which would not zoom at all. Use the centroid.
    if (x1 - x0 > VIEW.w * 0.5) {
      const c = COUNTRY_CENTROIDS[zoomTo];
      const p = c ? project(c[0], c[1]) : { x: VIEW.w / 2, y: VIEW.y + VIEW.h / 2 };
      x0 = p.x - 90; x1 = p.x + 90; y0 = p.y - 45; y1 = p.y + 45;
    }
    const pad = 0.18;
    const bw = Math.max(8, (x1 - x0) * (1 + pad));
    const bh = Math.max(8, (y1 - y0) * (1 + pad));
    const s = clamp(Math.min(VIEW.w / bw, VIEW.h / bh), 1, MAX_ZOOM);
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    return {
      scale: s,
      tx: VIEW.x + VIEW.w / 2 - s * cx,
      ty: VIEW.y + VIEW.h / 2 - s * cy,
    };
  }, [zoomTo]);

  const toScreen = (x: number, y: number) => ({ x: tx + scale * x, y: ty + scale * y });

  // ── Colors ──────────────────────────────────────────────────────────────
  const idleLand = dark ? "#334155" : "#e2e8f0";
  const borders = dark ? "#475569" : "#cbd5e1";
  const activeLo = dark ? "#4c1d95" : "#ede9fe";   // few visitors
  const activeHi = dark ? "#7c3aed" : "#8b5cf6";   // most visitors
  const activeHover = dark ? "#c4b5fd" : "#5b21b6";
  const pin = dark ? "#c4b5fd" : "#7c3aed";

  const activePoint = points.find(p => p.location === (hoverPoint ?? selectedLocation)) ?? null;
  const hoveredCountry = hoverCountry ? byCountry.get(hoverCountry) : undefined;
  const plottedVisitors = points.reduce((s, p) => s + p.visitors, 0);
  const approxCount = points.filter(p => p.approx).length;

  if (points.length === 0 && byCountry.size === 0) {
    return <p className="text-sm text-gray-600 dark:text-gray-300">No locations to plot yet.</p>;
  }

  const zoomShape = zoomTo ? COUNTRIES[zoomTo] : null;

  return (
    <div>
      <div style={{ position: "relative", width: "100%" }}>
        <svg
          viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
          style={{ width: "100%", height: "auto", display: "block" }}
          role="img"
          aria-label={`World map of visitor locations. ${points.length} locations across ${byCountry.size} countries.`}
        >
          <g
            transform={`translate(${tx} ${ty}) scale(${scale})`}
            style={{ transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)" }}
          >
            {Object.entries(COUNTRIES).map(([code, shape]) => {
              const total = byCountry.get(code);
              const isActive = !!total;
              const isHovered = hoverCountry === code;
              const isZoomed = zoomTo === code;

              let fill = idleLand;
              if (isActive) {
                const share = Math.sqrt(total!.visitors / maxCountry);
                fill = isHovered || isZoomed ? activeHover : mix(activeLo, activeHi, share);
              }
              return (
                <path
                  key={code}
                  d={shape.d}
                  fill={fill}
                  stroke={borders}
                  strokeWidth={0.6 / scale}
                  style={{
                    cursor: isActive ? "pointer" : "default",
                    transition: "fill 0.18s ease",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  onMouseEnter={isActive ? () => setHoverCountry(code) : undefined}
                  onMouseLeave={isActive ? () => setHoverCountry(null) : undefined}
                  onClick={isActive ? () => setZoomTo(prev => (prev === code ? null : code)) : undefined}
                />
              );
            })}

            {points.map(p => {
              const isOn = (hoverPoint ?? selectedLocation) === p.location;
              const dim = (hoverPoint ?? selectedLocation) !== null && !isOn;
              const cc = p.country_code?.toUpperCase() ?? null;
              // Small countries sit entirely under their own pin, so a pin click
              // has to zoom first — otherwise those countries could never be
              // opened. Once zoomed in, the pin filters instead.
              const zoomsFirst = !!cc && COUNTRIES[cc] && zoomTo !== cc;
              return (
                <circle
                  key={p.location}
                  cx={p.x}
                  cy={p.y}
                  r={p.r / scale}
                  fill={pin}
                  stroke={dark ? "#1e1b4b" : "#ffffff"}
                  strokeWidth={1.2 / scale}
                  style={{
                    cursor: "pointer",
                    fillOpacity: dim ? 0.25 : isOn ? 1 : 0.85,
                    transition: "fill-opacity 0.15s ease",
                  }}
                  onMouseEnter={() => setHoverPoint(p.location)}
                  onMouseLeave={() => setHoverPoint(null)}
                  onClick={e => {
                    e.stopPropagation();
                    if (zoomsFirst) setZoomTo(cc);
                    else onSelect(p.location);
                  }}
                />
              );
            })}
          </g>
        </svg>

        {/* Country tooltip — only when not hovering a specific city pin. */}
        {hoveredCountry && hoverCountry && !activePoint && (() => {
          const shape = COUNTRIES[hoverCountry];
          const c = { x: (shape.b[0] + shape.b[2]) / 2, y: (shape.b[1] + shape.b[3]) / 2 };
          const s = toScreen(c.x, c.y);
          return (
            <Tooltip dark={dark} x={s.x} y={s.y}>
              <div style={{ fontWeight: 600 }}>{countryFlag(hoverCountry)} {shape.n}</div>
              <div style={{ color: dark ? "#c4b5fd" : "#7c3aed", fontWeight: 600 }}>
                {hoveredCountry.visitors} {hoveredCountry.visitors === 1 ? "visitor" : "visitors"}
                <span style={{ color: dark ? "#94a3b8" : "#64748b", fontWeight: 400 }}>
                  {" "}· {hoveredCountry.places} {hoveredCountry.places === 1 ? "location" : "locations"}
                </span>
              </div>
              <div style={{ color: dark ? "#94a3b8" : "#64748b" }}>
                {zoomTo === hoverCountry ? "Click to zoom out" : "Click to zoom in"}
              </div>
            </Tooltip>
          );
        })()}

        {/* City pin tooltip */}
        {activePoint && (() => {
          const s = toScreen(activePoint.x, activePoint.y);
          return (
            <Tooltip dark={dark} x={s.x} y={s.y}>
              <div style={{ fontWeight: 600 }}>
                {countryFlag(activePoint.country_code)} {activePoint.location}
              </div>
              <div style={{ color: dark ? "#c4b5fd" : "#7c3aed", fontWeight: 600 }}>
                {activePoint.visitors} {activePoint.visitors === 1 ? "visitor" : "visitors"}
                <span style={{ color: dark ? "#94a3b8" : "#64748b", fontWeight: 400 }}>
                  {" "}· {Math.round((activePoint.visitors / plottedVisitors) * 100)}% of plotted
                </span>
              </div>
              {activePoint.approx && (
                <div style={{ color: dark ? "#94a3b8" : "#64748b" }}>Approximate — country center</div>
              )}
              <div style={{ color: dark ? "#94a3b8" : "#64748b" }}>
                {activePoint.country_code && zoomTo !== activePoint.country_code.toUpperCase()
                  ? "Click to zoom in"
                  : "Click to filter"}
              </div>
            </Tooltip>
          );
        })()}

        {zoomShape && (
          <button
            onClick={() => setZoomTo(null)}
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              fontSize: 12,
              fontWeight: 500,
              padding: "4px 10px",
              borderRadius: 9999,
              cursor: "pointer",
              color: dark ? "#e9d5ff" : "#5b21b6",
              background: dark ? "rgba(76,29,149,0.85)" : "rgba(255,255,255,0.92)",
              border: `1px solid ${dark ? "rgba(196,181,253,0.4)" : "rgba(139,92,246,0.35)"}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            ← Back to world
          </button>
        )}
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300 mt-3">
        {zoomShape ? (
          // Zoomed in: describe this country only. The approximate/unmapped
          // tallies below are world-wide, so they would mislead here.
          `${countryFlag(zoomTo)} ${zoomShape.n} · ${byCountry.get(zoomTo!)?.visitors ?? 0} visitors · ${byCountry.get(zoomTo!)?.places ?? 0} ${byCountry.get(zoomTo!)?.places === 1 ? "location" : "locations"}`
        ) : (
          <>
            {`${points.length} ${points.length === 1 ? "location" : "locations"} · ${byCountry.size} ${byCountry.size === 1 ? "country" : "countries"} · ${plottedVisitors} plotted`}
            {approxCount > 0 && ` · ${approxCount} at country center`}
            {unmapped > 0 && ` · ${unmapped} without coordinates`}
          </>
        )}
      </p>
    </div>
  );
}

function Tooltip({ dark, x, y, children }: { dark: boolean; x: number; y: number; children: ReactNode }) {
  const leftPct = clamp(((x - VIEW.x) / VIEW.w) * 100, 0, 100);
  const topPct = clamp(((y - VIEW.y) / VIEW.h) * 100, 0, 100);
  return (
    <div
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translate(-50%, calc(-100% - 10px))",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 10,
        padding: "6px 10px",
        borderRadius: 8,
        fontSize: 12,
        lineHeight: 1.35,
        color: dark ? "#f8fafc" : "#0f172a",
        background: dark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.97)",
        border: `1px solid ${dark ? "rgba(148,163,184,0.35)" : "rgba(148,163,184,0.45)"}`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
      }}
    >
      {children}
    </div>
  );
}
