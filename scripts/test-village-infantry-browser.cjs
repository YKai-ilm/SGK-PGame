const assert=require('node:assert/strict');const {chromium}=require(process.env.USERPROFILE+'/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage();await p.addInitScript(()=>window.GameAudioShell=true);await p.goto('http://localhost:4192/戰場直版.html?storySweep=1');
const results=await p.evaluate(()=>{
const out=[];
for(const tuned of [false,true])for(const name of ['測試將','劉備','關羽','趙雲'])for(const team of [false,true]){
const s={mode:'story',tutorial:{status:'completed'}};delete TestRoster.測試將;PlayerOfficer.create(s,'測試將','武');localStorage.setItem(PlayerOfficer.key,JSON.stringify(s));PlayerOfficer.register(s);PlayerBattle.load({runId:crypto.randomUUID(),player:s.playerOfficer,weapon:null,defaultSword:true});Math.random=()=>.42;reset();VillageSweep.load({...VillageSweep.save(),waves:6,combatVersion:tuned?5:4,encounterId:'rabble',enemyOfficer:null});BattleResults.finish=()=>{};
path=BattleRoutes.build(n,rows,'step1');
const point=path[7],u=makeUnit(name,point.x,point.y);units.push(u);if(team){const pt=path[6];units.push(makeUnit('刀',pt.x,pt.y));for(const type of ['槍','弓']){let chosen;for(let y=0;y<rows;y++)for(let x=0;x<n;x++)if(index(x,y)<0&&!units.some(u=>u.x===x&&u.y===y)&&(!chosen||Math.hypot(x-pt.x,y-pt.y)<chosen.d))chosen={x,y,d:Math.hypot(x-pt.x,y-pt.y)};units.push(makeUnit(type,chosen.x,chosen.y));}}
started=true;running=false;let low=1;for(let i=0;i<12000&&!ended;i++){tick(.05);low=Math.min(low,u.hp/u.max);}out.push({tuned,name,team,quality:roster[name].quality,attack:Math.round(roster[name].atk),startHP:roster[name].hp,win:gate.hp>0&&ended,low:Math.round(low*100),hp:Math.round(u.hp/u.max*100),kills,level:u.level});}
return out;
});const solo=results.find(r=>r.tuned&&r.name==='測試將'&&!r.team),team=results.find(r=>r.tuned&&r.name==='測試將'&&r.team);assert.equal(solo.win,false);assert.equal(team.win,true);assert(results.filter(r=>!r.tuned).every(r=>r.win));console.log('PASS actual six-wave combat: level-1 unequipped player alone fails, supported formation wins; regular officers sampled across old/new infantry');console.log(JSON.stringify(results));await b.close();})().catch(e=>{console.error(e);process.exitCode=1;});


