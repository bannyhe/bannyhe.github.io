import { spawn } from 'node:child_process';
import { writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const artifacts = await mkdtemp(join(tmpdir(), 'portfolio-admin-check-'));
const profile = join(artifacts, 'chrome');
import assert from 'node:assert/strict';

const origin = process.argv[2] || 'http://127.0.0.1:3000';
const chrome = spawn(process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', '--user-data-dir=' + profile,
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let ws;
let seq = 0;
const pending = new Map();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  const endpoint = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Chrome startup timed out')), 15000);
    chrome.stderr.on('data', data => {
      const match = data.toString().match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
    chrome.on('error', reject);
    chrome.on('exit', code => reject(new Error(`Chrome exited: ${code}`)));
  });
  ws = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    const item = pending.get(message.id);
    if (item) {
      pending.delete(message.id);
      clearTimeout(item.timer);
      message.error ? item.reject(new Error(JSON.stringify(message.error))) : item.resolve(message.result);
    }
  };
  function call(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++seq;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 15000);
      pending.set(id, { resolve, reject, timer });
      ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }
  const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
  const tab = (method, params) => call(method, params, sessionId);
  await tab('Page.enable');
  await tab('Runtime.enable');
  await tab('Network.enable');
  await tab('Network.setCacheDisabled',{cacheDisabled:false});
  await tab('Network.clearBrowserCache');
  const mediaRequests=[];
  // The runtime below is inspected separately; network collection is limited to this page.
  const evaluate = async expression => {
    const result = await tab('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  async function waitFor(expression) {
    for (let i = 0; i < 300; i++) {
      if (await evaluate(expression)) return;
      await delay(100);
    }
    console.log('Timed out at', await evaluate('location.pathname'));
    await screenshot('browser-failure');
    throw new Error(`Condition timed out: ${expression}`);
  }
  async function navigate(path) {
    await tab('Page.navigate', { url: origin + path });
    await delay(250);
  }
  async function screenshot(name) {
    await delay(800);
    const { data } = await tab('Page.captureScreenshot', { format: 'png' });
    await writeFile(join(artifacts, `${name}.png`), Buffer.from(data, 'base64'));
  }

  const errors = [], requests = [];
  const oldHandler = ws.onmessage;
  ws.onmessage = event => { const message = JSON.parse(event.data); if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text); if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url); oldHandler(event); };
  function fixture() {
    window.__mock = { log: [], failure: '', failStatus: 500, slow: 'timeline', delay: 15000, complete: {}, empty: false, dnt: '1' };
    Object.defineProperty(navigator, 'doNotTrack', { get: () => window.__mock.dnt });
    localStorage.removeItem('admin_api_key'); sessionStorage.removeItem('admin_api_key');
    const realFetch = window.fetch.bind(window);
    const visit = index => ({ id: 'test-visit-' + index, city: 'Example City', region: 'California', country: 'United States', country_code: 'US', device: 'desktop', browser: 'Chrome', os: 'macOS', first_seen_at: '2026-10-19T09:15:00Z', page_view_count: 3, referrer: 'https://example.test/work', utm_source: 'newsletter', utm_medium: 'email', utm_campaign: 'autumn' });
    window.fetch = (input, init = {}) => {
      const url = new URL(input instanceof Request ? input.url : input, location.href);
      if (!url.pathname.startsWith('/api/') && url.pathname !== '/health') return realFetch(input, init);
      const state = window.__mock;
      const name = url.pathname.replace('/api/dashboard/', '');
      const record = { path: url.pathname, query: url.search, method: init.method || 'GET', body: init.body ? JSON.parse(init.body) : undefined, at: performance.now(), done: false };
      state.log.push(record);
      let data = {}, status = 200;
      if (url.pathname.startsWith('/api/dashboard/') && new Headers(init.headers).get('x-api-key') !== 'test-key') status = 401;
      if (state.failure === name) status = state.failStatus;
      const empty = state.empty;
      const pages = [{path:'/',views:12,avg_duration_ms:4000,avg_scroll_depth:.6},{path:'/project/ai-assistant',views:8,avg_duration_ms:65000,avg_scroll_depth:.85},{path:'/resume',views:4,avg_duration_ms:null,avg_scroll_depth:null}];
      if (name === 'overview') data = {allTime:{totalSessions:empty?0:8,totalPageViews:empty?0:24,totalInteractions:empty?0:6}};
      else if (name === 'timeline') data = empty ? [] : Array.from({length:7},(_,i)=>({date:`2026-10-${13+i}`,sessions:i,pageViews:i*3}));
      else if (name === 'pages') data = empty ? [] : pages;
      else if (name === 'referrers') data = empty ? [] : [{referrer:'https://example.test/one',visitors:4},{referrer:'https://www.example.test/two',visitors:2}];
      else if (name === 'interactions') data = empty ? [] : [{type:'project_view',target:'ai-assistant',count:3},{type:'contact_click',target:'mailto:hello@example.test',count:2},{type:'resume_download',target:'pdf',count:1}];
      else if (name === 'geo') data = empty ? [] : [{location:'Example City, California',country_code:'US',visitors:8}];
      else if (name === 'devices') data = {byDevice:empty?[]:[{device:'desktop',count:8}],byBrowser:empty?[]:[{browser:'Chrome',count:8}],byOs:empty?[]:[{os:'macOS',count:8}]};
      else if (name === 'flow') data = {nodes:[{name:'/project/ai-assistant'},{name:'/resume'}],links:empty?[]:[{source:0,target:1,value:3},{source:1,target:0,value:2}]};
      else if (name === 'visitors') { const page=Number(url.searchParams.get('page')||1), filtered=url.searchParams.has('location'), total=empty?0:filtered?1:21;data={visitors:Array.from({length:Math.max(0,Math.min(20,total-(page-1)*20))},(_,i)=>visit((page-1)*20+i)),total,page,totalPages:Math.ceil(total/20),limit:20}; }
      else if (name.startsWith('visitors/')) data = {...visit(0),pageViews:pages.map((p,i)=>({id:'pv'+i,path:p.path,entered_at:'2026-10-19T09:15:00Z',duration:p.avg_duration_ms,scroll_depth:p.avg_scroll_depth})),interactions:[{id:'action1',type:'project_view',target:'ai-assistant',path:'/',created_at:'2026-10-19T09:15:00Z'}]};
      else if (url.pathname === '/api/analytics/pageview') data = {pageViewId:'tracked-'+state.log.length};
      return new Promise((resolve,reject)=>{
        const delay = state.slow === name || state.slow === url.pathname ? state.delay : 35;
        const complete=()=>{clearTimeout(timer);record.done=true;resolve(new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}}));};
        const timer=setTimeout(complete,delay);state.complete[name]=complete;record.finish=complete;record.responseId=data.pageViewId;
        const cancel=()=>{clearTimeout(timer);record.aborted=true;reject(new DOMException('Cancelled','AbortError'));};
        if(init.signal?.aborted)cancel();else init.signal?.addEventListener('abort',cancel,{once:true});
      });
    };
  }
  await tab('Page.addScriptToEvaluateOnNewDocument', { source: `(${fixture.toString()})();` });
  const click = async (selector, label) => { await evaluate(`(()=>{const e=${label ? `Array.from(document.querySelectorAll(${JSON.stringify(selector)})).find(e=>e.textContent.trim()===${JSON.stringify(label)})` : `document.querySelector(${JSON.stringify(selector)})`};if(!e)throw new Error('Missing control');e.click()})()`); await delay(80); };
  const input = async (selector,value) => { await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}))})()`); await delay(80); };
  const viewport = async width => { await tab('Emulation.setDeviceMetricsOverride',{width,height:width<768?844:1000,deviceScaleFactor:1,mobile:width<768});await delay(100); };
  const theme = async dark => { if(await evaluate(`document.documentElement.classList.contains('dark')!==${dark}`)) await click('button[role="switch"]'); };
  const key = async name => { await tab('Input.dispatchKeyEvent',{type:'keyDown',key:name,code:name,windowsVirtualKeyCode:{Escape:27,Home:36,ArrowLeft:37}[name]});await tab('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name});await delay(100); };
  const view = async name => { await click('.admin-view-nav button',name);await waitFor(`!document.querySelector('.admin-view-content [aria-busy="true"]')`); };
  await viewport(1440);await navigate('/admin');await waitFor(`!!document.querySelector('#api-key')`);await theme(true);
  await screenshot('login-dark');
  assert.ok(!requests.some(url=>url.includes('/AdminDashboard-')||url.includes('/VisitorMap-')),'Dashboard/map loaded before sign-in');
  await input('#api-key','bad-key');await evaluate(`document.querySelector('#api-key').form.requestSubmit()`);await waitFor(`document.querySelector('[role="alert"]')?.textContent.includes('not accepted')`);
  await evaluate(`window.__mock.log=[]`);await input('#api-key','test-key');await evaluate(`document.querySelector('#api-key').form.requestSubmit()`);
  await waitFor(`!!document.querySelector('.admin-view-nav')`);
  assert.equal(await evaluate(`!!document.querySelector('.admin-panel[aria-busy="true"]')`),true,'Slow chart blocks the workspace');
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('.admin-metric>strong')).map(e=>e.textContent)`),['8','24','6','3.0']);
  await evaluate(`window.__mock.complete.timeline();window.__mock.slow=''`);
  await waitFor(`!!document.querySelector('.admin-traffic-chart')`);
  assert.equal(await evaluate(`window.__mock.log.filter(r=>r.path==='/api/dashboard/overview').length`),1,'Login fetch is duplicated');
  assert.equal(await evaluate(`window.__mock.log.filter(r=>r.path.startsWith('/api/dashboard/')).length`),4);
  assert.equal(await evaluate(`localStorage.getItem('admin_api_key')`),null);
  assert.equal(await evaluate(`sessionStorage.getItem('admin_api_key')`),'test-key');
  await screenshot('overview-dark');await theme(false);await screenshot('overview-light');await theme(true);
  await evaluate(`document.querySelector('.admin-traffic-chart').focus()`);await key('Home');assert.ok((await evaluate(`document.querySelector('.admin-chart-readout').textContent`)).includes('0 visits'));
  await click('.admin-chart-data summary');assert.equal(await evaluate(`document.querySelectorAll('.admin-chart-data tbody tr').length`),7);
  const count=await evaluate(`window.__mock.log.length`);
  await view('Content');assert.equal(await evaluate(`document.querySelectorAll('.admin-pages-table tbody tr').length`),3);
  await click('.admin-segmented button','Projects');assert.equal(await evaluate(`document.querySelectorAll('.admin-pages-table tbody tr').length`),1);
  await input('.admin-search input','missing');assert.ok((await evaluate(`document.body.innerText`)).includes('No pages match'));
  await input('.admin-search input','');await click('.admin-segmented button','All pages');await click('.admin-pages-table thead button','Avg. time');assert.ok((await evaluate(`document.querySelector('.admin-pages-table tbody tr').textContent`)).includes('Network AI Assistant'));
  await evaluate(`window.originalCreateURL=URL.createObjectURL;URL.createObjectURL=blob=>{window.exportedCsv=blob.text();return window.originalCreateURL(blob)};document.addEventListener('click',e=>{if(e.target instanceof HTMLAnchorElement&&e.target.download)e.preventDefault()},{capture:true})`);
  await click('.admin-segmented button','Projects');await click('.admin-panel-heading button','Export CSV');
  assert.ok((await evaluate(`window.exportedCsv`)).includes('Network AI Assistant'));assert.ok(!(await evaluate(`window.exportedCsv`)).includes('Résumé'));
  await screenshot('content-dark');await view('Overview');assert.equal(await evaluate(`window.__mock.log.length`),count+1,'Fresh tab data was not reused');
  await view('Audience');assert.equal(await evaluate(`document.querySelectorAll('.admin-visits-table tbody tr').length`),20);
  await click('.admin-pagination button','Next');await waitFor(`document.querySelectorAll('.admin-visits-table tbody tr').length===1`);
  await click('.admin-pagination button','Previous');await waitFor(`document.querySelectorAll('.admin-visits-table tbody tr').length===20`);
  await evaluate(`window.openerControl=document.querySelector('.admin-visit-link');window.openerControl.focus();window.openerControl.click()`);
  await waitFor(`document.querySelectorAll('.admin-journey-timeline li').length===3`);assert.equal(await evaluate(`document.body.style.overflow`),'hidden');await screenshot('visit-details-dark');await key('Escape');await waitFor(`!document.querySelector('dialog')`);assert.equal(await evaluate(`document.activeElement===window.openerControl`),true);
  await click('.admin-location-list button');await waitFor(`document.querySelectorAll('.admin-visits-table tbody tr').length===1`);
  assert.ok(await evaluate(`window.__mock.log.filter(r=>r.query.includes('location=')).every(r=>r.path==='/api/dashboard/visitors')`));
  await click('button','Clear location');await waitFor(`document.querySelectorAll('.admin-visits-table tbody tr').length===20`);
  assert.ok(!requests.some(url=>url.includes('/VisitorMap-')),'Map loaded before it was requested');
  await click('.admin-segmented button','Map');await waitFor(`!!document.querySelector('.admin-panel svg[viewBox="0 0 720 360"]') || Array.from(document.querySelectorAll('.admin-panel svg')).some(e=>e.querySelectorAll('path').length>50)`);assert.ok(requests.some(url=>url.includes('/VisitorMap-')));
  assert.equal(await evaluate(`Array.from(document.querySelectorAll('.admin-panel [fill]')).some(e=>e.getAttribute('fill').includes('NaN'))`),false,'Map country totals are not numeric');
  await evaluate(`(()=>{const svg=Array.from(document.querySelectorAll('.admin-panel svg')).find(e=>e.querySelectorAll('path').length>50);const country=Array.from(svg.querySelectorAll('path')).find(e=>e.style.cursor==='pointer');country.dispatchEvent(new MouseEvent('click',{bubbles:true}))})()`);
  await waitFor(`document.body.innerText.includes('8 visits')`);
  await screenshot('audience-map-dark');await view('Journeys');assert.equal(await evaluate(`document.querySelectorAll('.admin-paths li').length`),2);
  await screenshot('journeys-dark');
  for(const dark of [true,false])for(const width of [1440,768,390,320]){
    await theme(dark);await viewport(width);
    for(const name of ['Overview','Content','Audience','Journeys']){
      await view(name);assert.equal(await evaluate(`document.documentElement.scrollWidth>innerWidth`),false,`${name} overflows at ${width}`);
      if(width===390) {await evaluate(`scrollTo({top:0,behavior:'instant'})`);await screenshot(`${name.toLowerCase()}-${dark?'dark':'light'}-mobile`);}
    }
  }
  await viewport(1440);await theme(true);await view('Overview');
  await evaluate(`(()=>{window.__mock.slow='timeline';window.__mock.delay=15000;const e=document.querySelector('.admin-range select');e.value='24h';e.dispatchEvent(new Event('change',{bubbles:true}))})()`);
  await waitFor(`window.__mock.log.some(r=>r.path.endsWith('/timeline')&&r.query.includes('granularity=hour'))`);
  await evaluate(`(()=>{const e=document.querySelector('.admin-range select');e.value='7d';e.dispatchEvent(new Event('change',{bubbles:true}))})()`);
  await waitFor(`window.__mock.log.some(r=>r.path.endsWith('/timeline')&&r.query.includes('days=7'))`);
  assert.equal(await evaluate(`window.__mock.log.find(r=>r.path.endsWith('/timeline')&&r.query.includes('granularity=hour')).aborted`),true,'Previous range request was not cancelled');
  await evaluate(`window.__mock.complete.timeline();window.__mock.slow=''`);await waitFor(`!!document.querySelector('.admin-traffic-chart')`);
  await waitFor(`!document.querySelector('.admin-toolbar button').disabled`);
  await waitFor(`!document.querySelector('.admin-toolbar button').disabled`);
  await evaluate(`window.__mock.failure='referrers';window.__mock.slow=''`);await click('.admin-toolbar button','Refresh');await waitFor(`!!document.querySelector('.admin-panel [role="alert"]')`);assert.ok(await evaluate(`!!document.querySelector('.admin-view-nav')`),'Server failure signs the user out');assert.ok((await evaluate(`document.querySelector('.admin-panel [role="alert"]').textContent`)).includes('(500)'));
  await evaluate(`window.__mock.failure=''`);await click('.admin-panel [role="alert"] button');await waitFor(`!document.querySelector('.admin-panel [role="alert"]')`);
  await evaluate(`window.__mock.empty=true`);await click('.admin-toolbar button','Refresh');await waitFor(`document.querySelector('.admin-metric>strong')?.textContent==='0'`);await waitFor(`document.body.innerText.includes('No traffic recorded')`);await screenshot('empty-state');
  await evaluate(`window.__mock.failure='overview';window.__mock.failStatus=401`);await click('.admin-toolbar button','Refresh');await waitFor(`!!document.querySelector('#api-key')`);assert.equal(await evaluate(`sessionStorage.getItem('admin_api_key')`),null);
  await evaluate(`window.__mock.failure='';window.__mock.empty=false;window.__mock.slow='overview';window.__mock.delay=8000`);await input('#api-key','test-key');await evaluate(`document.querySelector('#api-key').form.requestSubmit()`);await waitFor(`document.body.innerText.includes('may be waking up')`);await click('.admin-login-status button','Cancel');assert.ok(await evaluate(`!document.querySelector('.admin-sign-in').disabled`));
  // Verify central tracking on a real multi-hook page without writing any server data.
  await navigate('/');await waitFor(`!!document.querySelector('#projects')`);await delay(300);assert.equal(await evaluate(`window.__mock.log.filter(r=>r.path.startsWith('/api/analytics')).length`),0,'Do Not Track ignored');
  await evaluate(`window.__mock.dnt='0';window.__mock.slow='/api/analytics/session';window.__mock.delay=15000`);await click('a[href="/about"]');
  await waitFor(`window.__mock.log.some(r=>r.path==='/api/analytics/session')`);await click('a[href="/"]');await waitFor(`!!document.querySelector('#projects')`);
  assert.equal(await evaluate(`window.__mock.log.filter(r=>r.path==='/api/analytics/pageview').length`),0,'Page view races session initialization');
  await evaluate(`window.__mock.complete['/api/analytics/session']()`);await waitFor(`window.__mock.log.filter(r=>r.method==='POST'&&r.path.endsWith('/pageview')&&r.done).length===2`);
  assert.equal(await evaluate(`window.__mock.log.filter(r=>r.path==='/api/analytics/session').length`),1,'Concurrent hooks duplicate session initialization');
  assert.deepEqual(await evaluate(`window.__mock.log.filter(r=>r.method==='POST'&&r.path.endsWith('/pageview')).map(r=>r.body.path)`),['/about','/'],'Quick navigation loses or duplicates views');
  await click('a[href="/resume"]');await waitFor(`window.__mock.log.some(r=>r.body?.path==='/resume')`);
  await evaluate(`(()=>{const a=Array.from(document.querySelectorAll('a')).find(e=>e.textContent.includes('Download PDF'));a.addEventListener('click',e=>e.preventDefault(),{once:true});a.click()})()`);await waitFor(`window.__mock.log.some(r=>r.body?.type==='resume_download')`);
  assert.equal(await evaluate(`window.__mock.log.find(r=>r.body?.type==='resume_download').body.path`),'/resume');
  await evaluate(`window.__mock.slow='/api/analytics/pageview';window.__mock.delay=15000`);await click('a[href="/about"]');
  await waitFor(`window.__mock.log.some(r=>r.body?.path==='/about'&&r.method==='POST'&&!r.done)`);
  await click('a[href="/resume"]');await waitFor(`window.__mock.log.some(r=>r.body?.path==='/resume'&&r.method==='POST'&&!r.done)`);
  await evaluate(`window.__mock.log.find(r=>r.body?.path==='/about'&&r.method==='POST'&&!r.done).finish()`);
  await waitFor(`window.__mock.log.some(r=>r.method==='PATCH'&&r.path.endsWith(window.__mock.log.filter(r=>r.body?.path==='/about'&&r.method==='POST').at(-1).responseId))`);
  await evaluate(`window.__mock.log.find(r=>r.body?.path==='/resume'&&r.method==='POST'&&!r.done).finish()`);
  // A new document on admin must never initialize a tracking session.
  await navigate('/admin');await waitFor(`!!document.querySelector('#api-key')`);await delay(100);assert.equal(await evaluate(`window.__mock.log.filter(r=>r.path.startsWith('/api/analytics')).length`),0);
  assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,checks:'Login, progressive loading, caching, server/auth failures, cancellation, all views, filters, sorting, map lazy load, pagination, visit dialog keyboard/focus, chart keyboard, empty data, 32 responsive layouts, tracking uniqueness/path/DNT',artifacts},null,2));
  await call('Browser.close');
} finally {
  ws?.close();chrome.kill();
  await new Promise(resolve=>setTimeout(resolve,300));
  await rm(profile,{recursive:true,force:true,maxRetries:3});
}
