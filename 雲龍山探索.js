'use strict';
window.YunlongExploration=(()=>{
 const key='three-kingdoms-interface-preview-v1',claim='yunlongYellowFlowersCloth';
 function read(){return JSON.parse(localStorage.getItem(key)||'null')||{version:1,mode:'story',storyFaction:'蜀',page:'home'};}
 function claimed(){return !!read().rewards?.claims?.[claim];}
 function collect(){const s=read();if(s.rewards?.claims?.[claim])return false;
 s.equipment??={};s.equipment.story??={items:[],loadouts:{}};s.equipment.story.items??=[];
 if(!s.equipment.story.items.some(i=>i.id===claim))s.equipment.story.items.push({id:claim,name:'布衣',slot:'armor',source:'雲龍山黃色花叢',description:'在雲龍山花叢中找到的布衣。'});
 s.rewards??={};s.rewards.claims??={};s.rewards.claims[claim]={at:Date.now(),items:['布衣']};
 // 物品與一次性記號存於同一筆存檔，寫入失敗不視為已領取。
 localStorage.setItem(key,JSON.stringify(s));return true;}
 return {claimed,collect};
})();
(()=>{const spot=document.getElementById('yellowFlowers'),dialog=document.getElementById('foundItem'),message=document.getElementById('foundText');
 document.getElementById('villager').onclick=()=>{message.textContent='這裡是雲龍山，華藥師似乎往山上去了，沿途別忘了看看花花草草，以及美麗的風景唷！';dialog.showModal();};
 function refresh(){try{spot.hidden=YunlongExploration.claimed();}catch{spot.hidden=false;}}
 spot.onclick=async()=>{spot.disabled=true;try{const act=()=>YunlongExploration.collect();const gained=navigator.locks?await navigator.locks.request('yunlong-hidden-reward',act):act();message.textContent=gained?'在黃色花叢中發現布衣！獲得防具「布衣」一件，已收入背包。':'這裡已經找過了。';refresh();}catch{message.textContent='存檔未能保存，尚未領取，請稍後再試。';}finally{spot.disabled=false;dialog.showModal();}};
 document.getElementById('closeFound').onclick=()=>dialog.close();addEventListener('storage',refresh);refresh();})();
