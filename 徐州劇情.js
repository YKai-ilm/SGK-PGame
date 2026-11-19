'use strict';
(()=>{
 const $=id=>document.getElementById(id),key='three-kingdoms-xuzhou-story-v1';
 // Normalize legacy family names while keeping all saved quest progress.
 const read=()=>JSON.parse((localStorage.getItem(key)||'{}').replace(/\u9761/g,'\u7cdc'));
 let state={scene:'內城',flags:{},history:[],active:null,...read()},timer=null,busy=false;
 const party=()=>{try{return JSON.parse(localStorage.getItem('three-kingdoms-taoyuan-dialogue-v1')||'{}').party||[];}catch{return [];}};
 const sworn=()=>{try{return !!JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')||'{}').storyEvents?.peachOath||JSON.parse(localStorage.getItem('three-kingdoms-taoyuan-dialogue-v1')||'{}').seen?.includes('oath');}catch{return false;}};
 const address=()=>party().length===0?'壯士':party().length===1?'二位':'諸位';
 const houses={曹豹家:{image:'曹豹家居室-v1.png',points:[['曹豹',33,24.5,'caobao']]},糜家:{image:'糜家居室-v1.png',points:[['糜太公',46,25,'miElder'],['糜芳',25,30,'miFang'],['糜貞',79,51,'miZhen']]},藥師家:{image:'藥師家居室-v1.png',points:[['藥童',76,40,'apprentice']]}};
 const city=[['城主府',57,17.5],['役所',22,92],['驛站',10,29],['客棧',35,35],['酒樓',80,35],['武器店',33,54.5],['防具店',80,54.5],['訓練店',26,72],['編輯所',80,69.5],['道具店',78,86.5],['城西',8.5,39]];
 function save(){localStorage.setItem(key,JSON.stringify(state));$('saveWarning').hidden=true;}
 function protect(fn){try{fn();}catch(e){console.error(e);$('saveWarning').hidden=false;}}
 function stop(){clearTimeout(timer);}
 function menu(title,text,choices){stop();$('menuTitle').textContent=title;$('menuText').textContent=text;$('menuButtons').replaceChildren();for(const [label,fn,disabled]of choices){const b=document.createElement('button');b.textContent=label;b.disabled=!!disabled;b.onclick=()=>protect(()=>{$('menu').close();fn();});$('menuButtons').append(b);}$('menu').showModal();}
 const notice=text=>menu('提示',text,[['關閉',()=>{}]]);
 function go(scene){if(window.SceneTest?.holdNavigation(scene))return;if(busy)return;stop();state.scene=scene;state.active=null;save();render();}
 function render(){stop();$('dialogue').hidden=true;$('resume').hidden=!state.active;$('hotspots').inert=false;$('hotspots').replaceChildren();$('place').textContent=state.scene==='內城'?'徐州城':state.scene==='城西'?'徐州城西':state.scene;let image,points=[];
  if(state.scene==='內城'){image='徐州城內城-v3-王宮役所對調.png';points=city.map(([n,x,y])=>[n,x,y,()=>go(n)]);points.push(['離開',48,96,exitCity]);}
  else if(state.scene==='城西'){const c=XuzhouNpcPlacement['城西'];image=c.image;points.push([c.npc,c.npcX,c.npcY,()=>npc('steward')],['回內城',c.exitX,c.exitY,()=>go('內城')]);for(const p of c.places||[]){if(p.hidden)continue;points.push([p.name,p.x,p.y,()=>houses[p.name]?go(p.name):notice('此處尚未開放。')]);}}
  else if(houses[state.scene]){const h=houses[state.scene];image=h.image;points=h.points.map(([n,x,y,id])=>[n,x,y,()=>npc(id)]);if(state.scene==='藥師家'&&YunlongRescue.progress().completed)points.push(['華陀',42,24,'returnedHuatuo'].map((v,i)=>i===3?()=>npc(v):v));points.push(['離開',50,89,()=>go('城西')]);}
  else {const id=state.scene==='城主府'?'城主府一':state.scene;const base=SharedInteriorScenes.find(s=>s.id===id),c=XuzhouNpcPlacement[id];if(!base||!c){state.scene='內城';save();render();return;}image=base.image;points=[[c.npc,c.npcX??base.npcX,c.npcY??base.npcY,()=>npc(id)],['離開',base.exitX,base.exitY,()=>go('內城')]];}
  $('backdrop').src=image;$('backdrop').alt=state.scene;for(const [name,x,y,fn]of points){const b=document.createElement('button');b.className='hotspot scene-sign '+(CharacterCardStyle.isHistorical(name)?'sign-story':['離開','回內城'].includes(name)?'sign-exit':'sign-common');b.style.cssText=`left:${x}%;top:${y}%;width:${name.length>2?13.5:12}%`;b.dataset.name=name;const span=document.createElement('span');span.textContent=name;b.append(span);b.onclick=()=>protect(fn);$('hotspots').append(b);}
 }
 function talk(lines,action=null){state.active={lines,index:0,action,recorded:[],visitors:action==='miZhenAwaitingMarriage'?party().slice():undefined};save();show();}
 function show(){stop();if(!state.active||document.hidden||$('history').open)return;const a=state.active,[speaker,line]=a.lines[a.index];$('dialogue').hidden=false;$('resume').hidden=true;$('hotspots').inert=true;$('speaker').textContent=speaker;$('line').textContent=line;$('lineCount').textContent=`${a.index+1} / ${a.lines.length}`;$('nextLine').textContent=a.index===a.lines.length-1?'結束對話':'下一句';if(!a.recorded.includes(a.index)){state.history.push({speaker,line,scene:state.scene});a.recorded.push(a.index);save();}timer=setTimeout(()=>protect(next),Math.max(2200,[...line].length*100));}
 function next(){stop();if(!state.active||$('dialogue').hidden||$('history').open)return;const a=state.active;if(a.index<a.lines.length-1){a.index++;save();show();return;}finish(a.action);}
 function end(){state.active=null;save();$('dialogue').hidden=true;$('hotspots').inert=false;$('resume').hidden=true;}
 function finish(action){
  if(action==='huatuoGift'){YunlongRescue.gift();end();notice('取得青囊書（殘）×1。可在武將裝備的飾品格裝備。');return;}
  if(action==='miElderHeard')state.flags.miElderHeard=true;
  if(action==='miZhenAwaitingMarriage'){state.flags.miZhenAwaitingMarriage=true;state.flags.miZhenVisitors=state.active?.visitors||[];}
  if(action==='miMatchmakingDiscussed')state.flags.miMatchmakingDiscussed=true;
  if(action==='huatuo'){const result=VillageHiddenItems.completeHuatuo();if(!result&&!VillageHiddenItems.huatuoDone()){end();notice('身上已沒有糖葫蘆，尚未完成交付。');return;}}
  if(action==='clerk')state.flags.introduced=true;
  if(action==='steward')state.flags.steward=true;
  if(action==='missing')state.flags.missing=true;
  if(action==='apprenticeFirst')state.flags.apprenticeFirst=true;
  if(action==='sleep'){end();startStay(0);return;}
  end();
  if(action==='accept')menu('城西護糧','是否前往城西接應糧車？',[['願往接應',()=>{state.flags.accepted=true;save();}],['稍作準備',()=>{}]]);
  else if(action==='apprenticeSecond'&&VillageHiddenItems.candyOwned())huatuo();
  else if(action==='huatuo')notice('華陀初現：糖葫蘆 −1，茯苓草本膏 +1。已取得雲龍山線索，請前往尋訪華陀。');
  else if(action?.startsWith('service:'))service(action.slice(8));
 }
 function huatuo(){talk([['劉備','我這裡有隻糖葫蘆，很甜唷，送給您吧，再勞煩轉知華藥師，吾誠心來訪，恰逢藥師外出，未能見上一面實屬可惜！'],['藥童','好的，若藥師提早回來，我會轉知！不過你們也可以去城外南郊的雲龍山看看，藥師曾說那個地方的靈芝甚有靈性，此次應會去那邊採藥才是。']],'huatuo');}
 function npc(id){
  if(id==='returnedHuatuo'){if(!YunlongRescue.progress().completed)return;talk(YunlongRescue.progress().bookGiven?[['華陀','黃巾作亂，百姓多苦多難，也不知能救下多少人。']]:YunlongRescueDialogue.gift,YunlongRescue.progress().bookGiven?null:'huatuoGift');return;}
  if(id==='apprentice'){if(VillageHiddenItems.huatuoDone())talk([['藥童','我還有好多草藥要磨，何時才到頭呢？']]);else if(!state.flags.apprenticeFirst)talk([['藥童','華藥師外出採藥，通常要數週不等，爾等日後再來吧！我會轉達有客來訪。']],'apprenticeFirst');else talk([['藥童','每天都在這邊磨藥，吃的藥湯都是苦的，好想吃點甜的東西唷！']],'apprenticeSecond');return;}
  if(id==='caobao'){talk([['曹豹','現今世道黃巾猖獗，陶太守隨朝廷號召義勇兵，希望能盡快平定禍亂吧！']]);return;}
  const family=MiFamilyStory.npc(id,state.flags);if(family){talk(family.lines,family.action);return;}
  if(id==='城主府一'&&MiFamilyStory.canMatchmake(state.flags)){talk(MiFamilyStory.matchmaking({party:party(),sworn:sworn(),visitors:state.flags.miZhenVisitors||[]}), 'miMatchmakingDiscussed');return;}
  if(id==='城主府一'&&state.flags.miMatchmakingDiscussed){talk([['糜竺','回頭我就與老父親說說，讓您二人多相處些時日。']]);return;}
  if(id==='役所'){if(!state.flags.introduced)talk([['書吏',`${address()}可是前來應募的義勇？`],['劉備','在下劉備，曾與鄉里義士討賊。聞徐州招募義勇，特來相詢。'],['書吏',`近來城西糧車屢遭襲擾，百姓往來也不安穩。糜別駕正在城主府料理此事，${address()}可前去拜見。`]],'clerk');else if(state.flags.slept&&!state.flags.missing)talk([['書吏','昨夜仍未等到護衛隊長回城，今早也沒有傳來消息。'],['書吏','前次運糧的護軍恐怕出了變故，還請往城西沿路查探。'],['劉備','人命攸關，我這便前去。']],'missing');else talk([['書吏',state.flags.missing?'護軍仍未回城，還請留意城西消息。':state.flags.steward?'先去客棧歇息，明日再來。':state.flags.accepted?'糧隊管事在城西糧車旁。':'糜別駕在城主府，請前去拜見。']]);return;}
  if(id==='城主府一'){if(!state.flags.introduced){talk([['門吏','請先到役所通報，再來拜見糜別駕。']]);return;}if(state.flags.accepted){talk([['糜竺','糧車接應之事，請與城西糧隊管事商議。']]);return;}const lines=[['糜竺','如今願意挺身護民的人，實在難得。'],['劉備','備兵微將寡，卻不敢因力薄而袖手。'],['糜竺',`城西有一批糧車等候入城。若糧道再斷，城中米價恐怕還要上漲。願請${address()}前往接應。`]];if(party().includes('張飛'))lines.push(['張飛','護送糧車？交給俺們便是！']);if(party().includes('關羽'))lines.push(['關羽','賊情未明，還是先問清遇襲之處。']);talk(lines,'accept');return;}
  if(id==='steward'){if(!state.flags.accepted)talk([['糧隊管事','這裡是等候接應的城西糧車，接應事宜請先向糜別駕詢問。']]);else if(state.flags.steward)talk([['糧隊管事',state.flags.slept?'請到役所向書吏打聽護衛隊長的消息。':'今日天色已晚，請先到客棧歇息，明日再尋書吏。']]);else talk([['糧隊管事',`糜別駕已派人知會。城西糧車的接應，便請${address()}多費心了。`],['糧隊管事',`今日天色已晚，前次運送糧車的護衛隊長尚未回城，請${address()}可先至客棧歇息，明日再去書吏那尋訪。`]],'steward');return;}
  const c=XuzhouNpcPlacement[id];if(c)talk([[c.npc,c.line]],'service:'+id);
 }
 function service(id){const leave=['離開',()=>{}];
  if(id==='客棧'){const q=TownLodging.quote(),free=TownLodging.freeAvailable(),cost=free?0:q.total;menu('確認住宿',`編制 ${q.count} 名武將。${free?'此次劇情招待免費住宿。':`基本 ${q.base}＋每人 ${q.perMember}，共 ${cost} 金幣。`}住宿後士氣恢復至 100。是否住宿？`,[['是',()=>free?talk([['客棧掌櫃','糜別駕已有照會，貴客此次住宿不用花費。']],'sleep'):startStay(cost)],['否',()=>{}]]);return;}
  if(id==='酒樓'){menu('店小二','',[['花費10金幣，聽取小道消息。',()=>notice('無相關消息')],leave]);return;}
  if(['武器店','防具店','道具店'].includes(id)){const type=id.replace('店','');menu(id,'',[['買'+type,()=>notice('商品尚未上架。')],['賣'+type,()=>notice('收購服務尚未開放。')],leave]);return;}
  if(id==='編輯所'){menu('編籍吏','',[['進入編輯候選隊伍',()=>{sessionStorage.setItem('three-kingdoms-story-return','徐州劇情.html');if(!window.SceneTest?.holdNavigation('主介面流程預覽.html?storyTeam=1'))location.href='主介面流程預覽.html?storyTeam=1';}],leave]);return;}
  if(id==='訓練店'){menu('教頭','字卡泡泡球：45秒，組成武將名字取得積分與獎勵。',[['花費100金幣訓練（小遊戲）',()=>{if(!window.SceneTest?.holdNavigation('字卡泡泡球.html'))location.href='字卡泡泡球.html';}],['花費50金幣訓練（可分配經驗）',()=>{},true],leave]);return;}
  if(id==='驛站')menu('驛丞','',[['查看可前往城鎮',()=>notice('暫無路線')],leave]);
 }
 async function startStay(cost){if(busy)return;busy=true;try{await TownLodging.begin(cost);busy=false;await sleep();}catch(e){busy=false;notice(e.message);}}
 async function sleep(){if(busy)return;busy=true;stop();document.querySelector('main').inert=true;const fade=$('fade');fade.classList.add('busy');let failed=false;try{let stay=TownLodging.pending();if(!stay&&state.sleepPending)stay=await TownLodging.begin(0);if(!stay)return;await new Promise(r=>setTimeout(r,30));fade.style.opacity='1';await new Promise(r=>setTimeout(r,1300));if(stay.free)state.flags.slept=true;state.sleepPending=false;state.active=null;save();await TownLodging.complete(stay.id);await new Promise(r=>setTimeout(r,500));fade.style.opacity='0';await new Promise(r=>setTimeout(r,1050));}catch(e){failed=true;$('saveWarning').hidden=false;}finally{fade.style.opacity='0';fade.classList.remove('busy');document.querySelector('main').inert=false;busy=false;render();if(failed)menu('住宿尚未完成','請接續這次住宿，不會重複扣款。',[['繼續住宿',()=>sleep()]]);}}

 function rescueAchievement(){menu('仁心救援','完成華陀初現・救援達成！取得成就「仁心救援」，鑽石 ×2。',[['收下',()=>YunlongRescue.dismissAchievement()]]);}
 async function rescueStay(){if(busy)return;busy=true;stop();document.querySelector('main').inert=true;const fade=$('fade');fade.classList.add('busy');try{await new Promise(r=>setTimeout(r,30));fade.style.opacity='1';await new Promise(r=>setTimeout(r,1300));state.scene='客棧';save();render();await new Promise(r=>setTimeout(r,500));fade.style.opacity='0';await new Promise(r=>setTimeout(r,1050));YunlongRescue.stay();rescueAchievement();}catch(e){$('saveWarning').hidden=false;menu('留宿尚未完成','進度尚未保存，請重試。',[['重試',()=>rescueStay()]]);}finally{fade.style.opacity='0';fade.classList.remove('busy');document.querySelector('main').inert=false;busy=false;}}
 function rescueArrival(){state.scene='內城';save();render();menu('救援達成','完成華陀初現劇情，救援達成。大牛與小牛招待大家留宿一晚。',[['前往客棧',()=>rescueStay()]]);}
 function exitCity(){if(window.SceneTest?.holdNavigation('離開徐州城'))return;const choices=[['返回桃源村',()=>{sessionStorage.removeItem('three-kingdoms-story-return');if(!window.SceneTest?.holdNavigation('桃園起兵.html'))location.href='桃園起兵.html';}]];if(VillageHiddenItems.huatuoDone())choices.push(['前往雲龍山',()=>{if(!window.SceneTest?.holdNavigation('雲龍山場景預覽.html'))location.href='雲龍山場景預覽.html';}]);choices.push(['留下',()=>{}]);menu('離開徐州城','請選擇去向。',choices);}
 document.addEventListener('click',e=>{if(e.target.closest('#sceneTestBar'))return;if(!state.active||$('dialogue').hidden||document.querySelector('dialog[open]'))return;if(e.target.closest('#dialogue button,#dialogue a,#dialogue input,#dialogue select'))return;e.preventDefault();e.stopImmediatePropagation();protect(next);},true);
 $('nextLine').onclick=()=>protect(next);$('closeTalk').onclick=()=>{stop();$('dialogue').hidden=true;$('hotspots').inert=false;$('resume').hidden=!state.active;};$('resume').onclick=()=>protect(show);
 $('recall').onclick=()=>{stop();$('historyBody').replaceChildren();for(const h of state.history){const p=document.createElement('p');p.textContent=`${h.scene}・${h.speaker}：${h.line}`;$('historyBody').append(p);}$('history').showModal();};$('closeHistory').onclick=()=>$('history').close();$('history').addEventListener('close',()=>{if(state.active&&!$('dialogue').hidden)protect(show);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(state.active&&!$('dialogue').hidden)protect(show);});
 sessionStorage.setItem('three-kingdoms-story-return','徐州劇情.html');
 protect(()=>{render();if(YunlongRescue.progress().returnPending)rescueArrival();else if(YunlongRescue.progress().achievementNotice)rescueAchievement();else if(state.sleepPending||TownLodging.pending())sleep();else if(state.active)show();});
})();
