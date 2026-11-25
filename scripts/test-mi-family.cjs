const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};vm.runInNewContext(fs.readFileSync('糜家劇情.js','utf8'),context);const story=context.window.MiFamilyStory;
assert(!story.npc('miZhen',{}).action);assert(!story.npc('miFang',{}).action);
assert.equal(story.npc('miElder',{}).action,'miElderHeard');
assert.equal(story.npc('miZhen',{miElderHeard:true}).action,'miZhenAwaitingMarriage');
assert.equal(story.npc('miZhen',{miZhenAwaitingMarriage:true}).lines[0][1],'.....（害羞）');
for(const flags of [{},{miZhenAwaitingMarriage:true},{volunteerArmyFormed:true},{miZhenAwaitingMarriage:true,accepted:true,slept:true,missing:true},{miZhenAwaitingMarriage:true,volunteerArmyFormed:true,miMatchmakingDiscussed:true}])assert(!story.canMatchmake(flags));
assert(story.canMatchmake({miZhenAwaitingMarriage:true,volunteerArmyFormed:true}));
for(const party of [[],['關羽'],['張飛'],['關羽','張飛']])for(const sworn of [false,true]){
 const lines=story.matchmaking({party,sworn,visitors:party}),text=lines.map(x=>x[1]).join('');
 for(const name of ['關羽','張飛'])assert.equal(lines.some(x=>x[0]===name),party.includes(name));
 if(!sworn)assert(!/大哥|二弟|三弟|結拜/.test(text));
 if(!party.length)assert(!/你們|二弟|三弟|我們三人/.test(text));
 assert.equal(text.includes('我們三人日前'),party.length===2);
}
assert(story.matchmaking({party:['關羽','張飛'],sworn:true,visitors:[]}).some(x=>x[1].includes('我日前')));
console.log('PASS Mi-family prerequisites, repeat dialogue, matchmaking conjunction, once-only gate, absent companions, oath titles and recorded visit count.');
const f={miMatchmakingDiscussed:true};assert.equal(story.npc('miElder',f).action,'miFamilyVisited');assert(!story.npc('miZhen',f).action);f.miFamilyVisited=true;assert.equal(story.npc('miZhen',f).action,'miZhenPromised');f.miZhenPromised=true;assert(!story.npc('miZhen',f).action);assert(story.reunion[0][1].includes('妹夫'));
const cards={};cards.window=cards;vm.createContext(cards);for(const file of ['人物評定草案.js','測試角色.js','寶箱系統.js','武將品質草案.js'])vm.runInContext(fs.readFileSync(file,'utf8'),cards);for(const name of ['糜竺','糜芳'])assert.equal(cards.OFFICER_PROPOSAL.entries.filter(p=>p.name===name).length,1);for(const ch of ['糜','竺','芳'])assert(cards.TestRoster[ch].letter);const save={unlocks:{story:{heroes:[],letters:['糜','竺','芳']},battle:{heroes:[],letters:[]}}};cards.ChestSystem.syncUnlocked(save);for(const name of ['糜竺','糜芳'])assert(save.unlocks.story.heroes.includes(name));console.log('PASS Mi revisit stages, agreed betrothal, letter roster and assembly');
