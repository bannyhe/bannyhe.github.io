# Design Document — bannyhe.github.io

**Author:** Mu He  
**Last updated:** June 2026  
**Status:** Production

---

## Table of Contents

1. [Overview](#1-overview)
2. [Goals and Non-Goals](#2-goals-and-non-goals)
3. [System Architecture](#3-system-architecture)
4. [Frontend Design](#4-frontend-design)
5. [Analytics Backend Design](#5-analytics-backend-design)
6. [Database Schema](#6-database-schema)
7. [API Design](#7-api-design)
8. [Security Model](#8-security-model)
9. [Privacy Considerations](#9-privacy-considerations)
10. [Performance Considerations](#10-performance-considerations)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Known Limitations & Future Work](#12-known-limitations--future-work)

---

## 1. Overview

This is the personal portfolio and UX case study site for Mu He, a UX designer at Broadcom. The site presents a curated selection of design projects, an about page, and a resume. It is publicly accessible at [bannyhe.github.io](https://bannyhe.github.io).

The system consists of two independent parts:

- **Frontend** — a static React SPA, hosted for free on GitHub Pages
- **Analytics backend** — a lightweight Node.js server that the owner runs locally (or on a cloud host), which records visitor behavior and exposes it through a protected admin dashboard

The two parts are deliberately decoupled: the frontend degrades gracefully if the backend is unreachable, and the backend can be replaced or upgraded without touching the frontend build.

---

## 2. Goals and Non-Goals

### Goals

- Present UX case studies in a visually polished, responsive format
- Support light and dark modes with system-preference detection
- Collect first-party visitor analytics (sessions, page views, navigation paths, device info, geolocation) without relying on third-party tracking services
- Surface collected analytics in a private admin dashboard visible only to the owner
- Keep infrastructure costs at zero for the frontend (GitHub Pages) and near-zero for the backend (free-tier cloud hosts)
- Avoid any npm install step for the analytics server to sidestep corporate network restrictions

### Non-Goals

- Server-side rendering or SEO optimization beyond what a static SPA provides
- Multi-user authentication or role-based access control
- Real-time analytics streaming (polling on demand is sufficient)
- Storing personally identifiable information beyond what is necessary for aggregate analytics

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Visitor's Browser                   │
│                                                         │
│   ┌──────────────────────────────────────────────────┐  │
│   │           React SPA (bannyhe.github.io)          │  │
│   │                                                  │  │
│   │  useAnalytics hook                               │  │
│   │  ├── initSession()  ──────────────────────────┐  │  │
│   │  ├── trackPageView() ─────────────────────────┤  │  │
│   │  ├── finalizePageView() (duration, scroll) ───┤  │  │
│   │  └── trackInteraction() ──────────────────────┤  │  │
│   └──────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS (fire-and-forget)
                           ▼
┌──────────────────────────────────────────────────────────┐
│              Analytics Server (Node.js 24)               │
│                                                          │
│   POST /api/analytics/session                            │
│   POST /api/analytics/pageview   ──► ip-api.com (geo)   │
│   PATCH /api/analytics/pageview/:id                      │
│   POST /api/analytics/interaction                        │
│                                                          │
│   GET /api/dashboard/*  (x-api-key protected)           │
│                                                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │              SQLite (analytics.db)              │   │
│   │  visitor_sessions · page_views · interactions   │   │
│   └─────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
                           ▲
                           │ /#/admin (API key login)
┌──────────────────────────┴──────────────────────────────┐
│                    Owner's Browser                      │
└─────────────────────────────────────────────────────────┘
```

Data flows in one direction: the frontend sends events to the backend; the backend never pushes anything back to regular visitors. The admin dashboard is a separate frontend view within the same SPA that pulls from the protected dashboard API.

---

## 4. Frontend Design

### 4.1 Routing

The app uses `HashRouter` from React Router DOM. Hash-based routing (`/#/about`, `/#/admin`) was chosen because GitHub Pages serves a single `index.html` with no server-side routing configuration. Hash URLs ensure direct links and browser refreshes always load `index.html` and let the client-side router take over.

```
/#/                              → HomePage
/#/about                         → AboutPage
/#/resume                        → ResumePage
/#/project/malware-prevention    → MalwarePreventionPage
/#/project/northstar-onboarding  → NorthstarOnboardingPage
/#/project/vcf-network           → VcfNetworkPage
/#/project/xenith-website        → XenithWebsitePage
/#/admin                         → AdminPage (API key gated)
```

### 4.2 Component Architecture

```
App
├── ThemeProvider          (light/dark state, localStorage persistence)
├── Router
│   └── AppContent         (useAnalytics hook lives here — inside Router)
│       ├── Navigation     (fixed top bar, theme toggle)
│       ├── Routes         (page components)
│       └── Footer         (social links)
```

`AppContent` is a separate inner component so that `useAnalytics` — which calls `useLocation()` — is mounted inside `<Router>`. This is a React Router constraint: location hooks cannot be called above the router boundary.

### 4.3 Theme System

Theming is implemented with a custom `ThemeContext` rather than a library, since the requirements are simple:

- On mount: read `localStorage('theme')` first; fall back to `window.matchMedia('prefers-color-scheme: dark')`
- On toggle: flip `light` ↔ `dark`, persist to `localStorage`, and add/remove the `dark` class on `<html>`
- Tailwind CSS's `darkMode: 'class'` strategy picks up the `dark` class and applies `dark:` variants

### 4.4 Analytics Hook (`useAnalytics`)

The hook is mounted once at `AppContent` level and handles the full tracking lifecycle:

```
Mount
 └── getOrCreateSessionId()        read/create UUID in localStorage (30-min TTL)
 └── initSession(sessionId)        POST /api/analytics/session

Route change (useLocation)
 └── finalizePageView(prev)        PATCH duration + scrollDepth for previous page
 └── trackPageView(sessionId, path) POST /api/analytics/pageview → returns pageViewId

Scroll (passive listener)
 └── update maxScrollDepth ref     track highest % scrolled on current page

visibilitychange = hidden
 └── finalizePageView(current)     flush duration + scroll on tab close / switch

Unmount (rare in SPA)
 └── finalizePageView(current)
```

Key design decisions:

- **Fire-and-forget**: every fetch is called without `await` at the call site. Failures are swallowed so the UI is never blocked or broken by a failed analytics request.
- **`keepalive: true`**: set on all fetch calls so requests survive page unloads (`beforeunload` fires too late in some browsers; `visibilitychange` + keepalive is more reliable).
- **Do Not Track**: `navigator.doNotTrack === "1"` is checked before every request; tracking is silently skipped if set.
- **Session TTL**: 30 minutes of inactivity generates a new session UUID, matching industry-standard session definitions.

### 4.5 Admin Dashboard

The `AdminPage` component implements its own auth gate. On load it reads a stored API key from `localStorage`. If present it immediately fetches all dashboard data; if not (or if a fetch returns 401) it renders a login form.

All seven dashboard data sources are fetched in parallel with `Promise.all` to minimize time-to-render:

```
overview · timeline · pages · geo · devices · flow · visitors
```

The Sankey chart (`recharts/Sankey`) visualizes page-to-page navigation transitions built from consecutive `page_views` rows within each session. Node names are mapped to human-readable labels (e.g., `/project/malware-prevention` → `Malware Prevention`).

---

## 5. Analytics Backend Design

### 5.1 Zero-Dependency Architecture

The server (`server/server.mjs`) uses only Node.js 24 built-in modules:

| Need | Built-in used |
|---|---|
| HTTP server | `node:http` |
| SQLite database | `node:sqlite` (stable in Node 23.4+) |
| IP hashing | `node:crypto` |
| Env config | `--env-file` CLI flag |
| Fetch (geolocation) | Global `fetch` (Node 18+) |
| UUID generation | `crypto.randomUUID()` |

This eliminates the `npm install` step entirely, which is important for corporate network environments where npm registry access may be restricted or slow.

### 5.2 Request Lifecycle

For each incoming analytics event:

```
1. Extract real IP (x-forwarded-for → socket.remoteAddress)
2. Check in-memory rate limit (200 req / 15 min per IP)
3. Parse User-Agent → browser, OS, device type, bot detection
4. Geolocate IP via ip-api.com (3s timeout, private IPs skipped)
5. Hash IP with SHA-256 + salt for storage
6. Mask IP (last octet → "x") for display
7. Write to SQLite
8. Return 204 No Content
```

Steps 3–6 happen synchronously (UA parsing, hashing, masking) or with a bounded async timeout (geolocation). The response is never held waiting for geolocation — the `await` resolves within 3 seconds or returns nulls.

### 5.3 Mini Router

Express is not used. The server implements a ~20-line path-matching router that supports `:param` segments:

```
routes = [{ method, path, handler }, ...]

matchRoute('GET', '/api/dashboard/visitors/abc123')
  → matches '/api/dashboard/visitors/:id' with params = { id: 'abc123' }
```

This keeps the server a single self-contained file with no external dependencies.

### 5.4 Rate Limiting

An in-memory `Map<ip, { count, resetAt }>` enforces a sliding window per IP. The map is pruned every 30 minutes to prevent unbounded memory growth. This is intentionally simple — a persistent rate-limit store (Redis, etc.) is not warranted for portfolio traffic volumes.

### 5.5 Geolocation

IP geolocation uses [ip-api.com](http://ip-api.com), a free service requiring no API key for non-commercial use (limit: 1,500 requests/minute). Private/loopback IPs (`10.x`, `192.168.x`, `127.x`, `::1`) are detected with a regex and skipped without making a network call.

---

## 6. Database Schema

SQLite with WAL journal mode (enables concurrent reads without blocking writes).

### `visitor_sessions`
One row per browser session. A new session is created when a visitor arrives with no `portfolio_session_id` in `localStorage`, or after 30 minutes of inactivity.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PK | Random hex ID |
| `session_id` | TEXT UNIQUE | UUID from visitor's localStorage |
| `ip_hash` | TEXT | SHA-256(ip + salt) — never reversible |
| `ip_raw` | TEXT | Full IP, only stored if `STORE_RAW_IP=true` |
| `ip_masked` | TEXT | Last octet masked (e.g. `192.168.1.x`) |
| `country`, `country_code` | TEXT | From ip-api.com |
| `region`, `city` | TEXT | State/region and city |
| `latitude`, `longitude` | REAL | Approx. coordinates |
| `timezone`, `isp` | TEXT | From ip-api.com |
| `user_agent` | TEXT | Raw UA string |
| `browser`, `browser_version` | TEXT | Parsed from UA |
| `os`, `os_version` | TEXT | Parsed from UA |
| `device` | TEXT | `desktop` \| `mobile` \| `tablet` |
| `language` | TEXT | `navigator.language` |
| `referrer` | TEXT | `document.referrer` on first load |
| `utm_source/medium/campaign` | TEXT | URL query params |
| `first_seen_at` | TEXT | ISO 8601, set on insert |
| `last_seen_at` | TEXT | ISO 8601, updated on revisit |
| `is_bot` | INTEGER | 1 if UA matched bot pattern |

### `page_views`
One row per route change within a session.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PK | Returned to client for patching |
| `session_id` | TEXT FK | → `visitor_sessions.id` |
| `path` | TEXT | React Router pathname |
| `title` | TEXT | `document.title` at time of view |
| `referrer` | TEXT | Previous path (internal navigation) |
| `entered_at` | TEXT | ISO 8601 |
| `exited_at` | TEXT | Set on finalize |
| `duration` | INTEGER | Milliseconds on page |
| `scroll_depth` | REAL | 0.0–1.0 (max scroll % reached) |

### `interactions`
Discrete user events beyond page views.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PK | |
| `session_id` | TEXT FK | → `visitor_sessions.id` |
| `type` | TEXT | One of the allowed event types below |
| `target` | TEXT | Element or component label |
| `path` | TEXT | Page where interaction occurred |
| `metadata` | TEXT | JSON blob for extra context |
| `created_at` | TEXT | ISO 8601 |

**Allowed interaction types:** `click`, `link_click`, `project_view`, `resume_download`, `contact_click`, `scroll_milestone`, `theme_toggle`

### Indexes

All foreign key columns, timestamp columns, and common filter columns (`path`, `country`, `device`, `type`) are indexed. The `is_bot = 0` filter on most dashboard queries benefits from the compound scan across the small table rather than a dedicated index.

---

## 7. API Design

### Analytics endpoints (public, rate-limited)

These are called by the frontend on every page load and navigation. They accept JSON bodies and return `204 No Content` on success.

```
POST /api/analytics/session
  Body: { sessionId, referrer?, language?, utmSource?, utmMedium?, utmCampaign? }
  → Upserts a session row; triggers geolocation async

POST /api/analytics/pageview
  Body: { sessionId, path, title?, referrer? }
  → Creates a page_view row; returns { pageViewId }

PATCH /api/analytics/pageview/:id
  Body: { duration, scrollDepth }
  → Finalizes a page view with time-on-page and max scroll

POST /api/analytics/interaction
  Body: { sessionId, type, target?, path, metadata? }
  → Records a discrete user interaction
```

### Dashboard endpoints (protected, `x-api-key` required)

```
GET /api/dashboard/overview
GET /api/dashboard/visitors?page=1&limit=20
GET /api/dashboard/visitors/:id
GET /api/dashboard/pages
GET /api/dashboard/geo
GET /api/dashboard/devices
GET /api/dashboard/referrers
GET /api/dashboard/interactions
GET /api/dashboard/flow
GET /api/dashboard/timeline?days=30
```

All dashboard endpoints return JSON and are authenticated by comparing the `x-api-key` header (or `?api_key=` query param) to `DASHBOARD_API_KEY` in the server environment. A mismatch returns `401 Unauthorized`.

---

## 8. Security Model

### Admin access
The admin dashboard is protected by a single static API key (`DASHBOARD_API_KEY`). This is appropriate for a single-owner system. The key is:
- Never committed to the repository (excluded by `.gitignore`)
- Stored in the owner's browser `localStorage` after first login
- Not visible in the live site's navigation or source

### Bot filtering
Incoming UA strings are matched against a regex covering major crawlers (Googlebot, Bingbot, Yandex, etc.). Bot sessions return `204` immediately and are flagged `is_bot = 1` if they somehow bypass the check — all dashboard queries filter these out.

### Input sanitization
All string inputs from request bodies are sliced to maximum lengths before database insertion (e.g., `path.slice(0, 512)`). SQLite prepared statements with `?` placeholders prevent SQL injection throughout.

### CORS
The `Access-Control-Allow-Origin` header is only set if the request `Origin` exactly matches one of the configured `CORS_ORIGINS`. Requests from unlisted origins receive no CORS header and the browser blocks them.

### Rate limiting
Analytics endpoints are limited to 200 requests per IP per 15-minute window, preventing a single client from flooding the database.

---

## 9. Privacy Considerations

| Data point | How it is stored |
|---|---|
| IP address | SHA-256 hash only (irreversible) by default; full IP stored only if `STORE_RAW_IP=true` |
| IP for display | Last octet masked (`192.168.1.x`) — stored separately, used only in the admin dashboard |
| Location | City, region, country from ip-api.com — approximate, not precise |
| User agent | Full string stored; browser/OS/device parsed from it |
| Do Not Track | Honored — all tracking silently skipped if `navigator.doNotTrack === "1"` |
| Cookies | None — session ID is stored in `localStorage` only |
| Cross-site tracking | Not applicable — this is first-party analytics only |

The analytics database (`analytics.db`) lives on the server owner's machine (or private cloud host) and is never publicly accessible.

---

## 10. Performance Considerations

### Frontend
- **Vite + SWC**: sub-second hot module replacement in development; production build with tree-shaking and code splitting
- **Asset aliasing**: all 150+ image assets are aliased in `vite.config.ts` so Vite resolves them at build time without runtime lookups
- **Analytics are non-blocking**: all `fetch` calls are fire-and-forget with `keepalive: true`; a failed or slow analytics server has zero impact on page performance
- **Passive scroll listener**: scroll depth tracking uses `{ passive: true }` to avoid blocking the main thread

### Backend
- **SQLite WAL mode**: write-ahead logging allows concurrent reads without blocking, which matters when the dashboard is open while visitors are generating events
- **Synchronous SQLite API**: Node's `node:sqlite` `DatabaseSync` class uses synchronous calls, which is safe in this single-threaded, low-concurrency context and avoids callback complexity
- **Prepared statements**: all queries use pre-compiled prepared statements (created once, reused on every call) rather than re-parsing SQL on each request
- **In-memory rate limit map**: avoids a database round-trip for the most common rejection path (burst traffic)

---

## 11. Deployment Architecture

```
GitHub (source of truth)
    │
    │ git push → main
    ▼
GitHub Actions
    ├── npm ci
    ├── vite build  →  build/
    └── deploy-pages  →  bannyhe.github.io
                              (static CDN, free)

Owner's machine (or cloud host)
    └── node --env-file=.env server.mjs
              │
              ├── analytics.db  (local SQLite file)
              └── :3001         (analytics + dashboard API)
```

The frontend and backend are completely independent deployments. The frontend build bakes in `VITE_ANALYTICS_URL` at compile time; if the backend is unreachable at runtime all analytics calls fail silently.

For persistent 24/7 tracking the server can be deployed to any Node.js 22+ host. Recommended free-tier options:

| Host | Notes |
|---|---|
| [Railway](https://railway.app) | Free tier, auto-deploy from GitHub, persistent filesystem |
| [Render](https://render.com) | Free tier (sleeps after inactivity), easy Node deploys |
| [Fly.io](https://fly.io) | Free tier, persistent volumes for SQLite |

When deploying to a cloud host, `VITE_ANALYTICS_URL` in the GitHub Actions environment must be updated to the hosted backend URL and the frontend rebuilt.

---

## 12. Known Limitations & Future Work

| Limitation | Notes |
|---|---|
| Single-owner backend | The API key auth model is intentionally simple; not suitable for shared access without adding multi-user auth |
| Local-only persistence by default | If the server isn't running, no analytics are captured; cloud deployment required for continuous collection |
| No real-time push | The admin dashboard polls on demand (manual refresh); a WebSocket layer could add live updates |
| SQLite scalability | SQLite is sufficient for portfolio traffic (thousands of visitors/month); a Postgres migration is straightforward via Prisma if traffic grows significantly |
| Scroll depth accuracy | Scroll depth is tracked on the main document only; content inside scrollable containers (e.g., a project image gallery) is not measured |
| Interaction coverage | Only manually instrumented events are tracked; automatic click heatmaps or rage-click detection would require additional frontend instrumentation |
| ip-api.com dependency | Geolocation relies on a free third-party service; if it is unavailable, location fields are null but no data is lost |
