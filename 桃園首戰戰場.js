'use strict';
(()=>{
 if(!VillageDefense.requested)return;
 if(!VillageDefense.active){location.replace('桃園起兵.html');return;}
 let runId=crypto.randomUUID();
 window.VillageSweep={mission:VillageDefense.mission,waves:VillageDefense.waves,encounterId:'rabble',combatVersion:4,rewardVersion:2,enemyOfficer:null,goldReward:0,damageMultiplier:()=>1,save:()=>({runId,mission:VillageDefense.mission,morale:100,waves:VillageDefense.waves,encounterId:'rabble',rewardVersion:2,combatVersion:4,enemyOfficer:null}),load(s){if(s?.mission!==VillageDefense.mission)throw Error('不是本劇情關卡存檔');runId=s.runId;}};
 const originalReset=BattleResults.reset,originalFinish=BattleResults.finish;
 BattleResults.reset=function(...args){runId=crypto.randomUUID();Recruit.activateStory();return originalReset.apply(this,args);};
 function saveVictory(){if(BattleResults.result?.win&&BattleResults.result?.outcome!=='retreat'){try{if(VillageDefense.rescue)VillageDefense.completeRescue(runId);else VillageDefense.complete(runId);}catch{say('劇情戰鬥進度未能保存，請重新開啟戰報重試。');}}}
 BattleResults.finish=function(win,reason){originalFinish.call(this,win,reason);saveVictory();};
 $('battleReport').addEventListener('click',saveVictory);
 const bar=document.createElement('div');bar.className='sweep-actions';bar.style.cssText='display:flex;gap:6px;flex-wrap:wrap;align-items:center';
 const back=document.createElement('button');back.textContent='返回桃源村';back.onclick=()=>BattleResults.leave();
 const label=document.createElement('span');label.textContent=VillageDefense.title+' · '+VillageDefense.waves+'波';back.style.fontSize=label.style.fontSize=getComputedStyle($('speed')).fontSize;bar.append(back,label,$('speed'),$('tactics'),$('play'),$('reset'));document.querySelector('main header').append(bar);
 const toolbar=document.querySelector('main>section .toolbar');if(toolbar)toolbar.hidden=true;
 const controls=document.querySelector('.page-battle-controls');if(controls)controls.hidden=true;
 $('supplyMode').hidden=true;$('reset').textContent='重新挑戰';
 const description=document.querySelector('.supply small');if(description)description.textContent='首戰預設劉備、關羽、張飛武將字卡，點卡或拖曳部署；本場不抽基本兵種。';
 document.title='桃園首戰・'+VillageDefense.title;
 [n,rows]=BattleRoutes.orientationSize();$('size').value=n+'x'+rows;
 if(VillageDefense.rescue){const build=TerrainObstacles.build;TerrainObstacles.build=(...args)=>build(...args).map(p=>({...p,kind:'forest'}));}
 reset();say(VillageDefense.title+'：招募區已備妥劉備、關羽、張飛。部署後開始戰鬥。');
})();
