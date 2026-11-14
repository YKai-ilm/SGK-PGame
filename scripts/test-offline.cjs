const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),{webcrypto,createHash}=require('node:crypto');
const source=fs.readFileSync(__dirname+'/sw-template.js','utf8'),origin='https://game.test/',stores=new Map(),calls=[];let unavailable=null,quota=false;
const cacheApi={async keys(){return [...stores.keys()];},async delete(k){return stores.delete(k);},async open(k){if(!stores.has(k))stores.set(k,new Map());const data=stores.get(k);return {async match(k){return data.get(String(k))?.clone();},async put(k,r){if(quota)throw Object.assign(Error('full'),{name:'QuotaExceededError'});data.set(String(k),r.clone());}};}};
function worker(version,files){const handlers={},messages=[],assets=Object.entries(files).map(([file,data])=>({file,bytes:Buffer.byteLength(data),hash:createHash('sha256').update(data).digest('hex')}));const self={location:{href:origin+'sw.js'},clients:{async matchAll(){return [{id:'test',postMessage:m=>messages.push(m)}];},async claim(){}},addEventListener:(t,f)=>handlers[t]=f,async skipWaiting(){}};vm.runInNewContext(`const VERSION=${JSON.stringify(version)},ASSETS=${JSON.stringify(assets)};\n`+source,{self,caches:cacheApi,crypto:webcrypto,URL,Request,Response,Headers,Uint8Array,setTimeout:()=>0,fetch:async req=>{const f=decodeURIComponent(new URL(req.url).pathname.slice(1));calls.push(f);if(unavailable===f||unavailable==='all')throw Error('offline');return new Response(files[f]||'bad',{status:200});}});return {messages,async event(type,data){let promise;handlers[type]({data,waitUntil:p=>promise=p});await promise;}};}
(async()=>{
 const one={'index.html':'home','scene.png':'full-scene','battle.js':'battle'};
 let w=worker('v1',one);unavailable='scene.png';await assert.rejects(w.event('install'));assert.equal(stores.get('sgk-release-v1').size,1);
 unavailable=null;calls.length=0;w=worker('v1',one);await w.event('install');assert.deepEqual(calls,['scene.png','battle.js']);assert.equal(w.messages.at(-1).phase,'ready');await w.event('activate');
 // 僅更新有變動的檔案；下載失敗不清掉可用舊版。
 const two={...one,'battle.js':'battle-v2'};w=worker('v2',two);calls.length=0;unavailable='battle.js';await assert.rejects(w.event('install'));assert(stores.has('sgk-release-v1'));assert.deepEqual(calls,['battle.js']);
 unavailable=null;calls.length=0;w=worker('v2',two);await w.event('install');assert.deepEqual(calls,['battle.js']);await w.event('activate');assert(!stores.has('sgk-release-v1'));
 // 清除單張素材後只補那張；離線時已有完整資料仍可完成檢查。
 unavailable='all';calls.length=0;await w.event('message',{type:'OFFLINE_SYNC'});assert.equal(w.messages.at(-1).phase,'ready');assert.equal(calls.length,0);
 stores.get('sgk-release-v2').delete(origin+'scene.png');await w.event('message',{type:'OFFLINE_SYNC'});assert.equal(w.messages.at(-1).phase,'error');unavailable=null;calls.length=0;await w.event('message',{type:'OFFLINE_SYNC'});assert.deepEqual(calls,['scene.png']);
 quota=true;w=worker('v3',{...two,'new.png':'new'});await assert.rejects(w.event('install'));assert.equal(w.messages.at(-1).reason,'storage');assert(stores.has('sgk-release-v2'));
 console.log('PASS offline completion, interrupted resume, changed-only downloads, old-version preservation, cache repair and storage-full handling.');
})().catch(e=>{console.error(e);process.exitCode=1;});
