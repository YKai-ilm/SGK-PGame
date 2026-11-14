'use strict';
window.FullSave=(()=>{
 const format='three-kingdoms-full-save',epochKey='tk-save-epoch',journalKey='tk-save-import-journal',previousKey='tk-save-before-import';
 const owns=k=>typeof k==='string'&&/^three-kingdoms-[a-z0-9-]+$/.test(k)&&!k.includes('-gm-')&&!k.includes('-design')&&!k.includes('-quality');
 const snapshot=()=>Object.fromEntries(Object.keys(localStorage).filter(owns).sort().map(k=>[k,localStorage.getItem(k)]));
 const mainKey='three-kingdoms-interface-preview-v1';
 function validateData(data){if(!data||Array.isArray(data)||typeof data!=='object'||Object.keys(data).length>100)throw Error('存檔內容不正確');
  for(const [k,v] of Object.entries(data)){if(!owns(k)||typeof v!=='string'||v.length>4000000)throw Error('存檔包含不支援的資料');const x=JSON.parse(v);if(x===null||typeof x!=='object')throw Error('進度格式不正確');}
  const p=JSON.parse(data[mainKey]||'null');if(!p||p.version!==1||!['story','battle'].includes(p.mode)||!['new','progress','completed','skipped'].includes(p.tutorial?.status)||!p.teams||!p.unlocks)throw Error('缺少有效的主進度，或存檔版本尚不支援');
  return data;
 }
 async function hash(data){const ordered=Object.fromEntries(Object.keys(data).sort().map(k=>[k,data[k]]));const bytes=new TextEncoder().encode(JSON.stringify(ordered));return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
 async function pack(data=snapshot()){validateData(data);return {format,version:1,savedAt:new Date().toISOString(),gameVersion:window.APP_VERSION||'local',data,checksum:await hash(data)};}
 async function parse(text){if(text.length>12000000)throw Error('存檔過大');const f=JSON.parse(text);if(f.format!==format||f.version!==1)throw Error('請選擇完整進度備份；單場戰鬥存檔請到戰場載入');if(!Number.isFinite(Date.parse(f.savedAt)))throw Error('備份時間無效');validateData(f.data);if(f.checksum!==await hash(f.data))throw Error('存檔檢查失敗，檔案可能不完整');return f;}
 function summary(f){const p=JSON.parse(f.data[mainKey]);return {time:new Date(f.savedAt).toLocaleString(),faction:p.storyFaction||'未選擇',heroes:p.unlocks?.story?.heroes?.length||0,coins:p.rewards?.modes?.story?.coins||0,items:p.equipment?.story?.items?.length||0,records:Object.keys(f.data).length};}
 function writeAll(data){for(const k of Object.keys(localStorage).filter(owns))if(!Object.hasOwn(data,k))localStorage.removeItem(k);for(const [k,v] of Object.entries(data))localStorage.setItem(k,v);}
 function restore(f){validateData(f.data);const old=snapshot();localStorage.setItem(journalKey,JSON.stringify(old)); // 先確保恢復副本可寫，失敗時完全不改原進度。
  try{localStorage.setItem(previousKey,JSON.stringify(old));writeAll(f.data);localStorage.setItem(epochKey,crypto.randomUUID());localStorage.removeItem(journalKey);}
  catch(e){try{writeAll(old);localStorage.removeItem(journalKey);}catch{}throw Error('匯入未完成，原進度已保留；請重新開啟備份頁重試。');}
 }
 function recover(){const old=localStorage.getItem(journalKey);if(old!==null){const data=JSON.parse(old);for(const [k,v] of Object.entries(data))if(!owns(k)||typeof v!=='string')throw Error('恢復副本無效');writeAll(data);localStorage.removeItem(journalKey);}}
 function download(f){const url=URL.createObjectURL(new Blob([JSON.stringify(f)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='三國完整進度-'+new Date().toISOString().replace(/[:.]/g,'-')+'.backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
 return{owns,snapshot,pack,parse,summary,restore,recover,download,previousKey,epochKey};
})();
