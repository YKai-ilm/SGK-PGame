'use strict';
window.CandidateFiles=(()=>{
 const key='three-kingdoms-candidates-v1';
 function valid(data){const all=Object.keys(TestRoster).filter(n=>TestRoster[n].skills.length);return data?.format==='three-kingdoms-candidates'&&data.version===1&&Array.isArray(data.chosen)&&Array.isArray(data.heroes)&&data.heroes.length===7&&new Set(data.heroes).size===7&&data.chosen.length<=7&&new Set(data.chosen).size===data.chosen.length&&data.heroes.every(n=>typeof n==='string'&&all.includes(n))&&data.chosen.every(n=>data.heroes.includes(n));}
 function pack(chosen,heroes){return{format:'three-kingdoms-candidates',version:1,chosen:[...chosen],heroes:[...heroes]};}
 function read(){try{const raw=localStorage.getItem(key);if(!raw)return null;const data=JSON.parse(raw);if(!valid(data))throw Error();return data;}catch{document.getElementById('notice').textContent='未能讀取保存的候選設定，先使用預設陣容。';return null;}}
 function save(chosen,heroes){const data=pack(chosen,heroes);if(!valid(data))return false;try{localStorage.setItem(key,JSON.stringify(data));return true;}catch{return false;}}
 return{valid,pack,read,save};
})();
