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
 const reportLines=[['劉備','已救下護衛隊長，並安排他回城到客棧休養，只是糧車仍在賊人手中。'],['糜竺','糧車雖失，護軍能平安回來，已是不幸中的大幸。'],['陶謙','聞壯士救回護軍，特來相見。危急之時仍以人命為先，難能可貴。'],['劉備','備只是盡力而為。只是糧道未安，往來百姓恐仍受其害。'],['糜竺','先領些盤纏與整備經驗。請再到客棧問隊長追糧線索，再與城西管事核對糧車記號。']];
 // Repeated conversations follow the latest completed milestone, preserving earlier flags.
 function nextStep(p){
  if(p.cargoVerified)return '糧車已安排接回，請到城主府向糜別駕作最後覆命。';
  if(p.cargoChecked)return '糧車已查驗，請找城西糧隊管事清點並安排接運。';
  if(p.campWon)return '寨中賊兵已被擊退，請先查看寨內糧車，再找城西糧隊管事接運。';
  if(p.marksKnown)return '糧車記號已核對，請循車轍前往黑風寨，先護住糧食，再奪回糧車。';
  if(p.trailKnown)return '賊人去向已問明，請找城西糧隊管事核對糧車標記。';
  if(p.reported)return '隊長已回客棧養傷，請先向他詢問追糧線索。';
  if(p.captainGift)return '護衛隊長已獲救，請到城主府向糜別駕覆命，安排隊長回客棧休養。';
  return '護衛隊長已獲救，請先照看茶站旁的隊長，再到城主府報平安。';
 }
 function point(name,x,y,id){return [name,x,y,()=>npc(id)];}
 function scene(name){const p=q();if(name==='糧道谷關'){const points=[['茶站',44,53,()=>api.go('茶站')],['離開',50,94,()=>api.go('城西')]];if(p.heardMing&&!p.reported)points.push(point('受傷隊長',p.rescueShown?39:66,p.rescueShown?48:19,'captain'));if(showBandit||p.rescueWon&&!p.rescueShown)points.push(point('賊匪',49,19,'bandit'));if(p.marksKnown)points.push(['盜糧匪寨',55,7,()=>api.go('盜糧匪寨')]);return {image:'糧道谷關-v1.png',points};}if(name==='茶站')return {image:'共用室內場景/茶站-v1.png',points:[point('店小二',29,28,'teaWaiter'),point('秀蘭',25,38,'xiulan'),point('大力',39,46,'dali'),point('明叔',63,46,'ming'),['離開',50,91,()=>api.go('糧道谷關')]]};if(name==='盜糧匪寨')return {image:'盜糧匪寨-v2-黑風寨.png',points:[...(p.campShown?[]:[point('鄧茂',50,52,'deng')]),...(p.campWon?[point('糧車',77,34,'cargo')]:[]),['離開',49,75,()=>api.go('糧道谷關')]]};return null;}
 function augment(name,points){if(name==='客棧'&&q().reported)points.push(point('護衛隊長',78,61,'captain'));if(name==='城主府'&&q().captainGift)points.push(point('陶謙',50,18,'taoqian'));if(name==='城西'&&q().routeKnown)points.push(['糧道查探',46,89,()=>api.go('糧道谷關')]);if(name==='防具店')points.push(point('修復師',78,27,'repair'));}
 function choice(kind){api.menu(kind==='rescue'?'救援護衛隊長':'奪回糧車',kind==='rescue'?'先擊退追兵，讓隊長退至茶站。':'守住糧車，擊退鄧茂的賊兵。',[[kind==='rescue'?'開始救援':'開始奪糧',()=>start(kind)],['稍作準備',()=>{}]]);}
 async function start(kind){if(animating)return;animating=true;api.setBusy(true);try{const runId=GrainQuest.begin(kind);if(kind==='rescue'){showBandit=true;api.render();await sleep(700);}const fade=document.getElementById('fade');fade.classList.add('busy');fade.style.opacity='1';await sleep(1400);api.state.scene=kind==='rescue'?'糧道谷關':'盜糧匪寨';api.state.active=null;api.save();const url='戰場直版.html?grainBattle='+kind+'&run='+encodeURIComponent(runId)+'&returnTo='+encodeURIComponent('徐州劇情.html');if(window.SceneTest?.holdNavigation(url)){fade.style.opacity='0';fade.classList.remove('busy');return;}location.href=url;}catch(e){document.getElementById('fade').style.opacity='0';api.notice(e.message);}finally{animating=false;api.setBusy(false);}}
 function npc(id){if(window.YellowQuestUI?.npc(id))return true;const p=q();
if(dialogue[id]){talk(dialogue[id],id==='ming'?'heardMing':null);return true;}
 if(id==='taoqian'&&p.completed&&!p.armyFormed){talk([['陶謙','壯士先救護軍，再奪回糧車，既有勇略，又不忘護民。這番功勞，徐州百姓都記在心裡。'],['劉備','護軍與糧食皆得保全，備也總算能安心。'],['陶謙','我備下厚布衣、皮甲、硬皮甲各一件，助你們整備義勇。另將劉備、關羽、張飛三張武將卡交予你，往後可正式編入隊伍。'],['陶謙','自今日起，義勇正式成軍。願你們同心協力，守護百姓！'],['劉備','多謝陶公相助！備當謹記護民之志，不負所託。']],'armyFormed');return true;}
 if(id==='taoqian'){if(!p.captainGift)return true;if(!p.reported)talk(reportLines,'reported');else talk([['陶謙',p.completed?'壯士已使糧道重通，百姓得以安生，此功我記下了。':nextStep(p)]]);return true;}
 if(id==='役所'&&p.rescueWon){talk([['書吏',p.completed?'護軍得救，糧車也已平安接回，這次辛苦壯士了。':nextStep(p)]]);return true;}
 if(id==='captain'&&p.completed){talk([['護衛隊長','糧車能平安送回，我也終於能安心養傷了。救命與護糧之恩，沒齒難忘！']]);return true;}
 if(id==='captain'){if(!p.heardMing)return true;if(p.rescueWon&&!p.rescueShown)return true;if(p.rescueShown&&!p.captainGift)talk([['受傷隊長','多謝壯士出手！方才被賊兵追趕，若非相救，恐怕性命難保。'],['受傷隊長','這套皮甲雖已破損，還能請城裡防具舖的修復師縫補。請收下，聊表謝意。'],['劉備','隊長先在茶站休養，我回城向糜別駕報個平安。']],'captainGift');else if(p.reported&&!p.trailKnown)talk([['受傷隊長','賊人帶著糧車往西面山道去了。我記得他們轉入一處舊營地，路口有棵折斷的大樹。'],['受傷隊長','那一帶如今被賊人占作黑風寨，沿糧道盡頭的車轍便能追過去。'],['劉備','我先向管事核對標記，再循車轍追查。']],'trailKnown');else if(p.captainGift)talk([['受傷隊長',p.trailKnown?nextStep(p):'請代我向糜別駕覆命，我就在茶站養傷。']]);else if(p.captainBriefed)choice('rescue');else talk([['受傷隊長','救命……我是徐州運糧隊的護衛隊長。糧車被劫，同伴也被打散了！'],['劉備','莫慌，先退到路旁，讓我看看傷勢。'],['受傷隊長','賊兵就在後頭！還請壯士替我擋住他們，讓我逃到茶站！']],'captainBriefed');return true;}
 if(id==='bandit')return true;
 if(id==='repair'){if(p.armorRepaired)talk([['修復師','皮甲已替您修好了，出門前記得穿戴妥當。']]);else if(p.captainGift)api.menu('修復師','修復破損皮甲需要 30 金幣，修好後獲得皮甲一套。',[['修復（30 金幣）',()=>{try{api.notice(GrainQuest.repair()?'破損皮甲已修復，皮甲已放入裝備背包。':'目前沒有可修復的破損皮甲。');}catch(e){api.notice(e.message);}}],['稍後再來',()=>{}]]);else talk([['修復師','皮甲若有破損，可以帶來讓我瞧瞧。']]);return true;}
 if(id==='deng'){if(p.campWon)return true;if(p.campBriefed)choice('camp');else talk([['鄧茂','追到這裡來了？這些糧車如今歸我，識相便走！'],['劉備','這是百姓活命的糧食，豈容你奪去！放下糧車！'],['鄧茂','有本事便來拿！弟兄們，給我上！']],'campBriefed');return true;}
 if(id==='cargo'){if(p.cargoVerified)talk([['劉備','管事已安排接運，這批糧車的事已交代妥當。']]);else if(p.cargoChecked)talk([['劉備','糧車已清點，回城請管事派人接運。']]);else talk([['劉備','車轅刻記與管事所說相符，糧袋大致完好。先守住此地，再通知城西接運。']],'cargoChecked');return true;}
 if(id==='steward'&&p.completed){talk([['糧隊管事','糧車已平安接回，護衛隊長也在客棧安心養傷。多虧壯士相助，這趟糧運總算有了交代！']]);return true;}
 if(id==='steward'&&p.cargoChecked){talk([['糧隊管事',p.cargoVerified?'糧車已安排接回，請向糜別駕覆命。':'刻記、數目都對得上！我這便派人接回糧車，還請到城主府覆命。']],p.cargoVerified?null:'cargoVerified');return true;}
 if(id==='steward'&&p.campWon){talk([['糧隊管事','聽聞寨中賊兵已被擊退，辛苦了！還請先查看寨內糧車的記號與糧袋，確認無誤再回來，我好安排接運。']]);return true;}
 if(id==='steward'&&p.marksKnown){talk([['糧隊管事','糧車記號已核對：車尾兩道斜刻，糧袋繫青布條。請往黑風寨救回糧車，記得先護住糧食。']]);return true;}
 if(id==='steward'&&p.trailKnown){talk([['劉備','我已在客棧問過隊長。賊人將糧車帶往西面山道的舊營地，如今喚作黑風寨。出發前，想再向管事確認糧車的記號。'],['糧隊管事','車尾都有徐州糧隊的記號，是兩道斜刻；糧袋則繫著青布條。兩樣都對得上，便是我們失去的糧車。'],['糧隊管事','若找到車隊，還請先護住糧食，莫讓賊人毀了。這些都是百姓賴以度日的口糧啊！'],['劉備','記下了。我會循著車轍前往黑風寨，先保住糧車，再設法擊退賊人。'],['糧隊管事','沿糧道谷關走到盡頭，便是通往寨子的路。待壯士奪回糧車，我會安排人手接運，還請平安歸來！']],p.marksKnown?null:'marksKnown');return true;}
 if(id==='steward'&&p.reported){talk([['糧隊管事','隊長已回城，在客棧休養。請先向他問清糧車被劫往何處，再來找我核對記號。']]);return true;}
 if(id==='steward'&&p.rescueWon){talk([['糧隊管事','隊長能獲救，真是太好了！他的傷勢可還穩當？'],['糧隊管事',p.captainGift?'請先到城主府向糜別駕報個平安，再安排隊長回客棧養傷。':'他既已退到茶站旁，還請先去看看他，再回城向糜別駕覆命。']]);return true;}
 if(id==='steward'&&p.captainBriefed){talk([['糧隊管事','原來隊長受傷困在糧道上！請先救人，糧車的事待他平安後再商議。']]);return true;}
 if(id==='steward'&&p.routeKnown){talk([['糧隊管事','沿城西道路前往糧道谷關，路旁茶站可以打聽消息。請沿途留意隊長的下落。']]);return true;}
 if(id==='steward'&&api.state.flags.missing){talk([['劉備','書吏說護衛隊長至今未歸。我欲沿路查探，還請管事告知運糧隊所走的路線。'],['糧隊管事','從城西下方這條路出去，便是糧道谷關。運糧隊平日都走這條山道，沿著地上的車轍前行便是。'],['糧隊管事','路旁有一間茶站，往來運糧的護軍常在那裡歇腳。壯士可先去問問店家與歇腳的鄉親，或許有人見過隊長。'],['劉備','多謝指點，我先往茶站打聽，再沿糧道尋人。'],['糧隊管事','山路近來不太平，還請多加小心。若尋到隊長，務必先救人！']],p.routeKnown?null:'routeKnown');return true;}
 if(id==='城主府一'&&p.cargoVerified&&!p.completed){talk([['糜竺','糧車已平安送回，城中百姓總算能安心。這次救人護糧，多虧壯士。'],['陶謙','有勇有義，才堪護民。往後義勇成軍之事，還望壯士相助。'],['劉備','能盡綿薄之力，備不敢辭。']],'completed');return true;}
 if(id==='城主府一'&&p.captainGift&&!p.reported){talk(reportLines,'reported');return true;}
 if(id==='城主府一'&&p.campWon&&!p.cargoVerified){talk([['糜竺',p.cargoChecked?'糧車已查驗，請先找城西管事清點並安排接運，再回來覆命。':'既已擊退賊兵，請先查看寨內糧車，再請城西管事清點接運。']]);return true;}
 if(id==='城主府一'&&p.rescueWon&&!p.completed){talk([['糜竺',nextStep(p)]]);return true;}
 if(id==='城主府一'&&p.completed&&!p.armyFormed){talk([['糜竺','運糧護衛已辦妥，陶太守備有成軍贈禮，請與他交談。']]);return true;}
 if(id==='城主府一'&&p.armyFormed&&!api.state.flags.miMatchmakingDiscussed&&!window.MiFamilyStory?.canMatchmake(api.state.flags)){talk([['糜竺','義勇已正式成軍，陶太守的贈禮也已備妥。請先整備隊伍，後續軍務再行知會。']]);return true;}
 return false;}
 function finish(action){if(!action?.startsWith('grain:'))return false;const flag=action.slice(6);if(flag==='armyFormed'){GrainQuest.formArmy();api.state.flags.volunteerArmyFormed=!!q().armyFormed;}else if(flag==='miRecruited')GrainQuest.recruitMi();else GrainQuest.advance(flag);api.end();api.render();if(flag==='captainBriefed')choice('rescue');if(flag==='campBriefed')choice('camp');if(flag==='captainGift')api.notice('獲得劇情道具：破損皮甲 ×1。可到徐州防具店找修復師。');if(flag==='reported')api.notice('救援覆命：金幣＋60、可分配經驗＋100。');if(flag==='miRecruited')api.notice('獲得糜竺完整武將卡。已有武將保留原有養成，不另行折算。糜家小女副章節玩家碎片10片可至成就領取。');if(flag==='armyFormed')api.notice('正式成軍：獲得厚布衣、皮甲、硬皮甲各一件，以及劉備、關羽、張飛完整武將卡。已擁有的武將保留原有養成，不重置；副章節玩家碎片10片可至成就領取。');if(flag==='completed')api.notice('運糧護衛完成：金幣＋140、可分配經驗＋150。玩家卡副章節碎片10片可至成就領取。');return true;}
 async function arrival(){const p=q();const rescue=p.rescueWon&&!p.rescueShown,camp=p.campWon&&!p.campShown;if(!rescue&&!camp)return false;animating=true;api.setBusy(true);api.state.scene=rescue?'糧道谷關':'盜糧匪寨';api.state.active=null;api.save();api.render();try{const target=document.querySelector('[data-name="'+(rescue?'賊匪':'鄧茂')+'"]');await sleep(650);if(target){await target.animate(rescue?[{opacity:1,filter:'brightness(1)'},{opacity:1,filter:'brightness(3) saturate(0)',offset:.3},{opacity:0,transform:'translate(-50%,-50%) scale(.3)'}]:[{opacity:1},{opacity:0,transform:'translate(80px,-90px)'}],{duration:1100,fill:'forwards'}).finished;}if(rescue){const captain=document.querySelector('[data-name="受傷隊長"]');if(captain){captain.style.transition='left 1.8s ease,top 1.8s ease';captain.style.left='39%';captain.style.top='48%';await sleep(1850);}GrainQuest.advance('rescueShown');}else GrainQuest.advance('campShown');api.render();if(camp)talk([['鄧茂','今日先退！這筆帳，日後再算！'],['劉備','莫追，先查看糧車，免得再遭損失。']]);}catch(e){api.notice('演出尚未完成，重新進入可接續：'+e.message);}finally{animating=false;api.setBusy(false);}return true;}
 function install(context){api=context;if(q().armyFormed)api.state.flags.volunteerArmyFormed=true;}
 return {install,scene,augment,npc,finish,arrival};
})();
