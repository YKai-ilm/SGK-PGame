'use strict';
(()=>{
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const notes=StorySceneGuide.interiorNotes;
const scenes=[...StorySceneGuide.places,...SharedInteriorScenes.map(s=>{const m=notes[s.id],reserve=s.id.startsWith('書院')||s.id==='煉丹房候選';return {id:s.id,name:s.name,image:s.image,group:reserve?'保留備用':'共用室內',status:s.status||(reserve?'保留備用':'建議圖'),desc:m[0],npc:m[1],guide:m[2],preview:'共用室內場景預覽.html?source=guide&scene='+encodeURIComponent(s.id)}})];
// 圖鑑專用的徐州人物配置；不改遊戲存檔或觸發劇情。
window.XuzhouGuideNotes={};
for(const [id,c] of Object.entries(XuzhouNpcPlacement)){
 const base=id==='城西'?c:SharedInteriorScenes.find(s=>s.id===id);if(!base)continue;
 const sceneId=id==='城西'?'徐州城西':'徐州'+id;
 const key='xzNpc:'+id;
 StoryGuidePoints[sceneId]=[[c.npc,c.npcX??base.npcX,c.npcY??base.npcY,13.5,3.6,key],[id==='城西'?'回內城':'離開',base.exitX,base.exitY,12,3.6,'xzExit']];
 for(const place of c.places||[]){const mark='xzSite:'+place.id;StoryGuidePoints[sceneId].push([place.name,place.x,place.y,13.5,3.6,mark]);XuzhouGuideNotes[mark]=place.description;}
 XuzhouGuideNotes[key]=c.npc+'：'+c.line+(c.note?' '+c.note:' 常駐於櫃檯，劇情優先，平時使用固定對話。');
 if(id!=='城西')scenes.push({id:sceneId,name:'徐州・'+(id==='城主府一'?'城主府':id),image:base.image,group:'徐州',status:'字卡已配置',desc:id==='城主府一'?'沿用版本一展示糜竺位置；徐州城主府底圖版本仍待正式指定。':id==='驛站'?'內城左上方有馬的入口旁為驛站，室內配置驛丞。':'沿用共用室內底圖，展示徐州人物位置。',npc:c.npc,guide:XuzhouGuideNotes[key]+' 此為圖鑑配置，正式任務及功能尚待接入。',preview:'共用室內場景預覽.html?source=guide&city=xuzhou&scene='+encodeURIComponent(id)});
}
XuzhouGuideNotes.xzExit='離開此處，返回徐州內城。';
const cityPlaces=[['城主府',57,17.5,'糜竺'],['役所',22,92,'書吏'],['驛站',10,29,'驛丞'],['客棧',35,35,'客棧掌櫃'],['酒樓',80,35,'店小二'],['武器店',33,54.5,'鐵匠'],['防具店',80,54.5,'甲匠'],['訓練店',26,72,'教頭'],['編輯所',80,69.5,'編籍吏'],['道具店',78,86.5,'雜貨掌櫃'],['城西',8.5,39,'糧隊管事']];
StoryGuidePoints['徐州內城']=cityPlaces.map(([name,x,y,npc])=>{const key='xzPlace:'+name;XuzhouGuideNotes[key]=name+'：'+npc+'位於'+(name==='城西'?'城西糧車旁。':'室內，請查看下方對應場景的人物字卡。');return [name,x,y,13.5,3.6,key];});
StoryGuidePoints['徐州內城'].push(['離開',48,96,12,3.6,'xzCityExit']);
XuzhouGuideNotes.xzCityExit='由下方主道離開徐州城；目前可返回桃源村。';

// 初戰黃巾：圖鑑標示與正式場景相同，字卡條件另附說明。
for(const [name,rows] of Object.entries({'前線營地':[['軍吏',40,48,'先交代任務；主營戰後再向他回報。'],['斥候',72,52,'聽完軍吏後開前哨；鄧茂撤退後開主營。'],['黃巾前哨',50,15,'首次斥候對話結束後出現。'],['黃巾主營',76,23,'前哨勝利，回營地找斥候確認後出現。'],['離開',50,93,'返回徐州城。']],'黃巾前哨':[['鄧茂',50,48,'交談後開始六波戰鬥；勝利後撤退消失。'],['離開',50,93,'返回前線營地。']],'黃巾主營':[['程遠志',50,55,'交談後開始六波戰鬥；勝利後敗退，不判定死亡。'],['離開',50,93,'返回前線營地。']]})){StoryGuidePoints[name]=rows.map(([label,x,y,note],i)=>{const key='yellowGuide:'+name+':'+i;XuzhouGuideNotes[key]=note;return [label,x,y,13.5,3.6,key];});}
for(const [scene,label,x,y,note]of [['前線營地','行囊',72,69,'進入營地即可找到：20金幣；拾取後消失。'],['黃巾前哨','寶箱',24,42,'鄧茂撤退後出現：字卡經驗書（120）一本；開後保留空箱。'],['黃巾主營','寶箱',83,40,'程遠志撤退後出現：40金幣與赤心丹一個；開後保留空箱。']]){const key='yellowLoot:'+scene;StoryGuidePoints[scene].push([label,x,y,12,3.6,key]);XuzhouGuideNotes[key]=note+' 限一次，回訪可補領。';}
for(const [name,rows]of Object.entries({"盧植軍營":[["盧植",40,43],["傳令兵",72,53]],"廣宗外圍":[["接應軍士",48,72],["車隊",74,49]],"長社營地":[["皇甫嵩",39,41],["朱儁",70,52],["軍需吏",28,73]],"長社側翼":[["朱儁",43,65],["皇甫嵩",72,53]],"驛道探訊":[["盧植",52,43],["押解軍士",70,48]],"南陽軍前":[["朱儁",40,43],["斥候",71,53]]})){StoryGuidePoints[name]=[...rows,["離開",50,93]].map(([label,x,y],i)=>{const key="han-guide:"+name+":"+i;XuzhouGuideNotes[key]=label==="離開"?"返回前一營地或開啟行程選單。":StorySceneGuide.places.find(p=>p.name===name).guide;return [label,x,y,13.5,3.6,key];});}
for(const [name,rows]of Object.entries({"宛城外圍":[["避難老者",29,51],["逃出城的民夫",74,57],["宛城城門",51,21],["遺落行囊",16,58]],"宛城城門":[["韓忠",50,48],["守門兵",74,54],["安置百姓",44,72],["軍需箱",83,70]]})){StoryGuidePoints[name]=[...rows,["離開",50,93]].map(([label,x,y],i)=>{const key="wan-guide:"+name+":"+i;XuzhouGuideNotes[key]=label==="離開"?"返回前一場景。":StorySceneGuide.places.find(p=>p.name===name).guide;return [label,x,y,13.5,3.6,key];});}

// 城鎮基本設施沿用正式場景的室內素材與人物位置。
const townServices={縣衙:'書吏提供日常交談，軍務依城外劇情進行。',驛站:'依州選擇目的地，確認路程與費用後傳送；每段20金幣。',客棧:'無編制收20金幣；有編制為22金幣加每名武將2金幣。住宿恢復士氣至100。',道具鋪:'可與掌櫃交談及查看服務，買賣尚未開放。',武器鋪:'可與鐵匠交談及查看服務，買賣尚未開放。',防具鋪:'可與甲匠交談及查看服務，買賣尚未開放。',編輯所:'可進入候選隊伍編輯，安排同行武將。'};
for(const town of ['長社','廣宗'])for(const [label,guide]of Object.entries(townServices)){
 const base=SharedInteriorScenes.find(s=>s.id===({縣衙:'役所',道具鋪:'道具店',武器鋪:'武器店',防具鋪:'防具店'}[label]||label)),id=town+'・'+label,npcKey='townNpc:'+id,exitKey='townExit:'+id;
 XuzhouGuideNotes[npcKey]=guide;XuzhouGuideNotes[exitKey]='離開室內，返回'+town+'。';
 StoryGuidePoints[id]=[[base.npc,base.npcX,base.npcY,13.5,3.6,npcKey],['離開',base.exitX,base.exitY,12,3.6,exitKey]];
 scenes.push({id,name:id,image:base.image,group:town,status:'已接入／共用室內',desc:town+'的'+label+'，沿用共用室內底圖。',npc:base.npc,guide:guide+' 離開返回'+town+'。',preview:base.image,implementedFacility:true});
}

const townEntrances={長社:[['縣衙',42,23],['驛站',23,50],['客棧',25,37],['道具鋪',76,53],['武器鋪',75,36],['防具鋪',64,44],['編輯所',25,65],['長社軍營',85,18],['離開',50,89]],廣宗:[['縣衙',32,25],['驛站',72,65],['客棧',80,34],['道具鋪',80,49],['武器鋪',23,39],['防具鋪',24,56],['編輯所',23,72],['盧植軍營',84,16],['離開',50,93]]};
for(const [town,rows]of Object.entries(townEntrances))StoryGuidePoints[town]=rows.map(([label,x,y])=>{
 const key='townEntrance:'+town+':'+label;
 XuzhouGuideNotes[key]=label==='離開'?'開啟去向選單：前往大地圖；符合劇情時另有軍營任務入口。':label==='長社軍營'?'劇情入口：盧植交付赴長社軍令後才出現。':label==='盧植軍營'?'劇情入口：接下漢軍會師出征任務後才出現。':'進入'+town+'・'+label+'。'+townServices[label];
 return [label,x,y,13.5,3.6,key];
});
const groups=['桃園','徐州','長社','廣宗','黃巾烽火','共用室內','保留備用'],captions={'長社':'縣城街道與基本設施','廣宗':'城鎮街道與基本設施','黃巾烽火':'黃巾戰役的軍營、前線與戰場','桃園':'已接入的故事起點','徐州':'內城、城西與室內 NPC 字卡配置','共用室內':'各城可重用，人物與事件另配','保留備用':'使用者指定保存，日後直接取用'};
let filter='全部',restoreDetails=[];
for(const g of ['全部',...groups]){const b=document.createElement('button');b.textContent=g;b.dataset.filter=g;b.onclick=()=>{filter=g;render()};$('filters').append(b)}
function render(){
 const q=$('search').value.trim().toLowerCase(),shown=scenes.filter(s=>(filter==='全部'||s.group===filter)&&[s.name,s.desc,s.npc,s.guide,s.status].join(' ').toLowerCase().includes(q));
 $('count').textContent='顯示 '+shown.length+'／'+scenes.length+' 個場景 · 更新 '+StorySceneGuide.updated;
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 $('groups').innerHTML=groups.map(g=>{const list=shown.filter(s=>s.group===g);if(!list.length)return '';return '<section class="chapter"><div class="section-title"><h2>'+g+'</h2><small>'+captions[g]+'</small></div>'+(g==='保留備用'?'<p class="archive-note">這些原圖已保存。書院三版與煉丹房候選不再作為城主府；未來指定使用時直接套用既有圖片。</p>':'')+'<div class="grid">'+list.map(s=>'<article class="card"><button class="thumb" data-image="'+esc(s.id)+'" aria-label="放大'+esc(s.name)+'"><img loading="lazy" src="'+esc(s.image)+'" alt="'+esc(s.name)+'"></button><div class="body"><div class="heading"><h3>'+esc(s.name)+'</h3><span class="badge '+(['已採用','美術定案','暫定採用'].includes(s.status)?'accepted':'')+'">'+esc(s.status)+'</span></div><p>'+esc(s.desc)+'</p><div class="people"><b>相關人物</b><span>'+esc(s.npc)+'</span></div><details><summary>'+(s.group==='保留備用'?'保存說明':'劇情線索與進度')+'</summary><p>'+esc(s.guide)+'</p></details><div class="links">'+(window.SceneTestGuideIDs?.[s.id]?'<a href="場景重測.html?scene='+encodeURIComponent(SceneTestGuideIDs[s.id])+'">測試此場景劇情 →</a>':'<span class="guide-preview-only">'+(s.implementedFacility?'已接入城鎮日常設施':s.group==='保留備用'?'保留美術素材，尚未配置劇情':'替代室內底圖，尚未配置獨立劇情')+'</span>')+(s.group==='桃園'?'<a href="'+esc(s.image)+'" target="_blank" rel="noopener">查看場景原圖</a>':'<a href="'+esc(s.preview)+'">查看美術／配置預覽 →</a>')+'</div></div></article>').join('')+'</div></section>'}).join('')||'<p class="empty">找不到符合的場景，請換個名稱或人物搜尋。</p>';
 StoryGuideOverlay.enhance(scenes);
}
$('guideMode').onchange=e=>StoryGuideOverlay.setMode(e.target.value==='annotated');
$('search').addEventListener('input',render);
$('groups').addEventListener('click',e=>{const b=e.target.closest('[data-image]');if(!b)return;const s=scenes.find(s=>s.id===b.dataset.image);$('zoomTitle').textContent=s.name;$('zoomImage').src=s.image;$('zoomImage').alt=s.name;$('zoomDesc').textContent=s.desc;$('original').href=s.image;StoryGuideOverlay.zoom(s);$('zoom').showModal()});
$('close').onclick=()=>$('zoom').close();$('print').onclick=()=>window.print();
window.addEventListener('beforeprint',()=>{restoreDetails=[...document.querySelectorAll('details')].map(d=>[d,d.open]);restoreDetails.forEach(([d])=>d.open=true)});
window.addEventListener('afterprint',()=>{restoreDetails.forEach(([d,open])=>d.open=open);restoreDetails=[]});
render();
})();

