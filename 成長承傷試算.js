'use strict';
// Isolated incoming-damage experiment, not a playable battle or win-rate model.
window.HPGrowthPressure=(()=>{
 function hp(base,level,rate){
  if(!Number.isInteger(base)||base<1||!Number.isInteger(level)||level<1||level>100||!['old',.02,.03,.04].includes(rate))throw Error('無效承傷條件');
  if(rate==='old'){let v=base;for(let i=1;i<level;i++)v=Math.round(v*1.12);return v;}
  return Math.round(base*(1+Math.min(level-1,15)*rate));
 }
 function run(max,def,scale=1){
  if(!Number.isFinite(max)||max<=0||!Number.isFinite(def)||def<0||!Number.isFinite(scale)||scale<=0)throw Error('無效傷害條件');
  // Three soldiers start at t=0; boss joins at 30s. First hit after 1.3s.
  const hits=[];for(let tick=1;tick*13<=600;tick++){const t=tick*13/10;hits.push({t,raw:3*56});}
  for(let tick=1;300+tick*13<=600;tick++)hits.push({t:(300+tick*13)/10,raw:150});
  hits.sort((a,b)=>a.t-b.t);let remaining=max,damage=0,fallenAt=null;
  for(const h of hits){const d=h.raw*scale*100/(100+def);damage+=d;if(fallenAt===null){remaining-=d;if(remaining<=0){fallenAt=h.t;remaining=0;}}}
  return {remaining,fallenAt,damage};
 }
 return {hp,run};
})();
