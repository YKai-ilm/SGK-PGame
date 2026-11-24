const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
(async()=>{
// 僅整理固定的輸出目錄，不刪除原始美術。
if(path.dirname(out)!==root||path.basename(out)!=='dist')throw Error('輸出路徑錯誤');
fs.mkdirSync(out,{recursive:true});
const all=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['本機GM設定.js','本機版本.js','本機自動更新.js'].includes(e.name)||e.name.startsWith('.')||['dist','node_modules','scripts'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(html|js|css|png|jpg|jpeg|svg|webp|woff2?|mp3|ogg|json|webmanifest)$/.test(e.name))all.push(path.relative(root,p).replaceAll('\\','/'));}}walk(root);
const chosen=new Set(['場景測試設定.js','場景重測.js','index.html','主介面流程預覽.html','存檔備份.html','完整存檔.js','手機執行環境.js','離線資料狀態.js','離線章節設定.json','章節下載.html','manifest.webmanifest','app-icon-192.png','app-icon-512.png']);
// 以遊戲引用關係收集資源；比對檔名亦涵蓋由場景資料組合的圖片路徑。
for(let old=-1;old!==chosen.size;){old=chosen.size;for(const f of [...chosen]){if(!/\.(html|js|css|json|webmanifest)$/.test(f))continue;const s=fs.readFileSync(path.join(root,f),'utf8');for(const target of all)if(s.includes(target)||s.includes(path.posix.basename(target)))chosen.add(target);}}
const inputs=[...chosen].sort();const hash=crypto.createHash('sha256');for(const f of inputs){hash.update(f);hash.update(fs.readFileSync(path.join(root,f)));}hash.update(fs.readFileSync(__filename));hash.update(fs.readFileSync(path.join(__dirname,'sw-template.js')));const version=hash.digest('hex').slice(0,12);
const sharp=require('sharp'),aliases=Object.fromEntries(inputs.filter(f=>f.endsWith('.png')&&!f.startsWith('app-icon-')).map(f=>[f,f.replace(/\.png$/,'.webp')]));
const cacheDir=path.join(root,'.asset-cache');fs.mkdirSync(cacheDir,{recursive:true});
const files=[];let originalImages=0,packedImages=0;for(const f of inputs){let buf=fs.readFileSync(path.join(root,f)),output=aliases[f]||f;if(buf.length>25*1024*1024)throw Error('單檔超過部署限制：'+f);
 if(aliases[f]){originalImages+=buf.length;const cacheKey=crypto.createHash('sha256').update(buf).update('webp-q88-e5-sharp0355').digest('hex'),cached=path.join(cacheDir,cacheKey+'.webp');if(fs.existsSync(cached))buf=fs.readFileSync(cached);else{buf=await sharp(buf).webp({quality:88,effort:5}).toBuffer();fs.writeFileSync(cached,buf);}packedImages+=buf.length;}
 else if(/\.(html|js|css|json|webmanifest)$/.test(f)){let text=buf.toString();for(const [from,to] of Object.entries(aliases))text=text.replaceAll(from,to).replaceAll(path.posix.basename(from),path.posix.basename(to));buf=Buffer.from(text);}
 if(f==='tools/驛路棋盤.html'){
  let page=fs.readFileSync(path.join(root,'驛路棋盤編輯器.html'),'utf8');
  page=page.replace('<link rel="stylesheet" href="驛路棋盤編輯器.css">',()=>'<style>'+fs.readFileSync(path.join(root,'驛路棋盤編輯器.css'),'utf8')+'</style>')
   .replace('<script src="驛路棋盤編輯器.js"></script>',()=>'<script>'+fs.readFileSync(path.join(root,'驛路棋盤編輯器.js'),'utf8')+'</script><script>if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js",{scope:"./",updateViaCache:"none"}).then(r=>r.update()).catch(()=>{});</script>')
   .replace('href="驛站票價圖.html"','href="../驛站票價圖.html"');
  buf=Buffer.from(page);
 }
 if(f==='tools/驛站收費圖表.html'){
  let page=fs.readFileSync(path.join(root,'驛站票價圖.html'),'utf8');
  page=page.replace(/<script src="([^"]+)"><\/script>/g,(_,src)=>'<script>'+fs.readFileSync(path.join(root,src),'utf8')+'</script>')
   .replace(/href="(?!https?:)([^"]+)"/g,(_,href)=>'href="../'+href+'"')
   .replace('</body>','<script>if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js",{scope:"./",updateViaCache:"none"}).then(r=>r.update()).catch(()=>{});</script></body>');
  buf=Buffer.from(page);
 }
 if(f.endsWith('.html')&&!f.startsWith('tools/')){let s=buf.toString();const prefix=path.posix.relative(path.posix.dirname(f),'.')||'.';const boot=f==='index.html'?`<script src="${prefix}/app-version.js"></script>`:`<meta name="theme-color" content="#294234"><meta name="apple-mobile-web-app-capable" content="yes"><link rel="manifest" href="${prefix}/manifest.webmanifest"><link rel="apple-touch-icon" href="${prefix}/app-icon-192.png"><script src="${prefix}/app-version.js"></script><script src="${prefix}/完整存檔.js"></script><script src="${prefix}/離線資料狀態.js"></script><script src="${prefix}/手機執行環境.js"></script>`;s=s.replace(/<script src="(?:場景測試設定|場景重測)\.js"><\/script>/g,'');s=s.replace(/<head([^>]*)>/i,'<head$1><script src="'+prefix+'/場景測試設定.js"></script><script src="'+prefix+'/場景重測.js"></script>');s=s.replace('<script src="本機版本.js"></script>','').replace('<script src="本機自動更新.js"></script>','').replace('<script src="本機GM設定.js"></script>','').replace('<script src="完整存檔.js"></script>','').replace('</head>',boot+'</head>');buf=Buffer.from(s);}
 fs.mkdirSync(path.dirname(path.join(out,output)),{recursive:true});fs.writeFileSync(path.join(out,output),buf);files.push(output);
}
const guideNames=[...new Set(['行旅手冊.html',...Array.from(fs.readFileSync(path.join(root,'行旅手冊導覽.js'),'utf8').matchAll(/"([^"]+\.html)":/g),m=>m[1])])].filter(f=>f!=='場景重測.html'&&files.includes(f));
const guideOriginals=new Map(guideNames.map(f=>[f,fs.readFileSync(path.join(out,f),'utf8')]));
for(const name of guideNames){fs.writeFileSync(path.join(out,name),'<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><title>開啟行旅手冊</title><script>location.replace("guide/"+location.pathname.split("/").pop()+location.search+location.hash)</script><a href="guide/'+name+'">開啟新版攻略</a></html>');}
fs.writeFileSync(path.join(out,'app-version.js'),`window.APP_VERSION=${JSON.stringify(version)};`);files.push('app-version.js');
// 保留候選圖仍發布供手冊查看，但不自動下載。
const assets=files.filter(f=>!/(書院候選|煉丹房候選)/.test(f)&&f!=='廣宗縣城-v1.webp').map(file=>{const b=fs.readFileSync(path.join(out,file));return {file,bytes:b.length,hash:crypto.createHash('sha256').update(b).digest('hex')};});
const config=JSON.parse(fs.readFileSync(path.join(root,'離線章節設定.json'),'utf8'));
for(const a of assets){a.pack='core';if(a.file.endsWith('.webp')){const rule=config.sceneRules.find(r=>r.prefixes.some(p=>a.file.startsWith(p)));if(!rule)throw Error('請指定場景所屬章節：'+a.file);a.pack=rule.pack;}}
const packs=config.packs.map(p=>({...p,bytes:assets.filter(a=>a.pack===p.id).reduce((n,a)=>n+a.bytes,0)}));
const precache=assets.map(a=>a.file);
fs.writeFileSync(path.join(out,'offline-manifest.json'),JSON.stringify({version,packs,pages:config.pages,totalBytes:assets.reduce((n,a)=>n+a.bytes,0),assets}));
files.push('offline-manifest.json');
fs.writeFileSync(path.join(out,'sw.js'),`const VERSION=${JSON.stringify(version)},ASSETS=${JSON.stringify(assets)},ALIASES=${JSON.stringify(aliases)},PACKS=${JSON.stringify(packs)};\n`+fs.readFileSync(path.join(__dirname,'sw-template.js'),'utf8'));
fs.writeFileSync(path.join(out,'_redirects'),Object.entries(aliases).map(([from,to])=>encodeURI('/'+from)+' '+encodeURI('/'+to)+' 302').join('\n')+'\n');files.push('_redirects');
fs.writeFileSync(path.join(out,'_headers'),'/*\n  Cache-Control: no-cache\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/sw.js\n  Cache-Control: no-store\n');
fs.writeFileSync(path.join(out,'404.html'),'<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><h1>這條路尚未開放</h1><a href="/">回主城</a></html>');
files.push('sw.js','_headers','404.html');
// 攻略使用獨立作用域，直接讀取發布檔案，不加入遊戲離線包。

fs.mkdirSync(path.join(out,'guide'),{recursive:true});
const guideWorker="self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{if(e.request.method==='GET')e.respondWith(fetch(e.request,{cache:'no-store'}));});";
fs.writeFileSync(path.join(out,'guide/sw.js'),guideWorker);files.push('guide/sw.js');
fs.writeFileSync(path.join(out,'guide/version.json'),JSON.stringify({version}));files.push('guide/version.json');
for(const name of guideNames){
 let html=guideOriginals.get(name).replace(/<script src="[^"]*(?:手機執行環境|離線資料狀態|完整存檔|app-version|場景重測)\.js"><\/script>/g,'');
 const runtime=`(()=>{const pages=new Set(${JSON.stringify(guideNames)}),root=new URL('../',location.href),base=new URL('./',location.href);const fix=()=>document.querySelectorAll('a[href]').forEach(a=>{const raw=a.getAttribute('href');if(raw.startsWith('#')){a.href=location.pathname+raw;return;}const u=new URL(a.href);const file=decodeURIComponent(u.pathname.split('/').pop());if(u.origin===location.origin&&pages.has(file)&&!u.pathname.includes('/guide/'))a.href=new URL('guide/'+encodeURIComponent(file)+u.search+u.hash,root).href;});new MutationObserver(fix).observe(document.documentElement,{childList:true,subtree:true});addEventListener('DOMContentLoaded',fix);if('serviceWorker'in navigator){const enteredWithGuide=navigator.serviceWorker.controller?.scriptURL===new URL('sw.js',base).href;if(!enteredWithGuide)navigator.serviceWorker.addEventListener('controllerchange',()=>{if(navigator.serviceWorker.controller?.scriptURL===new URL('sw.js',base).href)location.reload();},{once:true});navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='CAN_UPDATE')e.source?.postMessage({type:'UPDATE_READY',nonce:e.data.nonce,ready:true});});navigator.serviceWorker.register(new URL('sw.js',base),{scope:base.href,updateViaCache:'none'}).catch(()=>{});}const initial=${JSON.stringify(version)};async function check(){if(document.hidden||document.querySelector('dialog[open]'))return;try{const r=await fetch(new URL('version.json',base),{cache:'no-store'}),v=await r.json();if(v.version!==initial)location.reload();}catch{}}if(['行旅手冊.html','劇情場景圖鑑.html'].includes(${JSON.stringify(name)})){setInterval(check,15000);addEventListener('focus',check);}})();`;
 html=html.replace(/<head([^>]*)>/i,'<head$1><base href="../"><script>'+runtime+'</script>');
 fs.writeFileSync(path.join(out,'guide',name),html);files.push('guide/'+name);
}
// 清理只限 dist 內已不屬於本版的檔案。
function prune(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())prune(p);else if(!files.includes(path.relative(out,p).replaceAll('\\','/')))fs.unlinkSync(p);}}prune(out);
fs.writeFileSync(path.join(root,'publish-inputs.json'),JSON.stringify(inputs,null,2)+'\n');
// 最後才通知本機頁面：整份建置已成功完成，不在檔案編輯一半時重新載入。
fs.writeFileSync(path.join(root,'本機版本.js'),`window.LOCAL_GAME_VERSION=${JSON.stringify(version)};\n`);
console.log(`Built ${version}: ${files.length} files, ${precache.length} core assets.`);
console.log(`Scene images ${(originalImages/1048576).toFixed(1)} -> ${(packedImages/1048576).toFixed(1)} MiB; original PNG files preserved.`);
})().catch(e=>{console.error(e);process.exitCode=1;});



