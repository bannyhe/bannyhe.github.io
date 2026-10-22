import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { localeForPath, languagePath, translateText, localize } from '../src/i18n/locale.ts';
import { ROUTE_META, metaForPath } from '../src/lib/routeMeta.ts';

test('language paths are reversible and do not confuse similarly named routes',()=>{
  for(const path of ['/','/about','/resume','/project/ai-assistant','/admin']){
    const chinese=languagePath(path,'zh');
    assert.equal(localeForPath(chinese),'zh');
    assert.equal(languagePath(chinese,'en'),path);
    assert.equal(languagePath(chinese,'zh'),chinese);
  }
  assert.equal(localeForPath('/zhong'),'en');
  assert.equal(localeForPath('/zh'),'zh');
  assert.equal(languagePath('/zh','en'),'/');
});
test('translation preserves English text, technical values and React-like objects',()=>{
  const text='  Open menu  ';
  assert.equal(translateText(text,'en'),text);
  assert.equal(translateText(text,'zh'),'  打开菜单  ');
  assert.equal(translateText('esxi-07','zh'),'esxi-07');
  assert.equal(translateText('Network AI Assistant project preview','zh'),'网络 AI 助手项目预览');
  const value={id:'Network',children:'Home'};
  assert.equal(localize(value),value);
});
test('every public English route has a translated metadata counterpart',()=>{
  for(const route of ROUTE_META.filter(r=>!r.path.startsWith('/zh'))){
    const chinese=metaForPath(languagePath(route.path,'zh'));
    assert.equal(chinese.noIndex,route.noIndex);
    assert.match(chinese.title,/\p{Script=Han}/u);
    assert.match(chinese.description,/\p{Script=Han}/u);
  }
  assert.equal(metaForPath('/zh/').path,'/zh/');
  assert.equal(metaForPath('/zh/about/').path,'/zh/about');
  assert.equal(metaForPath('/zh/unknown').noIndex,true);
});
test('built Chinese deep links have their own language and canonical metadata',()=>{
  for(const route of ROUTE_META.filter(r=>r.path.startsWith('/zh'))){
    const html=readFileSync(new URL('../build'+route.path.replace(/\/$/,'')+'/index.html',import.meta.url),'utf8');
    assert.ok(html.includes('<html lang="zh-CN">'));
    assert.ok(html.includes('hreflang="en"')&&html.includes('hreflang="zh-CN"'));
    assert.ok(html.includes('rel="canonical" href="https://muheportfolio.com'+route.path+'"'));
    if(route.noIndex)assert.ok(html.includes('noindex, nofollow'));
  }
  const sitemap=readFileSync(new URL('../build/sitemap.xml',import.meta.url),'utf8');
  assert.ok(sitemap.includes('https://muheportfolio.com/zh/project/ai-assistant'));
  assert.ok(!sitemap.includes('/admin'));
});
