import { useMemo, useState } from "react";
import { WORLD_LAND_PATH, COUNTRY_CENTROIDS, project } from "./worldLand";
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

const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

export function VisitorMap({ rows, theme, selectedLocation, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const dark = theme === "dark";

  const { points, unmapped } = useMemo(() => {
    const max = rows.reduce((m, r) => Math.max(m, r.visitors), 0) || 1;
    const mapped: Array<MapRow & { x: number; y: number; r: number; approx: boolean }> = [];
    let missed = 0;

    for (const row of rows) {
      let lon = num(row.lon);
      let lat = num(row.lat);
      let approx = false;

      // No per-visitor coordinates (older API build, or a private IP) — fall back
      // to the country's centroid so the pin still lands somewhere truthful.
      if (lon === null || lat === null) {
        const centroid = row.country_code
          ? COUNTRY_CENTROIDS[row.country_code.toUpperCase()]
          : undefined;
        if (centroid) {
          [lon, lat] = centroid;
          approx = true;
        }
      }
      if (lon === null || lat === null) { missed++; continue; }

      const { x, y } = project(lon, lat);
      mapped.push({ ...row, x, y, approx, r: R_MIN + (R_MAX - R_MIN) * Math.sqrt(row.visitors / max) });
    }

    // Draw the biggest first so small pins stay clickable on top of them.
    mapped.sort((a, b) => b.r - a.r);
    return { points: mapped, unmapped: missed };
  }, [rows]);

  const active = hovered ?? selectedLocation;
  const activePoint = points.find(p => p.location === active) ?? null;
  const plottedVisitors = points.reduce((sum, p) => sum + p.visitors, 0);
  const approxCount = points.filter(p => p.approx).length;

  const landFill = dark ? "#334155" : "#e2e8f0";
  const landStroke = dark ? "#475569" : "#cbd5e1";
  const pin = dark ? "#a78bfa" : "#8b5cf6";

  if (points.length === 0) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-300">
        No locations to plot yet.
      </p>
    );
  }

  return (
    <div>
      <div style={{ position: "relative", width: "100%" }}>
        <svg
          viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
          style={{ width: "100%", height: "auto", display: "block" }}
          role="img"
          aria-label={`World map of visitor locations. ${points.length} locations, ${plottedVisitors} visitors.`}
        >
          <path d={WORLD_LAND_PATH} fill={landFill} stroke={landStroke} strokeWidth={0.6} />

          {points.map(p => {
            const isActive = active === p.location;
            const dimmed = active !== null && !isActive;
            return (
              <g key={p.location}>
                {isActive && (
                  <circle cx={p.x} cy={p.y} r={p.r + 5} fill={pin} opacity={0.18} />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={p.r}
                  fill={pin}
                  stroke={dark ? "#1e1b4b" : "#ffffff"}
                  strokeWidth={1.2}
                  style={{
                    cursor: "pointer",
                    fillOpacity: dimmed ? 0.2 : isActive ? 0.95 : 0.7,
                    transition: "fill-opacity 0.15s ease",
                  }}
                  onMouseEnter={() => setHovered(p.location)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelect(p.location)}
                />
              </g>
            );
          })}
        </svg>

        {activePoint && (
          <div
            style={{
              position: "absolute",
              left: `${((activePoint.x - VIEW.x) / VIEW.w) * 100}%`,
              top: `${((activePoint.y - VIEW.y) / VIEW.h) * 100}%`,
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
              <div style={{ color: dark ? "#94a3b8" : "#64748b" }}>
                Approximate — country centre
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300 mt-3">
        {points.length} {points.length === 1 ? "location" : "locations"} · {plottedVisitors}{" "}
        {plottedVisitors === 1 ? "visitor" : "visitors"} plotted
        {approxCount > 0 && ` · ${approxCount} at country centre`}
        {unmapped > 0 && ` · ${unmapped} without coordinates`}
      </p>
    </div>
  );
}
