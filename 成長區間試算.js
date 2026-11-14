'use strict';
// Design comparison only: Hao Zhao, red 1 -> purple 10, no equipment or battle-level growth.
window.GrowthRangeStudy=(()=>{
 const starSteps=[3,3,4,4,5,5,6,7,8],levels=[1,20,40,60,80,100];
 function calculate(level=1,quality='紅',star=1,levelTarget=2.8,starTarget=2.1){
  if(!Number.isInteger(level)||level<1||level>100||!['紅','紫'].includes(quality)||!Number.isInteger(star)||star<1||star>10||!Number.isFinite(levelTarget)||levelTarget<2.6||levelTarget>3||!Number.isFinite(starTarget)||starTarget<1.9||starTarget>2.2)throw Error('成長區間條件無效');
  const base=window.HeroCombat.stats('郝昭').hp;
  // At the central 2.1 endpoint: +45 points per full star tier, +20 points for advancement.
  const starProgress=(quality==='紫'?65:0)+starSteps.slice(0,star-1).reduce((a,b)=>a+b,0);
  const starMultiplier=1+(starTarget-1)*starProgress/110;
  const levelMultiplier=1+(levelTarget-1)*(level-1)/99;
  const redCost=window.OfficerStarCosts['紅'].reduce((n,x)=>n+x.fragments,0);
  const fragments=(quality==='紫'?redCost+1600:0)+window.OfficerStarCosts[quality].slice(0,star-1).reduce((n,x)=>n+x.fragments,0);
  return {base,level,quality,star,levelMultiplier,starMultiplier,hp:Math.round(base*levelMultiplier*starMultiplier),fragments};
 }
 return {calculate,starSteps,levels};
})();
