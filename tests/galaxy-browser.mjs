import { spawn } from 'node:child_process';
import { writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const artifacts = await mkdtemp(join(tmpdir(), 'muhe-galaxy-check-'));
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
  const oldHandler=ws.onmessage;ws.onmessage=event=>{const m=JSON.parse(event.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args.map(a=>a.value||a.description).join(' '));oldHandler(event);};
  await tab('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(navigator,'doNotTrack',{get:()=> '1'});"});
  const viewport=async(width,height=960)=>{await tab('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:2,mobile:width<768});await delay(150);};
  const seek=async progress=>{await evaluate("(()=>{const s=document.querySelector('.galaxy-hero');scrollTo({top:s.offsetTop+(s.offsetHeight-s.querySelector('.galaxy-stage').offsetHeight)*"+progress+",behavior:'instant'})})()");await delay(900);};
  await tab('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  for(const path of ['/','/zh/']){
    await viewport(1440);await navigate(path);await waitFor("document.querySelector('.galaxy-scene')?.dataset.renderer==='webgl'");
    for(const width of [1440,768,390,320]){
      await viewport(width,width<768?844:960);
      for(const dark of [false,true]){
        await evaluate("(()=>{const toggle=[...document.querySelectorAll('button[role=switch]')].find(e=>e.getBoundingClientRect().width>0);if(toggle.getAttribute('aria-checked')!=="+JSON.stringify(String(dark))+")toggle.click()})()");
        await waitFor("document.documentElement.classList.contains('dark')==="+dark);
        for(const [chapter,position] of [[0,0],[1,.30],[2,.64],[3,1]]){
          await seek(position);
          await waitFor("document.querySelector('.galaxy-hero').dataset.chapter==="+JSON.stringify(String(chapter)));
          assert.ok(!await evaluate('document.documentElement.scrollWidth>innerWidth+1'),'Horizontal overflow');
          assert.ok(await evaluate("document.querySelector('.galaxy-copy[data-active=true]').getBoundingClientRect().bottom < document.querySelector('.galaxy-footer').getBoundingClientRect().top"),'Copy overlaps controls');
          assert.ok(await evaluate("[...document.querySelectorAll('.galaxy-object-label')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1})"),'Domain label clipped');
          if((width===1440&&chapter===2)||(width===390&&chapter===0))await screenshot((path==='/zh/'?'zh':'en')+'-'+width+'-'+(dark?'dark':'light'));
        }
      }
    }
  }
  await viewport(1440);await seek(0);await delay(300);
  const reflectionTimes=()=>evaluate("[...document.querySelectorAll('.galaxy-reflection')].map(e=>e.getAnimations()[0]?.currentTime)");
  await waitFor("document.querySelector('.galaxy-atmosphere').dataset.motion==='playing'");
  const movingReflections=await reflectionTimes();await delay(700);
  assert.notDeepEqual(await reflectionTimes(),movingReflections,'Reflective background is static');
  const clip=await evaluate("(()=>{const r=document.querySelector('.galaxy-object').getBoundingClientRect();return {x:r.x-5,y:r.y-5,width:r.width+10,height:r.height+10,scale:1}})()");
  const frame=async()=> (await tab('Page.captureScreenshot',{format:'png',clip})).data;
  const frameDifference=(a,b)=>evaluate(`(async()=>{
    const read=async source=>{const img=new Image();img.src='data:image/png;base64,'+source;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return ctx.getImageData(0,0,c.width,c.height).data};
    const a=await read(${JSON.stringify(a)}),b=await read(${JSON.stringify(b)});let max=0,total=0;
    for(let i=0;i<a.length;i++){if(i%4===3)continue;const difference=Math.abs(a[i]-b[i]);max=Math.max(max,difference);total+=difference}
    return {max,mean:total/(a.length*.75)};
  })()`);
  await evaluate("document.querySelector('.home-motion-toggle').click()");await delay(1000);
  await waitFor("document.querySelector('.galaxy-atmosphere').dataset.motion==='paused'");
  const pausedReflections=await reflectionTimes();
  const frozen=await frame();await delay(700);const pausedDifference=await frameDifference(frozen,await frame());
  // Composited gradients can dither by 1–3 color levels while fully paused.
  assert.ok(pausedDifference.max<=3&&pausedDifference.mean<.6,'Paused scene moved: '+JSON.stringify(pausedDifference));
  assert.deepEqual(await reflectionTimes(),pausedReflections,'Pause did not freeze the reflections');
  await evaluate("document.querySelector('.home-motion-toggle').click();document.querySelector('.galaxy-object').focus()");
  await delay(1600);assert.ok((await frameDifference(frozen,await frame())).max>12,'Resume did not animate the object');
  assert.notDeepEqual(await reflectionTimes(),pausedReflections,'Resume did not animate the reflections');
  await evaluate("document.querySelector('#projects').scrollIntoView({behavior:'instant'});scrollBy({top:200,behavior:'instant'})");
  await waitFor("document.querySelector('.galaxy-atmosphere').dataset.motion==='paused'");
  await delay(200);const offscreenReflections=await reflectionTimes();await delay(500);
  assert.deepEqual(await reflectionTimes(),offscreenReflections,'Offscreen reflections keep running');
  await seek(0);await waitFor("document.querySelector('.galaxy-atmosphere').dataset.motion==='playing'");
  await evaluate("window.glExtension=document.querySelector('.galaxy-canvas').getContext('webgl2').getExtension('WEBGL_lose_context');window.glExtension.loseContext()");
  await waitFor("document.querySelector('.galaxy-scene').dataset.renderer==='fallback'");
  await waitFor("getComputedStyle(document.querySelector('.galaxy-fallback-icon')).opacity==='1'");
  await evaluate('window.glExtension.restoreContext()');await waitFor("document.querySelector('.galaxy-scene').dataset.renderer==='webgl'");await delay(1000);await screenshot('context-restored');
  await tab('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await waitFor("document.querySelector('.home-motion-toggle').disabled");
  await waitFor("document.querySelector('.galaxy-atmosphere').dataset.motion==='reduced'");
  assert.ok(await evaluate("[...document.querySelectorAll('.galaxy-reflection')].every(e=>e.getAnimations().length===0)"),'Reduced motion still animates the reflections');
  assert.equal(await evaluate("document.querySelector('.galaxy-hero').dataset.chapter"),'0');
  await screenshot('reduced-motion');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,artifacts,checks:'EN/ZH, four widths, light/dark, all scroll stops, reflections, pause/resume, offscreen pause, reduced motion, context recovery, runtime errors'}));
}finally{if(ws?.readyState===1)ws.close();chrome.kill('SIGTERM');}
