'use strict';
window.BasicTroops=(()=>{
 const types=['刀','槍','弓','投','塔'];
 const names={刀:'刀兵',槍:'槍兵',弓:'弓兵',投:'投石兵',塔:'箭塔'};
 const key='three-kingdoms-interface-preview-v1';
 function progress(s,mode,type){
  if(!types.includes(type)||!['story','battle'].includes(mode))throw Error('基礎兵種或模式不正確');
  const p=s.chests?.[mode]?.letterProgress?.[type];
  return {level:Number.isInteger(p?.level)?Math.max(1,Math.min(100,p.level)):1,xp:Number.isSafeInteger(p?.xp)&&p.xp>=0?p.xp:0};
 }
 function allocate(s,mode,type,amount){
  const p=progress(s,mode,type),m=s.chests?.[mode];
  if(!Number.isSafeInteger(amount)||amount<=0||amount>(m?.trainingXP||0))throw Error('可分配經驗不足');
  if(p.level>=100)throw Error('字卡已滿級');
  let remaining=-p.xp;for(let l=p.level;l<100;l++)remaining+=100*l;
  const used=Math.min(amount,remaining);p.xp+=used;
  while(p.level<100&&p.xp>=100*p.level){p.xp-=100*p.level;p.level++;}
  if(p.level===100)p.xp=0;
  m.letterProgress??={};m.letterProgress[type]={...m.letterProgress[type],...p,quality:'青'};m.trainingXP-=used;return p;
 }
 function snapshot(){
  if(window.TutorialBattleConfig)return {};
  let s={};try{s=JSON.parse(localStorage.getItem(key)||'{}');}catch{}
  const query=new URLSearchParams(location.search),story=['storySweep','villageDefense','yunlongBandits'].some(k=>query.has(k));
  const mode=window.BattleContext?.mode||(story||window.VillageSweep||window.VillageDefense?.active?'story':s.mode==='battle'?'battle':'story');
  return Object.fromEntries(types.map(type=>[type,progress(s,mode,type)]));
 }
 function combatStats(type,level=1){
  if(!types.includes(type)||!Number.isInteger(level)||level<1||level>100)throw Error('基礎兵種或等級不正確');
  const d=window.TestRoster[type],growth=window.CardGrowth.stats(type,level);
  return {...growth,def:d.def,mdef:d.mdef,range:d.range,interval:d.interval,kind:d.kind,group:d.group,level,quality:'青'};
 }
 function apply(unit,snapshot){
  if(!types.includes(unit.type))return unit;
  const p=snapshot?.[unit.type]||{level:1,xp:0},stats=combatStats(unit.type,p.level);
  Object.assign(unit,stats);unit.xp=p.xp;unit.hp=unit.max=stats.hp;return unit;
 }
 return {types,names,progress,allocate,snapshot,combatStats,apply};
})();
