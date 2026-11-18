'use strict';
window.BattleShortcuts=(()=>{
 const catalog=[{id:'criticalPill',name:'會心丹',mark:'會',ready:true,description:'場上存活友軍普攻暴擊率＋20個百分點，持續10秒，暴擊傷害150%；不疊加或延長。'},{id:'evasionPowder',name:'神行散',mark:'行',ready:true,description:'場上存活友軍普攻閃避率＋10個百分點，持續10秒；不改移速，不疊加或延長。'},{id:'clearMindPowder',name:'清心散',mark:'清',ready:true,description:'解除場上存活友軍的暈眩、定身、緩速與降攻速；無可解除狀態時不消耗。'},{id:'foodVoucher',name:'軍糧兌換卡',mark:'糧',ready:true,description:'增加本場軍糧200。'},{id:'protectionSmoke',name:'護身煙',mark:'煙',ready:false,description:'無敵持續時間尚待定案，暫不可使用。'}];
 function count(s,mode,id){const n=mode==='story'?s.storyItems?.[id]:s.battleItems?.[id];return Number.isSafeInteger(n)&&n>0?n:0;}
 function slots(s,mode,team){const saved=team?.itemShortcuts;if(!Array.isArray(saved))return [count(s,mode,'foodVoucher')>0?'foodVoucher':null,null,null,null,null];const seen=new Set();return Array.from({length:5},(_,i)=>{const id=saved[i];if(!catalog.some(x=>x.id===id)||seen.has(id))return null;seen.add(id);return id;});}
 function assign(current,index,id){if(!Number.isInteger(index)||index<0||index>4||id!==null&&!catalog.some(x=>x.id===id))throw Error('道具欄位無效。');if(id&&current.some((x,i)=>i!==index&&x===id))throw Error('同一種道具只需配置一格。');const next=Array.from({length:5},(_,i)=>current[i]||null);next[index]=id;return next;}
 const buffs={criticalPill:{field:'itemCritUntil',duration:10},evasionPowder:{field:'itemDodgeUntil',duration:10}};
 function buffTargets(id,list,time){const b=buffs[id];return b?list.filter(u=>!u.enemy&&u.id!=='gate'&&u.hp>0&&!(u[b.field]>time)):[];}
 function applyBuff(id,list,time){const targets=buffTargets(id,list,time);for(const u of targets)u[buffs[id].field]=time+buffs[id].duration;return targets;}
 const cleanseKeys=['stun','root','slow','attackSlow','lingSlow','letterSlow'];
 function cleanseTargets(list,time){return list.filter(u=>!u.enemy&&u.id!=='gate'&&u.hp>0&&cleanseKeys.some(k=>Number.isFinite(u[k])&&u[k]>time));}
 function cleanse(list,time){const targets=cleanseTargets(list,time);for(const u of targets)for(const k of cleanseKeys)if(u[k]>time){u[k]=0;delete u[k+'Owner'];}return targets;}
 function spend(mode,id){if(!['story','battle'].includes(mode)||!catalog.some(i=>i.id===id&&i.ready))return false;const key='three-kingdoms-interface-preview-v1',s=JSON.parse(localStorage.getItem(key)||'null');if(!s)return false;const n=count(s,mode,id);if(!n)return false;s[mode==='story'?'storyItems':'battleItems'][id]=n-1;localStorage.setItem(key,JSON.stringify(s));return true;}
 return {catalog,count,slots,assign,cleanseTargets,cleanse,spend,buffs,buffTargets,applyBuff};
})();
