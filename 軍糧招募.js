'use strict';
// 過渡測試：散字／兵種池，尚未替代正式七將候選拆字池。
window.Recruit=(()=>{
const reserves=new Map();const original=[...deck],buttons=[...document.querySelectorAll('.card')];let enabled=false,food=200,locks=new Set(),revision=0;let pool=[...new Set([...original.slice(0,7).join('')]),...original.slice(7)];let initial=[...'劉備關羽張飛趙雲諸葛亮','刀'];let heroPool=original.slice(0,7);
const box=document.createElement('div');box.className='supply';box.innerHTML='<button id="supplyMode">切換軍糧招募（重開）</button><div id="supplyBody" hidden><strong id="foodCount"></strong><div class="supply-actions"><button id="refreshRecruit">刷新</button><button id="lockRecruit">保留選卡</button></div><small>七將散字測試池 · 部署消耗卡片<br>刷新 100；保留每張加 5；未保留剩卡依等級折價回收。</small></div>';$('cards').before(box);
function seedBasics(){if(!enabled)return;for(const [i,type]of deck.entries())if(BasicTroops.types.includes(type)&&!reserves.has(i))reserves.set(i,makeUnit(type,-1,-1));}
function paint(){seedBasics();buttons.forEach((b,i)=>{const type=deck[i];b.hidden=i>=deck.length;b.disabled=!type;b.classList.toggle('locked',locks.has(i));if(!type){b.innerHTML='<span class="empty-slot">空位</span>';b.title='已部署，刷新可補充';b.removeAttribute('data-unit');b.style.setProperty('--quality-fill','#26372e');return;}const q=QualityArt.colors(type);b.style.setProperty('--quality-fill',q.fill);b.style.setProperty('--quality-ink',q.ink);b.dataset.unit=type;b.innerHTML='<span class="unit-name">'+type+'</span>'+(locks.has(i)?'<span class="lock-badge">留</span>':'')+(reserves.get(i)?.level>1?'<span class="card-level">Lv'+reserves.get(i).level+'</span>':'');b.title=skillInfo(type);});}
function update(){
 buttons.forEach((b,i)=>{const u=reserves.get(i),seconds=u?Math.max(0,Math.ceil(u.ready-elapsed)):0;let badge=b.querySelector('.reserve-cooldown');
 b.classList.toggle('relocating',seconds>0);
 if(seconds){if(!badge){badge=document.createElement('span');badge.className='reserve-cooldown';b.append(badge);}const label='換位 '+seconds+'秒';if(badge.textContent!==label)badge.textContent=label;}
 else badge?.remove();
 });
 if(!enabled)return;setBattleText($('foodCount'),'軍糧 '+food);setBattleText($('refreshRecruit'),'刷新 '+(100+locks.size*5));setBattleText($('lockRecruit'),card!==null&&locks.has(card)?'取消保留':'保留選卡');$('lockRecruit').disabled=card===null||!deck[card];}
function drawBatch(count){
 if(window.VillageDefense?.active)return Array.from({length:count},(_,i)=>VillageDefense.heroes[i]||'');
 // 每次刷新抽一次類型；各武將由當局七名候選中不重複抽出。
 const roll=Math.random(),mode=roll<.4?'single':roll<.6?'pair':roll<.7?'complete':roll<.75?'triple':'none';
 const shuffled=[...new Set(heroPool)];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
 const cards=[];
 if(mode==='complete'){
  // 空位不足時不拆散完整組，也不覆蓋保留卡；沒有合適名字則補兵種。
  const name=shuffled.find(name=>Array.from(name).length<=count);if(name)cards.push(...Array.from(name));
 }else{
  const limit={single:1,pair:2,triple:3,none:0}[mode];
  for(const name of shuffled.slice(0,Math.min(limit,count))){const letters=Array.from(name);cards.push(letters[Math.floor(Math.random()*letters.length)]);}
 }
 const basic=['刀','槍','弓'];while(cards.length<count)cards.push(basic[Math.floor(Math.random()*basic.length)]);
 return cards;
}
function resetStock(){reserves.clear();revision++;food=200;locks.clear();deck.splice(0,deck.length,...(enabled?(window.TutorialBattleConfig?initial.slice(0,7):drawBatch(7)):original.slice(0,7)));paint();update();}
$('supplyMode').onclick=()=>{enabled=!enabled;$('supplyBody').hidden=!enabled;$('supplyMode').textContent=enabled?'切回直接部署（重開）':'切換軍糧招募（重開）';reset();const note=document.querySelector('.note');if(note)note.textContent=enabled?'軍糧招募測試 · 散字／兵種池，可組將、補料升級；尚未接永久養成。':'直接部署不扣糧 · 技能自動施放；尚未接入永久養成。';say(enabled?'軍糧測試：開局 200、首批免費，部署後卡片會消耗。':'已回到不限量直接部署測試。');};
$('lockRecruit').onclick=()=>{if(!actionAllowed()||card===null||!deck[card])return;locks.has(card)?locks.delete(card):locks.add(card);paint();sync();say('保留卡留在原位，每次刷新額外花費 5 軍糧。');};
$('refreshRecruit').onclick=()=>{if(!actionAllowed())return;const available=deck.map((v,i)=>i).filter(i=>!locks.has(i));if(!available.length)return say('全部已保留，請先解除部分保留。');const cost=100+locks.size*5;if(food<cost)return say('軍糧不足，需要 '+cost+'；目前 '+food+'。');const refund=available.reduce((sum,i)=>sum+(deck[i]?(window.CardRecycle?.value(deck[i],reserves.get(i)?.level||1)??2):0),0);revision++;food-=cost;food+=refund;const batch=window.TutorialBattleConfig?.draw?null:drawBatch(available.length);for(const [j,i] of available.entries()){reserves.delete(i);deck[i]=window.TutorialBattleConfig?.draw?TutorialBattleConfig.draw(i):batch[j];}card=null;paint();sync();say('刷新花費 '+cost+'，未保留剩卡折舊返還 '+refund+' 軍糧。');};
function swapField(u,i){
 if(!enabled||!actionAllowed()||!units.includes(u)||u.hp<=0||!deck[i])return false;
 const other=reserves.get(i),type=deck[i];
 if(u.root>elapsed||u.ready>elapsed||other&&(other.root>elapsed||other.ready>elapsed)){say('定身或換位冷卻中，暫時不能交換。');return false;}
 if(!placeAllowed(u.x,u.y))return false;
 if(roster[type].skills.length&&units.some(v=>v!==u&&v.type===type)){say('同名武將只能有一名在場。');return false;}
 const incoming=other||makeUnit(type,u.x,u.y);incoming.x=u.x;incoming.y=u.y;
 for(const v of [u,incoming])v.ready=elapsed+(['投','塔'].includes(v.type)?5:2)*(v.slow>elapsed?1.5:1);
 delete u.dragonCombo;delete u.arrowCombo;delete u.thrustCombo;delete u.lingCombo;delete incoming.dragonCombo;delete incoming.arrowCombo;delete incoming.thrustCombo;delete incoming.lingCombo;units[units.indexOf(u)]=incoming;shots=shots.filter(p=>p.target!==u);revision++;deck[i]=u.type;clearLetterWard(u);reserves.set(i,u);locks.delete(i);selected=incoming;card=null;moving=false;paint();sync();say('已交換'+u.type+'與'+type+'；撤出卡片需另行付費保留。');return true;
}
function swapSlots(a,b){
 if(!enabled||!actionAllowed()||a===b||!deck[a]||b<0||b>=deck.length)return false;
 const first=reserves.get(a),second=reserves.get(b),lockedA=locks.has(a),lockedB=locks.has(b);
 [deck[a],deck[b]]=[deck[b],deck[a]];reserves.delete(a);reserves.delete(b);if(first)reserves.set(b,first);if(second)reserves.set(a,second);
 locks.delete(a);locks.delete(b);if(lockedA)locks.add(b);if(lockedB)locks.add(a);revision++;card=b;paint();sync();say('已調整招募卡片位置。');return true;
}
resetStock();
return{activateStory(){enabled=true;$('supplyBody').hidden=false;$('supplyMode').textContent='切回直接部署（重開）';},saveState:()=>({enabled,food,locks:[...locks],cards:[...deck],reserves:[...reserves]}),loadState(data){enabled=data.enabled;food=data.food;locks=new Set(data.locks);reserves.clear();for(const [i,u]of data.reserves)reserves.set(i,u);deck.splice(0,deck.length,...data.cards);revision++;$('supplyBody').hidden=!enabled;$('supplyMode').textContent=enabled?'切回直接部署（重開）':'切換軍糧招募（重開）';paint();update();},swapField,swapSlots,get enabled(){return enabled;},configure(names){heroPool=[...names];pool=[...new Set([...names.join('')]),...(window.VillageSweep?['刀','槍','弓']:original.slice(7))];const basic=window.VillageSweep?['刀','槍','弓']:['刀'];initial=[...new Set([...names.join('')])].slice(0,7-basic.length);while(initial.length<7-basic.length)initial.push(pool[initial.length%pool.length]);initial.push(...basic);},saved:i=>reserves.get(i),replace(i,u){revision++;deck[i]=u.type;reserves.set(i,u);paint();update();},store(i,u){if(deck[i])return false;revision++;deck[i]=u.type;clearLetterWard(u);reserves.set(i,u);locks.delete(i);paint();update();return true;},retreat(u,slot){const i=slot===undefined?deck.findIndex(v=>!v):slot;if(!deck.some(v=>!v)){say('招募區已滿，無法撤出到招募區；字卡回到原本戰場位置。');return false;}if(!Number.isInteger(i)||i<0||i>=deck.length||deck[i]){say('請拖到招募區的空格；字卡回到原本戰場位置。');return false;}delete u.dragonCombo;delete u.arrowCombo;delete u.thrustCombo;delete u.lingCombo;revision++;deck[i]=u.type;clearLetterWard(u);reserves.set(i,u);locks.delete(i);paint();update();return true;},reset:resetStock,sync:update,consume(i){if(enabled){revision++;reserves.delete(i);deck[i]='';locks.delete(i);paint();}},wave(){if(enabled){food+=100;update();}},reward(value){if(enabled){food+=value;update();}},snapshot:()=>({enabled,food,revision,locks:[...locks],cards:[...deck]})};
})();
