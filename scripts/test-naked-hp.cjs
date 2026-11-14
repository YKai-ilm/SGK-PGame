const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),c={window:{}};
for(const f of ['測試角色.js','武將戰鬥能力資料.js','武將戰鬥換算.js','裸裝生命試算.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);
const M=c.window.NakedHPStudy,H=c.window.HeroCombat,base=JSON.stringify(c.window.TestRoster);
assert.equal(H.stats('關羽').hp,2136);
assert.deepEqual(Array.from({length:10},(_,i)=>M.calculate('關羽',1,i+1).base),[2136,2150,2164,2178,2192,2206,2220,2234,2248,2262]);
assert.deepEqual([1,10,20,40,60,80,100].map(l=>[1,3,6,10].map(s=>M.calculate('關羽',l,s).permanentHP)),[[2136,2164,2206,2262],[2905,2943,3000,3076],[3759,3809,3883,3981],[5468,5540,5647,5791],[7177,7271,7412,7600],[8886,9002,9177,9410],[10595,10733,10942,11220]]);
for(const name of ['關羽','劉備','張飛','徐庶','諸葛亮','曹仁'])for(let l=1;l<=100;l++)for(let s=1;s<=10;s++){
 const r=M.calculate(name,l,s),prior=l>1?M.calculate(name,l-1,s):r;
 assert.equal(r.permanentHP,Math.round(H.calculate(c.window.HERO_COMBAT_DATA[name].abilities,c.window.HERO_COMBAT_DATA[name].quality,s).hp*(1+.04*(l-1))));assert.ok(r.permanentHP>=prior.permanentHP);
 if(l===1)assert.equal(r.permanentHP,r.base);
 if(s>1)assert.ok(r.permanentHP>M.calculate(name,l,s-1).permanentHP);
}
for(const l of [1,3,5,10,20,50,100])assert.equal(M.calculate('關羽',1,1,l).liveBattleHP,c.window.CardGrowth.stats('關羽',l).hp);
assert.equal(M.calculate('關羽',100,10,10).liveBattleHP,M.calculate('關羽',1,1,10).liveBattleHP,'live engine must not be presented as reading permanent level or stars');
assert.equal(M.calculate('關羽',1,1,10).liveBattleHP,5923);assert.equal(M.calculate('關羽',1,1,20).liveBattleHP,18399);
for(const args of [['不存在',1,1],['關羽',0,1],['關羽',101,1],['關羽',1,11],['關羽',1,1,0]])assert.throws(()=>M.calculate(...args));
assert.equal(JSON.stringify(c.window.TestRoster),base,'study must not mutate live roster');
console.log('PASS 6,000 naked HP cells: shared base, linear permanent candidate, star monotonicity, exact current battle growth, invalid input and no roster mutation');
