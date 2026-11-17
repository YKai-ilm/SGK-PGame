'use strict';
// 每個頁面在讀取遊戲進度前載入；測試資料只存在此分頁的 sessionStorage。
(()=>{
 const nativeLocal=window.localStorage,nativeSession=window.sessionStorage;
 const recordKey='scene-test-session-v1';
 const get=nativeSession.getItem.bind(nativeSession),put=nativeSession.setItem.bind(nativeSession),remove=nativeSession.removeItem.bind(nativeSession);
 const read=()=>JSON.parse(get(recordKey)||'null');
 // 等舊頁的 pagehide / unload 結束後，才在返回頁解除隔離。
 if(read()?.exiting&&decodeURIComponent(location.pathname).endsWith('/場景重測.html'))remove(recordKey);
 const entries=store=>Object.fromEntries(Array.from({length:store.length},(_,i)=>store.key(i)).filter(k=>k!==recordKey).map(k=>[k,store.getItem(k)]));
 function storage(native,kind){
  const data=()=>read()?.[kind];
  const keys=()=>Object.keys(data()||entries(native));
  const api={getItem(k){k=String(k);const d=data();return d?(Object.hasOwn(d,k)?d[k]:null):native.getItem(k);},setItem(k,v){const r=read();if(!r)return native.setItem(k,v);r[kind][String(k)]=String(v);put(recordKey,JSON.stringify(r));},removeItem(k){const r=read();if(!r)return native.removeItem(k);delete r[kind][String(k)];put(recordKey,JSON.stringify(r));},clear(){const r=read();if(!r)return native.clear();r[kind]={};put(recordKey,JSON.stringify(r));},key(i){return keys()[Number(i)]??null;}};
  return new Proxy(api,{get(t,k){if(k==='length')return keys().length;if(k in t)return t[k];return typeof k==='string'?t.getItem(k):undefined;},set(t,k,v){t.setItem(k,v);return true;},deleteProperty(t,k){t.removeItem(k);return true;},ownKeys(){return keys();},getOwnPropertyDescriptor(t,k){if(keys().includes(k))return {configurable:true,enumerable:true,writable:true,value:t.getItem(k)};}});
 }
 const testLocal=storage(nativeLocal,'local'),testSession=storage(nativeSession,'session');
 Object.defineProperty(window,'localStorage',{configurable:true,get:()=>read()?testLocal:nativeLocal});
 Object.defineProperty(window,'sessionStorage',{configurable:true,get:()=>read()?testSession:nativeSession});
 const routes=window.SceneTestScenes;
 const mainKey='three-kingdoms-interface-preview-v1',villageKey='three-kingdoms-taoyuan-dialogue-v1',hiddenKey='three-kingdoms-taoyuan-hidden-items-v1',cityKey='three-kingdoms-xuzhou-story-v1';
 function current(){const r=read();return r&&routes[r.id];}
 function storeObject(key){return JSON.parse(localStorage.getItem(key)||'{}');}
 function saveObject(key,value){localStorage.setItem(key,JSON.stringify(value));}
 function start(id){
  if(!routes[id])throw Error('未知的測試場景');
  // 先建立完整測試初始資料，再替換。正式資料只讀，不備份覆寫或扣回獎勵。
  const local=entries(nativeLocal),route=routes[id];
  for(const k of Object.keys(local))if(k.startsWith('three-kingdoms-')||k.startsWith('tk-save-'))delete local[k];
  const profile={version:1,mode:'story',storyFaction:'蜀',libraryFaction:'蜀',page:'home',tutorial:{status:'skipped',step:0},teams:{},unlocks:{story:{heroes:[],letters:[]},battle:{heroes:[],letters:[]}},storyEvents:{},storyItems:{}};
  local[villageKey]=JSON.stringify({scene:route.engine==='taoyuan'?route.scene:'home',party:[],seen:[],active:null});
  local[cityKey]=JSON.stringify({scene:route.engine==='xuzhou'?route.scene:'內城',flags:{},history:[],active:null});
  local[mainKey]=JSON.stringify(profile);
  put(recordKey,JSON.stringify({id,local,session:{}}));
  window.top.location.href=route.url;
 }
 function exit(){const r=read();if(r){r.exiting=true;put(recordKey,JSON.stringify(r));}window.top.location.href='場景重測.html';}
 function notice(text){const el=document.getElementById('sceneTestNotice');if(el)el.textContent=text;}
 function holdNavigation(label){if(!read())return false;notice('此處原本會前往「'+label+'」。場景測試保留在原圖；請用上方選單切換場景。');return true;}
 function getPath(obj,path){return path.reduce((v,k)=>v?.[k],obj);}
 function setPath(obj,path,value){let x=obj;for(const k of path.slice(0,-1))x=x[k]??={};x[path.at(-1)]=value;}
 const items=[
  ['rabbit','小兔布偶',hiddenKey,['rabbitDoll']],['candy','糖葫蘆',hiddenKey,['tanghulu']],['paste','茯苓草本膏',hiddenKey,['fulingPaste']],
  ['water','一桶水',mainKey,['storyItems','waterBucket']],['smoke','護身煙',mainKey,['storyItems','protectionSmoke']],['book','字卡經驗書（120）',mainKey,['storyItems','letterXPBook120']],['coins','行囊金幣（20）',mainKey,['rewards','wallet','coins'],20]
 ];
 const equipmentItems=[['gold','金項鍊','taoyuan-west-gold-necklace','accessory'],['cloth','布衣','yunlongYellowFlowersCloth','armor'],['horse','驛馬','yunlong-rescue-horse','mount'],['qingnang','青囊書（殘）','yunlong-qingnang-remnant','accessory']];
 const stages={
  taoyuan:[['initial','一般／未觸發'],['revealed','關羽、張飛已現身（尚未加入）'],['companions','關羽、張飛已加入'],['flower','已聽村長介紹、接下小花任務'],['jewelry','已接下樵夫首飾任務'],['banquet','飲宴完成、可以結義']],
  xuzhou:[['initial','一般／首次拜訪'],['apprentice','已初訪藥童（測糖葫蘆分支）'],['introduced','書吏已引薦糜竺'],['accepted','已接受護糧委託'],['steward','已見糧隊管事'],['slept','已住宿、次日查問'],['miElder','已聽糜太公心事'],['miZhen','已與糜貞交談、待說媒'],['rescued','雲龍山救援完成、華陀回家']],
  yunlong:[['initial','一般／盜賊未擊退'],['bandits','盜賊已擊退、大牛可對話'],['daniu','已與大牛交談、華陀出現'],['huatuo','已與華陀交談、可接大牛'],['collected','已接回大牛、準備救小牛'],['rescued','小牛已救醒、救援寶箱出現']]
 };
 function applyConditions(){
  const route=current(),stage=document.getElementById('sceneTestStage').value;
  let p=storeObject(mainKey),v=storeObject(villageKey),h=storeObject(hiddenKey),c=storeObject(cityKey);
  p.storyEvents={};v.seen=[];v.party=[];v.guanRevealed=false;v.zhangRevealed=false;v.active=null;c.flags={};c.active=null;c.sleepPending=false;
  delete h.flowerQuest;delete h.flowerVisits;delete h.huatuoCompleted;
  if(document.getElementById('sceneTestParty').checked){v.party=['關羽','張飛'];}
  if(route.engine==='taoyuan'){
   if(stage==='revealed'){v.guanRevealed=true;v.zhangRevealed=true;}
   if(stage==='companions'||stage==='banquet')v.party=['關羽','張飛'];
   if(stage==='flower'){v.seen=['villageChief'];h.flowerQuest='searching';h.flowerVisits=2;}
   if(stage==='jewelry')p.storyEvents.woodcutterJewelry='searching';
   if(stage==='banquet')v.seen=['banquet'];
  }
  if(route.engine==='xuzhou'){
   if(stage==='apprentice')c.flags.apprenticeFirst=true;
   const chain=['introduced','accepted','steward','slept'];const n=chain.indexOf(stage);chain.forEach((k,i)=>{if(i<=n)c.flags[k]=true;});
   if(stage==='miElder'||stage==='miZhen')c.flags.miElderHeard=true;
   if(stage==='miZhen'){c.flags.miZhenAwaitingMarriage=true;c.flags.miZhenVisitors=v.party.slice();}
   if(stage==='rescued')p.storyEvents.yunlongRescue={daniuCollected:true,medicineUsed:true,rescued:true,chestOpened:true,completed:true};
  }
  if(route.engine==='yunlong'){
   const n=['initial','bandits','daniu','huatuo','collected','rescued'].indexOf(stage);
   if(n>=1)p.storyEvents.yunlongBanditsDefeated={runId:'guide-test',at:Date.now()};
   if(n>=2)p.storyEvents.yunlongDaniuTalkCompleted=true;
   if(n>=3)p.storyEvents.yunlongHuatuoTalkCompleted=true;
   if(n>=4)p.storyEvents.yunlongRescue={daniuCollected:true};
   if(n>=5)Object.assign(p.storyEvents.yunlongRescue,{medicineUsed:true,rescued:true});
  }
  p.rewards??={};p.rewards.wallet??={coins:0,diamonds:0};
  if(document.getElementById('sceneTestOath').checked)p.storyEvents.peachOath=true;
  if(document.getElementById('sceneTestDream').checked)p.storyEvents.dreamReincarnationTriggered=true;
  const objects={[mainKey]:p,[villageKey]:v,[hiddenKey]:h,[cityKey]:c};
  for(const [id,,key,path,amount=1] of items)setPath(objects[key],path,document.getElementById('scene-item-'+id).checked?amount:0);
  p.equipment??={};const bag=p.equipment.story??={items:[],loadouts:{}};bag.items??=[];for(const [id,name,itemId,slot] of equipmentItems){bag.items=bag.items.filter(i=>i.id!==itemId);if(document.getElementById('scene-item-'+id).checked)bag.items.push({id:itemId,name,slot,source:'場景測試',...(id==='qingnang'?{effect:'qingnangRemnant'}:{})});}
  // 道具持有與領取地點的已領取標記分開，方便測提前取得／交付分支。
  v.scene=route.engine==='taoyuan'?route.scene:v.scene;c.scene=route.engine==='xuzhou'?route.scene:c.scene;
  for(const [key,obj] of Object.entries(objects))saveObject(key,obj);
  const r=read();r.stage=stage;put(recordKey,JSON.stringify(r));location.reload();
 }
 window.SceneTest={start,exit,active:()=>!!read(),routes,current,holdNavigation};
 // 先攔截舊頁的連結；測試用切換僅經控制列進行。
 document.addEventListener('click',e=>{if(!read()||e.target.closest('#sceneTestBar'))return;const a=e.target.closest('a[href]');if(a){e.preventDefault();e.stopImmediatePropagation();holdNavigation(a.textContent.trim()||a.getAttribute('href'));}},true);
 document.addEventListener('DOMContentLoaded',()=>{
  const r=read();
  if(!r&&['共用室內場景預覽.html','徐州城內城預覽.html'].some(p=>decodeURIComponent(location.pathname).endsWith('/'+p))){const link=document.createElement('a');link.href='場景重測.html';link.textContent='場景劇情測試／電子攻略';link.style.cssText='display:inline-block;margin:8px;padding:6px 12px;background:#724b3a;color:#fff8e8;border-radius:6px';(document.querySelector('header')||document.body).append(link);}
  if(!r||window.GameAudioShell||decodeURIComponent(location.pathname).endsWith('/index.html'))return;
  const style=document.createElement('style');style.textContent='.scene-guide-test>header a,.scene-guide-test>.story>header a{display:none}#sceneTestBar{flex-shrink:0;position:relative;z-index:100;background:#f4ecd7;color:#294236;border-bottom:2px solid #897456;padding:8px;font:14px sans-serif;max-height:40dvh;overflow:auto}#sceneTestBar .test-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}#sceneTestBar button,#sceneTestBar select{font:inherit;max-width:100%;padding:6px;border:1px solid #a69a7b;border-radius:5px;background:#fffaf0;color:#294236}#sceneTestBar details{margin-top:6px}#sceneTestBar summary{cursor:pointer}#sceneTestBar label{display:inline-flex;gap:4px;align-items:center;margin:6px}#sceneTestNotice{margin:5px 0 0;font-size:12px;line-height:1.5}';document.head.append(style);
  const bar=document.createElement('aside');bar.id='sceneTestBar';
  bar.innerHTML='<div class="test-row"><strong>場景劇情測試</strong><select id="sceneTestSelect" aria-label="選擇測試場景"></select><button id="sceneTestReset">恢復初始值</button><button id="sceneTestExit">返回圖鑑</button></div><details><summary>場景道具取得／事件條件</summary><div id="sceneTestItems"></div><label>事件階段 <select id="sceneTestStage"></select></label><label><input type="checkbox" id="sceneTestParty">關羽、張飛同行</label><label><input type="checkbox" id="sceneTestOath">已桃園結義</label><label><input type="checkbox" id="sceneTestDream">已觸發夢輪迴</label><button id="sceneTestApply">套用條件</button><p>套用後結束當前對話，點人物卡測試分支；不會修改正式遊戲。</p></details><p id="sceneTestNotice" role="status">點人物／事件卡展開劇情；出口只提示去向，不離開此圖。所有獎勵僅供測試。</p>';
  document.body.classList.add('scene-guide-test');document.body.prepend(bar);
  const select=document.getElementById('sceneTestSelect');for(const [id,route] of Object.entries(routes)){const o=new Option(route.group+'・'+route.name,id);select.add(o);}select.value=r.id;select.onchange=()=>start(select.value);
  document.getElementById('sceneTestReset').onclick=()=>{if(confirm('恢復此場景初始狀態？測試道具與事件進度將清除，正式遊戲不受影響。'))start(r.id);};
  document.getElementById('sceneTestExit').onclick=()=>{const record=read();record.exiting=true;put(recordKey,JSON.stringify(record));window.top.location.href='場景重測.html?back=guide';};
  for(const [id,label,key,path] of items){const wrap=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.id='scene-item-'+id;check.checked=!!getPath(storeObject(key),path);wrap.append(check,document.createTextNode(label));document.getElementById('sceneTestItems').append(wrap);}
  for(const [id,label,itemId] of equipmentItems){const wrap=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.id='scene-item-'+id;check.checked=!!storeObject(mainKey).equipment?.story?.items?.some(i=>i.id===itemId);wrap.append(check,document.createTextNode(label));document.getElementById('sceneTestItems').append(wrap);}
  const stageSelect=document.getElementById('sceneTestStage');for(const [id,label] of stages[current().engine])stageSelect.add(new Option(label,id));stageSelect.value=r.stage||'initial';
  document.getElementById('sceneTestParty').checked=storeObject(villageKey).party?.length===2;
  document.getElementById('sceneTestOath').checked=!!storeObject(mainKey).storyEvents?.peachOath;
  document.getElementById('sceneTestDream').checked=!!storeObject(mainKey).storyEvents?.dreamReincarnationTriggered;
  document.getElementById('sceneTestApply').onclick=applyConditions;
 });
})();
