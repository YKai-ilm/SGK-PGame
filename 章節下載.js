'use strict';
(async()=>{
 const root=document.getElementById('packs'),summary=document.getElementById('packSummary');
 if(location.protocol==='file:'){summary.textContent='本機原始檔案已在電腦中，無需另外下載章節。';return;}
 try{
  const config=await (await fetch('離線章節設定.json')).json();
  function render(s){
   summary.textContent=window.GameOffline?.summary()||'正在檢查下載狀態…';root.replaceChildren();
   for(const p of config.packs){const section=document.createElement('section'),title=document.createElement('h2'),info=document.createElement('small'),button=document.createElement('button');title.textContent=p.name;
    const current=s?.version===window.APP_VERSION,ready=current&&s?.completedPacks?.includes(p.id),selected=s?.selected?.includes(p.id)||p.default,meta=s?.packs?.find(x=>x.id===p.id);
    info.textContent=(meta?.bytes?(meta.bytes/1048576).toFixed(1)+' MB · ':'')+(ready?'已備妥':selected?'等待或下載中':'尚未下載');
    button.textContent=ready?'已備妥':selected?'繼續下載／重試':'下載此章節';button.disabled=ready||!navigator.onLine;
    button.onclick=()=>window.GameDownloadPack?.(p.id);section.append(title,info,button);root.append(section);
   }
  }
  addEventListener('game-offline-status',e=>render(e.detail));addEventListener('online',()=>render(window.GameOffline?.state()));addEventListener('offline',()=>render(window.GameOffline?.state()));render(window.GameOffline?.state());
 }catch{summary.textContent='無法讀取章節清單，請連線後重試。';}
})();
