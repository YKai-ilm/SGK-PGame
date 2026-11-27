const CACHE='sgk-swallow-release-__VERSION__',FILES=__FILES__,ROOT=new URL('./',self.location);
// Pages 會將 .html 轉為無副檔名網址；導覽不能直接回傳帶 redirected 標記的快取。
function clean(response){return response.redirected?new Response(response.body,{status:response.status,statusText:response.statusText,headers:response.headers}):response;}
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('message',e=>{if(e.data==='ACTIVATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('sgk-swallow-release-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function media(response,request){
 const range=request.headers.get('Range');if(!range)return clean(response);
 const m=/^bytes=(\d*)-(\d*)$/.exec(range);if(!m||(!m[1]&&!m[2]))return clean(response);
 const data=await response.arrayBuffer(),size=data.byteLength,start=m[1]?Number(m[1]):Math.max(0,size-Number(m[2])),end=m[1]?(m[2]?Math.min(size-1,Number(m[2])):size-1):size-1;
 if(start>=size||start>end)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});
 const headers=new Headers(response.headers);headers.set('Content-Range','bytes '+start+'-'+end+'/'+size);headers.set('Content-Length',String(end-start+1));headers.set('Accept-Ranges','bytes');
 return new Response(data.slice(start,end+1),{status:206,headers});
}
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname)||/\/(sw\.js|offline-manifest\.json)$/.test(u.pathname))return;
 e.respondWith((async()=>{const c=await caches.open(CACHE);u.search='';u.hash='';if(u.pathname===ROOT.pathname)u.pathname+='index.html';else if(!u.pathname.endsWith('/')&&!u.pathname.split('/').pop().includes('.'))u.pathname+='.html';
 const hit=await c.match(u.href);if(hit)return media(hit,e.request);
 return fetch(e.request);
 })());
});
