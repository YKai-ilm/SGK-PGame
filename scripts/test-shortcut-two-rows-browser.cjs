const assert=require('node:assert/strict'),{chromium}=require(process.env.USERPROFILE+'/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>{window.GameAudioShell=true;delete Navigator.prototype.serviceWorker;const id=sessionStorage.getItem('test-sweep-id');if(id&&location.search.includes('storySweep=1'))crypto.randomUUID=()=>id;});const root='http://localhost:4192/',url=f=>root+encodeURIComponent(f),key='three-kingdoms-interface-preview-v1';await p.goto(url('徐州劇情.html'));await p.evaluate(()=>{localStorage.clear();localStorage.setItem('three-kingdoms-interface-preview-v1',JSON.stringify({version:1,mode:'story',storyFaction:'蜀',tutorial:{status:'skipped'},teams:{},playerOfficer:{version:1,id:'test-player',name:'測試將',style:'全能',rank:0,level:1,xp:0,rebirth:0,fragments:0,points:{str:0,int:0,lead:0,body:0,agi:0,charm:0}},storyEvents:{grainRoute:{armyFormed:true,completed:true,captainGift:true},hanCampaign:{departed:true,luHeard:true,enemySeen:true,reliefShown:true},wancheng:{ordered:true,won:true,shown:true,wonStage:'zhang'},threeZhang:{guangzongRecovered:true,quyangRecovered:true,quyangOrdered:true,quyangShown:true,chapterCompleted:true}},unlocks:{story:{heroes:['劉備','關羽','張飛'],letters:[]},battle:{heroes:[],letters:[]}}}));localStorage.setItem('three-kingdoms-village-journey-v1',JSON.stringify({visited:true,wins:[]}));localStorage.setItem('three-kingdoms-xuzhou-story-v1',JSON.stringify({scene:'內城',flags:{},history:[],active:null}));});

await p.goto(url('戰場直版.html')+'?storySweep=1&sweepCity='+encodeURIComponent('徐州'));await p.waitForFunction(()=>window.VillageSweep?.save()?.region);
for(const width of [320,390,600]){
 await p.setViewportSize({width,height:844});
 const result=await p.evaluate(async()=>{
  const height=()=>document.getElementById('battleShortcuts').getBoundingClientRect().height;
  document.getElementById('tacticToggle').click();const before=height();const sizes=[];
  for(const b of document.querySelectorAll('#tacticChoices button')){b.click();sizes.push(height());}
  const status=document.getElementById('shortcutStatus'),feedback=status.textContent;
  const statusPos=getComputedStyle(status).position;
  document.getElementById('itemToggle').click();const itemBefore=height();
  const u=makeUnit('刀',1,1);units.push(u);started=true;running=false;BattleShortcuts.applyBuff('protectionSmoke',[u],elapsed);
  await new Promise(r=>setTimeout(r,350));
  return {before,sizes,feedback,statusPos,itemBefore,itemAfter:height(),effectText:document.getElementById('activeItemEffects').textContent,effectPos:getComputedStyle(document.getElementById('activeItemEffects')).position};
 });
 assert(result.feedback.length>0);assert.equal(result.statusPos,'absolute');assert(result.sizes.every(h=>h===result.before));assert.equal(result.itemAfter,result.itemBefore);assert.equal(result.effectPos,'absolute');assert.match(result.effectText,/護身煙/);console.log('PASS fixed two rows after all tactics and active item',width);
}
assert.deepEqual(errors,[]);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
