'use strict';
window.ThreeLordsQuest=(()=>{
 const key='three-kingdoms-interface-preview-v1',read=()=>JSON.parse(localStorage.getItem(key)||'{}'),progress=()=>read().storyEvents?.threeLords||{};
 // 葛陂主線到達時由主線寫入 gebei.started；不以大地圖到訪、集卡或黃巾章通關代替。
 function eligible(s=read()){const t=s.storyEvents?.threeZhang;return s.mode==='story'&&s.storyEvents?.gebei?.started===true&&t?.zhangLiangChoice==='spare'&&t?.zhangBaoChoice==='spare'&&t?.chapterCompleted===true;}
 function change(fn){const s=read();if(!eligible(s))return false;s.storyEvents??={};const p=s.storyEvents.threeLords??={};const result=fn(s,p);if(result!==false)localStorage.setItem(key,JSON.stringify(s));return result;}
 function advance(flag){return change((s,p)=>{const gates={accepted:true,briefed:p.accepted,revealed:p.brothersWon,completed:p.lordsWon};if(p[flag]||!gates[flag])return false;p[flag]=true;if(flag==='completed'){s.unlocks??={};for(const mode of ['story','battle']){const own=s.unlocks[mode]??={heroes:[],letters:[]};own.heroes??=[];if(!own.heroes.includes('張角'))own.heroes.push('張角');}p.zhangJiaoCardGiven=true;s.rewards??={};s.rewards.history??=[];s.rewards.history.unshift({key:'three-lords:zhang-jiao',name:'天地人三公討伐完成',mode:'story',heroes:['張角'],coins:0,diamonds:0,at:new Date().toISOString()});}return true;});}
 function begin(stage){return change((s,p)=>{if(!['brothers','lords'].includes(stage)||!p.briefed||p.completed||stage==='brothers'&&p.brothersWon||stage==='lords'&&(!p.revealed||p.lordsWon))return false;return p.pending={stage,runId:crypto.randomUUID()};});}
 function complete(runId,win,outcome){return change((s,p)=>{if(p.resolvedRuns?.includes(runId))return true;if(!p.pending||p.pending.runId!==runId||!['victory','defeat','retreat'].includes(outcome)||win!==(outcome==='victory'))return false;if(!win)return true;p[p.pending.stage+'Won']=true;p.resolvedRuns??=[];p.resolvedRuns.push(runId);delete p.pending;return true;});}
 return {eligible,progress,advance,begin,complete};
})();
