'use strict';
window.EquipmentBattle=(()=>{
 let current={},weapons={},armors={},mounts={};
 function validWeaponBonus(k,v){return [...(window.EquipmentSystem?.weaponCatalog||[]),...(window.EquipmentSystem?.namedWeaponCatalog||[])].some(e=>e.attack===v&&(['fan','staff'].includes(e.type)?'magic':'physical')===k);}
 function validMounts(data){return !!data&&typeof data==='object'&&!Array.isArray(data)&&Object.entries(data).every(([name,e])=>Object.hasOwn(window.TestRoster||{},name)&&e&&typeof e==='object'&&!Array.isArray(e)&&(window.EquipmentSystem?.mountCatalog||[]).some(m=>{const {name,...stats}=m;return Object.keys(e).length===Object.keys(stats).length&&Object.keys(stats).every(k=>e[k]===stats[k]);}));}
 function validMountUnit(u,snapshot){const fields={equipmentHaste:'haste',equipmentHPRate:'hpRate',equipmentPhysicalRate:'physicalRate',equipmentDefRate:'defRate',equipmentMdefRate:'mdefRate',equipmentMagicRate:'magicRate',equipmentSupportRate:'supportRate'},e={};for(const [field,key]of Object.entries(fields))if(u?.[field]!==undefined)e[key]=u[field];if(!Object.keys(e).length)return true;return !!u.hero&&!u.enemy&&validMounts({[u.type]:e})&&snapshot?.[u.type]&&Object.keys(e).length===Object.keys(snapshot[u.type]).length&&Object.keys(e).every(k=>snapshot[u.type][k]===e[k]);}
 function validArmors(data){return !!data&&typeof data==='object'&&!Array.isArray(data)&&Object.entries(data).every(([name,e])=>Object.hasOwn(window.TestRoster||{},name)&&e&&typeof e==='object'&&!Array.isArray(e)&&Object.keys(e).length===2&&Object.keys(e).every(k=>['def','mdef'].includes(k))&&(window.EquipmentSystem?.armorCatalog||[]).some(a=>a.def===e.def&&a.mdef===e.mdef));}
 function validArmorUnit(u,snapshot){const hasDef=u?.equipmentDef!==undefined,hasMdef=u?.equipmentMdef!==undefined;if(!hasDef&&!hasMdef)return true;return hasDef&&hasMdef&&!!u.hero&&!u.enemy&&validArmors({[u.type]:{def:u.equipmentDef,mdef:u.equipmentMdef}})&&snapshot?.[u.type]?.def===u.equipmentDef&&snapshot?.[u.type]?.mdef===u.equipmentMdef;}
 function validWeapons(data){return !!data&&typeof data==='object'&&!Array.isArray(data)&&Object.entries(data).every(([name,e])=>Object.hasOwn(window.TestRoster||{},name)&&e&&typeof e==='object'&&!Array.isArray(e)&&Object.keys(e).length===1&&Object.entries(e).every(([k,v])=>['physical','magic'].includes(k)&&validWeaponBonus(k,v)));}
 function valid(data){return !!data&&typeof data==='object'&&!Array.isArray(data)&&Object.entries(data).every(([name,hp])=>Object.hasOwn(window.TestRoster||{},name)&&[100,250,500].includes(hp));}
 function reset(){
  current={};weapons={};armors={};mounts={};if(window.TutorialBattleConfig)return;
  let s;try{s=JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')||'{}');}catch{return;}
  if(!s||typeof s!=='object')return;
  const q=new URLSearchParams(location.search),story=['storySweep','villageDefense','villageRescue','yunlongBandits'].some(k=>q.has(k))||window.VillageSweep||window.VillageDefense?.active;
  const mode=story?'story':s.mode==='battle'?'battle':'story',used=new Set();
  const heroes=s.unlocks?.[mode]?.heroes;if(!Array.isArray(heroes))return;
  for(const name of heroes){
   if(!Object.hasOwn(window.TestRoster||{},name))continue;
   const item=window.EquipmentSystem.equipped(s,mode,name,'accessory'),effect=window.EquipmentSystem.effects(item);
   if(effect&&!used.has(item.id)){current[name]=effect.hp;used.add(item.id);}
   const mount=window.EquipmentSystem.equipped(s,mode,name,'mount'),haste=window.EquipmentSystem.effects(mount);
   if(haste&&!used.has(mount.id)){mounts[name]={...haste};used.add(mount.id);}
   const armor=window.EquipmentSystem.equipped(s,mode,name,'armor'),defense=window.EquipmentSystem.effects(armor);
   if(defense&&!used.has(armor.id)){armors[name]={...defense};used.add(armor.id);}
   const weapon=window.EquipmentSystem.equipped(s,mode,name,'weapon'),attack=window.EquipmentSystem.effects(weapon);
   if(attack&&!used.has(weapon.id)){weapons[name]={...attack};used.add(weapon.id);}
  }
 }
 function apply(u){if(!u.hero||u.enemy)return u;const hp=current[u.type]||0;if(hp&&u.equipmentHP===undefined){u.equipmentHP=hp;u.max+=hp;u.hp+=hp;}const mount=mounts[u.type];if(mount&&u.equipmentHaste===undefined){u.equipmentHaste=mount.haste;u.interval/=1+mount.haste;if(mount.hpRate){u.equipmentHPRate=mount.hpRate;const fixed=u.equipmentHP||0,next=Math.round((u.max-fixed)*(1+mount.hpRate))+fixed;u.hp+=next-u.max;u.max=next;}if(mount.physicalRate)u.equipmentPhysicalRate=mount.physicalRate;if(mount.magicRate)u.equipmentMagicRate=mount.magicRate;if(mount.supportRate)u.equipmentSupportRate=mount.supportRate;for(const [stat,rate,field,fixed]of [['def','defRate','equipmentDefRate','equipmentDef'],['mdef','mdefRate','equipmentMdefRate','equipmentMdef']])if(mount[rate]){u[field]=mount[rate];const extra=u[fixed]||0;u[stat]=(u[stat]-extra)*(1+mount[rate])+extra;}}const armor=armors[u.type];if(armor&&u.equipmentDef===undefined&&u.equipmentMdef===undefined){u.equipmentDef=armor.def;u.equipmentMdef=armor.mdef;u.def+=armor.def;u.mdef+=armor.mdef;}const attack=weapons[u.type];if(attack){if(attack.physical&&u.equipmentPhysical===undefined)u.equipmentPhysical=attack.physical;if(attack.magic&&u.equipmentMagic===undefined)u.equipmentMagic=attack.magic;}return u;}
 // 裝備固定值不隨局內升級乘上 12%，也不在讀檔時重複加入。
 function growHP(u,rate=1.12){const extra=u.equipmentHP||0;const factor=1+(u.equipmentHPRate||0),base=Math.round((u.max-extra)/factor);return Math.round(Math.round(base*rate)*factor)+extra;}
 return {validMounts,validMountUnit,saveMounts:()=>JSON.parse(JSON.stringify(mounts)),loadMounts(data){mounts=data!==undefined&&validMounts(data)?JSON.parse(JSON.stringify(data)):{};},validArmors,validArmorUnit,saveArmors:()=>JSON.parse(JSON.stringify(armors)),loadArmors(data){armors=data!==undefined&&validArmors(data)?JSON.parse(JSON.stringify(data)):{};},reset,apply,growHP,valid,validWeapons,validWeaponBonus,saveWeapons:()=>JSON.parse(JSON.stringify(weapons)),loadWeapons(data){weapons=data!==undefined&&validWeapons(data)?JSON.parse(JSON.stringify(data)):{};},save:()=>({...current}),load(data){current=data===undefined?{}:valid(data)?{...data}:{};weapons={};armors={};mounts={};}};
})();
