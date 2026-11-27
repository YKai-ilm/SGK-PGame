'use strict';
window.DongReliefCombat={apply(e,w,k){
 const type=w<=2?(k%2?'槍':'刀'):w<=4?(k%3===0?'弓':k%2?'槍':'刀'):(k%3===0?'弓':'槍'),level=[8,8,9,9,10,10][w-1];
 const stats=BasicTroops.combatStats(type,level);Object.assign(e,stats,{type,name:w>=5&&type==='槍'?'董軍騎兵':'董軍'+type+'兵',speed:type==='刀'?.85:type==='槍'?.8:.75,infantryLevel:level,hp:stats.hp,max:stats.hp});
 if(w>=5&&type==='槍')e.speed*=1.12;
 if(w===6&&k>=5){const commander=k===7,b=BasicTroops.combatStats('槍',11),hp=Math.round(b.hp*(commander?1.6:1.3));Object.assign(e,b,{type:'將',name:commander?'追擊將領':'西涼頭目',hp,max:hp,atk:Math.round(b.atk*(commander?1.2:1.1)),foodValue:commander?18:12,xp:commander?100:60,settlementXP:commander?10:6});}
}};
