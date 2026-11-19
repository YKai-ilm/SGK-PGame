const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const key='three-kingdoms-interface-preview-v1',cityKey='three-kingdoms-xuzhou-story-v1';
const data=new Map();let fail=false,n=0;
const c={window:null,crypto:{randomUUID:()=>String(++n)},Event:class{},dispatchEvent(){},localStorage:{getItem:k=>data.get(k)||null,setItem(k,v){if(fail)throw Error('disk full');data.set(k,v);}}};c.window=c;vm.createContext(c);
for(const f of ['共用錢包.js','城鎮住宿.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const L=c.TownLodging,profile=()=>JSON.parse(data.get(key)),seed=(coins=100)=>{data.set(key,JSON.stringify({storyFaction:'蜀',teams:{'story:蜀':{slots:['甲','乙',null,null,null,'軍師','玩家']},battle:{slots:['丙']}},rewards:{wallet:{coins,diamonds:3}},storyMorale:{value:30,settled:{battle:1}}}));data.set(cityKey,JSON.stringify({flags:{}}));};
(async()=>{
 for(let count=0;count<=7;count++)assert.equal(L.quote('xuzhou',{teams:{'story:蜀':{slots:Array.from({length:count},(_,i)=>String(i))}}}).total,20+count*2);
 assert.equal(L.quote('xuzhou',{teams:{'story:蜀':{slots:['甲','甲',null]}}}).total,22);
 seed();assert.equal(L.quote().total,28);await assert.rejects(L.begin(20));assert.equal(profile().rewards.wallet.coins,100);
 const [a,b]=await Promise.all([L.begin(28),L.begin(28)]);assert.equal(a.id,b.id);assert.equal(profile().rewards.wallet.coins,72);assert.equal(L.pending().id,a.id);
 await L.complete(a.id);assert.equal(profile().storyMorale.value,100);assert.equal(profile().storyMorale.settled.battle,1);assert.equal(JSON.parse(data.get(cityKey)).flags.slept,undefined);assert.equal(await L.complete(a.id),false);
 seed(0);await assert.rejects(L.begin(28));assert.equal(L.pending(),null);data.set(cityKey,JSON.stringify({flags:{steward:true}}));assert(L.freeAvailable());const free=await L.begin(0);assert.equal(free.cost,0);assert(!L.freeAvailable());await L.complete(free.id);assert.equal(profile().rewards.wallet.coins,0);assert(!L.freeAvailable());
 seed();fail=true;await assert.rejects(L.begin(28));fail=false;assert.equal(profile().rewards.wallet.coins,100);assert.equal(L.pending(),null);
 const paid=await L.begin(28);fail=true;await assert.rejects(L.complete(paid.id));fail=false;assert.equal(L.pending().id,paid.id);await L.complete(paid.id);assert.equal(profile().rewards.wallet.coins,72);
 console.log('PASS lodging pricing, team isolation, quote recheck, insufficient funds, free priority, duplicate/reload recovery and atomic failure retry');
})().catch(e=>{console.error(e);process.exitCode=1;});
