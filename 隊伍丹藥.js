'use strict';
window.TeamPills=(()=>{
 const catalog=[{id:'redHeartPill',name:'赤心丹',heal:40},{id:'bronzePill',name:'銅仙丹',heal:75},{id:'silverPill',name:'銀仙丹',heal:120},{id:'goldPill',name:'金仙丹',heal:180}];
 let data={id:null,next:5};
 function count(s,mode,id){const n=s[mode==='battle'?'battleItems':'storyItems']?.[id];return Number.isSafeInteger(n)&&n>0?n:0;}
 function selected(s,mode,team){const id=team?.healingPill;return catalog.some(p=>p.id===id)&&count(s,mode,id)>0?id:null;}
 function reset(){data={id:null,next:5};if(window.TutorialBattleConfig)return;let s;try{s=JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')||'{}');}catch{return;}if(!s||typeof s!=='object')return;
  const q=new URLSearchParams(location.search),story=['storySweep','villageDefense','villageRescue','yunlongBandits'].some(k=>q.has(k))||window.VillageSweep||window.VillageDefense?.active;
  const mode=window.BattleContext?.mode||(story?'story':s.mode==='battle'?'battle':'story'),team=s.teams?.[window.BattleContext?.teamKey||(mode==='story'?'story:'+(s.storyFaction||'蜀'):'battle')];data.id=selected(s,mode,team);
 }
 function validate(v,time){if(v===undefined)return;if(!v||Array.isArray(v)||Object.keys(v).length!==2||!(v.id===null||catalog.some(p=>p.id===v.id))||!Number.isFinite(v.next)||v.next<5||v.next%5!==0||!Number.isFinite(time)||v.id!==null&&(v.next<=time+1e-8||v.next>time+5+1e-8))throw Error('隊伍丹藥快照無效');}
 function targets(list,random=Math.random){return list.filter(u=>!u.enemy&&u.id!=='gate'&&u.hp>0&&u.max>0&&u.hp<u.max).map(u=>({u,tie:random()})).sort((a,b)=>a.u.hp/a.u.max-b.u.hp/b.u.max||a.tie-b.tie).slice(0,3).map(v=>v.u);}
 function update(time,list,heal){const pill=catalog.find(p=>p.id===data.id);if(!pill)return;while(data.next<=time+1e-8){for(const u of targets(list))heal(u,pill.heal);data.next+=5;}}
 return {catalog,count,selected,reset,validate,targets,update,save:()=>({...data}),load(v){data=v?{...v}:{id:null,next:5};}};
})();
