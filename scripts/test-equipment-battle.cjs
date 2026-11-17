const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let state={mode:'story',unlocks:{story:{heroes:['劉備','關羽']},battle:{heroes:['劉備']}},equipment:{story:{items:[{id:'gold',name:'金項鍊',slot:'accessory'}],loadouts:{劉備:{accessory:'gold'}}},battle:{items:[{id:'silver',name:'銀項鍊',slot:'accessory'}],loadouts:{劉備:{accessory:'silver'}}}}};
const c={window:{TestRoster:{劉備:{},關羽:{}}},URLSearchParams,location:{search:''},localStorage:{getItem:()=>JSON.stringify(state)}};
for(const f of ['武將裝備.js','裝備戰鬥.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);
const E=c.window.EquipmentBattle,S=c.window.EquipmentSystem,unit=()=>({type:'劉備',hero:true,hp:1000,max:1000});
for(const [name,hp] of [['青銅項鍊',100],['銀項鍊',250],['金項鍊',500]])assert.equal(S.effects({name,slot:'accessory'}).hp,hp);
assert.equal(S.effects({name:'金項鍊',slot:'weapon'}),null);
assert.equal(S.effects({name:'新兵木劍',slot:'weapon'}),null);
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
console.log('PASS equipment: approved effects, fixed level growth, no double application, modes, old saves, snapshots and tutorial isolation');
