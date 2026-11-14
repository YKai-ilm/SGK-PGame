const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const c={window:{}};for(const f of ['軍師計策試算.js','恢復計策試算.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);const H=c.window.HealingStudy;
const opts={intelligence:99,level:40,sp:200};
for(const scene of H.scenarios){const before=JSON.stringify(scene.units),r=H.choose({...opts,units:scene.units});assert.equal(r.choice?.id??null,scene.expected,scene.name);assert.equal(JSON.stringify(scene.units),before,'study must not mutate units');console.log(scene.name+' => '+(r.choice?.name||'不施放'));}
const injured=[{id:'a',hero:true,hp:950,max:1000}];
assert.equal(H.choose({...opts,sp:1,units:injured}).choice,null);
assert.equal(H.choose({...opts,level:1,units:injured}).choice.id,'chixin');
assert.equal(H.choose({...opts,intelligence:64,level:6,units:injured}).choice.id,'chixin');
assert.equal(H.choose({...opts,intelligence:65,level:6,units:injured}).choice.id,'tongxian');
assert.equal(H.choose({...opts,cooling:['策防'],units:injured}).choice,null);
assert.equal(H.choose({...opts,category:'策裝',units:injured}).choice,null);
const futi=H.choose({...opts,hasBook:true,category:'策裝',units:injured});assert.equal(futi.choice.id,'futi');assert.equal(futi.choice.cost,4);
assert.equal(H.choose({...opts,hasBook:true,category:'策裝',units:[{...injured[0],hero:false}]}).choice,null);
const urgency=H.choose({...opts,hasBook:true,category:'策裝',units:[{id:'a',hero:true,hp:40,max:1000,nextHit:90}]});assert.equal(urgency.choice.saved,0,'delayed healing must not count toward immediate survival');
const pendingRisk=H.choose({...opts,units:[{id:'a',hero:true,hp:40,max:1000,nextHit:100,pending:1000}]});assert.equal(pendingRisk.choice.id,'yinxian');
assert.equal(H.choose({...opts,hasBook:true,category:'策裝',units:[{id:'b',hero:true,hp:600,max:1000},{id:'a',hero:true,hp:400,max:1000}]}).choice.targets[0],'a');
for(let intel=50;intel<=100;intel+=5)for(let level=1;level<=40;level+=3)for(const scene of H.scenarios){const sp=c.window.SPStudy.capacity(intel,level),r=H.choose({intelligence:intel,level,sp,units:scene.units});if(r.choice){const spell=H.catalog.find(x=>x.id===r.choice.id);assert.ok(spell.cost<=sp&&spell.intelligence<=intel&&spell.level<=level);assert.ok(r.choice.targets.length<=spell.targets);assert.ok(r.choice.effective>0);}}
console.log('PASS 1,386 unlock/budget scenarios plus category isolation, living soldier healing, lowest-hero book target, cooldown, delayed-heal urgency and no mutation');
