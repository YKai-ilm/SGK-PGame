'use strict';
window.ProgressRewards=(()=>{
 const number=x=>Number.isSafeInteger(x)&&x>=0?x:0;
 function init(s){s.rewards??={};const r=s.rewards;window.SharedWallet.init(s);r.claims??={};r.history=Array.isArray(r.history)?r.history:[];r.modes??={};for(const mode of ['story','battle']){const m=r.modes[mode]??={};m.visited=Array.isArray(m.visited)?[...new Set(m.visited)]:[];m.teamReady=!!m.teamReady;}return r;}
 function sync(s){window.ChestSystem?.syncUnlocked(s);const r=init(s);for(const mode of ['story','battle']){if(Object.entries(s.teams).some(([k,t])=>(mode==='battle'?k==='battle':k.startsWith('story:'))&&t.slots?.some(n=>s.unlocks[mode].heroes.includes(n))))r.modes[mode].teamReady=true;}return r;}
 const chapterAmounts=Object.freeze({main:20,sub:10});
 function grainObjective(s){
  const g=s.storyEvents?.grainRoute||{};
  if(g.completed)return '運糧護衛已完成：隊長獲救、糧車接回，已向糜竺覆命。';
  if(g.cargoVerified)return '目前：回徐州城主府向糜竺作最後覆命，完成運糧護衛。';
  if(g.cargoChecked)return '目前：到徐州城西找糧隊管事清點糧車，安排接運。';
  if(g.campWon)return '目前：查看黑風寨內的糧車，確認刻記與糧袋。';
  if(g.marksKnown)return '目前：由糧道谷關前往黑風寨，擊退鄧茂、奪回糧車。';
  if(g.trailKnown)return '目前：到徐州城西找糧隊管事確認糧車標記。';
  if(g.reported)return '目前：到徐州客棧找護衛隊長，詢問追糧線索。';
  if(g.captainGift)return '目前：回徐州城主府向糜竺報平安，安排隊長到客棧休養。';
  if(g.rescueWon)return '目前：與糧道茶站旁的受傷隊長交談，領取贈禮後回城覆命。';
  if(g.heardMing)return '目前：與糧道上的受傷隊長交談，開始救援。';
  if(g.routeKnown)return '目前：前往糧道谷關的茶站，向明叔打聽消息。';
  return '救回隊長、奪回糧車，經管事核對後完成糜竺覆命。';
 }
 function chapterRows(s){
  if(!window.PlayerOfficer?.get(s))return [];
  let party=[];try{party=JSON.parse(localStorage.getItem('three-kingdoms-taoyuan-dialogue-v1')||'{}').party||[];}catch{}
  const oath=!!s.storyEvents?.peachOath,farewell=!!s.rewards?.claims?.taoyuanMotherFarewell;
  const entries=[
   ['1-1','關張相識','sub',oath||party.includes('關羽')&&party.includes('張飛'),'關羽、張飛皆正式加入劇情同行。'],
   ['1-2','桃園三結義','sub',oath,'完成桃園結義演出。'],
   ['1-3','桃園首戰','sub',farewell,'完成護村、森林救援與劉母正式餞行。'],
   ['1','桃園聚義','main',oath&&farewell,'完成本章故事並向劉母正式辭行；掃蕩離村不代替完成。'],
   ['2-1','運糧護衛','sub',!!s.storyEvents?.grainRoute?.completed,grainObjective(s)],
   ['2-2','義勇成軍','sub',!!s.storyEvents?.grainRoute?.armyFormed,'完成護軍後，與陶謙完整交談並領取成軍防具與劉關張武將卡。'],
   ['2-3','糜家小女','sub',!!s.storyEvents?.grainRoute?.miRecruited,'完成護軍與糜竺說媒後，再次交談，取得糜竺相助。此階段尚未成婚。'],
   ['2-4','華陀初現','sub',!!s.storyEvents?.yunlongRescue?.bookGiven,'完成救援、回徐州留宿，再與華陀完成贈書對話。'],
['3-2','宛城討伐','sub',!!s.storyEvents?.wancheng?.completed,'擊退韓忠後安置百姓，再向朱儁完整覆命。'],
['han-campaign','漢軍會師','sub',!!s.storyEvents?.hanCampaign?.completed,'奉盧植之命前往長社，完成接應與解圍，送別盧植後隨朱儁南下聽取軍情。'],
['3-1','初戰黃巾','sub',!!s.storyEvents?.yellowOpening?.completed,'擊退鄧茂、程遠志，向前線軍吏交代，再回徐州向陶謙完成回報。']
  ];
  return entries.map(([chapter,name,type,done,desc])=>({id:'chapter-'+chapter,kind:'achievement',name:(type==='main'?'主章節':'副章節')+'・'+name,desc:desc+' 首次獎勵，可補領，原有獎勵不變。',value:+done,goal:1,coins:0,diamonds:0,playerFragments:chapterAmounts[type],chestCount:type==='main'?1:0,chestRewardKey:type==='main'?'chapter:'+chapter+':tier2-chest-v1':null,targetMode:'story',global:true,rewardKey:'chapter:'+chapter+':player-fragments-v1'}));
 }
 function rows(s){const r=sync(s),m=r.modes[s.mode],done=s.tutorial.status==='completed',skipped=s.tutorial.status==='skipped';return [
 {id:'tutorial',kind:'task',name:done?'完整教學獎勵':'首次入城獎勵',desc:done?'完成四段演練。舊版完成資格也可領取。':skipped?'跳過教學，領取基本獎勵。':'完成教學或確認跳過後領取。',value:done||skipped?1:0,goal:1,coins:done?200:100,letterCount:done?2:0,targetMode:'story',global:true},
 {id:'tutorialLetters',kind:'task',name:'教學字卡補領',desc:'已領過舊版教學金幣，可補領兩張蜀國青色單字卡，不重發金幣。',value:done&&!!r.claims.tutorial?1:0,goal:1,coins:0,letterCount:2,targetMode:'story',global:true},
 {id:'factions',kind:'task',name:'認識五方勢力',desc:'在字卡庫瀏覽魏、蜀、吳、群雄、東漢。',value:m.visited.length,goal:5,coins:100},
 {id:'team',kind:'task',name:'整備第一支隊伍',desc:'保存至少含一名已解鎖武將的隊伍。',value:+m.teamReady,goal:1,coins:100},
 {id:'graduate',kind:'achievement',name:'演武結業',desc:'完整完成四段教學；跳過不會解鎖。',value:+done,goal:1,coins:0,diamonds:5,targetMode:'story',global:true},
 {id:'taoyuanFunding',kind:'achievement',name:'三國人生啟動資助',desc:'完成張世平的贈禮對話，獲得第一筆起兵軍資。',value:+!!r.claims.taoyuanMerchant,goal:1,coins:0,diamonds:2,targetMode:'story',global:true},
 {id:'peachOath',kind:'achievement',name:'桃園三結義',desc:'劉備、關羽、張飛於桃園結為兄弟。',value:+!!s.storyEvents?.peachOath,goal:1,coins:0,diamonds:2,targetMode:'story',global:true},
 {id:'yunlongRescue',kind:'achievement',name:'仁心救援',desc:'於雲龍山協助華陀救醒小牛，與大牛、小牛回徐州留宿。',value:+!!s.storyEvents?.yunlongRescue?.completed,goal:1,coins:0,diamonds:2,targetMode:'story',global:true},
 {id:'collect1',kind:'achievement',name:'初識名將',desc:'累計解鎖一名武將。',value:s.unlocks[s.mode].heroes.length,goal:1,coins:0,diamonds:2},
 {id:'collect3',kind:'achievement',name:'群英初聚',desc:'累計解鎖三名不同武將。',value:s.unlocks[s.mode].heroes.length,goal:3,coins:0,diamonds:5}
 ,...chapterRows(s)].filter(x=>s.mode==='story'||['factions','team'].includes(x.id)).filter(x=>x.id!=='tutorialLetters'||(done&&r.claims.tutorial&&!r.claims.tutorial.letters?.length&&!r.claims.tutorialLetters)).map(x=>{const key=x.rewardKey||((x.global?x.id:s.mode+':'+x.id)+(x.kind==='achievement'?':diamonds-v1':''));const legacyKey=key.replace(/:diamonds-v1$/,'');const claimed=!!r.claims[key]||!!r.claims[legacyKey]||r.history.some(h=>h.key===key||h.key===legacyKey);const chestClaimed=x.chestRewardKey&&(!!r.claims[x.chestRewardKey]||r.history.some(h=>h.key===x.chestRewardKey||h.chestRewardKey===x.chestRewardKey));const topUp=!!x.chestRewardKey&&claimed&&!chestClaimed;return {...x,name:(s.mode==='battle'?'對戰 · ':'')+x.name,desc:x.desc+(topUp?' 已領玩家碎片，本次僅補領二級寶箱。':''),playerFragments:topUp?0:x.playerFragments,chestCount:chestClaimed&&!claimed?0:x.chestCount,diamonds:x.diamonds||0,key:topUp?x.chestRewardKey:key,claimed:x.chestRewardKey?claimed&&chestClaimed:claimed};});}

 function drawLetters(s,mode,count){
  const pool=[...new Set(OFFICER_PROPOSAL.entries.filter(p=>p.faction==='蜀').map(p=>p.name).join(''))];
  window.ChestSystem?.init(s);
  const owned=s.unlocks[mode];const fresh=pool.filter(ch=>!owned.letters.includes(ch)),old=pool.filter(ch=>owned.letters.includes(ch)),picked=[];
  // 優先抽尚未持有的字，同次不重複；若全持有仍保留張數，不重置成長。
  while(picked.length<count){const list=fresh.length?fresh:old;if(!list.length)throw Error('蜀國字卡池不足');const a=new Uint32Array(1);crypto.getRandomValues(a);picked.push(list.splice(Math.floor(a[0]/4294967296*list.length),1)[0]);}
  s.chests??={};const bag=s.chests[mode]??={};bag.letterProgress??={};bag.letterCopies??={};
  for(const ch of picked){if(!owned.letters.includes(ch))owned.letters.push(ch);bag.letterProgress[ch]??={level:1,xp:0,quality:'青'};bag.letterCopies[ch]=(bag.letterCopies[ch]||0)+1;}
  window.ChestSystem?.syncUnlocked(s);
  return picked;
 }
 function claim(s,id){const item=rows(s).find(x=>x.id===id);if(!item||item.claimed||item.value<item.goal)return null;const r=s.rewards,mode=item.targetMode||s.mode,m=window.SharedWallet.init(s);
  const chestBag=item.chestCount?window.ChestSystem.init(s):null;if(chestBag&&!Number.isSafeInteger((chestBag.boxes[2]||0)+item.chestCount))throw Error('寶箱數量超出範圍');
  const letters=item.letterCount?drawLetters(s,mode,item.letterCount):[];
  if(item.playerFragments){const player=window.PlayerOfficer?.get(s);if(!player)return null;if(!Number.isSafeInteger(player.fragments+item.playerFragments))throw Error('玩家碎片數值超出範圍');player.fragments+=item.playerFragments;}
  if(chestBag)chestBag.boxes[2]=(chestBag.boxes[2]||0)+item.chestCount;
  m.coins+=item.coins;m.diamonds+=item.diamonds;
  const record={key:item.key,name:item.name,mode,coins:item.coins,diamonds:item.diamonds,playerFragments:item.playerFragments||0,chestCount:item.chestCount||0,chestRewardKey:item.chestCount?item.chestRewardKey:null,letters,at:new Date().toISOString()};r.claims[item.key]=record;if(item.chestCount)r.claims[item.chestRewardKey]=record;r.history.unshift(record);if(id==='tutorial')s.tutorial.reward='claimed';return record;}
 return{init,sync,rows,claim,chapterAmounts};
})();
