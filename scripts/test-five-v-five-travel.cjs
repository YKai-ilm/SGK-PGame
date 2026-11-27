const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
function setup(random=0){const map=new Map(),math=Object.create(Math);math.random=()=>random;const c={Math:math,crypto:require('crypto').webcrypto,localStorage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)}};c.window=c;vm.createContext(c);for(const file of ['shared/grain-route.js','variants/five-v-five/game.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c);return {g:c.FiveVFiveGame,map,c};}
{
 const {g,map,c}=setup();map.set('three-kingdoms-interface-preview-v1','unchanged');const before=g.read();g.go('茶站');assert(!g.read().battle);g.go('糧道谷關');assert(!g.read().battle);g.go('徐州驗證區');let s=g.read();assert.equal(s.scene,'糧道谷關');assert.equal(s.battle.kind,'encounter');assert.equal(s.battle.enemies.length,5);assert.equal(s.battle.journey.to,'徐州驗證區');const id=s.battle.id;assert.throws(()=>g.go('客棧'));assert.throws(()=>g.begin());
 // Reload must restore the sampled enemies and intended destination without rerolling.
 const enemies=JSON.stringify(s.battle.enemies);vm.runInContext(fs.readFileSync('variants/five-v-five/game.js','utf8'),c);assert.equal(c.FiveVFiveGame.read().battle.id,id);assert.equal(JSON.stringify(c.FiveVFiveGame.read().battle.enemies),enemies);
 s.party[4].hp=0;for(const u of s.party){u.attack=999;u.speed=999;}map.set(g.key,JSON.stringify(s));g.setMode('charge');for(let n=0;n<50&&!g.read().battle.outcome;n++)g.step();s=g.read();assert.equal(s.battle.outcome,'victory');assert.equal(s.coins,before.coins+12);assert.equal(s.party[4].xp,0);assert.equal(s.party[0].xp,10);assert.equal(JSON.stringify(s.progress),JSON.stringify(before.progress));const settled=map.get(g.key);g.step();assert.equal(map.get(g.key),settled);const hp=s.party.map(u=>u.hp).join(',');g.returnFromBattle();assert.equal(g.read().scene,'徐州驗證區');assert(!g.read().battle);assert.equal(g.read().party.map(u=>u.hp).join(','),hp);assert.throws(()=>g.returnFromBattle());
 g.go('客棧');assert(!g.read().battle);g.go('徐州驗證區');g.go('糧道谷關');g.retreat();const coins=g.read().coins;g.returnFromBattle();assert.equal(g.read().scene,'徐州驗證區');assert.equal(g.read().coins,coins);
 g.go('糧道谷關');s=g.read();for(const u of s.party){u.hp=1;u.attack=0;u.speed=0;}map.set(g.key,JSON.stringify(s));g.setMode('charge');for(let n=0;n<30&&!g.read().battle.outcome;n++)g.step();assert.equal(g.read().battle.outcome,'defeat');g.returnFromBattle();assert.equal(g.read().scene,'徐州驗證區');assert(g.read().party.every(u=>u.hp===0));assert.throws(()=>g.go('糧道谷關'));assert.equal(map.get('three-kingdoms-interface-preview-v1'),'unchanged');
}
{
 const {g}=setup(.99);g.go('徐州驗證區');assert.equal(g.read().scene,'徐州驗證區');assert(!g.read().battle);g.go('糧道谷關');assert(!g.read().battle);g.go('盜糧匪寨');assert(!g.read().battle);
}
{
 const {g,map,c}=setup();const before=g.read();c.localStorage.setItem=()=>{throw Error('quota');};assert.throws(()=>g.go('徐州驗證區'));assert(!map.has(g.key));assert.equal(g.read().scene,before.scene);
}
console.log('PASS outdoor encounter/safe routes, reload, one-time reward, living XP, story/save isolation, victory arrival, retreat/defeat origin, dead travel guard and atomic persistence');
