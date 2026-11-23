const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');const c={};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('大地圖通行.js','utf8'),c);const w=c.WorldTravel;
assert.equal(w.fare('徐州','長社').coins,80);assert.equal(w.fare('徐州','廣宗').coins,80);assert.equal(w.fare('長社','廣宗').coins,120);assert.equal(w.fare('徐州','徐州').coins,0);assert(w.fare('徐州','成都').coins>0);assert.equal(w.fare('徐州','不存在'),null);
assert.equal(w.fare('桃源村','廣宗').coins,40);assert.equal(w.fare('桃源村','徐州').coins,80);assert(w.fareNetwork().towns.find(t=>t.name==='陳留').transitOnly);
for(const a of w.fareNetwork().towns)for(const b of w.fareNetwork().towns){const q=w.fare(a.name,b.name);assert.equal(q.coins,w.fare(b.name,a.name).coins);assert.equal(q.path.length-1,q.segments);assert.equal(q.coins,q.segments*20);}
console.log('PASS station fares: one/two/three segments, same station, unknown station, symmetric matrix and read-only query');
// Station purchase is one durable commit of currency and arrival.
const store=new Map(),sessions=new Map(),key='three-kingdoms-interface-preview-v1';let fail=false,sessionFail=false;
c.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>{if(fail)throw Error('disk full');store.set(k,v);}};
c.sessionStorage={getItem:k=>sessions.get(k)||null,setItem:(k,v)=>{if(sessionFail)throw Error('session unavailable');sessions.set(k,v);},removeItem:k=>sessions.delete(k)};c.location={href:''};vm.runInContext(fs.readFileSync('共用錢包.js','utf8'),c);
const seed=coins=>{store.set(key,JSON.stringify({storyEvents:{grainRoute:{armyFormed:true}},worldTravel:{current:'徐州'},rewards:{wallet:{coins,diamonds:7}},sentinel:42}));c.location.href='';sessions.clear();};
seed(79);const insufficient=store.get(key);assert.throws(()=>w.travel('桃源村',true,'徐州'),/金幣不足/);assert.equal(store.get(key),insufficient);assert.equal(c.location.href,'');
seed(80);assert(w.travel('桃源村',true,'徐州'));let result=JSON.parse(store.get(key));assert.equal(result.rewards.wallet.coins,0);assert.equal(result.rewards.wallet.diamonds,7);assert.equal(result.worldTravel.current,'桃源村');assert.equal(result.sentinel,42);assert.equal(w.resumeUrl(),'桃園起兵.html');assert.equal(w.travel('桃源村',true,'徐州'),false);assert.equal(JSON.parse(store.get(key)).rewards.wallet.coins,0);assert(w.consumeArrival('桃源村'));assert(!w.consumeArrival('桃源村'));
seed(100);const original=store.get(key);fail=true;assert.throws(()=>w.travel('桃源村',true,'徐州'),/disk full/);fail=false;assert.equal(store.get(key),original);assert.equal(c.location.href,'');assert.equal(sessions.size,0);
assert.throws(()=>w.travel('桃源村',true,'長社'),/位置已變更/);assert.equal(store.get(key),original);
sessionFail=true;assert(w.travel('桃源村',true,'徐州'));sessionFail=false;assert.equal(JSON.parse(store.get(key)).rewards.wallet.coins,20);assert(w.consumeArrival('桃源村'));assert(!w.consumeArrival('桃源村'));
console.log('PASS station insufficient/exact balance, durable debit+arrival, duplicate confirmation, stale origin, failed persistence and session-free arrival recovery');
