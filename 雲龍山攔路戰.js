'use strict';
(()=>{
 if(new URLSearchParams(location.search).get('yunlongBandits')!=='1')return;
 if(window.TutorialBattleConfig||VillageDefense.requested)return;
 window.YunlongBattle={mission:'yunlong-bandits',waves:1};
 let runId=crypto.randomUUID();
 window.VillageSweep={mission:YunlongBattle.mission,waves:1,encounterId:'rabble',combatVersion:7,rewardVersion:2,enemyOfficer:null,goldReward:0,damageMultiplier:()=>1,save:()=>({runId,mission:YunlongBattle.mission,morale:100,waves:1,encounterId:'rabble',rewardVersion:2,combatVersion:VillageSweep.combatVersion,enemyOfficer:null}),load(s){if(s?.mission!==YunlongBattle.mission)throw Error('不是雲龍山攔路戰存檔');VillageSweep.combatVersion=s.combatVersion||4;runId=s.runId;}};
 const originalApply=YellowTurbanEncounter.apply;
 YellowTurbanEncounter.apply=(e,w,k)=>{originalApply(e,w,k);if(k===6)Object.assign(e,{name:'山賊小頭領',type:'將',hp:650,max:650,atk:32,def:18,mdef:10,range:1.2,interval:1.6,speed:.75,foodValue:12,xp:50,settlementXP:6});else e.name='山賊'+(e.type==='弓'?'弓兵':e.type==='槍'?'槍兵':'刀兵');};
 const originalReset=BattleResults.reset,originalFinish=BattleResults.finish,originalLeave=BattleResults.leave;
 function saveVictory(){if(!BattleResults.result?.win||BattleResults.result.outcome==='retreat')return true;try{YunlongStory.complete(runId);return true;}catch{say('勝利進度尚未保存，請再按返回雲龍山重試。');return false;}}
 BattleResults.finish=function(...args){originalFinish.apply(this,args);saveVictory();};
 BattleResults.leave=function(...args){if(saveVictory())return originalLeave.apply(this,args);};
 $('battleReport').addEventListener('click',saveVictory);
 BattleResults.reset=function(...args){if(!saveVictory())throw Error('勝利進度尚未保存');runId=crypto.randomUUID();Candidates.loadState(ShuBattlePool.current());Recruit.activateStory();VillageSweep.combatVersion=7;return originalReset.apply(this,args);};
 const bar=document.createElement('div');bar.style.cssText='display:flex;gap:8px;flex-wrap:wrap;align-items:center';
 const back=document.createElement('button');back.textContent='返回雲龍山';back.onclick=()=>BattleResults.leave();const label=document.createElement('span');label.textContent='雲龍山攔路戰 · 1波';bar.append(back,label,$('speed'),$('tactics'),$('play'),$('reset'));document.querySelector('main header').append(bar);
 const toolbar=document.querySelector('main>section .toolbar');if(toolbar)toolbar.hidden=true;const controls=document.querySelector('.page-battle-controls');if(controls)controls.hidden=true;$('supplyMode').hidden=true;$('reset').textContent='重新挑戰';
 document.title='雲龍山・攔路山賊';[n,rows]=BattleRoutes.orientationSize();$('size').value=n+'x'+rows;reset();say('雲龍山攔路戰：一波敵人，山賊小兵先出場，小頭領隨後。部署後開始戰鬥。');
})();
