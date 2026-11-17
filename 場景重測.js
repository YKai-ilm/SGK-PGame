'use strict';
// 每個頁面在讀取遊戲進度前載入；測試資料只存在此分頁的 sessionStorage。
(()=>{
 const nativeLocal=window.localStorage,nativeSession=window.sessionStorage;
 const recordKey='scene-test-session-v1';
 const get=nativeSession.getItem.bind(nativeSession),put=nativeSession.setItem.bind(nativeSession),remove=nativeSession.removeItem.bind(nativeSession);
 const read=()=>JSON.parse(get(recordKey)||'null');
 // 等舊頁的 pagehide / unload 結束後，才在返回頁解除隔離。
 if(read()?.exiting&&decodeURIComponent(location.pathname).endsWith('/場景重測.html'))remove(recordKey);
 const entries=store=>Object.fromEntries(Array.from({length:store.length},(_,i)=>store.key(i)).filter(k=>k!==recordKey).map(k=>[k,store.getItem(k)]));
 function storage(native,kind){
  const data=()=>read()?.[kind];
  const keys=()=>Object.keys(data()||entries(native));
  const api={getItem(k){k=String(k);const d=data();return d?(Object.hasOwn(d,k)?d[k]:null):native.getItem(k);},setItem(k,v){const r=read();if(!r)return native.setItem(k,v);r[kind][String(k)]=String(v);put(recordKey,JSON.stringify(r));},removeItem(k){const r=read();if(!r)return native.removeItem(k);delete r[kind][String(k)];put(recordKey,JSON.stringify(r));},clear(){const r=read();if(!r)return native.clear();r[kind]={};put(recordKey,JSON.stringify(r));},key(i){return keys()[Number(i)]??null;}};
  return new Proxy(api,{get(t,k){if(k==='length')return keys().length;if(k in t)return t[k];return typeof k==='string'?t.getItem(k):undefined;},set(t,k,v){t.setItem(k,v);return true;},deleteProperty(t,k){t.removeItem(k);return true;},ownKeys(){return keys();},getOwnPropertyDescriptor(t,k){if(keys().includes(k))return {configurable:true,enumerable:true,writable:true,value:t.getItem(k)};}});
 }
 const testLocal=storage(nativeLocal,'local'),testSession=storage(nativeSession,'session');
 Object.defineProperty(window,'localStorage',{configurable:true,get:()=>read()?testLocal:nativeLocal});
 Object.defineProperty(window,'sessionStorage',{configurable:true,get:()=>read()?testSession:nativeSession});
 const routes={taoyuan:{name:'桃園起兵',url:'桃園起兵.html'},xuzhou:{name:'徐州城',url:'徐州劇情.html'},yunlong:{name:'雲龍山',url:'雲龍山場景預覽.html'}};
 function start(id){
  if(!routes[id])throw Error('未知的測試場景');
  const local=entries(nativeLocal);
  for(const k of Object.keys(local))if(k.startsWith('three-kingdoms-')||k.startsWith('tk-save-'))delete local[k];
  const profile={version:1,mode:'story',storyFaction:'蜀',libraryFaction:'蜀',page:'home',tutorial:{status:'skipped',step:0},teams:{},unlocks:{story:{heroes:[],letters:[]},battle:{heroes:[],letters:[]}}};
  if(id!=='taoyuan'){
   profile.storyEvents={peachOath:true};
   profile.unlocks.story={heroes:['劉備','關羽','張飛'],letters:['劉','備','關','羽','張','飛']};
   local['three-kingdoms-taoyuan-dialogue-v1']=JSON.stringify({party:['關羽','張飛'],seen:['oath']});
   local['three-kingdoms-taoyuan-hidden-items-v1']=JSON.stringify({fulingPaste:1,huatuoCompleted:true});
  }
  local['three-kingdoms-interface-preview-v1']=JSON.stringify(profile);
  put(recordKey,JSON.stringify({id,local,session:{}}));
  window.top.location.href=routes[id].url;
 }
 function exit(){const r=read();if(r){r.exiting=true;put(recordKey,JSON.stringify(r));}window.top.location.href='場景重測.html';}
 window.SceneTest={start,exit,active:()=>!!read(),routes};
 document.addEventListener('DOMContentLoaded',()=>{
  const r=read();
  if(!r&&['共用室內場景預覽.html','徐州城內城預覽.html','劇情場景圖鑑.html'].some(p=>decodeURIComponent(location.pathname).endsWith('/'+p))){const link=document.createElement('a');link.href='場景重測.html';link.textContent='互動劇情重測';link.style.cssText='display:inline-block;margin:8px;padding:6px 12px;background:#724b3a;color:#fff8e8;border-radius:6px';(document.querySelector('header')||document.body).append(link);}
  if(!r||window.GameAudioShell||decodeURIComponent(location.pathname).endsWith('/index.html'))return;
  const bar=document.createElement('aside');bar.id='sceneTestBar';
  bar.style.cssText='position:fixed;bottom:0;left:0;right:0;z-index:2147483647;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;padding:8px 6px calc(8px + env(safe-area-inset-bottom));background:#683f32;color:#fff8e8;font:14px sans-serif;box-shadow:0 -2px 6px #0003';
  const label=document.createElement('span');label.textContent='場景重測：'+routes[r.id].name+'（獨立進度）';
  const reset=document.createElement('button');reset.textContent='恢復初始值';reset.onclick=()=>{if(confirm('重新開始這次場景測試？正式遊戲進度不受影響。'))start(r.id);};
  const leave=document.createElement('button');leave.textContent='退出測試';leave.onclick=exit;
  bar.append(label,reset,leave);document.body.append(bar);
  document.body.style.paddingBottom='90px';document.body.style.boxSizing='border-box';
 });
})();
