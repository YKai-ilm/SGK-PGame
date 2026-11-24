const fs=require('node:fs'),assert=require('node:assert/strict');
const pages=fs.readdirSync('dist/guide').filter(f=>f.endsWith('.html'));
assert(pages.includes('副章節劇情.html'));
for(const name of pages){const html=fs.readFileSync('dist/guide/'+name,'utf8');assert(!/<script\b[^>]*\bsrc=["'][^"']*背景音樂\.js/i.test(html),'攻略不得載入遊戲外框跳轉：'+name);assert(html.includes('<base href="../">'),'攻略資源基底缺失：'+name);}
const legacy=fs.readFileSync('dist/副章節劇情.html','utf8');assert(legacy.includes('location.search+location.hash'),'舊連結必須保留章節參數');
console.log('PASS independent guide pages exclude game audio redirects and preserve subchapter query links');
