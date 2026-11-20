const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),assert=require('node:assert/strict');process.env.PORT='4198';const server=require('./serve.cjs');(async()=>{let b;try{b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage({viewport:{width:430,height:932}});await p.addInitScript(()=>delete Navigator.prototype.serviceWorker);await p.goto('http://127.0.0.1:4198/'+encodeURIComponent('場景重測.html'));const key='three-kingdoms-interface-preview-v1';const original=JSON.stringify({storyEvents:{grainRoute:{completed:true}},rewards:{wallet:{coins:123,diamonds:2}}});await p.evaluate(({key,original})=>{localStorage.setItem(key,original);SceneTest.start('xz-盜糧匪寨');},{key,original});async function frame(){await p.waitForFunction(()=>window.GrainQuestUI||document.querySelector('#gamePage')?.contentWindow?.GrainQuestUI);return await p.evaluate(()=>!!window.GrainQuestUI)?p:await(await p.$('#gamePage')).contentFrame();}let g=await frame();await g.locator('#sceneTestBar details').evaluate(e=>e.open=true);await g.locator('#sceneTestStage').selectOption('grainCamp');await Promise.all([g.waitForNavigation(),g.locator('#sceneTestApply').click()]);await g.waitForFunction(()=>GrainQuest.progress().marksKnown);await g.locator('#sceneTestBar').evaluate(e=>e.style.display='none');await p.screenshot({path:'.grain-camp-mobile.png'});await g.evaluate(()=>SceneTest.start('xz-茶站'));g=await frame();await g.locator('#sceneTestBar').evaluate(e=>e.style.display='none');await p.screenshot({path:'.grain-tea-mobile.png'});
for(const scene of ['xuzhouWest','xz-役所','xz-城主府','xz-客棧','xz-盜糧匪寨']){
 await g.evaluate(id=>SceneTest.start(id),scene);g=await frame();
 for(const stage of ['grainChecked','grainVerified','grainDone']){
  await g.locator('#sceneTestBar details').evaluate(e=>e.open=true);
  await g.locator('#sceneTestStage').selectOption(stage);
  await Promise.all([g.waitForNavigation(),g.locator('#sceneTestApply').click()]);
  const state=await g.evaluate(()=>({p:GrainQuest.progress(),profile:JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1'))}));
  assert.equal(state.p.cargoChecked,true);
  assert.equal(!!state.p.cargoVerified,stage!=='grainChecked');
  assert.equal(!!state.p.completed,stage==='grainDone');
  assert.equal(state.profile.storyItems.damagedLeatherArmor,1);
  assert.equal(state.profile.rewards.wallet.coins,100);
 }
}
await g.evaluate(()=>SceneTest.start('xuzhouWest'));g=await frame();
for(const stage of ['grainSaved','grainGift','grainTrail']){
 await g.locator('#sceneTestBar details').evaluate(e=>e.open=true);
 await g.locator('#sceneTestStage').selectOption(stage);
 await Promise.all([g.waitForNavigation(),g.locator('#sceneTestApply').click()]);
 const state=await g.evaluate(()=>GrainQuest.progress());
 assert.equal(state.rescueShown,true);assert.equal(!!state.captainGift,stage!=='grainSaved');
 assert.equal(!!state.reported,stage==='grainTrail');assert.equal(!!state.trailKnown,stage==='grainTrail');assert.equal(!!state.marksKnown,false);
}
await g.evaluate(()=>SceneTest.exit());await p.waitForURL('**/'+encodeURIComponent('場景重測.html'));await p.waitForFunction(()=>!SceneTest.active());assert.equal(await p.evaluate(key=>localStorage.getItem(key),key),original);console.log('PASS grain sandbox stages and original profile preserved');}finally{await b?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
