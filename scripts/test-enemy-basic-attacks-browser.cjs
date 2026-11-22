const assert=require('node:assert/strict');
const {chromium}=require(process.env.USERPROFILE+'/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{const p=await browser.newPage();await p.addInitScript(()=>window.GameAudioShell=true);await p.goto('http://localhost:4192/戰場直版.html?storySweep=1');const result=await p.evaluate(()=>{
 running=false;const check=(ok,text)=>{if(!ok)throw Error(text);};
 function setup(type,version=7){reset();running=false;VillageSweep.load({...VillageSweep.save(),waves:6,combatVersion:version,encounterId:'rabble',enemyOfficer:null});path=[{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0}];elapsed=1;units=[];enemies=[];shots=[];Object.assign(gate,{x:5,y:0,hp:3000,max:3000});spawn(1,0);const e=enemies[0];Object.assign(e,BasicTroops.combatStats(type,1),{type,max:BasicTroops.combatStats(type,1).hp,t:0,x:0,y:0,nextAttack:0,speed:0});return e;}
 function unit(x,y){const u=makeUnit('刀',x,y);units.push(u);return u;}
 let e=setup('槍');const a=unit(1,0),b=unit(2,0),side=unit(1,1),far=unit(3,0),behind=unit(-1,0);const damage=e.atk*100/(100+a.def);enemyTick(e,0);check(Math.abs(a.max-a.hp-damage)<1e-8&&Math.abs(b.max-b.hp-damage)<1e-8,'貫穿傷害或防禦計算錯誤');check(side.hp===side.max&&far.hp===far.max&&behind.hp===behind.max,'貫穿命中側面、背後或射程外');const hp=a.hp;elapsed=2;enemyTick(e,0);check(a.hp===hp,'攻擊冷卻提前');elapsed=2.101;enemyTick(e,0);check(a.hp<hp,'攻擊冷卻未恢復');
 e=setup('槍',4);const oldA=unit(1,0),oldB=unit(2,0);enemyTick(e,0);check(oldA.hp<oldA.max&&oldB.hp===oldB.max,'舊戰局行為改變');
 e=setup('槍');unit(1,0);Object.assign(gate,{x:2,y:0});enemyTick(e,0);check(gate.hp<gate.max,'射程內據點未受貫穿');
 e=setup('刀');const knifeA=unit(1,0),knifeB=unit(2,0);enemyTick(e,0);check(knifeA.hp<knifeA.max&&knifeB.hp===knifeB.max,'刀兵不應貫穿');
 e=setup('弓');const bowTarget=unit(4,0);enemyTick(e,0);check(shots.length===1&&shots[0].target===bowTarget&&shots[0].kind==='arrow'&&bowTarget.hp===bowTarget.max,'弓兵射程或箭矢建立錯誤');
 e=setup('槍');const stunnedTarget=unit(1,0);e.stun=2;enemyTick(e,0);check(stunnedTarget.hp===stunnedTarget.max,'暈眩中仍攻擊');e.stun=0;e.hp=0;enemyTick(e,0);check(stunnedTarget.hp===stunnedTarget.max,'陣亡後仍攻擊');
 e=setup('刀');e.speed=1;unit(1,0);for(let i=0;i<30;i++){elapsed+=.05;enemyTick(e,.05);}check(e.t<=.28+1e-8&&units[0].hp<units[0].max,'阻擋時位置或攻擊錯誤');units[0].hp=0;const oldT=e.t;enemyTick(e,.2);check(e.t>oldT,'守軍陣亡後敵兵卡住');
 return true;
});assert(result);console.log('PASS enemy spear line/range/defense/cooldown, legacy single target, gate, knife/bow behavior, stun/death and blocker movement');}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
