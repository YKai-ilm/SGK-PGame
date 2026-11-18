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
c.elapsed=0;c.roster={};c.letterMorale=()=>0;c.letterHit=()=>{};c.mark=()=>{};
vm.runInNewContext(fs.readFileSync('角色戰鬥.js','utf8').split(/\r?\n/).find(l=>l.startsWith('function hurt(')),c);
state.equipment.story.items.push({id:'a',name:'百鍊戰甲',slot:'armor'});state.equipment.story.loadouts.劉備.armor='a';
for(const [name,haste,hpRate,defRate,mdefRate,power] of [['絕影',.08,0,.42,.42,110],['白鵠',.08,.12,.08,0,107],['驚帆',.14,0,.5,0,108]]){
 state.equipment.story.items[0].name=name;E.reset();const u=E.apply(make());assert.equal(u.def,50*(1+defRate)+275);assert.equal(u.mdef,50*(1+mdefRate)+83);assert.equal(u.interval,2/(1+haste));assert.equal(u.max,Math.round(1000*(1+hpRate))+500);assert.equal(S.power({slot:'mount',name}),power);
 const mounts=E.saveMounts(),armors=E.saveArmors(),before=JSON.stringify(u);E.load({劉備:500});E.loadWeapons({劉備:{physical:20}});E.loadArmors(armors);E.loadMounts(mounts);E.apply(u);assert.equal(JSON.stringify(u),before);assert(E.validMountUnit(u,mounts));
 for(const field of ['equipmentDefRate',...(mdefRate?['equipmentMdefRate']:[])]){assert(!E.validMountUnit({...u,[field]:.99},mounts));const broken={...u};delete broken[field];assert(!E.validMountUnit(broken,mounts));}
 for(const magic of [false,true]){const target={...u,hp:10000,max:10000};c.hurt(target,600,magic,null);assert(Math.abs(10000-target.hp-600*100/(100+(magic?u.mdef:u.def)))<1e-9);}
 const fixed={...u,hp:10000};c.hurt(fixed,600,false,null,true);assert.equal(fixed.hp,9400);
 for(let i=0;i<20;i++){u.max=E.growHP(u);E.apply(u);assert.equal(u.def,50*(1+defRate)+275);assert.equal(u.mdef,50*(1+mdefRate)+83);}
 assert.equal(E.apply({...make(),hero:false}).def,50);assert.equal(E.apply({...make(),enemy:true}).def,50);
}
console.log('PASS mixed and named mounts: fixed gear excluded, growth, actual damage, scoring, snapshots, malformed fields and legacy mounts');
