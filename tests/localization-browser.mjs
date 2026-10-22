import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const artifacts = await mkdtemp(join(tmpdir(), 'muhe-zh-check-'));
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



  try { process.loadEnvFile('.env.local'); } catch {}
  const errors = [], reports = [];
  const oldHandler = ws.onmessage;
  ws.onmessage = event => {
    const m=JSON.parse(event.data);
    if(m.method==='Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    oldHandler(event);
  };
  const adminTest=readFileSync(new URL('./admin-browser.mjs',import.meta.url),'utf8');
  const fixture=adminTest.slice(adminTest.indexOf('  function fixture() {'),adminTest.indexOf("  await tab('Page.addScriptToEvaluateOnNewDocument'"));
  await tab('Page.addScriptToEvaluateOnNewDocument',{source:fixture+"\nfixture();window.__mock.slow='';"});
  await tab('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const input=async(selector,value)=>{await evaluate("(()=>{const e=document.querySelector("+JSON.stringify(selector)+");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,"+JSON.stringify(value)+");e.dispatchEvent(new Event('input',{bubbles:true}))})()");await delay(50);};
  const click=async selector=>{await evaluate("(()=>{const e=document.querySelector("+JSON.stringify(selector)+");e.focus();e.click()})()");await delay(100);};
  const key=async name=>{await tab('Input.dispatchKeyEvent',{type:'keyDown',key:name,code:name,windowsVirtualKeyCode:name==='Escape'?27:undefined});await tab('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name});await delay(120);};
  const viewport=async width=>{await tab('Emulation.setDeviceMetricsOverride',{width,height:width<768?844:1000,deviceScaleFactor:1,mobile:width<768});await delay(100);};
  async function unlock(path){
    if(!path.includes('/project/ai-assistant')&&!path.includes('/project/vcf-network'))return;
    await waitFor("!!document.querySelector('main')");
    if(await evaluate("!!document.querySelector('input[type=password]')")){
      await input('input[type=password]',path.includes('ai-assistant')?process.env.VITE_AI_ASSISTANT_PASSWORD:process.env.VITE_VCF_PROJECT_PASSWORD||'local-translation-check');
      await evaluate("document.querySelector('input[type=password]').form.requestSubmit()");
      await waitFor("!!document.querySelector('.project-hero')");
    } else assert.ok(await evaluate("!!document.querySelector('.project-hero')"),'Password gate unconfigured: '+path);
  }
  async function collect(path){
    return evaluate("("+function(path){
      const texts=[],walker=document.createTreeWalker(document.querySelector('main')||document.body,NodeFilter.SHOW_TEXT);
      let node;while(node=walker.nextNode()){
        const p=node.parentElement;if(!p||p.closest('script,style,video'))continue;
        const s=node.textContent.replace(/\s+/g,' ').trim();
        if(s&&/[A-Za-z]{2}/.test(s)&&!/\p{Script=Han}/u.test(s))texts.push(s);
      }
      return {path,lang:document.documentElement.lang,title:document.querySelector('h1')?.textContent,
        english:[...new Set(texts)],englishAttributes:[...new Set([...document.querySelectorAll('[alt],[aria-label],[title],[placeholder]')].flatMap(e=>['alt','aria-label','title','placeholder'].map(a=>e.getAttribute(a))).filter(s=>s&&/[A-Za-z]{2}/.test(s)&&!/[\u3400-\u9fff]/.test(s)))],overflow:document.documentElement.scrollWidth>innerWidth+1,
        overflowing:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+2&&getComputedStyle(e).position!=='absolute'&&getComputedStyle(e).position!=='fixed'}).slice(0,8).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.slice(0,60)})),
        languageHref:document.querySelector('.language-switch')?.getAttribute('href'),
        canonical:document.querySelector('link[rel=canonical]')?.getAttribute('href')};
    }.toString()+")("+JSON.stringify(path)+")");
  }

  if(process.argv.includes('--export-resume')){
    await viewport(1100);await navigate('/zh/resume');await waitFor("document.querySelectorAll('.resume-entry').length===6");
    await evaluate("document.documentElement.classList.remove('dark');document.fonts.ready");
    await evaluate("(()=>{const s=document.createElement('style');s.textContent="+JSON.stringify("\n@page { size: A4; margin: 12mm 14mm; }\nnav, footer, .resume-download, .resume-page svg { display:none!important; }\nhtml, body, #root, #root>div { background:white!important; color:#111!important; }\n#root>div>.fixed { display:none!important; }\n.resume-page { padding:0!important; }\n.resume-page .container { max-width:none!important; padding:0!important; }\n.resume-page * { color:#162b43!important; -webkit-text-fill-color:#162b43!important; background:none!important; box-shadow:none!important; backdrop-filter:none!important; opacity:1!important; transform:none!important; }\n.resume-page h1 { font-size:22pt!important; margin:0 0 4mm!important; text-align:left!important; }\n.resume-page h2 { font-size:14pt!important; }\n.resume-page h3 { font-size:11pt!important; }\n.resume-page p, .resume-page li, .resume-page span { font-size:9pt!important; line-height:1.65!important; }\n.resume-page .mb-12 { margin-bottom:4mm!important; }\n.resume-section { padding:0!important; margin:0 0 4mm!important; border:0!important; border-radius:0!important; }\n.resume-section-heading { margin-bottom:2mm!important; }\n.resume-section-heading > div { display:none!important; }\n.resume-entry { padding:2mm 0!important; border:0!important; break-inside:avoid; margin-top:1mm!important; }\n.resume-entry-heading { margin-bottom:1mm!important; flex-direction:row!important; justify-content:space-between!important; align-items:flex-start!important; }\n.resume-entry-heading>div:last-child { text-align:right!important; margin-top:0!important; }\n.resume-print-education { break-before:page; }\n.resume-page .space-y-8>*+*, .resume-page .space-y-6>*+* { margin-top:2mm!important; }\n.resume-page ul { margin:0!important; }\n.resume-page .grid { display:block!important; }\n.resume-page .flex.justify-end { display:none!important; }\n.resume-page .resume-section:last-child .space-y-4 { display:flex!important; gap:4mm!important; }\n")+";document.head.append(s);const h=document.querySelector('h1');h.textContent='Mu He｜高级产品设计师';const p=document.createElement('p');p.textContent='bannyhe@umich.edu · muheportfolio.com/zh/';h.after(p);document.querySelectorAll('.resume-section')[1].classList.add('resume-print-education');document.title='Mu He · 简历'})()");
    await tab('Emulation.setEmulatedMedia',{media:'print'});
    const pdf=await tab('Page.printToPDF',{printBackground:true,preferCSSPageSize:true,generateTaggedPDF:true});
    await writeFile('public/resume/Mu-He-Resume-zh-CN.pdf',Buffer.from(pdf.data,'base64'));
    console.log('Generated Chinese resume PDF');
  } else {
  const paths=['/','/about','/resume','/project/malware-prevention','/project/northstar-onboarding','/project/vcf-network','/project/xenith-website','/project/ai-assistant'];
  await viewport(1440);
  for(const path of paths){
    await navigate('/zh'+(path==='/'?'/':path));await waitFor("!!document.querySelector('main h1, main input[type=password]')");await unlock(path);await delay(300);
    const r=await collect(path);reports.push(r);assert.equal(r.lang,'zh-CN');assert.notEqual(r.title,'这个页面不存在','Missing route '+path);assert.ok(!r.overflow,'Desktop overflow: '+path);
    if(path==='/'||path==='/resume'||path.includes('ai-assistant'))await screenshot('zh-'+(path==='/'?'home':path.split('/').at(-1))+'-desktop');
    if(path.includes('/project/')){
      await click('.project-contents-toggle');assert.ok(await evaluate("document.querySelector('.project-contents-panel').textContent.includes('本页内容')"));
      await key('Escape');assert.equal(await evaluate("!!document.querySelector('.project-contents-panel')"),false);
    }
    for(const width of [390,320]){
      await viewport(width);
      for(const dark of [false,true]){
        await evaluate("document.documentElement.classList.toggle('dark',"+dark+")");await delay(80);
        assert.ok(!await evaluate("document.documentElement.scrollWidth>innerWidth+1"),width+'px overflow: '+path);
        if(width===390&&dark&&(path==='/'||path.includes('ai-assistant')))await screenshot('zh-'+(path==='/'?'home':path.split('/').at(-1))+'-mobile-dark');
      }
    }
    await viewport(1440);console.log('Checked '+path);
    await writeFile(join(artifacts,'audit.json'),JSON.stringify({reports,errors},null,2));
  }
  await navigate('/zh/about?source=language-test#contact');await waitFor("!!document.querySelector('.language-switch')");
  assert.equal(await evaluate("document.querySelector('.language-switch').getAttribute('href')"),'/about?source=language-test#contact');
  await click('.language-switch');await waitFor("document.documentElement.lang==='en'&&document.querySelector('h1')?.textContent==='About Me'");
  assert.ok(await evaluate("location.search==='?source=language-test'&&location.hash==='#contact'"));
  await click('.language-switch');await waitFor("document.documentElement.lang==='zh-CN'&&document.querySelector('h1')?.textContent==='关于我'");
  await click('a[href="/zh/resume"]');await waitFor("document.querySelector('h1')?.textContent==='简历'");
  assert.equal(await evaluate("document.querySelector('link[rel=canonical]').href"),'https://muheportfolio.com/zh/resume');
  await evaluate("history.back()");await waitFor("document.querySelector('h1')?.textContent==='关于我'");
  await viewport(390);await click('#mobile-menu-button');assert.ok(await evaluate("document.querySelector('#mobile-menu').textContent.includes('简历')"));await key('Escape');
  await navigate('/zh/missing-page');await waitFor("document.querySelector('h1')?.textContent==='这个页面不存在'");assert.equal(await evaluate("document.querySelector('meta[name=robots]').content"),'noindex, nofollow');
  await navigate('/zh/project/ai-assistant');await waitFor("!!document.querySelector('main h1, main input[type=password]')");await unlock('/project/ai-assistant');await click('.ai-media-button');
  await waitFor("!!document.querySelector('dialog[open]')");assert.ok(await evaluate("!!document.querySelector('button[aria-label=\"关闭放大图片\"]')"));await key('Escape');
  await viewport(1440);await navigate('/zh/admin');await waitFor("!!document.querySelector('#api-key')");
  await input('#api-key','test-key');await evaluate("document.querySelector('#api-key').form.requestSubmit()");await waitFor("!!document.querySelector('.admin-view-nav')");
  for(const label of ['概览','内容','访客','浏览路径']){
    await evaluate("Array.from(document.querySelectorAll('.admin-view-nav button')).find(e=>e.textContent.trim()==="+JSON.stringify(label)+").click()");await delay(400);

    if(label==='内容'){
      await evaluate("window.originalCreateURL=URL.createObjectURL;URL.createObjectURL=blob=>{window.exportedCsv=blob.text();return window.originalCreateURL(blob)};document.addEventListener('click',e=>{if(e.target instanceof HTMLAnchorElement&&e.target.download)e.preventDefault()},{capture:true})");
      await click('.admin-panel-heading button');
      const csv=await evaluate('window.exportedCsv');
      assert.ok(csv.includes('统计起点（PST）')&&csv.includes('页面'));
    }

    reports.push(await collect('/admin/'+label));
    for(const width of [1440,390,320]){await viewport(width);assert.ok(!await evaluate("document.documentElement.scrollWidth>innerWidth+1"),'Admin overflow '+label);}
  }


  // Locale URLs remain distinct in analytics; admin visits remain excluded.
  await navigate('/zh/about');await waitFor("document.querySelector('h1')?.textContent==='关于我'");
  await evaluate("window.__mock.dnt='0';window.__mock.log=[]");
  await click('a[href="/zh/resume"]');await waitFor("window.__mock.log.some(r=>r.path==='/api/analytics/pageview'&&r.body.path==='/zh/resume')");
  await evaluate("window.__mock.log=[];history.pushState({},'','/zh/admin');window.dispatchEvent(new PopStateEvent('popstate'))");
  await waitFor("!!document.querySelector('#api-key')");await delay(150);
  assert.ok(!await evaluate("window.__mock.log.some(r=>r.path==='/api/analytics/pageview')"));

  // Exercise the animated scroll chapters as well as the reduced-motion layout.
  await tab('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await navigate('/zh/');await waitFor("!!document.querySelector('.galaxy-chapters')");
  for(const width of [1440,390]){
    await viewport(width);
    for(const [chapter,at] of [[0,0],[1,.30],[2,.64],[3,1]]){
      await evaluate("(()=>{const s=document.querySelector('.galaxy-hero');const distance=s.offsetHeight-s.querySelector('.galaxy-stage').offsetHeight;window.scrollTo({top:s.offsetTop+distance*"+at+",behavior:'instant'})})()");
      await waitFor("document.querySelector('.galaxy-hero').dataset.chapter==="+JSON.stringify(String(chapter)));
      assert.ok(!await evaluate("document.documentElement.scrollWidth>innerWidth+1"),'Animated home overflow');
      assert.ok(await evaluate("document.querySelector('.galaxy-copy[data-active=true]').getBoundingClientRect().bottom < document.querySelector('.galaxy-footer').getBoundingClientRect().top"),'Chapter overlaps controls');
      if(chapter===2)await screenshot('zh-network-chapter-'+width);
    }
  }
  await tab('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await viewport(1440);await navigate('/');await waitFor("!!document.querySelector('.home-project')");assert.equal(await evaluate("document.documentElement.lang"),'en');
  assert.equal(await evaluate("document.querySelectorAll('.home-project').length"),5);
  assert.ok(await evaluate("document.querySelector('#home-heading').textContent.includes('Complexity')"));
  await screenshot('english-home-regression');
  await writeFile(join(artifacts,'audit.json'),JSON.stringify({reports,errors},null,2));
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,artifacts,checks:'8 Chinese pages; 320/390/1440px; both themes; protected cases; contents; lightbox; locale navigation; admin fixtures; English regression'}));

  }
} finally {
  console.log('Artifacts: '+artifacts);
  if(ws?.readyState===1) ws.close();
  chrome.kill('SIGTERM');
}
