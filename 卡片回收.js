'use strict';
window.CardRecycle=(()=>{
 const button=document.createElement('button');button.id='recycleCard';button.textContent='回收';button.title='選卡後點擊，或將卡片拖到這裡';document.querySelector('.supply-actions').append(button);
 const dialog=document.createElement('dialog');dialog.id='recycleDialog';dialog.setAttribute('aria-label','回收卡片確認');document.body.append(dialog);
 function value(type,level=1){const base=roster[type]?.skills.length?10:3;return Math.floor(base*(1+.2*(level-1))*.5+1e-8);}
 function request(source){if(!Recruit.enabled||!actionAllowed())return;const slot=typeof source==='number',u=slot?Recruit.saved(source):source,type=slot?deck[source]:u?.type;
 if(!type||!slot&&(!units.includes(u)||u.hp<=0))return say('請先選擇要回收的卡片。');
 if(u&&(u.ready>elapsed||u.root>elapsed))return say('定身或換位冷卻中，暫時不能回收。');
 const level=u?.level||1,amount=value(type,level),revision=Recruit.snapshot().revision;
 dialog.innerHTML='<h2>回收 '+type+' LV'+level+'？</h2><p>可取得 <strong>'+amount+' 軍糧</strong>。</p><p>移除這張當局卡片，不退還已吃掉的材料。已累積的參戰紀錄保留。</p>'+(slot&&Recruit.snapshot().locks.includes(source)?'<p>這張卡已設為保留，回收後一併解除保留。</p>':'')+'<p>確認期間戰鬥照常進行。</p><button id="cancelRecycle">取消</button> <button id="confirmRecycle">確認回收</button>';
 dialog.querySelector('#cancelRecycle').onclick=()=>dialog.close();dialog.querySelector('#confirmRecycle').onclick=()=>{
 if(!actionAllowed())return;
 const valid=slot?Recruit.snapshot().revision===revision&&deck[source]===type&&Recruit.saved(source)===u:units.includes(u)&&u.hp>0;
 if(!valid||(u?.level||1)!==level){dialog.close();say('卡片或等級已改變，請重新確認回收。');return;}
 if(u&&(u.ready>elapsed||u.root>elapsed)){dialog.close();say('卡片目前定身或換位冷卻中，未回收。');return;}
 if(slot)Recruit.consume(source);else{units=units.filter(v=>v!==u);shots=shots.filter(p=>p.target!==u);}
 if(u)u.recycled=true;Recruit.reward(amount);selected=null;card=null;moving=false;dialog.close();sync();say('已回收'+type+'，取得 '+amount+' 軍糧。');
 };dialog.showModal();}
 button.onclick=()=>request(selected||card);
 return{value,request,hit(e){return !!document.elementFromPoint(e.clientX,e.clientY)?.closest('#recycleCard');}};
})();
