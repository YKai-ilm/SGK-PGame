'use strict';
// 裝備實例與配置按模式保存；僅已定案效果交由裝備戰鬥模組套用。
window.EquipmentSystem=(()=>{
 const slots={weapon:'武器',armor:'防具',mount:'坐騎',accessory:'飾品'};
 const weaponLabels={spear:'槍',blade:'刀',sword:'劍',bow:'弓',fan:'扇',staff:'杖'};
 const fixed={劉備:'sword',關羽:'blade',張飛:'spear',趙雲:'spear',黃忠:'bow',馬超:'spear',諸葛亮:'staff',徐庶:'staff',陳宮:'staff',大喬:'staff',小喬:'staff'};
 function weaponType(name){if(fixed[name])return fixed[name];const label=window.TestRoster?.[name]?.weaponLabel;return ({長槍:'spear',槍:'spear',長刀:'blade',刀:'blade',劍:'sword',長劍:'sword',弓:'bow',策杖:'staff'})[label]||null;}
 function modeData(state,mode){return state.equipment?.[mode]||{};}
 function items(state,mode){const seen=new Set();return (Array.isArray(modeData(state,mode).items)?modeData(state,mode).items:[]).filter(i=>{if(!i||typeof i.id!=='string'||!i.id||seen.has(i.id)||typeof i.name!=='string'||!i.name||!Object.hasOwn(slots,i.slot))return false;if(['新兵槍桿','新兵長桿'].includes(i.name))i.name='新兵木槍';seen.add(i.id);return true;});}
 function compatible(item,name,slot){return !!item&&item.slot===slot&&(slot!=='weapon'||!!weaponType(name)&&(item.weaponType===weaponType(name)||weaponType(name)==='staff'&&item.weaponType==='fan'));}
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
 // 戰力 v1：固定參考體質，同時計算輸出與有效生命；不讀存檔手填分數。
 const statKeys=['hp','physical','magic','def','mdef','haste'];
 function scoreStats(stats){
  if(!stats||typeof stats!=='object'||Array.isArray(stats)||Object.entries(stats).some(([k,v])=>!statKeys.includes(k)||!Number.isFinite(v)||v<0))return null;
  const {hp=0,physical=0,magic=0,def=0,mdef=0,haste=0}=stats;
  const offense=(1+(physical+magic)/400)*(1+haste);
  // 物理／謀略各占一半；沿用戰鬥的 100/(100+防禦) 減傷公式。
  const incoming=.5*100/(150+def)+.5*100/(150+mdef);
  const survival=(1+hp/4000)*(100/150)/incoming;
  const value=1000*(Math.sqrt(offense*survival)-1);
  return Number.isFinite(value)?Math.round(value):null;
 }
 function ratedStats(item){
  if(!item)return {};
  const hp={青銅項鍊:100,銀項鍊:250,金項鍊:500};if(item.slot==='accessory'&&Object.hasOwn(hp,item.name))return {hp:hp[item.name]};
  const groups={sword:['新兵木劍','短劍','青銅劍','鐵劍'],blade:['新兵短木刀','砍刀','青銅刀','鐵刀'],spear:['新兵木槍','長槍','青銅槍','鐵槍'],bow:['新兵木弓','獵弓','青銅弓','鐵弓'],fan:['新兵竹扇','羽扇','白羽扇','鶴羽扇','青玉扇','七星扇'],staff:['新兵木杖','竹節杖','銅飾杖','鐵芯杖','青玉杖','七星杖']};
  const index=groups[item.weaponType]?.indexOf(item.name)??-1;
  return item.slot==='weapon'&&index>=0?{[['fan','staff'].includes(item.weaponType)?'magic':'physical']:[20,40,80,150,250,400][index]}:null;
 }
 function power(item){return item==null?0:scoreStats(ratedStats(item));}
 function compare(item,current){const next=power(item),old=power(current),delta=next===null||old===null?null:next-old;return{next,old,delta,nextTone:delta===null||delta===0?'equal':delta>0?'higher':'lower',oldTone:delta===null||delta===0?'equal':delta>0?'lower':'higher'};}
 function effects(item){return item?ratedStats(item):null;}
 function effectText(item){if(!item)return '';const e=ratedStats(item);if(!e)return '能力數值尚未定案';const labels={hp:'最大生命',physical:'物攻',magic:'謀攻',def:'物防',mdef:'謀防',haste:'攻速'};return Object.entries(e).map(([k,v])=>labels[k]+'＋'+(k==='haste'?Math.round(v*100)+'%':v)).join('、');}
 function typeText(item){const sub=item.slot==='weapon'?(weaponLabels[item.weaponType]||'未分類'):item.slot==='accessory'?(['項鍊','指環','玉佩','護身符','護腕'].find(t=>item.name.includes(t))||''):item.slot==='armor'?(['重甲','輕甲','法袍'].find(t=>item.name.includes(t))||''):'';return (slots[item.slot]||'裝備')+(sub?'/'+sub:'');}
 return {typeText,slots,weaponLabels,weaponType,items,owner,equipped,candidates,equip,power,compare,effects,effectText,scoreStats,ratedStats};
})();

