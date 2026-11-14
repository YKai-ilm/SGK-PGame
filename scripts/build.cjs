const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
// 僅整理固定的輸出目錄，不刪除原始美術。
if(path.dirname(out)!==root||path.basename(out)!=='dist')throw Error('輸出路徑錯誤');
fs.mkdirSync(out,{recursive:true});
const all=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['本機GM設定.js','本機版本.js','本機自動更新.js'].includes(e.name)||e.name.startsWith('.')||['dist','node_modules','scripts'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(html|js|css|png|jpg|jpeg|svg|webp|woff2?|json|webmanifest)$/.test(e.name))all.push(path.relative(root,p).replaceAll('\\','/'));}}walk(root);
const chosen=new Set(['index.html','主介面流程預覽.html','存檔備份.html','完整存檔.js','手機執行環境.js','manifest.webmanifest','app-icon-192.png','app-icon-512.png']);
// 以遊戲引用關係收集資源；比對檔名亦涵蓋由場景資料組合的圖片路徑。
for(let old=-1;old!==chosen.size;){old=chosen.size;for(const f of [...chosen]){if(!/\.(html|js|css|json|webmanifest)$/.test(f))continue;const s=fs.readFileSync(path.join(root,f),'utf8');for(const target of all)if(s.includes(target)||s.includes(path.posix.basename(target)))chosen.add(target);}}
const inputs=[...chosen].sort();const hash=crypto.createHash('sha256');for(const f of inputs){hash.update(f);hash.update(fs.readFileSync(path.join(root,f)));}hash.update(fs.readFileSync(__filename));hash.update(fs.readFileSync(path.join(__dirname,'sw-template.js')));const version=hash.digest('hex').slice(0,12);
const files=[];for(const f of inputs){let buf=fs.readFileSync(path.join(root,f));if(buf.length>25*1024*1024)throw Error('單檔超過部署限制：'+f);
 if(f.endsWith('.html')){let s=buf.toString();const prefix=path.posix.relative(path.posix.dirname(f),'.')||'.';const boot=`<meta name="theme-color" content="#294234"><meta name="apple-mobile-web-app-capable" content="yes"><link rel="manifest" href="${prefix}/manifest.webmanifest"><link rel="apple-touch-icon" href="${prefix}/app-icon-192.png"><script src="${prefix}/app-version.js"></script><script src="${prefix}/完整存檔.js"></script><script src="${prefix}/手機執行環境.js"></script>`;s=s.replace('<script src="本機版本.js"></script>','').replace('<script src="本機自動更新.js"></script>','').replace('<script src="本機GM設定.js"></script>','').replace('<script src="完整存檔.js"></script>','').replace('</head>',boot+'</head>');buf=Buffer.from(s);}
 fs.mkdirSync(path.dirname(path.join(out,f)),{recursive:true});fs.writeFileSync(path.join(out,f),buf);files.push(f);
}
fs.writeFileSync(path.join(out,'app-version.js'),`window.APP_VERSION=${JSON.stringify(version)};`);files.push('app-version.js');
// 核心頁面與程式預先完整下載；圖片按需快取，避免第一次啟動下載所有場景。
const precache=files.filter(f=>/\.(html|js|css|webmanifest)$/.test(f));
fs.writeFileSync(path.join(out,'sw.js'),`const VERSION=${JSON.stringify(version)},PRECACHE=${JSON.stringify(precache)};\n`+fs.readFileSync(path.join(__dirname,'sw-template.js'),'utf8'));
fs.writeFileSync(path.join(out,'_headers'),'/*\n  Cache-Control: no-cache\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/sw.js\n  Cache-Control: no-store\n');
fs.writeFileSync(path.join(out,'404.html'),'<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><h1>這條路尚未開放</h1><a href="/">回主城</a></html>');
files.push('sw.js','_headers','404.html');
// 清理只限 dist 內已不屬於本版的檔案。
function prune(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())prune(p);else if(!files.includes(path.relative(out,p).replaceAll('\\','/')))fs.unlinkSync(p);}}prune(out);
fs.writeFileSync(path.join(root,'publish-inputs.json'),JSON.stringify(inputs,null,2)+'\n');
// 最後才通知本機頁面：整份建置已成功完成，不在檔案編輯一半時重新載入。
fs.writeFileSync(path.join(root,'本機版本.js'),`window.LOCAL_GAME_VERSION=${JSON.stringify(version)};\n`);
console.log(`Built ${version}: ${files.length} files, ${precache.length} core assets.`);


