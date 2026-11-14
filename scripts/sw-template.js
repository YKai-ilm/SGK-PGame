const CACHE='sgk-release-'+VERSION,ROOT=new URL('./',self.location.href),url=f=>new URL(f,ROOT).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);for(let i=0;i<PRECACHE.length;i+=12)await c.addAll(PRECACHE.slice(i,i+12).map(f=>new Request(url(f),{cache:'reload'})));})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await self.clients.claim();for(const k of await caches.keys())if(k.startsWith('sgk-release-')&&k!==CACHE)await caches.delete(k);})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname))return;
 if(u.pathname.endsWith('/sw.js'))return;
 event.respondWith((async()=>{const c=await caches.open(CACHE);u.search='';u.hash='';if(u.pathname===ROOT.pathname)u.pathname+='index.html';const found=await c.match(u.href);if(found)return found;
  try{const r=await fetch(event.request);if(r.ok&&r.type==='basic')await c.put(u.href,r.clone());return r;}catch{if(event.request.mode==='navigate')return new Response('<meta charset="utf-8"><p>此場景尚未下載，請連線後再試。</p><a href="'+ROOT.pathname+'">回主城</a>',{headers:{'Content-Type':'text/html;charset=utf-8'}});throw Error('尚未快取');}
 })());
});
let pending=null;
self.addEventListener('message',event=>{
 if(event.data?.type==='CHECK_UPDATE'&&!pending){event.waitUntil((async()=>{const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});if(!clients.length)return;const nonce=crypto.randomUUID();pending={nonce,ids:new Set(clients.map(c=>c.id)),yes:new Set()};for(const c of clients)c.postMessage({type:'CAN_UPDATE',nonce});setTimeout(()=>{if(pending?.nonce===nonce)pending=null;},4000);})());}
 if(event.data?.type==='UPDATE_READY'&&pending?.nonce===event.data.nonce&&event.source?.id){if(!event.data.ready){pending=null;return;}pending.yes.add(event.source.id);if([...pending.ids].every(id=>pending.yes.has(id))){pending=null;event.waitUntil(self.skipWaiting());}}
});
