'use strict';
(()=>{
 const params=new URLSearchParams(location.search),kind=params.get('grainBattle');if(!kind)return;
 const p=GrainQuest.progress();let runId=params.get('run');
 if(!['rescue','camp'].includes(kind)||p.pending?.kind!==kind||p.pending?.runId!==runId||!GrainQuest.allowed(kind)){location.replace('徐州劇情.html');return;}
 const mission='grain-'+kind,waves=kind==='rescue'?3:5,title=kind==='rescue'?'救援護衛隊長':'黑風寨・奪回糧車';
 window.GrainBattle={mission,waves,count:8,decorateReport(dialog){dialog.querySelector('h2').textContent=BattleResults.result?.win?'救援成功':BattleResults.result?.outcome==='retreat'?'撤退結算':'守護失敗';if(kind==='camp'&&BattleResults.result?.win)dialog.querySelector('h2').textContent='奪糧成功';dialog.querySelector('#closeResults').textContent='返回'+(kind==='rescue'?'糧道':'匪寨');dialog.querySelector('#restartResults').hidden=!!BattleResults.result?.win;$('reset').hidden=!!BattleResults.result?.win;}};
 window.VillageSweep={mission,waves,encounterId:'rabble',combatVersion:8,rewardVersion:2,enemyOfficer:null,goldReward:0,damageMultiplier:()=>1,save:()=>({runId,mission,morale:100,waves,encounterId:'rabble',combatVersion:VillageSweep.combatVersion,rewardVersion:2,enemyOfficer:null}),load(s){if(s?.mission!==mission||s.runId!==GrainQuest.progress().pending?.runId&&s.runId!==GrainQuest.progress()[kind+'Run'])throw Error('不是本次糧道戰鬥存檔');VillageSweep.combatVersion=s.combatVersion||4;runId=s.runId;}};
 const originalApply=YellowTurbanEncounter.apply;
 YellowTurbanEncounter.apply=(e,w,k)=>{originalApply(e,w,k);e.name='賊匪'+(e.type==='弓'?'弓兵':e.type==='槍'?'槍兵':'刀兵');if(kind==='camp'&&(w===3&&k===7||w===5&&k>=4)){const boss=w===5&&k===7;Object.assign(e,{name:boss?'鄧茂':'賊匪頭目',type:'將',hp:boss?900:650,max:boss?900:650,atk:boss?42:32,def:boss?20:18,mdef:12,range:1.6,interval:1.6,speed:.75,foodValue:12,xp:50,settlementXP:6,...(boss?{yellowOfficer:'鄧茂',enemySkill:'奮力突刺：每第4次普攻造成150%物理傷害。'}:{})});if(boss)YellowTurbanEncounter.applyStoryStats(e,w);}};
 function saveVictory(){if(!BattleResults.result?.win||BattleResults.result.outcome==='retreat')return true;try{if(!GrainQuest.complete(kind,runId))throw Error('戰鬥場次不符');return true;}catch{say('勝利尚未保存，請再次開啟戰報或按返回重試。');return false;}}
 const originalFinish=BattleResults.finish,originalLeave=BattleResults.leave,originalReset=BattleResults.reset;
 BattleResults.finish=function(...args){originalFinish.apply(this,args);saveVictory();};
 BattleResults.leave=function(...args){if(saveVictory())return originalLeave.apply(this,args);};
 BattleResults.reset=function(...args){if(BattleResults.result?.win){saveVictory();throw Error('已獲勝，請返回場景接續劇情');}Candidates.loadState(ShuBattlePool.current());Recruit.activateStory();VillageSweep.combatVersion=8;return originalReset.apply(this,args);};
 $('battleReport').addEventListener('click',saveVictory);
 const bar=document.createElement('div');bar.className='story-battle-bar';bar.style.cssText='display:flex;gap:5px;flex-wrap:wrap;align-items:center';const back=document.createElement('button');back.textContent='返回糧道';back.onclick=()=>BattleResults.leave();const label=document.createElement('span');label.className='story-battle-title';const titleName=document.createElement('span'),waveLabel=document.createElement('span');titleName.textContent=title;waveLabel.textContent='・'+waves+'波';label.append(titleName,waveLabel);label.title=label.textContent;bar.append(back,label,$('speed'),$('tactics'),$('play'),$('reset'));document.querySelector('main header').append(bar);
 for(const el of document.querySelectorAll('main>section .toolbar,.page-battle-controls'))el.hidden=true;$('supplyMode').hidden=true;$('reset').textContent='重新挑戰';document.title=title;
 [n,rows]=BattleRoutes.orientationSize();$('size').value=n+'x'+rows;reset();say(title+'：部署隊伍後開始，守住撤離據點。');
 const fade=document.createElement('div');fade.style.cssText='position:fixed;inset:0;background:#000;z-index:200;pointer-events:none;opacity:1;transition:opacity 1.4s';document.body.append(fade);requestAnimationFrame(()=>requestAnimationFrame(()=>fade.style.opacity='0'));setTimeout(()=>fade.remove(),1600);
})();
