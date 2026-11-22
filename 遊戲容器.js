'use strict';
(()=>{
 const frame=document.getElementById('gamePage'),base=new URL('.',location.href);
 // 下載列佔用外層空間，避免浮在遊戲標題／手機安全區上。
 let downloadBar;
 window.GameShowOfflineStatus=(summary,s)=>{
  if(!downloadBar){downloadBar=document.createElement('aside');downloadBar.id='shellOfflineDownload';downloadBar.style.cssText='flex:none;padding:8px 12px;background:#e8eddb;color:#294234;border-bottom:1px solid #b7bea8;font:13px/1.5 system-ui';const label=document.createElement('span');label.setAttribute('role','status');const progress=document.createElement('progress');progress.style.cssText='display:block;width:100%;height:5px;margin-top:5px';downloadBar.append(label,progress);frame.before(downloadBar);}
  downloadBar.hidden=s.phase==='ready'&&s.version===window.APP_VERSION;downloadBar.firstElementChild.textContent=summary;const progress=downloadBar.lastElementChild;progress.max=Math.max(1,s.totalBytes||0);progress.value=s.bytes||0;progress.hidden=s.phase==='ready'||s.phase==='error';
 };
 function route(value){try{const u=new URL(value||'主介面流程預覽.html',base),name=decodeURIComponent(u.pathname.slice(base.pathname.length));if(u.origin!==base.origin||new URL('.',u).href!==base.href||!name.endsWith('.html')||name==='index.html')return null;return u;}catch{return null;}}
 function requested(){return route(new URLSearchParams(location.hash.slice(1)).get('page'))||route('主介面流程預覽.html');}
 frame.src=requested().href;
 frame.addEventListener('load',()=>{try{const u=route(frame.contentWindow.location.href);if(!u)return;const page=decodeURIComponent(u.pathname.slice(base.pathname.length))+u.search+u.hash;history.replaceState(null,'','#page='+encodeURIComponent(page));document.title=frame.contentDocument.title||'三國走圖塔防';}catch{}});
 window.addEventListener('hashchange',()=>{const u=requested();try{if(frame.contentWindow.location.href===u.href)return;}catch{}frame.src=u.href;});
 // 外層也屬於 Service Worker 的視窗客戶端，由遊戲頁判斷安全更新時機。
 window.GameCanUpdate=()=>{try{return frame.contentWindow.GameCanUpdate?.()===true;}catch{return false;}};
 if('serviceWorker' in navigator){
  let controlled=!!navigator.serviceWorker.controller,reloading=false;
  navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='CAN_UPDATE')e.source?.postMessage({type:'UPDATE_READY',nonce:e.data.nonce,ready:window.GameCanUpdate()});});
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!controlled){controlled=true;return;}if(!reloading){reloading=true;location.reload();}});
 }
})();
