'use strict';
window.YellowTurbanEncounter=(()=>{
 const officers=[
  {name:'鄧茂',stage:'村邊掃蕩',role:'突擊副將',hp:900,atk:42,def:16,mdef:10,range:1.2,interval:1.4,speed:.8,skill:'奮力突刺：每第4次普攻造成150%物理傷害。',basis:'演義第一回中的程遠志副將；FC一代黃巾章亦登場。'},
  {name:'程遠志',stage:'村邊掃蕩',role:'帶隊頭目',hp:1150,atk:38,def:22,mdef:12,range:1.2,interval:1.6,speed:.7,skill:'聚眾：周圍2格內其他敵軍傷害提高5%；本人不受益，陣亡或暈眩後失效。',basis:'演義第一回黃巾頭目；FC一代黃巾章亦登場。'},
  {name:'張曼成',stage:'後續南陽黃巾候選',role:'神上使',basis:'後漢書卷71載南陽黃巾渠帥；能力與技能見黃巾初評，未放入村口。'},
  {name:'韓忠',stage:'後續山寨候選',role:'山寨頭目',basis:'FC一代鐵門峽相關人物，可安排招降支線；尚未接入村邊掃蕩。'},
  {name:'馬元義',stage:'後續城鎮候選',role:'黃巾聯絡者',basis:'FC一代青州城事件人物；保留給城內事件，尚未接入。'},
  {name:'張梁',stage:'黃巾章關卡候選',role:'人公將軍',basis:'既有人物名單已收錄；正式頭目關卡另設計。'},
  {name:'張寶',stage:'黃巾章關卡候選',role:'地公將軍',basis:'既有人物名單已收錄；正式頭目關卡另設計。'},
  {name:'張角',stage:'黃巾章關卡候選',role:'天公將軍',basis:'既有人物名單已收錄；作為黃巾章核心頭目，非村口一般敵人。'}
 ];
 const encounters=[{id:'rabble',name:'村道散賊',leader:null,description:'只出刀、槍、弓兵，沒有武將或額外隊長。'}, {id:'deng',name:'鄧茂遊兵',leader:'鄧茂',description:'槍兵較多，鄧茂於末波出現，注意他的第四次重擊。'}, {id:'cheng',name:'程遠志前隊',leader:'程遠志',description:'刀弓混編，程遠志於末波出現；擊倒帶隊頭目可解除聚眾增益。'}];
 // 關卡修正只作用於換算後戰鬥屬性，不改人物六維與品質。
 const stageScales={1:{hp:.85,attack:.30,defense:.75,interval:1.25},3:{hp:1,attack:.35,defense:.85,interval:1.15},6:{hp:1.15,attack:.40,defense:1,interval:1.05}};
 function combatStats(name,waves,version=4){if(version>=4)return HeroCombat.encounter(name,{stars:1,baseLevel:1},waves);const base=window.HeroCombat?.stats(name),scale=version===2?stageScales[waves]:[1,3,6].includes(waves)?{hp:1,attack:1,defense:1,interval:1}:null;if(!base||!scale)throw Error('缺少敵將能力或掃蕩波數');return {hp:Math.round(base.hp*scale.hp),atk:base.physical*scale.attack,magicAttack:base.magic*scale.attack,def:base.def*scale.defense,mdef:base.mdef*scale.defense,interval:base.interval*scale.interval,quality:base.quality};}
 function fromRunId(id,legacy=false){if(!id)return null;let hash=0;for(const c of id)hash=(hash*31+c.charCodeAt(0))>>>0;const roll=hash%10;return encounters[legacy?hash%encounters.length:roll<6?0:roll<8?1:2];}
 function current(){return window.VillageSweep?encounters.find(e=>e.id===VillageSweep.encounterId)||null:null;}
 function waveCount(w,version=window.VillageSweep?.combatVersion||1){return version===6?[3,4,4,5,5,6][w-1]:6+w;}
 function apply(e,w,k){const encounter=current();if(!encounter)return;const finalWave=window.VillageSweep?.waves||6,boss=(!!encounter.leader||VillageSweep.rewardVersion===1)&&w===finalWave&&k===waveCount(w)-1;const kind=boss?'將':encounter.id==='deng'?(k%3===0?'槍':k%5===4?'弓':'刀'):(k%4===3?'弓':k%3===2?'槍':'刀');
  Object.assign(e,{type:kind,name:kind==='刀'?'黃巾刀兵':kind==='槍'?'黃巾槍兵':kind==='弓'?'黃巾弓兵':'黃巾隊長',hp:100+w*18,max:100+w*18,atk:14+w*3,def:kind==='刀'?12:8,mdef:8,range:kind==='弓'?3.5:kind==='槍'?1.6:1,speed:kind==='刀'?.85:kind==='槍'?.8:.75,interval:kind==='弓'?1.8:1.5,foodValue:4,xp:10+w*2,yellowTurban:true,enemyAttacks:0,settlementXP:1});
  if(!boss&&VillageSweep.combatVersion===5){const health=270+w*35;Object.assign(e,{hp:Math.round(health*(kind==='弓'?.7:kind==='槍'?.85:1)),atk:22+w*3});e.max=e.hp;}
  if(!boss&&VillageSweep.combatVersion>=6){sharedInfantry(e,w);}
  if(boss){const d=officers.find(o=>o.name===encounter.leader);Object.assign(e,d?{name:d.name,hp:d.hp,max:d.hp,atk:d.atk,def:d.def,mdef:d.mdef,range:d.range,interval:d.interval,speed:d.speed,enemySkill:d.skill}:{hp:650,max:650,atk:32,def:18,mdef:10,range:1.2,interval:1.6,speed:.75});if(d&&VillageSweep.combatVersion>=2){const stats=VillageSweep.combatVersion>=4?VillageSweep.enemyOfficer:combatStats(d.name,finalWave,VillageSweep.combatVersion);if(!stats||VillageSweep.combatVersion>=4&&stats.name!==d.name)throw Error('缺少本場敵將能力快照');Object.assign(e,stats,{max:stats.hp,combatVersion:VillageSweep.combatVersion});}e.foodValue=12;e.xp=50;e.settlementXP=VillageSweep.rewardVersion===1?3:6;}
 }
 // 劇情固定敵將，不套用玩家持有卡的等級或裝備。
 function storyOfficer(e,name,wave=window.VillageSweep?.waves||1){
  const stats={賊匪頭目:[650,32,18,12],黃巾頭目:[650,32,18,12],鄧茂:[900,42,20,12],程遠志:[1150,38,22,12],韓忠:[1500,48,26,16],張曼成:[1250,44,22,18],馬元義:[1050,38,18,22],張寶:[2100,58,26,24]}[name];
  if(!stats)throw Error('未設定的劇情敵將：'+name);
  const [hp,atk,def,mdef]=stats;
  Object.assign(e,{name,type:'將',hp,max:hp,atk,def,mdef,range:1.6,interval:1.6,speed:.75,foodValue:12,xp:60,settlementXP:6,yellowOfficer:name});
  if(name==='鄧茂')e.enemySkill='奮力突刺：每第4次普攻造成150%物理傷害。';
  if(name==='程遠志')e.enemySkill='黃巾號令：周圍2格其他敵軍傷害增加5%。';
  return applyStoryStats(e,wave);
 }
 function applyStoryStats(e,wave){if(window.VillageSweep?.combatVersion>=8&&window.HERO_COMBAT_DATA?.[e.name]){const stats=HeroCombat.encounter(e.name,{stars:1,level:VillageSweep.combatVersion>=9?officerLevel(e.name):wave},wave);Object.assign(e,stats,{max:stats.hp,combatVersion:VillageSweep.combatVersion});}return e;}
 // Each chapter has explicit phases; short encounters do not inherit six-wave finals.
 const stageLevels={
  'taoyuan-defense':[1],'taoyuan-rescue':[1,1,2],'yunlong-bandits':[2],
  'grain-rescue':[2,2,3],'grain-camp':[2,2,3,3,4],
  'yellow-outpost':[3,3,4,4,5,5],'yellow-hq':[4,4,5,5,6,6],
  'han-relief':[4,4,5,5],'han-fire':[4,4,5,5,6,6],'han-wancheng':[5,5,6,6,7,7]
 };
 function infantryLevel(w,mission=window.VillageSweep?.mission,waves=window.VillageSweep?.waves||6,route=window.HanBattle?.battleRoute){const levels=mission?stageLevels[mission]:{1:[1],3:[1,1,2],6:[1,1,2,2,3,3]}[waves];if(!levels||!Number.isInteger(w)||w<1||w>levels.length)throw Error('未設定的敵軍波段');return levels[w-1]+(mission==='han-wancheng'&&route==='direct'?1:0);}
 function officerLevel(name,mission=window.VillageSweep?.mission,waves=window.VillageSweep?.waves||6,route=window.HanBattle?.battleRoute){if(!mission){const level={1:2,3:3,6:4}[waves];if(!level)throw Error('未設定的掃蕩頭目等級');return level;}const level={'grain-camp':5,'yellow-outpost':6,'yellow-hq':7,'han-wancheng':name==='張寶'?9:8}[mission];if(!level)throw Error('未設定的劇情敵將等級');return level+(mission==='han-wancheng'&&route==='direct'?1:0);}
 function sharedInfantry(e,w=1){if(['刀','槍','弓'].includes(e.type)){Object.assign(e,BasicTroops.combatStats(e.type,window.VillageSweep?.combatVersion>=9?infantryLevel(w):1));e.max=e.hp;}return e;}
 function damageBonus(source){if(!current()||!source?.enemy)return 0;return enemies.some(e=>e!==source&&e.name==='程遠志'&&e.hp>0&&e.stun<=elapsed&&Math.hypot(e.x-source.x,e.y-source.y)<=2)?.05:0;}
 return {stageLevels,infantryLevel,officerLevel,applyStoryStats,sharedInfantry,waveCount,storyOfficer,officers,encounters,stageScales,combatStats,fromRunId,current,apply,damageBonus};
})();
