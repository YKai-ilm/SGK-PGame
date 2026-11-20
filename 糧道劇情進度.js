'use strict';
// All grain-route progression, items and payments commit together in the profile.
window.GrainQuest=(()=>{
 const key='three-kingdoms-interface-preview-v1';
 const read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 const progress=()=>read().storyEvents?.grainRoute||{};
 function change(fn){const s=read();s.storyEvents??={};const q=s.storyEvents.grainRoute??={};const result=fn(s,q);if(result!==false)localStorage.setItem(key,JSON.stringify(s));return result;}
 const requirements={routeKnown:null,heardMing:'routeKnown',captainBriefed:'heardMing',rescueShown:'rescueWon',captainGift:'rescueShown',reported:'captainGift',trailKnown:'reported',marksKnown:'trailKnown',campBriefed:'marksKnown',campShown:'campWon',cargoChecked:'campWon',cargoVerified:'cargoChecked',completed:'cargoVerified'};
 function advance(flag){if(!Object.hasOwn(requirements,flag))throw Error('未知糧道事件');return change((s,q)=>{if(q[flag]||requirements[flag]&&!q[requirements[flag]])return false;if(flag==='routeKnown'){const city=JSON.parse(localStorage.getItem('three-kingdoms-xuzhou-story-v1')||'{}');if(!city.flags?.missing)return false;}if(flag==='captainGift'){s.storyItems??={};s.storyItems.damagedLeatherArmor=1;}if(flag==='reported'||flag==='completed'){const coins=flag==='reported'?60:140,xp=flag==='reported'?100:150;const w=SharedWallet.init(s);if(!Number.isSafeInteger(w.coins+coins))throw Error('金幣超出上限');s.chests??={};s.chests.story??={};const total=(s.chests.story.trainingXP||0)+xp;if(!Number.isSafeInteger(total))throw Error('經驗超出上限');w.coins+=coins;s.chests.story.trainingXP=total;s.rewards.history??=[];s.rewards.history.unshift({key:'grain-route:'+flag,name:flag==='reported'?'護衛隊長救援覆命':'運糧護衛完成',mode:'story',coins,diamonds:0,trainingXP:xp,at:new Date().toISOString()});}q[flag]=true;return true;});}
 function allowed(kind,q=progress()){return kind==='rescue'?!!q.captainBriefed&&!q.rescueWon:kind==='camp'?!!q.campBriefed&&!q.campWon:false;}
 function begin(kind){return change((s,q)=>{if(!allowed(kind,q))throw Error('目前無法開始此戰鬥');const runId=crypto.randomUUID();q.pending={kind,runId};return runId;});}
 function complete(kind,runId){return change((s,q)=>{if(q[kind+'Won'])return true;if(!allowed(kind,q)||q.pending?.kind!==kind||q.pending?.runId!==runId)return false;q[kind+'Won']=true;q[kind+'Run']=runId;delete q.pending;return true;});}
 function repair(){return change((s,q)=>{if(q.armorRepaired||!(s.storyItems?.damagedLeatherArmor>0))return false;const w=SharedWallet.init(s);if(w.coins<30)throw Error('金幣不足，修復需要 30 金幣。');s.equipment??={};const bag=s.equipment.story??={items:[],loadouts:{}};bag.items??=[];if(bag.items.some(i=>i.id==='grain-route-repaired-armor'))throw Error('這套皮甲已修復');w.coins-=30;s.storyItems.damagedLeatherArmor--;bag.items.push({id:'grain-route-repaired-armor',name:'皮甲',slot:'armor',source:'糧道隊長贈禮・修復',description:'修復師重新縫補的皮甲。'});q.armorRepaired=true;return true;});}
 return {progress,advance,allowed,begin,complete,repair,repairCost:30};
})();
