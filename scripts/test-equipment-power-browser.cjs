const assert=require('node:assert/strict'),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
process.env.PORT='4188';const server=require('./serve.cjs');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width:430,height:839}});
 await context.addInitScript(()=>localStorage.setItem('three-kingdoms-interface-preview-v1',JSON.stringify({version:1,tutorial:{status:'skipped',step:0},mode:'story',storyFaction:'蜀',libraryFaction:'蜀',teams:{},unlocks:{story:{heroes:['張飛'],letters:['張','飛']},battle:{heroes:[],letters:[]}},page:'bag',equipment:{story:{items:[{id:'old',name:'銀項鍊',slot:'accessory',combatPower:9000},{id:'high',name:'金項鍊',slot:'accessory'},{id:'low',name:'青銅項鍊',slot:'accessory'}],loadouts:{張飛:{accessory:'old'}}}}})));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4188/index.html');
 let frame;for(let i=0;i<100;i++){frame=page.frames().find(f=>f!==page.mainFrame()&&decodeURIComponent(f.url()).includes('主介面流程預覽.html'));if(frame)break;await new Promise(r=>setTimeout(r,50));}assert(frame);
 await frame.waitForLoadState('domcontentloaded');await frame.locator('[data-page="bag"]').click();await frame.locator('[data-a="bagTab"][data-tab="equipment"]').click();await frame.locator('[data-a="bagEquipment"][data-item="high"]').click();
 let row=frame.locator('[data-a="equipItem"][data-name="張飛"]');assert.match(await row.innerText(),/戰力 61（\+30）/);assert.match(await row.locator('.higher').innerText(),/61/);
 await page.screenshot({path:'.equipment-power-preview.png'});await row.click();
 const state=await frame.evaluate(()=>JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')));assert.equal(state.equipment.story.loadouts.張飛.accessory,'high');assert.equal(state.equipment.story.items.length,3);
 await frame.locator('#modal').evaluate(el=>el.close());await frame.locator('[data-a="bagEquipment"][data-item="low"]').click();row=frame.locator('[data-a="equipItem"][data-name="張飛"]');assert.match(await row.innerText(),/戰力 12（−49）/);assert.match(await row.locator('.lower').innerText(),/12/);assert.deepEqual(errors,[]);
 console.log('PASS mobile bag ratings, ignored legacy manual score, positive/negative overall differences, colors and equipment persistence');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
