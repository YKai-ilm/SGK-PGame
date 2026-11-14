'use strict';
(()=>{
const header=document.querySelector('main header'),nav=document.createElement('nav');nav.className='page-tabs';nav.setAttribute('aria-label','主要分頁');nav.innerHTML='<button id="libraryTab" aria-pressed="false">字卡庫</button><button id="battleTab" class="active" aria-pressed="true">戰場</button>';header.append(nav);
const toolbar=document.querySelector('.toolbar');
if(toolbar?.contains($('size'))){
 const controls=document.createElement('div');controls.className='page-battle-controls';controls.setAttribute('aria-label','戰場控制');
 controls.append(document.querySelector('label[for="size"]'),$('size'),$('play'),$('reset'));nav.append(controls);
}
const frame=document.createElement('iframe');frame.id='libraryPage';frame.title='主要字卡庫';frame.hidden=true;frame.src=window.TutorialBattleConfig?'about:blank':'字卡庫.html?v=20261109-levels'+(new URLSearchParams(location.search).get('storySweep')==='1'?'&storySweep=1':'');document.body.append(frame);let current='battle',resume=false,loaded=false,battleScroll=0;
window.addEventListener('battle-save-paused',()=>{resume=false;});
function send(){if(loaded)frame.contentWindow.postMessage({kind:'library-state',...Candidates.snapshot(),hasBattle:started||units.length>0,cardLevels:[...units.filter(u=>u.hp>0).map(u=>({type:u.type,level:u.level,xp:u.xp||0,place:'場上'})),...deck.flatMap((type,i)=>type?[{type,level:Recruit.saved(i)?.level||1,xp:Recruit.saved(i)?.xp||0,place:'招募區'}]:[])]},'*');}
function position(){const top=Math.max(0,header.getBoundingClientRect().bottom+6);frame.style.top=top+'px';frame.style.height=Math.max(0,innerHeight-top)+'px';}
function switchPage(page){if(page===current)return;current=page;const library=page==='library';if(library){battleScroll=scrollY;window.scrollTo(0,0);resume=running;running=false;moving=false;Assembly.reset();for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();send();}else{if(resume&&!ended)running=true;resume=false;}$('play').textContent=ended?(window.BattleResults?.result?.outcome==='retreat'?'已撤退':gate.hp>0?'守城成功':'城門失守'):running?'暫停戰鬥':started?'繼續戰鬥':'開始戰鬥';frame.hidden=!library;document.body.classList.toggle('library-view',library);for(const [id,active]of [['libraryTab',library],['battleTab',!library]]){$(id).classList.toggle('active',active);$(id).setAttribute('aria-pressed',String(active));}position();if(!library)window.scrollTo(0,battleScroll);sync();}
window.addEventListener('message',e=>{if(e.source!==frame.contentWindow)return;const data=e.data;if(data?.kind==='library-ready'){loaded=true;if(data.saved&&!window.VillageSweep)Candidates.restore(data.saved);window.BattleSave?.offer(data.battleSaved);send();}if(data?.kind==='library-back')switchPage('battle');if(data?.kind==='library-apply'&&current==='library'){if(Candidates.apply(data.chosen,data.heroes)){resume=false;frame.contentWindow.postMessage({kind:'library-applied',...Candidates.snapshot()},'*');switchPage('battle');}}});
$('libraryTab').onclick=()=>switchPage('library');$('battleTab').onclick=()=>switchPage('battle');window.addEventListener('resize',position);position();
})();
