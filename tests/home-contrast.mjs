import { spawn } from 'node:child_process';
// Sample live homepage text against rendered backdrops, with glyphs hidden to
// avoid measuring antialiasing. Gradient text includes intermediate color stops.
// WCAG 2.2: AAA text 7:1 / large text 4.5:1; AA meaningful icons 3:1.
// This checks sampled homepage states, not text embedded in portfolio images.
import { writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const artifacts = await mkdtemp(join(tmpdir(), 'muhe-contrast-check-'));
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

  await tab('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(navigator,'doNotTrack',{get:()=> '1'});"});
  await tab('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  const results=[];
  for (const width of [1440,390]) {
    await tab('Emulation.setDeviceMetricsOverride',{width,height:width<768?844:960,deviceScaleFactor:1,mobile:width<768});
    await navigate(width===1440?'/':'/zh/');
    await waitFor("document.readyState==='complete' && document.querySelector('.galaxy-scene')?.dataset.renderer==='webgl'");
    await evaluate('document.fonts.ready.then(()=>true)');
    await evaluate("(()=>{const s=document.createElement('style');s.textContent='*{transition:none!important}';document.head.append(s)})()");
    await delay(500);
    await evaluate("document.querySelector('.home-motion-toggle').click()");
    for(const dark of [false,true]) {
      await evaluate(`(()=>{const t=[...document.querySelectorAll('button[role=switch]')].find(e=>e.getBoundingClientRect().width);if(t.getAttribute('aria-checked')!=='${dark}')t.click()})()`);
      await waitFor(`document.documentElement.classList.contains('dark')===${dark}`);
      await delay(500);
      for(const state of ['hero-0','hero-13000','network','projects','footer']) {
        await evaluate(`(()=>{
          const hero=document.querySelector('.galaxy-hero');
          let top=0;
          if('${state}'==='network')top=(hero.offsetHeight-document.querySelector('.galaxy-stage').offsetHeight)*.64;
          if('${state}'==='projects')top=document.querySelector('#projects').offsetTop-80;
          if('${state}'==='footer')top=document.documentElement.scrollHeight-innerHeight;
          scrollTo({top,behavior:'instant'});
          document.querySelectorAll('.galaxy-reflection').forEach(e=>e.getAnimations().forEach(a=>a.currentTime=${state==='hero-13000'?13000:0}));
        })()`);
        await delay(800);
        if(state.startsWith('hero'))await waitFor("document.querySelector('.galaxy-hero').dataset.chapter==='0'");
        if(state==='network')await waitFor("document.querySelector('.galaxy-hero').dataset.chapter==='2'");
        const text=await evaluate(`(()=>{
          const result=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
          const pixel=document.createElement('canvas');pixel.width=pixel.height=1;const ctx=pixel.getContext('2d');
          const rgb=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3)};
          let node;while(node=walker.nextNode()) {
            if(!node.textContent.trim()||['STYLE','SCRIPT'].includes(node.parentElement.tagName))continue;
            const e=node.parentElement,c=getComputedStyle(e),range=document.createRange();range.selectNodeContents(node);
            let visible=true;for(let p=e;p;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||s.display==='none'||+s.opacity<.99){visible=false;break}}
            if(!visible)continue;
            const center=range.getBoundingClientRect();
            for(let p=e.parentElement;p;p=p.parentElement){const s=getComputedStyle(p),r=p.getBoundingClientRect();if(/hidden|clip/.test(s.overflow)&&(center.y+center.height/2<r.top||center.y+center.height/2>r.bottom))visible=false}
            const nav=document.querySelector('nav.fixed');if(nav&&!e.closest('nav.fixed')&&center.y+center.height/2<nav.getBoundingClientRect().bottom)visible=false;
            if(!visible)continue;
            const rects=[...range.getClientRects()].filter(r=>r.width&&r.height&&r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight).map(r=>({x:r.x,y:r.y,width:r.width,height:r.height}));
            if(!rects.length)continue;
            let colors=[rgb(c.color)];
            let gradient=e;while(gradient&&getComputedStyle(gradient).backgroundClip!=='text')gradient=gradient.parentElement;
            if(gradient){
              const stops=getComputedStyle(gradient).backgroundImage.match(/(?:rgb|oklab|oklch|color)\\([^)]*\\)/g)||[];
              colors=[];
              for(let i=0;i<stops.length-1;i++)for(let j=0;j<=16;j++)colors.push(rgb('color-mix(in oklab,'+stops[i]+' '+(j/16*100)+'%,'+stops[i+1]+')'));
              if(!colors.length)throw new Error('Could not read headline gradient: '+c.backgroundImage);
            }
            result.push({text:node.textContent.trim(),selector:e.className,colors,required:parseFloat(c.fontSize)>=24||(parseFloat(c.fontSize)>=18.667&&parseInt(c.fontWeight)>=700)?4.5:7,rects});
          }
          const iconSelectors='.home-primary-action svg,.home-secondary-action svg,.home-motion-toggle svg,.galaxy-stop-title svg,#mobile-menu-button svg,button[role=switch] span svg,button[role=switch] > svg';
          for(const icon of document.querySelectorAll(iconSelectors)){
            let visible=true;for(let p=icon;p;p=p.parentElement){const style=getComputedStyle(p);if(style.visibility==='hidden'||style.display==='none'||+style.opacity<.99)visible=false}
            const toggle=icon.parentElement;if(toggle.matches('button[role=switch]')){const dark=toggle.getAttribute('aria-checked')==='true';if((dark&&icon===toggle.children[1])||(!dark&&icon===toggle.children[0]))visible=false}
            const r=icon.getBoundingClientRect();if(!visible||!r.width||r.top<0||r.bottom>innerHeight)continue;
            const nav=document.querySelector('nav.fixed');if(!icon.closest('nav.fixed')&&r.top<nav.getBoundingClientRect().bottom)continue;
            result.push({text:'[icon] '+icon.parentElement.className,colors:[rgb(getComputedStyle(icon).color)],required:3,rects:[{x:r.x,y:r.y,width:r.width,height:r.height}]});
          }
          const style=document.createElement('style');style.id='contrast-hide-text';style.textContent='*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important} .orbital-home :is(.galaxy-copy,.home-work-heading,.home-contact-card) :is(h1,h2,h3){background-image:none!important}';document.head.append(style);
          return result;
        })()`);
        const {data}=await tab('Page.captureScreenshot',{format:'png'});
        await evaluate("document.getElementById('contrast-hide-text').remove()");
        const measured=await evaluate(`(async()=>{
          const img=new Image();img.src='data:image/png;base64,${data}';await img.decode();
          const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
          const luminance=rgb=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
          return ${JSON.stringify(text)}.map(item=>{
            let min=1,max=0,minBg,maxBg;
            for(const r of item.rects)for(let y=Math.ceil(r.y);y<r.y+r.height;y+=2)for(let x=Math.ceil(r.x);x<r.x+r.width;x+=2){
              const i=(y*canvas.width+x)*4,bg=[pixels[i],pixels[i+1],pixels[i+2]],l=luminance(bg);if(l<min){min=l;minBg=bg}if(l>max){max=l;maxBg=bg}
            }
            let ratio=100,fg,bg;
            for(const color of item.colors){const l=luminance(color);for(const [b,rgb] of [[min,minBg],[max,maxBg]]){const c=(Math.max(l,b)+.05)/(Math.min(l,b)+.05);if(c<ratio){ratio=c;fg=color;bg=rgb}}}
            return {text:item.text,ratio,required:item.required,fg,bg};
          });
        })()`);
        const failures=measured.filter(r=>r.ratio<r.required);
        const entry={width,dark,state,count:measured.length,minBody:Math.min(...measured.filter(r=>r.required===7).map(r=>r.ratio)),minLarge:Math.min(...measured.filter(r=>r.required===4.5).map(r=>r.ratio)),minIcon:Math.min(...measured.filter(r=>r.required===3).map(r=>r.ratio)),failures};
        results.push(entry);console.log(JSON.stringify(entry));
        if(state==='hero-13000'||state==='network')await screenshot(width+'-'+dark+'-'+state);
      }
    }
  }
  await writeFile(join(artifacts,'contrast.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify({artifacts,failures:results.flatMap(r=>r.failures).length}));
  assert.equal(results.flatMap(r=>r.failures).length,0,'Text fell below AAA contrast in sampled backgrounds');
}finally{if(ws?.readyState===1)ws.close();chrome.kill('SIGTERM');}
