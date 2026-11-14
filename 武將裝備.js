'use strict';
// 裝備實例與裝備配置按模式保存；此模組不發放物品、不改戰鬥能力。
window.EquipmentSystem=(()=>{
 const slots={weapon:'武器',armor:'防具',mount:'坐騎',accessory:'飾品'};
 const weaponLabels={spear:'槍',blade:'刀',sword:'劍',bow:'弓',staff:'策杖'};
 const fixed={劉備:'sword',關羽:'blade',張飛:'spear',趙雲:'spear',黃忠:'bow',馬超:'spear',諸葛亮:'staff',徐庶:'staff',陳宮:'staff',大喬:'staff',小喬:'staff'};
 function weaponType(name){if(fixed[name])return fixed[name];const label=window.TestRoster?.[name]?.weaponLabel;return ({長槍:'spear',槍:'spear',長刀:'blade',刀:'blade',劍:'sword',長劍:'sword',弓:'bow',策杖:'staff'})[label]||null;}
 function modeData(state,mode){return state.equipment?.[mode]||{};}
 function items(state,mode){const seen=new Set();return (Array.isArray(modeData(state,mode).items)?modeData(state,mode).items:[]).filter(i=>{if(!i||typeof i.id!=='string'||!i.id||seen.has(i.id)||typeof i.name!=='string'||!i.name||!Object.hasOwn(slots,i.slot))return false;if(['新兵槍桿','新兵長桿'].includes(i.name))i.name='新兵木槍';seen.add(i.id);return true;});}
 function compatible(item,name,slot){return !!item&&item.slot===slot&&(slot!=='weapon'||!!weaponType(name)&&item.weaponType===weaponType(name));}
 function owner(state,mode,id){const loads=modeData(state,mode).loadouts||{};for(const [name,load] of Object.entries(loads)){for(const slot of Object.keys(slots))if(load?.[slot]===id)return name;}return null;}
 function equipped(state,mode,name,slot){const id=modeData(state,mode).loadouts?.[name]?.[slot];return items(state,mode).find(i=>i.id===id&&compatible(i,name,slot))||null;}
 function candidates(state,mode,name,slot){return items(state,mode).filter(i=>compatible(i,name,slot)&&(!owner(state,mode,i.id)||owner(state,mode,i.id)===name));}
 function equip(state,mode,name,slot,id){
  if(!['story','battle'].includes(mode)||!Object.hasOwn(slots,slot))throw Error('裝備欄位不正確。');
  if(!state.unlocks?.[mode]?.heroes?.includes(name))throw Error('此武將尚未解鎖，無法裝備。');
  const item=id===null?null:items(state,mode).find(i=>i.id===id);
  if(id!==null&&!compatible(item,name,slot))throw Error('背包內沒有符合這個欄位的裝備。');
  const holder=item&&owner(state,mode,item.id);if(holder&&holder!==name)throw Error('這件裝備已由其他武將使用。');
  // 驗證完成後才改配置；換裝不刪除物品，舊裝備立即回到可選清單。
  state.equipment??={};state.equipment[mode]??={items:[],loadouts:{}};
  const data=state.equipment[mode];data.loadouts??={};data.loadouts[name]??={};
  if(id===null)delete data.loadouts[name][slot];else data.loadouts[name][slot]=id;
  return item;
 }
 // combatPower 為裝備定義的綜合評分，不以攻擊力冒充；缺值不能當成零。
 function power(item){return item==null?0:typeof item.combatPower==='number'&&Number.isFinite(item.combatPower)&&item.combatPower>=0?Math.round(item.combatPower):null;}
 function compare(item,current){const next=power(item),old=power(current),delta=next===null||old===null?null:next-old;return{next,old,delta,nextTone:delta===null||delta===0?'equal':delta>0?'higher':'lower',oldTone:delta===null||delta===0?'equal':delta>0?'lower':'higher'};}
 return {slots,weaponLabels,weaponType,items,owner,equipped,candidates,equip,power,compare};
})();

