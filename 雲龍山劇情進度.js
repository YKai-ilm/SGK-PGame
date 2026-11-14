'use strict';
window.YunlongStory=(()=>{
 const key='three-kingdoms-interface-preview-v1';
 function completed(){try{return !!JSON.parse(localStorage.getItem(key)||'{}').storyEvents?.yunlongBanditsDefeated;}catch{return false;}}
 function complete(runId){const s=JSON.parse(localStorage.getItem(key)||'{}');s.storyEvents??={};if(s.storyEvents.yunlongBanditsDefeated)return false;s.storyEvents.yunlongBanditsDefeated={runId,at:Date.now()};localStorage.setItem(key,JSON.stringify(s));return true;}
 return {completed,complete};
})();
