'use strict';
(()=>{
 const params=new URLSearchParams(location.search),kind=params.get('yellowBattle');if(!kind)return;
 const p=YellowQuest.progress();let runId=params.get('run'),attemptId=runId;
 if(!['outpost','hq'].includes(kind)||p.pending?.kind!==kind||p.pending?.runId!==runId||!YellowQuest.allowed(kind)){location.replace('黃巾前線.html');return;}
 const mission='yellow-'+kind,waves=6,title=kind==='outpost'?'官道解圍・鄧茂':'擊破主營・程遠志';
 window.YellowBattle={mission,waves,count:8,decorateReport(dialog){dialog.querySelector('h2').textContent=BattleResults.result?.win?'作戰勝利':BattleResults.result?.outcome==='retreat'?'撤退結算':'守護失敗';dialog.querySelector('#closeResults').textContent='返回前線';dialog.querySelector('#restartResults').hidden=!!BattleResults.result?.win;$('reset').hidden=!!BattleResults.result?.win;}};
 window.VillageSweep={mission,waves,encounterId:'rabble',combatVersion:4,rewardVersion:2,enemyOfficer:null,goldReward:0,damageMultiplier:()=>1,save:()=>({runId:attemptId,questRun:runId,mission,morale:100,waves,encounterId:'rabble',combatVersion:4,rewardVersion:2,enemyOfficer:null}),load(s){if(s?.mission!==mission||s.questRun!==runId||s.questRun!==YellowQuest.progress().pending?.runId&&s.questRun!==YellowQuest.progress()[kind+'Run'])throw Error('不是本次黃巾前線戰鬥存檔');attemptId=s.runId;}};
 const originalApply=YellowTurbanEncounter.apply;
 YellowTurbanEncounter.apply=(e,w,k)=>{originalApply(e,w,k);if(kind==='outpost'&&w<=2)Object.assign(e,{type:'刀',name:'黃巾刀兵',def:12,range:1,speed:.85,interval:1.5});if(w===6){const order=kind==='outpost'?['黃巾頭目','黃巾頭目','韓忠','鄧茂']:['黃巾頭目','黃巾頭目','韓忠','鄧茂','程遠志'];const name=order[k-(8-order.length)];if(name)YellowTurbanEncounter.storyOfficer(e,name);}};

 function saveVictory(){if(!BattleResults.result?.win||BattleResults.result.outcome==='retreat')return true;try{if(!YellowQuest.complete(kind,runId))throw Error('戰鬥場次不符');return true;}catch{say('勝利尚未保存，請再次開啟戰報或按返回重試。');return false;}}
 const originalFinish=BattleResults.finish,originalLeave=BattleResults.leave,originalReset=BattleResults.reset;
 BattleResults.finish=function(...args){originalFinish.apply(this,args);saveVictory();};
 BattleResults.leave=function(...args){if(saveVictory())return originalLeave.apply(this,args);};
 BattleResults.reset=function(...args){if(BattleResults.result?.win){saveVictory();throw Error('已獲勝，請返回場景接續劇情');}if(BattleResults.result)attemptId=crypto.randomUUID();Candidates.loadState(ShuBattlePool.current());Recruit.activateStory();return originalReset.apply(this,args);};
 $('battleReport').addEventListener('click',saveVictory);
 const bar=document.createElement('div');bar.className='story-battle-bar';bar.style.cssText='display:flex;gap:5px;flex-wrap:wrap;align-items:center';const back=document.createElement('button');back.textContent='返回黃巾前線';back.onclick=()=>BattleResults.leave();const label=document.createElement('span');label.className='story-battle-title';const titleName=document.createElement('span'),waveLabel=document.createElement('span');titleName.textContent=title;waveLabel.textContent='・'+waves+'波';label.append(titleName,waveLabel);label.title=label.textContent;bar.append(back,label,$('speed'),$('tactics'),$('play'),$('reset'));document.querySelector('main header').append(bar);
 for(const el of document.querySelectorAll('main>section .toolbar,.page-battle-controls'))el.hidden=true;$('supplyMode').hidden=true;$('reset').textContent='重新挑戰';document.title=title;
 [n,rows]=BattleRoutes.orientationSize();$('size').value=n+'x'+rows;reset();say(title+'：部署隊伍後開始，守住撤離據點。');
 const fade=document.createElement('div');fade.style.cssText='position:fixed;inset:0;background:#000;z-index:200;pointer-events:none;opacity:1;transition:opacity 1.4s';document.body.append(fade);requestAnimationFrame(()=>requestAnimationFrame(()=>fade.style.opacity='0'));setTimeout(()=>fade.remove(),1600);
})();
