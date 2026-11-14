'use strict';
window.YunlongStory=(()=>{
 const key='three-kingdoms-interface-preview-v1';
 function completed(){try{return !!JSON.parse(localStorage.getItem(key)||'{}').storyEvents?.yunlongBanditsDefeated;}catch{return false;}}
 function complete(runId){const s=JSON.parse(localStorage.getItem(key)||'{}');s.storyEvents??={};if(s.storyEvents.yunlongBanditsDefeated)return false;s.storyEvents.yunlongBanditsDefeated={runId,at:Date.now()};localStorage.setItem(key,JSON.stringify(s));return true;}
 function huatuoVisible(){try{const events=JSON.parse(localStorage.getItem(key)||'{}').storyEvents;return !!events?.yunlongBanditsDefeated&&events?.yunlongDaniuTalkCompleted===true&&events?.yunlongHuatuoTalkCompleted!==true;}catch{return false;}}
 function finishDaniuTalk(){const s=JSON.parse(localStorage.getItem(key)||'{}');if(!s.storyEvents?.yunlongBanditsDefeated)return false;if(s.storyEvents.yunlongDaniuTalkCompleted===true)return false;s.storyEvents.yunlongDaniuTalkCompleted=true;localStorage.setItem(key,JSON.stringify(s));return true;}
 function finishHuatuoTalk(){const s=JSON.parse(localStorage.getItem(key)||'{}');if(!s.storyEvents?.yunlongBanditsDefeated||s.storyEvents.yunlongDaniuTalkCompleted!==true)return false;if(s.storyEvents.yunlongHuatuoTalkCompleted===true)return false;s.storyEvents.yunlongHuatuoTalkCompleted=true;localStorage.setItem(key,JSON.stringify(s));return true;}
 return {completed,complete,huatuoVisible,finishDaniuTalk,finishHuatuoTalk};
})();
