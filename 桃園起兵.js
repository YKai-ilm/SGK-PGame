'use strict';
(()=>{
 const $=id=>document.getElementById(id),key='three-kingdoms-taoyuan-dialogue-v1';
 // 原創遊戲對白草稿；人物資料與美術分開，後續可增加居室及切換主視角。
 const talks={
  flowerSilent:[['小花','.......']],
  flowerFirst:[['小花','......']],
  flowerSecond:[['小花','.........']],
  flowerRequest:[['小花','............'],['小花','我的小兔不見了，剛才跟阿虎他們去樹林玩，回來時就沒看到了。'],['支線任務','尋找小花的小兔玩偶']],
  flowerWaiting:[['小花','我的小兔……你找到牠了嗎？']],
  flowerReturn:[['小花','您幫我找到了小兔呀！那我給您一根糖葫蘆，作為交換吧！'],['小花','謝謝您！']],
  flowerReward:[['支線完成','尋找小花的小兔玩偶。已交還小兔布偶，獲得糖葫蘆 ×1。']],
  flowerThanks:[['小花','謝謝您']],
  villageChief:[['村長','早些年，這裡還只有幾戶人家。大家沿著溪水種桃、開田，慢慢才聚成了村子。'],['村長','每逢春暖，村裡村外桃花盛開，大夥便喚這裡作桃源村，盼著能安安穩穩過日子。'],['村長','唉，我那孫女小花，今日出去玩了一趟，回來後便悶悶不樂。'],['村長','問她怎麼了，她也不肯好好說。你若找她講話，可得有些耐心。']],
  villageChiefAfter:[['村長','今天天氣不錯，應該要出去走走，曬個太陽。']],
  goldFound:[['發現隱藏道具','獲得金項鍊。'],['金項鍊','飾品裝備，已收入背包。']],
  elder:[['老翁','千古殘局啊！不知誰能解開...']],
  woodcutter:[['老樵夫','唉，我老婆把首飾弄丟了，這幾日總惦記著。'],['老樵夫','好端端的一條金項鍊，也不知掉到哪兒去了。']],
  woodcutterReminder:[['老樵夫','老婆那條金項鍊還沒找著，真叫人發愁。']],
  woodcutterAfter:[['老樵夫','砍柴要看木紋，走路要看腳下。山裡做活，可急不得。']],
  waterOnly:[['獲得道具','取得一桶水。']],
  waterJewelry:[['獲得道具','取得一桶水。'],['劉備','咦！'],['劉備','水桶裡似乎有東西……'],['發現首飾','獲得金項鍊。這莫非就是老樵夫妻子遺失的首飾？'],['支線完成','樵夫老婆的首飾。金項鍊已收入背包。']],
  rabbitFound:[['發現隱藏道具','獲得小兔布偶。'],['小兔布偶','桃源村村長的孫女小花的玩偶。']],
  mother:[['劉母','玄德，草鞋都編好了嗎？'],['劉備','已經好了。孩兒正想拿到村裡去賣。'],['劉母','聽說村中貼了招募義勇的榜文。'],['劉母','你若有心幫人，也要記得保重自己。'],['劉備','母親放心，孩兒去看看便回。']],
  motherRest:[['劉母','吾兒，出門征戰辛苦了。帶同伴們在家歇息一晚，養足精神再出發。'],['劉備','多謝母親，今晚便在家中歇下。']],
  motherRested:[['休息一晚','天色漸明，全隊士氣恢復至100。']],
  motherAfter:[['劉母','快去吧，吾兒。']],
  rescueReturn:[['鄉民','多謝三位義士！我們終於能回家了。'],['劉備','鄉親們平安便好，快回村與家人團聚吧。'],['提示','可以掃蕩賊寇，累計勝利10次後，回劉母家辭行。先前已完成的掃蕩次數也會計入。']],
  motherRescueWaiting:[['劉母','聽說你們把鄉親救回來了，為娘也就放心了。'],['劉母','鄉間尚有賊寇出沒。你們再巡護一番，待準備妥當，回家與我說一聲再走。'],['提示','掃蕩賊寇累計勝利10次後，可回劉母家正式辭行。']],
  motherJourneyFarewell:[['劉備','母親，受困的鄉親已平安歸來，鄉間賊寇也已巡剿。孩兒想前往徐州，繼續為百姓出一份力。'],['劉母','你肯救人護鄉，為娘心中欣慰。只是天下路遠，行事須多思量，莫只憑一時意氣。'],['劉備','孩兒謹記。既與雲長、翼德結為兄弟，往後自當同心相扶。'],['劉母','遇事彼此照應，餓了記得吃飯，累了便歇歇。家門一直為你留著。'],['劉母','這裡有木劍、短木刀和木槍，帶去供新兵練習，也算為娘的一點心意。'],['劉備','多謝母親。孩兒定妥善使用，也不忘您的教誨。'],['劉母','去吧，吾兒。願你此行護得百姓，也護得自己平安。']],
  motherJourneyAfter:[['劉母','去吧！']],
  motherJourneyGift:[['劉母','還有這三件木製兵器，帶去供新兵練習。出門在外，凡事多加小心。'],['劉備','多謝母親，孩兒收下了。']],
  motherJourneyReward:[['餞行贈禮','獲得新兵木劍、新兵短木刀、新兵木槍，各一件，已收入背包。']],
  motherFarewell:[['劉母','路上小心，不求快但求平安。']],
  banquet:[['張飛','二位既有護鄉之志，今日便在俺家吃杯酒，再商議招集義勇的事！'],['劉備','多謝翼德相邀。能與二位同心護民，備心中甚慰。'],['關羽','只要志向相同，關某願與二位並肩而行。'],['張飛','談了這許久，還未敘過年歲。二位年歲幾何？'],['旁白','三人敘過年歲，劉備居長，關羽次之，張飛最幼。'],['張飛','雖非同姓，卻是一般志向。何不結為兄弟，往後一同扶危救困？'],['劉備','二位若不嫌棄，備願與二位結為兄弟，同心護民。'],['關羽','關某亦有此意。'],['張飛','莊後有片桃園，正好請天地作證。二位吃罷酒，便一同前去！']],
  banquetAfter:[['張飛','莊後桃園已備妥，咱們一道前去，請天地作證。']],
  banquetDone:[['張飛','大哥、二哥，得閒便回來坐坐。咱們兄弟再好好吃杯酒！']],
  oath:[['張飛','莊後桃花正盛，今日便請天地作證！'],['劉備','備與二位志同道合，願結為兄弟，同心護民。'],['關羽','關某願與二位同生共死，患難相扶，絕不相負。'],['張飛','俺也一樣！往後有福同享，有難同當！'],['劉備','我等雖不同姓，既結為兄弟，當同心協力，扶危救困。'],['關羽','上報國家，下安黎庶。此心此志，天地可鑒。'],['張飛','不求同年同月同日生，但願同年同月同日死！'],['劉備','自今日起，你我便是兄弟。攜手出發，共護這一方百姓！']],
  villageAlarm:[['村民','不好了！村口來了幾個賊寇，鄉親們快避一避！'],['劉備','二弟、三弟，隨我去村口，先護住鄉親！'],['關羽','大哥放心。'],['張飛','休讓賊人傷了村民！']],
  villageDefenseAfter:[['村民','多虧三位相救！咱們桃源村是桃源鄉的主村莊，鄉裡還有許多小村。'],['村民','這夥賊寇已騷擾了兩三個村莊，還擄走一些鄉民。他們至今未回，也不知如何了……'],['村民','有人瞧見賊人帶著鄉親往村外森林去了。從村口出去，便能循路找去。'],['劉備','既知鄉親受難，豈能置之不理。我們這便往森林尋人。上陣前先整備妥當，務必護他們平安回家。']],
  oathReward:[['成就達成','桃園三結義！可至主城成就領取鑽石2顆。']],
  self:[['劉備','先向母親道別，再去村中看看。']],
  board:[['榜文','招募義勇，共護鄉里。'],['榜文','願出力者，可於村中相聚商議。'],['劉備','百姓受苦，我豈能袖手旁觀？']],
  guan:[['關羽','這榜文，你也看過了？'],['劉備','在下劉備。有心為鄉里出力，只恨力量單薄。'],['關羽','關羽，字雲長。若為護民，關某願盡一份力。'],['關羽','關某願與您一同守護鄉里。'],['關羽','可否加入您的隊伍？']],
  guanJoined:[['隊伍','關羽已加入您的隊伍']],
  zhang:[['張飛','俺叫張飛，字翼德。方才聽你說要招集義勇？'],['劉備','在下劉備。如今鄉里不安，我想與有志之士一同護民。'],['張飛','好！俺有一身力氣，正愁無處使！'],['張飛','店裡已交代妥當，俺也願出一份力。'],['張飛','可否加入您的隊伍？']],
  zhangJoined:[['隊伍','張飛已加入您的隊伍']],
  merchant:[['張世平','在下張世平，與同鄉蘇雙販馬，常往來涿郡。'],['劉備','久仰。如今百姓受苦，備有心招集義勇，卻苦於軍資不足。'],['張世平','我看足下志氣不凡，又肯為鄉里出力，願以資財相助。'],['劉備','得先生相助，便能招集人眾、籌備糧秣。備感激不盡！'],['張世平','這些黃金與軍糧兌換卡，請收下。願足下護得百姓平安。']],
  merchantAfter:[['張世平','祝將軍馬到成功']],
  merchantReward:[['獲得軍資','黃金200、軍糧兌換卡一張。'],['軍糧兌換卡','戰鬥中使用後消失，立即增加該場軍糧200。'],['成就達成','三國人生啟動資助！可至主城成就領取鑽石2顆。']],
  meat:[['肉舖商','客官，今日的肉新鮮，要買些嗎？'],['劉備','我想打聽招募義勇的事，可有人願意出力？'],['肉舖商','我家張爺最是熱心，待我喚他一聲。'],['張飛','你且替俺看店，把這些肉收拾好。'],['肉舖商','張爺放心，這裡交給小的。']],
  meatAfter:[['肉舖商','張爺已把舖子交給我照料，客官有何需要？']],
  flower:[['花商','桃花開了，村子也添了幾分精神。'],['花商','右邊小路通村東，那頭還有幾戶人家。']],
  fruit:[['水果商','趕路前歇一歇，別餓著肚子。'],['水果商','井邊新貼了榜，你可曾看見？']],
  grain:[['糧商','人要吃飯，隊伍也得備糧。'],['糧商','真要遠行，可不能只顧兵器忘了糧袋。']],
  horse:[['馬商','好馬要養，也要懂得照料。'],['馬商','村裡偶有商旅歇腳，馬匹也要在此休息飲水。']],

 };
 const hiddenStoryNPCs=new Set();
 const village=[['桃園',76,18,12,3.6,'oath'],['劉備家',36.5,16,14,5,'home'],['肉舖商',35,36.5,15,5,'meat'],['張飛',15,39,11.5,3.6,'zhang'],['花商',71,36,15,5,'flower'],['村東',90,35,9,4,'east'],['水果商',27,54,16,5,'fruit'],['糧商',74.5,54,15,5,'grain'],['公告欄',44,49.5,17,12,'board'],['關羽',51,58,12,3.6,'guan'],['張世平',32,69.5,13.5,3.6,'merchant'],['馬商',68.5,72,15,5,'horse'],['村西',6,71.5,10,4,'west'],['守衛村莊',49,78.5,18,5,'defendVillage'],['離開',49,93.5,14,5,'leave']];
 let state={scene:'home',viewpoint:'劉備',seen:[],active:null,guanRevealed:false,zhangRevealed:false,party:[]},timer=null,autoTimer=null,full='',typed=false,origin=null;
 function stopTimers(){clearInterval(timer);clearTimeout(autoTimer);}
 try{const s=JSON.parse(localStorage.getItem(key));if(s){state.guanRevealed=s.guanRevealed===true;state.zhangRevealed=s.zhangRevealed===true;state.party=Array.isArray(s.party)?[...new Set(s.party.filter(n=>['關羽','張飛'].includes(n)))]:[];state.scene=['village','east','west','chiefHome','zhangHome'].includes(s.scene)?s.scene:'home';state.seen=Array.isArray(s.seen)?s.seen.filter(x=>Object.hasOwn(talks,x)):[];if(s.active&&Object.hasOwn(talks,s.active.id)&&Number.isInteger(s.active.line)&&s.active.line>=0&&s.active.line<talks[s.active.id].length)state.active={id:s.active.id,line:s.active.line,recordId:typeof s.active.recordId==='string'?s.active.recordId:null};}}catch{}
 try{if(JSON.parse(localStorage.getItem(StorySupplies.key)||'{}').storyEvents?.peachOath&&!state.seen.includes('oath'))state.seen.push('oath');}catch{}
 const recruits={guan:{name:'關羽',flag:'guanRevealed'},zhang:{name:'張飛',flag:'zhangRevealed'}};
 function npcVisible(id){if(id==='defendVillage')return VillageDefense.eligible()&&!VillageDefense.completed();const both=state.party.includes('關羽')&&state.party.includes('張飛');if(id==='zhangHome')return true;if(['banquet','banquetAfter','banquetDone'].includes(id))return both&&!state.seen.includes('banquet')&&!state.seen.includes('oath');if(id==='oath')return both&&state.seen.includes('banquet')&&!state.seen.includes('oath');if(id==='merchant'){const ready=state.seen.includes('grain')&&state.seen.includes('horse');try{return StorySupplies.merchantKnown(ready);}catch{$('saveWarning').hidden=false;return ready;}}const r=recruits[id];return !r||(state[r.flag]&&!state.party.includes(r.name));}
 function isChoice(){return !!recruits[state.active?.id]&&state.active.line===talks[state.active.id].length-1;}
 function save(){if(window.SceneTest?.active())state.scene=SceneTest.current().scene;try{localStorage.setItem(key,JSON.stringify(state));}catch{$('saveWarning').hidden=false;}}
 const recallKey=key+'-recall';let history=[],resumeRecall=false;
 try{const h=JSON.parse(localStorage.getItem(recallKey)||'[]');if(Array.isArray(h))history=h.filter(r=>r&&typeof r.id==='string'&&Array.isArray(r.lines)&&r.lines.every(l=>typeof l.speaker==='string'&&typeof l.text==='string'));}catch{}
 // 舊版只保存完成旗標；僅補回確定已完成的段落，不推測未播放分支。
 try{if(localStorage.getItem(recallKey)===null){for(const id of state.seen){if(!talks[id])continue;history.push({id:'legacy-'+id,scene:id.startsWith('mother')?'劉備家':'桃園村',legacy:true,at:Date.now(),lines:talks[id].map(([speaker,text],index)=>({speaker,text,index}))});}localStorage.setItem(recallKey,JSON.stringify(history));}}catch{}
 function recordLine(speaker,text,index){
  if(!state.active)return;
  let record=history.find(r=>r.id===state.active.recordId);
  if(!record){record={id:crypto.randomUUID(),scene:({home:'劉備家',east:'桃源村東',west:'桃源村西',chiefHome:'村長家',zhangHome:'張飛家'}[state.scene]||'桃園村'),at:Date.now(),lines:[]};history.push(record);state.active.recordId=record.id;}
  if(!record.lines.some(l=>l.index===index))record.lines.push({index,speaker,text});
  try{localStorage.setItem(recallKey,JSON.stringify(history));}catch{$('saveWarning').hidden=false;}save();
 }
 function renderRecall(){
  const q=$('recallSearch').value.trim();$('recallBody').replaceChildren();
  for(const r of [...history].reverse()){
   if(q&&!r.lines.some(l=>l.speaker.includes(q)||l.text.includes(q))&&!String(r.scene).includes(q))continue;
   const section=document.createElement('section'),title=document.createElement('h3');title.textContent=(r.scene||'先前對話')+' · '+(r.legacy?'先前已完成的對話':new Date(r.at).toLocaleString('zh-TW'));section.append(title);
   for(const l of r.lines){const p=document.createElement('p'),name=document.createElement('b'),text=document.createElement('span');name.textContent=l.speaker+'：';text.textContent=l.text;p.append(name,text);section.append(p);}
   $('recallBody').append(section);
  }
  if(!$('recallBody').children.length){const p=document.createElement('p');p.textContent=q?'沒有符合的對話。':'尚無對話紀錄，之後播放的內容會保存在這裡。';$('recallBody').append(p);}
 }
 let resumeJournal=false;
 $('openVillageJournal').onclick=()=>{resumeJournal=!!state.active&&!$('dialogue').hidden;stopTimers();const body=$('journalBody');body.replaceChildren();function entry(title,text){const h=document.createElement('h3'),p=document.createElement('p');h.textContent=title;p.textContent=text;body.append(h,p);}try{const f=VillageHiddenItems.flowerQuest(),w=VillageWestLoot.quest();if(f==='searching')entry('尋找小花的小兔玩偶',VillageHiddenItems.owned()?'已找到小兔布偶，帶回村長家交給小花。':'小花和阿虎他們去樹林玩後遺失玩偶，去村東找找。');if(f==='completed')entry('尋找小花的小兔玩偶 · 已完成','已交還玩偶，小花贈送糖葫蘆一個。');if(w==='searching')entry('樵夫老婆的首飾','老樵夫抱怨妻子的金項鍊遺失了，可在村裡留意線索。');if(w==='completed')entry('樵夫老婆的首飾 · 已完成','在水井打水時發現金項鍊，已收入背包，無須交還。');if(f==='none'&&w==='none')entry('村中見聞','目前沒有接下的支線，可到村東、村西與村民交談。');const items=[];if(VillageHiddenItems.owned())items.push('小兔布偶 ×1');if(VillageHiddenItems.candyOwned())items.push('糖葫蘆 ×1');const profile=JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')||'{}');if(profile.storyItems?.waterBucket)items.push('一桶水');if(VillageWestLoot.hasNecklace())items.push('金項鍊（飾品）');if(items.length)entry('村中取得',items.join('、'));}catch{entry('讀取失敗','暫時無法讀取記事，請關閉後重試。');}$('villageJournal').showModal();};
 $('closeVillageJournal').onclick=()=>$('villageJournal').close();
 $('villageJournal').addEventListener('close',()=>{if(resumeJournal&&state.active&&!document.hidden)show();resumeJournal=false;});
 $('openRecall').onclick=()=>{resumeRecall=!!state.active&&!$('dialogue').hidden;stopTimers();$('recallSearch').value='';renderRecall();$('recall').showModal();$('recallBody').scrollTop=0;};
 $('closeRecall').onclick=()=>$('recall').close();$('recallSearch').oninput=renderRecall;
 $('recall').addEventListener('close',()=>{if(resumeRecall&&state.active&&!document.hidden)show();resumeRecall=false;});
 function render(){clearInterval(timer);$('dialogue').hidden=true;$('resume').hidden=!state.active;$('hotspots').inert=false;const home=state.scene==='home';$('place').textContent=home?'劉備家':'桃園村';$('backdrop').src=home?'劉備家居室-v1.png':'桃園村背景-無字牌-v1.png';$('backdrop').alt=home?'草屋居室，草鞋、矮桌與窗邊灶台':'桃園村，商舖、公告欄及村東村西小路';$('hint').textContent=home?'點劉母交談，或點離開前往村莊。':'點人物交談；點劉備家可回家。';$('hotspots').replaceChildren();
  if(state.scene==='east'){$('place').textContent='桃源村・村東';$('backdrop').src=VillageEastScene.image;$('backdrop').alt='桃花林、魚池、涼亭與伐木小屋';$('hint').textContent='點人物交談，沿小路可返回村莊。';}
  if(state.scene==='west'){$('place').textContent='桃源村・村西';$('backdrop').src=VillageWestScene.image;$('backdrop').alt='水井與曬布民房';$('hint').textContent='點村長家進入，沿路可返回村莊。';}
  if(state.scene==='chiefHome'){$('place').textContent='村長家';$('backdrop').src='村長家居室-v1.png';$('backdrop').alt='民居室內';$('hint').textContent='點村長或小花交談，或從下方離開返回村西。';}
  if(state.scene==='zhangHome'){$('place').textContent='張飛家';$('backdrop').src='張飛家居室-v1.png';$('backdrop').alt='張飛家，三面座椅的飯桌與酒食';$('hint').textContent=state.seen.includes('oath')?'飲宴已結束，可從門口返回村西。':state.seen.includes('banquet')?'吃罷酒，返回村莊前往桃園。':(npcVisible('banquet')?'與關羽、張飛一同吃酒敘談。':'屋內靜悄悄的，可從門口返回村西。');}
  const points=state.scene==='zhangHome'?[...(npcVisible('banquet')?[['劉備',50,25,12,3.6,'banquetLiu'],['關羽',24,40,12,3.6,'banquetGuan'],['張飛',77,40,12,3.6,'banquet']]:[]),['離開',50,92,12,3.6,'west']]:state.scene==='chiefHome'?[['村長',44,29,12,3.6,'villageChief'],['小花',23,53,12,3.6,'littleFlower'],['離開',50,87,12,3.6,'west']]:state.scene==='west'?VillageWestScene.points:state.scene==='east'?VillageEastScene.points.filter(p=>p[5]!=='rabbitTree'||!VillageHiddenItems.claimed()):home?[['劉母',29,21,12,3.6,'mother'],['離開',50,87,11,2.8,'village']]:village.filter(p=>!hiddenStoryNPCs.has(p[5])&&npcVisible(p[5]));
  for(const [name,x,y,w,h,id]of points){
   const b=document.createElement('button'),sign=!['board','rabbitTree','goldWell'].includes(id),exit=['home','village','east','west','leave','oath','chiefHome','zhangHome','defendVillage'].includes(id),story=CharacterCardStyle.isHistorical(name);
   b.className='hotspot'+(sign?' scene-sign '+(exit?'sign-exit':story?'sign-story':'sign-common'):'')+(!home&&story?' story-npc':'');
   b.style.cssText=`left:${x}%;top:${y}%;width:${sign?(name.length>2?13.5:12):w}%;height:${sign?3.6:h}%`;
   b.setAttribute('aria-label',name);b.dataset.id=id;
   if(sign){const label=document.createElement('span');label.textContent=name;b.append(label);}
   b.onclick=()=>{origin=b;if(['home','village','east','west','chiefHome','zhangHome','leave','defendVillage'].includes(id)&&window.SceneTest?.holdNavigation(name))return;if(['home','village','east','west','chiefHome','zhangHome'].includes(id)){state.scene=id;state.active=null;save();render();$('place').setAttribute('tabindex','-1');$('place').focus();if(id==='zhangHome'&&npcVisible('banquet')&&!state.seen.includes('banquet')&&!state.seen.includes('oath'))start('banquet');}else start(id);};$('hotspots').append(b);
  }
  clearTimeout(autoTimer);
 }
 function start(id){if(id==='defendVillage'){if(!npcVisible(id))return;state.scene='village';state.active=null;save();if(!window.SceneTest?.holdNavigation('戰場直版.html?villageDefense=1&returnTo='+encodeURIComponent('桃園起兵.html')))location.href='戰場直版.html?villageDefense=1&returnTo='+encodeURIComponent('桃園起兵.html');return;}if(['banquetLiu','banquetGuan'].includes(id))id='banquet';if(id==='banquet'){if(state.scene!=='zhangHome'||!npcVisible('banquet'))return;if(state.seen.includes('oath'))id='banquetDone';else if(state.seen.includes('banquet'))id='banquetAfter';}if(id==='littleFlower'){try{const q=VillageHiddenItems.flowerQuest();if(q==='completed')id='flowerThanks';else if(!state.seen.includes('villageChief'))id='flowerSilent';else if(q==='searching')id=VillageHiddenItems.owned()?'flowerReturn':'flowerWaiting';else id=['flowerFirst','flowerSecond','flowerRequest'][VillageHiddenItems.flowerVisits()];}catch{$('saveWarning').hidden=false;return;}}if(id==='villageChief'&&state.seen.includes('villageChief'))id='villageChiefAfter';if(id==='goldWell'){stopTimers();$('wellMenu').showModal();return;}if(id==='woodcutter'){const q=VillageWestLoot.quest();if(q==='completed')id='woodcutterAfter';else if(q==='searching')id='woodcutterReminder';}if(id==='rabbitTree'){try{if(!VillageHiddenItems.claim())return;render();id='rabbitFound';}catch{$('saveWarning').hidden=false;return;}}if(id==='leave'){openVillageExit();return;}if(id==='oath'&&state.active?.id==='oath'){show();return;}if(id==='mother'){if(StorySupplies.farewellClaimed())id='motherJourneyAfter';else if(VillageDefense.rescueCompleted()){id=VillageJourney.status().wins>=10?(state.seen.includes('motherJourneyFarewell')?'motherJourneyGift':'motherJourneyFarewell'):'motherRescueWaiting';}else if(state.party.includes('關羽'))id='motherFarewell';else if(state.seen.includes('mother'))id='motherAfter';}if(hiddenStoryNPCs.has(id)||!npcVisible(id))return;if(id==='board'){state.guanRevealed=true;render();}if(id==='merchant'&&StorySupplies.claimed())id='merchantAfter';if(id==='meat'&&state.zhangRevealed)id='meatAfter';state.active={id,line:0};save();show();}
 $('wellLeave').onclick=()=>$('wellMenu').close();
 $('drawWater').onclick=()=>{try{const found=VillageWestLoot.drawWater();$('wellMenu').close();start(found?'waterJewelry':'waterOnly');}catch{$('saveWarning').hidden=false;}};
 function openVillageExit(){stopTimers();$('rescueVillagers').hidden=!(VillageDefense.rescueEligible()&&!VillageDefense.rescueCompleted());const p=VillageJourney.status();$('goXuzhou').textContent='前往徐州城'+(p.visited?'':'（滅敵 '+Math.min(10,p.wins)+'/10）');$('goXuzhou').disabled=!p.unlocked;$('villageExit').showModal();}
 $('rescueVillagers').onclick=()=>{if(!VillageDefense.rescueEligible()||VillageDefense.rescueCompleted())return;state.scene='village';state.active=null;save();if(!window.SceneTest?.holdNavigation('戰場直版.html?villageRescue=1&returnTo='+encodeURIComponent('桃園起兵.html')))location.href='戰場直版.html?villageRescue=1&returnTo='+encodeURIComponent('桃園起兵.html');};
 $('closeExit').onclick=()=>$('villageExit').close();
 $('startSweep').onclick=()=>{state.scene='village';state.active=null;save();if(!window.SceneTest?.holdNavigation('戰場直版.html?storySweep=1&returnTo='+encodeURIComponent('桃園起兵.html')))location.href='戰場直版.html?storySweep=1&returnTo='+encodeURIComponent('桃園起兵.html');};
 $('goXuzhou').onclick=()=>{if(!VillageJourney.status().unlocked)return;state.scene='village';state.active=null;save();if(!window.SceneTest?.holdNavigation('徐州城入口.html'))location.href='徐州城入口.html';};
 window.addEventListener('storage',e=>{if(e.key===VillageJourney.key&&$('villageExit').open){const p=VillageJourney.status();$('goXuzhou').disabled=!p.unlocked;$('goXuzhou').textContent='前往徐州城'+(p.visited?'':'（滅敵 '+Math.min(10,p.wins)+'/10）');}});
 function showOathCards(){
  $('oathCast')?.remove();if(state.active?.id!=='oath')return;
  document.querySelector('[data-id="oath"]')?.remove();
  const cast=document.createElement('div');cast.id='oathCast';cast.setAttribute('aria-label','桃園結義三兄弟');
  for(const [name,x]of [['關羽',60],['劉備',75],['張飛',90]]){const card=document.createElement('div');card.className='hotspot scene-sign sign-story story-npc oath-card';card.style.cssText=`left:${x}%;top:22%;width:12%;height:3.6%`;const label=document.createElement('span');label.textContent=name;card.append(label);cast.append(card);}
  $('hotspots').append(cast);
 }
 function flowerPause(){const a=state.active;if(a?.line!==0)return null;return ({flowerSilent:1000,flowerFirst:1000,flowerSecond:1500,flowerRequest:2000})[a.id]??null;}
 function finishTyping(){clearInterval(timer);clearTimeout(autoTimer);$('line').textContent=full;typed=true;recordLine($('speaker').textContent,full,state.active.line);$('nextLine').textContent=state.active.line===talks[state.active.id].length-1?'結束對話':'下一句 ▾';if(isChoice()){$('nextLine').hidden=true;$('joinChoices').hidden=false;$('joinYes').focus();return;}if(!document.hidden)autoTimer=setTimeout(advance,flowerPause()??Math.max(1600,Array.from(full).length*85));}
 function show(){stopTimers();if(!state.active||$('recall').open||$('villageJournal').open)return;const a=state.active,lines=talks[a.id],auto=true;$('joinChoices').hidden=true;$('dialogue').hidden=false;showOathCards();$('resume').hidden=true;$('hotspots').inert=true;$('speaker').textContent=lines[a.line][0];full=lines[a.line][1];$('line').textContent='';$('lineCount').textContent=(a.line+1)+' / '+lines.length+(auto?' · 自動播放':'');typed=false;$('nextLine').hidden=auto;$('nextLine').textContent='顯示本句';(auto?$('closeTalk'):$('nextLine')).focus();let i=0;const letters=Array.from(full);if(document.hidden)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)finishTyping();else timer=setInterval(()=>{$('line').textContent+=letters[i++];if(i>=letters.length)finishTyping();},flowerPause()!==null?180:40);}
 function close(){stopTimers();$('dialogue').hidden=true;$('hotspots').inert=false;$('resume').hidden=!state.active;origin?.focus();if(state.active?.id==='oath'){render();}}
 function advance(){if(!state.active||$('dialogue').hidden||document.hidden||$('recall').open||$('villageJournal').open)return;if(!typed){finishTyping();return;}if(isChoice())return;const a=state.active;if(a.line+1<talks[a.id].length){a.line++;save();show();}else{try{if(a.id==='flowerFirst')VillageHiddenItems.finishFlowerVisit(1);if(a.id==='flowerSecond')VillageHiddenItems.finishFlowerVisit(2);if(a.id==='flowerRequest')VillageHiddenItems.acceptFlower();if(a.id==='flowerReturn'){const granted=VillageHiddenItems.returnRabbit();state.active={id:granted?'flowerReward':'flowerThanks',line:0};save();show();return;}}catch{$('saveWarning').hidden=false;return;}if(a.id==='oath'){try{StorySupplies.completeOath();}catch{$('line').textContent='結義進度尚未保存，請重試。';$('nextLine').textContent='重試保存';$('nextLine').hidden=false;return;}if(!state.seen.includes('oath'))state.seen.push('oath');state.active={id:'oathReward',line:0};save();render();show();return;}if(['motherJourneyFarewell','motherJourneyGift'].includes(a.id)){try{const granted=StorySupplies.grantFarewell();if(!state.seen.includes(a.id))state.seen.push(a.id);state.active={id:granted?'motherJourneyReward':'motherJourneyAfter',line:0};save();show();return;}catch{$('line').textContent='餞行獎勵尚未保存，請重試。';$('nextLine').textContent='重試保存';$('nextLine').hidden=false;return;}}if(!state.seen.includes(a.id))state.seen.push(a.id);if(a.id==='merchant'){try{StorySupplies.grant();}catch{$('line').textContent='軍資尚未保存成功，請稍後重試。';$('nextLine').hidden=false;return;}state.active={id:'merchantReward',line:0};save();show();return;}if(['mother','motherAfter','motherFarewell','motherRescueWaiting'].includes(a.id)&&StoryMorale.canHomeRest()){state.active={id:'motherRest',line:0};save();show();return;}if(a.id==='motherRest'){try{if(StoryMorale.restAtHome()){state.active={id:'motherRested',line:0};save();show();return;}}catch{$('line').textContent='休息進度尚未保存，請重試。';$('nextLine').hidden=false;return;}}if(a.id==='woodcutter'){try{VillageWestLoot.accept();}catch{$('saveWarning').hidden=false;return;}}if(a.id==='oathReward'&&!state.seen.includes('villageAlarm')){state.scene='village';state.active={id:'villageAlarm',line:0};save();render();show();return;}const reveal=['meat','grain','horse','banquet','banquetAfter','banquetDone'].includes(a.id);if(a.id==='meat')state.zhangRevealed=true;state.active=null;save();close();if(reveal)render();if(a.id==='banquet')$('hint').textContent='已與關羽、張飛約定結拜。離開張飛家後，前往桃園。';}}
 document.addEventListener('click',e=>{if(e.target.closest('#sceneTestBar'))return;if(!state.active||$('dialogue').hidden||document.querySelector('dialog[open]'))return;if(e.target.closest('#dialogue button,#dialogue a,#dialogue input,#dialogue select'))return;e.preventDefault();e.stopImmediatePropagation();advance();},true);
 $('nextLine').onclick=advance;
 $('joinYes').onclick=()=>{if(!isChoice()||!typed)return;stopTimers();recordLine('選擇','是，邀請'+recruits[state.active.id].name+'加入隊伍。','choice');const id=state.active.id,name=recruits[id].name;if(!state.party.includes(name))state.party.push(name);state.active={id:id+'Joined',line:0};save();render();show();};
 $('joinNo').onclick=()=>{if(!isChoice()||!typed)return;recordLine('選擇','否，暫不邀請入隊。','choice');state.active=null;save();close();};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTimers();else if(state.active&&!$('dialogue').hidden)show();});
 $('closeTalk').onclick=close;$('resume').onclick=show;
 $('restart').onclick=()=>{state={scene:'home',viewpoint:'劉備',seen:[],active:null,guanRevealed:false,zhangRevealed:false,party:[]};save();render();};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('recall').open&&!$('dialogue').hidden){e.preventDefault();close();}});
 if(state.active&&(hiddenStoryNPCs.has(state.active.id)||!npcVisible(state.active.id))){state.active=null;save();}
 if(!state.active&&VillageDefense.rescueCompleted()&&!state.seen.includes('rescueReturn')){state.scene='village';state.active={id:'rescueReturn',line:0};save();}else if(!state.active&&VillageDefense.completed()&&!state.seen.includes('villageDefenseAfter')){state.scene='village';state.active={id:'villageDefenseAfter',line:0};save();}else if(!state.active&&VillageDefense.eligible()&&!VillageDefense.completed()&&!state.seen.includes('villageAlarm')){state.scene='village';state.active={id:'villageAlarm',line:0};save();}render();if(state.active)show();else if(!window.SceneTest?.active()&&state.scene==='zhangHome'&&npcVisible('banquet')&&!state.seen.includes('banquet')&&!state.seen.includes('oath'))start('banquet');
})();








