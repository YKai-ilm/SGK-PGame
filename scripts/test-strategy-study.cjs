const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const c={window:{}};vm.runInNewContext(fs.readFileSync('軍師計策試算.js','utf8'),c);const S=c.window.SPStudy;
for(let l=1;l<=100;l++)for(let i=1;i<=100;i++){assert.ok(S.capacity(i,l)>=S.capacity(i-1,l));if(l>1)assert.ok(S.capacity(i,l)>=S.capacity(i,l-1));}
assert.deepEqual([97,98,99].map(i=>S.capacity(i,10)),[27,28,29]);assert.equal(S.capacity(98,1,'a'),S.capacity(99,1,'a'));assert.throws(()=>S.capacity(101,1));assert.throws(()=>S.capacity(90,0));
let p=60;p=S.transition(p,130,'level');assert.equal(p,60);p=S.transition(p,130,'spend',8);p=S.transition(p,130,'battle');assert.equal(p,52);p=S.transition(p,40,'strategist');assert.equal(p,52);assert.equal(S.transition(p,40,'inn'),52);assert.equal(S.transition(p,40,'item',10),52);p=S.transition(p,40,'spend',20);assert.equal(p,32);assert.equal(S.transition(p,40,'item',5),37);assert.equal(S.transition(p,40,'item',20),40);assert.equal(S.transition(p,40,'inn'),40);assert.equal(S.transition(p,40,'spend',33),32);assert.equal(S.transition(p,0,'strategist'),32);
console.log('PASS proposed capacity: 100 levels remain monotonic; high intelligence 97/98/99 stays distinct; SP scenario preserves current amount and caps recovery only. Study only, not runtime.');


assert.deepEqual([50,60,70,78,80,90,97,98,99,100].map(i=>S.capacity(i,1)),[8,10,12,13,14,16,19,20,21,22]);
for(let l=1;l<=100;l++){assert.ok(S.capacity(97,l)<S.capacity(98,l)&&S.capacity(98,l)<S.capacity(99,l));for(let i=50;i<=100;i++)assert.ok(S.capacity(i,l)<S.capacity(i,l,'b'));}
