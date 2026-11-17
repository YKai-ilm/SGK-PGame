const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
process.env.PORT='4188';const server=require('./serve.cjs');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const context=await browser.newContext({viewport:{width:430,height:839},serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await context.addInitScript(()=>{delete Navigator.prototype.serviceWorker;});
 const base='http://127.0.0.1:4188/';
 await page.goto(base+'場景重測.html');
 const original=await page.evaluate(()=>{localStorage.setItem('three-kingdoms-interface-preview-v1',JSON.stringify({version:1,mode:'story',tutorial:{status:'completed'},teams:{},unlocks:{},storyEvents:{yunlongBanditsDefeated:true},rewards:{wallet:{coins:999},claims:{yunlongTreeBag:true}}}));return localStorage.getItem('three-kingdoms-interface-preview-v1');});
 await page.locator('[data-scene="yunlong"]').click();
 async function game(name){await page.waitForTimeout(300);return page.frames().find(f=>decodeURIComponent(f.url()).split('?')[0].endsWith('/'+name));}
 let frame=await game('雲龍山場景預覽.html');assert(frame);
 assert(await frame.locator('#sceneTestBar').isVisible());assert(await frame.locator('#treeBag').isVisible());await page.screenshot({path:'.scene-reset-mobile.png'});
 await frame.locator('#treeBag').click();await frame.locator('#foundItem').waitFor({state:'visible'});assert(await frame.locator('#treeBag').isHidden());await frame.locator('#closeFound').click();
 await frame.locator('#cliffChest').click();await frame.locator('#foundItem').waitFor({state:'visible'});await frame.locator('#closeFound').click();
 assert(await frame.locator('#cliffChest').evaluate(e=>e.classList.contains('opened')));
 await frame.evaluate(()=>{localStorage.testProperty='yes';if(localStorage.testProperty!=='yes'||!Object.keys(localStorage).includes('testProperty'))throw Error('storage facade');delete localStorage.testProperty;});
 page.once('dialog',d=>d.accept());await frame.getByRole('button',{name:'恢復初始值',exact:true}).click();frame=await game('雲龍山場景預覽.html');assert(await frame.locator('#treeBag').isVisible());assert(!(await frame.locator('#cliffChest').evaluate(e=>e.classList.contains('opened'))));
 // 跨頁後仍維持測試資料；正式存檔由另一個獨立分頁驗證。
 await frame.evaluate(()=>location.href='徐州劇情.html');frame=await game('徐州劇情.html');assert(await frame.locator('#sceneTestBar').isVisible());
 const real=await context.newPage();await real.goto(base+'場景重測.html');assert.equal(await real.evaluate(()=>localStorage.getItem('three-kingdoms-interface-preview-v1')),original);await real.close();
 await frame.evaluate(()=>addEventListener('pagehide',()=>localStorage.setItem('three-kingdoms-interface-preview-v1','UNLOAD MUST STAY ISOLATED')));
 await frame.getByRole('button',{name:'退出測試',exact:true}).click();await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>localStorage.getItem('three-kingdoms-interface-preview-v1')),original);
 for(const id of ['taoyuan','xuzhou']){await page.locator('[data-scene="'+id+'"]').click();frame=await game(id==='taoyuan'?'桃園起兵.html':'徐州劇情.html');assert(await frame.locator('#sceneTestBar').isVisible());await frame.getByRole('button',{name:'退出測試',exact:true}).click();await page.waitForTimeout(300);}
 assert.deepEqual(errors,[]);console.log('PASS scene reset, repeated loot, cross-page isolation, real save preservation and three entrances');
 }finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
