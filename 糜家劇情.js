'use strict';
window.MiFamilyStory=(()=>{
 const elder='我糜家雖富甲一方，卻始終被士族輕視，只因我們世代經商未有武人與官方人士。';
 const fangBefore='文人讀書識字，武人習武參戰，要選擇誰呢？';
 const fangAfter='看爹煩惱的狀況，我又不是個讀書的料子，還是習武好了。';
 const zhenBefore='看爹一直眉頭深鎖，不知道怎樣才能幫上爹爹。';
 const zhenStart=[['糜貞','貴客您來徐州城，是參軍嗎？'],['糜貞（心想）','看劉備有種天然呆的氣息，但又閃耀著與眾不同的光芒。']];
 const shy='.....（害羞）';
 const familyVisit=[['糜太公','子仲已將婚事告訴老夫。玄德護軍救民，老夫看重的是這份仁義，並非官爵家財。'],['劉備','蒙太公厚愛，備心中感激。只是四方未靖，恐怕讓令愛隨我受苦。'],['糜竺','父親，我回來了。玄德肯為百姓奔走，小妹的眼光果然不差。'],['糜太公','婚姻不可只憑父兄作主。貞兒就在這裡，你親自問問她的心意吧。'],['糜竺','我還得回城主府料理公務。你們慢慢談，待有了定意，再來告訴我。']];
 const promise=[['糜貞','父兄的話，我都聽見了。玄德，我敬重你願意護人的心，不求你以富貴相許。'],['劉備','備願與姑娘相守，只是征途未定，不能許你眼前安逸。你可願等我？'],['糜貞','我願意。你在外照顧百姓，也要記得保重自己。'],['糜太公','既然兩人同心，這門親事便先定下。禮數與婚期，待局勢安穩再議。'],['劉備','備必不負這份信任。我這便去城主府向子仲報個喜訊。']];
 const reunion=[['糜竺','妹夫，你總算來了！小妹已託人捎信，父親也十分歡喜。'],['劉備','子仲，婚期雖尚未定，備已將這份承諾放在心上。往後定會珍重她。'],['糜竺','一家人便不說兩家話。你救回護軍、保住糧食，我早已看見你的志向。往後軍需調度，讓我也出一份力。'],['劉備','有子仲相助，義勇便多一分根基。備願與你同心護民！'],['糜竺','好！家事有我照應，軍中若需人手，儘管相邀。']];
 function npc(id,flags){
  if(flags.miMatchmakingDiscussed){
   if(id==='miElder')return flags.miFamilyVisited?{lines:[['糜太公',flags.miZhenPromised?'親事已定，婚期不急。你們彼此珍重，老夫便放心了。':'子仲已回城主府，你去問問貞兒的心意吧。']]}:{lines:familyVisit,action:'miFamilyVisited'};
   if(id==='miZhen')return flags.miZhenPromised?{lines:[['糜貞','出門在外，別只顧著旁人。記得平安回來，我等你。']]}:flags.miFamilyVisited?{lines:promise,action:'miZhenPromised'}:{lines:[['糜貞','兄長說你今日會來，爹爹正在等你。先去和他說說話吧。']]};
   if(id==='miFang')return {lines:[['糜芳',flags.miZhenPromised?'以後就是一家人了！我也得加緊習武，不能總讓兄長操心。':'兄長特意回來談小妹的婚事，爹爹今天總算有了笑容。']]};
  }
  if(id==='miElder')return {lines:[['糜太公',elder]],action:'miElderHeard'};
  if(id==='miFang')return {lines:[['糜芳',flags.miElderHeard?fangAfter:fangBefore]]};
  if(id==='miZhen')return flags.miZhenAwaitingMarriage?{lines:[['糜貞',shy]]}:flags.miElderHeard?{lines:zhenStart,action:'miZhenAwaitingMarriage'}:{lines:[['糜貞',zhenBefore]]};
  return null;
 }
 function canMatchmake(flags){return flags.miZhenAwaitingMarriage===true&&flags.volunteerArmyFormed===true&&!flags.miMatchmakingDiscussed;}
 function matchmaking({party=[],sworn=false,visitors=[]}={}){
  const guan=party.includes('關羽'),zhang=party.includes('張飛'),both=guan&&zhang;
  const lines=[['糜竺','劉壯士，您的表現真的令人刮目相看，不知您是否已有娶妻？']];
  if(guan)lines.push(['關羽',sworn&&both?'大哥自與我和三弟結拜後，身旁只有我們兩個粗漢子，似乎也該有個老婆了！':sworn?'大哥身旁總是我這粗漢子，似乎也該有個老婆了！':'劉壯士身旁盡是我等粗漢子，似乎也該有個老婆了！']);
  if(zhang)lines.push(['張飛',`俺就說，${sworn?'大哥':'劉壯士'}天生一表人才，看！糜別駕就要當個說媒人了，哈哈哈哈！`]);
  const address=both?(sworn?'二弟、三弟':'雲長、翼德'):guan?(sworn?'二弟':'雲長'):zhang?(sworn?'三弟':'翼德'):'';
  lines.push(['劉備',(address?address+(both?'，你們就別添亂了，':'，你就別添亂了，'):'')+'男兒志在四方，當貢獻於天下，為百姓謀福祉，況且，尚未功成名就，何談娶妻呢？']);
  lines.push(['糜竺','哈哈，說的是極，然功成名就對壯士而言，只待時日必可達成，娶妻呢？不若敝人介紹一人，雖自誇自賣，但可算是溫柔賢淑。'],['糜竺','介紹的人乃吾之小妹，糜貞，父親時時念叨小妹已至待嫁年紀，惟遲未有適恰之人，我觀壯士一身豪氣，又重義氣，且似有一股王霸之氣。']);
  const count=new Set(visitors.filter(n=>['關羽','張飛'].includes(n))).size;
  lines.push(['劉備',`喔？那可巧合了，${count===2?'我們三人':count===1?'我與同伴':'我'}日前才至貴府叨擾不少時間，有看到貴妹，當真閉月羞花。`],['糜竺','那真是太好了！回頭我就與老父親說說，讓您二人多相處些時日，若兩廂情願，自當盡快嫁娶。請再到城西糜家拜訪父親，當面問問小妹的心意。']);
  return lines;
 }
 const guideRows=[['糜太公／先行交談',elder+' 完整說完後記錄已聽取家事。'],['糜芳／未聽糜太公說話',fangBefore],['糜貞／未聽糜太公說話',zhenBefore],['糜芳／聽糜太公說完後',fangAfter],['糜貞／聽糜太公說完後',zhenStart.map(([s,t])=>s+'：'+t).join(' ')+' 完整對話後觸發「糜貞待嫁」。'],['糜貞／待嫁觸發後',shy+' 說媒前重談維持此句；說媒後改為再訪糜家對話。'],['糜竺／說媒前置','已觸發糜貞待嫁，且完成義勇成軍，才於再次交談時說媒。須完成陶謙正式成軍對話；不可用護糧接案或次日失聯代替。兩項前置可任意先後完成。'],['糜竺／說媒完成後','說媒後再訪糜家：糜太公對話中糜竺暫時登場，完整結束後離開；再與糜貞確認心意、定下親事，回城主府聽完妹夫對話取得糜竺卡。婚期另議，尚未舉行婚禮；舊存檔不重複發卡。'],['同行與稱呼','只讓實際同行的關羽、張飛發言；未結義不稱兄弟。劉備回憶拜訪的人數依觸發待嫁時的同行紀錄。'],['離開／下方門口','返回徐州城西。']];
 return {npc,canMatchmake,matchmaking,guideRows,familyVisit,promise,reunion};
})();
