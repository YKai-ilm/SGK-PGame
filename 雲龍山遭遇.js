'use strict';
(()=>{const button=document.getElementById('banditEncounter'),dialog=document.getElementById('foundItem'),close=document.getElementById('closeFound'),message=document.getElementById('foundText');let pending=false,timer=null;
 const daniu=document.getElementById('daniu'),huatuo=document.getElementById('huatuo');let talkingDaniu=false,huatuoLine=-1;
 function showHuatuo(){const [speaker,text]=YunlongHuatuoDialogue[huatuoLine];message.textContent=speaker+'：\n'+text;close.textContent=huatuoLine===YunlongHuatuoDialogue.length-1?'結束對話':'下一句';dialog.scrollTop=0;}
 huatuo.onclick=()=>{if(!YunlongStory.huatuoVisible())return;talkingDaniu=false;huatuoLine=0;close.hidden=false;showHuatuo();dialog.showModal();};
 function refresh(){const done=YunlongStory.completed();button.hidden=done;daniu.hidden=!done;huatuo.hidden=!YunlongStory.huatuoVisible();if(done&&pending){clearTimeout(timer);pending=false;button.disabled=false;close.hidden=false;if(dialog.open)dialog.close();}}
 daniu.onclick=()=>{if(!YunlongStory.completed())return;talkingDaniu=true;message.textContent='天啊！終於有人把盜賊打跑了。我卡在山上好一陣子了，因為盜賊堵住了道路，一直沒辦法下山。';close.hidden=false;dialog.showModal();};
 const closeOriginal=close.onclick;
 close.onclick=()=>{if(huatuoLine>=0){if(huatuoLine<YunlongHuatuoDialogue.length-1){huatuoLine++;showHuatuo();return;}try{YunlongStory.finishHuatuoTalk();refresh();}catch{message.textContent='對話進度尚未保存，請按結束對話重試。';return;}huatuoLine=-1;}if(talkingDaniu){try{YunlongStory.finishDaniuTalk();refresh();}catch{message.textContent='對話進度尚未保存，請按確定重試。';return;}}talkingDaniu=false;close.textContent='確定';closeOriginal();};
 function clearTalk(){talkingDaniu=false;huatuoLine=-1;close.textContent='確定';}
 dialog.addEventListener('close',clearTalk);dialog.addEventListener('cancel',clearTalk);
 function travel(){if(YunlongStory.completed()){refresh();return;}sessionStorage.setItem('yunlong-return-scroll',String(document.getElementById('view').scrollTop));location.href='戰場直版.html?yunlongBandits=1&returnTo='+encodeURIComponent('雲龍山場景預覽.html');}
 button.onclick=()=>{if(pending||YunlongStory.completed())return;pending=true;button.disabled=true;close.hidden=true;message.textContent='此路是我開，欲從此路過，留下買路財！';dialog.showModal();timer=setTimeout(travel,2000);};
 dialog.addEventListener('cancel',e=>{if(pending)e.preventDefault();});addEventListener('pagehide',()=>clearTimeout(timer));addEventListener('pageshow',()=>{if(pending){pending=false;button.disabled=false;close.hidden=false;if(dialog.open)dialog.close();}});
 function restore(){const value=sessionStorage.getItem('yunlong-return-scroll');if(value!==null){document.getElementById('view').scrollTop=Number(value)||0;sessionStorage.removeItem('yunlong-return-scroll');}}addEventListener('load',restore,{once:true});addEventListener('pageshow',refresh);addEventListener('storage',refresh);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});refresh();
})();
