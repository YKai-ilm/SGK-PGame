'use strict';
window.PlayerBattle=(()=>{
 let weapon=null;
 let snapshot=window.PlayerOfficer?.active?JSON.parse(JSON.stringify(PlayerOfficer.active)):null,runId=crypto.randomUUID();
 const profiles={sword:['hit',2,'近戰','劍'],blade:['hit',2,'近戰','刀'],spear:['pierce',3,'近戰','槍'],lance:['pierce',3,'近戰','矛'],halberd:['pierce',3,'近戰','長戟'],shortHalberd:['hit',2,'近戰','短戟'],axe:['hit',2,'近戰','斧'],whip:['hit',2,'近戰','鞭'],hammer:['hit',2,'近戰','錘'],bow:['arrow',5,'遠攻','弓'],fan:['magic',4,'遠攻','扇'],staff:['magic',4,'遠攻','杖']};
 function validWeapon(w){return w===null||!!w&&typeof w==='object'&&Object.keys(w).length===2&&Object.hasOwn(profiles,w.type)&&[...EquipmentSystem.weaponCatalog,...EquipmentSystem.namedWeaponCatalog].some(e=>e.name===w.name&&e.type===w.type);}
 function profile(w){if(!w)return null;const type=w.type==='halberd'&&['短戟','闇雙鐵戟'].includes(w.name)?'shortHalberd':w.type,p=profiles[type];return p?{kind:p[0],range:p[1],group:p[2],weaponLabel:w.name+'（'+p[3]+'）',playerWeaponType:type}:null;}
 function applyProfile(){if(snapshot&&weapon&&window.TestRoster?.[snapshot.name])Object.assign(TestRoster[snapshot.name],profile(weapon));}
 function capture(){weapon=null;if(!snapshot||window.TutorialBattleConfig)return;const s=PlayerOfficer.read(),q=new URLSearchParams(location.search),story=['storySweep','villageDefense','villageRescue','yunlongBandits'].some(k=>q.has(k))||window.VillageSweep||window.VillageDefense?.active,mode=window.BattleContext?.mode||(story?'story':s.mode==='battle'?'battle':'story'),item=EquipmentSystem.equipped(s,mode,snapshot.name,'weapon');if(item){const w={name:item.name,type:item.weaponType};if(validWeapon(w))weapon=w;}applyProfile();}
 function validUnit(u,s){if(!u)return false;if(u.playerWeaponType===undefined)return !s?.weapon||u.type!==s.player?.name;const p=profile(s?.weapon);return !!p&&u.type===s.player?.name&&u.hero&&!u.enemy&&u.playerWeaponType===p.playerWeaponType&&u.kind===p.kind&&u.range===p.range&&u.group===p.group;}
 function reset(){runId=crypto.randomUUID();if(!window.BattleRestoring&&snapshot){const current=PlayerOfficer.get();if(current?.id===snapshot.id){snapshot=JSON.parse(JSON.stringify(current));PlayerOfficer.register({playerOfficer:snapshot});}capture();}}
 function save(){return snapshot?{runId,player:snapshot,weapon:weapon?{...weapon}:null}:null;}
 function valid(s){return s===null||!!s&&typeof s.runId==='string'&&s.runId.length>0&&s.runId.length<=100&&(s.weapon===undefined||validWeapon(s.weapon))&&PlayerOfficer.valid(s.player)&&s.player.id===PlayerOfficer.active?.id&&s.player.name===PlayerOfficer.active?.name&&s.player.style===PlayerOfficer.active?.style;}
 function load(s){if(!valid(s))throw Error('玩家戰場資料不符');snapshot=s?.player?JSON.parse(JSON.stringify(s.player)):null;runId=s?.runId||crypto.randomUUID();weapon=s?.weapon?{...s.weapon}:null;if(snapshot)PlayerOfficer.register({playerOfficer:snapshot});applyProfile();}
 function settle(report){
  if(!snapshot||!report.rows.some(r=>r.name===snapshot.name))return null;
  const s=PlayerOfficer.read(),p=PlayerOfficer.get(s);if(!p||p.id!==snapshot.id)throw Error('玩家卡已變更');
  s.playerBattleReceipts??={};if(s.playerBattleReceipts[runId])return s.playerBattleReceipts[runId];
  const owned=new Set([...(s.unlocks?.story?.letters||[]),...(s.unlocks?.battle?.letters||[]),...BasicTroops.types,p.name]);
  const allocation=ExperiencePreview.calculate(report,owned,true),amount=allocation.items.find(x=>x.letter===p.name)?.amount||0,before=p.level;
  const fragments=p.fragments,used=PlayerOfficer.gainXP(p,amount),r={name:p.name,total:used,level:p.level,before,xp:p.xp,rebirth:p.rebirth,fragments:p.fragments-fragments};s.playerBattleReceipts[runId]=r;localStorage.setItem(PlayerOfficer.key,JSON.stringify(s));return r;
 }
 return{profile,validWeapon,validUnit,reset,save,valid,load,settle};
})();
