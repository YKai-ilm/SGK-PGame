'use strict';
// 暫時診斷：只在戰鬥中記錄。未歸因時間不等於 GPU 時間。
(()=>{
 let parentProbe;try{if(window!==top)parentProbe=top.__battleProbe;}catch{}
 if(window!==top&&!parentProbe)return;
 const child=!!parentProbe;
 function ring(limit){const data=new Array(limit);let count=0,next=0;return {push(v){data[next]=v;next=(next+1)%limit;count=Math.min(count+1,limit);},values(){return Array.from({length:count},(_,i)=>data[(next-count+i+limit)%limit]);},clear(){count=next=0;}};}
 const probe=parentProbe||(window.__battleProbe={tasks:ring(60000),frames:ring(18000),sync:ring(18000),active:false,mode:'normal',generation:0,childSeen:false,counts:{draws:0,fit:0,resize:0,fonts:0},origin:performance.timeOrigin});
 if(child)probe.childSeen=true;
 const now=()=>performance.now()+(performance.timeOrigin-probe.origin);
 let depth=0;const labels=new WeakMap();
 function site(kind){for(const line of String(new Error().stack||'').split('\n')){let decoded=line;try{decoded=decodeURIComponent(line);}catch{}if(decoded.includes('效能探針.js'))continue;const m=decoded.match(/([^/@\s(]+\.(?:js|html))(?:\?[^:]*)?:(\d+)/);if(m)return (child?'iframe:':'')+kind+':'+m[1]+':'+m[2];}return (child?'iframe:':'')+kind;}
 function wrap(fn,kind){if(typeof fn!=='function')return fn;let byKind=labels.get(fn);if(!byKind){byKind=new Map();labels.set(fn,byKind);}if(!byKind.has(kind))byKind.set(kind,site(kind));const label=byKind.get(kind);
  return function(...args){if(depth||!probe.active||probe.mode==='off')return fn.apply(this,args);const start=now(),generation=probe.generation;depth++;try{return fn.apply(this,args);}finally{depth--;if(generation===probe.generation)probe.tasks.push({start,end:now(),label});}};
 }
 for(const [name,kind]of [['setTimeout','timeout'],['setInterval','interval'],['requestAnimationFrame','raf']]){const native=window[name];window[name]=function(fn,...rest){return native.call(this,wrap(fn,kind),...rest);};}
 if(window.ResizeObserver){const Native=window.ResizeObserver;window.ResizeObserver=class extends Native{constructor(cb){if(typeof cb!=='function')throw new TypeError('ResizeObserver callback required');const wrapped=wrap(cb,'resizeObserver');super(function(...a){if(probe.active)probe.counts.resize++;return wrapped.apply(this,a);});}};}
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener,listeners=new WeakMap();
 const capture=o=>typeof o==='boolean'?o:!!o?.capture;
 EventTarget.prototype.addEventListener=function(type,fn,options){if(typeof fn!=='function')return add.call(this,type,fn,options);let map=listeners.get(fn);if(!map){map=new Map();listeners.set(fn,map);}const key=type+'|'+capture(options);if(!map.has(key))map.set(key,wrap(fn,'event:'+type));return add.call(this,type,map.get(key),options);};
 EventTarget.prototype.removeEventListener=function(type,fn,options){return remove.call(this,type,(typeof fn==='function'&&listeners.get(fn)?.get(type+'|'+capture(options)))||fn,options);};
 if(child)return;
 const modes={normal:'正常量測',half:'隔幀繪圖',sysfont:'系統字型',info1000:'資訊每秒更新',off:'關閉診斷'};
 let nextMode='normal';try{const saved=sessionStorage.getItem('battle-perf-probe-mode');if(modes[saved])nextMode=saved;}catch{}
 probe.mode=nextMode;
 document.addEventListener('visibilitychange',()=>{if(document.hidden)probe.active=false;});
 document.fonts?.addEventListener('loadingdone',()=>{if(probe.active)probe.counts.fonts++;});
 document.addEventListener('DOMContentLoaded',()=>{
  const BP=window.BattlePerformance;if(!BP||typeof draw!=='function')return;
  const originalFrame=frame;window.frame=function(...a){probe.active=running&&!document.hidden&&probe.mode!=='off';return originalFrame.apply(this,a);};
  const originalDraw=draw;let flip=false;
  window.draw=function(...a){const active=running&&!ended&&!document.hidden;if(active&&probe.mode==='half'){flip=!flip;if(flip)return;}if(active&&probe.mode!=='off')probe.counts.draws++;return originalDraw.apply(this,a);};
  const originalSync=sync;window.sync=function(...a){if(!probe.active)return originalSync.apply(this,a);const start=now();try{return originalSync.apply(this,a);}finally{probe.sync.push(now()-start);}};
  const originalRefresh=refreshBattleInfo;let lastSlow=-Infinity;
  window.refreshBattleInfo=function(...a){if(probe.mode!=='info1000'||!running||ended)return originalRefresh.apply(this,a);const t=now();if(t-lastSlow>=1000){lastSlow=t;return window.sync();}};
  // 主畫布與卡面快取均替換字型；不影響 DOM 或 iframe 字型。
  const proto=CanvasRenderingContext2D.prototype,desc=Object.getOwnPropertyDescriptor(proto,'font');
  if(desc?.set&&desc.configurable)Object.defineProperty(proto,'font',{...desc,set(value){if(probe.mode==='sysfont'){const m=String(value).match(/^(.*?\d*\.?\d+px)\s/);if(m)value=m[1]+' "PingFang TC",sans-serif';}desc.set.call(this,value);}});
  if(window.fitBattle){const fit=window.fitBattle;window.fitBattle=function(...a){const before=canvas.style.width+'|'+canvas.style.height;try{return fit.apply(this,a);}finally{if(probe.active&&before!==canvas.style.width+'|'+canvas.style.height)probe.counts.fit++;}};}
  let previous=null,prevGame=0,prevTime=0;
  const sample=BP.sample;BP.sample=function(time,active,...rest){sample.call(this,time,active,...rest);const exec=now();if(!active||probe.mode==='off'){previous=null;probe.active=false;return;}if(previous!==null&&elapsed>=prevGame)probe.frames.push({start:previous,end:exec,gap:exec-previous,realGap:time-prevTime,game:elapsed-prevGame,speed:Number($('speed')?.value||1)});previous=exec;prevGame=elapsed;prevTime=time;probe.active=running&&!ended;};
  const reset=BP.reset;BP.reset=function(...a){const result=reset.apply(this,a);probe.generation++;probe.active=false;probe.mode=nextMode;probe.tasks.clear();probe.frames.clear();probe.sync.clear();probe.counts={draws:0,fit:0,resize:0,fonts:0};previous=null;lastSlow=-Infinity;flip=false;window.QualityArt?.clearCache();return result;};
  const pct=(v,p=.95)=>{if(!v.length)return '—';const sorted=[...v].sort((a,b)=>a-b);return sorted[Math.floor((sorted.length-1)*p)].toFixed(1);};
  // 回呼依開始時間排序，裁切到幀界線；聯集避免同源跨框架重入雙重計數。
  function analyzeFrames(frames,tasks){const ordered=[...tasks].sort((a,b)=>a.start-b.start),rows=[];let j=0;
   for(const f of frames){while(j<ordered.length&&ordered[j].end<=f.start)j++;let sum=0,right=f.start,largest=0,label='無';for(let k=j;k<ordered.length&&ordered[k].start<f.end;k++){const t=ordered[k],lo=Math.max(f.start,t.start),hi=Math.min(f.end,t.end);if(hi<=lo)continue;if(hi-lo>largest){largest=hi-lo;label=t.label;}sum+=Math.max(0,hi-Math.max(right,lo));right=Math.max(right,hi);}rows.push({...f,js:sum,rest:Math.max(0,f.gap-sum),largest,label});}return rows;
  }
  // 提供純計算入口供回歸測試，不供遊戲邏輯使用。
  probe.analyzeFrames=analyzeFrames;
  function analysis(){if(probe.mode==='off')return '\n—— 詳細診斷已關閉 ——';const all=probe.frames.values();if(!all.length)return '\n—— 探針：沒有完整戰鬥幀 ——';const tasks=probe.tasks.values(),oldest=tasks.length?Math.min(...tasks.map(t=>t.start)):Infinity;
   const frames=all.filter(f=>f.start>=oldest),rows=analyzeFrames(frames,tasks),out=['','—— 診斷模式：'+modes[probe.mode]+' ——'],bySpeed=new Map();
   for(const f of all){const item=bySpeed.get(f.speed)||{ms:0,game:0};item.ms+=f.realGap;item.game+=f.game;bySpeed.set(f.speed,item);}
   for(const [speed,b]of bySpeed)out.push(speed+'X：紀錄 '+(b.ms/1000).toFixed(1)+'秒，遊戲推進 '+b.game.toFixed(1)+'秒，比例 '+(100*b.game/(b.ms/1000*speed)).toFixed(0)+'%');
   out.push('戰鬥實際繪圖次數：'+probe.counts.draws+'（不含暫停與戰後測試）');
   out.push('已攔截回呼佔用 P50 '+pct(rows.map(f=>f.js),.5)+' / P95 '+pct(rows.map(f=>f.js))+' ms');
   out.push('未歸因時間 P50 '+pct(rows.map(f=>f.rest),.5)+' / P95 '+pct(rows.map(f=>f.rest))+' ms');
   const longs=rows.filter(f=>f.gap>100);out.push('可分析區間超過100ms：'+longs.length+'次');
   for(const f of longs.sort((a,b)=>b.gap-a.gap).slice(0,8))out.push('間隔 '+f.gap.toFixed(0)+'ms；已攔截 '+f.js.toFixed(0)+'ms；最大 '+f.label+' '+f.largest.toFixed(0)+'ms');
   const sources=new Map(),first=all[0].start,last=all[all.length-1].end;
   for(const t of tasks){const ms=Math.min(last,t.end)-Math.max(first,t.start);if(ms<=0)continue;const entry=sources.get(t.label)||{ms:0,count:0,max:0};entry.ms+=ms;entry.count++;entry.max=Math.max(entry.max,ms);sources.set(t.label,entry);}
   out.push('回呼來源（重疊來源不可再相加）：');
   for(const [label,t]of [...sources].sort((a,b)=>b[1].ms-a[1].ms).slice(0,8))out.push(label+'：合計 '+t.ms.toFixed(1)+'ms／'+t.count+'次／最大 '+t.max.toFixed(1)+'ms');
   const sy=probe.sync.values();out.push('sync 樣本 '+sy.length+'；P95 '+pct(sy)+'ms');
   out.push('畫布尺寸變更 '+probe.counts.fit+'；ResizeObserver '+probe.counts.resize+'；字型載入 '+probe.counts.fonts);
   out.push('iframe：'+(probe.childSeen?'已接入、已對齊時間起點':'未接入'));
   out.push('保留最近18000幀／60000回呼；配對分析 '+rows.length+'幀。切換倍速邊界為近似值。');
   out.push('只涵蓋攔截的同步回呼，非全部JS；Promise、onclick等屬性回呼未完整涵蓋。未歸因時間包含未量到的工作、瀏覽器繪製與等待，不等於GPU耗時；探針本身也有成本。');return out.join('\n');
  }
  window.QualityArt?.clearCache();
  const summary=BP.summary;BP.summary=function(...a){return summary.apply(this,a)+analysis();};
  const attach=BP.attachCheck;BP.attachCheck=function(details,...a){attach?.call(this,details,...a);const box=document.createElement('div');box.style.cssText='margin-top:8px;display:flex;gap:6px;flex-wrap:wrap';const select=document.createElement('select');select.setAttribute('aria-label','下一場診斷模式');for(const [key,label]of Object.entries(modes)){const option=document.createElement('option');option.value=key;option.textContent='下一場：'+label;select.append(option);}select.value=nextMode;select.onchange=()=>{nextMode=select.value;try{sessionStorage.setItem('battle-perf-probe-mode',nextMode);}catch{}};
   const copy=document.createElement('button');copy.type='button';copy.textContent='複製紀錄';copy.onclick=async()=>{try{await navigator.clipboard.writeText(details.querySelector('pre')?.textContent||'');copy.textContent='已複製';}catch{copy.textContent='無法複製，請截圖';}};box.append(select,copy);details.append(box);
  };
 });
})();
