const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c={window:{}};vm.runInNewContext(fs.readFileSync('基礎兵種養成.js','utf8'),c);const B=c.window.BasicTroops;
const s={chests:{story:{trainingXP:1000,letterProgress:{刀:{level:3,xp:25}}},battle:{trainingXP:300,letterProgress:{刀:{level:1,xp:0}}}}};
assert.equal(B.progress(s,'story','刀').level,3);B.allocate(s,'story','刀',300);assert.equal(s.chests.story.letterProgress.刀.level,4);assert.equal(s.chests.story.letterProgress.刀.xp,25);assert.equal(s.chests.story.trainingXP,700);assert.equal(B.progress(s,'battle','刀').level,1);
B.allocate(s,'battle','塔',300);assert.equal(B.progress(s,'battle','塔').level,3);assert.equal(B.progress(s,'battle','塔').xp,0);assert.equal(s.chests.battle.trainingXP,0);
for(const amount of [-1,0,1.5,NaN,9999])assert.throws(()=>B.allocate(s,'story','刀',amount));assert.throws(()=>B.allocate(s,'story','劉',10));
s.chests.story.letterProgress.弓={level:99,xp:9895};B.allocate(s,'story','弓',100);assert.equal(B.progress(s,'story','弓').level,100);assert.equal(s.chests.story.trainingXP,695);assert.equal(B.progress(s,'story','弓').xp,0);assert.throws(()=>B.allocate(s,'story','弓',1));
vm.runInNewContext(fs.readFileSync('測試角色.js','utf8'),c);for(const type of B.types){const u={type},r=B.apply(u,{[type]:{level:4,xp:25}}),stats=c.window.CardGrowth.stats(type,4);assert.equal(r.level,4);assert.equal(r.hp,stats.hp);assert.equal(r.max,stats.hp);assert.equal(r.atk,stats.atk);assert.equal(r.xp,25);assert.equal(B.apply({type},{}).level,1);}
console.log('PASS basic troop legacy progress, mode separation, XP spend/cap/validation and permanent stats');
