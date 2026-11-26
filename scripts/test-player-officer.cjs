const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const c={window:null,crypto:require('crypto').webcrypto,localStorage:{getItem:()=>'{"mode":"story"}'}};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('玩家武將.js','utf8'),c);vm.runInContext(fs.readFileSync('武將品質草案.js','utf8'),c);
vm.runInContext(fs.readFileSync('武將戰鬥換算.js','utf8'),c);const P=c.PlayerOfficer;
for(const style of Object.keys(P.styles)){const s={tutorial:{status:'completed'}},p=P.create(s,'測試將',style);assert(P.valid(p));assert.equal(c.OFFICER_QUALITY.evaluate(P.abilities(p)).quality,'青');assert.equal(Object.values(P.abilities(p)).reduce((a,b)=>a+b,0),360);assert.equal(s.unlocks.story.heroes[0],p.name);assert.equal(s.unlocks.battle.heroes[0],p.name);assert.throws(()=>P.create(s,'另一將',style));}
const s={tutorial:{status:'skipped'}},p=P.create(s,'自由將','全能');p.rank=22;P.allocate(p,{str:35,int:0,lead:0,body:0,agi:0,charm:0});assert.equal(P.abilities(p).str,95);assert.equal(P.tiers[Math.floor(p.rank/10)],'藍');assert.equal(P.remaining(p),31);assert.throws(()=>P.allocate(p,{str:41,int:0,lead:0,body:0,agi:0,charm:0}));
p.rank=69;P.allocate(p,{str:40,int:40,lead:40,body:30,agi:30,charm:25});assert.equal(P.remaining(p),2);
const fresh=P.create({tutorial:{status:'completed'}},'成長將','全能');P.gainXP(fresh,300);assert.equal(fresh.level,3);assert.equal(fresh.xp,0);assert.deepEqual(JSON.parse(JSON.stringify(P.abilities(fresh))),Object.fromEntries(P.fields.map(k=>[k,60])));P.gainXP(fresh,1000000);assert.equal(fresh.level,100);assert.equal(fresh.xp,0);assert.equal(P.gainXP(fresh,20),0);
for(const name of ['<img>','constructor','a','特殊','劉 備'])assert.throws(()=>P.create({tutorial:{status:'completed'}},name,'武'));
assert.throws(()=>P.create({tutorial:{status:'new'}},'新玩家','武'));
console.log('PASS five valid Qing starts, shared complete identity, unrestricted blue STR95, 207 point cap, levels independent of abilities, input validation');

const progression=P.create({tutorial:{status:'completed'}},'里程將','全能');P.gainXP(progression,495000);assert.equal(progression.level,100);assert.equal(progression.fragments,100);assert.equal(progression.milestones.length,10);assert.equal(P.rebirth(progression),200);assert.equal(progression.fragments,300);for(let i=0;i<20;i++)P.upgrade(progression);assert.equal(progression.rank,20);assert.equal(progression.fragments,0);assert.equal(P.remaining(progression),60);assert.throws(()=>P.upgrade(progression));assert.throws(()=>P.rebirth(progression));P.gainXP(progression,990000);assert.equal(progression.fragments,0);assert.equal(P.rebirth(progression),300);assert.equal(progression.milestones.length,10);console.log('PASS first 100 + rebirth earns exactly two color advancements; no repeated milestone grants; increasing XP and rebirth rewards');
// Additional allocations use deltas; refunds preserve earned/card points.
{const s={tutorial:{status:'completed'}},p=P.create(s,'追加將','全能');p.rank=3;p.bonusPoints=5;const extra=n=>Object.fromEntries(P.fields.map(k=>[k,k==='str'?n:0]));P.addPoints(p,extra(4));P.addPoints(p,extra(3));assert.equal(p.points.str,7);assert.equal(P.abilities(p).str,67);assert.equal(P.remaining(p),7);const before=JSON.stringify(p);for(const n of [-1,1.5,8,NaN])assert.throws(()=>P.addPoints(p,extra(n)));assert.equal(JSON.stringify(p),before);P.addPoints(p,extra(0));assert.equal(p.points.str,7);P.resetPoints(p);assert.equal(P.remaining(p),14);assert.equal(P.abilities(p).str,60);assert.equal(p.bonusPoints,5);assert.equal(p.rank,3);P.addPoints(p,extra(14));assert.equal(P.remaining(p),0);assert(P.valid(JSON.parse(JSON.stringify(p))));}
console.log('PASS incremental allocations, rejection without mutation, zero draft, full refunds preserve card/earned points');
// Preview must remain read-only and match the established combat formulas.
for(const style of Object.keys(P.styles))for(const level of [1,40,100]){
 c.TestRoster={};const q=P.create({tutorial:{status:'completed'}},'預覽將',style);q.rank=9;q.level=level;q.fragments=100;q.points.str=3;
 const before=JSON.stringify(q),extra=Object.fromEntries(P.fields.map(k=>[k,k==='body'?2:0]));
 const stats=P.previewPoints(q,extra),a=P.abilities(q),scale=1+(level-1)*.03;
 const expected=c.HeroCombat.calculate({...a,body:a.body+2},'青',10);assert.equal(JSON.stringify(q),before);assert.equal(stats.hp,Math.round(expected.hp*scale));
 assert.equal(stats.physical,expected.physical*scale);assert.equal(stats.mdef,expected.mdef*(1+(level-1)*.015));
 c.TestRoster={};P.register({playerOfficer:q});const roster=c.TestRoster[q.name],base=P.combatStats(q);
 assert.equal(roster.hp,base.hp);assert.equal(roster.atk*roster.physicalRatio,base.physical);assert.equal(roster.interval,1/base.rate);
 const prior=P.combatStats(q);P.upgrade(q);assert.equal(q.rank,10);assert.equal(q.fragments,90);assert.equal(P.remaining(q),27);for(const k of Object.keys(prior))assert(P.combatStats(q)[k]>prior[k],k);
}
console.log('PASS read-only previews, legacy combat parity for all styles/levels, quality transition grants points and direct stats');


for(const style of Object.keys(P.styles))for(let rank=0;rank<70;rank++){
 const q=P.create({tutorial:{status:'completed'}},'品質將',style);q.rank=rank;
 const a=P.abilities(q),v=P.combatStats(q);
 if(rank<60){const ordinary=c.HeroCombat.calculate(a,P.tiers[Math.floor(rank/10)],rank%10+1);for(const k of Object.keys(v))assert.equal(v[k],ordinary[k],style+rank+k);}
 else{assert(Object.values(v).every(Number.isFinite));const prev=P.combatStats({...q,rank:rank-1});for(const k of Object.keys(v))assert(v[k]>=prev[k]);}
 const old=P.combatStats(q,1);assert.equal(old.hp,400+a.body*8);assert.equal(old.physical,a.str*2);
}
console.log('PASS same six attributes/quality/star give identical level-1 stats, all five styles and 70 ranks, gold continuity and legacy formula');
