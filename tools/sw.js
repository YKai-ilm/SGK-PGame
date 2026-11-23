'use strict';
// Only this tools directory: independent of the game's chapter download / activation gate.
const CACHE='sgk-route-tools-v1';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.location).pathname)||url.pathname.endsWith('/sw.js'))return;
 event.respondWith((async()=>{const c=await caches.open(CACHE);try{const r=await fetch(event.request,{cache:'no-store'});if(r.ok)await c.put(event.request,r.clone());return r;}catch(e){const saved=await c.match(event.request,{ignoreSearch:true});if(saved)return saved;throw e;}})());
});
