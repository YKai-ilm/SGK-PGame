'use strict';
window.VillageJourney=(()=>{
 const key='three-kingdoms-village-journey-v1';
 function read(){const s=JSON.parse(localStorage.getItem(key)||'{}');return {wins:Array.isArray(s.wins)?[...new Set(s.wins.filter(x=>typeof x==='string'))]:[],visited:s.visited===true};}
 function status(){const s=read();return {wins:s.wins.length,unlocked:s.visited||s.wins.length>=10,visited:s.visited};}
 function win(id){if(typeof id!=='string'||!id)return false;const s=read();if(s.wins.includes(id))return false;s.wins.push(id);localStorage.setItem(key,JSON.stringify(s));return true;}
 function visit(){if(!status().unlocked)return false;const s=read();s.visited=true;localStorage.setItem(key,JSON.stringify(s));return true;}
 return {key,status,win,visit};
})();
