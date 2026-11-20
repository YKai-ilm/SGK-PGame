const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');let party=[];const c={window:null,crypto:require('crypto').webcrypto,localStorage:{getItem:()=>JSON.stringify({party})}};c.window=c;c.OFFICER_PROPOSAL={entries:[]};vm.createContext(c);for(const f of ['共用錢包.js','寶箱系統.js','玩家武將.js','任務成就.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);const R=c.ProgressRewards,P=c.PlayerOfficer;
const fresh=()=>{const s={mode:'story',tutorial:{status:'skipped'},teams:{},storyEvents:{}};P.create(s,'測試將','全能');R.init(s);return s;};let s=fresh();assert.equal(R.claim(s,'chapter-1'),null);assert.equal(R.claim(s,'chapter-1-1'),null);party=['關羽'];assert.equal(R.claim(s,'chapter-1-1'),null);party=['關羽','張飛'];assert.equal(R.claim(s,'chapter-1-1').playerFragments,10);assert.equal(R.claim(s,'chapter-1-1'),null);party=[];s.storyEvents.peachOath=true;s.rewards.claims['peachOath:diamonds-v1']={diamonds:2};assert.equal(R.claim(s,'chapter-1-2').playerFragments,10);assert.equal(R.claim(s,'peachOath'),null);assert.equal(R.claim(s,'chapter-1'),null);s.rewards.claims.taoyuanMotherFarewell={items:['木劍']};assert.equal(R.claim(s,'chapter-1-3').playerFragments,10);assert.equal(R.claim(s,'chapter-1').playerFragments,20);assert.equal(s.playerOfficer.fragments,50);assert.equal(s.rewards.wallet.diamonds,0);assert.equal(s.rewards.wallet.coins,0);
for(const q of [{rescued:true},{chestOpened:true},{completed:true}]){s.storyEvents.yunlongRescue=q;assert.equal(R.claim(s,'chapter-2-4'),null);}s.storyEvents.yunlongRescue={completed:true,bookGiven:true};assert.equal(R.claim(s,'chapter-2-4').playerFragments,10);s=JSON.parse(JSON.stringify(s));for(const id of ['chapter-1-1','chapter-1-2','chapter-1-3','chapter-1','chapter-2-4'])assert.equal(R.claim(s,id),null);assert.equal(s.playerOfficer.fragments,60);s.mode='battle';assert(!R.rows(s).some(x=>x.playerFragments));
const old=fresh();old.storyEvents.peachOath=true;old.rewards.history.push({key:'chapter:1-2:player-fragments-v1'});assert.equal(R.claim(old,'chapter-1-2'),null);assert.equal(R.claim(old,'chapter-1-1').playerFragments,10);delete old.playerOfficer;assert(!R.rows(old).some(x=>x.playerFragments));console.log('PASS chapter boundaries, 10/20 fragments, old-save eligibility, independent prior rewards, no early Huatuo award, reload/history deduplication and battle isolation');

// Grain rewards require the final report, not either battle or the cart handoff.
{
 const state=fresh(),g=state.storyEvents.grainRoute={};
 const stages=[['routeKnown','明叔'],['heardMing','開始救援'],['rescueWon','領取贈禮'],['captainGift','報平安'],['reported','客棧'],['trailKnown','確認糧車標記'],['marksKnown','擊退鄧茂'],['campWon','查看黑風寨'],['cargoChecked','安排接運'],['cargoVerified','最後覆命']];
 for(const [flag,hint] of stages){g[flag]=true;const row=R.rows(state).find(x=>x.id==='chapter-2-1');assert(row.desc.includes(hint),flag);assert.equal(row.value,0);assert.equal(R.claim(state,'chapter-2-1'),null);}
 g.completed=true;assert.match(R.rows(state).find(x=>x.id==='chapter-2-1').desc,/運糧護衛已完成/);
 assert.equal(R.claim(state,'chapter-2-1').playerFragments,10);assert.equal(state.playerOfficer.fragments,10);
 const restored=JSON.parse(JSON.stringify(state));assert.equal(R.claim(restored,'chapter-2-1'),null);assert.equal(restored.playerOfficer.fragments,10);
 delete restored.rewards.claims['chapter:2-1:player-fragments-v1'];assert.equal(R.claim(restored,'chapter-2-1'),null);
 restored.mode='battle';assert(!R.rows(restored).some(x=>x.id==='chapter-2-1'));
 console.log('PASS grain objectives, final-report reward boundary, 10 fragments once, history fallback and mode isolation');
}

{const s=fresh();s.storyEvents.grainRoute={completed:true};assert.equal(R.claim(s,'chapter-2-2'),null);s.storyEvents.grainRoute.armyFormed=true;assert.equal(R.claim(s,'chapter-2-2').playerFragments,10);assert.equal(R.claim(s,'chapter-2-2'),null);}

{const s=fresh();s.storyEvents.grainRoute={completed:true,armyFormed:true};assert.equal(R.claim(s,'chapter-2-3'),null);s.storyEvents.grainRoute.miRecruited=true;assert.equal(R.claim(s,'chapter-2-3').playerFragments,10);assert.equal(R.claim(s,'chapter-2-3'),null);}

{
 const state=fresh();state.storyEvents.peachOath=true;state.rewards.claims.taoyuanMotherFarewell={};
 const row=R.rows(state).find(x=>x.id==='chapter-1');assert.equal(row.chestCount,1);assert.equal(row.playerFragments,20);
 const receipt=R.claim(state,'chapter-1');assert.equal(receipt.chestCount,1);assert.equal(state.chests.shared.boxes[2],1);assert.equal(R.claim(state,'chapter-1'),null);
 const restored=JSON.parse(JSON.stringify(state));restored.rewards.claims={taoyuanMotherFarewell:{}};assert.equal(R.claim(restored,'chapter-1'),null);
 const legacy=fresh();legacy.storyEvents.peachOath=true;legacy.rewards.claims.taoyuanMotherFarewell={};legacy.rewards.history.push({key:'chapter:1:player-fragments-v1',playerFragments:20});legacy.playerOfficer.fragments=20;
 const topup=R.rows(legacy).find(x=>x.id==='chapter-1');assert.equal(topup.claimed,false);assert.equal(topup.playerFragments,0);assert.equal(topup.chestCount,1);
 assert.equal(R.claim(legacy,'chapter-1').chestCount,1);assert.equal(legacy.playerOfficer.fragments,20);assert.equal(legacy.chests.shared.boxes[2],1);assert.equal(R.claim(legacy,'chapter-1'),null);
 const sub=fresh();sub.storyEvents.peachOath=true;assert.equal(R.claim(sub,'chapter-1-2').chestCount,0);assert.equal(sub.chests?.shared?.boxes?.[2]||0,0);sub.mode='battle';assert(!R.rows(sub).some(x=>x.chestCount));
 console.log('PASS main chapter tier-2 chest, separate old-save top-up, no duplicate fragments/chests, history recovery and no subchapter chest');
}

{const s=fresh();s.storyEvents.yellowOpening={outpostWon:true,hqWon:true,reported:true};assert.equal(R.claim(s,'chapter-3-1'),null);s.storyEvents.yellowOpening.completed=true;const reward=R.claim(s,'chapter-3-1');assert.equal(reward.playerFragments,10);assert.equal(reward.chestCount||0,0);assert.equal(R.claim(s,'chapter-3-1'),null);assert(!R.rows(s).some(r=>r.id==='chapter-3'));}
