const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),c={};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('戰鬥浮字.js','utf8'),c);
const f=(text,x=1,color='red',end=1)=>({x,y:2,text,color,end});
const input=[f('−10'),f('−20',1.02),f('+5'),f('−30',1,'blue'),f('−7',3),f('−8',1,'red',1.3),f('暈眩'),f('暈眩'),{x:1,y:2,r:3,end:1,color:'red'}],before=JSON.stringify(input),out=c.BattleFloatText.compact(input);
assert.equal(JSON.stringify(input),before);assert.equal(out.length,7);assert.equal(out[0].text,'−30');assert.equal(out[1].text,'+5');assert.equal(out[2].text,'−30');assert.equal(out[3].text,'−7');assert.equal(out[4].text,'−8');assert.equal(out[5].text,'暈眩');assert.equal(out[6],input[8]);assert.notEqual(out[0],input[0]);
const dense=Array.from({length:2000},(_,i)=>f('−'+(i+1)));assert.equal(c.BattleFloatText.compact(dense).length,1);assert.equal(c.BattleFloatText.compact(dense)[0].text,'−2001000');
const overflow=[f('−9007199254740991'),f('−1')];assert.equal(c.BattleFloatText.compact(overflow).length,2);
assert.equal(c.BattleFloatText.compact([f('＋10'),f('−10')]).length,2);assert.equal(c.BattleFloatText.compact([f('−5'),f('−5',1,'red',2)]).length,2);
console.log('PASS floating totals, damage/heal/color/position/time separation, status dedup, overflow, 2000 hits and immutable effects');
