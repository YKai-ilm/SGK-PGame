'use strict';
window.EquipmentBattle=(()=>{
 let current={};
 function valid(data){return !!data&&typeof data==='object'&&!Array.isArray(data)&&Object.entries(data).every(([name,hp])=>Object.hasOwn(window.TestRoster||{},name)&&[100,250,500].includes(hp));}
 function reset(){
  current={};if(window.TutorialBattleConfig)return;
  let s;try{s=JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')||'{}');}catch{return;}
  if(!s||typeof s!=='object')return;
  const q=new URLSearchParams(location.search),story=['storySweep','villageDefense','villageRescue','yunlongBandits'].some(k=>q.has(k))||window.VillageSweep||window.VillageDefense?.active;
  const mode=story?'story':s.mode==='battle'?'battle':'story',used=new Set();
  const heroes=s.unlocks?.[mode]?.heroes;if(!Array.isArray(heroes))return;
  for(const name of heroes){
   if(!Object.hasOwn(window.TestRoster||{},name))continue;
   const item=window.EquipmentSystem.equipped(s,mode,name,'accessory'),effect=window.EquipmentSystem.effects(item);
   if(effect&&!used.has(item.id)){current[name]=effect.hp;used.add(item.id);}
  }
 }
 function apply(u){if(!u.hero||u.enemy||u.equipmentHP!==undefined)return u;const hp=current[u.type]||0;if(hp){u.equipmentHP=hp;u.max+=hp;u.hp+=hp;}return u;}
 // 裝備固定值不隨局內升級乘上 12%，也不在讀檔時重複加入。
 function growHP(u){const extra=u.equipmentHP||0;return Math.round((u.max-extra)*1.12)+extra;}
 return {reset,apply,growHP,valid,save:()=>({...current}),load(data){current=data===undefined?{}:valid(data)?{...data}:{};}};
})();
