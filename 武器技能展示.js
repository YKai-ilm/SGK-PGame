'use strict';
// 隔離展示場：沿用實戰 tick/draw/技能；不載入存檔、招募與結算模組。
(()=>{
 const realTick=tick,realSpawn=spawn,realEnemyTick=enemyTick;
 const names=Object.keys(roster).filter(name=>roster[name].skills.length||['刀','槍','弓','投','塔'].includes(name));
 let heroName=names.includes('關羽')?'關羽':names[0],mode='basic',actor,triggered=false;
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function options(){const matches=names.filter(n=>n.includes($('search').value.trim()));$('hero').innerHTML=matches.map(n=>'<option>'+esc(n)+'</option>').join('');if(matches.includes(heroName))$('hero').value=heroName;else if(matches.length){heroName=matches[0];mode='basic';setup();}}
 function info(){const d=roster[heroName];$('summary').textContent=d.group+' · 普攻射程 '+d.range+' 格';$('modes').innerHTML=[['basic','普通攻擊'],...d.skills.map((s,i)=>[String(i),s.name+(!s.cd?'（被動）':'')]),['all','普攻＋全部技能']].map(([id,label])=>'<button data-mode="'+id+'" class="'+(mode===id?'active':'')+'">'+esc(label)+'</button>').join('');const skill=d.skills[Number(mode)];$('description').textContent=mode==='basic'?'單獨查看普攻武器的揮舞、刺擊或發射。':mode==='all'?'同時開啟普攻與技能，觀察實戰中動作交疊的情況。':skill.desc+(!skill.cd?' 此為被動效果，展示會搭配普攻與受擊條件。':' 冷卻 '+skill.cd+' 秒。');}
 function setup(){
  window.LingCombat?.reset();n=10;rows=10;canvas.height=720;terrainBlocks=[];terrainCache=null;terrainSize=0;elapsed=0;last=0;wave=1;spawned=999;kills=0;shots=[];fx=[];units=[];enemies=[];started=true;ended=false;card=null;moving=false;triggered=false;
  const dir={right:[1,0],left:[-1,0],down:[0,1],up:[0,-1]}[$('direction').value],dx=dir[0],dy=dir[1];
  path=Array.from({length:9},(_,i)=>({x:4+dx*(4-i),y:4+dy*(4-i)}));gate={...path.at(-1),id:'gate',hp:3000,max:3000,def:30,mdef:25,shield:0,blocks:0,guard:0};
  actor=makeUnit(heroName,4,4);actor.hp=actor.max*.15;actor.lastHit=0;if(roster[heroName].skills[Number(mode)]?.effect==='cleanseSelf'||mode==='all')actor.root=3;units.push(actor);selected=actor;
  for(const side of [-1,1]){const ally=makeUnit('槍',4-dy*side,4+dx*side);ally.hp=ally.max*.3;ally.root=3;ally.nextAttack=Infinity;units.push(ally);}
  for(let i=0;i<5;i++){realSpawn(1,i);const e=enemies.at(-1);e.t=3-i*.52;Object.assign(e,pos(e.t));e.hp=e.max=100000;e.atk=1;e.speed=0;e.nextAttack=Infinity;e.xp=0;}
  running=true;info();$('toggle').textContent='暫停';$('live').textContent='展示開始';
 }
 spawn=()=>{};
 enemyTick=(e,dt)=>{e.nextAttack=Infinity;realEnemyTick(e,dt);};
 tick=dt=>{
  const selectedSkill=roster[heroName].skills[Number(mode)],passive=selectedSkill&&!selectedSkill.cd;
  actor.cool=roster[heroName].skills.map((s,i)=>mode==='all'||String(i)===mode||(selectedSkill?.id==='afterHeal'&&i===0)?(actor.cool[i]||0):Infinity);
  if(mode!=='basic'&&mode!=='all'&&!passive)actor.nextAttack=Infinity;
  actor.lastHit=elapsed;actor.hp=Math.max(actor.hp,1);
  if(passive&&Math.floor(elapsed*2)!==Math.floor((elapsed+dt)*2))hurt(actor,1,false,enemies[0]);
  realTick(dt*Number($('previewSpeed').value));
  if(actor.cool.some(c=>Number.isFinite(c)&&c>elapsed)||fx.some(f=>f.text===selectedSkill?.name))triggered=true;
  $('live').textContent=elapsed.toFixed(1)+' / 12 秒'+(mode==='basic'?' · 普攻展示':selectedSkill?.cd?(triggered?' · 已施放':' · 等待觸發條件'):' · 效果展示');
  if(elapsed>=12){if($('loop').checked)setup();else{running=false;$('toggle').textContent='繼續';}}
 };
 $('search').oninput=options;$('hero').onchange=()=>{heroName=$('hero').value;mode='basic';setup();};$('direction').onchange=setup;
 $('modes').onclick=e=>{const b=e.target.closest('[data-mode]');if(b){mode=b.dataset.mode;setup();}};
 $('toggle').onclick=()=>{running=!running;$('toggle').textContent=running?'暫停':'繼續';};$('replay').onclick=setup;
 $('step').onclick=()=>{running=false;tick(1/30);running=false;draw();$('toggle').textContent='繼續';};
 window.EffectsPreview={select(name,action='basic'){if(!names.includes(name))throw Error('未知角色');heroName=name;mode=action;$('search').value='';options();setup();},snapshot:()=>({heroName,mode,elapsed,triggered,fx:fx.length,shots:shots.length,units:units.length}),advance(seconds){for(let i=0;i<seconds*30;i++)tick(1/30);draw();}};
 options();setup();
})();
