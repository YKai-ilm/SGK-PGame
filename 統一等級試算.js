'use strict';
// Shared-rule candidate; no save writes or battle integration yet.
window.UnifiedLevelStudy=(()=>{
 const valid=l=>Number.isInteger(l)&&l>=1&&l<=100;
 function need(level){if(!valid(level))throw Error('等級無效');return level===100?0:100*level;}
 function reward(enemyLevel){if(!valid(enemyLevel))throw Error('敵人等級無效');return 10+enemyLevel;}
 function gain(level,xp,amount){if(!valid(level)||!Number.isSafeInteger(xp)||xp<0||xp>=(need(level)||1)||!Number.isSafeInteger(amount)||amount<0||!Number.isSafeInteger(xp+amount))throw Error('經驗無效');let remaining=xp+amount;while(level<100&&remaining>=need(level)){remaining-=need(level);level++;}return {level,xp:level===100?0:remaining};}
 function hp(base,level){if(!valid(level)||!Number.isFinite(base)||base<=0)throw Error('能力條件無效');return Math.round(base*(1+1.8*(level-1)/99));}
 // Illustrative village configuration, not the live chapter definition.
 function villageExample(waves=6){
  if(![1,3,6].includes(waves))throw Error('波數無效');
  const enemies=[];for(let w=1;w<=waves;w++)for(let i=0;i<6+w;i++){const level=3+enemies.length%3;enemies.push({wave:w,level,xp:reward(level)});}
  return enemies;
 }
 function pools(waves,ratio=2){if(![1,1.5,2].includes(ratio))throw Error('倍率無效');const count=villageExample(waves).length;return {count,settlement:count,battle:Math.floor(count*ratio)};}
 function demand(level){if(!valid(level))throw Error('等級無效');return 50*level*(level-1);}
 function milestones(){return Array.from({length:20},(_,i)=>{const chapter=i+1,level=chapter*5,quality=chapter<=10?'紅':'紫',star=chapter<=10?chapter:chapter-10;const costs=window.OfficerStarCosts;const fragments=(quality==='紫'?costs['紅'].reduce((n,c)=>n+c.fragments,0)+1600:0)+costs[quality].slice(0,star-1).reduce((n,c)=>n+c.fragments,0);return {chapter,level,quality,star,xp:demand(level),segmentXP:demand(level)-demand(i===0?1:i*5),fragments};});}
 return {need,reward,gain,hp,villageExample,pools,demand,milestones};
})();
