'use strict';
window.GrainQuestUI=(()=>{
 let api,animating=false,showBandit=false;
 const q=()=>GrainQuest.progress(),sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const dialogue={
 teaWaiter:[['店小二','方圓十里，就我們一間茶水站，客官您歇息一下再上路吧！']],
 xiulan:[['秀蘭','走了半天山路，總算能坐下喝口茶了。這山風吹著舒服，我還想再歇一會兒呢。']],
 dali:[['大力','我原想一口氣走到徐州城，誰知聞到茶香，腿就不肯往前走了。哈哈，喝完這碗再趕路！']],
 ming:[['明叔','糧道上總有點不太平，偶而會有些賊匪劫盜路上的運糧隊伍，老天保佑！']]
 };
 function talk(lines,action){api.talk(lines,action?'grain:'+action:null);}
 function point(name,x,y,id){return [name,x,y,()=>npc(id)];}
 function scene(name){const p=q();if(name==='糧道谷關'){const points=[['茶站',44,53,()=>api.go('茶站')],['離開',50,94,()=>api.go('城西')]];if(p.heardMing)points.push(point('受傷隊長',p.rescueShown?39:66,p.rescueShown?48:19,'captain'));if(showBandit||p.rescueWon&&!p.rescueShown)points.push(point('賊匪',49,19,'bandit'));if(p.marksKnown)points.push(['盜糧匪寨',55,7,()=>api.go('盜糧匪寨')]);return {image:'糧道谷關-v1.png',points};}if(name==='茶站')return {image:'共用室內場景/茶站-v1.png',points:[point('店小二',29,28,'teaWaiter'),point('秀蘭',25,38,'xiulan'),point('大力',39,46,'dali'),point('明叔',63,46,'ming'),['離開',50,91,()=>api.go('糧道谷關')]]};if(name==='盜糧匪寨')return {image:'盜糧匪寨-v2-黑風寨.png',points:[...(p.campShown?[]:[point('鄧茂',50,52,'deng')]),...(p.campWon?[point('糧車',77,34,'cargo')]:[]),['離開',49,75,()=>api.go('糧道谷關')]]};return null;}
 function augment(name,points){if(name==='城西'&&q().routeKnown)points.push(['糧道查探',46,89,()=>api.go('糧道谷關')]);if(name==='防具店')points.push(point('修復師',78,27,'repair'));}
 function choice(kind){api.menu(kind==='rescue'?'救援護衛隊長':'奪回糧車',kind==='rescue'?'先擊退追兵，讓隊長退至茶站。':'守住糧車，擊退鄧茂的賊兵。',[[kind==='rescue'?'開始救援':'開始奪糧',()=>start(kind)],['稍作準備',()=>{}]]);}
 async function start(kind){if(animating)return;animating=true;api.setBusy(true);try{const runId=GrainQuest.begin(kind);if(kind==='rescue'){showBandit=true;api.render();await sleep(700);}const fade=document.getElementById('fade');fade.classList.add('busy');fade.style.opacity='1';await sleep(1400);api.state.scene=kind==='rescue'?'糧道谷關':'盜糧匪寨';api.state.active=null;api.save();const url='戰場直版.html?grainBattle='+kind+'&run='+encodeURIComponent(runId)+'&returnTo='+encodeURIComponent('徐州劇情.html');if(window.SceneTest?.holdNavigation(url)){fade.style.opacity='0';fade.classList.remove('busy');return;}location.href=url;}catch(e){document.getElementById('fade').style.opacity='0';api.notice(e.message);}finally{animating=false;api.setBusy(false);}}
 function npc(id){const p=q();if(dialogue[id]){talk(dialogue[id],id==='ming'?'heardMing':null);return true;}
 if(id==='captain'){if(!p.heardMing)return true;if(p.rescueWon&&!p.rescueShown)return true;if(p.rescueShown&&!p.captainGift)talk([['受傷隊長','多謝壯士出手！方才被賊兵追趕，若非相救，恐怕性命難保。'],['受傷隊長','這套皮甲雖已破損，還能請城裡防具舖的修復師縫補。請收下，聊表謝意。'],['劉備','隊長先在茶站休養，我回城向糜別駕報個平安。']],'captainGift');else if(p.reported&&!p.trailKnown)talk([['受傷隊長','我們在谷口遇襲，糧車被拖往山路盡頭的寨子。車轅留有城西糧隊的刻記。'],['劉備','我先向管事核對標記，再循車轍追查。']],'trailKnown');else if(p.captainGift)talk([['受傷隊長',p.trailKnown?'核對車上的刻記，便不會認錯糧車。':'請代我向糜別駕覆命，我就在茶站養傷。']]);else if(p.captainBriefed)choice('rescue');else talk([['受傷隊長','救命……我是徐州運糧隊的護衛隊長。糧車被劫，同伴也被打散了！'],['劉備','莫慌，先退到路旁，讓我看看傷勢。'],['受傷隊長','賊兵就在後頭！還請壯士替我擋住他們，讓我逃到茶站！']],'captainBriefed');return true;}
 if(id==='bandit')return true;
 if(id==='repair'){if(p.armorRepaired)talk([['修復師','皮甲已替您修好了，出門前記得穿戴妥當。']]);else if(p.captainGift)api.menu('修復師','修復破損皮甲需要 30 金幣，修好後獲得皮甲一套。',[['修復（30 金幣）',()=>{try{api.notice(GrainQuest.repair()?'破損皮甲已修復，皮甲已放入裝備背包。':'目前沒有可修復的破損皮甲。');}catch(e){api.notice(e.message);}}],['稍後再來',()=>{}]]);else talk([['修復師','皮甲若有破損，可以帶來讓我瞧瞧。']]);return true;}
 if(id==='deng'){if(p.campWon)return true;if(p.campBriefed)choice('camp');else talk([['鄧茂','追到這裡來了？這些糧車如今歸我，識相便走！'],['劉備','這是百姓活命的糧食，豈容你奪去！放下糧車！'],['鄧茂','有本事便來拿！弟兄們，給我上！']],'campBriefed');return true;}
 if(id==='cargo'){if(p.cargoChecked)talk([['劉備','糧車已清點，回城請管事派人接運。']]);else talk([['劉備','車轅刻記與管事所說相符，糧袋大致完好。先守住此地，再通知城西接運。']],'cargoChecked');return true;}
 if(id==='steward'&&p.cargoChecked){talk([['糧隊管事',p.cargoVerified?'糧車已安排接回，請向糜別駕覆命。':'刻記、數目都對得上！我這便派人接回糧車，還請到城主府覆命。']],p.cargoVerified?null:'cargoVerified');return true;}
 if(id==='steward'&&p.trailKnown){talk([['糧隊管事','沒錯，車轅上有兩道斜刻，糧袋繫著青布條。沿谷關盡頭的車轍走，便能找到藏糧之處。']],p.marksKnown?null:'marksKnown');return true;}
 if(id==='steward'&&api.state.flags.missing){talk([['糧隊管事','從城西這條路出去，就是糧道谷關。路旁有間茶站，可以先向歇腳的鄉親打聽。']],p.routeKnown?null:'routeKnown');return true;}
 if(id==='城主府一'&&p.cargoVerified&&!p.completed){talk([['糜竺','糧車已平安送回，城中百姓總算能安心。這次救人護糧，多虧壯士。'],['陶謙','有勇有義，才堪護民。往後義勇成軍之事，還望壯士相助。'],['劉備','能盡綿薄之力，備不敢辭。']],'completed');return true;}
 if(id==='城主府一'&&p.captainGift&&!p.reported){talk([['劉備','已救下護衛隊長，他正在茶站休養，只是糧車仍在賊人手中。'],['糜竺','隊長能平安，真是不幸中的大幸。這位是陶太守。'],['陶謙','多謝壯士救我護軍。還請再問隊長遇襲經過，設法追回百姓的糧食。'],['糜竺','先領些盤纏與整備經驗，再去茶站問明去向，並與城西管事核對糧車標記。']],'reported');return true;}
 if(id==='城主府一'&&p.reported&&!p.completed){talk([['糜竺',p.marksKnown?'請循車轍前往盜糧匪寨，奪回糧車。':'請先向茶站的隊長問明線索，再找城西管事核對糧車標記。']]);return true;}
 if(id==='城主府一'&&p.completed&&!api.state.flags.volunteerArmyFormed){talk([['糜竺','運糧護衛已辦妥，下一步便是籌組義勇。先整備隊伍，待軍務安排。']]);return true;}
 return false;}
 function finish(action){if(!action?.startsWith('grain:'))return false;const flag=action.slice(6);GrainQuest.advance(flag);api.end();api.render();if(flag==='captainBriefed')choice('rescue');if(flag==='campBriefed')choice('camp');if(flag==='captainGift')api.notice('獲得劇情道具：破損皮甲 ×1。可到徐州防具店找修復師。');if(flag==='reported')api.notice('救援覆命：金幣＋60、可分配經驗＋100。');if(flag==='completed')api.notice('運糧護衛完成：金幣＋140、可分配經驗＋150。玩家卡副章節碎片10片可至成就領取。');return true;}
 async function arrival(){const p=q();const rescue=p.rescueWon&&!p.rescueShown,camp=p.campWon&&!p.campShown;if(!rescue&&!camp)return false;animating=true;api.setBusy(true);api.state.scene=rescue?'糧道谷關':'盜糧匪寨';api.state.active=null;api.save();api.render();try{const target=document.querySelector('[data-name="'+(rescue?'賊匪':'鄧茂')+'"]');await sleep(650);if(target){await target.animate(rescue?[{opacity:1,filter:'brightness(1)'},{opacity:1,filter:'brightness(3) saturate(0)',offset:.3},{opacity:0,transform:'translate(-50%,-50%) scale(.3)'}]:[{opacity:1},{opacity:0,transform:'translate(80px,-90px)'}],{duration:1100,fill:'forwards'}).finished;}if(rescue){const captain=document.querySelector('[data-name="受傷隊長"]');if(captain){captain.style.transition='left 1.8s ease,top 1.8s ease';captain.style.left='39%';captain.style.top='48%';await sleep(1850);}GrainQuest.advance('rescueShown');}else GrainQuest.advance('campShown');api.render();if(camp)talk([['鄧茂','今日先退！這筆帳，日後再算！'],['劉備','莫追，先查看糧車，免得再遭損失。']]);}catch(e){api.notice('演出尚未完成，重新進入可接續：'+e.message);}finally{animating=false;api.setBusy(false);}return true;}
 function install(context){api=context;}
 return {install,scene,augment,npc,finish,arrival};
})();
