const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const math=Object.create(Math);math.random=()=>.05;
const c={window:{TestRoster:{劉備:{}}},Math:math,URLSearchParams,location:{search:''},localStorage:{getItem:()=>JSON.stringify(state)},elapsed:10,roster:{},mark(){},ring(){},letterMorale:()=>0,letterHit(){},weaponMotion(){},fx:[],shots:[],enemies:[],units:[],dist:(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),combatPower:u=>u.atk};
let state={mode:'story',unlocks:{story:{heroes:['劉備']}},equipment:{story:{items:[{id:'m',name:'燎原火',slot:'mount'}],loadouts:{劉備:{mount:'m'}}}}};
for(const f of ['武將裝備.js','裝備戰鬥.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);
const src=fs.readFileSync('角色戰鬥.js','utf8'),lines=src.split(/\r?\n/);
for(const name of ['hurt','shot','attackCellInRange','pierce','attack','enemyTick'])vm.runInNewContext(lines.find(l=>l.startsWith('function '+name+'(')),c);
const tick=lines.find(l=>l.startsWith('function tick('));vm.runInNewContext('function impact(dt){'+tick.slice(tick.indexOf('for(const p of shots)'))+'}',c);
const E=c.window.EquipmentBattle,S=c.window.EquipmentSystem,unit=()=>({type:'劉備',hero:true,hp:10000,max:10000,atk:100,def:0,mdef:0,interval:2,x:0,y:0,range:3,attacks:0,shield:0,blocks:0,lastHit:0,damage:0});
E.reset();const attacker=E.apply(unit());assert.equal(S.power({name:'燎原火',slot:'mount'}),421);
for(const kind of ['hit','pierce','arrow','magic','stone']){const t={...unit(),x:1};c.enemies=[t];c.shots=[];attacker.kind=kind;c.attack(attacker,t);if(c.shots.length){assert.equal(c.shots[0].basicAttack,true);c.impact(1);}assert(Math.abs(t.hp-9890)<1e-9,kind);}
for(const mode of ['skill','fixed','extra']){const t=unit();c.hurt(t,100,false,attacker,mode==='fixed',mode==='extra',mode!=='skill');assert.equal(t.hp,9900,mode);}
for(const kind of ['arrow','magic','stone']){const t={...unit(),x:1};c.enemies=[t];c.shots=[];c.shot(attacker,t,100,kind,kind==='magic');assert.equal(c.shots[0].basicAttack,false);c.impact(1);assert.equal(t.hp,9900);}
state.equipment.story.items[0].name='照夜玉獅子';E.reset();const defender=E.apply(unit()),snapshot=E.saveMounts();assert(E.validMountUnit(defender,snapshot));assert(!E.validMountUnit({...defender,equipmentBasicDodge:.9},snapshot));assert.equal(S.power({name:'照夜玉獅子',slot:'mount'}),445);assert.equal(S.scoreStats({basicDodge:1}),null);
let retaliations=0;c.window.ShuSkills={retaliate(){retaliations++;}};
for(const magic of [false,true]){const t={...defender,shield:50,blocks:1};c.hurt(t,100,magic,attacker,false,false,true);assert.equal(t.hp,10000);assert.equal(t.shield,50);assert.equal(t.blocks,1);assert.equal(t.lastHit,0);}assert.equal(retaliations,0);
for(const flags of [[false,false,false],[true,false,true],[false,true,true]]){const t={...defender};c.hurt(t,100,false,attacker,...flags);assert.equal(t.hp,9900);}
math.random=()=>.1;const boundary={...defender};c.hurt(boundary,100,false,attacker,false,false,true);assert(Math.abs(boundary.hp-9890)<1e-9);
math.random=()=>.05;c.path=[{x:0,y:0},{x:1,y:0}];c.index=()=>-1;c.pos=()=>({x:0,y:0});c.gate={x:100,y:100,hp:3000};
for(const type of ['刀','弓','策']){const t={...defender,x:1};c.units=[t];c.shots=[];const e={...unit(),type,hero:false,enemy:true,t:0,speed:0,root:0,stun:0,slow:0,nextAttack:0,nextSkill:999};c.enemyTick(e,.01);if(c.shots.length){assert.equal(c.shots[0].basicAttack,true);c.impact(1);}assert.equal(t.hp,10000,type);}
E.load({});E.loadMounts(snapshot);const restored=JSON.parse(JSON.stringify(defender));E.apply(restored);assert.equal(restored.interval,defender.interval);assert.equal(restored.equipmentBasicDodge,.1);E.loadMounts();assert.equal(E.apply(unit()).equipmentBasicDodge,undefined);
console.log('PASS basic mount melee/pierce/projectiles/enemy attacks, skill isolation, dodge boundary, shield/block preservation and snapshots');
