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
assert.deepEqual(Array.from(H.revisedCatalog,x=>x.cost),[2,5,9,14,3,7,12,4,18]);
for(const [missing,expected] of [[200,'chixin'],[500,'chixin'],[1000,'tongxian'],[1800,'yinxian']])assert.equal(H.choose({...newer,units:[{id:'a',hero:true,hp:2000-missing,max:2000}]}).choice.id,expected);
assert.equal(H.choose({...newer,units:['a','b','c'].map(id=>({id,hero:true,hp:1700,max:2000}))}).choice.id,'tuanfu');
assert.equal(H.choose({...newer,units:[{id:'a',hero:true,hp:100,max:2000,nextHit:800}]}).choice.id,'tongxian');
for(const spell of H.revisedCatalog.filter(c=>!c.pending)){const results=[6000,20000].map(max=>H.choose({...newer,category:spell.category,hasBook:true,cooling:H.revisedCatalog.filter(x=>x.id!==spell.id).map(x=>x.id),units:[{id:'a',hero:true,hp:max-5000,max}]}).choice);assert.equal(results[0].immediate,spell.instant);assert.equal(results[0].effective,spell.instant+(spell.hot||0));assert.equal(results[1].effective,results[0].effective);}
const bookRisk=H.choose({...newer,category:'策裝',hasBook:true,units:[{id:'a',hero:true,hp:100,max:2000,nextHit:800}]}).choice;assert.equal(bookRisk.saved,0);assert.equal(bookRisk.immediate,400);assert.equal(bookRisk.effective,850);
assert.throws(()=>H.choose({...newer,model:'unknown'}));console.log('PASS revised fixed heals, SP, targets, urgent rescue and delayed-book isolation');

for(const level of [1,20,100]){const units=[{id:'a',hero:true,hp:1000,max:5000}];assert.equal(H.choose({...newer,level,units}).choice.id,'jinxian');assert.equal(H.choose({...newer,level,intelligence:64,units}).choice.id,'chixin');assert.equal(H.choose({...newer,level,sp:2,units}).choice.id,'chixin');}
assert.equal(H.choose({...newer,level:1,units:[{id:'a',hero:true,hp:4800,max:5000}]}).choice.id,'chixin');
console.log('PASS intelligence-only access, level invariance and high-intelligence low-tier selection');

const group=(count,missing)=>Array.from({length:count},(_,i)=>({id:'g'+i,hero:true,hp:5000-missing,max:5000}));
for(const [count,missing,expected] of [[1,200,'chixin'],[1,600,'tongxian'],[1,1000,'tongxian'],[3,200,'tuanfu'],[3,600,'qunxian'],[5,1000,'guangji']]){
 const units=group(count,missing),before=JSON.stringify(units),r=H.choose({...newer,units}).choice;assert.equal(r.id,expected);assert(r.targets.length<=H.revisedCatalog.find(c=>c.id===expected).targets);assert.equal(r.effective,count*missing);assert.equal(JSON.stringify(units),before);
}
const many=H.choose({...newer,units:group(20,1500)}).choice;assert.equal(many.id,'guangji');assert.equal(many.targets.length,5);assert.equal(many.effective,7500);
assert.equal(H.choose({...newer,category:'策裝',hasBook:false,units:group(1,1500)}).choice,null);
assert.equal(H.choose({...newer,category:'策裝',hasBook:true,cooling:['futi'],units:group(1,1500)}).choice,null);
assert.equal(H.choose({...newer,category:'策裝',hasBook:true,units:group(1,1500).map(u=>({...u,hero:false}))}).choice,null);
assert.equal(H.choose({...newer,category:'策防',hasBook:true,units:group(1,1000)}).choice.id,'tongxian');
console.log('PASS single/group selection, 5-target cap, overheal, book cooldown and category separation');

const puluo=H.revisedCatalog.find(c=>c.id==='puluo');assert.equal(puluo.instant,3900);assert.equal(puluo.targets,5);assert.equal(puluo.cost,18);assert.equal(puluo.intelligence,96);assert.equal(H.choose({...newer,sp:10000,intelligence:100,units:group(5,4500)}).choice.id,'puluo');assert.equal(H.choose({...newer,units:group(3,300)}).choice.id,'tuanfu');assert.equal(H.choose({...newer,units:group(3,1000)}).choice.id,'qunxian');assert.equal(H.choose({...newer,units:group(5,2200)}).choice.effective,11000);console.log('PASS updated group amounts and Puluo availability');

for(const [intel,sp,expected] of [[95,100,'guangji'],[96,17,'guangji'],[96,18,'puluo']])assert.equal(H.choose({...newer,level:1,intelligence:intel,sp,units:group(5,3900)}).choice.id,expected);
const p=H.choose({...newer,level:1,intelligence:96,sp:18,units:group(8,3900)}).choice;assert.equal(p.id,'puluo');assert.equal(p.targets.length,5);assert.equal(p.effective,19500);assert.equal(H.choose({...newer,cooling:['puluo'],units:group(5,3900)}).choice.id,'guangji');assert.equal(H.choose({...newer,intelligence:96,units:group(1,200)}).choice.id,'chixin');console.log('PASS Puluo 96 intelligence/18 SP boundary, cap, cooldown and low-tier retention');
