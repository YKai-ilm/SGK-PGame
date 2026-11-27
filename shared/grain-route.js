'use strict';
// Shared content: no storage, navigation URL or combat implementation.
window.SharedGrainStory=(()=>{
 const dialogue={
 teaWaiter:[['店小二','方圓十里，就我們一間茶水站，客官您歇息一下再上路吧！']],
 xiulan:[['秀蘭','走了半天山路，總算能坐下喝口茶了。這山風吹著舒服，我還想再歇一會兒呢。']],
 dali:[['大力','我原想一口氣走到徐州城，誰知聞到茶香，腿就不肯往前走了。哈哈，喝完這碗再趕路！']],
 ming:[['明叔','糧道上總有點不太平，偶而會有些賊匪劫盜路上的運糧隊伍，老天保佑！']]
 };
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
 function scene(name,p,{point,go},showBandit=false){if(name==='糧道谷關'){const points=[['茶站',44,53,()=>go('茶站')],['離開',50,94,()=>go('城西')]];if(p.heardMing&&!p.reported)points.push(point('受傷隊長',p.rescueShown?39:66,p.rescueShown?48:19,'captain'));if(showBandit||p.rescueWon&&!p.rescueShown)points.push(point('賊匪',49,19,'bandit'));if(p.marksKnown)points.push(['盜糧匪寨',55,7,()=>go('盜糧匪寨')]);return {image:'糧道谷關-v1.png',points};}if(name==='茶站')return {image:'共用室內場景/茶站-v1.png',points:[point('店小二',29,28,'teaWaiter'),point('秀蘭',25,38,'xiulan'),point('大力',39,46,'dali'),point('明叔',63,46,'ming'),['離開',50,91,()=>go('糧道谷關')]]};if(name==='盜糧匪寨')return {image:'盜糧匪寨-v2-黑風寨.png',points:[...(p.campShown?[]:[point('鄧茂',50,52,'deng')]),...(p.campWon?[point('糧車',77,34,'cargo')]:[]),['離開',49,75,()=>go('糧道谷關')]]};return null;}
 function captain(p){let result=null;const talk=(lines,flag)=>{result={lines,flag};}; if(p.completed){talk([['護衛隊長','糧車能平安送回，我也終於能安心養傷了。救命與護糧之恩，沒齒難忘！']]);return result;}
 if(true){if(!p.heardMing)return result;if(p.rescueWon&&!p.rescueShown)return result;if(p.rescueShown&&!p.captainGift)talk([['受傷隊長','多謝壯士出手！方才被賊兵追趕，若非相救，恐怕性命難保。'],['受傷隊長','這套皮甲雖已破損，還能請城裡防具舖的修復師縫補。請收下，聊表謝意。'],['劉備','隊長先在茶站休養，我回城向糜別駕報個平安。']],'captainGift');else if(p.reported&&!p.trailKnown)talk([['受傷隊長','賊人帶著糧車往西面山道去了。我記得他們轉入一處舊營地，路口有棵折斷的大樹。'],['受傷隊長','那一帶如今被賊人占作黑風寨，沿糧道盡頭的車轍便能追過去。'],['劉備','我先向管事核對標記，再循車轍追查。']],'trailKnown');else if(p.captainGift)talk([['受傷隊長',p.trailKnown?nextStep(p):'請代我向糜別駕覆命，我就在茶站養傷。']]);else if(p.captainBriefed)result={choice:'rescue'};else talk([['受傷隊長','救命……我是徐州運糧隊的護衛隊長。糧車被劫，同伴也被打散了！'],['劉備','莫慌，先退到路旁，讓我看看傷勢。'],['受傷隊長','賊兵就在後頭！還請壯士替我擋住他們，讓我逃到茶站！']],'captainBriefed');return result;}
return result;}
 const requirements={routeKnown:null,heardMing:'routeKnown',captainBriefed:'heardMing',rescueShown:'rescueWon',captainGift:'rescueShown',reported:'captainGift',trailKnown:'reported',marksKnown:'trailKnown',campBriefed:'marksKnown',campShown:'campWon',cargoChecked:'campWon',cargoVerified:'cargoChecked',completed:'cargoVerified'};
 function canStart(kind,p){return kind==='rescue'?!!p.captainBriefed&&!p.rescueWon:kind==='camp'?!!p.campBriefed&&!p.campWon:false;}
 function canAdvance(flag,p){return Object.hasOwn(requirements,flag)&&!p[flag]&&(!requirements[flag]||!!p[requirements[flag]]);}
 const battles={rescue:{id:'grain-rescue',scene:'糧道谷關',title:'救援護衛隊長',description:'先擊退追兵，讓隊長退至茶站。',confirm:'開始救援'},camp:{id:'grain-camp',scene:'盜糧匪寨',title:'奪回糧車',description:'守住糧車，擊退鄧茂的賊兵。',confirm:'開始奪糧'}};
 return {dialogue,reportLines,nextStep,scene,captain,requirements,canStart,canAdvance,battles};
})();
