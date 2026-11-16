'use strict';
(()=>{
 const frame=document.getElementById('gamePage'),base=new URL('.',location.href);
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
