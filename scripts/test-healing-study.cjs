const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const c={window:{}};for(const f of ['軍師計策試算.js','恢復計策試算.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);const H=c.window.HealingStudy;
const opts={intelligence:99,level:40,sp:200};
for(const scene of H.scenarios){const before=JSON.stringify(scene.units),r=H.choose({...opts,units:scene.units});assert.equal(r.choice?.id??null,scene.expected,scene.name);assert.equal(JSON.stringify(scene.units),before,'study must not mutate units');console.log(scene.name+' => '+(r.choice?.name||'不施放'));}
const injured=[{id:'a',hero:true,hp:820,max:1000}];
assert.equal(H.choose({...opts,sp:1,units:injured}).choice,null);
assert.equal(H.choose({...opts,level:1,units:injured}).choice.id,'tongxian');
assert.equal(H.choose({...opts,intelligence:64,level:6,units:injured}).choice.id,'chixin');
assert.equal(H.choose({...opts,intelligence:65,level:6,units:injured}).choice.id,'tongxian');
assert.equal(H.choose({...opts,cooling:['策防'],units:injured}).choice,null);
assert.equal(H.choose({...opts,category:'策裝',units:injured}).choice,null);
const futi=H.choose({...opts,hasBook:true,category:'策裝',units:injured});assert.equal(futi.choice.id,'futi');assert.equal(futi.choice.cost,4);
assert.equal(H.choose({...opts,hasBook:true,category:'策裝',units:[{...injured[0],hero:false}]}).choice,null);
const urgency=H.choose({...opts,hasBook:true,category:'策裝',units:[{id:'a',hero:true,hp:40,max:1000,nextHit:200}]});assert.equal(urgency.choice.saved,0,'delayed healing must not count toward immediate survival');
const pendingRisk=H.choose({...opts,units:[{id:'a',hero:true,hp:40,max:1000,nextHit:300,pending:1000}]});assert.equal(pendingRisk.choice.id,'yinxian');
assert.equal(H.choose({...opts,hasBook:true,category:'策裝',units:[{id:'b',hero:true,hp:600,max:1000},{id:'a',hero:true,hp:400,max:1000}]}).choice.targets[0],'a');
for(let intel=50;intel<=100;intel+=5)for(let level=1;level<=40;level+=3)for(const scene of H.scenarios){const sp=c.window.SPStudy.capacity(intel,level),r=H.choose({intelligence:intel,level,sp,units:scene.units});if(r.choice){const spell=H.catalog.find(x=>x.id===r.choice.id);assert.ok(spell.cost<=sp&&spell.intelligence<=intel);assert.ok(r.choice.targets.length<=spell.targets);assert.ok(r.choice.effective>0);}}
console.log('PASS 1,386 unlock/budget scenarios plus category isolation, living soldier healing, lowest-hero book target, cooldown, delayed-heal urgency and no mutation');

assert.deepEqual(Array.from(H.catalog,x=>x.cost),[2,5,9,14,3,7,12,4]);
assert.deepEqual(Array.from(H.catalog,x=>x.instant),[80,220,480,800,40,120,180,120]);
// Identical missing HP at radically different maximum HP receives the same fixed amount.
for(const spell of H.catalog){
 const results=[2000,20000].map(max=>H.choose({...opts,category:spell.category,hasBook:true,cooling:H.catalog.filter(x=>x.id!==spell.id).map(x=>x.id),units:[{id:'t',hero:true,hp:max-1000,max}]}).choice);
 assert.equal(results[0].id,spell.id);assert.equal(results[0].immediate,spell.instant);assert.equal(results[0].effective,spell.instant+(spell.hot||0));assert.equal(results[1].immediate,results[0].immediate);assert.equal(results[1].effective,results[0].effective);
}
const clipped=H.choose({...opts,units:[{id:'a',hero:true,hp:1990,max:2000}]});assert.equal(clipped.choice.immediate,10);assert.equal(clipped.choice.effective,10);
console.log('PASS exact approved SP costs, fixed healing at 2,000 vs 20,000 max HP, and overheal cap');

const newer={...opts,level:100,model:'hp-review'};
assert.deepEqual(Array.from(H.revisedCatalog,x=>x.cost),[2,5,9,14,3,7,12,4]);
for(const [missing,expected] of [[200,'chixin'],[500,'chixin'],[1000,'tongxian'],[1800,'yinxian']])assert.equal(H.choose({...newer,units:[{id:'a',hero:true,hp:2000-missing,max:2000}]}).choice.id,expected);
assert.equal(H.choose({...newer,units:['a','b','c'].map(id=>({id,hero:true,hp:1700,max:2000}))}).choice.id,'qunxian');
assert.equal(H.choose({...newer,units:[{id:'a',hero:true,hp:100,max:2000,nextHit:800}]}).choice.id,'tongxian');
for(const spell of H.revisedCatalog){const results=[6000,20000].map(max=>H.choose({...newer,category:spell.category,hasBook:true,cooling:H.revisedCatalog.filter(x=>x.id!==spell.id).map(x=>x.id),units:[{id:'a',hero:true,hp:max-5000,max}]}).choice);assert.equal(results[0].immediate,spell.instant);assert.equal(results[0].effective,spell.instant+(spell.hot||0));assert.equal(results[1].effective,results[0].effective);}
const bookRisk=H.choose({...newer,category:'策裝',hasBook:true,units:[{id:'a',hero:true,hp:100,max:2000,nextHit:400}]}).choice;assert.equal(bookRisk.saved,0);assert.equal(bookRisk.immediate,240);assert.equal(bookRisk.effective,480);
assert.throws(()=>H.choose({...newer,model:'unknown'}));console.log('PASS revised fixed heals, SP, targets, urgent rescue and delayed-book isolation');

for(const level of [1,20,100]){const units=[{id:'a',hero:true,hp:1000,max:5000}];assert.equal(H.choose({...newer,level,units}).choice.id,'jinxian');assert.equal(H.choose({...newer,level,intelligence:64,units}).choice.id,'chixin');assert.equal(H.choose({...newer,level,sp:2,units}).choice.id,'chixin');}
assert.equal(H.choose({...newer,level:1,units:[{id:'a',hero:true,hp:4800,max:5000}]}).choice.id,'chixin');
console.log('PASS intelligence-only access, level invariance and high-intelligence low-tier selection');
