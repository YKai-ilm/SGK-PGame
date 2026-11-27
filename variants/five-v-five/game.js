'use strict';
window.FiveVFiveGame=(()=>{
 const demo232=typeof location!=='undefined'&&new URLSearchParams(location.search).get('formation')==='232';
 const campaign=!!window.SWALLOW_CAMPAIGN;
 const key=campaign?'sgk-swallow-party-v1':demo232?'sgk-seven-232-preview-v1':'sgk-five-v-five-preview-v1',story=SharedGrainStory;
 const formations={front3:{name:'前三後二',rows:[0,1,0,1,0],columns:[1,2,3,4,5]},front2:{name:'前二後三',rows:[1,0,1,0,1],columns:[1,2,3,4,5]},wedge:{name:'錐形陣',rows:[0,1,1,2,2],columns:[3,2,4,1,5]}};
 if(demo232){for(const id of Object.keys(formations))delete formations[id];formations.front3={name:'前二中三後二（七人試排）',rows:[2,0,1,0,2,1,1],columns:[2,2,3,4,4,1,5]};}
 // Provisional turn-based effects, independent from tower-defense combat balance.
 const strategies={fire:{name:'火計',cost:3,side:'enemy',description:'對一名敵人造成較高傷害'},heal:{name:'赤心計',cost:2,side:'ally',description:'恢復一名存活武將80生命'}};
 const items={redHeartPill:{name:'赤心丹',heal:40},bronzePill:{name:'銅仙丹',heal:75},revivalPill:{name:'復活丹',revive:true}};
 const initial=()=>({version:1,scene:campaign?'桃源村':'糧道谷關',progress:demo232?{routeKnown:true,rescueWon:true,rescueShown:true}: {routeKnown:true},coins:100,items:{},party:(campaign?['劉備']:demo232?['劉備','關羽','張飛','趙雲','黃忠','許褚','徐晃']:['劉備','關羽','張飛','趙雲','黃忠']).map((name,i)=>({name,max:260+i*15,hp:260+i*15,attack:80+i*3,speed:10+i,xp:0})),active:null,battle:null});
 function read(){const raw=localStorage.getItem(key),s=raw?JSON.parse(raw):initial();if(s.version!==1||!Array.isArray(s.party)||(campaign?(s.party.length<1||s.party.length>5):s.party.length!==(demo232?7:5)))throw Error('新版驗證存檔格式不符，未覆寫原資料');
  s.formation=formations[s.formation]?s.formation:'front3';s.formationOrder=validOrder(s.formationOrder,s.party.length)?s.formationOrder:s.party.map((_,i)=>i);s.spMax??=24;s.sp??=24;for(const [i,u]of s.party.entries()){u.speed??=10+i;u.xp??=0;}
  // One-time preview supplies; old saves keep their items, HP and story progress.
  if(!s.combatSuppliesV2){for(const [id,n]of Object.entries({redHeartPill:5,bronzePill:3,revivalPill:3}))s.items[id]=(s.items[id]||0)+n;s.combatSuppliesV2=true;}
  if(!campaign&&!s.previewRevival999){s.items.revivalPill=Math.max(999,s.items.revivalPill||0);s.previewRevival999=true;}
  if(s.battle){const b=s.battle;b.enemyFormation=formations[b.enemyFormation]?b.enemyFormation:(demo232?'front3':'front2');b.formation=formations[b.formation]?b.formation:s.formation;b.formationOrder=validOrder(b.formationOrder,s.party.length)?b.formationOrder:[...s.formationOrder];b.mode??='manual';b.log??=[];for(const [i,u]of b.enemies.entries())u.speed??=9+i;
   if(!b.queue){b.queue=s.party.map((u,index)=>({side:'ally',index})).filter(v=>v.index>=b.turn&&s.party[v.index].hp>0).concat(b.enemies.map((u,index)=>({side:'enemy',index})));b.cursor=0;}
   if(!b.phase){b.orders={};b.planAt=0;b.fallen=[];if(b.outcome)b.phase='ended';else if(b.mode!=='manual')b.phase='executing';else{b.remaining=b.queue.slice(b.cursor);b.planners=b.remaining.filter(v=>v.side==='ally'&&s.party[v.index].hp>0).map(v=>v.index);b.phase=b.planners.length?'planning':'executing';b.turn=b.planners[0]??-1;}}
   b.orders??={};b.planners??=[];b.planAt??=0;b.fallen??=[];
  }if(campaign)window.SwallowGrowth?.sync(s);return s;
 }
 function change(fn){const s=read(),result=fn(s);if(campaign)window.SwallowGrowth?.sync(s);localStorage.setItem(key,JSON.stringify(s));return result;}
 function advance(s,flag){if(!story.canAdvance(flag,s.progress))throw Error('請先完成前段對話');if(flag==='captainGift')s.items.damagedLeatherArmor=(s.items.damagedLeatherArmor||0)+1;if(flag==='reported'){s.coins+=60;s.trainingXP=(s.trainingXP||0)+100;}s.progress[flag]=true;}
 function talk(lines,flag=null){return change(s=>{if(s.battle?.outcome===null)throw Error('請先結束戰鬥');s.active={lines,index:0,flag};});}
 function next(){return change(s=>{if(!s.active)return null;const a=s.active;if(a.index<a.lines.length-1){a.index++;return null;}if(a.flag)advance(s,a.flag);s.active=null;return a.flag;});}
 // Prototype troop values; names follow the requested early-chapter roster, not FC balance data.
 const basicTroops={
  '黃巾賊':{hp:170,attack:18,speed:10,weapons:['刀','槍','弓']},'義賊':{hp:160,attack:17,speed:12,weapons:['劍','弓']},
  '土匪':{hp:180,attack:20,speed:9,weapons:['刀','斧']},'士兵':{hp:180,attack:19,speed:10,weapons:['槍','劍']},
  '官兵':{hp:190,attack:20,speed:10,weapons:['槍','刀']},'山賊':{hp:180,attack:20,speed:10,weapons:['斧','弓']},
  '海盜':{hp:180,attack:21,speed:11,weapons:['刀','槍']},'流民':{hp:150,attack:15,speed:10,weapons:['刀']},
  '馬賊':{hp:170,attack:19,speed:14,weapons:['槍','弓']},'盜賊':{hp:150,attack:18,speed:13,weapons:['刀','劍']}
 };
 const troopPools={road:['黃巾賊','黃巾賊','土匪','義賊','盜賊','流民','馬賊'],mountain:['黃巾賊','山賊','山賊','土匪','盜賊'],military:['士兵','官兵'],coast:['海盜','海盜','盜賊']};
 const sweepAreas={'徐州驗證區':'road','糧道谷關':'road','盜糧匪寨':'mountain'};
 const pick=list=>list[Math.floor(Math.random()*list.length)];
 function troop(name,weapon){const d=basicTroops[name],hp=d.hp+Math.floor(Math.random()*3)*10;return {name,troop:name,quality:'白',weapon:weapon||pick(d.weapons),max:hp,hp,attack:d.attack,speed:d.speed};}
 function troopTeam(pool){return Array.from({length:5},()=>troop(pick(troopPools[pool])));}
 const travelRoutes=[{places:['徐州驗證區','糧道谷關'],name:'徐州糧道',chance:.3,pool:'road'},{places:['糧道谷關','盜糧匪寨'],name:'黑風寨山道',chance:.3,pool:'mountain'}];
 function encounter(s,route,to,kind='encounter'){
  s.battle={id:crypto.randomUUID(),kind,journey:{from:s.scene,to,route:route.name},round:1,turn:0,outcome:null,mode:'manual',formation:s.formation,formationOrder:[...s.formationOrder],enemyFormation:pick(Object.keys(formations)),log:[kind==='sweep'?'出城掃蕩賊寇！':route.name+'途中遭遇賊寇！'],enemies:troopTeam(route.pool)};prepare(s);s.active=null;
 }
 function sweep(){return change(s=>{if(s.battle||s.active)throw Error('請先結束目前戰鬥或對話');const pool=sweepAreas[s.scene];if(!pool)throw Error('請從城鎮或野外出口掃蕩');if(s.party.every(u=>u.hp<=0))throw Error('隊伍無法作戰，請先使用復活丹');encounter(s,{name:s.scene+'附近',pool},s.scene,'sweep');});}
 function go(scene){return change(s=>{if(s.battle)throw Error('請先離開戰鬥結算');if(s.active)throw Error('請先完成對話');const route=travelRoutes.find(r=>r.places.includes(s.scene)&&r.places.includes(scene)&&s.scene!==scene);if(route){if(s.party.every(u=>u.hp<=0))throw Error('隊伍無法趕路，請先使用復活丹');if(Math.random()<route.chance){encounter(s,route,scene);return;}}s.scene=scene;s.active=null;});}
 function validOrder(order,n){return Array.isArray(order)&&order.length===n&&new Set(order).size===n&&order.every(i=>Number.isInteger(i)&&i>=0&&i<n);}
 function setFormation(id,order){return change(s=>{if(s.battle&&!s.battle.outcome)throw Error('請在戰前調整陣型');if(!formations[id])throw Error('陣型不存在');if(order&&!validOrder(order,s.party.length))throw Error('請完整安排武將，每人只能放一次');s.formation=id;if(order)s.formationOrder=[...order];});}
 function newRound(s){const b=s.battle;b.queue=['ally','enemy'].flatMap(side=>(side==='ally'?s.party:b.enemies).map((u,index)=>({side,index,score:(campaign?(u.rate??u.speed/10):u.speed)*(.8+Math.random()*.4)})).filter(v=>(v.side==='ally'?s.party:b.enemies)[v.index].hp>0)).sort((a,b)=>b.score-a.score);b.cursor=0;}
 function prepare(s){const b=s.battle;b.phase='planning';b.orders={};b.planners=s.party.map((u,i)=>i).filter(i=>s.party[i].hp>0);b.planAt=0;b.turn=b.planners[0]??-1;b.fallen=[];b.queue=[];b.cursor=0;delete b.remaining;delete b.savedOrders;}
 function available(s=read(),except=s.battle?.turn){let sp=s.sp,stock={...s.items};for(const [who,o]of Object.entries(s.battle?.orders||{})){if(Number(who)===except)continue;if(o.kind==='strategy')sp-=strategies[o.id].cost;if(o.kind==='item')stock[o.id]=(stock[o.id]||0)-1;}return {sp,items:stock};}
 function validateOrder(s,o,actor){const {kind,id,index}=o,a=available(s,actor);if(kind==='attack'){if(!s.battle.enemies[index]||s.battle.enemies[index].hp<=0)throw Error('請選擇存活的敵人');return;}
  if(kind==='strategy'){const d=strategies[id];if(!d||a.sp<d.cost)throw Error('剩餘未預留計策值不足');const target=(d.side==='enemy'?s.battle.enemies:s.party)[index];if(!target||target.hp<=0||id==='heal'&&target.hp===target.max)throw Error('請選擇可使用計策的目標');return;}
  if(kind==='item'){const d=items[id],u=s.party[index];if(!d||!(a.items[id]>0)||!u)throw Error('道具已預留或不足');if(d.revive?u.hp>0:u.hp<=0||u.hp===u.max)throw Error('此道具不適用於該武將');return;}throw Error('未知指令');
 }
 function ready(s){return s.battle.planners.every(i=>!!s.battle.orders[i]);}
 function advancePlanner(s){const b=s.battle;if(b.planAt<b.planners.length-1){b.planAt++;b.turn=b.planners[b.planAt];b.phase='planning';}else b.phase='review';}
 function previous(){return change(s=>{const b=s.battle;if(!b||b.outcome||!['planning','review'].includes(b.phase))throw Error('執行中的回合不能修改指令');if(b.phase==='review')b.phase='planning';else b.planAt=Math.max(0,b.planAt-1);b.turn=b.planners[b.planAt];});}
 function nextPlanner(){return change(s=>{const b=s.battle;if(b?.phase!=='planning'||!b.orders[b.turn])throw Error('請先設定這位武將的指令');advancePlanner(s);});}
 function launch(s){const b=s.battle;if(b.remaining){b.queue=b.remaining;b.cursor=0;delete b.remaining;}else newRound(s);b.phase='executing';b.turn=-1;}
 function executeRound(){return change(s=>{const b=s.battle;if(!b||b.outcome||!['planning','review'].includes(b.phase)||!ready(s))throw Error('請先為所有存活武將下達指令');launch(s);});}
 function endRound(s){const b=s.battle;b.round++;if(b.stopAfterRound){b.mode='manual';delete b.stopAfterRound;}prepare(s);if(b.mode!=='manual')launch(s);}

 function log(s,line){s.battle.log.push(line);s.battle.log=s.battle.log.slice(-20);}
 function finish(s,outcome){const b=s.battle;if(b.outcome)return;b.outcome=outcome;b.mode='manual';b.turn=-1;b.phase='ended';
  if(b.village){if(outcome==='victory'){s.coins+=12;b.experience=s.party.map(u=>({name:u.name,gained:u.hp>0?10:0}));for(const u of s.party)if(u.hp>0)u.xp+=10;}log(s,outcome==='victory'?'敵人已被擊退。獲得12金幣，存活武將各得10經驗。':outcome==='defeat'?'全隊戰敗，請用復活丹救回武將。':'已撤退，隊伍生命保留。');return;}
  if(['encounter','sweep'].includes(b.kind)){if(outcome==='victory'){b.reward={coins:12,xp:10};s.coins+=b.reward.coins;b.experience=s.party.map(u=>({name:u.name,gained:u.hp>0?b.reward.xp:0}));for(const u of s.party)if(u.hp>0)u.xp+=b.reward.xp;}log(s,outcome==='victory'?'賊寇已被擊退，獲得12金幣；存活武將各得10經驗，可繼續前往'+b.journey.to+'。':outcome==='defeat'?'全隊戰敗，退回'+b.journey.from+'。請使用復活丹救回武將。':'已撤退，返回'+b.journey.from+'。');return;}
  if(outcome==='victory'&&!b.practice){if(s.progress.pending?.runId!==b.id)throw Error('救援場次不符');s.progress.rescueWon=true;s.progress.rescueRun=b.id;b.experience=s.party.map(u=>({name:u.name,gained:u.hp>0?30:0}));for(const u of s.party)if(u.hp>0)u.xp+=30;}
  if(s.progress.pending?.runId===b.id)delete s.progress.pending;log(s,outcome==='victory'?(b.practice?'演練結束，不重複領取經驗與劇情獎勵。':'追兵已被擊退。存活武將各得30經驗；死亡武將不分經驗。'):outcome==='defeat'?'全隊戰敗。請使用復活丹救回死亡武將。':'已撤退，剩餘生命與死亡狀態保留。');
 }
 function checkEnd(s){if(s.battle.enemies.every(u=>u.hp<=0))finish(s,'victory');else if(s.party.every(u=>u.hp<=0))finish(s,'defeat');}
 const randomTarget=list=>{const alive=list.map((u,i)=>i).filter(i=>list[i].hp>0);return alive[Math.floor(Math.random()*alive.length)];};
 function applyItem(s,id,index){const d=items[id],u=s.party[index];if(!d||!(s.items[id]>0)||!u)throw Error('道具不足或目標不存在');if(d.revive){if(u.hp>0)throw Error('復活丹只能用於死亡武將');u.hp=Math.ceil(u.max*.5);}else{if(u.hp<=0)throw Error('死亡武將需要復活丹');if(u.hp===u.max)throw Error('此武將生命已滿');u.hp=Math.min(u.max,u.hp+d.heal);}s.items[id]--;}
 function perform(s,v,kind,id,index){const b=s.battle,actor=(v.side==='ally'?s.party:b.enemies)[v.index];let targetSide,amount,target;
  if(kind==='attack'){targetSide=v.side==='ally'?'enemy':'ally';target=(targetSide==='enemy'?b.enemies:s.party)[index];if(!target||target.hp<=0)throw Error('請選擇存活的敵人');amount=campaign?Math.max(1,Math.round(actor.attack*150/(150+(target.def||0)))):actor.attack;target.hp=Math.max(0,target.hp-amount);log(s,actor.name+' 攻擊 '+target.name+'，造成 '+amount+' 傷害。');}
  else if(kind==='strategy'){const d=strategies[id];if(!d||s.sp<d.cost)throw Error('計策值不足');targetSide=d.side;target=(d.side==='enemy'?b.enemies:s.party)[index];if(!target||target.hp<=0)throw Error('請選擇存活的目標');if(id==='heal'&&target.hp===target.max)throw Error('此武將生命已滿');s.sp-=d.cost;amount=id==='fire'?Math.round((campaign?actor.magicAttack??actor.attack:actor.attack)*1.45*(campaign?150/(150+(target.mdef||0)):1)):campaign?Math.round((actor.support||80)*1.2):80;target.hp=id==='fire'?Math.max(0,target.hp-amount):Math.min(target.max,target.hp+amount);log(s,actor.name+' 使用'+d.name+' → '+target.name+'（'+amount+'）');}
  else if(kind==='item'){targetSide='ally';target=s.party[index];applyItem(s,id,index);log(s,actor.name+' 使用'+items[id].name+' → '+target.name);}
  else throw Error('未知指令');b.event={serial:(b.event?.serial||0)+1,actor:{side:v.side,index:v.index},target:{side:targetSide,index},kind,id:id||null};if(target.hp===0){log(s,target.name+' 倒下了。');if(targetSide==='ally'&&!b.fallen.includes(index))b.fallen.push(index);}b.cursor++;checkEnd(s);
 }

 function beginVillage(kind){return change(s=>{if(!campaign)throw Error('請從三哥吞食劇情入口進入');if(s.battle)throw Error('請先結束目前戰鬥');if(s.party.every(u=>u.hp<=0))throw Error('請先使用復活丹');const profile=JSON.parse(localStorage.getItem('sgk-swallow-interface-preview-v1')||'{}'),storyState=JSON.parse(localStorage.getItem('sgk-swallow-taoyuan-dialogue-v1')||'{}'),flags=profile.storyEvents||{};if(!['sweep','defense','rescue'].includes(kind))throw Error('未知戰鬥');if(kind==='defense'&&(!(flags.peachOath||storyState.seen?.includes('oath'))||flags.villageDefense))throw Error('尚未到守村階段');if(kind==='rescue'&&(!flags.villageDefense||!storyState.seen?.includes('villageDefenseAfter')||flags.villageRescue))throw Error('尚未到救援階段');encounter(s,{name:'桃源村外',pool:kind==='rescue'?'mountain':'road'},'桃源村','sweep');s.battle.village=kind;if(kind==='defense')s.battle.enemies=['刀','槍','弓','刀','槍'].map(w=>troop('黃巾賊',w));});}
 function begin(practice=false){return change(s=>{if(s.battle&&!s.battle.outcome||!(practice?s.progress.rescueWon:story.canStart('rescue',s.progress)))throw Error('目前不能開始救援');if(s.party.every(u=>u.hp<=0))throw Error('隊伍無法作戰，請先使用復活丹');const id=crypto.randomUUID();if(!practice)s.progress.pending={kind:'rescue',runId:id};s.battle={id,practice:!!practice,round:1,turn:0,outcome:null,mode:'manual',formation:s.formation,enemyFormation:Object.keys(formations)[Math.floor(Math.random()*Object.keys(formations).length)],log:['交戰開始。'],enemies:['賊兵甲','賊兵乙','賊兵丙','賊兵丁','賊首'].map((name,i)=>({name,max:170+(i===4?80:0),hp:170+(i===4?80:0),attack:15+i*3,speed:9+i}))};if(!practice)s.battle.enemies=['刀','槍','弓','劍','刀'].map(weapon=>troop('黃巾賊',weapon));prepare(s);});}
 function act(kind,id,index){return change(s=>{const b=s.battle;if(!b||b.outcome||b.mode!=='manual'||b.phase!=='planning')throw Error('目前無法下達指令');const order={kind,id,index};validateOrder(s,order,b.turn);b.orders[b.turn]=order;advancePlanner(s);});}
 function useItem(id,index){return change(s=>{if(s.battle&&!s.battle.outcome)throw Error('請由戰鬥道具指令使用');applyItem(s,id,index);});}
 function autoChoice(s,v){if(v.side==='enemy')return ['attack',null,randomTarget(s.party)];if(s.battle.mode==='auto'){
 const dead=s.party.findIndex(u=>u.hp<=0);if(dead>=0&&s.items.revivalPill>0)return ['item','revivalPill',dead];
 const weak=s.party.map((u,i)=>({u,i})).filter(x=>x.u.hp>0&&x.u.hp/x.u.max<.6).sort((a,b)=>a.u.hp/a.u.max-b.u.hp/b.u.max)[0];
 if(weak){if(s.sp>=strategies.heal.cost)return ['strategy','heal',weak.i];for(const id of ['bronzePill','redHeartPill'])if(s.items[id]>0)return ['item',id,weak.i];}
 if(s.sp>=strategies.fire.cost)return ['strategy','fire',randomTarget(s.battle.enemies)];
 }return ['attack',null,randomTarget(s.battle.enemies)];}
 function setMode(mode){return change(s=>{const b=s.battle;if(!b||b.outcome||!['manual','charge','auto'].includes(mode))throw Error('目前無法切換作戰方式');if(b.phase==='executing'){if(mode!=='manual')throw Error('請先完成本回合');b.stopAfterRound=true;return;}b.mode=mode;if(mode!=='manual'){b.savedOrders={...b.orders};b.orders={};launch(s);}});}
 function cancelAutomatic(){return change(s=>{const b=s.battle;if(!b||b.outcome||b.mode==='manual')throw Error('目前沒有自動指令');b.remaining=b.queue.slice(b.cursor).filter(v=>(v.side==='ally'?s.party:b.enemies)[v.index].hp>0&&!(v.side==='ally'&&b.fallen.includes(v.index)));b.planners=b.remaining.filter(v=>v.side==='ally').map(v=>v.index).sort((a,b)=>a-b);b.orders={};for(const i of b.planners)if(b.savedOrders?.[i])b.orders[i]=b.savedOrders[i];delete b.savedOrders;b.mode='manual';delete b.stopAfterRound;b.planAt=0;b.turn=b.planners[0]??-1;b.phase=b.planners.length?'planning':'executing';if(!b.planners.length){b.queue=b.remaining;b.cursor=0;delete b.remaining;}});}
 function step(){return change(s=>{const b=s.battle;if(!b||b.outcome||b.phase!=='executing')return;checkEnd(s);if(b.outcome)return;
  while(b.cursor<b.queue.length){const v=b.queue[b.cursor],actor=(v.side==='ally'?s.party:b.enemies)[v.index];if(actor.hp<=0||v.side==='ally'&&b.fallen.includes(v.index)){b.cursor++;continue;}
   b.turn=v.side==='ally'?v.index:-1;let order=v.side==='ally'&&b.mode==='manual'?b.orders[v.index]:null;
   if(!order){if(v.side==='ally'&&b.mode==='manual'){b.cursor++;continue;}const [kind,id,index]=autoChoice(s,v);order={kind,id,index};}
   else order={...order};
   const offensive=order.kind==='attack'||order.kind==='strategy'&&strategies[order.id]?.side==='enemy';
   if(offensive){const targets=v.side==='ally'?b.enemies:s.party;if(!targets[order.index]||targets[order.index].hp<=0)order.index=randomTarget(targets);}
   // A planned heal/revival may become invalid after faster units act. Skip without payment.
   const target=order.kind==='item'||order.kind==='strategy'&&strategies[order.id]?.side==='ally'?s.party[order.index]:null;
   const unusable=target&&(order.kind==='item'&&items[order.id]?.revive?target.hp>0:target.hp<=0||target.hp===target.max);
   const depleted=order.kind==='strategy'&&s.sp<strategies[order.id].cost||order.kind==='item'&&!(s.items[order.id]>0);
   if(unusable||depleted){log(s,actor.name+' 的預定目標或資源已改變，取消本次行動。');b.cursor++;}
   else perform(s,v,order.kind,order.id,order.index);
   if(!b.outcome&&b.cursor>=b.queue.length)endRound(s);return;
  }endRound(s);
 });}

 function returnFromBattle(){return change(s=>{if(!s.battle?.outcome)throw Error('戰鬥尚未結束');const b=s.battle;s.scene=['encounter','sweep'].includes(b.kind)?(b.outcome==='victory'?b.journey.to:b.journey.from):'糧道谷關';s.battle=null;});}
 function showRescue(){return change(s=>{if(s.progress.rescueWon&&!s.progress.rescueShown)advance(s,'rescueShown');});}
 function retreat(){return change(s=>{if(!s.battle||s.battle.outcome)throw Error('目前沒有進行中的戰鬥');finish(s,'retreat');});}
 function rest(){return change(s=>{if(s.scene!=='客棧'||s.battle&&!s.battle.outcome)throw Error('請先回客棧休息');if(!s.party.some(u=>u.hp>0))throw Error('全隊已死亡，請先使用復活丹');if(s.coins<20)throw Error('住宿需要20金幣');if(s.party.every(u=>u.hp<=0||u.hp===u.max)&&s.sp===s.spMax)throw Error('存活武將已恢復健康');s.coins-=20;for(const u of s.party)if(u.hp>0)u.hp=u.max;s.sp=s.spMax;});}
 return {campaign,beginVillage,demo232,key,basicTroops,sweep,formations,strategies,items,read,talk,next,go,begin,act,available,previous,nextPlanner,executeRound,attack:index=>act('attack',null,index),setMode,cancelAutomatic,step,setFormation,useItem,retreat,returnFromBattle,showRescue,rest};
})();
