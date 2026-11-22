const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c={};c.window=c;vm.createContext(c);for(const f of ['武將戰鬥能力資料.js','武將戰鬥換算.js','測試角色.js','基礎兵種養成.js','桃源黃巾.js','宛城戰鬥配置.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const E=c.YellowTurbanEncounter;
const levels={'grain-rescue':[2,2,3],'grain-camp':[2,2,3,3,4],'yellow-outpost':[3,3,4,4,5,5],'yellow-hq':[4,4,5,5,6,6],'han-relief':[4,4,5,5],'han-fire':[4,4,5,5,6,6],'han-wancheng':[5,5,6,6,7,7]};
for(const [mission,list]of Object.entries(levels)){c.VillageSweep={mission,waves:list.length,combatVersion:9};for(let i=0;i<list.length;i++)for(const type of ['刀','槍','弓']){assert.equal(E.infantryLevel(i+1),list[i]);const e={type};E.sharedInfantry(e,i+1);const stats=c.BasicTroops.combatStats(type,list[i]);for(const key of ['hp','atk','def','mdef','range','interval','quality','level'])assert.equal(e[key],stats[key]);}}
for(const [waves,list,bossLevel]of [[1,[1],2],[3,[1,1,2],3],[6,[1,1,2,2,3,3],4]]){c.VillageSweep={waves,combatVersion:9};list.forEach((l,i)=>assert.equal(E.infantryLevel(i+1),l));assert.equal(E.officerLevel('鄧茂'),bossLevel);}
for(const [mission,name,level]of [['grain-camp','鄧茂',5],['yellow-outpost','鄧茂',6],['yellow-hq','程遠志',7]]){c.VillageSweep={mission,combatVersion:9};const e={};E.storyOfficer(e,name,6);assert.equal(e.level,level);assert.equal(e.atk,c.HeroCombat.encounter(name,{level,stars:1}).atk);}
for(const route of ['letter','direct']){c.VillageSweep={mission:'han-wancheng',waves:6,combatVersion:9};c.HanBattle={kind:'wancheng',battleRoute:route};for(const stage of ['han','zhang'])for(let w=1;w<=6;w++)for(let k=0;k<8;k++){const e={};c.WanCombat.apply(e,w,k,route,stage);const extra=route==='direct'?1:0;if(e.type==='將'){const level=(e.name==='張寶'?9:8)+extra,stats=c.HeroCombat.encounter(e.name,{level,stars:1});assert.equal(e.level,level);assert.equal(e.hp,stats.hp);assert.equal(e.atk,stats.atk);}else{const stats=c.BasicTroops.combatStats(e.type,levels['han-wancheng'][w-1]+extra);assert.equal(e.hp,stats.hp);assert.equal(e.atk,stats.atk);assert.equal(e.def,stats.def);}assert.equal(e.max,e.hp);}}
// The new runtime must still reproduce old tenfold routes when restoring them.
for(const version of [4,7,8]){c.VillageSweep={mission:'han-wancheng',waves:6,combatVersion:version};for(const stage of ['han','zhang'])for(let k=0;k<8;k++){const a={},b={};c.WanCombat.apply(a,6,k,'letter',stage);c.WanCombat.apply(b,6,k,'direct',stage);assert.equal(b.hp,a.hp*10);assert.equal(b.atk,a.atk*10);}}
console.log('PASS explicit chapter phases, short sweeps, shared troop growth, independent officer levels, elite route without stacked multipliers, legacy 10x preservation');
// Current strong assault deliberately multiplies the same baseline by ten.
c.VillageSweep={mission:'han-wancheng',waves:6,combatVersion:10};
for(const stage of ['han','zhang'])for(let w=1;w<=6;w++)for(let k=0;k<8;k++){
 const a={},b={};c.HanBattle={kind:'wancheng',battleRoute:'letter'};c.WanCombat.apply(a,w,k,'letter',stage);
 c.HanBattle.battleRoute='direct';c.WanCombat.apply(b,w,k,'direct',stage);
 assert.equal(b.hp,a.hp*10);assert.equal(b.max,b.hp);assert.equal(b.atk,a.atk*10);
 for(const key of ['level','stars','quality','def','mdef','interval','speed','name','type','enemySkill','xp','settlementXP','foodValue'])assert.equal(b[key],a[key]);
}
console.log('PASS current assault: exactly 10x HP/attack for every soldier/captain/officer in both battles, no additional level bonus or reward changes');
