'use strict';
window.WorldTravel=(()=>{
 const key='three-kingdoms-interface-preview-v1',read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 const towns={桃源村:{province:'幽州',url:'桃園起兵.html'},徐州:{province:'徐州',url:'徐州劇情.html'},長社:{province:'豫州',url:'漢軍會師.html?town='+encodeURIComponent('長社'),gate:'dispatched'},廣宗:{province:'冀州',url:'漢軍會師.html?town='+encodeURIComponent('廣宗'),gate:'reliefShown'}};
 // Mission shortcuts are handled by their story pages, never by map adjacency.
 // Fare corridors are a geographic design draft; transit stops do not unlock playable towns.
 const fareStops=[['桃源村','幽州',420,55],['冀州','冀州',420,155],['廣宗','冀州',180,155],['平原','青州',660,155],['小沛','豫州',660,285],['徐州','徐州',900,285],['陳留','兗州',420,285],['許昌','豫州',180,285],['長社','豫州',180,415]];
 const fareRoads=[['桃源村','冀州'],['冀州','廣宗'],['冀州','平原'],['平原','小沛'],['小沛','徐州'],['小沛','陳留'],['陳留','許昌'],['許昌','長社']];
 function enabled(){return read().storyEvents?.grainRoute?.armyFormed===true;}
 function unlocked(name){return enabled()&&Object.hasOwn(towns,name)&&(!towns[name].gate||read().storyEvents?.hanCampaign?.[towns[name].gate]===true);}
 function current(){const n=read().worldTravel?.current;return Object.hasOwn(towns,n)?n:'徐州';}
 function canWalk(name){const from=current();return !window.WorldJourney?.pending()&&unlocked(from)&&unlocked(name)&&name!==from&&fareRoads.some(([a,b])=>a===from&&b===name||b===from&&a===name);}
 function status(name){return name===current()?'所在位置':canWalk(name)?'可沿道路前往':unlocked(name)?'非相鄰地點・請經沿途城鎮或使用驛站':'尚未開放';}
 function remember(name){if(!unlocked(name))throw Error('大地圖須在義勇成軍後開放。');const s=read();s.worldTravel={...s.worldTravel,current:name};localStorage.setItem(key,JSON.stringify(s));}
 function open(name,station=false){window.WorldJourney?.assertIdle();if(window.SceneTest?.holdNavigation('前往'+(station?'驛站傳送':'大地圖')))return;remember(name);location.href=station?'驛站傳送.html':'三國大地圖.html';}
 function travel(name,station=false){window.WorldJourney?.assertIdle();if(!enabled()||!unlocked(name)||(!station&&!canWalk(name)))throw Error('此地尚未開放，或不是目前可走的相鄰地點。');if(window.SceneTest?.holdNavigation(name))return false;
 if(!station){if(!window.WorldJourney)throw Error('行旅計時尚未載入，請重新整理。');WorldJourney.begin(current(),name);return true;}
 // A one-shot arrival signal resets only the scene; quest data remain untouched.
 sessionStorage.setItem('three-kingdoms-world-arrival',name);remember(name);location.href=towns[name].url;return true;}
 function back(){window.WorldJourney?.assertIdle();if(!enabled()){location.href='主介面流程預覽.html';return;}const name=current();if(window.SceneTest?.holdNavigation(name))return;sessionStorage.setItem('three-kingdoms-world-arrival',name);location.href=towns[name].url;}
 function arrive(name){if(!window.WorldJourney?.pending()&&unlocked(name)&&current()!==name&&!window.SceneTest?.active())remember(name);}
 function returnStation(){window.WorldJourney?.assertIdle();if(!enabled()){back();return;}location.href=towns[current()].url;}
 function consumeArrival(name){const k='three-kingdoms-world-arrival';if(sessionStorage.getItem(k)!==name)return false;sessionStorage.removeItem(k);return true;}
 function destinations(){return Object.entries(towns).filter(([name])=>unlocked(name)&&name!==current()).map(([name,t])=>({name,province:t.province}));}
 function fare(from,to){if(!fareStops.some(t=>t[0]===from)||!fareStops.some(t=>t[0]===to))return null;const queue=[[from]],seen=new Set([from]);for(let i=0;i<queue.length;i++){const path=queue[i],last=path[path.length-1];if(last===to)return {path,segments:path.length-1,coins:(path.length-1)*20};for(const [a,b]of fareRoads){const next=a===last?b:b===last?a:null;if(next&&!seen.has(next)){seen.add(next);queue.push([...path,next]);}}}return null;}
 function fareNetwork(){return {perSegment:20,status:'歷史地理參考／遊戲驛路草案',towns:fareStops.map(([name,province,x,y])=>({name,province,x,y,transitOnly:!Object.hasOwn(towns,name)})),roads:fareRoads.map(r=>r.slice())};}
 function finishWalk(){const j=window.WorldJourney?.pending();if(!j||WorldJourney.remaining()>0)return false;if(!unlocked(j.to))throw Error('目的地目前未開放，請取消行程返回出發地。');sessionStorage.setItem('three-kingdoms-world-arrival',j.to);remember(j.to);WorldJourney.arriving(towns[j.to].url);location.href=towns[j.to].url;return true;}
 function cancelWalk(){const j=window.WorldJourney?.pending();if(!j)return false;if(WorldJourney.remaining()===0&&unlocked(j.to))return finishWalk();remember(j.from);WorldJourney.clear();return true;}
 return {finishWalk,cancelWalk,fare,fareNetwork,enabled,unlocked,current,canWalk,status,open,travel,back,consumeArrival,destinations,arrive,returnStation};
})();
