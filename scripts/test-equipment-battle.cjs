const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let state={mode:'story',unlocks:{story:{heroes:['劉備','關羽']},battle:{heroes:['劉備']}},equipment:{story:{items:[{id:'gold',name:'金項鍊',slot:'accessory'}],loadouts:{劉備:{accessory:'gold'}}},battle:{items:[{id:'silver',name:'銀項鍊',slot:'accessory'}],loadouts:{劉備:{accessory:'silver'}}}}};
const c={window:{TestRoster:{劉備:{},關羽:{}}},URLSearchParams,location:{search:''},localStorage:{getItem:()=>JSON.stringify(state)}};
for(const f of ['武將裝備.js','裝備戰鬥.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);
const E=c.window.EquipmentBattle,S=c.window.EquipmentSystem,unit=()=>({type:'劉備',hero:true,hp:1000,max:1000});
for(const [name,hp] of [['青銅項鍊',100],['銀項鍊',250],['金項鍊',500]])assert.equal(S.effects({name,slot:'accessory'}).hp,hp);
assert.equal(S.effects({name:'金項鍊',slot:'weapon'}),null);
assert.equal(S.effects({name:'新兵木劍',slot:'weapon'}),null);
assert.equal(S.effects({name:'新兵木劍',slot:'weapon',weaponType:'sword'}).physical,20);
E.reset();let u=E.apply(unit());assert.equal(u.max,1500);E.apply(u);assert.equal(u.max,1500);
let base=1000;for(let i=0;i<10;i++){base=Math.round(base*1.12);u.max=E.growHP(u);assert.equal(u.max,base+500);}
assert.equal(E.apply({...unit(),hero:false}).max,1000);assert.equal(E.apply({...unit(),enemy:true}).max,1000);
const snapshot=E.save();state.equipment.story.loadouts={};E.reset();assert.equal(E.apply(unit()).max,1000);
E.load(snapshot);assert.equal(E.apply(unit()).max,1500);E.load();assert.equal(E.apply(unit()).max,1000);
state.mode='battle';E.reset();assert.equal(E.apply(unit()).max,1250);
c.location.search='?storySweep=1';E.reset();assert.equal(E.apply(unit()).max,1000);
state.equipment.story.loadouts={劉備:{accessory:'gold'},關羽:{accessory:'gold'}};E.reset();assert.equal(Object.keys(E.save()).length,1);
c.window.TutorialBattleConfig={};E.reset();assert.equal(E.apply(unit()).max,1000);
for(const invalid of [null,[],{劉備:151},{不存在:150}])assert.equal(E.valid(invalid),false);
delete c.window.TutorialBattleConfig;state.mode='story';state.equipment.story.items.push({id:'mount',name:'的盧',slot:'mount'});state.equipment.story.loadouts={劉備:{accessory:'gold',mount:'mount'}};
for(const [name,hp,power]of [['青銅項鍊',100,12],['銀項鍊',250,31],['金項鍊',500,61],['翡翠項鍊',1000,118],['白玉項鍊',2500,275],['龍紋項鍊',5000,500],['麒麟項鍊',8000,732]]){
 state.equipment.story.items[0].name=name;E.reset();const u=E.apply({...unit(),hp:700,interval:2});assert.equal(u.max,1200+hp);assert.equal(u.hp,900+hp);assert.equal(S.power({name,slot:'accessory'}),power);assert.equal(S.typeText({name,slot:'accessory'}),'飾品/項鍊');assert.equal(S.validNecklaceHP(hp),true);
 const before=JSON.stringify(u),save=E.save(),mount=E.saveMounts();assert(E.valid(save));E.apply(u);assert.equal(JSON.stringify(u),before);E.load(save);E.loadMounts(mount);E.apply(u);assert.equal(JSON.stringify(u),before);
 let base=1000;for(let i=0;i<30;i++){base=Math.round(base*1.12);u.max=E.growHP(u);assert.equal(u.max,Math.round(base*1.2)+hp);}
 assert.equal(S.effects({name,slot:'weapon'}),null);assert.equal(S.compare({name,slot:'accessory'},{name:'金項鍊',slot:'accessory'}).delta,power-61);
}
for(const hp of [0,-1,999,1001,Infinity,'8000'])assert(!S.validNecklaceHP(hp));
console.log('PASS seven necklaces: fixed life, mount isolation, 30 levels, power deltas, snapshots, modes and legacy saves');
