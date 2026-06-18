# Mu He — Portfolio

Personal portfolio and UX case study site for **Mu He**, deployed at [bannyhe.github.io](https://bannyhe.github.io).

Designed in Figma and built with React + Vite. Includes a zero-dependency analytics backend that tracks visitor sessions, page views, and navigation flow, surfaced through a password-protected admin dashboard.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero section and project gallery |
| `/about` | About — background, skills, and contact |
| `/resume` | Resume viewer |
| `/project/malware-prevention` | Case study: Malware Prevention |
| `/project/northstar-onboarding` | Case study: Northstar Onboarding |
| `/project/vcf-network` | Case study: VCF Network |
| `/project/xenith-website` | Case study: Xenith Website |
| `/admin` | Analytics dashboard (API key required) |

---

## Tech Stack

### Frontend
| | |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 (SWC) |
| Routing | React Router DOM (HashRouter) |
| Styling | Tailwind CSS + Radix UI |
| Animation | Framer Motion |
| Charts | Recharts |
| Deployment | GitHub Pages via GitHub Actions |

### Analytics Backend (`server/`)
| | |
|---|---|
| Runtime | Node.js 24 (zero npm dependencies) |
| Database | SQLite via built-in `node:sqlite` |
| HTTP | Built-in `node:http` |
| Geolocation | [ip-api.com](http://ip-api.com) (free, no key required) |

---

## Local Development

### Frontend

```bash
# Install dependencies
npm install

# Create a local env file pointing at the analytics server
echo "VITE_ANALYTICS_URL=http://localhost:3001" > .env.local

# Start dev server at http://localhost:3000
npm run dev
```

### Analytics Backend

The backend requires no `npm install` — it runs on Node.js 24 built-ins only.

```bash
cd server

# Copy the env template and fill in your values
cp .env.example .env
# Required: set DASHBOARD_API_KEY to any secret string

# Start the server (creates analytics.db automatically)
node --env-file=.env server.mjs
```

The server starts at `http://localhost:3001`. The SQLite database file (`analytics.db`) is created automatically on first run and is excluded from version control.

---

## Admin Dashboard

Navigate to `/#/admin` on the live site or locally. Enter your `DASHBOARD_API_KEY` to log in.

The dashboard shows:

- **Traffic overview** — total visitors, page views, interactions, 30-day sessions
- **Timeline chart** — daily visitor and page view trend (last 30 days)
- **Top pages** — view counts, average time on page, average scroll depth
- **Visitors by location** — city/state for US visitors, city/country for international
- **Device & browser breakdown** — desktop/mobile/tablet split with browser bar chart
- **Navigation flow** — Sankey chart of actual page-to-page transitions
- **Recent visitors** — device, browser, location (or masked IP if unavailable)

The API key is stored in `localStorage` after first login — you won't be prompted again until you click Logout.

---

## Analytics API

All dashboard endpoints require an `x-api-key` header matching `DASHBOARD_API_KEY`.

| Endpoint | Description |
|---|---|
| `GET /health` | Server health check (no auth) |
| `GET /api/dashboard/overview` | All-time and 30-day totals |
| `GET /api/dashboard/visitors` | Paginated visitor list |
| `GET /api/dashboard/visitors/:id` | Single visitor with full page view history |
| `GET /api/dashboard/pages` | Top pages with avg duration and scroll depth |
| `GET /api/dashboard/geo` | Visitor counts by city/state/country |
| `GET /api/dashboard/devices` | Device, browser, and OS breakdown |
| `GET /api/dashboard/referrers` | Top external traffic sources |
| `GET /api/dashboard/flow` | Page transition data for Sankey chart |
| `GET /api/dashboard/timeline?days=30` | Daily sessions and page views |

---

## Deployment

The frontend deploys automatically to GitHub Pages on every push to `main` via the workflow in `.github/workflows/`. No manual steps needed.

The analytics backend runs separately and is not hosted on GitHub Pages. For persistent production tracking, deploy `server/server.mjs` to a Node.js host (Railway, Render, Fly.io, etc.) and set `VITE_ANALYTICS_URL` to the deployed URL in your hosting environment.

---

## Environment Variables

### Frontend (`.env.local`)

| Variable | Description | Default |
|---|---|---|
| `VITE_ANALYTICS_URL` | URL of the analytics backend | `http://localhost:3001` |

### Backend (`server/.env`)

| Variable | Description | Default |
|---|---|---|
| `DASHBOARD_API_KEY` | Secret key for the admin dashboard | *(required)* |
| `DB_PATH` | Path to the SQLite database file | `./analytics.db` |
| `PORT` | Port the server listens on | `3001` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | `http://localhost:3000` |
| `STORE_RAW_IP` | Store full IP addresses (vs. masked) | `false` |
| `RATE_LIMIT_MAX` | Max analytics events per IP per 15 min | `200` |

---

## Project Structure

```
├── src/
│   ├── pages/          # Route-level page components
│   ├── components/     # Shared UI components (Radix UI wrappers)
│   ├── hooks/          # useAnalytics — session + page view tracking
│   ├── lib/            # Analytics fetch client
│   ├── contexts/       # ThemeContext (light/dark mode)
│   └── App.tsx         # Router and layout
├── server/
│   ├── server.mjs      # Zero-dependency analytics server
│   └── .env.example    # Backend environment template
├── .github/workflows/  # GitHub Actions CI/CD
└── public/             # Static assets
```

---

## Design

Original design created in Figma:
[figma.com/design/8y8cWsVV7S87vmctiCIu7R/MU-HE](https://www.figma.com/design/8y8cWsVV7S87vmctiCIu7R/MU-HE)

---

© 2026 Mu He. All rights reserved.
