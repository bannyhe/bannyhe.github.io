// Pure Node.js 22+ analytics server — zero npm dependencies.
// Run: node --env-file=.env server.mjs

import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';

// ── Config ─────────────────────────────────────────────────────────────────────
const PORT             = parseInt(process.env.PORT ?? '3001', 10);
const DB_PATH          = process.env.DB_PATH ?? './analytics.db';
const DASHBOARD_KEY    = process.env.DASHBOARD_API_KEY ?? '';
const CORS_ORIGINS     = (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(',').map(s => s.trim());
const STORE_RAW_IP     = process.env.STORE_RAW_IP === 'true';
const RATE_LIMIT_MAX   = parseInt(process.env.RATE_LIMIT_MAX ?? '200', 10);

if (!DASHBOARD_KEY) { console.error('[config] DASHBOARD_API_KEY is required in .env'); process.exit(1); }

// ── Database ───────────────────────────────────────────────────────────────────
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
db.exec(`
  CREATE TABLE IF NOT EXISTS visitor_sessions (
    id              TEXT PRIMARY KEY,
    session_id      TEXT UNIQUE NOT NULL,
    ip_hash         TEXT NOT NULL,
    ip_raw          TEXT,
    country         TEXT, country_code TEXT, region TEXT, city TEXT,
    latitude        REAL, longitude REAL, timezone TEXT, isp TEXT,
    user_agent      TEXT NOT NULL DEFAULT '',
    browser         TEXT, browser_version TEXT,
    os              TEXT, os_version TEXT,
    device          TEXT DEFAULT 'desktop',
    language        TEXT, referrer TEXT,
    utm_source      TEXT, utm_medium TEXT, utm_campaign TEXT,
    first_seen_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    last_seen_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    is_bot          INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_s_first ON visitor_sessions(first_seen_at);
  CREATE INDEX IF NOT EXISTS idx_s_country ON visitor_sessions(country);
  CREATE INDEX IF NOT EXISTS idx_s_device ON visitor_sessions(device);

  CREATE TABLE IF NOT EXISTS page_views (
    id           TEXT PRIMARY KEY,
    session_id   TEXT NOT NULL REFERENCES visitor_sessions(id) ON DELETE CASCADE,
    path         TEXT NOT NULL, title TEXT, referrer TEXT,
    entered_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    exited_at    TEXT, duration INTEGER, scroll_depth REAL
  );
  CREATE INDEX IF NOT EXISTS idx_pv_session ON page_views(session_id);
  CREATE INDEX IF NOT EXISTS idx_pv_path    ON page_views(path);
  CREATE INDEX IF NOT EXISTS idx_pv_entered ON page_views(entered_at);

  CREATE TABLE IF NOT EXISTS interactions (
    id         TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES visitor_sessions(id) ON DELETE CASCADE,
    type       TEXT NOT NULL, target TEXT, path TEXT NOT NULL, metadata TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
  CREATE INDEX IF NOT EXISTS idx_int_session ON interactions(session_id);
  CREATE INDEX IF NOT EXISTS idx_int_type    ON interactions(type);
`);

// ── Schema migration — add ip_masked column if not present ────────────────────
try { db.exec('ALTER TABLE visitor_sessions ADD COLUMN ip_masked TEXT'); } catch {}

// ── Utilities ──────────────────────────────────────────────────────────────────
const newId  = () => crypto.randomUUID().replace(/-/g, '');
const hashIp = ip => createHash('sha256').update(ip + 'portfolio-salt').digest('hex');

// Last IPv4 octet masked (192.168.1.x) — safe to store and display
function maskIp(ip) {
  if (!ip || ip === 'unknown') return null;
  const v4 = ip.match(/^(\d+\.\d+\.\d+\.)\d+$/);
  if (v4) return v4[1] + 'x';
  return ip.replace(/[^:]+$/, 'xxxx'); // IPv6
}

function extractIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return (Array.isArray(fwd) ? fwd[0] : fwd.split(',')[0]).trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

const BOT_RE = /bot|crawl|slurp|spider|mediapartners|facebookexternalhit|googlebot|bingbot|yandex/i;
function parseUA(ua) {
  if (!ua || BOT_RE.test(ua))
    return { browser: null, browserVersion: null, os: null, osVersion: null, device: 'desktop', isBot: true };
  let browser = null, browserVersion = null, m;
  if      ((m = ua.match(/Edg\/([0-9.]+)/)))     { browser = 'Edge';    browserVersion = m[1]; }
  else if ((m = ua.match(/OPR\/([0-9.]+)/)))      { browser = 'Opera';   browserVersion = m[1]; }
  else if ((m = ua.match(/Chrome\/([0-9.]+)/)))   { browser = 'Chrome';  browserVersion = m[1]; }
  else if ((m = ua.match(/Firefox\/([0-9.]+)/)))  { browser = 'Firefox'; browserVersion = m[1]; }
  else if ((m = ua.match(/Version\/([0-9.]+).*Safari/))) { browser = 'Safari'; browserVersion = m[1]; }
  let os = null, osVersion = null;
  if      ((m = ua.match(/Windows NT ([0-9.]+)/)))    { os = 'Windows'; osVersion = m[1]; }
  else if ((m = ua.match(/Mac OS X ([0-9_]+)/)))      { os = 'macOS';   osVersion = m[1].replace(/_/g, '.'); }
  else if ((m = ua.match(/Android ([0-9.]+)/)))       { os = 'Android'; osVersion = m[1]; }
  else if (/iPhone|iPad/.test(ua))                    { os = 'iOS'; }
  else if (ua.includes('Linux'))                      { os = 'Linux'; }
  const device = /Mobi|Android|iPhone/.test(ua) ? 'mobile' : /iPad|Tablet/.test(ua) ? 'tablet' : 'desktop';
  return { browser, browserVersion, os, osVersion, device, isBot: false };
}

const PRIVATE_RE = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|::1$)/;
async function geolocate(ip) {
  const empty = { country:null,countryCode:null,region:null,city:null,latitude:null,longitude:null,timezone:null,isp:null };
  if (PRIVATE_RE.test(ip) || ip === 'unknown') return empty;
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,regionName,city,lat,lon,timezone,isp`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return empty;
    const d = await res.json();
    if (d.status !== 'success') return empty;
    return { country:d.country??null, countryCode:d.countryCode??null, region:d.regionName??null,
             city:d.city??null, latitude:d.lat??null, longitude:d.lon??null, timezone:d.timezone??null, isp:d.isp??null };
  } catch { return empty; }
}

// ── Rate limiting (in-memory) ──────────────────────────────────────────────────
const rlMap = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  let e = rlMap.get(ip);
  if (!e || now > e.resetAt) e = { count: 0, resetAt: now + 15 * 60 * 1000 };
  e.count++;
  rlMap.set(ip, e);
  return e.count <= RATE_LIMIT_MAX;
}
setInterval(() => { const now = Date.now(); for (const [k,v] of rlMap) if (now > v.resetAt) rlMap.delete(k); }, 30*60*1000);

// ── Mini router ────────────────────────────────────────────────────────────────
const routes = [];
const on = (method, path, handler) => routes.push({ method, path, handler });

function matchRoute(method, pathname) {
  for (const r of routes) {
    if (r.method !== method) continue;
    const pp = r.path.split('/'), up = pathname.split('/');
    if (pp.length !== up.length) continue;
    const params = {}; let ok = true;
    for (let i = 0; i < pp.length; i++) {
      if (pp[i].startsWith(':')) params[pp[i].slice(1)] = decodeURIComponent(up[i]);
      else if (pp[i] !== up[i]) { ok = false; break; }
    }
    if (ok) return { handler: r.handler, params };
  }
  return null;
}

function readBody(req) {
  return new Promise(resolve => {
    let raw = '';
    req.on('data', c => { raw += c; if (raw.length > 16384) req.destroy(); });
    req.on('end',  () => { try { resolve(JSON.parse(raw)); } catch { resolve({}); } });
    req.on('error',() => resolve({}));
  });
}

function send(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}
const noContent = res => { res.writeHead(204); res.end(); };

function setCors(req, res) {
  const origin = req.headers['origin'];
  if (origin && CORS_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
}

function authGuard(req, res) {
  const key = req.headers['x-api-key'] ?? new URL('http://x' + req.url).searchParams.get('api_key');
  if (key !== DASHBOARD_KEY) { send(res, 401, { error: 'Unauthorized' }); return false; }
  return true;
}

// ── Analytics endpoints ────────────────────────────────────────────────────────

on('POST', '/api/analytics/session', async (req, res) => {
  const ip = extractIp(req);
  if (!checkRateLimit(ip)) return send(res, 429, { error: 'Too many requests' });
  const { sessionId, referrer, language, utmSource, utmMedium, utmCampaign } = await readBody(req);
  if (!sessionId || typeof sessionId !== 'string') return send(res, 400, { error: 'sessionId required' });
  const ua  = parseUA(req.headers['user-agent'] ?? '');
  if (ua.isBot) return noContent(res);
  const geo = await geolocate(ip);
  const ipMasked = maskIp(ip);
  if (db.prepare('SELECT id FROM visitor_sessions WHERE session_id=?').get(sessionId)) {
    db.prepare(`UPDATE visitor_sessions SET last_seen_at=strftime('%Y-%m-%dT%H:%M:%fZ','now'),country=?,country_code=?,region=?,city=?,latitude=?,longitude=?,timezone=?,isp=?,ip_masked=COALESCE(ip_masked,?) WHERE session_id=?`)
      .run(geo.country,geo.countryCode,geo.region,geo.city,geo.latitude,geo.longitude,geo.timezone,geo.isp,ipMasked,sessionId);
  } else {
    db.prepare('INSERT INTO visitor_sessions (id,session_id,ip_hash,ip_raw,ip_masked,country,country_code,region,city,latitude,longitude,timezone,isp,user_agent,browser,browser_version,os,os_version,device,language,referrer,utm_source,utm_medium,utm_campaign) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
      .run(newId(),sessionId,hashIp(ip),STORE_RAW_IP?ip:null,ipMasked,geo.country,geo.countryCode,geo.region,geo.city,geo.latitude,geo.longitude,geo.timezone,geo.isp,
           req.headers['user-agent']??'',ua.browser,ua.browserVersion,ua.os,ua.osVersion,ua.device,
           typeof language==='string'?language.slice(0,10):null, typeof referrer==='string'?referrer.slice(0,512):null,
           typeof utmSource==='string'?utmSource.slice(0,128):null, typeof utmMedium==='string'?utmMedium.slice(0,128):null,
           typeof utmCampaign==='string'?utmCampaign.slice(0,128):null);
  }
  noContent(res);
});

on('POST', '/api/analytics/pageview', async (req, res) => {
  const ip = extractIp(req);
  if (!checkRateLimit(ip)) return send(res, 429, { error: 'Too many requests' });
  const { sessionId, path, title, referrer } = await readBody(req);
  if (!sessionId || !path) return send(res, 400, { error: 'sessionId and path required' });
  const session = db.prepare('SELECT id FROM visitor_sessions WHERE session_id=?').get(sessionId);
  if (!session) return noContent(res);
  const id = newId();
  db.prepare('INSERT INTO page_views (id,session_id,path,title,referrer) VALUES (?,?,?,?,?)')
    .run(id,session.id,String(path).slice(0,512),title?String(title).slice(0,256):null,referrer?String(referrer).slice(0,512):null);
  send(res, 201, { pageViewId: id });
});

on('PATCH', '/api/analytics/pageview/:id', async (req, res, params) => {
  const { duration, scrollDepth } = await readBody(req);
  const ms = typeof duration === 'number' ? Math.max(0, Math.round(duration)) : null;
  const sd = typeof scrollDepth === 'number' ? Math.min(1, Math.max(0, scrollDepth)) : null;
  db.prepare(`UPDATE page_views SET exited_at=strftime('%Y-%m-%dT%H:%M:%fZ','now'),duration=?,scroll_depth=? WHERE id=?`)
    .run(ms, sd, params.id);
  noContent(res);
});

on('POST', '/api/analytics/interaction', async (req, res) => {
  const ip = extractIp(req);
  if (!checkRateLimit(ip)) return send(res, 429, { error: 'Too many requests' });
  const { sessionId, type, target, path, metadata } = await readBody(req);
  if (!sessionId || !type || !path) return send(res, 400, { error: 'sessionId, type, path required' });
  const ALLOWED = new Set(['click','link_click','project_view','resume_download','contact_click','scroll_milestone','theme_toggle']);
  if (!ALLOWED.has(type)) return send(res, 400, { error: 'Unknown interaction type' });
  const session = db.prepare('SELECT id FROM visitor_sessions WHERE session_id=?').get(sessionId);
  if (!session) return noContent(res);
  db.prepare('INSERT INTO interactions (id,session_id,type,target,path,metadata) VALUES (?,?,?,?,?,?)')
    .run(newId(),session.id,String(type),target?String(target).slice(0,256):null,String(path).slice(0,512),
         metadata&&typeof metadata==='object'?JSON.stringify(metadata):null);
  noContent(res);
});

// ── Dashboard endpoints ────────────────────────────────────────────────────────

on('GET', '/api/dashboard/overview', (req, res) => {
  if (!authGuard(req, res)) return;
  const ago30 = new Date(Date.now()-30*24*60*60*1000).toISOString();
  send(res, 200, {
    allTime: {
      totalSessions:     db.prepare('SELECT COUNT(*) AS n FROM visitor_sessions WHERE is_bot=0').get().n,
      totalPageViews:    db.prepare('SELECT COUNT(*) AS n FROM page_views').get().n,
      totalInteractions: db.prepare('SELECT COUNT(*) AS n FROM interactions').get().n,
    },
    last30Days: { sessions: db.prepare('SELECT COUNT(*) AS n FROM visitor_sessions WHERE is_bot=0 AND first_seen_at>=?').get(ago30).n },
  });
});

on('GET', '/api/dashboard/visitors', (req, res) => {
  if (!authGuard(req, res)) return;
  const url   = new URL('http://x' + req.url);
  const page  = Math.max(1,   parseInt(url.searchParams.get('page')  ?? '1',  10));
  const limit = Math.min(100, parseInt(url.searchParams.get('limit') ?? '20', 10));
  const total = db.prepare('SELECT COUNT(*) AS n FROM visitor_sessions WHERE is_bot=0').get().n;
  const visitors = db.prepare(`SELECT s.*,(SELECT COUNT(*) FROM page_views WHERE session_id=s.id) AS page_view_count,(SELECT COUNT(*) FROM interactions WHERE session_id=s.id) AS interaction_count FROM visitor_sessions s WHERE s.is_bot=0 ORDER BY s.first_seen_at DESC LIMIT ? OFFSET ?`).all(limit,(page-1)*limit);
  send(res, 200, { visitors, total, page, limit, totalPages: Math.ceil(total/limit) });
});

on('GET', '/api/dashboard/visitors/:id', (req, res, params) => {
  if (!authGuard(req, res)) return;
  const visitor = db.prepare('SELECT * FROM visitor_sessions WHERE id=?').get(params.id);
  if (!visitor) return send(res, 404, { error: 'Not found' });
  send(res, 200, {
    ...visitor,
    pageViews:    db.prepare('SELECT * FROM page_views    WHERE session_id=? ORDER BY entered_at ASC').all(params.id),
    interactions: db.prepare('SELECT * FROM interactions  WHERE session_id=? ORDER BY created_at ASC').all(params.id),
  });
});

on('GET', '/api/dashboard/pages', (req, res) => {
  if (!authGuard(req, res)) return;
  send(res, 200, db.prepare(`SELECT path,COUNT(*) AS views,AVG(duration) AS avg_duration_ms,AVG(scroll_depth) AS avg_scroll_depth FROM page_views GROUP BY path ORDER BY views DESC LIMIT 50`).all());
});

on('GET', '/api/dashboard/geo', (req, res) => {
  if (!authGuard(req, res)) return;
  // US visitors → "City, State"; others → "City, Country"; fallback → country only
  send(res, 200, db.prepare(`
    SELECT
      CASE
        WHEN country_code='US' AND city IS NOT NULL AND region IS NOT NULL THEN city||', '||region
        WHEN city IS NOT NULL AND country IS NOT NULL                       THEN city||', '||country
        WHEN country IS NOT NULL                                            THEN country
        ELSE NULL
      END AS location,
      country_code,
      COUNT(*) AS visitors
    FROM visitor_sessions
    WHERE is_bot=0
    GROUP BY location, country_code
    HAVING location IS NOT NULL
    ORDER BY visitors DESC LIMIT 50
  `).all());
});

on('GET', '/api/dashboard/devices', (req, res) => {
  if (!authGuard(req, res)) return;
  send(res, 200, {
    byDevice:  db.prepare(`SELECT device,COUNT(*) AS count FROM visitor_sessions WHERE is_bot=0 GROUP BY device ORDER BY count DESC`).all(),
    byBrowser: db.prepare(`SELECT browser,COUNT(*) AS count FROM visitor_sessions WHERE is_bot=0 AND browser IS NOT NULL GROUP BY browser ORDER BY count DESC LIMIT 10`).all(),
    byOs:      db.prepare(`SELECT os,COUNT(*) AS count FROM visitor_sessions WHERE is_bot=0 AND os IS NOT NULL GROUP BY os ORDER BY count DESC LIMIT 10`).all(),
  });
});

on('GET', '/api/dashboard/referrers', (req, res) => {
  if (!authGuard(req, res)) return;
  send(res, 200, db.prepare(`SELECT referrer,COUNT(*) AS visitors FROM visitor_sessions WHERE is_bot=0 AND referrer IS NOT NULL AND referrer!='' GROUP BY referrer ORDER BY visitors DESC LIMIT 30`).all());
});

on('GET', '/api/dashboard/interactions', (req, res) => {
  if (!authGuard(req, res)) return;
  send(res, 200, db.prepare(`SELECT type,target,COUNT(*) AS count FROM interactions GROUP BY type,target ORDER BY count DESC LIMIT 50`).all());
});

on('GET', '/api/dashboard/flow', (req, res) => {
  if (!authGuard(req, res)) return;
  // Direct page-to-page transitions within the same session
  const flows = db.prepare(`
    SELECT p1.path AS source_path, p2.path AS target_path, COUNT(*) AS value
    FROM page_views p1
    JOIN page_views p2
      ON  p1.session_id = p2.session_id
      AND p2.entered_at > p1.entered_at
      AND NOT EXISTS (
        SELECT 1 FROM page_views p3
        WHERE p3.session_id = p1.session_id
          AND p3.entered_at > p1.entered_at
          AND p3.entered_at < p2.entered_at
      )
    GROUP BY p1.path, p2.path
    ORDER BY value DESC
    LIMIT 30
  `).all();

  if (!flows.length) return send(res, 200, { nodes: [], links: [] });

  const nodeSet = new Set();
  for (const f of flows) { nodeSet.add(f.source_path); nodeSet.add(f.target_path); }
  const nodes = Array.from(nodeSet).map(name => ({ name }));
  const nodeIdx = new Map(Array.from(nodeSet).map((name, i) => [name, i]));
  const links = flows.map(f => ({ source: nodeIdx.get(f.source_path), target: nodeIdx.get(f.target_path), value: f.value }));
  send(res, 200, { nodes, links });
});

on('GET', '/api/dashboard/timeline', (req, res) => {
  if (!authGuard(req, res)) return;
  const url   = new URL('http://x' + req.url);
  const days  = Math.min(90, parseInt(url.searchParams.get('days') ?? '30', 10));
  const since = new Date(Date.now()-days*24*60*60*1000).toISOString();
  const sm = {}, pm = {};
  for (const r of db.prepare(`SELECT substr(first_seen_at,1,10) AS date,COUNT(*) AS n FROM visitor_sessions WHERE is_bot=0 AND first_seen_at>=? GROUP BY date`).all(since)) sm[r.date]=r.n;
  for (const r of db.prepare(`SELECT substr(entered_at,1,10) AS date,COUNT(*) AS n FROM page_views WHERE entered_at>=? GROUP BY date`).all(since)) pm[r.date]=r.n;
  const timeline = [];
  for (let i=days-1; i>=0; i--) { const d=new Date(Date.now()-i*24*60*60*1000).toISOString().slice(0,10); timeline.push({date:d,sessions:sm[d]??0,pageViews:pm[d]??0}); }
  send(res, 200, timeline);
});

// ── HTTP server ────────────────────────────────────────────────────────────────
createServer(async (req, res) => {
  setCors(req, res);
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const pathname = new URL('http://x' + req.url).pathname;
  if (req.method === 'GET' && pathname === '/health')
    return send(res, 200, { status: 'ok', ts: new Date().toISOString() });

  const match = matchRoute(req.method, pathname);
  if (!match) return send(res, 404, { error: 'Not found' });

  try {
    await match.handler(req, res, match.params ?? {});
  } catch (err) {
    console.error('[server] Error:', err);
    send(res, 500, { error: 'Internal server error' });
  }
}).listen(PORT, () => {
  console.log(`[db]     SQLite ready  →  ${DB_PATH}`);
  console.log(`[server] Listening     →  http://localhost:${PORT}`);
  console.log(`[server] CORS origins  →  ${CORS_ORIGINS.join(', ')}`);
});
