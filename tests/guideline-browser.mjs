import { spawn } from 'node:child_process';
import { writeFile, mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const artifacts = await mkdtemp(join(tmpdir(), 'muhe-guideline-check-'));
const profile = join(artifacts, 'chrome');
import assert from 'node:assert/strict';

const origin = process.argv[2] || 'http://127.0.0.1:3000';
const chrome = spawn(process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-first-run', '--no-default-browser-check',
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
      message.error ? item.reject(new Error(JSON.stringify(message.error) + " in " + item.method + " " + JSON.stringify(item.params))) : item.resolve(message.result);
    }
  };
  function call(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++seq;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 15000);
      pending.set(id, { resolve, reject, timer, method, params });
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

  const errors=[];
  const oldHandler=ws.onmessage;
  ws.onmessage=event=>{const m=JSON.parse(event.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args.map(a=>a.value||a.description).join(' '));oldHandler(event);};
  await tab('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(navigator,'doNotTrack',{get:()=> '1'});"});
  const viewport=async(width,height=960)=>{await tab('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<768});await delay(100);};
  const theme=async dark=>{
    await evaluate("(()=>{const toggle=[...document.querySelectorAll('button[role=switch]')].find(e=>e.getBoundingClientRect().width>0);if(toggle.getAttribute('aria-checked')!=="+JSON.stringify(String(dark))+")toggle.click()})()");
    await waitFor("document.documentElement.classList.contains('dark')==="+dark);
  };
  const ready=async()=>{await waitFor("document.querySelector('.guide-content') && document.readyState==='complete'");await evaluate('document.fonts.ready.then(()=>true)');};
  for(const path of ['/guideline','/zh/guideline']){
    await viewport(1440);await navigate(path);await ready();
    assert.equal(await evaluate('document.documentElement.lang'),path.startsWith('/zh')?'zh-CN':'en');
    assert.ok(await evaluate("document.querySelector('link[rel=canonical]').href.endsWith(location.pathname)"));
    for(const width of [1440,768,390,320]){
      await viewport(width,width<768?844:960);
      for(const dark of [false,true]){
        await theme(dark);
        assert.ok(!await evaluate('document.documentElement.scrollWidth>innerWidth+1'),`Overflow ${path} ${width} ${dark}`);
        assert.ok(await evaluate("[...document.querySelectorAll('.guide-section,.guide-intro')].every(e=>e.getBoundingClientRect().right<=innerWidth+1)"));
        if(width===1440||width===390){
          await evaluate("scrollTo({top:0,behavior:'instant'})");
          await screenshot((path.startsWith('/zh')?'zh':'en')+'-'+width+'-'+(dark?'dark':'light'));
        }
      }
    }
  }
  await viewport(1440);await navigate('/guideline#color');await ready();
  await waitFor("document.activeElement.id==='color'");
  assert.ok(await evaluate("Math.abs(document.getElementById('color').getBoundingClientRect().top-128)<3"),'Deep link not positioned below navigation');
  await theme(false);await screenshot('en-color-light');await theme(true);await screenshot('en-color-dark');
  await evaluate("document.querySelector('.guide-sidebar a[href=\"#typography\"]').click()");
  await waitFor("document.activeElement.id==='typography'");
  await waitFor("document.querySelector('.guide-sidebar a[aria-current]').hash==='#typography'");
  await evaluate('history.back()');await waitFor("document.activeElement.id==='color'");
  await call('Browser.grantPermissions',{permissions:['clipboardReadWrite','clipboardSanitizedWrite'],origin});
  await tab('Emulation.setFocusEmulationEnabled',{enabled:true});
  await evaluate("document.querySelector('.guide-copy').click()");
  await waitFor("document.querySelector('.guide-live-notice').textContent.includes('Copied')");
  assert.equal(await evaluate('navigator.clipboard.readText()'),'#BD007D');
  await call('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:artifacts});
  await evaluate("document.querySelector('.guide-text-button').click()");
  await delay(700);
  const tokens=JSON.parse(await readFile(join(artifacts,'mu-he-design-reference.json'),'utf8'));
  assert.equal(tokens.color.dark.canvas,'#0A111D');
  assert.equal(tokens.layout.projectImageRatio,'4 / 3');
  await evaluate("document.querySelector('#layout .guide-segment button:last-child').click()");
  assert.ok(await evaluate("document.querySelector('.guide-mini-page').classList.contains('is-compact')"));
  await evaluate("document.querySelector('#layout .guide-segment button:first-child').click()");
  assert.ok(!await evaluate("document.querySelector('.guide-mini-page').classList.contains('is-compact')"));
  await evaluate("document.querySelector('.guide-action-row button').click()");
  assert.equal(await evaluate("document.querySelector('.guide-action-row button').getAttribute('aria-pressed')"),'true');
  await evaluate("document.querySelector('.guide-action-row button:nth-child(2)').click()");
  assert.equal(await evaluate("document.querySelector('.guide-action-row button').getAttribute('aria-pressed')"),'false');
  await evaluate("document.querySelector('.guide-project-card').focus(); document.querySelector('.guide-project-card').click()");
  await waitFor("document.querySelector('dialog')?.open");
  assert.ok(await evaluate("document.querySelector('dialog img').complete && document.querySelector('dialog img').naturalWidth>0"));
  await screenshot('media-dialog');
  await tab('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await tab('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await waitFor("!document.querySelector('dialog')");
  assert.ok(await evaluate("document.activeElement.classList.contains('guide-project-card')"),'Dialog did not restore focus');
  await evaluate("document.querySelector('.guide-sidebar a[href=\"#motion\"]').click()");
  await waitFor("document.activeElement.id==='motion'");
  await evaluate("document.querySelector('.guide-replay').click()");
  assert.ok(await evaluate("document.querySelector('.guide-motion-object').getAnimations().length>0"));
  await delay(800);
  assert.equal(await evaluate("document.querySelector('.guide-motion-object').getAnimations().length"),0,'Motion keeps running');
  await tab('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await waitFor("document.querySelector('.guide-replay').disabled");
  assert.equal(await evaluate("document.querySelector('.guide-motion-object').getAnimations().length"),0);
  await viewport(390,844);
  await evaluate("(()=>{const select=document.querySelector('#guide-section-select');select.value='accessibility';select.dispatchEvent(new Event('change',{bubbles:true}));})()");
  await waitFor("document.activeElement.id==='accessibility'");
  assert.ok(await evaluate("document.getElementById('accessibility').getBoundingClientRect().top>=155"));
  await delay(400);
  assert.ok(await evaluate("document.querySelector('.guide-mobile-nav').getBoundingClientRect().top >= document.querySelector('.guideline-shell nav.fixed').getBoundingClientRect().bottom - 1"),'Mobile contents overlaps site navigation');
  assert.equal(await evaluate("document.querySelector('#guide-section-select').value"),'accessibility','Mobile contents does not follow the active section');
  await screenshot('mobile-accessibility');
  await viewport(1440);await theme(false);
  for (const section of ['typography','layout','components','motion','patterns']) {
    await evaluate("document.querySelector('.guide-sidebar a[href=\"#"+section+"\"]').click()");
    await waitFor("document.activeElement.id==="+JSON.stringify(section));
    await screenshot(section+'-desktop');
  }
  // Verify the shared footer works when navigating from a different route.
  await navigate('/about');await waitFor("!!document.querySelector('.footer-guideline-link')");
  await evaluate("document.querySelector('.footer-guideline-link').click()");await ready();
  assert.equal(await evaluate('location.pathname'),'/guideline');
  // GitHub Pages redirects directory routes to a trailing slash.
  for (const path of ['/guideline/', '/zh/guideline/']) {
    await navigate(path); await ready();
    assert.ok(await evaluate("!!document.querySelector('.guideline-shell')"), 'Direct directory URL lost its theme');
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,artifacts,checks:'EN/ZH, light/dark, 1440/768/390/320, direct fragment and browser history, clipboard, token download, responsive demo, button states, media dialog/Escape/focus return, finite motion and reduced motion, mobile contents, footer navigation, runtime errors'}));
}finally{if(ws?.readyState===1)ws.close();chrome.kill('SIGTERM');}
