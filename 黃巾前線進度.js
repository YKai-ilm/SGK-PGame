'use strict';
window.YellowQuest=(()=>{
 const key='three-kingdoms-interface-preview-v1';
 const read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 const progress=()=>read().storyEvents?.yellowOpening||{};
 function change(fn){const s=read();s.storyEvents??={};const p=s.storyEvents.yellowOpening??={};const result=fn(s,p);if(result!==false)localStorage.setItem(key,JSON.stringify(s));return result;}
 const requires={launched:null,briefed:'launched',scouted:'briefed',outpostBriefed:'scouted',outpostShown:'outpostWon',hqKnown:'outpostShown',hqBriefed:'hqKnown',hqShown:'hqWon',reported:'hqShown',completed:'reported'};
 function advance(flag){if(!Object.hasOwn(requires,flag))throw Error('未知黃巾事件');return change((s,p)=>{if(p[flag]||requires[flag]&&!p[requires[flag]])return false;if(flag==='launched'&&!s.storyEvents.grainRoute?.armyFormed)return false;p[flag]=true;return true;});}
 function allowed(kind,p=progress()){return kind==='outpost'?!!p.outpostBriefed&&!p.outpostWon:kind==='hq'?!!p.hqBriefed&&!p.hqWon:false;}
 function begin(kind){return change((s,p)=>{if(!allowed(kind,p))throw Error('目前無法開始這場戰鬥');const runId=crypto.randomUUID();p.pending={kind,runId};return runId;});}
 function complete(kind,runId){return change((s,p)=>{if(!['outpost','hq'].includes(kind))return false;if(p[kind+'Won'])return p[kind+'Run']===runId;if(!allowed(kind,p)||p.pending?.kind!==kind||p.pending?.runId!==runId)return false;const coins=kind==='outpost'?180:260,xp=kind==='outpost'?120:180,w=SharedWallet.init(s);s.chests??={};s.chests.story??={};const total=(s.chests.story.trainingXP||0)+xp;if(!Number.isSafeInteger(w.coins+coins)||!Number.isSafeInteger(total))throw Error('獎勵數值超出範圍');w.coins+=coins;s.chests.story.trainingXP=total;s.rewards.history??=[];s.rewards.history.unshift({key:'yellow-opening:'+kind,name:kind==='outpost'?'初戰黃巾・官道解圍':'初戰黃巾・擊破主營',mode:'story',coins,diamonds:0,trainingXP:xp,at:new Date().toISOString()});p[kind+'Won']=true;p[kind+'Run']=runId;delete p.pending;return true;});}
 return {progress,advance,allowed,begin,complete};
})();
