const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const key='three-kingdoms-interface-preview-v1';
function fixture(initial,runId='battle-a'){
 let stored=JSON.stringify(initial),fail=false,box;
 const c={console,Set,Map,Date,Math,roster:{劉備:{skills:['仁德']},刀:{skills:[]}},BasicTroops:{types:['刀']},
  localStorage:{getItem:()=>stored,setItem(k,v){assert.equal(k,key);if(fail)throw Error('quota');stored=v;}},
  document:{head:{append(){}},querySelector:()=>null,createElement:()=>({})},
  VillageSweep:{save:()=>runId?{runId}:null},VillageDefense:{rescueCompleted:()=>true},VillageJourney:{status:()=>({wins:10})}};
 c.window=c;vm.createContext(c);
 for(const file of ['共用錢包.js','劇情軍資.js','劇情士氣.js','經驗試算.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c,{filename:file});
 return {c,read:()=>JSON.parse(stored),raw:()=>stored,fail:v=>{fail=v;},setRun:id=>{runId=id;},
  render(report){c.ExperiencePreview.render({querySelector:()=>({before(v){box=v;}})},report);return box;}};
}
const seed=()=>({mode:'battle',storyFaction:'蜀',unlocks:{story:{letters:['劉']},battle:{letters:[]}},
 chests:{battle:{letterProgress:{劉:{level:2,xp:17}}}},storyItems:{foodVoucher:2},battleItems:{foodVoucher:7},
 equipment:{battle:{items:[{id:'keep'}]}},rewards:{wallet:{coins:11,diamonds:4}}});
const report={win:true,rewardXP:57,rows:[{name:'劉備',time:10,damage:26},{name:'刀',time:10,damage:31}]};
const f=fixture(seed());
assert.match(f.render(report).innerHTML,/本場入帳 57 經驗/);
let state=f.read(),receipt=state.chests.story.experienceReceipts['battle-a'];
assert.equal(receipt.total,57);assert.equal(receipt.changes.reduce((n,r)=>n+r.amount,0),57);
assert(!receipt.changes.some(r=>r.letter==='備'));assert.deepEqual(state.chests.battle,seed().chests.battle);
const once=f.raw();f.render(report);assert.equal(f.raw(),once,'reopening a report must not award twice');
const reload=fixture(f.read());reload.render(report);assert.equal(reload.raw(),once,'same restored run must not award twice');
reload.setRun('battle-b');reload.render(report);assert.equal(Object.keys(reload.read().chests.story.experienceReceipts).length,2);
console.log('PASS full 57 XP redistributed to owned participating letters; fixed story destination; repeated/reloaded run receipts');

const retry=fixture(seed());retry.fail(true);const unchanged=retry.raw();
assert.match(retry.render(report).textContent,/尚未保存/);assert.equal(retry.raw(),unchanged);
retry.fail(false);assert.match(retry.render(report).innerHTML,/已保存/);const saved=retry.raw();retry.render(report);assert.equal(retry.raw(),saved);
const missing=fixture(seed(),null);assert.match(missing.render(report).textContent,/尚未保存/);assert.equal(missing.raw(),JSON.stringify(seed()));
const empty=f.c.ExperiencePreview.calculate(report,new Set());assert.equal(empty.eligible,0);assert.equal(empty.unallocated,57);
const defeated=f.c.ExperiencePreview.calculate({...report,win:false},new Set(['劉','刀']));assert.equal(defeated.total,14);assert.equal(defeated.eligible,14);
console.log('PASS failed XP write retries once; missing run cannot grant; no-owned and defeat allocation');

const reward=fixture(seed());reward.fail(true);const rewardBefore=reward.raw();
assert.throws(()=>reward.c.StoryMorale.settle('r1','win',6,4));assert.equal(reward.raw(),rewardBefore);
reward.fail(false);assert.equal(reward.c.StoryMorale.settle('r1','win',6,4),true);
assert.equal(reward.read().rewards.wallet.coins,15);assert.equal(reward.read().storyMorale.value,97);
assert.equal(reward.c.StoryMorale.settle('r1','win',6,4),false);
const restored=fixture(reward.read());assert.equal(restored.c.StoryMorale.settle('r1','win',6,4),false);
assert.equal(restored.c.StoryMorale.settle('r2','retreat',3,2),true);assert.equal(restored.read().rewards.wallet.coins,15);assert.equal(restored.read().storyMorale.value,93);
assert.equal(restored.c.StoryMorale.settle('r3','loss',3,2),true);assert.equal(restored.read().rewards.wallet.coins,15);assert.equal(restored.read().storyMorale.value,85);
console.log('PASS victory coins/morale atomic retry, reload deduplication, no victory coins on retreat or loss');

const supplies=fixture(seed());supplies.fail(true);assert.throws(()=>supplies.c.StorySupplies.spend());assert.equal(supplies.read().storyItems.foodVoucher,2);
supplies.fail(false);assert.equal(supplies.c.StorySupplies.spend(),true);assert.equal(supplies.c.StorySupplies.spend(),true);assert.equal(supplies.c.StorySupplies.spend(),false);
assert.equal(supplies.read().storyItems.foodVoucher,0);assert.equal(supplies.read().battleItems.foodVoucher,7);
supplies.fail(true);const beforeGrant=supplies.raw();assert.throws(()=>supplies.c.StorySupplies.grant());assert.equal(supplies.raw(),beforeGrant);
supplies.fail(false);assert.equal(supplies.c.StorySupplies.grant(),true);assert.equal(supplies.c.StorySupplies.grant(),false);
assert.equal(supplies.read().storyItems.foodVoucher,1);assert.equal(supplies.read().rewards.wallet.coins,211);
assert.equal(supplies.c.StorySupplies.grantFarewell(),true);assert.equal(supplies.c.StorySupplies.grantFarewell(),false);
assert.equal(supplies.read().equipment.story.items.length,3);assert.deepEqual(supplies.read().equipment.battle,seed().equipment.battle);
console.log('PASS story supply spend/grant failure retry, empty inventory, one-time farewell weapons and battle inventory isolation');
