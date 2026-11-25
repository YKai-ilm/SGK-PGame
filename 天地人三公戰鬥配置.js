'use strict';
window.ThreeLordsCombat={apply(e,w,k,stage){
 if(!['brothers','lords'].includes(stage))throw Error('三公戰鬥階段無效');
 e.type=w<=2?(k%3===2?'槍':'刀'):(k%4===3?'弓':k%3===2?'槍':'刀');
 YellowTurbanEncounter.sharedInfantry(e,w);e.name='黃巾'+e.type+'兵';
 if(w===5&&k===7||w===6&&k===4){const b=BasicTroops.combatStats('槍',YellowTurbanEncounter.infantryLevel(w));Object.assign(e,b,{type:'將',name:'黃巾頭目',hp:Math.round(b.hp*1.3),atk:b.atk*1.1,foodValue:8,settlementXP:3});}
 const name=w===6?(stage==='brothers'?{6:'張梁',7:'張寶'}:{5:'張梁',6:'張寶',7:'張角'})[k]:null;
 if(stage==='brothers'&&w===6&&k===5){const b=BasicTroops.combatStats('槍',12);Object.assign(e,b,{type:'將',name:'黃巾頭目',hp:Math.round(b.hp*1.3),atk:b.atk*1.1,foodValue:8,settlementXP:3});}
 if(name){const level=stage==='brothers'?14:name==='張角'?17:16,stats=HeroCombat.encounter(name,{stars:1,level},w),magic=name!=='張梁';Object.assign(e,stats,{name,type:magic?'策':'將',atk:magic?stats.magicAttack:stats.atk,range:magic?3:1.6,speed:.75,yellowOfficer:name,foodValue:12,xp:60,settlementXP:6});}
 e.max=e.hp;
}};
