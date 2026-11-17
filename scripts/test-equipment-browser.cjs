const assert=require('node:assert/strict'),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
process.env.PORT='4187';const server=require('./serve.cjs');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const context=await browser.newContext({serviceWorkers:'block'});
 await context.addInitScript(()=>{localStorage.setItem('three-kingdoms-interface-preview-v1',JSON.stringify({mode:'battle',unlocks:{battle:{heroes:['劉備']}},equipment:{battle:{items:[{id:'gold',name:'金項鍊',slot:'accessory'}],loadouts:{劉備:{accessory:'gold'}}}}}));});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4187/index.html#page='+encodeURIComponent('戰場直版.html'));
 const frame=await new Promise(resolve=>{const poll=setInterval(()=>{const f=page.frames().find(f=>decodeURIComponent(f.url()).includes('戰場直版.html')&&f!==page.mainFrame());if(f){clearInterval(poll);resolve(f);}},100);});
 await frame.waitForFunction(()=>window.BattleSave&&window.Recruit);
 const result=await frame.evaluate(()=>{
  reset();const free=Array.from({length:n*rows},(_,i)=>({x:i%n,y:Math.floor(i/n)})).find(p=>!terrainBlocks.some(b=>b.x===p.x&&b.y===p.y));const base=roster['劉備'].hp,u=makeUnit('劉備',free.x,free.y);units.push(u);
  const save=BattleSave.capture();BattleSave.validate(save);BattleSave.restore(JSON.parse(JSON.stringify(save)));
  const restored=units.find(v=>v.type==='劉備');
  const output={base,created:u.max,restored:restored.max,newUnit:makeUnit('劉備',1,0).max};
  const bad=JSON.parse(JSON.stringify(save));bad.state.entities.find(v=>v.type==='劉備').equipmentHP=8000;
  try{BattleSave.validate(bad);output.badAccepted=true;}catch{output.badAccepted=false;}
  const old=JSON.parse(JSON.stringify(save));delete old.state.equipment;for(const v of old.state.entities){if(v.equipmentHP){v.max-=v.equipmentHP;v.hp-=v.equipmentHP;delete v.equipmentHP;}}
  BattleSave.restore(old);output.old=units.find(v=>v.type==='劉備').max;output.oldNew=makeUnit('劉備',1,0).max;return output;
 });
 assert.equal(result.created,result.base+500);assert.equal(result.restored,result.created);assert.equal(result.newUnit,result.created);assert.equal(result.badAccepted,false);assert.equal(result.old,result.base);assert.equal(result.oldNew,result.base);
 console.log('PASS real battle creation, save validation, restore without double bonus and legacy save compatibility',result);
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
