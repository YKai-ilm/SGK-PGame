const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');const map=new Map(),ctx={window:{},localStorage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)},crypto:require('crypto')};ctx.window=ctx;vm.createContext(ctx);for(const f of ['共用錢包.js','糧道劇情進度.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);const Q=ctx.GrainQuest,K='three-kingdoms-interface-preview-v1',read=()=>JSON.parse(map.get(K)||'{}');
assert.equal(Q.advance('heardMing'),false);assert.equal(Q.advance('routeKnown'),false);map.set('three-kingdoms-xuzhou-story-v1',JSON.stringify({flags:{missing:true}}));Q.advance('routeKnown');Q.advance('heardMing');Q.advance('captainBriefed');assert.equal(Q.advance('rescueShown'),false);const run=Q.begin('rescue');assert.equal(Q.complete('rescue','wrong'),false);assert(!Q.progress().rescueWon);assert(Q.complete('rescue',run));assert(Q.complete('rescue',run));assert.equal(Q.advance('captainGift'),false);Q.advance('rescueShown');Q.advance('captainGift');assert.equal(Q.advance('captainGift'),false);assert.equal(read().storyItems.damagedLeatherArmor,1);const before=map.get(K);assert.throws(()=>Q.repair(),/不足/);assert.equal(map.get(K),before);Q.advance('reported');assert.equal(read().rewards.wallet.coins,60);assert(Q.repair());assert.equal(Q.repair(),false);assert.equal(read().rewards.wallet.coins,30);assert.equal(read().equipment.story.items.length,1);assert.equal(Q.advance('marksKnown'),false);Q.advance('trailKnown');Q.advance('marksKnown');Q.advance('campBriefed');const camp=Q.begin('camp');assert(Q.complete('camp',camp));Q.advance('campShown');assert.equal(Q.advance('completed'),false);Q.advance('cargoChecked');Q.advance('cargoVerified');Q.advance('completed');assert.equal(Q.advance('completed'),false);assert.equal(read().rewards.wallet.coins,170);assert.equal(read().chests.story.trainingXP,250);assert.equal(read().equipment.story.items[0].name,'皮甲');console.log('PASS grain quest stage gates, battle receipts, duplicate rewards, insufficient funds, repair and final report');

// Keep historical city flags set while checking every later dialogue stage.
{
 const progress={},ui={};let spoken;
 ui.window=ui;ui.GrainQuest={progress:()=>progress};vm.createContext(ui);
 vm.runInContext(fs.readFileSync('糧道劇情.js','utf8'),ui);
 ui.GrainQuestUI.install({state:{flags:{missing:true}},talk:(lines,action)=>{spoken={text:lines.map(line=>line[1]).join(' '),action};}});
 const check=(id,pattern,action=null)=>{spoken=null;assert(ui.GrainQuestUI.npc(id));assert.match(spoken.text,pattern);assert.equal(spoken.action,action);};
 check('steward',/至今未歸/,'grain:routeKnown');
 progress.heardMing=true;progress.routeKnown=true;check('steward',/茶站/);
 progress.captainBriefed=true;check('steward',/先救人/);
 progress.rescueWon=true;progress.rescueShown=true;
 check('steward',/隊長能獲救/);check('役所',/已獲救/);
 progress.captainGift=true;check('steward',/城主府/);check('役所',/覆命/);
 progress.reported=true;check('steward',/客棧休養/);check('役所',/客棧養傷/);
 check('taoqian',/客棧養傷/);
 progress.trailKnown=true;check('steward',/兩道斜刻/,'grain:marksKnown');
 check('taoqian',/核對糧車標記/);check('城主府一',/核對糧車標記/);
 progress.marksKnown=true;check('steward',/記號已核對/);
 progress.campWon=true;check('steward',/先查看寨內糧車/);check('城主府一',/先查看寨內糧車/);
 check('taoqian',/查看寨內糧車/);check('役所',/查看寨內糧車/);
 progress.cargoChecked=true;check('steward',/派人接回/,'grain:cargoVerified');check('城主府一',/先找城西管事/);
 progress.cargoVerified=true;check('steward',/請向糜別駕覆命/);check('城主府一',/平安送回/,'grain:completed');
 check('captain',/最後覆命/);check('cargo',/已交代妥當/);check('taoqian',/最後覆命/);
 progress.completed=true;check('steward',/已平安接回/);check('役所',/平安接回/);check('captain',/安心養傷/);check('taoqian',/正式成軍/,'grain:armyFormed');progress.armyFormed=true;check('taoqian',/糧道重通/);assert.doesNotMatch(spoken.text,/糧道未安/);check('cargo',/已交代妥當/);check('城主府一',/義勇已正式成軍/);ui.MiFamilyStory={canMatchmake:()=>true};assert.equal(ui.GrainQuestUI.npc('城主府一'),false);
 console.log('PASS grain NPC dialogue precedence with retained missing flag across rescue, report, clues, carts and completion');
}


{
 const saved=map.get(K);map.set(K,JSON.stringify({storyEvents:{grainRoute:{cargoVerified:true}}}));assert.equal(Q.formArmy(),false);assert(!read().unlocks);
 map.set(K,saved);const state=read();state.unlocks={story:{heroes:['劉備'],letters:['劉']},battle:{heroes:[],letters:[]}};state.chests.story.letterProgress={劉:{level:25,xp:50,quality:'綠'}};map.set(K,JSON.stringify(state));
 assert(Q.formArmy());const formed=read();assert(formed.storyEvents.grainRoute.armyFormed);assert.deepEqual(formed.unlocks.story.heroes,['劉備','關羽','張飛']);assert.deepEqual(formed.unlocks.battle.heroes,['劉備','關羽','張飛']);assert.deepEqual(formed.unlocks.story.letters,['劉']);assert.equal(formed.chests.story.letterProgress.劉.level,25);assert.deepEqual(formed.equipment.story.items.slice(-3).map(i=>i.name),['厚布衣','皮甲','硬皮甲']);const committed=map.get(K);assert.equal(Q.formArmy(),false);assert.equal(map.get(K),committed);
 const set=ctx.localStorage.setItem;map.set(K,saved);ctx.localStorage.setItem=()=>{throw Error('disk full');};assert.throws(()=>Q.formArmy(),/disk full/);assert.equal(map.get(K),saved);ctx.localStorage.setItem=set;assert(Q.formArmy());
 console.log('PASS army reward gate, old-save claim, full hero unlocks, growth preservation, once-only equipment and atomic save failure');
}

{const saved=map.get(K),city='three-kingdoms-xuzhou-story-v1';assert.equal(Q.recruitMi(),false);map.set(city,JSON.stringify({flags:{miMatchmakingDiscussed:true}}));const noQuest=JSON.parse(saved);delete noQuest.storyEvents.grainRoute.completed;map.set(K,JSON.stringify(noQuest));assert.equal(Q.recruitMi(),false);map.set(K,saved);assert.equal(Q.recruitMi(),false);map.set(city,JSON.stringify({flags:{miMatchmakingDiscussed:true,miFamilyVisited:true,miZhenPromised:true,miFamilyReturned:true}}));assert(Q.recruitMi());assert(read().unlocks.story.heroes.includes('糜竺'));assert(read().unlocks.battle.heroes.includes('糜竺'));assert(!read().unlocks.story.letters.includes('糜'));const claimed=map.get(K);assert.equal(Q.recruitMi(),false);assert.equal(map.get(K),claimed);console.log('PASS Mi recruitment requires rescue completion and finished matchmaking, once-only full card without letters');}
