'use strict';
(()=>{
 const $=id=>document.getElementById(id),dialog=$('foundItem'),close=$('closeFound'),message=$('foundText');
 let lines=null,index=0,done=null,timer=null,waiting=false,acting=false;
 function refresh(){const q=YunlongRescue.progress();$('banditEncounter').hidden=YunlongStory.completed();$('daniu').hidden=!YunlongStory.completed()||!!q.daniuCollected;$('huatuo').hidden=!YunlongStory.huatuoVisible();$('xiaoniu').hidden=!q.daniuCollected||!!q.rescued;$('rescueChest').hidden=!q.rescued;$('rescueChest').classList.toggle('opened',!!q.chestOpened);$('rescueChest').setAttribute('aria-label',q.chestOpened?'已開啟的救援寶箱':'開啟救援寶箱');}
 function display(){message.textContent=lines[index][0]+'：\n'+lines[index][1];close.textContent=index===lines.length-1?'結束對話':'下一句';close.hidden=false;dialog.scrollTop=0;}
 function talk(value,finish){lines=value;index=0;done=finish;display();if(!dialog.open)dialog.showModal();}
 function note(text,label='確定',action=null){lines=null;done=action;message.textContent=text;close.textContent=label;close.hidden=false;if(!dialog.open)dialog.showModal();}
 function guard(fn){try{return fn();}catch(e){message.textContent=e.message+'\n進度尚未完成，請再試一次。';close.hidden=false;return false;}}
 document.addEventListener('click',e=>{if(!dialog.open||!lines||waiting||acting)return;if(e.target.closest('button,a,input,select,textarea'))return;e.preventDefault();e.stopImmediatePropagation();close.click();},true);
 close.onclick=async()=>{if(waiting||acting)return;if(lines&&index<lines.length-1){index++;display();return;}acting=true;try{const fn=done;done=null;lines=null;const run=()=>{try{return fn?.();}catch(e){done=fn;message.textContent=e.message+'\n請按按鈕重試。';return false;}};const result=navigator.locks?await navigator.locks.request('yunlong-hidden-reward',run):run();refresh();if(result!==false&&dialog.open)dialog.close();}finally{acting=false;}};
 function clear(){clearTimeout(timer);lines=null;done=null;waiting=false;close.textContent='確定';close.hidden=false;}
 dialog.addEventListener('close',clear);dialog.addEventListener('cancel',e=>{if(waiting||acting)e.preventDefault();else clear();});
 $('huatuo').onclick=()=>{if(YunlongStory.huatuoVisible())talk(YunlongHuatuoDialogue,()=>{YunlongStory.finishHuatuoTalk();});};
 $('daniu').onclick=()=>{if($('daniu').hidden)return;if(JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')||'{}').storyEvents?.yunlongHuatuoTalkCompleted)talk(YunlongRescueDialogue.daniu,()=>{YunlongRescue.collectDaniu();});else talk([['大牛','天啊！終於有人把盜賊打跑了。我卡在山上好一陣子了，因為盜賊堵住了道路，一直沒辦法下山。']],()=>{YunlongStory.finishDaniuTalk();});};
 function healing(){waiting=true;close.hidden=true;message.textContent='華陀正在為小牛敷上茯苓草本膏……';timer=setTimeout(()=>{message.textContent='小牛左腳的血止住了，華陀正在救醒中。';timer=setTimeout(()=>{waiting=false;talk(YunlongRescueDialogue.awake,()=>{YunlongRescue.rescue();});},2000);},2000);return false;}
 $('xiaoniu').onclick=()=>{const q=YunlongRescue.progress();if(!q.daniuCollected||q.rescued)return;if(q.medicineUsed){if(!dialog.open)dialog.showModal();healing();}else talk(YunlongRescueDialogue.injured,()=>{note('使用茯苓草本膏，讓華陀救治小牛。','使用茯苓草本膏',()=>{if(!YunlongRescue.useMedicine())return false;return healing();});return false;});};
 $('rescueChest').onclick=()=>guard(()=>{const q=YunlongRescue.progress();if(q.chestOpened){note(q.returnPending?'獎勵已收好，與大家一起回徐州城。':'這是一只空寶箱。',q.returnPending?'一起回徐州城':'確定',q.returnPending?()=>{location.href='徐州劇情.html';}:null);return;}if(!q.rescued)return;note('寶箱裡有字卡經驗書（120經驗）×1、驛馬×1。','收下並一起回徐州城',()=>{YunlongRescue.chest();location.href='徐州劇情.html';});});
 $('banditEncounter').onclick=()=>{if(waiting||YunlongStory.completed())return;note('此路是我開，欲從此路過，留下買路財！');waiting=true;close.hidden=true;timer=setTimeout(()=>{sessionStorage.setItem('yunlong-return-scroll',String($('view').scrollTop));location.href='戰場直版.html?yunlongBandits=1&returnTo='+encodeURIComponent('雲龍山場景預覽.html');},2000);};
 addEventListener('pagehide',()=>clearTimeout(timer));addEventListener('pageshow',()=>{clear();if(dialog.open)dialog.close();refresh();});addEventListener('storage',refresh);
 addEventListener('load',()=>{const value=sessionStorage.getItem('yunlong-return-scroll');if(value!==null){$('view').scrollTop=Number(value)||0;sessionStorage.removeItem('yunlong-return-scroll');}},{once:true});refresh();
})();
