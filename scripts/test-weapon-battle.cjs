const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let state={mode:'story',unlocks:{story:{heroes:['劉備','諸葛亮']},battle:{heroes:['劉備']}},equipment:{story:{items:[{id:'s',name:'新兵木劍',slot:'weapon',weaponType:'sword'},{id:'f',name:'白羽扇',slot:'weapon',weaponType:'fan'},{id:'n',name:'金項鍊',slot:'accessory'}],loadouts:{劉備:{weapon:'s',accessory:'n'},諸葛亮:{weapon:'f'}}},battle:{items:[],loadouts:{}}}};
const c={window:{},URLSearchParams,location:{search:''},localStorage:{getItem:()=>JSON.stringify(state)}};
for(const f of ['測試角色.js','武將戰鬥能力資料.js','武將戰鬥換算.js','武將裝備.js','裝備戰鬥.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);
const E=c.window.EquipmentBattle,H=c.window.HeroCombat,S=c.window.EquipmentSystem;
const make=name=>({...c.window.TestRoster[name],type:name,hero:true,max:c.window.TestRoster[name].hp});
E.reset();for(const [name,magic,bonus] of [['劉備',false,20],['諸葛亮',true,80]]){
 const u=make(name),base=H.power(u,magic),other=H.power(u,!magic),support=H.support(u);E.apply(u);E.apply(u);
 assert.equal(H.power(u,magic),base+bonus);assert.equal(H.power(u,!magic),other);assert.equal(H.support(u),support);assert.equal(H.power(u,magic,false),base);
 for(let i=0;i<15;i++){u.atk*=1.09;u.max=E.growHP(u);assert(Math.abs(H.power(u,magic)-H.power(u,magic,false)-bonus)<1e-8);}
}
const snapshot=E.saveWeapons();assert(E.validWeapons(snapshot));snapshot.劉備.physical=999;assert(!E.validWeapons(snapshot));assert.equal(E.saveWeapons().劉備.physical,20);
const good=E.saveWeapons();E.load({});assert.equal(H.power(E.apply(make('劉備'))),H.power(make('劉備')));E.loadWeapons(good);assert.equal(H.power(E.apply(make('劉備'))),H.power(make('劉備'))+20);
state.mode='battle';E.reset();assert.equal(H.power(E.apply(make('劉備'))),H.power(make('劉備')));
c.location.search='?storySweep=1';E.reset();assert.equal(H.power(E.apply(make('劉備'))),H.power(make('劉備'))+20);
c.window.TutorialBattleConfig={};E.reset();assert.equal(H.power(E.apply(make('劉備'))),H.power(make('劉備')));
assert.equal(S.typeText(state.equipment.story.items[0]),'武器/劍');assert.equal(S.typeText(state.equipment.story.items[2]),'飾品/項鍊');assert(!S.effectText(state.equipment.story.items[0]).includes('待接入'));
console.log('PASS weapon physical/magic effects, fan compatibility, fixed level bonuses, healing isolation, immutable snapshots, mode/tutorial isolation and compact labels');
