const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),c={window:{}};vm.runInNewContext(fs.readFileSync('武將裝備.js','utf8'),c);const S=c.window.EquipmentSystem,b=S.mountRatingReference,near=(a,z)=>assert(Math.abs(a-z)<1e-8);
// Percentage and fixed additions must receive the same rating when their actual contribution is equal.
for(const [rate,stat]of [['hpRate','hp'],['physicalRate','physical'],['magicRate','magic'],['defRate','def'],['mdefRate','mdef'],['supportRate','support']])for(const pct of [.05,.1,.2]){
 const converted=S.mountRatedStats({[rate]:pct});near(converted[stat],b[stat]*pct);assert.equal(S.scoreStats(converted),S.scoreStats({[stat]:b[stat]*pct}));
}
const haste=S.mountRatedStats({haste:.1});near(haste.physical,b.physical*.1);near(haste.magic,b.magic*.1);assert.equal(haste.support,0);
const combo=S.mountRatedStats({physicalRate:.24,haste:.1});near(combo.physical,b.physical*(1.24*1.1-1));near(combo.magic,b.magic*.1);
const support=S.mountRatedStats({supportRate:.3,haste:.08});near(support.support,b.support*.3);
const evade=S.mountRatedStats({basicDodge:.1});near(evade.hp,b.hp*(1/.9-1));
const small={...b,hp:2000,physical:200,magic:200,support:150};assert(S.scoreStats(S.mountRatedStats({hpRate:.2},b))>S.scoreStats(S.mountRatedStats({hpRate:.2},small)));assert.equal(S.mountRatedStats({defRate:.42},small).def,S.mountRatedStats({defRate:.42},b).def);
for(const m of S.mountCatalog){assert.equal(S.power({name:m.name,slot:'mount'}),S.scoreStats(S.mountRatedStats(m)));assert.deepEqual(JSON.parse(JSON.stringify(S.effects({name:m.name,slot:'mount'}))),Object.fromEntries(Object.entries(m).filter(([k])=>k!=='name')));const html=fs.readFileSync('裝備道具建議清單.html','utf8');assert(new RegExp('<td>'+m.name+'</td><td>[^<]*</td><td>'+S.power({name:m.name,slot:'mount'})+'</td>').test(html),m.name);}
assert.equal(S.power({name:'金項鍊',slot:'accessory'}),61);assert.equal(S.power({name:'武力指環',slot:'accessory'}),140);assert.equal(S.power({name:'新兵木劍',slot:'weapon',weaponType:'sword'}),25);
console.log('PASS common fixed/percentage equivalence, growth reference, haste/support isolation, unchanged effects, and handbook scores');
