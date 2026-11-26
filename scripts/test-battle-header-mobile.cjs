const assert=require('node:assert/strict'),{chromium}=require(process.env.USERPROFILE+'/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>{window.GameAudioShell=true;delete Navigator.prototype.serviceWorker;const id=sessionStorage.getItem('test-sweep-id');if(id&&location.search.includes('storySweep=1'))crypto.randomUUID=()=>id;});const root='http://localhost:4192/',url=f=>root+encodeURIComponent(f),key='three-kingdoms-interface-preview-v1';await p.goto(url('徐州劇情.html'));await p.evaluate(()=>{localStorage.clear();localStorage.setItem('three-kingdoms-interface-preview-v1',JSON.stringify({version:1,mode:'story',storyFaction:'蜀',tutorial:{status:'skipped'},teams:{},playerOfficer:{version:1,id:'test-player',name:'測試將',style:'全能',rank:0,level:1,xp:0,rebirth:0,fragments:0,points:{str:0,int:0,lead:0,body:0,agi:0,charm:0}},storyEvents:{grainRoute:{armyFormed:true,completed:true,captainGift:true},hanCampaign:{departed:true,luHeard:true,enemySeen:true,reliefShown:true},wancheng:{ordered:true,won:true,shown:true,wonStage:'zhang'},threeZhang:{guangzongRecovered:true,quyangRecovered:true,quyangOrdered:true,quyangShown:true,chapterCompleted:true}},unlocks:{story:{heroes:['劉備','關羽','張飛'],letters:[]},battle:{heroes:[],letters:[]}}}));localStorage.setItem('three-kingdoms-village-journey-v1',JSON.stringify({visited:true,wins:[]}));localStorage.setItem('three-kingdoms-xuzhou-story-v1',JSON.stringify({scene:'內城',flags:{},history:[],active:null}));});

await p.evaluate(()=>{const key='three-kingdoms-interface-preview-v1',s=JSON.parse(localStorage.getItem(key));s.storyEvents.grainRoute={armyFormed:true,campBriefed:true,pending:{kind:'camp',runId:'header'}};s.storyEvents.wancheng={ordered:true,briefed:true,hanWon:true,pending:{kind:'wancheng',stage:'zhang',route:'direct',runId:'header'}};localStorage.setItem(key,JSON.stringify(s));});
for(const route of ['?storySweep=1&sweepCity='+encodeURIComponent('下曲陽'),'?hanBattle=wancheng&run=header','?grainBattle=camp&run=header']){
 await p.goto(url('戰場直版.html')+route);await p.waitForFunction(()=>document.querySelector('.story-battle-title')?.children.length===2);
 for(const width of [320,375,390,430,540,600,844]){
  await p.setViewportSize({width,height:844});
  for(const active of [false,true]){
   const dims=await p.evaluate(active=>{running=false;started=active;wave=active?3:0;sync();document.getElementById('saveBattle').hidden=!active;const bar=document.querySelector('.story-battle-bar'),label=bar.querySelector('.story-battle-title'),r=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height,right:b.right,bottom:b.bottom};};return{bar:r(bar),label:r(label),parts:[...label.children].map(e=>({text:e.textContent,...r(e)})),controls:[...bar.children].filter(e=>e!==label&&e.getBoundingClientRect().width>0).map(r),screen:innerWidth,overflow:document.documentElement.scrollWidth};},active);
   const note=route+' width='+width+' started='+active+' '+JSON.stringify(dims);
   assert(dims.parts[0].w>=10,note);assert(dims.parts[0].h<=dims.parts[1].h+1,note);
   assert(Math.abs(dims.parts[0].y-dims.parts[1].y)<1,note);
   assert(dims.parts[1].right<=dims.label.right+1,note);
   assert(dims.controls.every(c=>Math.abs(c.y+c.h/2-(dims.label.y+dims.label.h/2))<2),note);
   assert(dims.controls.every(c=>c.right<=width+1)&&dims.overflow<=width,note);
  }
 }await p.setViewportSize({width:390,height:844});if(route.includes('grainBattle'))await p.waitForTimeout(1700);if(route.includes('grainBattle'))await p.screenshot({path:'.battle-header-mobile.png'});console.log('PASS compact title/waves/controls',route);
}
assert.deepEqual(errors,[]);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
