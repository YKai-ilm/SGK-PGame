const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');let state={mode:'story',unlocks:{story:{heroes:['劉備','關羽']},battle:{heroes:['劉備']}},equipment:{story:{items:[{id:'m',name:'驛馬',slot:'mount'}],loadouts:{劉備:{mount:'m'}}},battle:{items:[],loadouts:{}}}};
const c={window:{TestRoster:{劉備:{},關羽:{}}},URLSearchParams,location:{search:''},localStorage:{getItem:()=>JSON.stringify(state)},elapsed:10};for(const f of ['武將裝備.js','裝備戰鬥.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);
const E=c.window.EquipmentBattle,S=c.window.EquipmentSystem,unit=()=>({type:'劉備',hero:true,hp:1000,max:1000,def:50,mdef:50,interval:2,cool:[20,30],speed:1});
vm.runInNewContext(fs.readFileSync('角色戰鬥.js','utf8').split(/\r?\n/).find(l=>l.startsWith('function basicInterval(')),c);
for(const [name,h] of [['驛馬',.03],['良馬',.05],['戰馬',.08]]){state.equipment.story.items[0].name=name;E.reset();const u=E.apply(unit());assert.equal(u.interval,2/(1+h));assert.equal(S.effects(state.equipment.story.items[0]).haste,h);assert.equal(S.power(state.equipment.story.items[0]),S.scoreStats({haste:h}));assert.equal(u.speed,1);assert.deepEqual(u.cool,[20,30]);E.apply(u);assert.equal(u.interval,2/(1+h));
 assert.equal(c.basicInterval({...u,attackSlow:20}),u.interval*1.54);assert.equal(c.basicInterval({...u,clearTone:20}),u.interval/1.2);
 const saved=E.saveMounts();assert(E.validMounts(saved));assert(E.validMountUnit(u,saved));saved.劉備.haste=999;assert(!E.validMounts(saved));assert.equal(E.saveMounts().劉備.haste,h);
 const good=E.saveMounts();E.load({});E.loadMounts(good);assert.equal(E.apply(JSON.parse(JSON.stringify(u))).interval,u.interval);assert.equal(E.apply(unit()).interval,u.interval);assert(!E.validMountUnit({...u,enemy:true},good));assert(!E.validMountUnit({...u,equipmentHaste:999},good));
}
E.load({});E.loadMounts();assert.equal(E.apply(unit()).interval,2);assert(E.validMountUnit(unit()));state.mode='battle';E.reset();assert.equal(E.apply(unit()).interval,2);c.location.search='?storySweep=1';E.reset();assert.equal(E.apply(unit()).interval,2/1.08);assert.equal(E.apply({...unit(),hero:false}).interval,2);assert.equal(E.apply({...unit(),enemy:true}).interval,2);
state.equipment.story.loadouts.關羽={mount:'m'};E.reset();assert.equal(Object.keys(E.saveMounts()).length,1);c.window.TutorialBattleConfig={};E.reset();assert.equal(E.apply(unit()).interval,2);
for(const name of ['燎原火','照夜玉獅子'])assert.equal(S.effects({slot:'mount',name}),null);
for(const bad of [null,[],{不存在:{haste:.03}},{劉備:{haste:.04}},{劉備:{haste:.03,hp:2}}])assert(!E.validMounts(bad));
console.log('PASS mount haste and power, no cooldown/movement changes, haste/slow stacking, snapshots, old saves and mode isolation');
