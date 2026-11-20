const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
process.env.PORT='4199';const server=require('./serve.cjs');
(async()=>{let browser;try{browser=await chromium.launch({channel:'msedge',headless:true});
for(const legacy of [false,true]){
 const c={crypto:require('crypto').webcrypto};c.window=c;vm.runInNewContext(fs.readFileSync('玩家武將.js','utf8'),c);
 const seed={version:1,mode:'story',storyFaction:'蜀',libraryFaction:'蜀',page:'home',tutorial:{status:'skipped'},teams:{},storyEvents:{peachOath:true},rewards:{claims:{taoyuanMotherFarewell:{}},history:[]}};
 c.PlayerOfficer.create(seed,'測試將','全能');if(legacy){seed.playerOfficer.fragments=20;seed.rewards.claims['chapter:1:player-fragments-v1']={key:'chapter:1:player-fragments-v1',playerFragments:20};}
 const page=await browser.newPage({viewport:{width:430,height:932}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(seed=>{delete Navigator.prototype.serviceWorker;if(!localStorage.getItem('chest-test-seeded')){localStorage.setItem('three-kingdoms-interface-preview-v1',JSON.stringify(seed));localStorage.setItem('chest-test-seeded','1');}},seed);
 await page.goto('http://127.0.0.1:4199/'+encodeURIComponent('主介面流程預覽.html'));
 await page.waitForFunction(()=>window.ProgressRewards||document.querySelector('#gamePage')?.contentWindow?.ProgressRewards);
 const g=await page.evaluate(()=>!!window.ProgressRewards)?page:await(await page.$('#gamePage')).contentFrame();
 await g.locator('[data-a="rewards"]').first().click();await g.locator('[data-a="rewardTab"][data-tab="achievement"]').click();
 const card=g.locator('section.panel').filter({has:g.locator('[data-id="chapter-1"]')});assert.match(await card.innerText(),/二級寶箱 ×1/);if(legacy)assert.match(await card.innerText(),/本次僅補領/);
 await g.locator('[data-id="chapter-1"]').click();assert(await g.locator('[data-id="chapter-1"]').isDisabled());
 const saved=await g.evaluate(()=>JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')));assert.equal(saved.playerOfficer.fragments,20);assert.equal(saved.chests.shared.boxes[2],1);
 await g.locator('[data-a="rewardTab"][data-tab="history"]').click();assert.match(await g.locator('#content').innerText(),/二級寶箱 ×1/);
 const stock=await g.evaluate(()=>{const s=JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1'));const r=ChestSystem.open(s,2,'stock',()=>0);return {items:r.items.length,left:s.chests.shared.boxes[2]};});assert.equal(stock.items,2);assert.equal(stock.left,0);assert.deepEqual(errors,[]);await page.close();
}
console.log('PASS chapter chest UI, fresh and legacy claims, history display, fragment preservation and standard chest opening');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
