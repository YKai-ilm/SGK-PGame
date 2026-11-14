'use strict';
(()=>{
 if(window.TutorialBattleConfig)return;
 const root=document.createElement('section');root.id='battleShortcuts';root.setAttribute('aria-label','戰場計策與道具');root.innerHTML='<div class="shortcut-main"><button id="tacticToggle" aria-expanded="false" aria-controls="tacticChoices">計策</button><button id="itemToggle" aria-expanded="false" aria-controls="itemChoices">道具</button></div><div id="tacticChoices" class="shortcut-choices" hidden></div><div id="itemChoices" class="shortcut-choices" hidden></div><p id="shortcutStatus" role="status"></p>';
 const anchor=document.getElementById('cards');anchor.before(root);
 const style=document.createElement('style');style.textContent='#battleShortcuts{flex-shrink:0;padding:5px;background:#172c21;border:1px solid #8b9875;border-radius:6px;color:#efe6c9}.shortcut-main{display:flex;gap:6px}.shortcut-main button{flex:1;min-height:36px}.shortcut-choices{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;margin-top:5px}.shortcut-choices[hidden]{display:none}.shortcut-choices button{min-width:0;min-height:48px;padding:3px;font-size:12px;white-space:normal;overflow-wrap:anywhere}.shortcut-choices button small{display:block;font-size:10px}.shortcut-choices button[aria-disabled="true"]{opacity:.55}#shortcutStatus{margin:3px 0 0;font-size:11px;line-height:1.35}#shortcutStatus:empty{display:none}#restoreBody{display:none!important}';document.head.append(style);
 const $=id=>document.getElementById(id),key='three-kingdoms-interface-preview-v1';let panel=null,busy=false,lastRefresh=0;
 function profile(){const s=JSON.parse(localStorage.getItem(key)||'{}'),mode=window.VillageSweep||window.VillageDefense?.active?'story':s.mode==='battle'?'battle':'story',team=s.teams?.[mode==='story'?'story:'+(s.storyFaction||'蜀'):'battle'];return {s,mode,team};}
 function status(text){$('shortcutStatus').textContent=text;}
 function close(){panel=null;update();}
 const categories=[['策攻','攻擊性計策'],['策防','防禦與恢復'],['策謀','控制與持續效果'],['策裝','裝備授予計策'],['特策','軍師專屬計策']];
 function tacticReason(i,q=window.QingnangCombat?.save()){if(i!==3)return '此類計策尚未實裝。';if(!q?.strategist||!q.holders.includes(q.strategist))return '軍師尚未裝備青囊書（殘）。';if(!running||ended)return '請在進行中的戰鬥使用。';if(window.BattleSave?.pending)return '請先處理戰鬥存檔。';if(q.ready>elapsed)return '復體術冷卻中。';if(q.points<10)return 'SP不足。';if(!units.some(u=>u.hero&&u.hp>0&&u.hp<u.max))return '沒有需要恢復的存活武將。';return '';}
 const tacticButtons=categories.map(([name,desc],i)=>{const b=document.createElement('button');b.type='button';b.innerHTML=name+'<small></small>';b.title=desc;b.onclick=()=>{const reason=tacticReason(i);if(reason){status(reason);return;}if(window.QingnangCombat.cast()){status('已施放復體術（目前仍採測試版10 SP，正式消耗待重算）。');close();}};$('tacticChoices').append(b);return b;});
 const itemButtons=Array.from({length:5},(_,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML='<span></span><small></small>';b.onclick=()=>useItem(i);$('itemChoices').append(b);return b;});
 function update(){try{
  $('tacticChoices').hidden=panel!=='tactic';$('itemChoices').hidden=panel!=='item';
  $('tacticToggle').setAttribute('aria-expanded',String(panel==='tactic'));$('itemToggle').setAttribute('aria-expanded',String(panel==='item'));
  if(panel==='tactic'){
   const q=window.QingnangCombat?.save();
   tacticButtons.forEach((b,i)=>{b.setAttribute('aria-disabled',String(!!tacticReason(i,q)));setText(b.querySelector('small'),i===3&&q?.strategist&&q.holders.includes(q.strategist)?'復體術 · 試用':'尚無可用');});
  }else if(panel==='item'){
   const {s,mode,team}=profile(),slots=BattleShortcuts.slots(s,mode,team);
   itemButtons.forEach((b,i)=>{const item=BattleShortcuts.catalog.find(v=>v.id===slots[i]),n=item?BattleShortcuts.count(s,mode,item.id):0;
    setText(b.querySelector('span'),item?item.name:'空位');setText(b.querySelector('small'),item?'×'+n+(item.ready?'':' · 待設定'):'隊伍中配置');
    b.disabled=busy||!item||!n||!item.ready||mode!=='story'||!Recruit.enabled||ended||!!window.BattleSave?.pending;b.title=item?.description||'請到隊伍整備配置道具。';});
  }
 }catch{status('無法讀取道具配置，請檢查存檔。');}}
 function setText(node,value){if(node.textContent!==value)node.textContent=value;}
 async function useItem(i){if(busy)return;busy=true;try{const run=()=>{const {s,mode,team}=profile(),id=BattleShortcuts.slots(s,mode,team)[i];if(id!=='foodVoucher'||mode!=='story'||!Recruit.enabled||!actionAllowed()||window.BattleSave?.pending)return false;if(!StorySupplies.spend())return false;Recruit.reward(200);return true;};const used=navigator.locks?await navigator.locks.request('battle-item-use',run):run();if(used){window.BattleSave?.write();status('軍糧兌換卡 −1，軍糧＋200。');close();}else status('目前無法使用此道具，未扣除。');}catch{status('道具未能保存，未完成使用，請重試。');}finally{busy=false;update();}}
 $('tacticToggle').onclick=()=>{panel=panel==='tactic'?null:'tactic';status('');update();};$('itemToggle').onclick=()=>{panel=panel==='item'?null:'item';status('');update();};
 document.addEventListener('pointerdown',e=>{if(panel&&!root.contains(e.target))close();});document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});addEventListener('storage',()=>{if(panel)update();});
 // No combat scans or storage reads while collapsed; open-panel previews are throttled.
 setInterval(()=>{if(panel&&!document.hidden&&performance.now()-lastRefresh>=250){lastRefresh=performance.now();update();}},250);update();
})();
