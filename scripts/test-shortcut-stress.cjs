const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await browser.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(path.resolve('戰場直版.html')).href);
 await p.evaluate(()=>{localStorage.setItem('three-kingdoms-interface-preview-v1',JSON.stringify({mode:'story',storyFaction:'蜀',teams:{'story:蜀':{slots:[],itemShortcuts:['foodVoucher']}},storyItems:{foodVoucher:5}}));if(!Recruit.enabled)document.getElementById('supplyMode').click();});
 // Dispatch a burst in one turn while the async transaction is in flight.
 const before=await p.evaluate(()=>Recruit.saveState().food);
 await p.evaluate(()=>{document.getElementById('itemToggle').click();const b=document.querySelector('#itemChoices button');for(let i=0;i<20;i++)b.click();});
 await p.waitForFunction(()=>document.getElementById('shortcutStatus').textContent.includes('軍糧＋200'));
 assert.equal(await p.evaluate(()=>Recruit.saveState().food),before+200);
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')).storyItems.foodVoucher),4);
 await p.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='three-kingdoms-interface-preview-v1')throw new DOMException('fixture','QuotaExceededError');return originalSet.call(this,k,v);};document.getElementById('itemToggle').click();document.querySelector('#itemChoices button').click();});
 await p.waitForFunction(()=>document.getElementById('shortcutStatus').textContent.includes('未完成'));
 assert.equal(await p.evaluate(()=>Recruit.saveState().food),before+200);
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')).storyItems.foodVoucher),4);
 await p.evaluate(()=>{Storage.prototype.setItem=originalSet;document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));});
 // Warm up initial rendering before measuring steady-state battle frames.
 await p.waitForTimeout(2000);
 const metrics=[];
 for(const count of [50,100,200])for(const panel of ['closed','item','tactic']){
  const result=await p.evaluate(async({count,panel})=>{
   running=false;enemies=[];units=[];ended=false;started=true;elapsed=11;wave=1;spawned=99;
   const cells=[];for(let y=0;y<rows;y++)for(let x=0;x<n;x++)if(placeAllowed(x,y))cells.push({x,y});
   ['劉備','關羽','張飛'].forEach((name,i)=>{const c=cells[i];const u=makeUnit(name,c.x,c.y);u.hp=u.max=1e8;units.push(u);});
   for(let i=0;i<count;i++){spawn(1,i);const e=enemies.at(-1);e.hp=e.max=1e8;e.t=(i%15)*.35;Object.assign(e,pos(e.t));}
   document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));
   if(panel!=='closed')document.getElementById(panel==='item'?'itemToggle':'tacticToggle').click();
   const frames=[],start=performance.now();let previous=start;running=true;
   await new Promise(resolve=>{function sample(now){frames.push(now-previous);previous=now;if(now-start<1200)requestAnimationFrame(sample);else resolve();}requestAnimationFrame(sample);});
   running=false;frames.sort((a,b)=>a-b);return {count,panel,frames:frames.length,p95ms:+frames[Math.floor(frames.length*.95)].toFixed(2),advanced:elapsed>11,enemies:enemies.length};
  },{count,panel});assert.ok(result.advanced);assert.ok(result.enemies>=count);metrics.push(result);
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify(metrics,null,2));console.log('PASS 20-click burst consumes once; storage failure preserves food and inventory; 50/100/200-enemy continuous combat with each panel');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
