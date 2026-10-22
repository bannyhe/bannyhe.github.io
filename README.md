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

Navigate to `/admin` on the live site or locally. Enter your `DASHBOARD_API_KEY` to sign in.

- **Overview** — browser sessions, page views, tracked actions, views per visit, traffic trends, referral sources, and action destinations.
- **Content** — searchable page/project performance, sorting by views/time/scroll, and CSV export of the filtered rows.
- **Audience** — locations, optional map, device/browser/OS breakdowns, paginated visits, and individual histories with source/campaign details. A selected location filters only the visit list.
- **Journeys** — ranked page-to-page transitions and CSV export. This preserves cycles present in the API response.

Choose a 1-hour, 24-hour, 7-day, or 30-day period. The one-hour chart uses 15-minute intervals. Displayed timestamps and CSV exports use PST (fixed UTC−08:00 year-round); chart labels show each API interval’s start time in PST. Visits are browser sessions, not identified people; clicks do not establish completed downloads or contacts. Reports disclose API row limits and missing measurements. Historical counts may include duplicate page views from the previous tracking implementation; only future tracking is corrected.

Panels load independently, retry failures without signing out, and reuse responses for 60 seconds. Refresh on demand, or enable updates every minute while the tab is visible. Chart and page/path CSV exports contain aggregate data. The map downloads only when requested.

The API key stays in the current tab's session storage by default. Select **Stay signed in on this device** to use local storage; **Sign out** clears both. An idle hosting service can still delay authentication: the login page starts one health request, offers cancellation, and explains a slow wake-up.

Development checks (Node.js 24+): `node --test tests/admin-model.test.mjs`. For browser regression checks, run a production preview, then `node tests/admin-browser.mjs http://127.0.0.1:3000`. The browser test uses synthetic API responses and never writes analytics to the live server. Set `CHROME_PATH` if Chrome is installed outside the default macOS location.

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

## English and Simplified Chinese

English lives at `/`; Simplified Chinese lives at `/zh/` (a path, not a subdomain). Published pages, case studies, and admin views share the same React components. The language switch keeps the current page, query string, and hash. It reloads the page, so an unlocked case study or unsaved form input is not retained. Password screens also include the switch.

Copy lives in `src/i18n/zh-CN.json`, with supplemental labels and contextual phrases in `src/i18n/terms.ts`. Wrap display text and accessible labels in `localize(...)`; keep IDs, API fields, URLs, and user input unchanged. When editing English copy, update its Chinese entry. Untranslated copy falls back to English.

`src/styles/locale.css` scopes Chinese typography to `lang="zh-CN"`. PingFang SC, Noto Sans CJK SC, or Microsoft YaHei load from the device. System fonts and restrained hierarchy follow [Alibaba's official typography guidance](https://jaq-doc.alibaba.com/docs/doc.htm?articleId=119060&docType=1&treeId=624); spacing is adapted to the portfolio. Original screenshots, recordings, and design artifacts retain their source language; captions, HTML diagrams, walkthroughs, and accessibility labels are translated.

The existing Vite prerender step emits both languages with separate canonical URLs, reciprocal language links, and sitemap entries. Admin remains noindex and excluded from both tracking and the sitemap. No DNS or hosting changes are needed. Analytics records the actual language URL, and Chinese admin timestamps still use fixed PST.

The Chinese resume downloads `public/resume/Mu-He-Resume-zh-CN.pdf`. Regenerate it with `node tests/localization-browser.mjs http://127.0.0.1:3000 --export-resume`.

Validation (Node.js 24+): `npm run build`, then `node --test tests/localization.test.mjs tests/admin-model.test.mjs`. With a preview server running, use `node tests/localization-browser.mjs http://127.0.0.1:3000`. Browser checks mock analytics and use case-study passwords from local environment variables or `.env.local`; they never write analytics to production.
