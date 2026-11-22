'use strict';
window.WorldJourney=(()=>{
 const key='three-kingdoms-world-journey-v1',duration=30000;
 function pending(){const j=JSON.parse(localStorage.getItem(key)||'null');if(!j)return null;if(typeof j.from!=='string'||typeof j.to!=='string'||!Number.isFinite(j.endsAt)||!Number.isFinite(j.startedAt))throw Error('行旅紀錄無效，請使用存檔備份還原。');const normalize=window.WorldTravel?.normalizeName||(name=>({盧江:"廬江",長阪坡:"長坂坡",夷州:"夷洲",南陽:"宛城",晉陽:"太原",河東:"洛陽",河西:"武威",汶川:"綿虒"}[name]||name));j.from=normalize(j.from);j.to=normalize(j.to);return j;}
 function remaining(){const j=pending();return j?Math.max(0,Math.ceil((j.endsAt-Date.now())/1000)):0;}
 function assertIdle(){if(pending())throw Error('目前正在行旅，請先抵達或取消行程。');}
 function begin(from,to){assertIdle();const j={from,to,startedAt:Date.now(),endsAt:Date.now()+duration};localStorage.setItem(key,JSON.stringify(j));window.dispatchEvent(new Event('world-journey-changed'));return j;}
 function clear(){localStorage.removeItem(key);window.dispatchEvent(new Event('world-journey-changed'));}
 function arriving(url){const j=pending();if(!j)return;j.arrivalUrl=url;localStorage.setItem(key,JSON.stringify(j));}
 return {key,duration,pending,remaining,assertIdle,begin,clear,arriving};
})();
