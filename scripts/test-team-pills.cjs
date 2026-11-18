const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
let profile={mode:'story',storyFaction:'蜀',storyItems:{redHeartPill:1},teams:{'story:蜀':{healingPill:'redHeartPill'}}};
const c={window:{},URLSearchParams,location:{search:''},localStorage:{getItem:()=>JSON.stringify(profile)}};
vm.runInNewContext(fs.readFileSync('隊伍丹藥.js','utf8'),c);const P=c.window.TeamPills;
const heal=(u,n)=>u.hp=Math.min(u.max,u.hp+n),unit=(id,hp,max=1000)=>({id,hp,max});
for(const [id,n]of [['redHeartPill',40],['bronzePill',75],['silverPill',120],['goldPill',180]]){
 profile.storyItems={[id]:1};profile.teams['story:蜀'].healingPill=id;P.reset();
 const a=[unit(1,100),unit(2,300),unit(3,200),unit(4,400),unit(5,0),{...unit(6,10),enemy:true},unit('gate',1),unit(7,1000)];
 P.update(4.99,a,heal);assert.equal(a[0].hp,100);P.update(5,a,heal);assert.deepEqual(a.map(u=>u.hp),[100+n,300+n,200+n,400,0,10,1,1000]);
 const saved=P.save();P.validate(saved,5);P.reset();P.load(saved);P.update(5,a,heal);assert.equal(a[0].hp,100+n);assert.equal(P.save().next,10);
 assert.equal(profile.storyItems[id],1);P.load(undefined);P.update(100,a,heal);assert.equal(a[0].hp,100+n);
}
P.load({id:'redHeartPill',next:5});const injured=[unit(1,990)];P.update(5,injured,heal);assert.equal(injured[0].hp,1000);
let seed=0;const equal=[1,2,3,4].map(i=>unit(i,50,100));assert.deepEqual(Array.from(P.targets(equal,()=>++seed),u=>u.id),[1,2,3]);seed=0;assert.deepEqual(Array.from(P.targets(equal,()=>--seed),u=>u.id),[4,3,2]);
assert.equal(P.targets([unit(1,200,1000),unit(2,100,100)],()=>0)[0].id,1);
for(const bad of [{id:'bad',next:5},{id:'redHeartPill',next:0},{id:'redHeartPill',next:100},{id:'redHeartPill',next:5,heal:999},{id:'redHeartPill',next:NaN}])assert.throws(()=>P.validate(bad,0));
profile.mode='battle';P.reset();assert.equal(P.save().id,null);c.location.search='?storySweep=1';P.reset();assert.equal(P.save().id,'goldPill');
c.window.TutorialBattleConfig={};P.reset();assert.equal(P.save().id,null);delete c.window.TutorialBattleConfig;
profile.storyItems={};P.reset();assert.equal(P.save().id,null);
console.log('PASS four fixed heals, 5-second boundary, eligible targets, random ties, no consumption, snapshots and mode/tutorial isolation');
