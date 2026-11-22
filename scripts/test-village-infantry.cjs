const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c={};c.window=c;c.VillageSweep={waves:6,encounterId:'rabble',rewardVersion:3,combatVersion:5};vm.createContext(c);vm.runInContext(fs.readFileSync('桃源黃巾.js','utf8'),c);
const E=c.YellowTurbanEncounter;
for(let w=1;w<=6;w++)for(let k=0;k<6+w;k++){const u={};E.apply(u,w,k);const ratio=u.type==='弓'?.7:u.type==='槍'?.85:1;assert.equal(u.hp,Math.round((270+w*35)*ratio));assert.equal(u.max,u.hp);assert.equal(u.atk,22+w*3);assert.equal(u.settlementXP,1);assert.equal(u.foodValue,4);}
c.VillageSweep.combatVersion=4;const old={};E.apply(old,1,0);assert.equal(old.hp,118);assert.equal(old.atk,17);
for(const encounterId of ['deng','cheng']){c.VillageSweep={...c.VillageSweep,combatVersion:5,encounterId,enemyOfficer:{name:encounterId==='deng'?'鄧茂':'程遠志',hp:1600,atk:180}};const u={};E.apply(u,6,11);assert.equal(u.hp,1600);assert.equal(u.atk,180);assert.equal(u.type,'將');}
console.log('PASS village infantry across six waves, unchanged XP/food, legacy combat values and officer snapshots');

for(const f of ['測試角色.js','基礎兵種養成.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
c.VillageSweep={waves:6,encounterId:'rabble',rewardVersion:3,combatVersion:7};
for(const type of ['刀','槍','弓'])for(const level of [1,2,10,50,100]){const stats=c.BasicTroops.combatStats(type,level),own=c.BasicTroops.apply({type},{[type]:{level,xp:0}});for(const k of ['hp','atk','def','mdef','range','interval','kind','group','level','quality'])assert.equal(own[k],stats[k]);}
for(let w=1;w<=6;w++)for(let k=0;k<E.waveCount(w);k++){const e={};E.apply(e,w,k);const own=c.BasicTroops.apply({type:e.type},{});for(const field of ['hp','atk','def','mdef','range','interval','kind','group','level','quality'])assert.equal(e[field],own[field]);assert.equal(e.max,own.max);}
assert.equal(Array.from({length:6},(_,i)=>E.waveCount(i+1)).join(','),'7,8,9,10,11,12');assert.equal(E.waveCount(6,5),12);assert.equal(E.waveCount(6,6),6);
for(const waves of [1,3,6])for(const encounterId of ['deng','cheng']){c.VillageSweep={waves,encounterId,rewardVersion:3,combatVersion:7,enemyOfficer:{name:encounterId==='deng'?'鄧茂':'程遠志',hp:1600,atk:180}};for(let k=0;k<E.waveCount(waves);k++){const e={};E.apply(e,waves,k);assert.equal(e.type==='將',k===E.waveCount(waves)-1);}}
console.log('PASS shared enemy/friendly combat stats, explicit level-1 enemies, new wave sizes and last-slot leaders for every encounter length');
