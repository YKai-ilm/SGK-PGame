'use strict';
// Isolated design study. These candidates are NOT used by the live battle engine.
window.HealingStudy=(()=>{
 const catalog=[
  {id:'chixin',name:'赤心計',category:'策防',intelligence:50,level:1,cost:2,instant:80,targets:1},
  {id:'tongxian',name:'銅仙計',category:'策防',intelligence:65,level:6,cost:5,instant:220,targets:1},
  {id:'yinxian',name:'銀仙計',category:'策防',intelligence:80,level:16,cost:9,instant:480,targets:1},
  {id:'jinxian',name:'金仙計',category:'策防',intelligence:92,level:30,cost:14,instant:800,targets:1},
  {id:'tuanfu',name:'團復計',category:'策防',intelligence:60,level:8,cost:3,instant:40,targets:3},
  {id:'qunxian',name:'群仙計',category:'策防',intelligence:78,level:20,cost:7,instant:120,targets:3},
  {id:'guangji',name:'廣濟計',category:'策防',intelligence:90,level:35,cost:12,instant:180,targets:5},
  {id:'futi',name:'復體術',category:'策裝',intelligence:0,level:1,cost:4,instant:120,hot:120,targets:1,book:true}
 ].map(x=>Object.freeze({...x,cooldown:5}));
 const revisedAmounts=[500,1200,2500,4500,250,700,1100,600];
 const revisedCatalog=catalog.map((c,i)=>Object.freeze({...c,instant:revisedAmounts[i],...(c.book?{hot:600}:{})}));
 const unit=(id,hp,nextHit=0,pending=0,hero=true,max=1000)=>({id,name:id,hp,max,nextHit,pending,hero});
 const scenarios=[
  {id:'scratch',name:'一人缺50生命',units:[unit('劉備',950)],expected:'chixin'},
  {id:'five',name:'一人缺180生命',units:[unit('劉備',820)],expected:'tongxian'},
  {id:'eleven',name:'一人缺400生命',units:[unit('劉備',600)],expected:'yinxian'},
  {id:'group',name:'三人各缺100生命',units:[unit('劉備',900),unit('關羽',900),unit('張飛',900)],expected:'qunxian'},
  {id:'urgent',name:'一人剩40生命，下一擊300傷害',units:[unit('劉備',40,300)],expected:'yinxian'},
  {id:'twoUrgent',name:'兩人剩40生命，各有一擊150傷害',units:[unit('劉備',40,150),unit('關羽',40,150)],expected:'qunxian'},
  {id:'hot',name:'缺10生命，一秒內已有足夠續療且無已知攻擊',units:[unit('劉備',990,0,10)],expected:null},
  {id:'soldier',name:'前排基本兵缺180生命',units:[unit('基本兵',350,0,0,false,530)],expected:'tongxian'},
  {id:'dead',name:'只有倒下武將與滿血武將',units:[unit('劉備',0),unit('關羽',1000)],expected:null}
 ];
 function choose({intelligence,level,sp,category='策防',hasBook=false,cooling=[],units=[],model='legacy'}){
  if(!['legacy','hp-review'].includes(model))throw Error('恢復模型無效');
  if(!Number.isInteger(intelligence)||intelligence<0||intelligence>100||!Number.isInteger(level)||level<1||!Number.isSafeInteger(sp)||sp<0)throw Error('軍師試算輸入不正確');
  if(!['策防','策裝'].includes(category))throw Error('本試算僅包含恢復計策');
  const seen=new Set();
  const live=units.filter(u=>Number.isFinite(u.hp)&&Number.isFinite(u.max)&&u.max>0&&u.hp>0&&u.hp<=u.max).map(u=>{
   if(seen.has(u.id))throw Error('重複單位');seen.add(u.id);
   const hit=Number.isFinite(u.nextHit)?Math.max(0,u.nextHit):0;
   // Only discount scheduled healing when no imminent hit is known. Never credit it as immediate healing.
   const pending=hit===0&&Number.isFinite(u.pending)?Math.max(0,u.pending):0;
   return {...u,hit,urgent:hit>=u.hp,need:Math.max(0,u.max-u.hp-pending)};
  });
  const candidates=(model==='hp-review'?revisedCatalog:catalog).filter(c=>c.category===category&&c.intelligence<=intelligence&&c.cost<=sp&&!cooling.includes(c.category)&&!cooling.includes(c.id)&&(!c.book||hasBook));
  let eligible=live.filter(u=>(category!=='策裝'||u.hero)&&u.need>1e-8);
  if(category==='策裝'){
   const lowest=live.filter(u=>u.hero&&u.hp<u.max).sort((a,b)=>a.hp/a.max-b.hp/b.max||String(a.id).localeCompare(String(b.id)))[0];
   eligible=lowest&&lowest.need>1e-8?[lowest]:[];
  }
  if(!eligible.length)return {choice:null,reason:'沒有需要新增治療的有效目標。',evaluated:0};
  const totalNeed=eligible.reduce((s,u)=>s+u.need,0);
  const alternatives=[];
  for(const c of candidates){
   const scores=eligible.map(u=>{
    const instant=Math.min(u.max-u.hp,c.instant);
    const effective=Math.min(u.need,c.instant+(c.hot||0));
    const saved=u.urgent&&u.hp+instant>u.hit;
    return {u,instant,effective,saved};
   });
   // Book effect keeps its established lowest-HP-ratio hero target; generic heals prioritize immediate rescue.
   scores.sort(c.book?(a,b)=>a.u.hp/a.u.max-b.u.hp/b.u.max||String(a.u.id).localeCompare(String(b.u.id)):(a,b)=>Number(b.saved)-Number(a.saved)||Number(b.u.urgent)-Number(a.u.urgent)||b.effective-a.effective||String(a.u.id).localeCompare(String(b.u.id)));
   const selected=scores.slice(0,c.targets),effective=selected.reduce((s,t)=>s+t.effective,0);
   alternatives.push({id:c.id,name:c.name,cost:c.cost,targets:selected.map(t=>t.u.id),saved:selected.filter(t=>t.saved).length,effective,complete:effective+1e-8>=totalNeed,immediate:selected.reduce((s,t)=>s+t.instant,0)});
  }
  if(!alternatives.length)return {choice:null,reason:'目前沒有符合智力、等級、SP、冷卻與裝備條件的計策。',evaluated:0};
  // Lexicographic goals avoid hidden weights: rescue count -> fulfill healing need -> cost; otherwise useful heal.
  alternatives.sort((a,b)=>b.saved-a.saved||(a.saved>0&&a.saved===b.saved?a.cost-b.cost:0)||Number(b.complete)-Number(a.complete)||(a.complete&&b.complete?a.cost-b.cost:b.effective-a.effective)||a.cost-b.cost||a.id.localeCompare(b.id));
  const choice=alternatives[0],urgent=eligible.filter(u=>u.urgent).length;
  return {choice,evaluated:alternatives.length,reason:urgent?'先比較立即救援：預估可避開眼前一擊的致命傷 '+choice.saved+'/'+urgent+' 人；不代表後續一定存活。':choice.complete?'可滿足本次已知治療需求的方案中，選擇較省SP者。':'沒有一招能補足全部需求，先選有效治療量較高者。',alternatives};
 }
 return {catalog,revisedCatalog,scenarios,choose};
})();
