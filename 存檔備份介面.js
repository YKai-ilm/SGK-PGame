'use strict';
(()=>{let selected=null,busy=false;const $=id=>document.getElementById(id),message=s=>$('message').textContent=s;
window.GameCanUpdate=()=>!busy&&!selected&&!$('confirm').open;
const run=async fn=>{busy=true;try{await fn();}catch(e){message(e.message);}finally{busy=false;}};
$('export').onclick=()=>run(async()=>{FullSave.download(await FullSave.pack());message('已交給瀏覽器下載，請確認檔案已保存。');});
if(navigator.share&&navigator.canShare){$('share').hidden=false;$('share').onclick=()=>run(async()=>{const f=await FullSave.pack(),file=new File([JSON.stringify(f)],'三國完整進度.backup.json',{type:'application/json'});if(!navigator.canShare({files:[file]}))throw Error('此瀏覽器不支援分享檔案，請使用匯出備份。');await navigator.share({files:[file],title:'三國完整進度'});message('已完成分享操作，請確認目的地已保存檔案。');});}
$('file').onchange=()=>run(async()=>{selected=null;$('import').disabled=true;const file=$('file').files[0];if(!file)return;if(file.size>12000000)throw Error('檔案過大');selected=await FullSave.parse(await file.text());const s=FullSave.summary(selected);$('summary').textContent=`備份時間：${s.time}\n劇情陣營：${s.faction}\n已解鎖武將：${s.heroes} 位\n劇情金幣：${s.coins}\n裝備：${s.items} 件\n進度區塊：${s.records}`;$('import').disabled=false;message('檢查完成，尚未覆蓋。');});
$('import').onclick=()=>$('confirm').showModal();$('no').onclick=()=>$('confirm').close();
$('yes').onclick=()=>run(async()=>{if(!selected)return;FullSave.restore(selected);selected=null;$('confirm').close();location.replace('主介面流程預覽.html');});
$('previous').onclick=()=>run(async()=>{const raw=localStorage.getItem(FullSave.previousKey);if(!raw)throw Error('還沒有匯入前的恢復副本');FullSave.download(await FullSave.pack(JSON.parse(raw)));message('已匯出覆蓋前的進度。');});
$('version').textContent='版本：'+(window.APP_VERSION||'本機開發版');
})();
