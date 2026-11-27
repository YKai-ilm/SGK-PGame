const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const map=new Map(),c={crypto:require('crypto').webcrypto,localStorage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)},SWALLOW_CAMPAIGN:true};c.window=c;vm.createContext(c);
for(const f of ['人物評定草案.js','武將品質草案.js','寶箱系統.js','shared/grain-route.js','variants/five-v-five/game.js','variants/five-v-five/吞食寶箱.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const g=c.FiveVFiveGame,shop=c.SwallowChests,key=g.key,save=s=>map.set(key,JSON.stringify(s));map.set('three-kingdoms-interface-preview-v1','untouched');
let s=g.read();s.coins=500;s.diamonds=20;save(s);
const seq=list=>()=>list.shift();
// 同箱兩次完整卡抽到同一人，第二張即轉同名碎片。
let r=shop.open(1,'buy',0,()=>0);assert.equal(r.items[0].kind,'hero');assert.equal(r.items[1].kind,'fragment');assert.equal(r.items[1].converted,true);assert.equal(g.read().coins,400);assert(shop.owned().has(r.items[0].name));
const acquired=r.items[0].name,before=map.get(key);assert.throws(()=>shop.open(1,'buy',0));assert.equal(map.get(key),before);
assert.throws(()=>shop.open(4,'buy',1));assert.throws(()=>shop.open(2,'buy',1));assert.throws(()=>shop.open(2,'stock',1));assert.throws(()=>shop.open(1,'buy',1,()=>NaN));assert.equal(map.get(key),before);
r=shop.open(3,'buy',1,seq([.9,.5,.5,.1,.9,.9]));assert.equal(g.read().diamonds,10);assert(r.items.every(x=>['hero','fragment'].includes(x.kind)));
s=g.read();s.shop.boxes[2]=1;save(s);const coins=s.coins;shop.open(2,'stock',2,()=>.9);assert.equal(g.read().shop.boxes[2],0);assert.equal(g.read().coins,coins);
s=g.read();s.coins=0;save(s);const poor=map.get(key);assert.throws(()=>shop.open(1,'buy',3));assert.equal(map.get(key),poor);
s=g.read();s.coins=200;save(s);const stable=map.get(key),write=c.localStorage.setItem;c.localStorage.setItem=()=>{throw Error('quota');};assert.throws(()=>shop.open(1,'buy',3));assert.equal(map.get(key),stable);c.localStorage.setItem=write;
shop.deploy(acquired);assert(g.read().party.some(u=>u.name===acquired));assert.throws(()=>shop.deploy(acquired));
s=g.read();s.party=[{name:'劉備',hp:13,max:260,attack:80,speed:10,xp:77},...['關羽','張飛','趙雲','黃忠'].map(name=>({name,hp:1,max:260,attack:80,speed:10,xp:0}))];s.formationOrder=[0,1,2,3,4];save(s);shop.deploy(acquired,0);assert.equal(g.read().reserves['劉備'].hp,13);assert.equal(g.read().reserves['劉備'].xp,77);shop.deploy('劉備',0);assert.equal(g.read().party[0].hp,13);assert.equal(g.read().party[0].xp,77);
s=g.read();s.battle={enemies:[],queue:[],phase:'ended',outcome:'victory'};save(s);assert.throws(()=>shop.deploy(acquired,0));
assert.equal(map.get('three-kingdoms-interface-preview-v1'),'untouched');console.log('PASS mixed chests, duplicate conversion, currencies, stock, stale click, atomic writes, owned cards, reserve HP/XP and save isolation');
