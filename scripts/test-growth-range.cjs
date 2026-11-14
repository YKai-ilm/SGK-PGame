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
