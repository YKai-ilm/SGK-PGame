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

vm.runInContext(fs.readFileSync('成長承傷試算.js','utf8'),ctx);
const P=ctx.window.HPGrowthPressure;
assert.equal(P.hp(1000,1,.03),1000);assert.equal(P.hp(1000,10,.03),1270);assert.equal(P.hp(1000,16,.03),1450);assert.equal(P.hp(1000,100,.03),1450);
assert.equal(P.run(100,0,1).fallenAt,1.3);
assert.equal(P.run(100000,0,1).damage,46*168+23*150);
assert.equal(P.run(100000,100,1).damage,(46*168+23*150)/2);
assert.equal(P.run(100000,0,2).damage,2*(46*168+23*150));
for(const rate of [.02,.03,.04]){let last=0;for(let l=1;l<=100;l++){const hp=P.hp(10819,l,rate);assert(hp>=last);last=hp;}}
for(const args of [[0,1,.03],[100,0,.03],[100,1,NaN]])assert.throws(()=>P.hp(...args));
for(const scale of [1,2.8,5.88])for(const level of [1,10,20])for(const rate of ['old',.03]){const hp=P.hp(10819,level,rate),r=P.run(hp,ctx.window.HeroCombat.stats('郝昭').def,scale);console.log(JSON.stringify({scale,level,rate,hp,remaining:Math.floor(r.remaining),fallenAt:r.fallenAt}));}
console.log('PASS attack timing, defense, scaling, growth cap and invalid input');
