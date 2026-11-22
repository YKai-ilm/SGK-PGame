const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');const c={};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('大地圖通行.js','utf8'),c);const w=c.WorldTravel;
assert.equal(w.fare('徐州','長社').coins,80);assert.equal(w.fare('徐州','廣宗').coins,80);assert.equal(w.fare('長社','廣宗').coins,120);assert.equal(w.fare('徐州','徐州').coins,0);assert(w.fare('徐州','成都').coins>0);assert.equal(w.fare('徐州','不存在'),null);
assert.equal(w.fare('桃源村','廣宗').coins,40);assert.equal(w.fare('桃源村','徐州').coins,80);assert(w.fareNetwork().towns.find(t=>t.name==='陳留').transitOnly);
for(const a of w.fareNetwork().towns)for(const b of w.fareNetwork().towns){const q=w.fare(a.name,b.name);assert.equal(q.coins,w.fare(b.name,a.name).coins);assert.equal(q.path.length-1,q.segments);assert.equal(q.coins,q.segments*20);}
console.log('PASS station fares: one/two/three segments, same station, unknown station, symmetric matrix and read-only query');
