'use strict';
// Only compact presentation copies. Original effects, combat events and save data are untouched.
window.BattleFloatText=(()=>{
 function compact(effects){
  const result=[],groups=new Map();
  for(const f of effects){
   if(typeof f.text!=='string'||f.r||f.tx!==undefined||f.fire||f.dragon||![f.x,f.y,f.end].every(Number.isFinite)){result.push(f);continue;}
   const match=/^([+＋−-]?)(\d+)$/.exec(f.text),amount=match?Number(match[2]):null;
   const numeric=match&&Number.isSafeInteger(amount),kind=numeric?'number:'+match[1]:'label:'+f.text;
   const key=JSON.stringify([Math.round(f.x*4),Math.round(f.y*4),Math.floor((f.end+.000001)/.16),f.color,kind]);
   const previous=groups.get(key);
   if(previous&&(!numeric||Number.isSafeInteger(previous.amount+amount))){
    if(numeric){previous.amount+=amount;previous.view.text=match[1]+previous.amount;}
    previous.view.end=Math.max(previous.view.end,f.end);continue;
   }
   const view={...f};result.push(view);groups.set(key,{view,amount});
  }
  return result;
 }
 return {compact};
})();
