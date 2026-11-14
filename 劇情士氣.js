'use strict';
window.StoryMorale=(()=>{
 const key='three-kingdoms-interface-preview-v1';
 function read(){return JSON.parse(localStorage.getItem(key)||'{}');}
 function data(s){const d=s.storyMorale||{};return {value:Number.isFinite(d.value)?Math.max(0,Math.min(100,d.value)):100,homeRestCount:Number.isSafeInteger(d.homeRestCount)?d.homeRestCount:0,settled:d.settled&&typeof d.settled==='object'?d.settled:{}};}
 function multiplier(value){return value>=60?1:value>=40?.95:value>=20?.90:.85;}
 function status(){const s=read(),d=data(s);return {value:d.value,multiplier:multiplier(d.value),coins:Math.max(0,s.rewards?.modes?.story?.coins||0)};}
 function settle(id,outcome,waves=6,gold=waves){if(!Number.isInteger(gold)||gold<0||gold>6)return false;if(![1,3,6].includes(waves))return false;if(typeof id!=='string'||!id||!['win','loss','retreat'].includes(outcome))return false;const s=read(),d=data(s);if(Object.hasOwn(d.settled,id))return false;const cost={win:3,loss:8,retreat:4}[outcome];d.value=Math.max(0,d.value-cost);d.settled[id]={outcome,cost,coins:outcome==='win'?gold:0,at:Date.now()};if(outcome==='win'){s.rewards??={};s.rewards.modes??={};s.rewards.modes.story??={};s.rewards.modes.story.coins=Math.max(0,s.rewards.modes.story.coins||0)+gold;}s.storyMorale=d;localStorage.setItem(key,JSON.stringify(s));return true;}
 function canHomeRest(){const d=data(read());return !!window.VillageJourney&&!VillageJourney.status().visited&&Object.keys(d.settled).length>d.homeRestCount;}
 function restAtHome(){if(!canHomeRest())return false;const s=read(),d=data(s);d.value=100;d.homeRestCount=Object.keys(d.settled).length;s.storyMorale=d;localStorage.setItem(key,JSON.stringify(s));window.dispatchEvent(new Event('story-morale-updated'));return true;}
 return {key,status,multiplier,settle,canHomeRest,restAtHome};
})();
if(document.querySelector('main.story footer')){
 const label=document.createElement('span');label.id='storyMoraleLabel';document.querySelector('main.story footer').append(label);
 const update=()=>{const s=StoryMorale.status();label.textContent='士氣 '+s.value+'/100';};window.addEventListener('storage',e=>{if(e.key===StoryMorale.key)update();});window.addEventListener('story-morale-updated',update);update();
}
