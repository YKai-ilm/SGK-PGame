const assert=require('node:assert/strict'),{chromium}=require(process.env.USERPROFILE+'/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>{window.GameAudioShell=true;delete Navigator.prototype.serviceWorker;const id=sessionStorage.getItem('test-sweep-id');if(id&&location.search.includes('storySweep=1'))crypto.randomUUID=()=>id;});const root='http://localhost:4192/',url=f=>root+encodeURIComponent(f),key='three-kingdoms-interface-preview-v1';await p.goto(url('徐州劇情.html'));await p.evaluate(()=>{localStorage.clear();localStorage.setItem('three-kingdoms-interface-preview-v1',JSON.stringify({version:1,mode:'story',storyFaction:'蜀',tutorial:{status:'skipped'},teams:{},playerOfficer:{version:1,id:'test-player',name:'測試將',style:'全能',rank:0,level:1,xp:0,rebirth:0,fragments:0,points:{str:0,int:0,lead:0,body:0,agi:0,charm:0}},storyEvents:{grainRoute:{armyFormed:true,completed:true,captainGift:true},hanCampaign:{departed:true,luHeard:true,enemySeen:true,reliefShown:true},wancheng:{ordered:true,won:true,shown:true,wonStage:'zhang'},threeZhang:{guangzongRecovered:true,quyangRecovered:true,quyangOrdered:true,quyangShown:true,chapterCompleted:true}},unlocks:{story:{heroes:['劉備','關羽','張飛'],letters:[]},battle:{heroes:[],letters:[]}}}));localStorage.setItem('three-kingdoms-village-journey-v1',JSON.stringify({visited:true,wins:[]}));localStorage.setItem('three-kingdoms-xuzhou-story-v1',JSON.stringify({scene:'內城',flags:{},history:[],active:null}));});

for(const city of ['桃源村','徐州','長社','宛城','廣宗','下曲陽']){
 await p.goto(url('戰場直版.html')+'?storySweep=1&sweepCity='+encodeURIComponent(city));
 await p.waitForFunction(()=>window.VillageSweep?.save()?.region);
 const result=await p.evaluate(city=>{
  const check=(v,m)=>{if(!v)throw Error(city+': '+m);},names=RegionalSweep.pool(city),done=[];
  for(const name of names){
   reset();running=false;let region,id;
   for(let i=0;i<10000;i++){id='combat-'+i;region=RegionalSweep.create(city,id,6);if(region.leader===name)break;}
   check(region.leader===name,'抽選敵將');VillageSweep.load({...VillageSweep.save(),runId:id,waves:6,region,seenOfficers:[]});
   path=Array.from({length:rows},(_,y)=>({x:0,y}));terrainBlocks=[];elapsed=1;units=[];enemies=[];shots=[];
   Object.assign(gate,{x:0,y:rows-1,hp:3000,max:3000});spawn(6,11);
   const e=enemies[0],magic=['張角','張寶','馬元義'].includes(name);
   check(e.name===name&&e.type===(magic?'策':'將'),'敵將類型');
   check(e.hp===region.officer.hp&&e.atk===(magic?region.officer.magicAttack:region.officer.atk),'敵將能力');
   const u=makeUnit('刀',0,1);u.hp=u.max=100000;units.push(u);Object.assign(e,{speed:0,nextAttack:0});
   enemyTick(e,0);
   if(magic)check(shots.length===1&&shots[0].kind==='magic','謀攻投射物');
   else check(u.hp<u.max&&shots.length===0,'近身攻擊');
   const hp=u.hp,shotCount=shots.length;enemyTick(e,0);check(u.hp===hp&&shots.length===shotCount,'冷卻內重複攻擊');
   const snapshot=BattleSave.capture();BattleSave.validate(snapshot);BattleSave.restore(snapshot);running=false;
   check(enemies[0].name===name&&enemies[0].enemyAttacks===1,'讀檔保留敵將攻擊次數');
   check(VillageSweep.save().seenOfficers.includes(name),'讀檔遺失登場紀錄');
   done.push(name);
  }
  reset();running=false;sync();check(VillageSweep.save().seenOfficers.length===0,'重來未清除登場紀錄');
  check(VillageSweep.save().region.city===city&&document.getElementById('sweepProgress').textContent.startsWith(city+'・掃蕩賊寇'),'重來地區錯誤');
  return done;
 },city);console.log('PASS attack/cooldown/restore/restart',city,result.join('、'));
}
assert.deepEqual(errors,[]);console.log('PASS regional physical and magic officers, saved attacks, actual-spawn records and restart headings');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
