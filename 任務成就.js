'use strict';
window.ProgressRewards=(()=>{
 const number=x=>Number.isSafeInteger(x)&&x>=0?x:0;
 function init(s){s.rewards??={};const r=s.rewards;r.claims??={};r.history=Array.isArray(r.history)?r.history:[];r.modes??={};for(const mode of ['story','battle']){const m=r.modes[mode]??={};m.coins=number(m.coins);m.diamonds=number(m.diamonds);m.visited=Array.isArray(m.visited)?[...new Set(m.visited)]:[];m.teamReady=!!m.teamReady;}return r;}
 function sync(s){window.ChestSystem?.syncUnlocked(s);const r=init(s);for(const mode of ['story','battle']){if(Object.entries(s.teams).some(([k,t])=>(mode==='battle'?k==='battle':k.startsWith('story:'))&&t.slots?.some(n=>s.unlocks[mode].heroes.includes(n))))r.modes[mode].teamReady=true;}return r;}
 function rows(s){const r=sync(s),m=r.modes[s.mode],done=s.tutorial.status==='completed',skipped=s.tutorial.status==='skipped';return [
 {id:'tutorial',kind:'task',name:done?'完整教學獎勵':'首次入城獎勵',desc:done?'完成四段演練。舊版完成資格也可領取。':skipped?'跳過教學，領取基本獎勵。':'完成教學或確認跳過後領取。',value:done||skipped?1:0,goal:1,coins:done?200:100,letterCount:done?2:0,targetMode:'story',global:true},
 {id:'tutorialLetters',kind:'task',name:'教學字卡補領',desc:'已領過舊版教學金幣，可補領兩張蜀國青色單字卡，不重發金幣。',value:done&&!!r.claims.tutorial?1:0,goal:1,coins:0,letterCount:2,targetMode:'story',global:true},
 {id:'factions',kind:'task',name:'認識五方勢力',desc:'在字卡庫瀏覽魏、蜀、吳、群雄、東漢。',value:m.visited.length,goal:5,coins:100},
 {id:'team',kind:'task',name:'整備第一支隊伍',desc:'保存至少含一名已解鎖武將的隊伍。',value:+m.teamReady,goal:1,coins:100},
 {id:'graduate',kind:'achievement',name:'演武結業',desc:'完整完成四段教學；跳過不會解鎖。',value:+done,goal:1,coins:0,diamonds:5,global:true},
 {id:'taoyuanFunding',kind:'achievement',name:'三國人生啟動資助',desc:'完成張世平的贈禮對話，獲得第一筆起兵軍資。',value:+!!r.claims.taoyuanMerchant,goal:1,coins:0,diamonds:2,targetMode:'story',global:true},
 {id:'peachOath',kind:'achievement',name:'桃園三結義',desc:'劉備、關羽、張飛於桃園結為兄弟。',value:+!!s.storyEvents?.peachOath,goal:1,coins:0,diamonds:2,targetMode:'story',global:true},
 {id:'collect1',kind:'achievement',name:'初識名將',desc:'累計解鎖一名武將。',value:s.unlocks[s.mode].heroes.length,goal:1,coins:0,diamonds:2},
 {id:'collect3',kind:'achievement',name:'群英初聚',desc:'累計解鎖三名不同武將。',value:s.unlocks[s.mode].heroes.length,goal:3,coins:0,diamonds:5}
 ].filter(x=>x.id!=='tutorialLetters'||(done&&r.claims.tutorial&&!r.claims.tutorial.letters?.length&&!r.claims.tutorialLetters)).map(x=>{const key=(x.global?x.id:s.mode+':'+x.id)+(x.kind==='achievement'?':diamonds-v1':'');return {...x,diamonds:x.diamonds||0,key,claimed:!!r.claims[key]};});}

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
 function claim(s,id){const item=rows(s).find(x=>x.id===id);if(!item||item.claimed||item.value<item.goal)return null;const r=s.rewards,mode=item.targetMode||s.mode,m=r.modes[mode];
  const letters=item.letterCount?drawLetters(s,mode,item.letterCount):[];
  m.coins+=item.coins;m.diamonds+=item.diamonds;
  const record={key:item.key,name:item.name,mode,coins:item.coins,diamonds:item.diamonds,letters,at:new Date().toISOString()};r.claims[item.key]=record;r.history.unshift(record);if(id==='tutorial')s.tutorial.reward='claimed';return record;}
 return{init,sync,rows,claim};
})();
