'use strict';
window.PlayerBattle=(()=>{
 let snapshot=window.PlayerOfficer?.active?JSON.parse(JSON.stringify(PlayerOfficer.active)):null,runId=crypto.randomUUID();
 function reset(){runId=crypto.randomUUID();if(!window.BattleRestoring&&snapshot){const current=PlayerOfficer.get();if(current?.id===snapshot.id){snapshot=JSON.parse(JSON.stringify(current));PlayerOfficer.register({playerOfficer:snapshot});}}}
 function save(){return snapshot?{runId,player:snapshot}:null;}
 function valid(s){return s===null||!!s&&typeof s.runId==='string'&&s.runId.length>0&&s.runId.length<=100&&PlayerOfficer.valid(s.player)&&s.player.id===PlayerOfficer.active?.id&&s.player.name===PlayerOfficer.active?.name&&s.player.style===PlayerOfficer.active?.style;}
 function load(s){if(!valid(s))throw Error('玩家戰場資料不符');snapshot=s?.player?JSON.parse(JSON.stringify(s.player)):null;runId=s?.runId||crypto.randomUUID();if(snapshot)PlayerOfficer.register({playerOfficer:snapshot});}
 function settle(report){
  if(!snapshot||!report.rows.some(r=>r.name===snapshot.name))return null;
  const s=PlayerOfficer.read(),p=PlayerOfficer.get(s);if(!p||p.id!==snapshot.id)throw Error('玩家卡已變更');
  s.playerBattleReceipts??={};if(s.playerBattleReceipts[runId])return s.playerBattleReceipts[runId];
  const owned=new Set([...(s.unlocks?.story?.letters||[]),...(s.unlocks?.battle?.letters||[]),...BasicTroops.types,p.name]);
  const allocation=ExperiencePreview.calculate(report,owned,true),amount=allocation.items.find(x=>x.letter===p.name)?.amount||0,before=p.level;
  const fragments=p.fragments,used=PlayerOfficer.gainXP(p,amount),r={name:p.name,total:used,level:p.level,before,xp:p.xp,rebirth:p.rebirth,fragments:p.fragments-fragments};s.playerBattleReceipts[runId]=r;localStorage.setItem(PlayerOfficer.key,JSON.stringify(s));return r;
 }
 return{reset,save,valid,load,settle};
})();
