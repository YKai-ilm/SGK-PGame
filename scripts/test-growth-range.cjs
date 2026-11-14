'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const ctx={window:{}};vm.createContext(ctx);
for(const p of ['武將戰鬥能力資料.js','武將戰鬥換算.js','武將升星需求資料.js','成長區間試算.js'])vm.runInContext(fs.readFileSync(p,'utf8'),ctx);
const calc=ctx.window.GrowthRangeStudy.calculate, before=JSON.stringify(ctx.window.HERO_COMBAT_DATA);
assert.equal(calc().hp,1840);assert.equal(calc(1,'紅',10).hp,2668);assert.equal(calc(1,'紫',1).hp,3036);assert.equal(calc(1,'紫',10).hp,3864);assert.equal(calc(100,'紫',10).hp,10819);
assert.equal(calc(1,'紅',10).fragments,5040);assert.equal(calc(1,'紫',1).fragments,6640);assert.equal(calc(1,'紫',10).fragments,14200);
for(const lt of [2.6,2.8,3])for(const st of [1.9,2.1,2.2])for(let l=1;l<=100;l++){
 let previous=0;for(const q of ['紅','紫'])for(let s=1;s<=10;s++){
 const v=calc(l,q,s,lt,st);assert(v.hp>previous);previous=v.hp;if(l>1)assert(v.hp>calc(l-1,q,s,lt,st).hp);
 }
 assert.equal(calc(l,'紫',10,lt,st).hp,Math.round(1840*(1+(lt-1)*(l-1)/99)*st));
}
for(const args of [[0],[101],[NaN],[1,'金'],[1,'紅',0],[1,'紅',11],[1,'紅',1,Infinity],[1,'紅',1,2.8,NaN]])assert.throws(()=>calc(...args));
assert.equal(before,JSON.stringify(ctx.window.HERO_COMBAT_DATA));
console.log('Growth range: 18000 progression comparisons and boundaries passed.');


vm.runInContext(fs.readFileSync('統一等級試算.js','utf8'),ctx);const U=ctx.window.UnifiedLevelStudy;
assert.equal(U.need(50),5000);assert.equal(U.reward(20),30);assert.equal(JSON.stringify(U.gain(50,0,5010)),JSON.stringify({level:51,xp:10}));assert.equal(U.hp(1840,50),3479);assert.equal(U.hp(1840,51),3513);
let total=0;for(let l=1;l<100;l++)total+=U.need(l);assert.equal(total,495000);assert.equal(U.gain(1,0,total).level,100);
for(let start=1;start<=100;start++){let a={level:start,xp:0};for(let i=0;i<167;i++)a=U.gain(a.level,a.xp,U.reward(20));assert.equal(JSON.stringify(a),JSON.stringify(U.gain(start,0,5010)));}
for(const args of [[0,0,1],[50,5000,1],[50,0,-1]])assert.throws(()=>U.gain(...args));
console.log('PASS shared XP thresholds, fixed enemy reward, overflow, cap and batching invariance');

for(const [waves,count,total] of [[1,7,97],[3,24,336],[6,57,798]]){const es=U.villageExample(waves);assert.equal(es.length,count);assert.equal(es.reduce((n,e)=>n+e.xp,0),total);for(const e of es){assert(e.level>=3&&e.level<=5);assert.equal(e.xp,U.reward(e.level));}}
const fixed=JSON.stringify(U.villageExample(6));for(const playerLevel of [1,20,60,100]){U.gain(playerLevel,0,798);assert.equal(JSON.stringify(U.villageExample(6)),fixed);}
assert.equal(JSON.stringify(U.gain(1,0,7980)),JSON.stringify({level:13,xp:180}));assert.equal(JSON.stringify(U.gain(1,0,2660)),JSON.stringify({level:7,xp:560}));assert.equal(JSON.stringify(U.gain(60,0,7980)),JSON.stringify({level:61,xp:1980}));assert.throws(()=>U.villageExample(2));
console.log('PASS fixed chapter roster, bounded levels, XP totals and repeatable results independent of player progression');

for(const w of [1,3,6])for(const r of [1,1.5,2]){const p=U.pools(w,r);assert.equal(p.settlement,p.count);assert.equal(p.battle,Math.floor(p.count*r));assert(p.battle>=p.settlement&&p.battle<=2*p.settlement);}
assert.equal(U.pools(6,2).battle,114);assert.equal(U.pools(6,1.5).battle,85);assert.equal(JSON.stringify(U.gain(1,0,114)),JSON.stringify({level:2,xp:14}));assert.equal(JSON.stringify(U.gain(1,0,190)),JSON.stringify({level:2,xp:90}));assert.equal(JSON.stringify(U.gain(1,0,570)),JSON.stringify({level:3,xp:270}));assert.throws(()=>U.pools(6,14));console.log('PASS bounded battle/settlement ratio comparison');

// Run the real settlement allocator in an isolated DOM stub; never touch a save.
const allocCtx={window:{},roster:Object.fromEntries(['劉備','關羽','張飛'].map(name=>[name,{skills:[{}]}])),document:{createElement:()=>({}),head:{append(){}}}};vm.createContext(allocCtx);vm.runInContext(fs.readFileSync('經驗試算.js','utf8'),allocCtx);
const waves=Array.from({length:6},(_,i)=>({wave:i+1,count:7+i,hp:1+.04*i,attack:1+.03*i,xp:[7,9,11,13,15,18][i]}));
const rows=['劉備','關羽','張飛'].map(name=>({name,time:60,damage:100,absorbed:100,healing:0,shieldSupport:0,control:0})),owned=new Set(['劉','備','關','羽','張','飛']);
function settle(sequence,scale=1){const amounts=Object.fromEntries([...owned].map(ch=>[ch,0]));let total=0;for(const n of sequence){const pool=waves.slice(0,n).reduce((a,w)=>a+w.xp,0)*scale;const r=allocCtx.window.ExperiencePreview.calculate({rows,win:true,rewardXP:pool},owned,true);assert.equal(r.eligible,pool);total+=pool;for(const item of r.items)amounts[item.letter]+=item.amount;}
return {sequence,scale,total,cards:Object.entries(amounts).map(([name,xp])=>({name,earned:xp,...U.gain(1,0,xp)}))};}
const result={waves,scenarios:[settle(Array(10).fill(1)),settle([1,1,1,3,3,3,3,6,6,6]),settle(Array(10).fill(6)),settle([1,1,1,3,3,3,3,6,6,6],2),settle([1,1,1,3,3,3,3,6,6,6],3)]};
assert.equal(result.scenarios[0].total,70);assert.equal(result.scenarios[1].total,348);assert.equal(result.scenarios[2].total,730);
for(const r of result.scenarios)assert.equal(r.cards.reduce((a,c)=>a+c.earned,0),r.total);
fs.writeFileSync('波次戰後經驗結果.js','window.WaveSettlementStudy='+JSON.stringify(result,null,2)+';\n');console.log(JSON.stringify(result.scenarios));
console.log('PASS actual settlement allocator, per-wave totals and persistent-only XP');

const milestones=U.milestones();assert.equal(milestones.length,20);assert.equal(U.demand(5),1000);assert.equal(U.demand(100),495000);assert.equal(milestones[1].segmentXP,3500);assert.equal(milestones.reduce((a,r)=>a+r.segmentXP,0),495000);assert.equal(milestones[9].fragments,5040);assert.equal(milestones[10].fragments,6640);assert.equal(milestones[19].fragments,14200);for(let l=1;l<=100;l++){const r=U.gain(1,0,U.demand(l));assert.equal(r.level,l);assert.equal(r.xp,0);}console.log('PASS cost-only milestones, chapter boundary continuity and XP inversion');
