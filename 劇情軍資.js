'use strict';
window.StorySupplies=(()=>{
 const key='three-kingdoms-interface-preview-v1',claim='taoyuanMerchant';
 const count=v=>Number.isSafeInteger(v)&&v>=0?v:0;
 function read(){return JSON.parse(localStorage.getItem(key)||'null')||{version:1,tutorial:{status:'new',step:0,reward:null},mode:'story',storyFaction:'蜀',libraryFaction:'蜀',teams:{},unlocks:{story:{heroes:[],letters:[]},battle:{heroes:[],letters:[]}},page:'home'};}
 function owned(){return count(read().storyItems?.foodVoucher);}
 function claimed(){return !!read().rewards?.claims?.[claim];}
 function merchantKnown(prerequisitesComplete=false){const s=read();if(s.storyEvents?.taoyuanMerchantKnown)return true;if(!prerequisitesComplete&&!s.rewards?.claims?.[claim])return false;s.storyEvents??={};s.storyEvents.taoyuanMerchantKnown=true;localStorage.setItem(key,JSON.stringify(s));return true;}
 function grant(){const s=read();s.rewards??={};s.rewards.claims??={};if(s.rewards.claims[claim])return false;window.SharedWallet.init(s).coins+=200;s.storyItems??={};s.storyItems.foodVoucher=count(s.storyItems.foodVoucher)+1;s.rewards.claims[claim]={at:Date.now(),coins:200,foodVoucher:1};s.rewards.history??=[];s.rewards.history.unshift({id:claim,name:'張世平贈軍資',mode:'story',at:Date.now(),coins:200,diamonds:0});localStorage.setItem(key,JSON.stringify(s));return true;}
 function spend(){const s=read(),n=count(s.storyItems?.foodVoucher);if(!n)return false;s.storyItems.foodVoucher=n-1;localStorage.setItem(key,JSON.stringify(s));return true;}
 function completeOath(){const s=read();s.storyEvents??={};if(s.storyEvents.peachOath)return false;s.storyEvents.peachOath={at:Date.now()};localStorage.setItem(key,JSON.stringify(s));return true;}
 const farewellClaim='taoyuanMotherFarewell';
 function farewellClaimed(){return !!read().rewards?.claims?.[farewellClaim];}
 function grantFarewell(){const s=read();if(s.rewards?.claims?.[farewellClaim])return false;if(!VillageDefense.rescueCompleted()||VillageJourney.status().wins<10)throw Error('尚未完成餞行條件');
 const gifts=[['sword','新兵木劍'],['blade','新兵短木刀'],['spear','新兵木槍']];
 s.equipment??={};s.equipment.story??={items:[],loadouts:{}};s.equipment.story.items??=[];
 for(const [weaponType,name] of gifts){const id='taoyuan-mother-'+weaponType;if(!s.equipment.story.items.some(i=>i.id===id))s.equipment.story.items.push({id,name,slot:'weapon',weaponType,source:'劉母餞行',description:'劉母餞行所贈的新兵木製兵器。能力數值待定。'});}
 s.rewards??={};s.rewards.claims??={};s.rewards.claims[farewellClaim]={at:Date.now(),items:gifts.map(([,name])=>name)};
 localStorage.setItem(key,JSON.stringify(s));return true;}
 return{key,owned,claimed,merchantKnown,grant,spend,completeOath,farewellClaimed,grantFarewell};
})();
