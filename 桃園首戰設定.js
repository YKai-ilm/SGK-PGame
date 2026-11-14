'use strict';
window.VillageDefense=(()=>{
 const key='three-kingdoms-interface-preview-v1',storyKey='three-kingdoms-taoyuan-dialogue-v1';
 const rescue=new URLSearchParams(location.search).get('villageRescue')==='1',mission=rescue?'taoyuan-rescue':'taoyuan-defense';
 const read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 function eligible(){try{return !!read().storyEvents?.peachOath||JSON.parse(localStorage.getItem(storyKey)||'{}').seen?.includes('oath');}catch{return false;}}
 function completed(){try{return !!read().storyEvents?.villageDefense;}catch{return false;}}
 function complete(runId){if(!eligible())return false;const s=read();s.storyEvents??={};if(s.storyEvents.villageDefense)return false;s.storyEvents.villageDefense={runId,at:Date.now()};localStorage.setItem(key,JSON.stringify(s));return true;}
 function rescueCompleted(){try{return !!read().storyEvents?.villageRescue;}catch{return false;}}
 function rescueEligible(){try{return completed()&&JSON.parse(localStorage.getItem(storyKey)||'{}').seen?.includes('villageDefenseAfter');}catch{return false;}}
 function completeRescue(runId){if(!rescueEligible())return false;const s=read();s.storyEvents??={};if(s.storyEvents.villageRescue)return false;s.storyEvents.villageRescue={runId,at:Date.now()};localStorage.setItem(key,JSON.stringify(s));return true;}
 const requested=rescue||new URLSearchParams(location.search).get('villageDefense')==='1';
 return {mission,rescue,waves:rescue?3:1,title:rescue?'拯救鄉民（森林）':'守衛村莊',requested,active:requested&&(rescue?rescueEligible()&&!rescueCompleted():eligible()&&!completed()),eligible,completed,complete,rescueEligible,rescueCompleted,completeRescue,heroes:['劉備','關羽','張飛']};
})();
