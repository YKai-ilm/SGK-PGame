'use strict';
window.FiveVFiveGame=(()=>{
 const key='sgk-five-v-five-preview-v1',story=SharedGrainStory;
 const formations={front3:{name:'前三後二',rows:[0,1,0,1,0]},front2:{name:'前二後三',rows:[1,0,1,0,1]},threeRows:{name:'前二中一後二',rows:[2,0,1,0,2]}};
 // Provisional turn-based effects, independent from tower-defense combat balance.
 const strategies={fire:{name:'火計',cost:3,side:'enemy',description:'對一名敵人造成較高傷害'},heal:{name:'赤心計',cost:2,side:'ally',description:'恢復一名存活武將80生命'}};
 const items={redHeartPill:{name:'赤心丹',heal:40},bronzePill:{name:'銅仙丹',heal:75},revivalPill:{name:'復活丹',revive:true}};
 const initial=()=>({version:1,scene:'糧道谷關',progress:{routeKnown:true},coins:100,items:{},party:['劉備','關羽','張飛','趙雲','黃忠'].map((name,i)=>({name,max:260+i*15,hp:260+i*15,attack:80+i*3,speed:10+i,xp:0})),active:null,battle:null});
 function read(){const raw=localStorage.getItem(key),s=raw?JSON.parse(raw):initial();if(s.version!==1||!Array.isArray(s.party)||s.party.length!==5)throw Error('新版驗證存檔格式不符，未覆寫原資料');
  s.formation=formations[s.formation]?s.formation:'front3';s.spMax??=24;s.sp??=24;for(const [i,u]of s.party.entries()){u.speed??=10+i;u.xp??=0;}
  // One-time preview supplies; old saves keep their items, HP and story progress.
  if(!s.combatSuppliesV2){for(const [id,n]of Object.entries({redHeartPill:5,bronzePill:3,revivalPill:3}))s.items[id]=(s.items[id]||0)+n;s.combatSuppliesV2=true;}
  if(s.battle){const b=s.battle;b.enemyFormation??='front2';b.formation??=s.formation;b.mode??='manual';b.log??=[];for(const [i,u]of b.enemies.entries())u.speed??=9+i;
   if(!b.queue){b.queue=s.party.map((u,index)=>({side:'ally',index})).filter(v=>v.index>=b.turn&&s.party[v.index].hp>0).concat(b.enemies.map((u,index)=>({side:'enemy',index})));b.cursor=0;}
  }return s;
 }
 function change(fn){const s=read(),result=fn(s);localStorage.setItem(key,JSON.stringify(s));return result;}
 function advance(s,flag){if(!story.canAdvance(flag,s.progress))throw Error('請先完成前段對話');if(flag==='captainGift')s.items.damagedLeatherArmor=(s.items.damagedLeatherArmor||0)+1;if(flag==='reported'){s.coins+=60;s.trainingXP=(s.trainingXP||0)+100;}s.progress[flag]=true;}
 function talk(lines,flag=null){return change(s=>{if(s.battle?.outcome===null)throw Error('請先結束戰鬥');s.active={lines,index:0,flag};});}
 function next(){return change(s=>{if(!s.active)return null;const a=s.active;if(a.index<a.lines.length-1){a.index++;return null;}if(a.flag)advance(s,a.flag);s.active=null;return a.flag;});}
 function go(scene){return change(s=>{if(s.battle&&!s.battle.outcome)throw Error('戰鬥尚未結束');s.scene=scene;s.active=null;});}
 function setFormation(id){return change(s=>{if(s.battle&&!s.battle.outcome)throw Error('請在戰前調整陣型');if(!formations[id])throw Error('陣型不存在');s.formation=id;});}
 function newRound(s){const b=s.battle;b.queue=['ally','enemy'].flatMap(side=>(side==='ally'?s.party:b.enemies).map((u,index)=>({side,index,score:u.speed*(.8+Math.random()*.4)})).filter(v=>(v.side==='ally'?s.party:b.enemies)[v.index].hp>0)).sort((a,b)=>b.score-a.score);b.cursor=0;}
 function current(s){const b=s.battle;while(!b.outcome){if(b.cursor>=b.queue.length){b.round++;newRound(s);}const v=b.queue[b.cursor];if((v.side==='ally'?s.party:b.enemies)[v.index].hp>0){b.turn=v.side==='ally'?v.index:-1;return v;}b.cursor++;}return null;}
 function log(s,line){s.battle.log.push(line);s.battle.log=s.battle.log.slice(-20);}
 function finish(s,outcome){const b=s.battle;if(b.outcome)return;b.outcome=outcome;b.mode='manual';b.turn=-1;
  if(outcome==='victory'&&!b.practice){if(s.progress.pending?.runId!==b.id)throw Error('救援場次不符');s.progress.rescueWon=true;s.progress.rescueRun=b.id;b.experience=s.party.map(u=>({name:u.name,gained:u.hp>0?30:0}));for(const u of s.party)if(u.hp>0)u.xp+=30;}
  if(s.progress.pending?.runId===b.id)delete s.progress.pending;log(s,outcome==='victory'?(b.practice?'演練結束，不重複領取經驗與劇情獎勵。':'追兵已被擊退。存活武將各得30經驗；死亡武將不分經驗。'):outcome==='defeat'?'全隊戰敗。請使用復活丹救回死亡武將。':'已撤退，剩餘生命與死亡狀態保留。');
 }
 function checkEnd(s){if(s.battle.enemies.every(u=>u.hp<=0))finish(s,'victory');else if(s.party.every(u=>u.hp<=0))finish(s,'defeat');}
 const randomTarget=list=>{const alive=list.map((u,i)=>i).filter(i=>list[i].hp>0);return alive[Math.floor(Math.random()*alive.length)];};
 function applyItem(s,id,index){const d=items[id],u=s.party[index];if(!d||!(s.items[id]>0)||!u)throw Error('道具不足或目標不存在');if(d.revive){if(u.hp>0)throw Error('復活丹只能用於死亡武將');u.hp=Math.ceil(u.max*.5);}else{if(u.hp<=0)throw Error('死亡武將需要復活丹');if(u.hp===u.max)throw Error('此武將生命已滿');u.hp=Math.min(u.max,u.hp+d.heal);}s.items[id]--;}
 function perform(s,v,kind,id,index){const b=s.battle,actor=(v.side==='ally'?s.party:b.enemies)[v.index];let targetSide,amount,target;
  if(kind==='attack'){targetSide=v.side==='ally'?'enemy':'ally';target=(targetSide==='enemy'?b.enemies:s.party)[index];if(!target||target.hp<=0)throw Error('請選擇存活的敵人');amount=actor.attack;target.hp=Math.max(0,target.hp-amount);log(s,actor.name+' 攻擊 '+target.name+'，造成 '+amount+' 傷害。');}
  else if(kind==='strategy'){const d=strategies[id];if(!d||s.sp<d.cost)throw Error('計策值不足');targetSide=d.side;target=(d.side==='enemy'?b.enemies:s.party)[index];if(!target||target.hp<=0)throw Error('請選擇存活的目標');if(id==='heal'&&target.hp===target.max)throw Error('此武將生命已滿');s.sp-=d.cost;amount=id==='fire'?Math.round(actor.attack*1.45):80;target.hp=id==='fire'?Math.max(0,target.hp-amount):Math.min(target.max,target.hp+amount);log(s,actor.name+' 使用'+d.name+' → '+target.name+'（'+amount+'）');}
  else if(kind==='item'){targetSide='ally';target=s.party[index];applyItem(s,id,index);log(s,actor.name+' 使用'+items[id].name+' → '+target.name);}
  else throw Error('未知指令');b.event={serial:(b.event?.serial||0)+1,actor:{side:v.side,index:v.index},target:{side:targetSide,index},kind};if(target.hp===0)log(s,target.name+' 倒下了。');b.cursor++;checkEnd(s);
 }
 function manualReady(s){while(!s.battle.outcome){const v=current(s);if(v.side==='ally')return;perform(s,v,'attack',null,randomTarget(s.party));}}
 function begin(practice=false){return change(s=>{if(s.battle&&!s.battle.outcome||!(practice?s.progress.rescueWon:story.canStart('rescue',s.progress)))throw Error('目前不能開始救援');if(s.party.every(u=>u.hp<=0))throw Error('隊伍無法作戰，請先使用復活丹');const id=crypto.randomUUID();if(!practice)s.progress.pending={kind:'rescue',runId:id};s.battle={id,practice:!!practice,round:1,turn:0,outcome:null,mode:'manual',formation:s.formation,enemyFormation:Object.keys(formations)[Math.floor(Math.random()*3)],log:['交戰開始。'],enemies:['賊兵甲','賊兵乙','賊兵丙','賊兵丁','賊首'].map((name,i)=>({name,max:170+(i===4?80:0),hp:170+(i===4?80:0),attack:15+i*3,speed:9+i}))};newRound(s);manualReady(s);});}
 function act(kind,id,index){return change(s=>{const b=s.battle;if(!b||b.outcome||b.mode!=='manual')throw Error('目前無法下達指令');const v=current(s);if(v.side!=='ally')throw Error('尚未輪到我方');perform(s,v,kind,id,index);manualReady(s);});}
 function useItem(id,index){return change(s=>{if(s.battle&&!s.battle.outcome)throw Error('請由戰鬥道具指令使用');applyItem(s,id,index);});}
 function autoChoice(s,v){if(v.side==='enemy')return ['attack',null,randomTarget(s.party)];if(s.battle.mode==='auto'){
 const dead=s.party.findIndex(u=>u.hp<=0);if(dead>=0&&s.items.revivalPill>0)return ['item','revivalPill',dead];
 const weak=s.party.map((u,i)=>({u,i})).filter(x=>x.u.hp>0&&x.u.hp/x.u.max<.6).sort((a,b)=>a.u.hp/a.u.max-b.u.hp/b.u.max)[0];
 if(weak){if(s.sp>=strategies.heal.cost)return ['strategy','heal',weak.i];for(const id of ['bronzePill','redHeartPill'])if(s.items[id]>0)return ['item',id,weak.i];}
 if(s.sp>=strategies.fire.cost)return ['strategy','fire',randomTarget(s.battle.enemies)];
 }return ['attack',null,randomTarget(s.battle.enemies)];}
 function setMode(mode){return change(s=>{if(!s.battle||s.battle.outcome||!['manual','charge','auto'].includes(mode))throw Error('目前無法切換作戰方式');s.battle.mode=mode;if(mode==='manual')manualReady(s);});}
 function step(){return change(s=>{if(!s.battle||s.battle.outcome||s.battle.mode==='manual')return;const v=current(s);perform(s,v,...autoChoice(s,v));if(!s.battle.outcome)current(s);});}
 function returnFromBattle(){return change(s=>{if(!s.battle?.outcome)throw Error('戰鬥尚未結束');s.battle=null;s.scene='糧道谷關';});}
 function showRescue(){return change(s=>{if(s.progress.rescueWon&&!s.progress.rescueShown)advance(s,'rescueShown');});}
 function retreat(){return change(s=>{if(!s.battle||s.battle.outcome)throw Error('目前沒有進行中的戰鬥');finish(s,'retreat');});}
 function rest(){return change(s=>{if(s.scene!=='客棧'||s.battle&&!s.battle.outcome)throw Error('請先回客棧休息');if(!s.party.some(u=>u.hp>0))throw Error('全隊已死亡，請先使用復活丹');if(s.coins<20)throw Error('住宿需要20金幣');if(s.party.every(u=>u.hp<=0||u.hp===u.max)&&s.sp===s.spMax)throw Error('存活武將已恢復健康');s.coins-=20;for(const u of s.party)if(u.hp>0)u.hp=u.max;s.sp=s.spMax;});}
 return {key,formations,strategies,items,read,talk,next,go,begin,act,attack:index=>act('attack',null,index),setMode,step,setFormation,useItem,retreat,returnFromBattle,showRescue,rest};
})();
