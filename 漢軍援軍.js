'use strict';
if(window.HanBattle)window.HanSupport=(()=>{
 const config=['guangzong','quyang'].includes(HanBattle.kind)?[['皇甫嵩',3]]:HanBattle.kind==='wancheng'?[['朱儁',3]]:HanBattle.kind==='relief'?[['盧植',2]]:[['朱儁',0],['皇甫嵩',4]];
 let used=[],announced=[],picked=null,paused=false,creating=false;
 const box=document.createElement('section');box.id='hanSupport';box.title='本關限定，不佔招募格';
 const style=document.createElement('style');style.textContent=`
 #hanSupport{display:flex;align-items:center;flex-wrap:wrap;gap:5px;padding:3px 5px;border-radius:6px;background:#dce8eb;margin:0;min-width:0}
 #hanSupport .support-label{font-size:12px;white-space:nowrap;color:#355461}
 #hanSupport button[data-support]{box-sizing:border-box;flex:0 0 var(--support-width,45px);width:var(--support-width,45px);height:var(--support-height,32px);min-height:0;min-width:0;margin:0;padding:1px 0;touch-action:none;display:flex;flex-direction:column;justify-content:center;align-items:center;border:1px solid #899d96;border-radius:6px;line-height:1.1;overflow:hidden}
 #hanSupport button[data-support][aria-pressed="true"]{outline:2px solid #285b70;outline-offset:1px;box-shadow:inset 0 0 0 1px #fff}
 #hanSupport button[data-support]:focus-visible{outline:2px dashed #285b70;outline-offset:1px}
 #hanSupport .support-name{font-size:min(12px,calc((var(--support-width,45px) - 4px)/3));white-space:nowrap}
 #hanSupport .support-state{font-size:9px;white-space:nowrap}
 #hanSupportArrival{position:fixed;z-index:40;transform:translate(-50%,-50%);box-sizing:border-box;width:420px;overflow:auto;padding:14px;border:1px solid #7c9696;border-radius:10px;background:#edf3eaf5;color:#284639;box-shadow:0 5px 20px #10221955}
 #hanSupportArrival[hidden]{display:none!important}
 #hanSupportArrival p{font-size:13px;line-height:1.7;margin:0 0 10px}
 #hanSupportArrival button{font:inherit;font-size:13px;min-height:36px;padding:6px 12px}

 `;document.head.append(style);
 function fitSupport(){const card=Array.from($('cards').children).find(el=>el.matches('.card')&&el.getBoundingClientRect().width>0);if(!card)return;const r=card.getBoundingClientRect();box.style.setProperty('--support-width',r.width+'px');box.style.setProperty('--support-height',r.height+'px');}
 new ResizeObserver(fitSupport).observe($('cards'));$('cards').after(box);
 const arrival=document.createElement('section');arrival.id='hanSupportArrival';arrival.hidden=true;arrival.setAttribute('role','dialog');arrival.setAttribute('aria-label','援軍抵達');document.body.append(arrival);
 function placeArrival(){if(arrival.hidden)return;const r=canvas.getBoundingClientRect();arrival.style.left=(r.left+r.width/2)+'px';arrival.style.top=(r.top+r.height/2)+'px';arrival.style.maxWidth=Math.max(0,r.width-16)+'px';arrival.style.maxHeight=Math.max(0,r.height-16)+'px';}
 new ResizeObserver(placeArrival).observe(canvas);window.addEventListener('resize',placeArrival);window.addEventListener('scroll',placeArrival,{passive:true});
 const nameOf=ref=>typeof ref==='number'?Recruit.saved(ref)?.storySupport:ref?.storySupport;
 const available=(name,w)=>!used.includes(name)&&(w===0||announced.includes(name));
 function showPicked(){box.querySelectorAll('[data-support]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.support===picked)));}
 function paint(){box.replaceChildren();const title=document.createElement('span');title.className='support-label';title.textContent='支援：';box.append(title);for(const [name,w]of config){const b=document.createElement('button');b.dataset.support=name;b.setAttribute('aria-pressed',String(name===picked));const status=used.includes(name)?'已出陣':available(name,w)?'部署':'第'+w+'波';const label=document.createElement('span');label.className='support-name';label.textContent=name;const hint=document.createElement('span');hint.className='support-state';hint.textContent=status;b.append(label,hint);b.setAttribute('aria-label',name+' · '+(status.startsWith('第')?status+'抵達':status));b.disabled=!available(name,w)||ended;b.style.background=QualityArt.colors(name).fill;b.onclick=()=>{picked=name;card=null;selected=null;moving=false;showPicked();say('點空格部署'+name+'；援軍不可回收或移入招募區。');};let down=null;b.onpointerdown=e=>{down={x:e.clientX,y:e.clientY};b.setPointerCapture(e.pointerId);};b.onpointerup=e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>8){const r=canvas.getBoundingClientRect();deploy(name,Math.floor((e.clientX-r.left)/r.width*(n+1)-.5),Math.floor((e.clientY-r.top)/r.height*(rows+1)-.5));}down=null;};b.onpointercancel=()=>{down=null;};box.append(b);}const wasHidden=arrival.hidden;arrival.replaceChildren();arrival.hidden=!paused||ended;if(!arrival.hidden){const speech=document.createElement('p');speech.textContent=['guangzong','quyang'].includes(HanBattle.kind)?'皇甫嵩：玄德，接應已至！諸軍依令進退，勿亂陣腳！':HanBattle.kind==='wancheng'?'朱儁：玄德，援軍已至！守住接應口，莫讓賊眾衝散陣腳！':HanBattle.kind==='relief'?'盧植：玄德，守住陣腳！待後隊過了，再一同收兵！':'軍士：賊營起火了！皇甫將軍正往這裡進兵！　皇甫嵩：側翼已穩，諸軍隨我接應！莫追散卒，先截敵勢！　朱儁：玄德，接住這一陣，不能讓他們衝散我軍！';arrival.append(speech);const b=document.createElement('button');b.textContent='援軍已到・繼續戰鬥';b.onclick=()=>{paused=false;running=true;$('play').textContent='暫停';paint();};arrival.append(b);placeArrival();if(wasHidden)b.focus({preventScroll:true});}}
 function deploy(name,x,y){const c=config.find(c=>c[0]===name);if(!c||!available(...c)||!actionAllowed()||x<0||y<0||x>=n||y>=rows||!placeAllowed(x,y)||units.some(u=>u.type===name||u.x===x&&u.y===y))return false;creating=true;let u;try{u=makeUnit(name,x,y);}finally{creating=false;}u.storySupport=name;used.push(name);units.push(u);selected=u;card=null;picked=null;paint();sync();say(name+'到陣！本關援軍不領取永久經驗。');return true;}
 canvas.addEventListener('click',e=>{if(!picked)return;e.preventDefault();e.stopImmediatePropagation();const r=canvas.getBoundingClientRect();deploy(picked,Math.floor((e.clientX-r.left)/r.width*(n+1)-.5),Math.floor((e.clientY-r.top)/r.height*(rows+1)-.5));},true);
 for(const event of ['pointerdown','click'])document.getElementById('cards').addEventListener(event,()=>{picked=null;showPicked();},true);
 function beforeTick(dt){for(const [name,w]of config){if(w>0&&!announced.includes(name)&&elapsed+dt>=(w-1)*battleWavePeriod){announced.push(name);paused=true;running=false;$('play').textContent='繼續戰鬥';paint();say(name==='朱儁'?'朱儁：援軍已至！守住接應口！':name==='盧植'?'盧植：玄德，守住陣腳！待後隊過了，再一同收兵！':'軍士：賊營起火！皇甫嵩：側翼已穩，諸軍隨我接應！');return false;}}if(paused&&running){paused=false;paint();}return true;}
 function validate(s){if(!s||!Array.isArray(s.used)||!Array.isArray(s.announced)||[s.used,s.announced].some(list=>new Set(list).size!==list.length||list.some(name=>!config.some(c=>c[0]===name)))||typeof s.paused!=='boolean')throw Error('援軍進度無效');for(const name of s.used){const c=config.find(c=>c[0]===name);if(c[1]>0&&!s.announced.includes(name))throw Error('援軍尚未抵達');}return true;}
 function load(s){validate(s);used=[...s.used];announced=[...s.announced];paused=s.paused;picked=null;paint();}
 const originalReset=BattleResults.reset;BattleResults.reset=function(...args){used=[];announced=[];picked=null;paused=false;const r=originalReset.apply(this,args);paint();return r;};
 paint();return {deploy,beforeTick,validate,load,save:()=>({used,announced,paused}),is:nameOf,get paused(){return paused;},get creating(){return creating;}};
})();
