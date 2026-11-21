'use strict';
window.WanQuest=(()=>{
 const key='three-kingdoms-interface-preview-v1',read=()=>JSON.parse(localStorage.getItem(key)||'{}'),progress=()=>read().storyEvents?.wancheng||{};
 const gates={ordered:s=>!!s.storyEvents?.hanCampaign?.completed,elder:p=>p.ordered&&!p.won,worker:p=>p.ordered&&!p.won,letter:p=>p.elder&&p.worker&&!p.won,sent:p=>p.letter&&!p.won,divided:p=>p.sent&&!p.won,briefed:p=>p.ordered&&!p.won,shown:p=>p.won,settled:p=>p.shown,completed:p=>p.settled};
 function change(fn){const s=read();s.storyEvents??={};const p=s.storyEvents.wancheng??={};const result=fn(s,p);if(result!==false)localStorage.setItem(key,JSON.stringify(s));return result;}
 function item(s,id,n){s.storyItems??={};const v=Number(s.storyItems[id]||0);if(!Number.isSafeInteger(v)||v<0||!Number.isSafeInteger(v+n))throw Error('道具數量無效');s.storyItems[id]=v+n;}
 function advance(flag){return change((s,p)=>{if(!gates[flag]||p[flag]||!gates[flag](flag==='ordered'?s:p))return false;if(flag==='letter')item(s,'surrenderLetter',1);if(flag==='completed')item(s,'letterXPBook120',2);p[flag]=true;return true;});}
 const route=(p=progress())=>p.divided?'letter':'direct';
 function begin(){return change((s,p)=>{if(!p.ordered||!p.briefed&&!p.divided||p.won)throw Error('請先完成城門對話');return p.pending={kind:'wancheng',route:route(p),runId:crypto.randomUUID()};});}
 function complete(runId,battleRoute){return change((s,p)=>{if(p.won)return p.wonRun===runId&&p.wonRoute===battleRoute;if(!p.ordered||p.pending?.runId!==runId||p.pending.route!==battleRoute)return false;const w=SharedWallet.init(s);if(!Number.isSafeInteger(w.coins+400))throw Error('金幣超出範圍');w.coins+=400;s.rewards.history??=[];s.rewards.history.unshift({key:'wancheng:first-win',name:'宛城討伐',mode:'story',coins:400,diamonds:0,at:new Date().toISOString()});p.won=true;p.wonRun=runId;p.wonRoute=battleRoute;delete p.pending;return true;});}
 function collect(id){return change((s,p)=>{if(p.loot?.[id]||!(id==='bag'?p.ordered:id==='chest'?p.settled:false))return false;if(id==='bag'){const w=SharedWallet.init(s);if(!Number.isSafeInteger(w.coins+40))throw Error('金幣超出範圍');w.coins+=40;}else item(s,'redHeartPill',1);p.loot??={};p.loot[id]=true;return true;});}
 return {progress,advance,begin,complete,collect,route,canEnter:name=>['宛城外圍','宛城城門'].includes(name)&&!!progress().ordered};
})();
