'use strict';
window.WorldTravel=(()=>{
 const key='three-kingdoms-interface-preview-v1',read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 const towns={桃源村:{province:'幽州',url:'桃園起兵.html'},徐州:{province:'徐州',url:'徐州劇情.html'},長社:{province:'豫州',url:'漢軍會師.html?town='+encodeURIComponent('長社'),gate:'dispatched'},廣宗:{province:'冀州',url:'漢軍會師.html?town='+encodeURIComponent('廣宗'),gate:'reliefShown'}};
 // Only implemented, story-authorized roads are traversable. Add future towns and their quest gates together.
 const roads=[['桃源村','徐州'],['桃源村','廣宗'],['徐州','長社']];
 function enabled(){return read().storyEvents?.grainRoute?.armyFormed===true;}
 function unlocked(name){return enabled()&&Object.hasOwn(towns,name)&&(!towns[name].gate||read().storyEvents?.hanCampaign?.[towns[name].gate]===true);}
 function current(){const n=read().worldTravel?.current;return Object.hasOwn(towns,n)?n:'徐州';}
 function canWalk(name){const from=current();return unlocked(name)&&name!==from&&roads.some(([a,b])=>a===from&&b===name||b===from&&a===name);}
 function status(name){return name===current()?'所在位置':canWalk(name)?'可沿道路前往':unlocked(name)?'非相鄰地點・請經沿途城鎮或使用驛站':'尚未開放';}
 function remember(name){if(!unlocked(name))throw Error('大地圖須在義勇成軍後開放。');const s=read();s.worldTravel={...s.worldTravel,current:name};localStorage.setItem(key,JSON.stringify(s));}
 function open(name,station=false){if(window.SceneTest?.holdNavigation('前往'+(station?'驛站傳送':'大地圖')))return;remember(name);location.href=station?'驛站傳送.html':'三國大地圖.html';}
 function travel(name,station=false){if(!enabled()||!unlocked(name)||(!station&&!canWalk(name)))throw Error('此地尚未開放，或不是目前可走的相鄰地點。');if(window.SceneTest?.holdNavigation(name))return false;
 // A one-shot arrival signal resets only the scene; quest data remain untouched.
 sessionStorage.setItem('three-kingdoms-world-arrival',name);remember(name);location.href=towns[name].url;return true;}
 function back(){if(!enabled()){location.href='主介面流程預覽.html';return;}const name=current();if(window.SceneTest?.holdNavigation(name))return;sessionStorage.setItem('three-kingdoms-world-arrival',name);location.href=towns[name].url;}
 function arrive(name){if(unlocked(name)&&current()!==name&&!window.SceneTest?.active())remember(name);}
 function returnStation(){if(!enabled()){back();return;}location.href=towns[current()].url;}
 function consumeArrival(name){const k='three-kingdoms-world-arrival';if(sessionStorage.getItem(k)!==name)return false;sessionStorage.removeItem(k);return true;}
 function destinations(){return Object.entries(towns).filter(([name])=>unlocked(name)&&name!==current()).map(([name,t])=>({name,province:t.province}));}
 function fare(from,to){if(!Object.hasOwn(towns,from)||!Object.hasOwn(towns,to))return null;const queue=[[from]],seen=new Set([from]);for(let i=0;i<queue.length;i++){const path=queue[i],last=path[path.length-1];if(last===to)return {path,segments:path.length-1,coins:(path.length-1)*20};for(const [a,b]of roads){const next=a===last?b:b===last?a:null;if(next&&!seen.has(next)){seen.add(next);queue.push([...path,next]);}}}return null;}
 function fareNetwork(){return {perSegment:20,towns:Object.entries(towns).map(([name,t])=>({name,province:t.province})),roads:roads.map(r=>r.slice())};}
 return {fare,fareNetwork,enabled,unlocked,current,canWalk,status,open,travel,back,consumeArrival,destinations,arrive,returnStation};
})();
