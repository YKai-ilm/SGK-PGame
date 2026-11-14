const CACHE='sgk-release-'+VERSION,ROOT=new URL('./',self.location.href),url=f=>new URL(f,ROOT).href;
const TOTAL=ASSETS.reduce((n,a)=>n+a.bytes,0),HASH_HEADER='X-SGK-Asset-Hash';
const aliasPaths=Object.fromEntries(Object.entries(typeof ALIASES==='undefined'?{}:ALIASES).map(([a,b])=>[new URL(a,ROOT).pathname,new URL(b,ROOT).pathname]));
const assetByUrl=new Map(ASSETS.map(a=>[url(a.file),a]));
let job=null,state={phase:'checking',version:VERSION,done:0,total:ASSETS.length,bytes:0,totalBytes:TOTAL};
const packDefs=typeof PACKS==='undefined'?[{id:'core',name:'遊戲資料',default:true}]:PACKS;
const META='sgk-offline-preferences',META_KEY=url('__offline_selection');
let selected=null,selectionJob=Promise.resolve();
async function selection(){
 const meta=await caches.open(META),r=await meta.match(META_KEY);let ids=[],readable=false;try{ids=r?await r.json():[];readable=!!r&&Array.isArray(ids);if(!Array.isArray(ids))ids=[];}catch{}
 // 舊版曾整包下載的玩家保留已備妥章節，不因改成分包而失去離線場景。
 if(!readable){for(const key of (await caches.keys()).filter(k=>k.startsWith('sgk-release-'))){const old=await caches.open(key);for(const p of packDefs.filter(p=>!p.default)){const group=ASSETS.filter(a=>a.pack===p.id);if(group.length&&(await Promise.all(group.map(a=>old.match(url(a.file))))).some(Boolean))ids.push(p.id);}}if(ids.length)await meta.put(META_KEY,new Response(JSON.stringify(ids)));}
 selected=new Set([...packDefs.filter(p=>p.default).map(p=>p.id),...ids.filter(id=>packDefs.some(p=>p.id===id))]);return selected;
}
function selectPack(id){selectionJob=selectionJob.catch(()=>{}).then(async()=>{await selection();if(packDefs.some(p=>p.id===id)){selected.add(id);await (await caches.open(META)).put(META_KEY,new Response(JSON.stringify([...selected])));}});return selectionJob;}
async function notify(){for(const c of await self.clients.matchAll({type:'window',includeUncontrolled:true}))c.postMessage({type:'OFFLINE_STATUS',...state});}
async function digest(b){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(x=>x.toString(16).padStart(2,'0')).join('');}
// 不以「曾經下載完成」標記代替內容驗證；當機後快取仍須逐檔檢查。
async function valid(response,a){if(!response?.ok)return false;try{const body=await response.clone().arrayBuffer();return body.byteLength===a.bytes&&await digest(body)===a.hash;}catch{return false;}}
async function tagged(response,a){const headers=new Headers(response.headers);headers.set(HASH_HEADER,a.hash);headers.delete('content-encoding');headers.delete('content-length');return new Response(await response.arrayBuffer(),{status:200,headers});}
function sync(){if(job)return job;job=(async()=>{do{await download();}while(ASSETS.some(a=>selected.has(a.pack||'core')&&!state.completedPacks.includes(a.pack||'core')));})().finally(()=>{job=null;});return job;}
async function download(){
 await selection();const ids=[...selected],assets=ASSETS.filter(a=>selected.has(a.pack||'core')).sort((a,b)=>packDefs.findIndex(p=>p.id===(a.pack||'core'))-packDefs.findIndex(p=>p.id===(b.pack||'core')));
 const remaining=Object.fromEntries(ids.map(id=>[id,assets.filter(a=>(a.pack||'core')===id).length]));
 state={phase:'downloading',version:VERSION,done:0,total:assets.length,bytes:0,totalBytes:assets.reduce((n,a)=>n+a.bytes,0),selected:ids,packs:packDefs,completedPacks:[]};await notify();
 try{
  const target=await caches.open(CACHE),older=await Promise.all((await caches.keys()).filter(k=>k.startsWith('sgk-release-')&&k!==CACHE).map(k=>caches.open(k)));
  // 每檔完成才記錄；中斷後保留已驗證的檔案，下次補齊。
  for(const a of assets){
   const key=url(a.file);let response=await target.match(key);
   if(!await valid(response,a)){
    response=null;for(const old of older){const candidate=await old.match(key);if(await valid(candidate,a)){response=candidate;break;}}
    if(!response){response=await fetch(new Request(key,{cache:'reload'}));if(!await valid(response,a))throw Error('integrity');}
    await target.put(key,await tagged(response,a));
    if(!await valid(await target.match(key),a))throw Error('integrity');
   }
   state.done++;state.bytes+=a.bytes;if(--remaining[a.pack||'core']===0)state.completedPacks.push(a.pack||'core');await notify();
  }
  state.completedPacks=ids;state.phase='ready';await notify();
 }catch(e){state.phase='error';state.reason=e.name==='QuotaExceededError'?'storage':e.message==='integrity'?'integrity':'network';await notify();throw e;}
}
self.addEventListener('install',event=>event.waitUntil(sync()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 await sync();
 await self.clients.claim();
 // 完整下載並啟用後才釋放舊素材；不接觸玩家存檔。
 for(const k of await caches.keys())if(k.startsWith('sgk-release-')&&k!==CACHE)await caches.delete(k);
 await notify();
})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname))return;
 if(aliasPaths[u.pathname])u.pathname=aliasPaths[u.pathname];
 if(u.pathname.endsWith('/sw.js')||u.pathname.endsWith('/offline-manifest.json'))return;
 event.respondWith((async()=>{const c=await caches.open(CACHE);u.search='';u.hash='';if(u.pathname===ROOT.pathname)u.pathname+='index.html';else if(!u.pathname.endsWith('/')&&!u.pathname.split('/').pop().includes('.'))u.pathname+='.html';const found=await c.match(u.href),asset=assetByUrl.get(u.href);if(found&&(!asset||await valid(found,asset)))return found.redirected?new Response(found.body,{status:found.status,statusText:found.statusText,headers:found.headers}):found;
  if(asset){state.phase='error';state.reason='integrity';state.completedPacks=(state.completedPacks||[]).filter(id=>id!==(asset.pack||'core'));await notify();}
  try{const r=await fetch(event.request);if(asset){if(!await valid(r,asset))throw Error('integrity');await c.put(u.href,await tagged(r.clone(),asset));}else if(r.ok&&r.type==='basic')await c.put(u.href,r.clone());return r;}catch{if(event.request.mode==='navigate')return new Response('<meta charset="utf-8"><p>離線資料尚未完整，請連線後自動補下載。</p><a href="'+ROOT.pathname+'">回主城</a>',{headers:{'Content-Type':'text/html;charset=utf-8'}});throw Error('尚未快取');}
 })());
});
let pending=null;
function abort(){if(pending)for(const c of pending.clients)c.postMessage({type:'UPDATE_ABORT'});pending=null;}
self.addEventListener('message',event=>{
 if(event.data?.type==='OFFLINE_SYNC')event.waitUntil(sync().catch(()=>{}));
 if(event.data?.type==='OFFLINE_QUERY')event.waitUntil(sync().catch(()=>{}));
 if(event.data?.type==='OFFLINE_PACK')event.waitUntil(selectPack(event.data.id).then(()=>sync()).catch(async e=>{state.phase='error';state.reason=e.name==='QuotaExceededError'?'storage':state.reason||'network';await notify();}));
 if(event.data?.type==='CHECK_UPDATE'&&!pending){event.waitUntil((async()=>{const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});if(!clients.length)return;const nonce=crypto.randomUUID();pending={nonce,clients,ids:new Set(clients.map(c=>c.id)),yes:new Set()};for(const c of clients)c.postMessage({type:'CAN_UPDATE',nonce});setTimeout(()=>{if(pending?.nonce===nonce)abort();},4000);})());}
 if(event.data?.type==='UPDATE_READY'&&pending?.nonce===event.data.nonce&&event.source?.id){if(!event.data.ready){abort();return;}pending.yes.add(event.source.id);if([...pending.ids].every(id=>pending.yes.has(id))){pending=null;event.waitUntil(self.skipWaiting());}}
});
