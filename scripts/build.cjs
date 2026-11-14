const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
(async()=>{
// 僅整理固定的輸出目錄，不刪除原始美術。
if(path.dirname(out)!==root||path.basename(out)!=='dist')throw Error('輸出路徑錯誤');
fs.mkdirSync(out,{recursive:true});
const all=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['本機GM設定.js','本機版本.js','本機自動更新.js'].includes(e.name)||e.name.startsWith('.')||['dist','node_modules','scripts'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(html|js|css|png|jpg|jpeg|svg|webp|woff2?|json|webmanifest)$/.test(e.name))all.push(path.relative(root,p).replaceAll('\\','/'));}}walk(root);
const chosen=new Set(['index.html','主介面流程預覽.html','存檔備份.html','完整存檔.js','手機執行環境.js','離線資料狀態.js','離線章節設定.json','章節下載.html','manifest.webmanifest','app-icon-192.png','app-icon-512.png']);
// 以遊戲引用關係收集資源；比對檔名亦涵蓋由場景資料組合的圖片路徑。
for(let old=-1;old!==chosen.size;){old=chosen.size;for(const f of [...chosen]){if(!/\.(html|js|css|json|webmanifest)$/.test(f))continue;const s=fs.readFileSync(path.join(root,f),'utf8');for(const target of all)if(s.includes(target)||s.includes(path.posix.basename(target)))chosen.add(target);}}
const inputs=[...chosen].sort();const hash=crypto.createHash('sha256');for(const f of inputs){hash.update(f);hash.update(fs.readFileSync(path.join(root,f)));}hash.update(fs.readFileSync(__filename));hash.update(fs.readFileSync(path.join(__dirname,'sw-template.js')));const version=hash.digest('hex').slice(0,12);
const sharp=require('sharp'),aliases=Object.fromEntries(inputs.filter(f=>f.endsWith('.png')&&!f.startsWith('app-icon-')).map(f=>[f,f.replace(/\.png$/,'.webp')]));
const cacheDir=path.join(root,'.asset-cache');fs.mkdirSync(cacheDir,{recursive:true});
const files=[];let originalImages=0,packedImages=0;for(const f of inputs){let buf=fs.readFileSync(path.join(root,f)),output=aliases[f]||f;if(buf.length>25*1024*1024)throw Error('單檔超過部署限制：'+f);
 if(aliases[f]){originalImages+=buf.length;const cacheKey=crypto.createHash('sha256').update(buf).update('webp-q88-e5-sharp0355').digest('hex'),cached=path.join(cacheDir,cacheKey+'.webp');if(fs.existsSync(cached))buf=fs.readFileSync(cached);else{buf=await sharp(buf).webp({quality:88,effort:5}).toBuffer();fs.writeFileSync(cached,buf);}packedImages+=buf.length;}
 else if(/\.(html|js|css|json|webmanifest)$/.test(f)){let text=buf.toString();for(const [from,to] of Object.entries(aliases))text=text.replaceAll(from,to).replaceAll(path.posix.basename(from),path.posix.basename(to));buf=Buffer.from(text);}
 if(f.endsWith('.html')){let s=buf.toString();const prefix=path.posix.relative(path.posix.dirname(f),'.')||'.';const boot=`<meta name="theme-color" content="#294234"><meta name="apple-mobile-web-app-capable" content="yes"><link rel="manifest" href="${prefix}/manifest.webmanifest"><link rel="apple-touch-icon" href="${prefix}/app-icon-192.png"><script src="${prefix}/app-version.js"></script><script src="${prefix}/完整存檔.js"></script><script src="${prefix}/離線資料狀態.js"></script><script src="${prefix}/手機執行環境.js"></script>`;s=s.replace('<script src="本機版本.js"></script>','').replace('<script src="本機自動更新.js"></script>','').replace('<script src="本機GM設定.js"></script>','').replace('<script src="完整存檔.js"></script>','').replace('</head>',boot+'</head>');buf=Buffer.from(s);}
 fs.mkdirSync(path.dirname(path.join(out,output)),{recursive:true});fs.writeFileSync(path.join(out,output),buf);files.push(output);
}
fs.writeFileSync(path.join(out,'app-version.js'),`window.APP_VERSION=${JSON.stringify(version)};`);files.push('app-version.js');
// 保留候選圖仍發布供手冊查看，但不自動下載。
const assets=files.filter(f=>!/(書院候選|煉丹房候選)/.test(f)).map(file=>{const b=fs.readFileSync(path.join(out,file));return {file,bytes:b.length,hash:crypto.createHash('sha256').update(b).digest('hex')};});
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
// 清理只限 dist 內已不屬於本版的檔案。
function prune(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())prune(p);else if(!files.includes(path.relative(out,p).replaceAll('\\','/')))fs.unlinkSync(p);}}prune(out);
fs.writeFileSync(path.join(root,'publish-inputs.json'),JSON.stringify(inputs,null,2)+'\n');
// 最後才通知本機頁面：整份建置已成功完成，不在檔案編輯一半時重新載入。
fs.writeFileSync(path.join(root,'本機版本.js'),`window.LOCAL_GAME_VERSION=${JSON.stringify(version)};\n`);
console.log(`Built ${version}: ${files.length} files, ${precache.length} core assets.`);
console.log(`Scene images ${(originalImages/1048576).toFixed(1)} -> ${(packedImages/1048576).toFixed(1)} MiB; original PNG files preserved.`);
})().catch(e=>{console.error(e);process.exitCode=1;});



