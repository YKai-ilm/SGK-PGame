'use strict';
window.SwallowGrowth=(()=>{
 const profile=()=>JSON.parse(localStorage.getItem('sgk-swallow-interface-preview-v1')||'{}');
 function names(s){return [...new Set([...s.party.map(u=>u.name),...Object.keys(s.reserves||{}),...(s.shop?.heroes||[])])];}
 function person(name){return OFFICER_PROPOSAL.entries.find(p=>p.name===name);}
 function record(s,name){s.officers??={};return s.officers[name]??={level:1,stars:1,xp:0};}
 function equipmentState(s){return {equipment:s.equipment||{},unlocks:{story:{heroes:names(s)}}};}
 function stats(s,name){const p=person(name);if(!p||p.holdingOnly)return null;const r=record(s,name),q=OFFICER_QUALITY.evaluate(p).quality,base=HeroCombat.permanent(HeroCombat.calculate(p,q,r.stars),r.level);return EquipmentBattle.previewBase(equipmentState(s),'story',name,base);}
 function sync(s){
  if(s.battle&&!s.battle.outcome)return;
  const saved=profile().equipment?.story;s.equipment??={};s.equipment.story??={items:[],loadouts:{}};const inventory=s.equipment.story;
  for(const item of saved?.items||[])if(!inventory.items.some(i=>i.id===item.id))inventory.items.push({...item});
  if(!s.equipmentImported){inventory.loadouts=JSON.parse(JSON.stringify(saved?.loadouts||{}));s.equipmentImported=true;}
  s.reserves??={};
  if(s.formationCells?.length!==s.party.length)delete s.formationCells;
  for(const name of names(s)){const p=person(name);if(!p||p.holdingOnly)continue;const unit=s.party.find(u=>u.name===name)||s.reserves[name]||(s.reserves[name]={name,hp:1,max:1,attack:0,speed:1,xp:0});
   const r=record(s,name);if(!unit.growthVersion){r.xp+=Math.max(0,unit.xp||0);unit.growthVersion=1;}else if((unit.xp||0)>r.xp)r.xp=unit.xp;
   while(r.level<100&&r.xp>=100*r.level){r.xp-=100*r.level;r.level++;}if(r.level===100)r.xp=0;
   const value=stats(s,name),ratio=unit.max>0?Math.min(1,Math.max(0,unit.hp/unit.max)):1;
   const hp=unit.max===value.hp?unit.hp:unit.hp<=0?0:Math.max(1,Math.round(value.hp*ratio));
   Object.assign(unit,{max:value.hp,hp,attack:value.physical,magicAttack:value.magic,def:value.def,mdef:value.mdef,support:value.support,speed:value.rate,rate:value.rate,quality:OFFICER_QUALITY.evaluate(p).quality,level:r.level,stars:r.stars,xp:r.xp,combatStats:value,equipmentEffects:value.effects});
  }
  if(s.armyConfigured){s.spMax=support(s).total;s.sp=Math.min(s.sp,s.spMax);}
 }
 function mutate(name,fn){const g=FiveVFiveGame,s=g.read();if(s.battle)throw Error('請先結束並離開目前戰鬥');if(!names(s).includes(name)||person(name)?.holdingOnly)throw Error('此武將不能養成');fn(s,record(s,name));sync(s);localStorage.setItem(g.key,JSON.stringify(s));}
 function train(name,amount){mutate(name,(s,r)=>{if(!Number.isSafeInteger(amount)||amount<=0||amount>(s.trainingXP||0)||r.level>=100)throw Error('可分配經驗不足或已滿級');let remain=0;for(let i=r.level;i<100;i++)remain+=100*i;const used=Math.min(amount,remain-r.xp);s.trainingXP-=used;r.xp+=used;const u=s.party.find(u=>u.name===name)||s.reserves[name];u.xp=r.xp;});}
 function star(name){mutate(name,(s,r)=>{const q=OFFICER_QUALITY.evaluate(person(name)).quality,cost=OfficerStarCosts[q]?.find(x=>x.fromStar===r.stars)?.fragments;if(!cost)throw Error('已達目前最高星級');if((s.shop?.fragments?.[name]||0)<cost)throw Error('同名碎片不足');s.shop.fragments[name]-=cost;r.stars++;});}
 function equip(name,slot,id){mutate(name,s=>{const state=equipmentState(s);EquipmentSystem.equip(state,'story',name,slot,id);s.equipment=state.equipment;});}
 
 function support(s){const name=s.support?.strategist,u=s.party.find(u=>u.name===name)||s.reserves?.[name];return window.StrategyPoints?.breakdown(u?.hp>0?name:null,name?record(s,name).level:1)||{base:0,bonus:0,total:0};}
 function saveArmy(cells,roles,formation){const g=FiveVFiveGame,s=g.read();if(s.battle)throw Error('請先離開戰鬥再整備');if(cells.length!==15)throw Error('布陣盤須為三排五格');const fighters=cells.filter(Boolean),all=[...fighters,roles.strategist,roles.quartermaster].filter(Boolean),owned=names(s);if(!fighters.length||fighters.length>5)throw Error('一般隊伍請配置1至5名武將');if(new Set(all).size!==all.length)throw Error('同名武將只能配置一個位置');for(const n of all)if(!owned.includes(n)||person(n)?.holdingOnly)throw Error('只能配置已持有的參戰武將');if(roles.strategist&&!StrategyPoints.canAppoint(roles.strategist))throw Error('軍師需智力65以上');const units=new Map([...Object.values(s.reserves||{}),...s.party].map(u=>[u.name,u]));s.reserves=Object.fromEntries([...units].filter(([name])=>!fighters.includes(name)));s.party=fighters.map(n=>units.get(n));s.support={...roles};s.formation=formation;s.formationOrder=s.party.map((_,i)=>i);s.formationCells=cells.map((name,i)=>name?i:null).filter(i=>i!==null);s.spMax=support(s).total;s.sp=Math.min(s.sp,s.spMax);s.armyConfigured=true;sync(s);localStorage.setItem(g.key,JSON.stringify(s));}
 return {sync,stats,record,names,equipmentState,train,star,equip,support,saveArmy};
})();
