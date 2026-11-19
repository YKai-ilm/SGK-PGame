const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');let store,fail=false;
const c={window:null,crypto:require('crypto').webcrypto,navigator:{},localStorage:{getItem:()=>store,setItem(k,v){if(fail)throw Error('quota');store=v;}}};c.window=c;vm.createContext(c);
for(const f of ['玩家武將.js','共用錢包.js','人物評定草案.js','武將品質草案.js','寶箱系統.js','字卡泡泡球資料.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const s={tutorial:{status:'completed'},mode:'story',storyFaction:'蜀',rewards:{wallet:{coins:5000,diamonds:0}}};c.PlayerOfficer.create(s,'泡泡將','全能');store=JSON.stringify(s);
function round(score,abandon=false){const g=c.BubbleTraining.start(100),p=JSON.parse(store);p.bubbleTraining.active.score=score;store=JSON.stringify(p);return c.BubbleTraining.finish(g.id,50000,abandon);}
let r=round(0);assert.equal(r.playerFragments,14);assert.equal(JSON.parse(store).playerOfficer.fragments,14);assert.equal(c.BubbleTraining.finish(r.id).playerFragments,14);assert.equal(JSON.parse(store).playerOfficer.fragments,14);
r=round(300);assert.equal(r.playerFragments,5);r=round(600);assert.equal(r.playerFragments,6);r=round(900);assert.equal(r.playerFragments,6);const before=JSON.parse(store).playerOfficer.fragments;r=round(600,true);assert.equal(r.playerFragments,0);assert.equal(JSON.parse(store).playerOfficer.fragments,before);
const g=c.BubbleTraining.start(100),saved=store;fail=true;assert.throws(()=>c.BubbleTraining.finish(g.id,50000));assert.equal(store,saved);fail=false;c.BubbleTraining.finish(g.id,50000);assert.equal(JSON.parse(store).playerOfficer.fragments,before+4);
console.log('PASS bubble 4/5/6 fragments, first +10 once, score cap, abandonment exclusion and atomic failure retry');
