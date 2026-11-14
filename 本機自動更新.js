'use strict';
// file:// 不能使用 Service Worker，以外部版本腳本檢查已完成的本機建置。
(()=>{
 if(location.protocol!=='file:')return;
 const initial=window.LOCAL_GAME_VERSION;let pending=false,loading=false;
 if(!initial)return;
 const check=()=>{
  if(pending&&window.GameCanUpdate?.()===true){location.reload();return;}
  if(loading)return;loading=true;
  const script=document.createElement('script');
  script.src='本機版本.js?check='+Date.now();
  const finish=()=>{script.remove();loading=false;};
  script.onload=()=>{pending=window.LOCAL_GAME_VERSION!==initial;finish();if(pending&&window.GameCanUpdate?.()===true)location.reload();};
  script.onerror=finish;document.head.append(script);
 };
 setInterval(check,5000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
})();
