'use strict';
window.ExperiencePreview=(()=>{
 const categories=[{weight:.4,value:r=>r.damage||0},{weight:.25,value:r=>r.absorbed||0},{weight:.25,value:r=>(r.healing||0)+(r.shieldSupport||0)},{weight:.1,value:r=>r.control||0}];
 function calculate(report,owned,stamina=true){
  const rows=report.rows,total=Math.floor((report.rewardXP||0)*(report.win?1:.25)*(stamina?1:.2)),time=rows.map(r=>Math.max(0,r.time)*(roster[r.name]?.skills.length?4:1)),timeSum=time.reduce((a,b)=>a+b,0);
  const active=categories.map(c=>({...c,sum:rows.reduce((sum,r)=>sum+Math.max(0,c.value(r)),0)})).filter(c=>c.sum>0),weight=active.reduce((sum,c)=>sum+c.weight,0);
  const contribution=rows.map(r=>active.reduce((sum,c)=>sum+(c.weight/weight)*Math.max(0,c.value(r))/c.sum,0)),parts=new Map();
  rows.forEach((r,i)=>{const base=timeSum?time[i]/timeSum:contribution[i]||0,score=weight?contribution[i]:base,amount=total*(.6*base+.4*score),letters=[...r.name];for(const ch of letters)parts.set(ch,(parts.get(ch)||0)+amount/letters.length);});
  const items=[...parts].map(([letter,amount])=>({letter,amount:Math.floor(amount+1e-9),fraction:amount-Math.floor(amount+1e-9),owned:owned.has(letter)}));
  let remainder=(timeSum||weight?total:0)-items.reduce((sum,r)=>sum+r.amount,0);const order=[...items].sort((a,b)=>b.fraction-a.fraction||a.letter.codePointAt(0)-b.letter.codePointAt(0));for(let i=0;i<remainder;i++)order[i%order.length].amount++;
  return{total,items,eligible:items.reduce((sum,r)=>sum+(r.owned?r.amount:0),0),unowned:items.reduce((sum,r)=>sum+(!r.owned?r.amount:0),0),unallocated:timeSum||weight?0:total};
 }
 function settleStory(report){
  const runId=window.VillageSweep?.save()?.runId;if(!runId)throw Error('缺少戰局識別');
  const key='three-kingdoms-interface-preview-v1',state=JSON.parse(localStorage.getItem(key)||'{}');state.chests??={};const mode=state.chests.story??={};mode.letterProgress??={};mode.experienceReceipts??={};
  if(mode.experienceReceipts[runId])return mode.experienceReceipts[runId];
  const owned=new Set([...(state.unlocks?.story?.letters||[]),...(state.unlocks?.battle?.letters||[]),'刀','槍','弓']);
  const result=calculate(report,owned,true),changes=[];
  for(const item of result.items){if(!item.owned||!item.amount)continue;const card=mode.letterProgress[item.letter]??={level:1,xp:0,quality:'青'};const before=card.level;card.xp+=item.amount;while(card.level<100&&card.xp>=100*card.level){card.xp-=100*card.level;card.level++;}if(card.level>=100)card.xp=0;changes.push({letter:item.letter,amount:item.amount,before,level:card.level,xp:card.xp});}
  const receipt={at:Date.now(),total:result.eligible,unowned:result.unowned,changes};mode.experienceReceipts[runId]=receipt;localStorage.setItem(key,JSON.stringify(state));return receipt;
 }
 function render(dialog,report){
  if(window.VillageSweep){const box=document.createElement('section');box.id='xpPreview';dialog.querySelector('.result-actions').before(box);try{const r=settleStory(report);box.innerHTML='<h3>字卡養成經驗 · 已保存</h3><p>本場入帳 '+r.total+' 經驗'+(r.unowned?'；未持有字卡不入帳 '+r.unowned:'')+'。</p>'+r.changes.map(c=>'<p>'+c.letter+'　＋'+c.amount+' 經驗 · LV '+c.level+(c.level>c.before?'（升級）':'')+' · '+(c.level>=100?'已滿級':c.xp+'／'+100*c.level)+'</p>').join('');}catch{box.textContent='養成經驗尚未保存，請重新開啟戰報重試。';}return;}

  const box=document.createElement('details');box.id='xpPreview';box.innerHTML='<summary>永久經驗分配試算</summary><p>僅供檢查分配，不會寫入永久字卡庫。</p><label><input id="xpStamina" type="checkbox" checked> 視為有體力</label><details><summary>持有字卡假設（勾選視為已持有）</summary><div id="xpOwned"></div></details><div id="xpTotals"></div><div class="result-scroll"><table><thead><tr><th>字卡</th><th>分配份額</th><th>預計入帳</th></tr></thead><tbody id="xpLetters"></tbody></table></div><p>60%：參戰時間 × 武將4／散字兵種1；40%：戰鬥貢獻。武將所得均分各字，再合併同字份額。整數尾差依小數餘額補齊後，才排除未持有字，未持有份額不轉送。</p><details><summary>查看測試評分方式</summary><p>傷害40%、承傷25%、有效治療與護盾25%、控制10%。各類先按全隊占比計分，不直接混加傷害與秒數；無紀錄的類別按比例分給其他類別。全隊無貢獻時回歸參戰時間，完全無有效權重則不分配。</p><p>有效護盾只計實際吸收；控制計生效秒數，同一敵人同時受到多個來源控制時分攤秒數。以上係數為測試值。</p><p>基礎經驗暫以本場已擊殺敵軍的經驗加總試算。勝利100%、戰敗／撤退25%；無體力再乘20%。舊存檔未記錄的擊殺經驗不回補。</p></details>';
  dialog.querySelector('.result-actions').before(box);const letters=[...new Set(report.rows.flatMap(r=>[...r.name]))],owned=new Set(letters);
  for(const letter of letters){const label=document.createElement('label');label.style.cssText='display:inline-block;margin:4px 8px 4px 0';const check=document.createElement('input');check.type='checkbox';check.checked=true;check.dataset.letter=letter;label.append(check,letter);box.querySelector('#xpOwned').append(label);check.onchange=()=>{check.checked?owned.add(letter):owned.delete(letter);update();};}
  function update(){const data=calculate(report,owned,box.querySelector('#xpStamina').checked);box.querySelector('#xpTotals').textContent='試算總額 '+data.total+' · 預計入帳 '+data.eligible+' · 未持有不入帳 '+data.unowned+(data.unallocated?' · 無有效權重 '+data.unallocated:'');box.querySelector('#xpLetters').innerHTML=data.items.map(r=>'<tr><td>'+r.letter+(r.owned?'':'（未持有）')+'</td><td>'+r.amount+'</td><td>'+(r.owned?r.amount:0)+'</td></tr>').join('');}
  box.querySelector('#xpStamina').onchange=update;update();
 }
 const style=document.createElement('style');style.textContent='#xpPreview{border-top:1px solid #526146;padding-top:8px;font-size:12px}#xpPreview summary{cursor:pointer;padding:5px 0;color:#efda9c}#xpPreview p{font-size:11px}#xpTotals{padding:8px 0;line-height:1.6}';document.head.append(style);
 return{calculate,render};
})();
