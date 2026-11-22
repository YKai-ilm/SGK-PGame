const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c={};c.window=c;c.VillageSweep={waves:6,encounterId:'rabble',rewardVersion:3,combatVersion:5};vm.createContext(c);vm.runInContext(fs.readFileSync('桃源黃巾.js','utf8'),c);
const E=c.YellowTurbanEncounter;
for(let w=1;w<=6;w++)for(let k=0;k<6+w;k++){const u={};E.apply(u,w,k);const ratio=u.type==='弓'?.7:u.type==='槍'?.85:1;assert.equal(u.hp,Math.round((270+w*35)*ratio));assert.equal(u.max,u.hp);assert.equal(u.atk,22+w*3);assert.equal(u.settlementXP,1);assert.equal(u.foodValue,4);}
c.VillageSweep.combatVersion=4;const old={};E.apply(old,1,0);assert.equal(old.hp,118);assert.equal(old.atk,17);
for(const encounterId of ['deng','cheng']){c.VillageSweep={...c.VillageSweep,combatVersion:5,encounterId,enemyOfficer:{name:encounterId==='deng'?'鄧茂':'程遠志',hp:1600,atk:180}};const u={};E.apply(u,6,11);assert.equal(u.hp,1600);assert.equal(u.atk,180);assert.equal(u.type,'將');}
console.log('PASS village infantry across six waves, unchanged XP/food, legacy combat values and officer snapshots');
