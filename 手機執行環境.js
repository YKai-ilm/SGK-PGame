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
  let controlled=!!navigator.serviceWorker.controller;
  try{const reg=await navigator.serviceWorker.register('sw.js',{updateViaCache:'none'});let reloading=false,lock=null,lockTimer;
   const config=await (await fetch('離線章節設定.json')).json();
   const page=decodeURIComponent(location.pathname.split('/').pop());
   const required=config.pages[page]||config.pages[page+'.html'];let gate=null;
   window.GameDownloadPack=id=>{for(const worker of new Set([reg.installing,reg.waiting,reg.active].filter(Boolean)))worker.postMessage({type:'OFFLINE_PACK',id});};
   if(required){gate=document.createElement('div');gate.style.cssText='position:fixed;inset:0;background:#faf7eb;z-index:2147483646;display:grid;place-content:center;padding:24px;text-align:center;color:#294234';gate.innerHTML='<h2>準備章節場景</h2><p role="status">正在檢查本章離線資料…</p><button>重試下載</button><p><a href="主介面流程預覽.html">回主城</a></p>';gate.querySelector('button').onclick=()=>GameDownloadPack(required);document.body.append(gate);}
   const requestChapter=()=>{if(required)GameDownloadPack(required);};
   const unlock=()=>{lock?.remove();lock=null;clearTimeout(lockTimer);};
   const block=e=>{if(lock){e.preventDefault();e.stopImmediatePropagation();}};
   document.addEventListener('click',block,true);document.addEventListener('keydown',block,true);
   navigator.serviceWorker.addEventListener('message',e=>{
    if(e.data?.type==='OFFLINE_STATUS'){
     if(gate&&e.source===reg.active&&e.data.version===APP_VERSION){if(e.data.completedPacks?.includes(required)&&e.data.completedPacks?.includes('core')){gate.remove();gate=null;}else gate.querySelector('p').textContent=e.data.phase==='error'?'本章尚未下載完成，請連線後重試。':'正在下載章節資料，請稍候…';}
     if(e.source===reg.active&&(reg.installing||reg.waiting))return;window.GameOffline?.receive(e.data);return;}
    if(e.data?.type==='UPDATE_ABORT'){unlock();return;}
    if(e.data?.type!=='CAN_UPDATE')return;
    const ready=GameUpdate.safe();if(ready){unlock();lock=document.createElement('div');lock.style.cssText='position:fixed;inset:0;z-index:2147483647;cursor:wait';lock.setAttribute('aria-label','正在確認更新');document.body.append(lock);lockTimer=setTimeout(unlock,4500);}
    e.source?.postMessage({type:'UPDATE_READY',nonce:e.data.nonce,ready});
   });
   navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!controlled){controlled=true;return;}if(!reloading&&reg.active){reloading=true;location.reload();}});
   const report=()=>{const worker=reg.installing||reg.waiting||reg.active;worker?.postMessage({type:'OFFLINE_QUERY'});};
   const sync=()=>report();
   const check=()=>{if(reg.waiting&&GameUpdate.safe())reg.waiting.postMessage({type:'CHECK_UPDATE'});};
   const watch=()=>{const worker=reg.installing;if(worker)worker.addEventListener('statechange',()=>{check();if(worker.state==='activated'||worker.state==='installed')requestChapter();});};
   reg.addEventListener('updatefound',watch);watch();
   setInterval(check,5000);setInterval(()=>{reg.update().catch(()=>{});sync();},60000);
   window.addEventListener('online',()=>{reg.update().catch(()=>{});requestChapter();sync();});
   document.addEventListener('visibilitychange',()=>{if(!document.hidden){reg.update().catch(()=>{});sync();check();}});
   requestChapter();sync();check();
   window.GameUpdate.status=()=>reg.waiting?'新版已準備，回主城後會自動更新':'目前版本 '+APP_VERSION;
  }catch(e){console.warn('更新檢查暫時無法連線',e);}
 });
})();
