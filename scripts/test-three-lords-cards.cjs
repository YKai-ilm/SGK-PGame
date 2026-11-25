const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),c={};c.window=c;vm.createContext(c);for(const f of ['人物評定草案.js','武將品質草案.js','補充武將能力評定資料.js','武將列表整合.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);for(const [name,q]of [['張角','紫'],['張梁','橘'],['張寶','橘']]){const entries=c.OFFICER_PROPOSAL.entries.filter(p=>p.name===name);assert.equal(entries.length,1);assert.equal(c.OFFICER_QUALITY.evaluate(entries[0]).quality,q);}console.log('PASS three lords registered once, canonical ability/quality and supplemental guide merge');
for(const f of ['測試角色.js','寶箱系統.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const state={mode:'story',unlocks:{story:{letters:['張'],heroes:[]},battle:{letters:[],heroes:[]}},storyEvents:{threeZhang:{}},rewards:{wallet:{coins:321,diamonds:5}}};
const pool=c.ChestSystem.pool(state,1);
for(const ch of ['張','角','梁','寶']){assert(pool.letters.includes(ch));assert(c.TestRoster[ch].letter);assert(c.LetterTraits[ch]);assert(Number.isFinite(c.CardGrowth.stats(ch,5).hp));}
assert.equal(c.TestRoster['張'].kind,'arrow');
for(const [ch,name] of [['角','張角'],['梁','張梁'],['寶','張寶']]){state.unlocks.story.letters.push(ch);c.ChestSystem.syncUnlocked(state);for(const mode of ['story','battle']){assert(state.unlocks[mode].heroes.includes(name));assert(state.unlocks[mode].letters.includes(ch));assert(state.unlocks[mode].letters.includes('張'));}}
const before=JSON.stringify(state);c.ChestSystem.syncUnlocked(state);assert.equal(JSON.stringify(state),before);assert.deepEqual(state.storyEvents.threeZhang,{});assert.equal(state.rewards.wallet.coins,321);
console.log('PASS shared letters, chest pool, combat letter stats, reusable assembly, no story advancement or duplicate rewards');
