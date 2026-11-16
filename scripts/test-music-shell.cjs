const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
process.env.PORT='4184';const server=require('./serve.cjs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--autoplay-policy=user-gesture-required']});
 try{
  const context=await browser.newContext({serviceWorkers:'block',viewport:{width:430,height:850}});
  await context.addInitScript(()=>{if(window===top){const Original=Audio;window.__audioCount=0;window.Audio=function(...args){window.__audioCount++;window.__audio=new Original(...args);return window.__audio;};}});
  const page=await context.newPage();const url='http://127.0.0.1:4184/';
  await page.goto(url+'index.html');let frame=page.frames().find(f=>f!==page.mainFrame());
  await frame.waitForSelector('#settings');await frame.locator('h1').click();
  await page.waitForFunction(()=>GameMusic.state.playing&&GameMusic.state.time>0);
  const initial=await page.evaluate(()=>GameMusic.state.time);
  await frame.evaluate(()=>GameMusic.scene('home'));
  assert((await page.evaluate(()=>GameMusic.state.time))>=initial);
  // 模擬存檔完成後的延後導航，不以額外點擊解鎖新頁。
  async function go(name,scene){await frame.evaluate(name=>{location.href=name;},name);await frame.waitForURL('**/'+encodeURIComponent(name));await page.waitForFunction(scene=>GameMusic.state.scene===scene&&GameMusic.state.playing,scene);assert.equal(await page.evaluate(()=>window.__audioCount),1);}
  await go('桃園起兵.html','story');await go('戰場直版.html','battle');
  await frame.evaluate(()=>finish(true));assert.equal(await page.evaluate(()=>GameMusic.state.playing),false);
  await go('主介面流程預覽.html','home');
  await frame.locator('#settings').click();await frame.locator('#musicEnabled').uncheck();assert.equal(await page.evaluate(()=>GameMusic.state.playing),false);
  await frame.locator('#musicEnabled').check();await page.waitForFunction(()=>GameMusic.state.playing);
  await frame.locator('#musicVolume').fill('0.2');await frame.locator('#musicVolume').dispatchEvent('change');assert.equal(await page.evaluate(()=>GameMusic.state.volume),.2);
  await frame.evaluate(()=>document.getElementById('modal').close());
  assert.equal(await page.evaluate(()=>GameCanUpdate()),false); // 新玩家仍在教學入口，不允許更新。
  await go('桃園起兵.html','story');await page.goBack();await frame.waitForURL('**/'+encodeURIComponent('主介面流程預覽.html'));await page.waitForFunction(()=>GameMusic.state.scene==='home'&&GameMusic.state.playing);
  const direct=await context.newPage();await direct.goto(url+encodeURIComponent('戰場直版.html')+'?storySweep=1');await direct.waitForURL('**/index.html#page=*');await direct.waitForFunction(()=>document.getElementById('gamePage')?.contentWindow.location.search==='?storySweep=1');
  assert.equal(await direct.evaluate(()=>document.getElementById('gamePage').contentWindow.parent===window),true);
  console.log('PASS one persistent audio element, gesture unlock, delayed home/story/battle navigation, result stop, iframe settings, history back and legacy deep links.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
