'use strict';
window.BattlePerformance=(()=>{
 const samples=[];let previous=null;
 function sample(time,active,simulation,draw,didDraw){
  if(!active){previous=null;return;}
  const gap=previous===null?0:time-previous;previous=time;
  samples.push({gap,simulation,draw,didDraw});if(samples.length>3600)samples.shift();
 }
 function percentile(values){const sorted=[...values].sort((a,b)=>a-b);return sorted.length?sorted[Math.floor((sorted.length-1)*.95)].toFixed(1):'—';}
 function summary(){
  const gaps=samples.map(s=>s.gap).filter(g=>g>0),seconds=gaps.reduce((a,b)=>a+b,0)/1000,draws=samples.filter(s=>s.didDraw);
  return '版本：'+(window.APP_VERSION||'本機')+'\n紀錄時間：'+seconds.toFixed(1)+' 秒\n繪圖頻率：約 '+(seconds?(draws.length/seconds).toFixed(1):'—')+' 幀／秒\n畫面回呼間隔 P95：'+percentile(gaps)+' ms\n戰鬥計算 P95：'+percentile(samples.map(s=>s.simulation))+' ms\n繪圖提交 P95：'+percentile(draws.map(s=>s.draw))+' ms\n超過100ms停頓：'+gaps.filter(g=>g>100).length+' 次\n最長間隔：'+(gaps.length?Math.max(...gaps).toFixed(1):'—')+' ms';
 }
 function reset(){samples.length=0;previous=null;}
 // 比較同一個靜止戰場；不呼叫 tick，也不碰戰局或存檔。
 function attachCheck(details){
  const button=document.createElement('button'),report=document.createElement('pre');
  button.textContent='檢查畫面效能（12秒）';button.type='button';
  report.style.cssText='white-space:pre-wrap;font-size:12px';details.append(button,report);
  button.onclick=()=>{
   if(running||!ended||button.disabled)return;
   const results=details.closest('dialog'),probe=document.createElement('dialog');
   probe.style.cssText='position:fixed;inset:0;margin:0;width:100vw;max-width:none;height:100svh;max-height:none;box-sizing:border-box;border:0;padding:12px;background:transparent';
   const style=document.createElement('style');style.textContent='dialog.battle-render-check::backdrop{background:transparent}';
   probe.className='battle-render-check';
   const status=document.createElement('div');status.style.cssText='background:#f8f5e9;color:#294234;padding:10px;border:1px solid #526146';const label=document.createElement('span'),cancel=document.createElement('button');cancel.textContent='取消';cancel.style.marginLeft='8px';status.append(label,cancel);probe.append(status);
   document.head.append(style);document.body.append(probe);button.disabled=true;
   results.close();probe.showModal();
   const rounds=[[],[],[],[]];let phase=0,start=null,prior=null,handle=0,finished=false;
   function finish(cancelled){
    if(finished)return;finished=true;cancelAnimationFrame(handle);
    document.removeEventListener('visibilitychange',visibility);probe.close();probe.remove();style.remove();button.disabled=false;
    if(cancelled)report.textContent='測試已中止，請保持畫面開啟後再試。';
    else{
     const describe=gaps=>{const ms=gaps.reduce((a,b)=>a+b,0);return (ms?1000*gaps.length/ms:0).toFixed(1)+' 回／秒，P95 '+percentile(gaps)+' ms';};
     report.textContent='同一靜止戰場，戰鬥未推進\n'+rounds.map((g,i)=>(i%2?'持續重繪':'停止重繪')+' '+(Math.floor(i/2)+1)+'：'+describe(g)).join('\n')+'\n畫布：'+canvas.width+' × '+canvas.height+'；顯示：'+Math.round(canvas.getBoundingClientRect().width)+' × '+Math.round(canvas.getBoundingClientRect().height)+'；像素比：'+devicePixelRatio+'\n此測試比較畫面更新負擔，不代表已找到卡頓原因。';
    }
    if(results.isConnected&&!results.open)results.showModal();
   }
   function visibility(){if(document.hidden)finish(true);}
   cancel.onclick=()=>finish(true);document.addEventListener('visibilitychange',visibility);probe.addEventListener('cancel',e=>{e.preventDefault();finish(true);});
   function step(time){
    if(finished)return;
    if(start===null){start=time;prior=null;label.textContent='畫面效能檢查 '+(phase+1)+'/4：'+(phase%2?'持續重繪':'停止重繪')+'（不推進戰鬥）';}
    // 每段先暖機 200ms，避免切換提示本身影響比較。
    if(prior!==null&&time-start>=200)rounds[phase].push(time-prior);prior=time;
    if(time-start>=3000){phase++;start=null;prior=null;if(phase===4){finish(false);return;}}
    if(phase%2)draw();
    handle=requestAnimationFrame(step);
   }
   handle=requestAnimationFrame(step);
  };
 }
 return {sample,summary,reset,attachCheck};
})();
