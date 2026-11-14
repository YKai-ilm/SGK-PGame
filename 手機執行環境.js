'use strict';
// 在遊戲讀取進度前恢復未完成匯入；不隨版本更新清除 localStorage。
try{FullSave.recover();}catch(e){document.documentElement.textContent='存檔恢復未完成，請保留網站資料並重新開啟。'+e.message;throw e;}
(()=>{
 let epoch=localStorage.getItem(FullSave.epochKey),stale=false;
 const set=Storage.prototype.setItem,remove=Storage.prototype.removeItem;
 function check(store,k){if(store===localStorage&&FullSave.owns(k)&&localStorage.getItem(FullSave.epochKey)!==epoch){stale=true;throw Error('另一個頁面已匯入存檔，請重新開啟遊戲');}}
 Storage.prototype.setItem=function(k,v){check(this,k);return set.call(this,k,v);};
 Storage.prototype.removeItem=function(k){check(this,k);return remove.call(this,k);};
 window.addEventListener('storage',e=>{if(e.key!==FullSave.epochKey)return;stale=true;const d=document.createElement('dialog');d.innerHTML='<h2>進度已在另一頁恢復</h2><p>本頁已停止保存，請重新開啟，避免覆蓋剛匯入的進度。</p><button>重新開啟</button>';d.querySelector('button').onclick=()=>location.reload();document.body.append(d);d.showModal();});
 window.GameUpdate={safe:()=>!stale&&window.GameCanUpdate?.()===true};
 window.addEventListener('load',async()=>{
  if(!('serviceWorker' in navigator)||!['https:','http:'].includes(location.protocol)||!window.APP_VERSION)return;
  try{const reg=await navigator.serviceWorker.register('sw.js',{updateViaCache:'none'});let reloading=false;
   navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='CAN_UPDATE')e.source?.postMessage({type:'UPDATE_READY',nonce:e.data.nonce,ready:GameUpdate.safe()});});
   navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloading&&reg.active){reloading=true;location.reload();}});
   const check=()=>{if(reg.waiting&&GameUpdate.safe())reg.waiting.postMessage({type:'CHECK_UPDATE'});};
   reg.addEventListener('updatefound',()=>reg.installing?.addEventListener('statechange',check));
   setInterval(check,5000);setInterval(()=>reg.update().catch(()=>{}),60000);
   document.addEventListener('visibilitychange',()=>{if(!document.hidden){reg.update().catch(()=>{});check();}});
   check();
   window.GameUpdate.status=()=>reg.waiting?'新版已準備，回主城後會自動更新':'目前版本 '+APP_VERSION;
  }catch(e){console.warn('更新檢查暫時無法連線',e);}
 });
})();
