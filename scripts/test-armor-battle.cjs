const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let state={mode:'story',unlocks:{story:{heroes:['劉備','關羽']},battle:{heroes:['劉備']}},equipment:{story:{items:[{id:'a',name:'布衣',slot:'armor'}],loadouts:{劉備:{armor:'a'}}},battle:{items:[],loadouts:{}}}};
const c={window:{TestRoster:{劉備:{},關羽:{}}},URLSearchParams,location:{search:''},localStorage:{getItem:()=>JSON.stringify(state)}};
for(const file of ['武將裝備.js','裝備戰鬥.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),c);
const E=c.window.EquipmentBattle,S=c.window.EquipmentSystem,unit=()=>({type:'劉備',hero:true,hp:1000,max:1000,def:50,mdef:50});
assert.equal(S.armorCatalog.length,32);assert.equal(new Set(S.armorCatalog.map(a=>a.name)).size,32);
for(const a of S.armorCatalog){state.equipment.story.items[0].name=a.name;E.reset();const u=E.apply(unit());assert.equal(u.def,50+a.def);assert.equal(u.mdef,50+a.mdef);E.apply(u);assert.equal(u.def,50+a.def);assert.equal(u.max,1000);assert.equal(S.power(state.equipment.story.items[0]),S.scoreStats(S.ratedStats(state.equipment.story.items[0])));assert.equal(S.typeText(state.equipment.story.items[0]),'防具/'+a.type);
 const snap=E.saveArmors();assert(E.validArmors(snap));assert(E.validArmorUnit(u,snap));snap.劉備.def=999;assert(!E.validArmors(snap));assert.equal(E.saveArmors().劉備.def,a.def);
 const saved=E.saveArmors();E.load({});E.loadArmors(saved);const restored=E.apply(JSON.parse(JSON.stringify(u)));assert.equal(restored.def,u.def);assert.equal(E.apply(unit()).mdef,50+a.mdef);
 assert(!E.validArmorUnit({...u,equipmentDef:a.def+1},saved));assert(!E.validArmorUnit({...u,enemy:true},saved));assert(!E.validArmorUnit({...u,equipmentMdef:undefined},saved));
}
assert.equal(S.power({name:'護心甲',slot:'armor'}),342);assert.deepEqual(JSON.parse(JSON.stringify(S.effects({name:'護心甲',slot:'armor'}))),{def:200,mdef:70});
// The new armor sits between existing orange heavy armors for either damage type.
for(const key of ['def','mdef']){const armor=n=>S.effects({name:n,slot:'armor'})[key];const damage=n=>1000*100/(150+armor(n));assert(damage('精鋼甲')>damage('護心甲'));assert(damage('護心甲')>damage('百鍊戰甲'));}
state.equipment.story.items[0].name='布衣';E.reset();const early=E.apply(unit());E.load({});E.loadArmors(undefined);assert.equal(E.apply(unit()).def,50);assert(E.validArmorUnit(unit(),undefined));assert(!E.validArmorUnit(early,undefined));
state.mode='battle';E.reset();assert.equal(E.apply(unit()).def,50);c.location.search='?storySweep=1';E.reset();assert.equal(E.apply(unit()).def,58);
state.equipment.story.loadouts.關羽={armor:'a'};E.reset();assert.equal(Object.keys(E.saveArmors()).length,1);
assert.equal(E.apply({...unit(),hero:false}).def,50);assert.equal(E.apply({...unit(),enemy:true}).def,50);
c.window.TutorialBattleConfig={};E.reset();assert.equal(E.apply(unit()).def,50);
assert.equal(S.effects({name:'未知甲',slot:'armor'}),null);assert(!E.validArmors({劉備:{def:275,mdef:49}}));
for(const bad of [null,[],{不存在:{def:8,mdef:8}},{劉備:{def:8,mdef:9}},{劉備:{def:8,mdef:8,hp:1}},{劉備:{def:-1,mdef:8}}])assert(!E.validArmors(bad));
assert.equal(S.effects({name:'布衣',slot:'accessory'}),null);
console.log('PASS 32 armor effects, power, fixed application, immutable snapshots, legacy saves, mode isolation, duplicate ownership and pending special armor');

const high=[{"name":"無雙戰鎧","quality":"紅","type":"重甲","def":425,"mdef":128},{"name":"紫綬仙衣","quality":"紅","type":"法袍","def":128,"mdef":425},{"name":"霸王吞雲鎧","quality":"金","type":"重甲","def":622,"mdef":187},{"name":"龍膽銀鱗甲","quality":"金","type":"輕甲","def":319,"mdef":319},{"name":"麒麟聖鎧","quality":"紫金","type":"輕甲","def":450,"mdef":450},{"name":"太極仙衣","quality":"紫金","type":"法袍","def":270,"mdef":899}];const guide=fs.readFileSync('裝備道具建議清單.html','utf8');for(const a of high){assert.deepEqual(JSON.parse(JSON.stringify(S.armorCatalog.find(x=>x.name===a.name))),a);assert(guide.includes('<td>'+a.name+'</td>'));const score=S.power({name:a.name,slot:'armor'}),target=S.scoreStats({physical:{紅:600,金:850,紫金:1200}[a.quality]});assert(Math.abs(score-target)<=1);assert.deepEqual(JSON.parse(JSON.stringify(S.effects({name:a.name,slot:'armor'}))),{def:a.def,mdef:a.mdef});}console.log('PASS six named high armors, approved stats, same-tier power and no unapproved special effects');

assert.equal(S.power({name:'飛龍道袍',slot:'armor'}),582);state.mode='story';delete c.window.TutorialBattleConfig;state.equipment.story.loadouts={劉備:{armor:'a'}};state.equipment.story.items[0].name='飛龍道袍';E.reset();const flying=E.apply(unit()),flyingSave=E.saveArmors();assert.equal(flying.equipmentArmorDodge,.1);assert(E.validArmorUnit(flying,flyingSave));assert(!E.validArmorUnit({...flying,equipmentArmorDodge:undefined},flyingSave));assert(!E.validArmorUnit({...flying,equipmentArmorDodge:.2},flyingSave));assert(!E.validArmorUnit({...unit(),equipmentArmorDodge:.1},{}));assert.equal(E.apply(flying).equipmentArmorDodge,.1);console.log('PASS flying robe stat budget, unique dodge field, snapshot validation and idempotence');

state.equipment.story.items[0].name='鯤鵬鶴氅';E.reset();const kunpeng=E.apply(unit()),kunpengSave=E.saveArmors();assert.equal(kunpeng.equipmentArmorMagic,120);assert(E.validArmorUnit(kunpeng,kunpengSave));assert(!E.validArmorUnit({...kunpeng,equipmentArmorMagic:undefined},kunpengSave));assert(!E.validArmorUnit({...kunpeng,equipmentArmorMagic:121},kunpengSave));assert(!E.validArmorUnit({...unit(),equipmentArmorMagic:120},{}));assert.equal(S.power({name:'鯤鵬鶴氅',slot:'armor'}),768);assert.equal(S.compare({name:'鯤鵬鶴氅',slot:'armor'},{name:'龍膽銀鱗甲',slot:'armor'}).delta,0);assert.equal(E.apply(kunpeng).equipmentArmorMagic,120);console.log('PASS Kunpeng hybrid power, exact snapshot stats and one-time application');
