const assert=require('node:assert/strict'),{chromium}=require(process.env.USERPROFILE+'/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>{window.GameAudioShell=true;delete Navigator.prototype.serviceWorker;const id=sessionStorage.getItem('test-sweep-id');if(id&&location.search.includes('storySweep=1'))crypto.randomUUID=()=>id;});const root='http://localhost:4192/',url=f=>root+encodeURIComponent(f),key='three-kingdoms-interface-preview-v1';await p.goto(url('徐州劇情.html'));await p.evaluate(()=>{localStorage.clear();localStorage.setItem('three-kingdoms-interface-preview-v1',JSON.stringify({version:1,mode:'story',storyFaction:'蜀',tutorial:{status:'skipped'},teams:{},playerOfficer:{version:1,id:'test-player',name:'測試將',style:'全能',rank:0,level:1,xp:0,rebirth:0,fragments:0,points:{str:0,int:0,lead:0,body:0,agi:0,charm:0}},storyEvents:{grainRoute:{armyFormed:true,completed:true,captainGift:true},hanCampaign:{departed:true,luHeard:true,enemySeen:true,reliefShown:true},wancheng:{ordered:true,won:true,shown:true,wonStage:'zhang'},threeZhang:{guangzongRecovered:true,quyangRecovered:true,quyangOrdered:true,quyangShown:true,chapterCompleted:true}},unlocks:{story:{heroes:['劉備','關羽','張飛'],letters:[]},battle:{heroes:[],letters:[]}}}));localStorage.setItem('three-kingdoms-village-journey-v1',JSON.stringify({visited:true,wins:[]}));localStorage.setItem('three-kingdoms-xuzhou-story-v1',JSON.stringify({scene:'內城',flags:{},history:[],active:null}));});

for(const city of ['桃源村','徐州','長社','宛城','廣宗','下曲陽']){
 await p.goto(url('戰場直版.html')+'?storySweep=1&sweepCity='+encodeURIComponent(city));
 await p.waitForFunction(()=>window.VillageSweep?.save()?.region);
 const result=await p.evaluate(city=>{
 const out=[];for(const named of [false,true]){
 reset();running=false;let region,id;for(let i=0;i<10000;i++){id='reward-browser-'+RegionalSweep.cities[city].rewardTier+'-'+i;region=RegionalSweep.create(city,id,6);if(Boolean(region.leader)===named)break;}
 VillageSweep.load({...VillageSweep.save(),runId:id,waves:6,region,seenOfficers:[]});started=true;wave=6;enemies=[];
 let expected=0;for(let w=1;w<=6;w++)for(let k=0;k<6+w;k++){spawn(w,k);const e=enemies[enemies.length-1];expected+=e.settlementXP;hurt(e,1e9,false,null,true);}
 const before=StoryMorale.status().coins,snapshot=BattleSave.capture();BattleSave.validate(snapshot);BattleResults.finish(true,'victory');
 const actual=BattleResults.result,after=StoryMorale.status().coins;
 if(actual.rewardXP!==expected||after-before!==RegionalSweep.goldReward(region)||actual.gold!==after-before)throw Error('結算不符 '+city);
 BattleSave.restore(snapshot);BattleResults.finish(true,'victory');if(StoryMorale.status().coins!==after)throw Error('重複領獎');
 out.push({named,gold:after-before,xp:actual.rewardXP});
 }return out;
 },city);console.log(city,JSON.stringify(result));
}
assert.deepEqual(errors,[]);console.log('PASS actual kills, report XP, regional gold wallet deposits and pre-settlement save replay dedup');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

