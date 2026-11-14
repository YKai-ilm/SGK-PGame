'use strict';
window.ShuSkills=(()=>{
 const tiers=['青','綠','藍','橘','紅','紫'];
 const budgets=tiers.map((quality,i)=>({quality,damage:1.1+i*.2,cooldown:7-i*.5,radius:1+i*.1,duration:1.5+i*.3,support:1+i*.12}));
 function make(name,effect,quality,range,overrides={}){
  const b=budgets[tiers.indexOf(quality)];if(!b)throw Error('蜀將品質缺漏');
  const support=['heal','healArea','healSelf','shield','areaShield','cleanseHeal','chainHeal','regenSupport','regenArea','cleanseArea','allyGuard','guardArea','selfWard','hasteSupport','hasteArea'].includes(effect);
  const s={name,id:'shu_'+effect,effect,cd:b.cooldown+(effect==='guard'?2:0),range:support?3:range,radius:b.radius,duration:b.duration,ratio:support?b.support*(effect==='healArea'?.65:1):b.damage,width:1,threshold:effect==='healSelf'?.7:1};
  if(['cleave','magicBlast','slow'].includes(effect))s.ratio*=.75;
  if(['break','weaken','physicalSlow'].includes(effect))s.ratio*=.8;
  for(const k of ['radius','ratio','range','duration','cd','width','threshold','executeBonus','hits','magicRatio','slowDuration','damageBuffDuration','armorBreakDuration','slashInterval','airDuration','finalArmorDuration','finalSlowDuration','paralyzeDuration','regenRatio','regenSeconds','grantHaste','buffDuration','grantShield','grantBlocks','emergencyBonus','emergencyThreshold','lifesteal','controlledBonus','shieldedBonus','selfLowBonus','selfLowThreshold','pushDistance','shieldDispel','weakenPower','weakenDuration','chainRange','falloff'])if(overrides[k]!==undefined){if(!Number.isFinite(overrides[k])||overrides[k]<=0)throw Error('技能個別設定無效');s[k]=overrides[k];}
  if(overrides.hitRatios){if(overrides.hitRatios.length!==3||!overrides.hitRatios.every(v=>Number.isFinite(v)&&v>0))throw Error('三刀設定無效');s.hitRatios=[...overrides.hitRatios];}
  for(const k of ['cleanseSupport','grantDamage'])if(overrides[k]!==undefined)s[k]=overrides[k]===true;
  if(overrides.targetMode)s.targetMode=overrides.targetMode;
  const pct=n=>Math.round(n*100)+'%',r=s.radius.toFixed(1),time=s.duration.toFixed(1);
  const texts={physicalRoot:()=>`射程${s.range}格內單一敵軍承受物攻${pct(s.ratio)}武力傷害，定身${time}秒：不能移動但仍能攻擊。`,chainBolt:()=>`首個目標射程${s.range}格，謀攻${pct(s.ratio)}謀略傷害；再向${s.chainRange}格內最近的不同敵人接力，最多${s.hits}人，每跳傷害保留${pct(s.falloff)}，同人不重複。`,confuse:()=>`射程${s.range}格內單一敵軍承受謀攻${pct(s.ratio)}謀略傷害，倒戈${time}秒：停止前進並依原攻速攻擊射程內最近的敵方同伴，沒有目標則停留，不攻擊我方或城池；結束後恢復，不疊加。`,rootStrike:()=>`射程${s.range}格內單一敵軍承受謀攻${pct(s.ratio)}謀略傷害，定身${time}秒：不能移動但仍能攻擊。`,rootArea:()=>`目標半徑${r}格敵軍承受謀攻${pct(s.ratio)}謀略傷害，定身${time}秒：不能移動但仍能攻擊。`,strike:()=>`射程${s.range}格內單一敵軍承受物攻${pct(s.ratio)}武力傷害。`,cleave:()=>`朝目標方向劈擊，長${s.range}格、寬${s.width}格，範圍內敵軍承受物攻${pct(s.ratio)}武力傷害。`,magicStrike:()=>`射程${s.range}格內單一敵軍承受謀攻${pct(s.ratio)}謀略傷害。`,magicBlast:()=>`命中目標位置，半徑${r}格敵軍承受謀攻${pct(s.ratio)}謀略傷害。`,slow:()=>`目標半徑${r}格敵軍承受謀攻${pct(s.ratio)}謀略傷害，移速降低40%，持續${time}秒。`,physicalSlow:()=>`單一目標承受物攻${pct(s.ratio)}武力傷害，移速降低40%，持續${time}秒。`,break:()=>`單一目標先降低謀防40%，持續${time}秒，再承受謀攻${pct(s.ratio)}謀略傷害。`,areaBreak:()=>`目標半徑${r}格內全部敵軍先降低謀防40%，持續${time}秒，再承受謀攻${pct(s.ratio)}謀略傷害。`,weaken:()=>`單一目標承受謀攻${pct(s.ratio)}謀略傷害，普攻間隔延長54%，持續${time}秒。`,weakenArea:()=>`目標半徑${r}格內敵軍承受謀攻${pct(s.ratio)}謀略傷害，普攻間隔延長54%，持續${time}秒。`,magicStunBlast:()=>`目標半徑${r}格敵軍承受謀攻${pct(s.ratio)}謀略傷害，暈眩${time}秒。`,stunBlast:()=>`目標半徑${r}格敵軍承受物攻${pct(s.ratio)}武力傷害，暈眩${time}秒。`,hybridStrike:()=>`射程${s.range}格內單一敵軍先承受物攻${pct(s.ratio)}武力傷害，存活時再承受謀攻${pct(s.magicRatio)}謀略傷害，分別計算兩種防禦。`,multiStrike:()=>`對${s.range}格內目標連擊${s.hits}次，每次物攻${pct(s.ratio)}武力傷害（全中${pct(s.ratio*s.hits)}）。首擊立即，其餘間隔0.25秒；目標死亡或離開射程、自身移位、撤出、陣亡或暈眩即中止。`};
  if(effect==='inheritedTriple'){s.hitRatios=[.5,.7,1.1];s.desc='鎖定施放方向連劈三刀，首刀立即、後兩刀間隔0.5秒，範圍依序為直線2、3、4格。對每刀範圍內所有敵軍造成物攻50%、70%、110%的武力傷害（全中230%）；前兩刀各沿道路擊退1格，入口處停止，第三刀原地擊飛1秒，期間無法移動或攻擊。自身移位、撤出、陣亡或暈眩會中止後續刀。';}
  else if(effect==='familyTriple')s.desc=`關家三刀：固定方向劈擊2／3／4格，倍率${s.hitRatios.map(pct).join('／')}，間隔${s.slashInterval}秒。前兩刀各擊退1格，末刀擊飛${s.airDuration}秒`+(s.finalArmorDuration?`並降低物防5%持續${s.finalArmorDuration}秒（末刀亦受益）。`:`並減速40%持續${s.finalSlowDuration}秒。`)+`範圍內敵人皆受影響；移位、撤出、陣亡或暈眩中止連招。附加效果不疊加。`;
  else if(effect==='familyCavalry')s.desc=`自城池派出騎兵逆道路衝刺，首次撞擊鎖定目標周圍1格全部敵軍，推擊${s.hits}次，每次${pct(s.ratio)}武力傷害並擊退1格，間隔0.3秒；末擊減速40%持續${s.finalSlowDuration}秒，不疊加。`;
  else if(effect==='counterStance')s.desc=`受擊後進入反擊架勢${time}秒；存活且未受暈眩時，對${s.range}格內的攻擊者反擊物攻${pct(s.ratio)}武力傷害，每0.75秒最多一次，反擊不再觸發反擊，無附加減傷。`;
  else if(effect==='blockSelf')s.desc='受擊後架弓防禦。';
  else if(effect==='cleanseSelf')s.desc='受到定身、減速或降攻速時解除自身控制；暈眩時無法施放。';
  else if(effect==='guard')s.desc=`自身受擊後${s.threshold<1?'且生命低於'+pct(s.threshold)+'時':''}，所受武力與謀略傷害降低35%，持續${time}秒；效果不疊加。`;
  else if(support){
   const amount='輔助力'+pct(s.ratio);
   s.desc=effect==='hasteSupport'||effect==='hasteArea'?`選${s.range}格內正在交戰、物攻最高的友軍，`+(effect==='hasteArea'?`鼓舞其半徑${r}格友軍。`:'鼓舞該名友軍。'):effect==='allyGuard'||effect==='guardArea'?`選${s.range}格內生命低於80%的友軍，`+(effect==='guardArea'?`其半徑${r}格內友軍`:'該友軍')+`所受武力與謀略傷害降低35%，持續${time}秒，同類減傷不疊加。`:effect==='selfWard'?`自身生命低於${pct(s.threshold)}且護盾不足時，建立${amount}護盾，取高不累加。`:effect==='cleanseArea'?`以${s.range}格內受控友軍為中心，解除半徑${r}格友軍暈眩、定身、減速及降攻速，並各治療${amount}生命；無受控者時救助生命低於80%的友軍。`:effect==='regenSupport'||effect==='regenArea'?`選${s.range}格內生命低於80%的友軍，`+(effect==='regenArea'?`治療其半徑${r}格友軍`:'治療該友軍')+`${amount}生命，再接持續恢復。`:effect==='chainHeal'?`選${s.range}格內生命比例最低、低於80%的友軍，每人恢復${amount}生命；向${s.chainRange}格內生命比例最低、低於80%的不同友軍接力，最多${s.hits}人，不重複。`:effect==='shield'?`為${s.range}格內生命低於70%的一名友軍提供${amount}護盾，可保護自身；護盾取較高值、不累加。`:effect==='areaShield'?`以${s.range}格內生命低於80%的友軍為中心，為半徑${r}格內友軍提供${amount}護盾；護盾取較高值、不累加。`:effect==='healArea'?`以${s.range}格內生命比例最低的受傷友軍為中心，治療半徑${r}格友軍，回復${amount}生命。`:effect==='healSelf'?`自身生命低於${pct(s.threshold)}時回復${amount}生命。`:effect==='cleanseHeal'?`優先選${s.range}格內受到暈眩、定身、緩速或降攻速的友軍，解除這些控制並治療${amount}生命；無受控者時治療生命低於80%的友軍。`:`治療${s.range}格內生命比例最低、低於80%的友軍，回復${amount}生命，可治療自身。`;
  }else s.desc=texts[effect]();
  if(s.executeBonus)s.desc+=`目標生命低於${pct(s.threshold)}時，本次傷害再乘${s.executeBonus}。`;
  if(s.slowDuration)s.desc+=`命中的存活敵軍移速降低40%，持續${s.slowDuration}秒；相同減速不疊加。`;
  if(s.damageBuffDuration)s.desc+=`命中後自身武力與謀略傷害提高5%，持續${s.damageBuffDuration}秒；不疊加，重複觸發刷新時間。`;
  if(s.armorBreakDuration)s.desc+=`傷害結算前使命中敵軍物防降低5%，持續${s.armorBreakDuration}秒；不疊加，重複觸發刷新時間。`;
  if(s.paralyzeDuration)s.desc+=`命中存活敵軍麻痺${s.paralyzeDuration}秒，效果同暈眩，無法移動或攻擊；不疊加。`;
  if(s.controlledBonus)s.desc+=`目標已受暈眩、擊飛、定身、減速、降攻速或倒戈時增傷${pct(s.controlledBonus)}。`;
  if(s.shieldedBonus)s.desc+=`自身有護盾時本招增傷${pct(s.shieldedBonus)}。`;
  if(s.selfLowBonus)s.desc+=`自身生命低於${pct(s.selfLowThreshold)}時增傷${pct(s.selfLowBonus)}。`;
  if(s.pushDistance)s.desc+=`命中存活敵軍沿道路擊退${s.pushDistance}格，入口處停止。`;
  if(s.shieldDispel)s.desc+=`傷害前移除命中敵軍現有護盾${pct(s.shieldDispel)}，不扣生命。`;
  if(s.lifesteal)s.desc+=`將本招實際扣除的敵軍生命${pct(s.lifesteal)}轉為自療，每次施放最多回復自身最大生命5%。`;
  if(s.weakenPower)s.desc+=`命中存活敵軍傷害降低${pct(s.weakenPower)}，持續${s.weakenDuration}秒。`;
  if(s.emergencyBonus)s.desc+=`接受治療時生命低於${pct(s.emergencyThreshold)}者，本次治療提高${pct(s.emergencyBonus)}。`;
  if(s.regenRatio)s.desc+=`受益者另每秒恢復輔助力${pct(s.regenRatio)}生命，持續${s.regenSeconds}秒；同類續療取較強效果，刷新時間但不增加跳數。`;
  if(s.grantHaste)s.desc+=`受益者普攻速度提高${pct(s.grantHaste)}，持續${s.buffDuration}秒；同類加速取最高值。`;
  if(s.grantDamage)s.desc+=`受益者傷害提高5%，持續${s.buffDuration}秒，不疊加。`;
  if(s.grantShield)s.desc+=`自身另獲輔助力${pct(s.grantShield)}護盾，取高不疊加。`;
  if(s.grantBlocks)s.desc+=`受益者至少保有${s.grantBlocks}次物理格擋，下次所受物理傷害降低75%，不累加次數。`;
  if(s.cleanseSupport)s.desc+=`同時解除受益者暈眩、定身、減速及降攻速。`;
  if(s.targetMode)s.desc+=({weak:'優先鎖定射程內生命比例最低者。',controlled:'優先鎖定射程內已受控敵軍。',shielded:'優先鎖定射程內護盾最多的敵軍。'}[s.targetMode]||'');
  return s;
 }
 for(const row of SHU_SKILL_DESIGN.entries){
  const source=HERO_COMBAT_DATA[row.name];if(!source)throw Error('缺少蜀將能力：'+row.name);
  TestRoster[row.name]={hp:1,atk:1,def:0,mdef:0,interval:1,kind:row.kind,group:row.group,range:row.range,weaponLabel:row.weapon,skills:[make(row.skill1,row.effect1,source.quality,row.range,row.skill1Overrides),make(row.skill2,row.effect2,source.quality,row.range,row.skill2Overrides)],skillOriginQuality:source.quality};
 }
 function controlled(a){return Math.max(a.stun||0,a.root||0,a.slow||0,a.attackSlow||0,a.letterSlow||0,a.lingSlow||0,a.airborne||0,a.shuConfused||0)>elapsed;}
 function cleanse(a){a.stun=a.root=a.slow=a.attackSlow=a.letterSlow=a.lingSlow=0;}
 function benefit(u,a,s){
  const power=(u.supportRatio===undefined?u.atk:u.atk*u.supportRatio);
  if(s.cleanseSupport)cleanse(a);
  if(s.grantBlocks)a.blocks=Math.max(a.blocks||0,s.grantBlocks);
  if(s.grantShield&&power*s.grantShield>(a.shield||0)){a.shield=power*s.grantShield;a.shieldOwnerId=u.id;}
  if(s.grantDamage)a.shuDamageBuff=Math.max(a.shuDamageBuff||0,elapsed+s.buffDuration);
  if(s.grantHaste){a.shuHastes=(a.shuHastes||[]).filter(v=>v.end>elapsed&&v.owner!==u.id);a.shuHastes.push({owner:u.id,power:s.grantHaste,end:elapsed+s.buffDuration});}
  if(s.regenRatio){if(!a.shuRegens?.some(v=>v.end>elapsed))a.shuRegenNext=elapsed+1;a.shuRegens=(a.shuRegens||[]).filter(v=>v.end>elapsed&&v.owner!==u.id);a.shuRegens.push({owner:u.id,amount:power*s.regenRatio,next:elapsed+1,end:elapsed+s.regenSeconds});}
 }
 let counterBusy=false;
 function retaliate(u,source){if(counterBusy||!source||source===u||u.enemy||!units.includes(u)||u.hp<=0||u.stun>elapsed||!(u.shuCounter>elapsed)||u.shuCounterNext>elapsed||source.hp<=0||dist(u,source)>u.shuCounterRange)return;
  u.shuCounterNext=elapsed+.75;counterBusy=true;try{weaponMotion(u,source);hurt(source,combatPower(u,false)*u.shuCounterRatio,false,u);mark(u.x,u.y,'反擊','#eed19a');}finally{counterBusy=false;}
 }
 function haste(u){return Math.max(0,...(u.shuHastes||[]).filter(v=>v.end>elapsed).map(v=>v.power));}
 function update(){for(const a of units){
  if(a.hp<=0){delete a.shuRegens;delete a.shuHastes;continue;}
  a.shuHastes=(a.shuHastes||[]).filter(v=>v.end>elapsed);
  const records=a.shuRegens||[];
  while(records.length&&a.shuRegenNext<=elapsed+1e-8){
   const best=records.filter(v=>v.end>=a.shuRegenNext-1e-8).sort((a,b)=>b.amount-a.amount)[0];
   if(!best)break;restoreHealth(a,best.amount,units.find(u=>u.id===best.owner));a.shuRegenNext+=1;
  }
  a.shuRegens=records.filter(v=>v.end>=a.shuRegenNext-1e-8&&v.end>=elapsed-1e-8);

 }}
 function combo(u){const c=u.shuCombo;if(!c)return;const t=enemies.find(e=>e.id===c.target);
  if(!units.includes(u)||u.hp<=0||u.stun>elapsed||u.ready>elapsed||u.x!==c.x||u.y!==c.y||!t||t.hp<=0||dist(u,t)>c.range){delete u.shuCombo;return;}
  while(c.left>0&&elapsed+1e-8>=c.next&&t.hp>0){weaponMotion(u,t);if(u.kind==='arrow')shot(u,t,c.raw,'arrow');else hurt(t,c.raw,false,u);c.left--;c.next+=.25;}
  if(!c.left||t.hp<=0)delete u.shuCombo;
 }
 function cast(u,s){
  const support=()=>u.supportRatio===undefined?u.atk:u.atk*u.supportRatio;
  const allies=()=>units.filter(a=>a.hp>0&&dist(u,a)<=s.range).sort((a,b)=>a.hp/a.max-b.hp/b.max);
  if(s.effect==='counterStance'){if(elapsed-u.lastHit>.5||u.shuCounter>elapsed)return false;u.shuCounter=elapsed+s.duration;u.shuCounterRatio=s.ratio;u.shuCounterRange=s.range;u.shuCounterNext=elapsed;ring(u.x,u.y,.6,'#eed19a');return true;}
  if(s.effect==='blockSelf'){if(elapsed-u.lastHit>.5||u.blocks>=s.grantBlocks)return false;benefit(u,u,s);return true;}
  if(s.effect==='cleanseSelf'){if(!controlled(u)||u.stun>elapsed)return false;benefit(u,u,s);cleanse(u);return true;}
  if(s.effect==='selfWard'){if(u.hp/u.max>=s.threshold||(u.shield||0)>=support()*s.ratio)return false;u.shield=support()*s.ratio;u.shieldOwnerId=u.id;benefit(u,u,s);ring(u.x,u.y,.6,'#b8e4ee');return true;}
  if(s.effect==='hasteSupport'||s.effect==='hasteArea'){
   const a=allies().filter(v=>targets(v).length&&haste(v)<s.grantHaste).sort((a,b)=>combatPower(b,false)-combatPower(a,false))[0];if(!a)return false;
   const list=s.effect==='hasteArea'?units.filter(v=>v.hp>0&&dist(v,a)<=s.radius):[a];for(const v of list)benefit(u,v,s);ring(a.x,a.y,s.effect==='hasteArea'?s.radius:.5,'#f2dda2');return true;
  }
  if(s.effect==='allyGuard'||s.effect==='guardArea'){
   const a=allies().find(v=>v.hp/v.max<.8&&!(v.guard>elapsed));if(!a)return false;
   const list=s.effect==='guardArea'?units.filter(v=>v.hp>0&&dist(v,a)<=s.radius):[a];for(const v of list){v.guard=Math.max(v.guard||0,elapsed+s.duration);benefit(u,v,s);}ring(a.x,a.y,s.effect==='guardArea'?s.radius:.5,'#c8d5ab');return true;
  }
  if(s.effect==='guard'){if(elapsed-u.lastHit>.5||u.guard>elapsed||u.hp/u.max>=s.threshold)return false;u.guard=elapsed+s.duration;benefit(u,u,s);ring(u.x,u.y,.6,'#c8d5ab');return true;}
  if(s.effect==='healSelf'){if(u.hp/u.max>=s.threshold)return false;const healed=restoreHealth(u,support()*s.ratio,u)>0;if(healed)benefit(u,u,s);return healed;}
  if(['heal','healArea','cleanseHeal','chainHeal','regenSupport','regenArea','cleanseArea'].includes(s.effect)){
   const candidates=allies(),a=(['cleanseHeal','cleanseArea'].includes(s.effect)?candidates.find(controlled):null)||candidates.find(a=>a.hp/a.max<.8);if(!a)return false;
   const clean=['cleanseHeal','cleanseArea'].includes(s.effect)&&controlled(a);if(clean)cleanse(a);
   const list=['healArea','regenArea','cleanseArea'].includes(s.effect)?units.filter(v=>v.hp>0&&dist(a,v)<=s.radius):[a];
   if(s.effect==='chainHeal'){let last=a;while(list.length<s.hits){const next=units.filter(v=>v.hp>0&&v.hp/v.max<.8&&!list.includes(v)&&dist(last,v)<=s.chainRange).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];if(!next)break;fx.push({x:last.x,y:last.y,tx:next.x,ty:next.y,color:'#b8f1bc',end:elapsed+.5});list.push(next);last=next;}}
   let amount=0;for(const v of list){if(s.effect==='cleanseArea')cleanse(v);amount+=restoreHealth(v,support()*s.ratio*(s.emergencyBonus&&v.hp/v.max<s.emergencyThreshold?1+s.emergencyBonus:1),u);benefit(u,v,s);}
   if(amount||clean)ring(a.x,a.y,s.effect==='healArea'?s.radius:.5,'#b8f1bc');return amount>0||clean;
  }
  if(s.effect==='shield'||s.effect==='areaShield'){const value=support()*s.ratio,a=allies().find(a=>a.hp/a.max<(s.effect==='areaShield'?.8:.7)&&(a.shield||0)<value);if(!a)return false;const list=s.effect==='areaShield'?units.filter(v=>v.hp>0&&dist(a,v)<=s.radius):[a];for(const v of list){if((v.shield||0)<value){v.shield=value;v.shieldOwnerId=u.id;}benefit(u,v,s);}ring(a.x,a.y,s.effect==='areaShield'?s.radius:.5,'#b8e4ee');return true;}
  if(s.effect==='familyCavalry'){if(!enemies.some(e=>e.hp>0))return false;launchCavalry(u,s);return true;}
  const candidates=targets(u,s.range);
  if(s.targetMode==='weak')candidates.sort((a,b)=>a.hp/a.max-b.hp/b.max);
  if(s.targetMode==='controlled')candidates.sort((a,b)=>Number(controlled(b))-Number(controlled(a)));
  if(s.targetMode==='shielded')candidates.sort((a,b)=>(b.shield||0)-(a.shield||0));
  const t=candidates[0];if(!t)return false;
  if(s.effect==='familyTriple'){startDragonSlash(u,t,s.hitRatios,s);return true;}
  if(s.effect==='inheritedTriple'){startDragonSlash(u,t,s.hitRatios);return true;}
  if(s.effect==='multiStrike'){u.shuCombo={target:t.id,x:u.x,y:u.y,range:s.range,left:s.hits,raw:combatPower(u,false)*s.ratio,next:elapsed};combo(u);return true;}
  const magic=['magicStrike','magicBlast','slow','break','areaBreak','weaken','weakenArea','magicStunBlast','rootStrike','rootArea','confuse','chainBolt'].includes(s.effect),raw=combatPower(u,magic)*s.ratio;
  let list=[t];
  if(s.effect==='chainBolt'){let last=t;while(list.length<s.hits){const next=enemies.filter(e=>e.hp>0&&!list.includes(e)&&dist(last,e)<=s.chainRange).sort((a,b)=>dist(last,a)-dist(last,b))[0];if(!next)break;fx.push({x:last.x,y:last.y,tx:next.x,ty:next.y,color:'#d8b8ed',end:elapsed+.5});list.push(next);last=next;}}
  let drained=0;
  if(s.effect==='cleave'){const dx=t.x-u.x,dy=t.y-u.y,len=Math.hypot(dx,dy)||1,nx=dx/len,ny=dy/len;list=enemies.filter(e=>{const x=e.x-u.x,y=e.y-u.y;return e.hp>0&&x*nx+y*ny>=0&&x*nx+y*ny<=s.range+1e-8&&Math.abs(x*ny-y*nx)<=s.width/2+1e-8;});}
  if(['magicBlast','slow','areaBreak','weakenArea','stunBlast','magicStunBlast','rootArea'].includes(s.effect)){list=enemies.filter(e=>e.hp>0&&dist(e,t)<=s.radius+1e-8);ring(t.x,t.y,s.radius,magic?'#ddc0df':'#ead5a8');}
  for(const [hitIndex,e] of list.entries()){if(s.shieldDispel)e.shield=(e.shield||0)*(1-s.shieldDispel);const extra=(s.controlledBonus&&controlled(e)?1+s.controlledBonus:1)*(s.shieldedBonus&&u.shield>0?1+s.shieldedBonus:1)*(s.selfLowBonus&&u.hp/u.max<s.selfLowThreshold?1+s.selfLowBonus:1)*(s.effect==='chainBolt'?s.falloff**hitIndex:1),before=e.hp;if(s.armorBreakDuration){e.shuArmorBreak=Math.max(e.shuArmorBreak||0,elapsed+s.armorBreakDuration);e.shuArmorBreakOwner=u.id;}if(s.effect==='break'||s.effect==='areaBreak'){e.broken=Math.max(e.broken||0,elapsed+s.duration);e.brokenOwner=u.id;}hurt(e,raw*extra*(s.executeBonus&&e.hp/e.max<s.threshold?s.executeBonus:1),magic,u);drained+=Math.max(0,before-e.hp);if(e.hp<=0)continue;
   if(s.effect==='hybridStrike')hurt(e,combatPower(u,true)*s.magicRatio,true,u);
   if(e.hp<=0)continue;
   if(s.effect==='slow'||s.effect==='physicalSlow'||s.slowDuration){e.slow=Math.max(e.slow||0,elapsed+(s.slowDuration||s.duration));e.slowOwner=u.id;}
   if(s.effect==='weaken'||s.effect==='weakenArea'){e.attackSlow=Math.max(e.attackSlow||0,elapsed+s.duration);e.attackSlowOwner=u.id;}
   if(s.effect==='confuse'){e.shuConfused=Math.max(e.shuConfused||0,elapsed+s.duration);e.shuConfusedOwner=u.id;mark(e.x,e.y,'倒戈','#ecbfda');}
   if(s.effect==='rootArea'||s.effect==='rootStrike'||s.effect==='physicalRoot'){e.root=Math.max(e.root||0,elapsed+s.duration);e.rootOwner=u.id;mark(e.x,e.y,'定身','#c5d7ad');}
   if(s.pushDistance){e.t=Math.max(0,e.t-s.pushDistance);Object.assign(e,pos(e.t));mark(e.x,e.y,'擊退','#d8ead0');}
   if(s.weakenPower){e.shuWeakens=(e.shuWeakens||[]).filter(v=>v.end>elapsed&&v.owner!==u.id);e.shuWeakens.push({owner:u.id,power:s.weakenPower,end:elapsed+s.weakenDuration});}
   if(s.paralyzeDuration){e.stun=Math.max(e.stun||0,elapsed+s.paralyzeDuration);e.stunOwner=u.id;mark(e.x,e.y,'麻痺','#d9d0f5');}
   if(s.effect==='stunBlast'||s.effect==='magicStunBlast'){e.stun=Math.max(e.stun||0,elapsed+s.duration);e.stunOwner=u.id;}
  }
  if(s.lifesteal&&drained>0)restoreHealth(u,Math.min(u.max*.05,drained*s.lifesteal),u);
  if(list.length&&s.damageBuffDuration)u.shuDamageBuff=Math.max(u.shuDamageBuff||0,elapsed+s.damageBuffDuration);
  fx.push({x:u.x,y:u.y,tx:t.x,ty:t.y,color:magic?'#dac3e9':'#f1dcac',end:elapsed+.2});return list.length>0;
 }
 return {budgets,cast,combo,update,haste,retaliate,names:[...SHU_SKILL_DESIGN.names]};
})();
