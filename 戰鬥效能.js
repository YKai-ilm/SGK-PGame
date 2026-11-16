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
 return {sample,summary,reset};
})();
