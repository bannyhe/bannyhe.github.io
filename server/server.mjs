// Analytics server — uses Turso (libSQL) for persistent cloud SQLite
import { createServer } from 'node:http';
import { createClient } from '@libsql/client';
import { createHash } from 'node:crypto';

// ── Config ─────────────────────────────────────────────────────────────────────
const PORT           = parseInt(process.env.PORT ?? '3001', 10);
const TURSO_URL      = process.env.TURSO_DATABASE_URL ?? '';
const TURSO_TOKEN    = process.env.TURSO_AUTH_TOKEN ?? '';
const DASHBOARD_KEY  = process.env.DASHBOARD_API_KEY ?? '';
const CORS_ORIGINS   = (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(',').map(s => s.trim());
const STORE_RAW_IP   = process.env.STORE_RAW_IP === 'true';
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX ?? '200', 10);

if (!DASHBOARD_KEY) { console.error('[config] DASHBOARD_API_KEY is required'); process.exit(1); }
if (!TURSO_URL)     { console.error('[config] TURSO_DATABASE_URL is required'); process.exit(1); }

// ── Database ───────────────────────────────────────────────────────────────────
const db = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

async function initDb() {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS visitor_sessions (
      id              TEXT PRIMARY KEY,
      session_id      TEXT UNIQUE NOT NULL,
      ip_hash         TEXT NOT NULL,
      ip_raw          TEXT,
      ip_masked       TEXT,
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
    )`,
    `CREATE INDEX IF NOT EXISTS idx_s_first   ON visitor_sessions(first_seen_at)`,
    `CREATE INDEX IF NOT EXISTS idx_s_country ON visitor_sessions(country)`,
    `CREATE INDEX IF NOT EXISTS idx_s_device  ON visitor_sessions(device)`,
    `CREATE TABLE IF NOT EXISTS page_views (
      id           TEXT PRIMARY KEY,
      session_id   TEXT NOT NULL REFERENCES visitor_sessions(id) ON DELETE CASCADE,
      path         TEXT NOT NULL, title TEXT, referrer TEXT,
      entered_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      exited_at    TEXT, duration INTEGER, scroll_depth REAL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_pv_session ON page_views(session_id)`,
    `CREATE INDEX IF NOT EXISTS idx_pv_path    ON page_views(path)`,
    `CREATE INDEX IF NOT EXISTS idx_pv_entered ON page_views(entered_at)`,
    `CREATE TABLE IF NOT EXISTS interactions (
      id         TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES visitor_sessions(id) ON DELETE CASCADE,
      type       TEXT NOT NULL, target TEXT, path TEXT NOT NULL, metadata TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_int_session ON interactions(session_id)`,
    `CREATE INDEX IF NOT EXISTS idx_int_type    ON interactions(type)`,
  ], 'deferred');
}

// ── Utilities ──────────────────────────────────────────────────────────────────
const newId  = () => crypto.randomUUID().replace(/-/g, '');
const hashIp = ip => createHash('sha256').update(ip + 'portfolio-salt').digest('hex');

function maskIp(ip) {
  if (!ip || ip === 'unknown') return null;
  const v4 = ip.match(/^(\d+\.\d+\.\d+\.)\d+$/);
  if (v4) return v4[1] + 'x';
  return ip.replace(/[^:]+$/, 'xxxx');
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

// ── Rate limiting ──────────────────────────────────────────────────────────────
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

  const existing = (await db.execute({ sql: 'SELECT id FROM visitor_sessions WHERE session_id=?', args: [sessionId] })).rows[0];
  if (existing) {
    await db.execute({
      sql: `UPDATE visitor_sessions SET last_seen_at=strftime('%Y-%m-%dT%H:%M:%fZ','now'),country=?,country_code=?,region=?,city=?,latitude=?,longitude=?,timezone=?,isp=?,ip_masked=COALESCE(ip_masked,?) WHERE session_id=?`,
      args: [geo.country,geo.countryCode,geo.region,geo.city,geo.latitude,geo.longitude,geo.timezone,geo.isp,ipMasked,sessionId],
    });
  } else {
    await db.execute({
      sql: 'INSERT INTO visitor_sessions (id,session_id,ip_hash,ip_raw,ip_masked,country,country_code,region,city,latitude,longitude,timezone,isp,user_agent,browser,browser_version,os,os_version,device,language,referrer,utm_source,utm_medium,utm_campaign) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      args: [newId(),sessionId,hashIp(ip),STORE_RAW_IP?ip:null,ipMasked,geo.country,geo.countryCode,geo.region,geo.city,geo.latitude,geo.longitude,geo.timezone,geo.isp,
             req.headers['user-agent']??'',ua.browser,ua.browserVersion,ua.os,ua.osVersion,ua.device,
             typeof language==='string'?language.slice(0,10):null, typeof referrer==='string'?referrer.slice(0,512):null,
             typeof utmSource==='string'?utmSource.slice(0,128):null, typeof utmMedium==='string'?utmMedium.slice(0,128):null,
             typeof utmCampaign==='string'?utmCampaign.slice(0,128):null],
    });
  }
  noContent(res);
});

on('POST', '/api/analytics/pageview', async (req, res) => {
  const ip = extractIp(req);
  if (!checkRateLimit(ip)) return send(res, 429, { error: 'Too many requests' });
  const { sessionId, path, title, referrer } = await readBody(req);
  if (!sessionId || !path) return send(res, 400, { error: 'sessionId and path required' });
  const session = (await db.execute({ sql: 'SELECT id FROM visitor_sessions WHERE session_id=?', args: [sessionId] })).rows[0];
  if (!session) return noContent(res);
  const id = newId();
  await db.execute({
    sql: 'INSERT INTO page_views (id,session_id,path,title,referrer) VALUES (?,?,?,?,?)',
    args: [id, session.id, String(path).slice(0,512), title?String(title).slice(0,256):null, referrer?String(referrer).slice(0,512):null],
  });
  send(res, 201, { pageViewId: id });
});

on('PATCH', '/api/analytics/pageview/:id', async (req, res, params) => {
  const { duration, scrollDepth } = await readBody(req);
  const ms = typeof duration === 'number' ? Math.max(0, Math.round(duration)) : null;
  const sd = typeof scrollDepth === 'number' ? Math.min(1, Math.max(0, scrollDepth)) : null;
  await db.execute({
    sql: `UPDATE page_views SET exited_at=strftime('%Y-%m-%dT%H:%M:%fZ','now'),duration=?,scroll_depth=? WHERE id=?`,
    args: [ms, sd, params.id],
  });
  noContent(res);
});

on('POST', '/api/analytics/interaction', async (req, res) => {
  const ip = extractIp(req);
  if (!checkRateLimit(ip)) return send(res, 429, { error: 'Too many requests' });
  const { sessionId, type, target, path, metadata } = await readBody(req);
  if (!sessionId || !type || !path) return send(res, 400, { error: 'sessionId, type, path required' });
  const ALLOWED = new Set(['click','link_click','project_view','resume_download','contact_click','scroll_milestone','theme_toggle']);
  if (!ALLOWED.has(type)) return send(res, 400, { error: 'Unknown interaction type' });
  const session = (await db.execute({ sql: 'SELECT id FROM visitor_sessions WHERE session_id=?', args: [sessionId] })).rows[0];
  if (!session) return noContent(res);
  await db.execute({
    sql: 'INSERT INTO interactions (id,session_id,type,target,path,metadata) VALUES (?,?,?,?,?,?)',
    args: [newId(), session.id, String(type), target?String(target).slice(0,256):null, String(path).slice(0,512),
           metadata&&typeof metadata==='object'?JSON.stringify(metadata):null],
  });
  noContent(res);
});

// ── Dashboard endpoints ────────────────────────────────────────────────────────

// Computed location label used for filtering — mirrors the SELECT CASE in the geo endpoint
const LOC_EXPR = `CASE WHEN country_code='US' AND city IS NOT NULL AND region IS NOT NULL THEN city||', '||region WHEN city IS NOT NULL AND country IS NOT NULL THEN city||', '||country WHEN country IS NOT NULL THEN country ELSE 'Local / Private' END`;

on('GET', '/api/dashboard/overview', async (req, res) => {
  if (!authGuard(req, res)) return;
  const url      = new URL('http://x' + req.url);
  const since    = url.searchParams.get('since') ?? new Date(0).toISOString();
  const location = url.searchParams.get('location') || null;
  const vsLoc    = location ? ` AND (${LOC_EXPR})=?` : '';
  const pvLoc    = location ? ` AND session_id IN (SELECT id FROM visitor_sessions WHERE (${LOC_EXPR})=?)` : '';
  const la       = location ? [location] : [];
  const [sessions, pageViews, interactions] = await Promise.all([
    db.execute({ sql: `SELECT COUNT(*) AS n FROM visitor_sessions WHERE is_bot=0 AND first_seen_at>=?${vsLoc}`, args: [since, ...la] }),
    db.execute({ sql: `SELECT COUNT(*) AS n FROM page_views WHERE entered_at>=?${pvLoc}`, args: [since, ...la] }),
    db.execute({ sql: `SELECT COUNT(*) AS n FROM interactions WHERE created_at>=?${pvLoc}`, args: [since, ...la] }),
  ]);
  const s = Number(sessions.rows[0]?.n ?? 0);
  const p = Number(pageViews.rows[0]?.n ?? 0);
  const i = Number(interactions.rows[0]?.n ?? 0);
  send(res, 200, {
    allTime:    { totalSessions: s, totalPageViews: p, totalInteractions: i },
    last30Days: { sessions: s },
  });
});

on('GET', '/api/dashboard/visitors', async (req, res) => {
  if (!authGuard(req, res)) return;
  const url      = new URL('http://x' + req.url);
  const page     = Math.max(1,   parseInt(url.searchParams.get('page')  ?? '1',  10));
  const limit    = Math.min(100, parseInt(url.searchParams.get('limit') ?? '20', 10));
  const since    = url.searchParams.get('since') ?? new Date(0).toISOString();
  const location = url.searchParams.get('location') || null;
  const vsLoc    = location ? ` AND (${LOC_EXPR})=?` : '';
  const la       = location ? [location] : [];
  const [totalRes, visitorsRes] = await Promise.all([
    db.execute({ sql: `SELECT COUNT(*) AS n FROM visitor_sessions WHERE is_bot=0 AND first_seen_at>=?${vsLoc}`, args: [since, ...la] }),
    db.execute({
      sql: `SELECT s.*,(SELECT COUNT(*) FROM page_views WHERE session_id=s.id) AS page_view_count,(SELECT COUNT(*) FROM interactions WHERE session_id=s.id) AS interaction_count FROM visitor_sessions s WHERE s.is_bot=0 AND s.first_seen_at>=?${vsLoc} ORDER BY s.first_seen_at DESC LIMIT ? OFFSET ?`,
      args: [since, ...la, limit, (page-1)*limit],
    }),
  ]);
  const total = Number(totalRes.rows[0]?.n ?? 0);
  send(res, 200, { visitors: visitorsRes.rows, total, page, limit, totalPages: Math.ceil(total/limit) });
});

on('GET', '/api/dashboard/visitors/:id', async (req, res, params) => {
  if (!authGuard(req, res)) return;
  const visitor = (await db.execute({ sql: 'SELECT * FROM visitor_sessions WHERE id=?', args: [params.id] })).rows[0];
  if (!visitor) return send(res, 404, { error: 'Not found' });
  const [pvRes, intRes] = await Promise.all([
    db.execute({ sql: 'SELECT * FROM page_views WHERE session_id=? ORDER BY entered_at ASC', args: [params.id] }),
    db.execute({ sql: 'SELECT * FROM interactions WHERE session_id=? ORDER BY created_at ASC', args: [params.id] }),
  ]);
  send(res, 200, { ...visitor, pageViews: pvRes.rows, interactions: intRes.rows });
});

on('GET', '/api/dashboard/pages', async (req, res) => {
  if (!authGuard(req, res)) return;
  const url      = new URL('http://x' + req.url);
  const since    = url.searchParams.get('since') ?? new Date(0).toISOString();
  const location = url.searchParams.get('location') || null;
  const pvLoc    = location ? ` AND session_id IN (SELECT id FROM visitor_sessions WHERE (${LOC_EXPR})=?)` : '';
  const la       = location ? [location] : [];
  const r = await db.execute({ sql: `SELECT path,COUNT(*) AS views,AVG(duration) AS avg_duration_ms,AVG(scroll_depth) AS avg_scroll_depth FROM page_views WHERE entered_at>=?${pvLoc} GROUP BY path ORDER BY views DESC LIMIT 50`, args: [since, ...la] });
  send(res, 200, r.rows);
});

on('GET', '/api/dashboard/geo', async (req, res) => {
  if (!authGuard(req, res)) return;
  const url   = new URL('http://x' + req.url);
  const since = url.searchParams.get('since') ?? new Date(0).toISOString();
  const r = await db.execute({ sql: `
    SELECT
      CASE
        WHEN country_code='US' AND city IS NOT NULL AND region IS NOT NULL THEN city||', '||region
        WHEN city IS NOT NULL AND country IS NOT NULL                       THEN city||', '||country
        WHEN country IS NOT NULL                                            THEN country
        ELSE 'Local / Private'
      END AS location,
      country_code,
      COUNT(*) AS visitors
    FROM visitor_sessions
    WHERE is_bot=0 AND first_seen_at>=?
    GROUP BY location, country_code
    ORDER BY visitors DESC LIMIT 50
  `, args: [since] });
  send(res, 200, r.rows);
});

on('GET', '/api/dashboard/devices', async (req, res) => {
  if (!authGuard(req, res)) return;
  const url      = new URL('http://x' + req.url);
  const since    = url.searchParams.get('since') ?? new Date(0).toISOString();
  const location = url.searchParams.get('location') || null;
  const vsLoc    = location ? ` AND (${LOC_EXPR})=?` : '';
  const la       = location ? [location] : [];
  const [byDevice, byBrowser, byOs] = await Promise.all([
    db.execute({ sql: `SELECT device,COUNT(*) AS count FROM visitor_sessions WHERE is_bot=0 AND first_seen_at>=?${vsLoc} GROUP BY device ORDER BY count DESC`, args: [since, ...la] }),
    db.execute({ sql: `SELECT browser,COUNT(*) AS count FROM visitor_sessions WHERE is_bot=0 AND browser IS NOT NULL AND first_seen_at>=?${vsLoc} GROUP BY browser ORDER BY count DESC LIMIT 10`, args: [since, ...la] }),
    db.execute({ sql: `SELECT os,COUNT(*) AS count FROM visitor_sessions WHERE is_bot=0 AND os IS NOT NULL AND first_seen_at>=?${vsLoc} GROUP BY os ORDER BY count DESC LIMIT 10`, args: [since, ...la] }),
  ]);
  send(res, 200, { byDevice: byDevice.rows, byBrowser: byBrowser.rows, byOs: byOs.rows });
});

on('GET', '/api/dashboard/referrers', async (req, res) => {
  if (!authGuard(req, res)) return;
  const url   = new URL('http://x' + req.url);
  const since = url.searchParams.get('since') ?? new Date(0).toISOString();
  const r = await db.execute({ sql: `SELECT referrer,COUNT(*) AS visitors FROM visitor_sessions WHERE is_bot=0 AND referrer IS NOT NULL AND referrer!='' AND first_seen_at>=? GROUP BY referrer ORDER BY visitors DESC LIMIT 30`, args: [since] });
  send(res, 200, r.rows);
});

on('GET', '/api/dashboard/interactions', async (req, res) => {
  if (!authGuard(req, res)) return;
  const url   = new URL('http://x' + req.url);
  const since = url.searchParams.get('since') ?? new Date(0).toISOString();
  const r = await db.execute({ sql: `SELECT type,target,COUNT(*) AS count FROM interactions WHERE created_at>=? GROUP BY type,target ORDER BY count DESC LIMIT 50`, args: [since] });
  send(res, 200, r.rows);
});

on('GET', '/api/dashboard/flow', async (req, res) => {
  if (!authGuard(req, res)) return;
  const url      = new URL('http://x' + req.url);
  const since    = url.searchParams.get('since') ?? new Date(0).toISOString();
  const location = url.searchParams.get('location') || null;
  const flowLoc  = location ? ` AND p1.session_id IN (SELECT id FROM visitor_sessions WHERE (${LOC_EXPR})=?)` : '';
  const la       = location ? [location] : [];
  const r = await db.execute({ sql: `
    SELECT p1.path AS source_path, p2.path AS target_path, COUNT(*) AS value
    FROM page_views p1
    JOIN page_views p2
      ON  p1.session_id = p2.session_id
      AND p2.entered_at > p1.entered_at
      AND p1.path != p2.path
      AND p1.path != '/admin'
      AND p2.path != '/admin'
      AND p2.path != '/'
      AND p1.entered_at >= ?${flowLoc}
      AND NOT EXISTS (
        SELECT 1 FROM page_views p3
        WHERE p3.session_id = p1.session_id
          AND p3.entered_at > p1.entered_at
          AND p3.entered_at < p2.entered_at
      )
    GROUP BY p1.path, p2.path
    ORDER BY value DESC
    LIMIT 30
  `, args: [since, ...la] });
  const flows = r.rows;
  if (!flows.length) return send(res, 200, { nodes: [], links: [] });

  const nodeSet = new Set();
  for (const f of flows) { nodeSet.add(f.source_path); nodeSet.add(f.target_path); }
  const nodes = Array.from(nodeSet).map(name => ({ name }));
  const nodeIdx = new Map(Array.from(nodeSet).map((name, i) => [name, i]));
  const links = flows.map(f => ({ source: nodeIdx.get(f.source_path), target: nodeIdx.get(f.target_path), value: f.value }));
  send(res, 200, { nodes, links });
});

on('GET', '/api/dashboard/timeline', async (req, res) => {
  if (!authGuard(req, res)) return;
  const url      = new URL('http://x' + req.url);
  const gran     = url.searchParams.get('granularity') ?? 'day'; // 'day' | 'hour' | '15min'
  const days     = Math.min(90, parseInt(url.searchParams.get('days') ?? '30', 10));
  const since    = url.searchParams.get('since') ?? new Date(Date.now()-days*24*60*60*1000).toISOString();
  const location = url.searchParams.get('location') || null;
  const vsLoc    = location ? ` AND (${LOC_EXPR})=?` : '';
  const pvLoc    = location ? ` AND session_id IN (SELECT id FROM visitor_sessions WHERE (${LOC_EXPR})=?)` : '';
  const la       = location ? [location] : [];

  // SQL bucket expressions per granularity
  const bktS = gran === '15min'
    ? `strftime('%Y-%m-%dT%H:', first_seen_at) || printf('%02d', (cast(strftime('%M', first_seen_at) as integer) / 15) * 15)`
    : gran === 'hour'
    ? `substr(first_seen_at, 1, 13)`
    : `substr(first_seen_at, 1, 10)`;
  const bktP = gran === '15min'
    ? `strftime('%Y-%m-%dT%H:', entered_at) || printf('%02d', (cast(strftime('%M', entered_at) as integer) / 15) * 15)`
    : gran === 'hour'
    ? `substr(entered_at, 1, 13)`
    : `substr(entered_at, 1, 10)`;

  const [sRes, pRes] = await Promise.all([
    db.execute({ sql: `SELECT ${bktS} AS date, COUNT(*) AS n FROM visitor_sessions WHERE is_bot=0 AND first_seen_at>=?${vsLoc} GROUP BY date`, args: [since, ...la] }),
    db.execute({ sql: `SELECT ${bktP} AS date, COUNT(*) AS n FROM page_views WHERE entered_at>=?${pvLoc} GROUP BY date`, args: [since, ...la] }),
  ]);
  const sm = {}, pm = {};
  for (const r of sRes.rows) sm[r.date] = Number(r.n);
  for (const r of pRes.rows) pm[r.date] = Number(r.n);

  const now = Date.now();
  const sinceMs = new Date(since).getTime();
  const timeline = [];

  if (gran === '15min' || gran === 'hour') {
    const slotMs = gran === '15min' ? 15 * 60 * 1000 : 60 * 60 * 1000;
    // Align end to the current slot boundary, iterate backward
    const endSlot = Math.floor(now / slotMs) * slotMs;
    const maxSlots = gran === '15min' ? 12 : 25;
    const slots = [];
    for (let i = maxSlots - 1; i >= 0; i--) {
      const t = new Date(endSlot - i * slotMs);
      if (t.getTime() < sinceMs) continue;
      slots.push(t);
    }
    for (const t of slots) {
      let d;
      if (gran === '15min') {
        const h = String(t.getUTCHours()).padStart(2, '0');
        const m = String(Math.floor(t.getUTCMinutes() / 15) * 15).padStart(2, '0');
        d = `${t.toISOString().slice(0, 10)}T${h}:${m}`;
      } else {
        d = t.toISOString().slice(0, 13);
      }
      timeline.push({ date: d, sessions: sm[d] ?? 0, pageViews: pm[d] ?? 0 });
    }
  } else {
    for (let i = days-1; i >= 0; i--) {
      const d = new Date(Date.now()-i*24*60*60*1000).toISOString().slice(0,10);
      timeline.push({ date: d, sessions: sm[d]??0, pageViews: pm[d]??0 });
    }
  }
  send(res, 200, timeline);
});

// ── HTTP server ────────────────────────────────────────────────────────────────
initDb().then(() => {
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
    console.log(`[db]     Turso ready   →  ${TURSO_URL}`);
    console.log(`[server] Listening     →  http://localhost:${PORT}`);
    console.log(`[server] CORS origins  →  ${CORS_ORIGINS.join(', ')}`);
  });
}).catch(err => {
  console.error('[db] Failed to initialize database:', err);
  process.exit(1);
});
