const CACHE='sgk-release-'+VERSION,ROOT=new URL('./',self.location.href),url=f=>new URL(f,ROOT).href;
const TOTAL=ASSETS.reduce((n,a)=>n+a.bytes,0),HASH_HEADER='X-SGK-Asset-Hash';
let job=null,state={phase:'checking',version:VERSION,done:0,total:ASSETS.length,bytes:0,totalBytes:TOTAL};
async function notify(){for(const c of await self.clients.matchAll({type:'window',includeUncontrolled:true}))c.postMessage({type:'OFFLINE_STATUS',...state});}
async function digest(b){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(x=>x.toString(16).padStart(2,'0')).join('');}
async function valid(response,a){if(!response?.ok)return false;if(response.headers.get(HASH_HEADER)===a.hash)return true;return await digest(await response.clone().arrayBuffer())===a.hash;}
async function tagged(response,a){const headers=new Headers(response.headers);headers.set(HASH_HEADER,a.hash);headers.delete('content-encoding');headers.delete('content-length');return new Response(await response.arrayBuffer(),{status:200,headers});}
function sync(){if(job)return job;job=download().finally(()=>{job=null;});return job;}
async function download(){
 state={phase:'downloading',version:VERSION,done:0,total:ASSETS.length,bytes:0,totalBytes:TOTAL};await notify();
 try{
  const target=await caches.open(CACHE),older=await Promise.all((await caches.keys()).filter(k=>k.startsWith('sgk-release-')&&k!==CACHE).map(k=>caches.open(k)));
  // 每檔完成才記錄；中斷後保留已驗證的檔案，下次補齊。
  for(const a of ASSETS){
   const key=url(a.file);let response=await target.match(key);
   if(!await valid(response,a)){
    response=null;for(const old of older){const candidate=await old.match(key);if(await valid(candidate,a)){response=candidate;break;}}
    if(!response){response=await fetch(new Request(key,{cache:'reload'}));if(!await valid(response,a))throw Error('integrity');}
    await target.put(key,await tagged(response,a));
   }
   state.done++;state.bytes+=a.bytes;await notify();
  }
  state.phase='ready';await notify();
 }catch(e){state.phase='error';state.reason=e.name==='QuotaExceededError'?'storage':e.message==='integrity'?'integrity':'network';await notify();throw e;}
}
self.addEventListener('install',event=>event.waitUntil(sync()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 await self.clients.claim();
 // 完整下載並啟用後才釋放舊素材；不接觸玩家存檔。
 for(const k of await caches.keys())if(k.startsWith('sgk-release-')&&k!==CACHE)await caches.delete(k);
 await notify();
})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname))return;
 if(u.pathname.endsWith('/sw.js')||u.pathname.endsWith('/offline-manifest.json'))return;
 event.respondWith((async()=>{const c=await caches.open(CACHE);u.search='';u.hash='';if(u.pathname===ROOT.pathname)u.pathname+='index.html';else if(!u.pathname.endsWith('/')&&!u.pathname.split('/').pop().includes('.'))u.pathname+='.html';const found=await c.match(u.href);if(found)return found.redirected?new Response(found.body,{status:found.status,statusText:found.statusText,headers:found.headers}):found;
  try{const r=await fetch(event.request);if(r.ok&&r.type==='basic')await c.put(u.href,r.clone());return r;}catch{if(event.request.mode==='navigate')return new Response('<meta charset="utf-8"><p>離線資料尚未完整，請連線後自動補下載。</p><a href="'+ROOT.pathname+'">回主城</a>',{headers:{'Content-Type':'text/html;charset=utf-8'}});throw Error('尚未快取');}
 })());
});
let pending=null;
function abort(){if(pending)for(const c of pending.clients)c.postMessage({type:'UPDATE_ABORT'});pending=null;}
self.addEventListener('message',event=>{
 if(event.data?.type==='OFFLINE_SYNC')event.waitUntil(sync().catch(()=>{}));
 if(event.data?.type==='OFFLINE_QUERY')event.source?.postMessage({type:'OFFLINE_STATUS',...state});
 if(event.data?.type==='CHECK_UPDATE'&&!pending){event.waitUntil((async()=>{const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});if(!clients.length)return;const nonce=crypto.randomUUID();pending={nonce,clients,ids:new Set(clients.map(c=>c.id)),yes:new Set()};for(const c of clients)c.postMessage({type:'CAN_UPDATE',nonce});setTimeout(()=>{if(pending?.nonce===nonce)abort();},4000);})());}
 if(event.data?.type==='UPDATE_READY'&&pending?.nonce===event.data.nonce&&event.source?.id){if(!event.data.ready){abort();return;}pending.yes.add(event.source.id);if([...pending.ids].every(id=>pending.yes.has(id))){pending=null;event.waitUntil(self.skipWaiting());}}
});
