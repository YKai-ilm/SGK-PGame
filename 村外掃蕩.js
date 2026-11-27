'use strict';
(()=>{
 if(new URLSearchParams(location.search).get('storySweep')!=='1'||window.TutorialBattleConfig)return;
 const sweepCity=RegionalSweep.normalize(new URLSearchParams(location.search).get('sweepCity')||'桃源村');if(!RegionalSweep.allowed(sweepCity)){location.replace('主介面流程預覽.html');return;}document.body.classList.add('story-sweep');
 function chooseWaves(id){let h=0;for(const ch of id)h=(h*33+ch.charCodeAt(0))>>>0;return [1,3,6][(h>>>8)%3];}
 let runId=crypto.randomUUID(),entryMorale=StoryMorale.status().value,waveCount=chooseWaves(runId),encounterId=YellowTurbanEncounter.fromRunId(runId).id,rewardVersion=3,combatVersion=9;
 let regional=RegionalSweep.create(sweepCity,runId,waveCount),seenOfficers=new Set();encounterId='rabble';let enemyOfficer=makeEnemyOfficer();
 function makeEnemyOfficer(){if(regional)return null;const name=YellowTurbanEncounter.encounters.find(e=>e.id===encounterId)?.leader;return name?HeroCombat.encounter(name,{stars:1,level:YellowTurbanEncounter.officerLevel(name,undefined,waveCount)},waveCount):null;}
 const bar=document.createElement('div');bar.className='sweep-header';bar.style.cssText='display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;padding:6px 0';bar.innerHTML='<span id="sweepProgress"></span><button id="sweepBack">返回桃園村</button>';document.querySelector('main header').append(bar);
 function goldReward(){if(regional)return RegionalSweep.goldReward(regional);return rewardVersion===1?waveCount:(rewardVersion>=3?2:1)*({rabble:{1:1,3:2,6:4},deng:{1:2,3:3,6:6},cheng:{1:2,3:3,6:6}}[encounterId]?.[waveCount]||0);}
 function update(){const encounter=window.YellowTurbanEncounter?.encounters.find(e=>e.id===encounterId);$('sweepProgress').textContent=(regional?sweepCity+'・掃蕩賊寇':encounter?.name||'掃蕩賊寇')+' '+waveCount+'/波';}
 $('size').hidden=true;if($('routePattern'))$('routePattern').hidden=true;
 // 正式掃蕩只留下操作用控制，測試工具不占戰場版面。
 const actions=document.createElement('div');actions.className='sweep-actions';
 actions.append($('sweepBack'),$('sweepProgress'),$('speed'),$('tactics'),$('play'),$('reset'));bar.append(actions);
 const oldToolbar=document.querySelector('main>section .toolbar');if(oldToolbar)oldToolbar.hidden=true;
 const oldControls=document.querySelector('.page-battle-controls');if(oldControls)oldControls.hidden=true;
 $('supplyMode').hidden=true;$('speed').value='1';$('speed').setAttribute('aria-label','戰鬥倍速');for(const option of $('speed').options)option.textContent=option.value+'X 速';$('reset').textContent='重開';
 const controlsStyle=document.createElement('style');controlsStyle.textContent=`
 .sweep-actions #sweepProgress{font-size:11px;white-space:nowrap;flex-shrink:0}
 .sweep-actions{display:flex;align-items:center;gap:3px;width:100%;min-width:0}
 .sweep-actions #speed{width:52px;min-width:52px;min-height:30px;padding:3px 2px;font-size:11px;margin-left:auto;flex-shrink:0}
 .sweep-actions #tactics{display:flex;flex-direction:row;gap:3px}
 .sweep-actions button{font-size:11px;min-height:30px;padding:4px 5px;white-space:nowrap;flex-shrink:0}
 .sweep-actions #sweepBack{margin-right:1px}
 @media(max-width:450px){.sweep-actions{gap:2px}.sweep-actions button{font-size:10px;padding:4px 3px}.sweep-actions #tactics{gap:2px}.sweep-actions #sweepProgress{font-size:10px}}
 main>section .toolbar[hidden],.page-battle-controls[hidden],#supplyMode[hidden]{display:none!important}
 @media(max-aspect-ratio:4/3){
  .story-sweep main{padding:4px;gap:4px}
  .story-sweep main>section.panel{padding:3px;gap:3px}
  .story-sweep main>aside.panel{flex:0 0 58px;padding:4px 6px}
  .story-sweep main>aside .metrics{margin:1px 0}
  .story-sweep #bondStatus{min-height:22px;padding:0 3px}
 }
 `;document.head.append(controlsStyle);
 $('sweepBack').onclick=()=>BattleResults.leave();
 const originalFinish=BattleResults.finish,originalReset=BattleResults.reset,originalLeave=BattleResults.leave;
 function settle(){const r=BattleResults.result;if(!r||!runId)return true;try{StoryMorale.settle(runId,r.outcome==='retreat'?'retreat':r.win?'win':'loss',waveCount,goldReward());if(r.win&&r.outcome!=='retreat'&&sweepCity==='桃源村')VillageJourney.win(runId);const leader=regional?.leader||enemyOfficer?.name||null;const receipt=RegionalSweep.settle(runId,sweepCity,leader,[...seenOfficers],r.outcome);showDrops(receipt);update();window.ThreeLordsAlert?.show();return true;}catch(e){say('掃蕩獎勵尚未保存，請重開戰報或按返回重試。');return false;}}
 function showDrops(receipt){const dialog=document.getElementById('battleResults');if(!dialog)return;dialog.querySelector('#sweepDrops')?.remove();const row=document.createElement('p');row.id='sweepDrops';row.textContent=receipt.drops.length?'武將碎片：'+receipt.drops.map(x=>x.name+' ×'+x.count).join('、'):'本場未獲得武將碎片。';dialog.querySelector('.result-actions')?.before(row);}
 BattleResults.finish=function(win,reason){originalFinish.call(this,win,reason);settle();};
 BattleResults.leave=function(...args){if(settle())return originalLeave.apply(this,args);};
 const originalApply=YellowTurbanEncounter.apply;YellowTurbanEncounter.apply=(e,w,k)=>{if(regional)RegionalSweep.apply(e,w,k,regional);else originalApply(e,w,k);if(e.name===(regional?.leader||enemyOfficer?.name))seenOfficers.add(e.name);};
 BattleResults.reset=function(...args){if(!window.BattleRestoring&&!settle())throw Error('請先保存掃蕩戰果');const team=ShuBattlePool.current();Candidates.loadState(team);Recruit.activateStory();runId=crypto.randomUUID();entryMorale=StoryMorale.status().value;waveCount=chooseWaves(runId);encounterId=YellowTurbanEncounter.fromRunId(runId).id;rewardVersion=3;combatVersion=9;regional=RegionalSweep.create(sweepCity,runId,waveCount);seenOfficers=new Set();encounterId='rabble';enemyOfficer=makeEnemyOfficer();if(!window.BattleRestoring){[n,rows]=BattleRoutes.orientationSize();$('size').value=n+'x'+rows;const patterns=BattleRoutes.available(n,rows);BattleRoutes.selectSaved(patterns[parseInt(runId.replace(/-/g,'').slice(0,8),16)%patterns.length],n,rows);}update();return originalReset.apply(this,args);};
 window.VillageSweep={get title(){return regional?sweepCity+'・掃蕩賊寇':YellowTurbanEncounter.current()?.name||'掃蕩賊寇';},count(w){return YellowTurbanEncounter.waveCount(w,combatVersion);},get enemyOfficer(){return enemyOfficer?{...enemyOfficer}:null;},get combatVersion(){return combatVersion;},get encounterId(){return runId?encounterId:null;},get rewardVersion(){return rewardVersion;},get waves(){return runId?waveCount:6;},get goldReward(){return runId?goldReward():0;},damageMultiplier:()=>runId?StoryMorale.multiplier(entryMorale):1,save:()=>runId?({region:regional?structuredClone(regional):undefined,seenOfficers:[...seenOfficers],runId,morale:entryMorale,waves:waveCount,encounterId,rewardVersion,combatVersion,enemyOfficer:enemyOfficer?{...enemyOfficer}:null}):null,load(s){if(s?.region)RegionalSweep.validate(s.region,s.waves,sweepCity);else if(sweepCity!=='桃源村')throw Error('不是此地掃蕩的存檔');regional=s?.region?structuredClone(s.region):null;seenOfficers=new Set(s?.seenOfficers||[]);runId=s?.runId||null;entryMorale=s?.morale??StoryMorale.status().value;waveCount=s?.waves??6;rewardVersion=s?.rewardVersion??1;combatVersion=s?.combatVersion??1;encounterId=s?.encounterId??YellowTurbanEncounter.fromRunId(runId,true)?.id;enemyOfficer=combatVersion>=4&&s?.enemyOfficer?{...s.enemyOfficer}:null;update();}};
 $('battleReport').addEventListener('click',settle);

 reset();
})();


