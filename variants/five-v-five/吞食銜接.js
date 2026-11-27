'use strict';
window.SwallowCampaign=(()=>{
 const profileKey='sgk-swallow-interface-preview-v1',storyKey='sgk-swallow-taoyuan-dialogue-v1';
 const profile=()=>JSON.parse(localStorage.getItem(profileKey)||'{}'),story=()=>JSON.parse(localStorage.getItem(storyKey)||'null');
 function syncParty(){const s=FiveVFiveGame.read(),p=story();for(const name of p?.party||[]){if(!s.party.some(u=>u.name===name)&&!s.reserves?.[name]&&['關羽','張飛'].includes(name)){const i=name==='關羽'?1:2;const officer={name,max:260+i*15,hp:260+i*15,attack:80+i*3,speed:10+i,xp:0};if(s.party.length<5)s.party.push(officer);else{(s.reserves??={})[name]=officer;}}}if(s.formationOrder.length!==s.party.length)s.formationOrder=s.party.map((_,i)=>i);const wallet=profile().rewards?.wallet?.coins||0,received=s.villageCoinsReceived||0;if(wallet>received){s.coins+=wallet-received;s.villageCoinsReceived=wallet;}const diamonds=profile().rewards?.wallet?.diamonds||0,got=s.villageDiamondsReceived||0;if(diamonds>got){s.diamonds=(s.diamonds||0)+diamonds-got;s.villageDiamondsReceived=diamonds;}window.SwallowGrowth?.sync(s);localStorage.setItem(FiveVFiveGame.key,JSON.stringify(s));}
 function battle(kind){syncParty();FiveVFiveGame.beginVillage(kind);location.href='index.html?campaign=1';}
 function settle(){const g=FiveVFiveGame,s=g.read(),b=s.battle;if(!b?.village||b.outcome!=='victory')return;if(b.village==='sweep'){const key='sgk-swallow-village-journey-v1',d=JSON.parse(localStorage.getItem(key)||'{}');d.wins??=[];if(!d.wins.includes(b.id)){d.wins.push(b.id);localStorage.setItem(key,JSON.stringify(d));}}else{const p=profile();p.storyEvents??={};p.storyEvents[b.village==='defense'?'villageDefense':'villageRescue']??={runId:b.id,at:Date.now()};localStorage.setItem(profileKey,JSON.stringify(p));}}
 return {profile,story,syncParty,battle,settle};
})();
if(document.getElementById('hotspots')){
 const canRest=()=>{const s=FiveVFiveGame.read();return !s.battle&&(s.sp<s.spMax||s.party.some(u=>u.hp>0&&u.hp<u.max));};
 window.StoryMorale={...window.StoryMorale,canHomeRest:canRest,restAtHome:()=>{if(!canRest())return false;const g=FiveVFiveGame,s=g.read();for(const u of s.party)if(u.hp>0)u.hp=u.max;s.sp=s.spMax;localStorage.setItem(g.key,JSON.stringify(s));return true;}};
 // Reuse the original village script and dialogue; only route combat and storage separately.
 window.WorldTravel={enabled:()=>false,recordScene:()=>{},consumeArrival:()=>false};
 window.RegionalSweep={start:()=>SwallowCampaign.battle('sweep')};
 window.SceneTest={active:()=>false,holdNavigation:url=>{if(url.includes('villageDefense=1')){SwallowCampaign.battle('defense');return true;}if(url.includes('villageRescue=1')){SwallowCampaign.battle('rescue');return true;}if(url==='徐州城入口.html'){alert('徐州後續劇情正在銜接，桃源村進度已保存。');return true;}return false;}};
}
