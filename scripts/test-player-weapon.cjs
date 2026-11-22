const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let state={mode:'story',tutorial:{status:'completed'}};
const c={crypto:require('node:crypto').webcrypto,URLSearchParams,location:{search:''},localStorage:{getItem:()=>JSON.stringify(state)}};c.window=c;vm.createContext(c);
for(const f of ['測試角色.js','武將戰鬥能力資料.js','武將戰鬥換算.js','武將裝備.js','玩家武將.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const P=c.PlayerOfficer,E=c.EquipmentSystem,all=[...E.weaponCatalog,...E.namedWeaponCatalog];
P.create(state,'測試將','全能');P.register(state);vm.runInContext(fs.readFileSync('玩家戰場.js','utf8'),c);
const B=c.PlayerBattle,normal=JSON.stringify(c.TestRoster.劉備);
function equip(entry){state.equipment={story:{items:entry?[{id:'test',name:entry.name,slot:'weapon',weaponType:entry.type}]:[],loadouts:{測試將:{weapon:'test'}}},battle:{items:[],loadouts:{}}};}
for(const style of Object.keys(P.styles)){
 state.playerOfficer.style=style;P.register(state); // initialize this style's immutable battle identity
 vm.runInContext(fs.readFileSync('玩家戰場.js','utf8'),c);const b=c.PlayerBattle;
 const base=JSON.parse(JSON.stringify(c.TestRoster.測試將));
 for(const e of all){equip(e);b.reset();const d=c.TestRoster.測試將,p=b.profile({name:e.name,type:e.type});assert.equal(d.kind,p.kind,e.name);assert.equal(d.range,p.range);assert.equal(d.group,p.group);assert.equal(d.atk,base.atk);assert.equal(d.interval,base.interval);assert.equal(JSON.stringify(d.skills),JSON.stringify(base.skills));
 const saved=b.save();assert(b.valid(saved));const u={...d,type:'測試將',hero:true,enemy:false};assert(b.validUnit(u,saved));assert(!b.validUnit({...u,kind:'stone'},saved));assert(!b.validUnit({...u,playerWeaponType:undefined},saved));
 equip(null);b.load(saved);assert.equal(c.TestRoster.測試將.playerWeaponType,p.playerWeaponType);b.reset();assert.equal(c.TestRoster.測試將.kind,base.kind);assert.equal(c.TestRoster.測試將.playerWeaponType,undefined);
 }
 equip(all.find(e=>e.type==='bow'));state.mode='battle';b.reset();assert.equal(b.save().weapon,null);c.location.search='?storySweep=1';b.reset();assert.equal(b.save().weapon.type,'bow');c.location.search='';state.mode='story';
 const old=b.save();delete old.weapon;b.load(old);assert.equal(c.TestRoster.測試將.kind,base.kind);assert(b.validUnit({type:'測試將'},old));
}
assert.equal(JSON.stringify(c.TestRoster.劉備),normal);assert(!B.validWeapon({name:'不存在',type:'bow'}));assert(!B.validUnit(null,null));
console.log('PASS all catalog weapons x five player styles, attack/range, unchanged skills and speed, snapshot restore, old saves, modes and ordinary heroes');
