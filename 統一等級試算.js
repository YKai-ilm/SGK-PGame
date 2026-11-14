'use strict';
// Shared-rule candidate; no save writes or battle integration yet.
window.UnifiedLevelStudy=(()=>{
 const valid=l=>Number.isInteger(l)&&l>=1&&l<=100;
 function need(level){if(!valid(level))throw Error('等級無效');return level===100?0:100*level;}
 function reward(enemyLevel){if(!valid(enemyLevel))throw Error('敵人等級無效');return 10+enemyLevel;}
 function gain(level,xp,amount){if(!valid(level)||!Number.isSafeInteger(xp)||xp<0||xp>=(need(level)||1)||!Number.isSafeInteger(amount)||amount<0||!Number.isSafeInteger(xp+amount))throw Error('經驗無效');let remaining=xp+amount;while(level<100&&remaining>=need(level)){remaining-=need(level);level++;}return {level,xp:level===100?0:remaining};}
 function hp(base,level){if(!valid(level)||!Number.isFinite(base)||base<=0)throw Error('能力條件無效');return Math.round(base*(1+1.8*(level-1)/99));}
 return {need,reward,gain,hp};
})();
