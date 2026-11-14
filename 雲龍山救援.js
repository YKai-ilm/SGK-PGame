'use strict';
// Rewards and rescue stages share one authoritative save. Legacy ointment ownership
// is masked by medicineUsed, so interruption never consumes it without progress.
window.YunlongRescue=(()=>{
 const key='three-kingdoms-interface-preview-v1',hiddenKey='three-kingdoms-taoyuan-hidden-items-v1';
 const read=()=>JSON.parse(localStorage.getItem(key)||'{"version":1,"tutorial":{"status":"new","step":0},"mode":"story","storyFaction":"蜀","teams":{},"unlocks":{"story":{"heroes":[],"letters":[]},"battle":{"heroes":[],"letters":[]}},"page":"home"}');
 const progress=()=>read().storyEvents?.yunlongRescue||{};
 function change(fn){const s=read();s.storyEvents??={};const q=s.storyEvents.yunlongRescue??={};const result=fn(s,q);if(result!==false)localStorage.setItem(key,JSON.stringify(s));return result;}
 function equippedItem(s,item){s.equipment??={};const bag=s.equipment.story??={items:[],loadouts:{}};bag.items??=[];if(!bag.items.some(i=>i.id===item.id))bag.items.push(item);}
 function collectDaniu(){return change((s,q)=>{if(!s.storyEvents.yunlongHuatuoTalkCompleted||q.daniuCollected)return false;q.daniuCollected=true;return true;});}
 function useMedicine(){return change((s,q)=>{if(!q.daniuCollected)return false;if(q.medicineUsed)return true;if(JSON.parse(localStorage.getItem(hiddenKey)||'{}').fulingPaste!==1)throw Error('背包沒有茯苓草本膏，無法開始救治。');q.medicineUsed=true;return true;});}
 function rescue(){return change((s,q)=>{if(!q.medicineUsed||q.rescued)return false;q.rescued=true;return true;});}
 function chest(){return change((s,q)=>{if(!q.rescued||q.chestOpened)return false;s.storyItems??={};s.storyItems.letterXPBook120=(s.storyItems.letterXPBook120||0)+1;equippedItem(s,{id:'yunlong-rescue-horse',name:'驛馬',slot:'mount',source:'華陀初現・救援小牛',description:'大牛與小牛贈送的驛馬。'});q.chestOpened=true;q.returnPending=true;return true;});}
 function stay(){return change((s,q)=>{if(!q.chestOpened||q.completed)return false;s.rewards??={};const r=s.rewards;r.claims??={};r.history??=[];r.modes??={};const m=r.modes.story??={coins:0,diamonds:0,visited:[],teamReady:false};const id='yunlongRescue:diamonds-v1';if(!r.claims[id]){m.diamonds=(m.diamonds||0)+2;const record={key:id,name:'仁心救援',mode:'story',coins:0,diamonds:2,at:new Date().toISOString()};r.claims[id]=record;r.history.unshift(record);}q.completed=true;q.returnPending=false;q.achievementNotice=true;return true;});}
 function dismissAchievement(){return change((s,q)=>{q.achievementNotice=false;return true;});}
 function gift(){return change((s,q)=>{if(!q.completed||q.bookGiven)return false;equippedItem(s,{id:'yunlong-qingnang-remnant',name:'青囊書（殘）',slot:'accessory',effect:'qingnangRemnant',source:'華陀贈書',description:'裝備者每秒恢復最大生命1%；軍師裝備解鎖復體術：消耗4計策值，治療生命比例最低武將400，再每秒150持續3秒，冷卻5秒。'});q.bookGiven=true;return true;});}
 function useBook(){return change((s)=>{if(!(s.storyItems?.letterXPBook120>0))return false;s.chests??={};s.chests.story??={};s.chests.story.trainingXP=(s.chests.story.trainingXP||0)+120;s.storyItems.letterXPBook120--;return true;});}
 return {progress,collectDaniu,useMedicine,rescue,chest,stay,dismissAchievement,gift,useBook};
})();
window.YunlongRescueDialogue={
 daniu:[['大牛','華藥師，能看到你太好了，這三個英雄救了我，也救了您！我們趕快去救小牛吧！']],
 injured:[['小牛','....（暈倒中）'],['華陀','快，給我你包中的茯苓草本膏。']],
 awake:[['小牛','華藥師，我？這是怎麼了？'],['劉備','天啊！你醒了！你應該是失血過多暈倒了，華藥師把你救回來了！'],['華陀','小牛啊！生命可貴，你能活著太好了！'],['小牛','多謝！華藥師，救命之恩沒齒難忘！諸位英雄，可隨我們回城，讓我與兄長好好達謝一番。']],
 gift:[['華陀','諸位英雄辛苦了，在日後征戰的日子中，若有需要小老兒幫忙的地方，隨時可託人來徐州城訪小老兒。'],['華陀','另外這些年，我寫了個簡單的醫藥急救書冊，也一併贈與諸位！']]
};
