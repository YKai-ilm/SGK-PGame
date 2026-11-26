'use strict';
window.DongQuest=(()=>{
 const key='three-kingdoms-interface-preview-v1',read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 const progress=()=>read().storyEvents?.dongCoalition||{};
 function advance(flag){const s=read(),p=s.storyEvents?.dongCoalition||{};const gates={ordered:s.storyEvents?.threeZhang?.chapterCompleted,registered:p.ordered,introduced:p.registered,briefed:p.introduced,completed:p.briefed};if(p[flag]||!gates[flag])return false;s.storyEvents??={};s.storyEvents.dongCoalition={...p,[flag]:true};localStorage.setItem(key,JSON.stringify(s));return true;}
 return {progress,advance,ready:()=>!!read().storyEvents?.threeZhang?.chapterCompleted};
})();
window.DongQuestUI=(()=>{
 let api;const q=()=>DongQuest.progress(),say=(name,line)=>api.talk([[name,line]]),talk=(lines,flag)=>api.talk(lines,flag?'dong:'+flag:null);
 const facilities=[['縣衙',30,19],['驛站',78,16],['客棧',79,47],['道具鋪',35,72],['武器鋪',25,48],['防具鋪',34,59],['編輯所',23,26]];
 const ownsScene=name=>name==='陳留'||name.startsWith('陳留・')||name==='聯軍營地';
 function enter(){if(!q().ordered||window.SceneTest?.holdNavigation('前往陳留'))return;api.state.scene='陳留';api.state.active=null;api.save();location.href='討董會盟.html?town='+encodeURIComponent('陳留');}
 function npc(id){if(id!=='taoqian'||!DongQuest.ready())return false;if(q().ordered){say('陶謙',q().completed?'軍令既明，便依令整備。百姓與將士的性命，切記時時放在心上。':'出征軍令已交予你。先到陳留找接待軍吏登記，再往聯軍營地拜會公孫瓚。');return true;}
 api.menu('檄文再起','黃巾戰事暫歇，徐州又收到諸路起兵的檄文。是否聽取新的軍情？',[
 ['整備出發',()=>talk([['旁白','兵火漸息，義勇暫歇。其後時局屢變，新的檄文終於傳到了徐州。'],['書吏','使君，諸路起兵的檄文送到了，請您過目。'],['陶謙','董卓專權，諸路兵馬相約會合。此番不是追剿一地賊眾，各有統屬，行事更須謹慎。'],['劉備','備願領義勇前往，先查明會合之處，再聽軍令。'],['陶謙','可先往陳留問訊。持這份軍令向接待軍吏登記，公孫瓚將軍會在營中接應。沿途百姓若有急難，莫只顧趕路。'],['劉備','備謹記在心。待整備妥當，便啟程前往陳留。']],'ordered')],['稍作休整',()=>{}]]);return true;}
 function cityExit(){const choices=[['前往大地圖',()=>WorldTravel.open('陳留')]];if(q().registered)choices.push(['任務：前往聯軍營地',()=>api.go('聯軍營地')]);choices.push(['留下',()=>{}]);api.menu('離開陳留','請選擇去向。',choices);}
 function officer(id){const p=q();if(id==='reception'){if(p.registered){say('接待軍吏','名冊已登記妥當。出城後可循軍令前往聯軍營地，先找公孫瓚將軍。');return;}talk([['接待軍吏','來者請留步。各部進營須先登記，請出示軍令。'],['劉備','徐州義勇劉備，奉陶太守之命前來。這是軍令。'],['接待軍吏','軍令無誤。人員與來處已記入名冊，請由城外營門入內，先尋公孫瓚將軍。'],['劉備','有勞。城中若有需用，我等先行整備，再往營中聽令。']],'registered');return;}
 if(id==='gongsun'){if(p.introduced){say('公孫瓚',p.completed?'諸部雖已會合，仍須步步謹慎。你先安排好義勇，待軍令下達再動身。':'先向曹操問明軍情，再到中軍帳聽袁紹軍令。');return;}talk([['公孫瓚','玄德，你也帶兵來了。先隨我入營，把來意向諸公說明。'],['劉備','義勇雖少，願為百姓盡力。'],['公孫瓚','我已向營中通報。曹操正在左側議事，先聽他說明形勢，再往中軍帳。']],'introduced');return;}
 if(id==='cao'){if(!p.introduced){say('曹操','各部來營先報名籍。請先找公孫瓚將軍引見。');return;}if(p.briefed){say('曹操',p.completed?'軍中調度，貴在進退有據。整備未妥，勿急於爭先。':'軍情已說明，請往中軍帳聽袁盟主號令。');return;}talk([['曹操','營中不缺願戰之人，缺的是進退有度。先聽軍情，再論出兵。'],['曹操','諸路兵馬尚在集結，糧運與接應都不能疏忽。若各自逞勇，便給了敵軍可乘之機。'],['劉備','備明白。義勇聽令而行，不因人少便輕棄責任，也不因求功便擅進。'],['曹操','如此甚好。請往中軍帳，聽取袁盟主安排。']],'briefed');return;}
 if(id==='yuan'){if(!p.briefed){say('袁紹','先由公孫將軍引見，向曹操問明軍情，再來聽令。');return;}if(p.completed){say('袁紹','各部依令整備，勿擅自離營。南面接應的細節，待軍需處核明後再行傳令。');return;}talk([['袁紹','各部依令而行。南面接應尚缺人手，玄德可先往軍需處報到。'],['劉備','備領命。先核對人員與糧秣，再候調遣。'],['袁紹','會盟重在同進同退。整備妥當之前，切莫擅自出戰。']],'completed');return;}
 say('軍需吏',p.completed?'義勇名冊已收妥。請先備齊兵刃、甲具與糧秣，接應路線尚待斥候回報。':'各部物資正在清點。先依次拜會公孫瓚、曹操與袁紹，領令後再來。');}
 function scene(name){if(!ownsScene(name))return null;if(name==='聯軍營地'){if(!q().registered)return scene('陳留');return {image:'討董聯軍營地-v1.png',points:[['公孫瓚',80,36,()=>officer('gongsun')],['曹操',25,36,()=>officer('cao')],['袁紹',55,18,()=>officer('yuan')],['軍需吏',25,65,()=>officer('supplies')],['離開',50,94,()=>api.go('陳留')]]};}
 if(name==='陳留'){WorldTravel.consumeArrival('陳留');WorldTravel.arrive('陳留');return {image:'陳留城內-v1.png',points:[...facilities.map(([n,x,y])=>[n,x,y,()=>api.go('陳留・'+n)]),['井邊老者',41,39,()=>say('井邊老者','南來北往的車馬都愛在此歇腳。水井有人照管，取水後記得把桶放妥。')],['布商',70,70,()=>say('布商','行路的客人多，補衣裳的針線也賣得快。願大家都能平安回家。')],...(q().ordered?[['接待軍吏',59,80,()=>officer('reception')]]:[]),['離開',50,94,cityExit]]};}
 const label=name.split('・')[1],id=({'縣衙':'役所','武器鋪':'武器店','防具鋪':'防具店','道具鋪':'道具店'})[label]||label,base=SharedInteriorScenes.find(x=>x.id===id);if(!base)return null;return {image:base.image,points:[[base.npc,base.npcX,base.npcY,()=>{if(label==='縣衙')say('書吏','市集在井邊，客棧在街東。城中來往人多，還請留意車馬。');else if(label==='驛站')WorldTravel.open('陳留',true);else api.menu(base.npc,'客官請進。',[[label==='客棧'?'詢問住宿':'查看服務',()=>api.service(id,'chenliu')],['離開',()=>{}]]);}],['離開',base.exitX,base.exitY,()=>api.go('陳留')]]};}
 function finish(action){if(!action?.startsWith('dong:'))return false;const flag=action.slice(5);if(!DongQuest.advance(flag)&&!q()[flag])throw Error('請先完成前段軍情。');api.end();api.render();if(flag==='ordered')api.notice('已取得出征軍令。徐州出口新增「任務：前往陳留」。');if(flag==='completed')api.notice('檄文再起完成。可至成就領取玩家碎片10片；先到軍需吏處整備，等候後續接應軍令。');return true;}
 return {install:c=>api=c,npc,scene,finish,ownsScene,exitChoice:()=>q().ordered?['任務：前往陳留',enter]:null};
})();
