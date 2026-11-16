'use strict';
window.GameOffline=(()=>{
 let summary='正在檢查離線資料',latest=null,bar,text,progress;
 const mb=n=>(n/1048576).toFixed(1);
 function receive(s){
  latest=s;
  if(s.phase==='ready')summary=s.version===window.APP_VERSION?'已下載章節已備妥，可離線遊玩':'新版資料已備妥，回主城後更新';
  else if(s.phase==='error')summary=s.reason==='storage'?'儲存空間不足，請騰出空間後重試':s.reason==='integrity'?'資料正在更新，稍後自動重試':'下載暫停，恢復連線後自動補齊';
  else summary='離線資料 '+Math.floor(s.bytes/Math.max(1,s.totalBytes)*100)+'% · '+mb(s.bytes)+' / '+mb(s.totalBytes)+' MB';
  if(!bar){bar=document.createElement('aside');bar.id='offlineDownload';bar.style.cssText='position:fixed;top:0;left:0;right:0;z-index:1000;pointer-events:none;padding:8px 16px;background:#e8eddb;color:#294234;font:13px/1.5 system-ui';text=document.createElement('span');text.setAttribute('role','status');progress=document.createElement('progress');progress.style.cssText='display:block;width:100%;height:5px;margin-top:5px';bar.append(text,progress);document.body.prepend(bar);}
  bar.hidden=s.phase==='ready';
  text.textContent=summary;progress.max=Math.max(1,s.totalBytes);progress.value=s.bytes;progress.hidden=s.phase==='ready'||s.phase==='error';
  const detail=document.getElementById('offlineSummary');if(detail)detail.textContent=summary;
  window.dispatchEvent(new CustomEvent('game-offline-status',{detail:s}));
 }
 addEventListener('offline',()=>{if(latest&&latest.phase!=='ready')receive({...latest,phase:'error',reason:'network'});});
 return {receive,summary:()=>summary,state:()=>latest};
})();
