'use strict';
(()=>{
 const params=new URLSearchParams(location.search),kind=params.get('hanBattle');if(!kind)return;
 const p=HanQuest.progress();let runId=params.get('run'),attemptId=runId;
 if(!['relief','fire'].includes(kind)||p.pending?.kind!==kind||p.pending?.runId!==runId||!HanQuest.allowed(kind)){location.replace('漢軍會師.html');return;}
 const mission='han-'+kind,waves=kind==='relief'?4:6,title=kind==='relief'?'廣宗外圍・守口接應':'長社側翼・火起破圍';
 window.HanBattle={mission,waves,count:8,kind,decorateReport(dialog){dialog.querySelector('h2').textContent=BattleResults.result?.win?'作戰勝利':BattleResults.result?.outcome==='retreat'?'撤退結算':'守護失敗';dialog.querySelector('#closeResults').textContent='返回前線';dialog.querySelector('#restartResults').hidden=!!BattleResults.result?.win;$('reset').hidden=!!BattleResults.result?.win;}};
 window.VillageSweep={mission,waves,encounterId:'rabble',combatVersion:4,rewardVersion:2,enemyOfficer:null,goldReward:0,damageMultiplier:()=>1,save:()=>({runId:attemptId,questRun:runId,mission,morale:100,waves,encounterId:'rabble',combatVersion:4,rewardVersion:2,enemyOfficer:null,support:window.HanSupport?.save()}),load(s){if(s?.mission!==mission||s.questRun!==runId||s.questRun!==HanQuest.progress().pending?.runId&&s.questRun!==HanQuest.progress()[kind+'Run'])throw Error('不是本次漢軍會師戰鬥存檔');attemptId=s.runId;window.HanSupport?.load(s.support);}};
 const originalApply=YellowTurbanEncounter.apply;YellowTurbanEncounter.apply=(e,w,k)=>{originalApply(e,w,k);e.hp*=kind==='relief'?1:1.2;e.max=e.hp;e.atk*=kind==='relief'?1:1.1;};
 function saveVictory(){if(!BattleResults.result?.win||BattleResults.result.outcome==='retreat')return true;try{if(!HanQuest.complete(kind,runId))throw Error('戰鬥場次不符');return true;}catch{say('勝利尚未保存，請再次開啟戰報或按返回重試。');return false;}}
 const originalFinish=BattleResults.finish,originalLeave=BattleResults.leave,originalReset=BattleResults.reset;
 BattleResults.finish=function(...args){originalFinish.apply(this,args);saveVictory();};
 BattleResults.leave=function(...args){if(saveVictory())return originalLeave.apply(this,args);};
 BattleResults.reset=function(...args){if(BattleResults.result?.win){saveVictory();throw Error('已獲勝，請返回場景接續劇情');}if(BattleResults.result)attemptId=crypto.randomUUID();Candidates.loadState(ShuBattlePool.current());Recruit.activateStory();return originalReset.apply(this,args);};
 $('battleReport').addEventListener('click',saveVictory);
 const bar=document.createElement('div');bar.style.cssText='display:flex;gap:5px;flex-wrap:wrap;align-items:center';const back=document.createElement('button');back.textContent='返回漢軍營地';back.onclick=()=>BattleResults.leave();const label=document.createElement('span');label.textContent=title+'・'+waves+'波';bar.append(back,label,$('speed'),$('tactics'),$('play'),$('reset'));document.querySelector('main header').append(bar);
 for(const el of document.querySelectorAll('main>section .toolbar,.page-battle-controls'))el.hidden=true;$('supplyMode').hidden=true;$('reset').textContent='重新挑戰';document.title=title;
 [n,rows]=BattleRoutes.orientationSize();$('size').value=n+'x'+rows;reset();say(title+'：部署隊伍後開始，守住撤離據點。');
 const fade=document.createElement('div');fade.style.cssText='position:fixed;inset:0;background:#000;z-index:200;pointer-events:none;opacity:1;transition:opacity 1.4s';document.body.append(fade);requestAnimationFrame(()=>requestAnimationFrame(()=>fade.style.opacity='0'));setTimeout(()=>fade.remove(),1600);
})();
