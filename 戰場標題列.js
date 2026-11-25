'use strict';
// 所有正式戰場共用短標籤，波次取即時狀態（含重來與載入）。
(()=>{
 const header=document.querySelector('main header'),play=document.getElementById('play'),resetButton=document.getElementById('reset');if(!header||!play)return;
 if(resetButton)resetButton.textContent='重來';
 const lessonBack=document.getElementById('lessonLeave');if(lessonBack){lessonBack.textContent='返回';lessonBack.title='保存進度並返回';}
 let bar=play.closest('header')?play.parentElement:null;if(bar?.classList.contains('page-battle-controls'))bar=null;
 let label=bar?.querySelector('.story-battle-title,#sweepProgress')||bar?.querySelector('span');
 let name=label?.querySelector('span')?.textContent||label?.textContent?.replace(/\s*[·・]\s*\d+波.*$|\s+\d+\/波.*$/,'')||(lessonBack?'新手訓練':'對戰');
 if(!bar){bar=document.createElement('div');bar.style.cssText='display:flex;align-items:center;gap:5px';header.append(bar);if(!lessonBack){const back=document.createElement('button');back.textContent='返回';back.onclick=()=>window.BattleResults?.leave();bar.append(back);}}
 bar.classList.add('story-battle-bar');
 const back=bar.querySelector('button:not(#play):not(#reset):not(#retreatBattle):not(#saveBattle)');if(back){back.title=back.textContent;back.textContent='返回';}
 if(!label){label=document.createElement('span');bar.append(label);}label.classList.add('story-battle-title');label.id=label.id||'battleHeading';
 function update(){
  const total=window.TutorialBattleConfig?.waves||window.VillageSweep?.waves||6,current=Math.min(total,Math.max(1,typeof wave==='number'?wave:1));
  if(label.id==='sweepProgress')name=window.VillageSweep?.title||window.YellowTurbanEncounter?.current()?.name||'掃蕩賊寇';
  const text='・'+current+'/'+total+'波';
  if(label.children.length!==2){const title=document.createElement('span'),progress=document.createElement('span');label.replaceChildren(title,progress);}
  if(label.firstElementChild.textContent!==name)label.firstElementChild.textContent=name;
  if(label.lastElementChild.textContent!==text)label.lastElementChild.textContent=text;
  label.title=name+text;
 }
 const originalSync=sync;sync=function(...args){const result=originalSync.apply(this,args);update();return result;};update();
})();
