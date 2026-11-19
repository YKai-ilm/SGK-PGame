const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),c={window:{}};
vm.runInNewContext(fs.readFileSync('武將裝備.js','utf8'),c);
const E=c.window.EquipmentSystem,S=E.scoreStats;
assert.equal(S({}),0);assert.equal(S({physical:120}),140);assert.equal(S({magic:120}),140);assert.equal(S({physical:60,magic:60}),140);
assert.equal(S({def:45,mdef:45}),140);
for(const key of ['hp','physical','magic','def','mdef','haste','support']){let last=-1;for(let i=0;i<100;i++){const x=S({[key]:key==='haste'?i/100:i*10});assert(x>=last);last=x;}}
assert.equal(S({support:60,haste:.08}),Math.round(1000*(Math.sqrt(1.08+.15)-1)));
assert(S({hp:2000,def:100})>S({hp:2000})+S({def:100}),'HP and defense interact');
assert(S({physical:200,haste:.5})>S({physical:200})+S({haste:.5}),'attack and haste interact');
for(const bad of [null,[],{hp:-1},{hp:Infinity},{physical:NaN},{heal:10},{hp:'100'}])assert.equal(S(bad),null);
const item=name=>({name,slot:'accessory'});
assert.equal(E.power(item('金項鍊')),61);assert.equal(E.power(item('銀項鍊')),31);assert.equal(E.power(item('青銅項鍊')),12);
assert.equal(E.compare(item('金項鍊'),item('銀項鍊')).delta,30);assert.equal(E.compare(item('銀項鍊'),item('金項鍊')).delta,-30);assert.equal(E.compare(item('金項鍊'),item('金項鍊')).delta,0);
assert.equal(E.power({...item('金項鍊'),combatPower:999999}),61,'saved manual score must not override formula');
assert.equal(E.power({name:'特殊未知',combatPower:999}),null);assert.equal(E.compare({},item('金項鍊')).delta,null);
assert.equal(E.power({name:'新兵木劍',slot:'weapon',weaponType:'sword'}),25);
assert.equal(E.power({name:'新兵木劍',slot:'accessory'}),null);
const balanced=[{physical:120},{magic:120},{physical:60,magic:60},{physical:80,def:25},{magic:80,mdef:25},{hp:825,def:25},{def:45,mdef:45},{hp:350,physical:55,mdef:15}];
for(const stats of balanced)assert(Math.abs(S(stats)-140)<=14);
// 同一裝備評分不隨持有人改變；實際普攻效益依攻擊類型而異。
for(const f of ['測試角色.js','武將戰鬥能力資料.js','武將戰鬥換算.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);
const scenarios=[];for(const [name,magic] of [['關羽',false],['張飛',false],['諸葛亮',true]]){const h=c.window.HeroCombat.stats(name),atk=magic?h.magic:h.physical;
 const single=(atk+120)/atk,dual=(atk+60)/atk;assert(single>dual);
 const before=.5*100/(100+h.def)+.5*100/(100+h.mdef),after=.5*100/(145+h.def)+.5*100/(145+h.mdef);
 assert(before/after>1);scenarios.push({name,singleAttackGain:((single-1)*100).toFixed(1)+'%',dualAttackGain:((dual-1)*100).toFixed(1)+'%',dualDefenseSurvivalGain:((before/after-1)*100).toFixed(1)+'%'});
}
console.log('PASS score v1: formulas, interactions, monotonicity, invalid values, authoritative catalog, signed comparisons and same-tier tolerance');console.log(scenarios);

for(const [catalog,slot]of [['weaponCatalog','weapon'],['namedWeaponCatalog','weapon'],['armorCatalog','armor'],['mountCatalog','mount'],['accessoryCatalog','accessory'],['necklaceCatalog','accessory']])for(const x of E[catalog]){const item={name:x.name,slot,weaponType:x.type};assert(E.effects(item),x.name);assert(Number.isFinite(E.power(item)),x.name);assert(!/undefined|NaN/.test(E.effectText(item)),x.name);if(slot==='mount'){assert(E.effectDetails(item).includes('不縮短技能冷卻'));assert(E.effectDetails(item).includes('下一場戰鬥'));}}
assert(E.effectDetails({slot:'accessory',name:'鷹眼佩'}).includes('每個受擊目標獨立判定'));assert.equal(E.effectDetails({slot:'mount',name:'不存在'}),'');
console.log('PASS full equipment catalog: effects, numeric power, clean display text and mount/critical details');
