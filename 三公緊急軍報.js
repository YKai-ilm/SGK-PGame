'use strict';
window.ThreeLordsAlert=(()=>{
 const key='three-kingdoms-interface-preview-v1',read=()=>JSON.parse(localStorage.getItem(key)||'{}');let dialog;
 function show(){const s=read(),p=s.storyEvents?.threeLordsWait;if(!p?.reportReady||p.notified||s.storyEvents?.gebei?.started||dialog?.open)return;
  dialog??=document.createElement('dialog');dialog.id='threeLordsEmergency';dialog.setAttribute('aria-label','緊急軍報');dialog.style.cssText='max-width:360px;width:calc(100vw - 48px);box-sizing:border-box;background:#fff8e6;color:#433c2a;border:2px solid #a56c30;border-radius:12px;padding:22px;font:18px/1.7 system-ui';dialog.innerHTML='<h2 style="margin:0 0 12px">緊急軍報</h2><p>徐州送來急報，請您回徐州找糜竺對話。</p><button style="font:inherit;padding:8px 20px">知道了</button>';if(!dialog.isConnected)document.body.append(dialog);
  const acknowledge=()=>{try{const current=read();if(current.storyEvents?.threeLordsWait){current.storyEvents.threeLordsWait.notified=true;localStorage.setItem(key,JSON.stringify(current));}dialog.close();}catch{dialog.querySelector('p').textContent='軍報尚未保存，請再按一次「知道了」。請回徐州找糜竺對話。'}};
  dialog.querySelector('button').onclick=acknowledge;dialog.oncancel=e=>{e.preventDefault();acknowledge();};dialog.showModal();
 }
 const ready=()=>setTimeout(show,100);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
 return {show};
})();
