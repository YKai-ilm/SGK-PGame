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
 progress.routeKnown=true;check('steward',/茶站/);
 progress.captainBriefed=true;check('steward',/先救人/);
 progress.rescueWon=true;progress.rescueShown=true;
 check('steward',/隊長能獲救/);check('役所',/已獲救/);
 progress.captainGift=true;check('steward',/城主府/);check('役所',/覆命/);
 progress.reported=true;check('steward',/客棧休養/);check('役所',/客棧養傷/);
 progress.trailKnown=true;check('steward',/兩道斜刻/,'grain:marksKnown');
 progress.marksKnown=true;check('steward',/記號已核對/);
 progress.campWon=true;check('steward',/先查看寨內糧車/);check('城主府一',/先查看寨內糧車/);
 progress.cargoChecked=true;check('steward',/派人接回/,'grain:cargoVerified');check('城主府一',/先找城西管事/);
 progress.cargoVerified=true;check('steward',/請向糜別駕覆命/);check('城主府一',/平安送回/,'grain:completed');
 progress.completed=true;check('steward',/已平安接回/);check('役所',/平安接回/);check('captain',/安心養傷/);
 console.log('PASS grain NPC dialogue precedence with retained missing flag across rescue, report, clues, carts and completion');
}
