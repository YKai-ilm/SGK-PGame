const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let state={mode:'story',unlocks:{story:{heroes:['劉備']}},equipment:{story:{items:[{id:'m',name:'青鬃馬',slot:'mount'},{id:'n',name:'金項鍊',slot:'accessory'},{id:'w',name:'新兵木劍',slot:'weapon',weaponType:'sword'}],loadouts:{劉備:{mount:'m',accessory:'n',weapon:'w'}}}}};
const c={window:{},URLSearchParams,location:{search:''},localStorage:{getItem:()=>JSON.stringify(state)}};
for(const f of ['測試角色.js','武將戰鬥能力資料.js','武將戰鬥換算.js','武將裝備.js','裝備戰鬥.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);
const E=c.window.EquipmentBattle,S=c.window.EquipmentSystem,H=c.window.HeroCombat;
const make=()=>({type:'劉備',hero:true,hp:800,max:1000,atk:100,physicalRatio:2,magicRatio:3,supportRatio:1,interval:2,def:50,mdef:50});
E.reset();const u=E.apply(make());assert.equal(u.max,1550);assert.equal(u.hp,1350);E.apply(u);assert.equal(u.max,1550);assert.equal(u.hp,1350);
let base=1000;for(let i=0;i<30;i++){base=Math.round(base*1.12);u.max=E.growHP(u);assert.equal(u.max,Math.round(base*1.05)+500);}
const saved=E.saveMounts();assert(E.validMountUnit(u,saved));E.load({劉備:500});E.loadMounts(saved);assert.equal(E.apply(make()).max,1550);
for(const bad of [{...u,equipmentHPRate:.5},{...u,equipmentPhysicalRate:.1},{...u,equipmentHaste:undefined}])assert(!E.validMountUnit(bad,saved));
state.equipment.story.items[0].name='烏騅馬';E.reset();const v=E.apply(make());assert.equal(v.max,1500);assert(Math.abs(H.power(v)-240)<1e-10);assert.equal(H.power(v,true),300);assert.equal(H.power(v,false,false),200);assert.equal(H.support(v),120);E.apply(v);assert(Math.abs(H.power(v)-240)<1e-10);
v.equipmentPhysical=1200;assert(Math.abs(H.power(v)-1420)<1e-10);v.atk*=1.09;assert(Math.abs(H.power(v)-(109*2*1.1+1200))<1e-10);
for(const name of ['青鬃馬','烏騅馬'])assert.equal(S.power({slot:'mount',name}),45);
assert.match(S.effectText({slot:'mount',name:'青鬃馬'}),/最大生命＋5%/);assert.match(S.effectText({slot:'mount',name:'烏騅馬'}),/物攻＋10%/);
E.load({});E.loadMounts({劉備:{haste:.03}});assert.equal(E.apply(make()).interval,2/1.03);E.loadMounts();assert.equal(E.apply(make()).interval,2);
for(const [name,haste,hpRate,physicalRate,power] of [['汗血寶馬',.12,.10,0,110],['赤兔馬',.10,0,.24,110],['的盧',.06,.20,0,128],['烏雲踏雪',.08,.10,.10,117]]){
 state.equipment.story.items[0].name=name;E.reset();const horse=E.apply(make());assert.equal(horse.interval,2/(1+haste));assert.equal(horse.max,Math.round(1000*(1+hpRate))+500);assert(Math.abs(H.power(horse)-(200*(1+physicalRate)+20))<1e-10);assert.equal(H.power(horse,true),300);assert.equal(H.support(horse),120);assert.equal(S.power({slot:'mount',name}),power);
 const snapshot=E.saveMounts(),before=JSON.stringify(horse);assert(E.validMounts(snapshot));assert(E.validMountUnit(horse,snapshot));E.load({劉備:500});E.loadWeapons({劉備:{physical:20}});E.loadMounts(snapshot);E.apply(horse);assert.equal(JSON.stringify(horse),before);assert.equal(JSON.stringify(E.apply(make())),before);
 for(const field of ['equipmentHaste',...(hpRate?['equipmentHPRate']:[]),...(physicalRate?['equipmentPhysicalRate']:[])]){const incomplete={...horse};delete incomplete[field];assert(!E.validMountUnit(incomplete,snapshot));assert(!E.validMountUnit({...horse,[field]:.99},snapshot));}
 let base=1000;for(let i=0;i<30;i++){base=Math.round(base*1.12);horse.max=E.growHP(horse);assert.equal(horse.max,Math.round(base*(1+hpRate))+500);}
}
console.log('PASS mixed and named mounts: fixed gear excluded, 30 level-ups, scoring, snapshots, malformed fields and legacy mounts');
