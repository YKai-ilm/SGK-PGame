const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function setup(protocol='file:'){let version='v1',safe=false,reloads=0,tick;const win={LOCAL_GAME_VERSION:version,GameCanUpdate:()=>safe};const document={hidden:false,addEventListener(){},createElement(){return {remove(){}};},head:{append(s){win.LOCAL_GAME_VERSION=version;s.onload();}}};vm.runInNewContext(fs.readFileSync('本機自動更新.js','utf8'),{window:win,document,location:{protocol,reload(){reloads++;}},Date,setInterval(fn){tick=fn;}});return {tick:()=>tick?.(),version:v=>version=v,safe:v=>safe=v,reloads:()=>reloads};}
const a=setup();a.safe(true);a.tick();assert.equal(a.reloads(),0);a.safe(false);a.version('v2');a.tick();assert.equal(a.reloads(),0);a.safe(true);a.tick();assert.equal(a.reloads(),1);
const b=setup('https:');b.version('v2');b.safe(true);b.tick();assert.equal(b.reloads(),0);
console.log('PASS local completed-build detection, busy-state deferral and hosted isolation.');
