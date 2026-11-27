'use strict';
window.SwallowMenus=(()=>{
 const g=FiveVFiveGame,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let faction='蜀',search='';
 const roster=()=>OFFICER_PROPOSAL.entries.filter(p=>!p.playerCard);
 function progress(person){const owned=SwallowChests.owned().get(person.name),q=OFFICER_QUALITY.evaluate(person).quality,fragments=g.read().shop?.fragments?.[person.name]||0,need=window.OfficerStarCosts?.[q]?.find(r=>r.fromStar===1)?.fragments;return (owned?'LV '+(owned.level||1)+' · '+(owned.stars||1)+' 星':'— 星')+' · 碎片 '+fragments+'/'+(need??'待定');}
 function panel(person,kind){
  const body=document.getElementById('noticeBody'),owned=SwallowChests.owned().get(person.name);
  document.getElementById('noticeTitle').textContent=person.name+' · '+{ability:'能力',equipment:'裝備',bonds:'羈絆'}[kind];
  if(kind==='ability'){const value=SwallowGrowth.stats(g.read(),person.name);body.innerHTML=value?'<p>共用六維、品質、星級、永久等級與裝備換算；不含隊伍羈絆與臨時效果。</p><div class="player-stat-grid">'+Object.entries({hp:'生命上限',physical:'物攻',magic:'謀攻',def:'物防',mdef:'謀防',support:'輔助力',rate:'每秒普攻'}).map(([k,label])=>'<div><span>'+label+'</span><b>'+Number(value[k].toFixed(2))+'</b></div>').join('')+'</div>'+(owned?'<p>目前生命 '+owned.hp+'／'+owned.max+'</p>':'<p>未持有：顯示一級一星裸裝能力。</p>'):'<p>持有型人物不參戰。</p>';}
  if(kind==='equipment'){
   const state=g.read(),data=SwallowGrowth.equipmentState(state);body.innerHTML='<div class="equipment-slots"></div>';const grid=body.firstElementChild;
   for(const [slot,label]of Object.entries(EquipmentSystem.slots)){const item=EquipmentSystem.equipped(data,'story',person.name,slot),button=document.createElement('button');button.className='equipment-slot';button.innerHTML='<b>'+label+'</b><span>'+esc(item?.name||'未裝備')+'</span><small>'+esc(item?EquipmentSystem.effectText(item,person.name):'')+'</small>';button.disabled=!owned;button.onclick=()=>{body.innerHTML='<h3>'+label+'</h3>';const candidates=EquipmentSystem.candidates(data,'story',person.name,slot);for(const option of [null,...candidates]){const choice=document.createElement('button');choice.textContent=option?option.name+' · '+EquipmentSystem.effectText(option,person.name):'卸下裝備';choice.onclick=()=>{try{SwallowGrowth.equip(person.name,slot,option?.id??null);panel(person,'equipment');}catch(e){const note=document.createElement('p');note.textContent=e.message;body.append(note);}};body.append(choice);}const back=document.createElement('button');back.textContent='返回裝備';back.onclick=()=>panel(person,'equipment');body.append(back);};grid.append(button);}
  }
  if(kind==='bonds'){const rules=BondRules.rules.filter(r=>r.members.includes(person.name));body.innerHTML='<p>共用羈絆資料。吞食的效果尚未接入戰鬥，以下不代表已生效。</p>'+rules.map(r=>'<section class="player-bond"><h3>'+esc(r.name)+'</h3><p>'+esc(r.requirementText||r.members.join('＋'))+'</p></section>').join('')+(rules.length?'':'<p>目前沒有設定羈絆。</p>');}
  const back=document.createElement('button');back.textContent='返回武將';back.onclick=()=>detail(person);body.append(back);
 }
 function detail(person){
  const owned=SwallowChests.owned().get(person.name),q=OFFICER_QUALITY.evaluate(person),body=document.getElementById('noticeBody');
  document.getElementById('noticeTitle').textContent=person.name;
  body.innerHTML='<p><b>'+(owned?'已解鎖':'未解鎖 · 僅供瀏覽')+'</b></p><div class="officer-meta"><p>'+esc(person.faction)+' · '+esc(person.role||'持有型人物')+' · 原始品質 '+q.quality+'</p><div class="officer-tools">'+(person.holdingOnly?[['bonds','羈絆']]:[['equipment','裝備'],['ability','能力'],['bonds','羈絆']]).map(([id,label])=>'<button class="officer-equipment-button" data-panel="'+id+'">'+label+'</button>').join('')+'</div></div>'+(person.holdingOnly?'<p>持有型人物，不加入戰鬥編隊。</p>':'<div class="stats">'+Object.entries(OFFICER_PROPOSAL.fields).map(([id,f])=>'<div>'+esc(f.label)+'<b>'+esc(person[id]??'—')+'</b></div>').join('')+'</div><p>'+progress(person)+'（升星用）</p><p class="small">戰後存活武將獲得經驗，經驗滿後自動升級。轉生尚未接入。</p>');
  if(owned&&!person.holdingOnly&&!g.read().party.some(u=>u.name===person.name)){const join=document.createElement('button');join.textContent='編入隊伍';join.onclick=()=>{const state=g.read();const apply=index=>{try{SwallowChests.deploy(person.name,index);detail(person);}catch(e){const note=document.createElement('p');note.textContent=e.message;body.append(note);}};if(state.party.length<5)apply();else{body.innerHTML='<p>選擇要替換的武將；原武將生命與經驗會保留。</p>';for(const [i,u]of state.party.entries()){const button=document.createElement('button');button.textContent=u.name;button.onclick=()=>apply(i);body.append(button);}const back=document.createElement('button');back.textContent='返回武將';back.onclick=()=>detail(person);body.append(back);}};body.append(join);}
  if(owned&&!person.holdingOnly){const state=g.read(),r=SwallowGrowth.record(state,person.name),cost=OfficerStarCosts[q.quality]?.find(x=>x.fromStar===r.stars)?.fragments,section=document.createElement('section');section.innerHTML='<p>經驗 '+r.xp+'／'+(r.level===100?'已滿級':100*r.level)+' · 可分配經驗 '+(state.trainingXP||0)+'</p><label>分配經驗 <input id="officerTraining" type="number" min="1" max="'+(state.trainingXP||0)+'" value="'+Math.min(100,state.trainingXP||0)+'"></label><div class="actions"><button id="trainOfficer">訓練</button><button id="starOfficer">'+(cost?'升星 · '+cost+'片':'已達10星')+'</button></div><p id="growthError" role="status"></p>';body.append(section);section.querySelector('#trainOfficer').disabled=!state.trainingXP||r.level===100;section.querySelector('#starOfficer').disabled=!cost||(state.shop?.fragments?.[person.name]||0)<cost;const act=fn=>{try{fn();detail(person);}catch(e){section.querySelector('#growthError').textContent=e.message;}};section.querySelector('#trainOfficer').onclick=()=>act(()=>SwallowGrowth.train(person.name,Number(section.querySelector('input').value)));section.querySelector('#starOfficer').onclick=()=>act(()=>SwallowGrowth.star(person.name));}
  for(const button of body.querySelectorAll('[data-panel]'))button.onclick=()=>panel(person,button.dataset.panel);
  if(!document.getElementById('notice').open)document.getElementById('notice').showModal();
 }
 function library(root){
  root.innerHTML='<h2>武將庫</h2><div class="factions swallow-factions"></div><label>尋找武將 <input id="officerSearch" type="search" placeholder="姓名" value="'+esc(search)+'"></label><p id="officerCount"></p><div class="collection" id="officerList"></div>';
  const tabs=root.querySelector('.factions');for(const name of ['蜀','魏','吳','群雄','東漢','特殊']){const button=document.createElement('button');button.textContent=name;button.classList.toggle('active',name===faction);button.onclick=()=>{faction=name;library(root);};tabs.append(button);}
  const list=()=>{const owned=SwallowChests.owned();const entries=roster().filter(p=>p.faction===faction&&(!search||p.name.includes(search)||p.aliases?.some(a=>a.includes(search)))).sort((a,b)=>Number(owned.has(b.name))-Number(owned.has(a.name)));root.querySelector('#officerCount').textContent=entries.length+' 位武將';const cards=root.querySelector('#officerList');cards.replaceChildren();for(const p of entries){const q=OFFICER_QUALITY.evaluate(p),u=owned.get(p.name),button=document.createElement('button');button.className='officer'+(u?'':' locked-officer');button.dataset.officer=p.name;button.style.setProperty('--quality',OFFICER_QUALITY.colors[q.quality]);button.innerHTML='<span class="nameplate">'+esc(p.name)+'</span><small>'+(p.holdingOnly?(u?'已持有 · 不可編隊':'未持有 · 不可編隊'):progress(p))+'</small>';button.onclick=()=>detail(p);cards.append(button);}};
  root.querySelector('#officerSearch').oninput=e=>{search=e.target.value.trim();list();};list();
 }
 function armory(root){
  const state=g.read();let chosen=state.formation,order=[...state.formationOrder],selected=null;
  function draw(){root.innerHTML='<h2>軍備 · 陣型</h2><p>上方朝向敵軍。點選兩名武將交換位置。</p><div class="swallow-factions" id="formationTabs"></div><div class="swallow-grid" aria-label="三排五格布陣盤"></div><p id="formationStatus" role="status"></p><button class="primary" id="applyFormation">套用陣型</button>';
   for(const [id,f]of Object.entries(g.formations)){const button=document.createElement('button');button.textContent=f.name;button.setAttribute('aria-pressed',String(id===chosen));button.onclick=()=>{chosen=id;selected=null;draw();};root.querySelector('#formationTabs').append(button);}
   const f=g.formations[chosen],board=root.querySelector('.swallow-grid');for(let row=0;row<3;row++)for(let col=1;col<=5;col++){const slot=f.rows.findIndex((r,i)=>r===row&&f.columns[i]===col),u=slot>=0?state.party[order[slot]]:null,button=document.createElement('button');button.textContent=u?.name||'·';button.disabled=!u;button.dataset.row=row;button.dataset.col=col;button.setAttribute('aria-pressed',String(selected===slot));if(u)button.onclick=()=>{if(selected===null)selected=slot;else{[order[selected],order[slot]]=[order[slot],order[selected]];selected=null;}draw();};board.append(button);}
   root.querySelector('#applyFormation').onclick=()=>{try{g.setFormation(chosen,order);root.querySelector('#formationStatus').textContent='已套用 '+g.formations[chosen].name;}catch(e){root.querySelector('#formationStatus').textContent=e.message;}};
  }draw();
 }
 let bagTab='items';
 function bag(root){
  const s=g.read(),profile={...SwallowCampaign.profile(),equipment:s.equipment};root.innerHTML='<div class="row bag-heading"><h2>背包</h2><div class="subtabs"><button data-bag-tab="equipment">裝備</button><button data-bag-tab="items">道具</button></div><small>劇情</small></div><div id="bagCollection" role="region" aria-label="背包清單"></div>';
  for(const b of root.querySelectorAll('[data-bag-tab]')){b.classList.toggle('active',b.dataset.bagTab===bagTab);b.onclick=()=>{bagTab=b.dataset.bagTab;bag(root);};}
  const list=root.querySelector('#bagCollection');
  const row=(name,mark,count,description,id)=>'<section class="panel bag-item"><span class="bag-item-mark">'+esc(mark)+'</span><span class="bag-item-content"><strong>'+esc(name)+'</strong><small>'+esc(description)+'</small></span><b>×'+count+'</b>'+(id?'<button data-use="'+id+'">使用</button>':'')+'</section>';
  if(bagTab==='equipment'){for(const item of profile.equipment?.story?.items||[])list.insertAdjacentHTML('beforeend',row(item.name,'裝',1,'到武將卡的裝備頁穿戴'));}
  else{
   for(const [id,n]of Object.entries(s.items)){const item=g.items[id];if(item&&n>0)list.insertAdjacentHTML('beforeend',row(item.name,'丹',n,item.revive?'復活一名死亡武將':'恢復一名存活武將 '+item.heal+' 生命',id));}
   const names={waterBucket:['一桶水','水'],foodVoucher:['軍糧兌換卡','糧'],damagedLeatherArmor:['破損皮甲','甲'],surrenderLetter:['勸降書','書'],letterXPBook120:['字卡經驗書','書'],attributeCardLow:['自由屬性卡（低）','屬'],attributeCard:['自由屬性分配卡','屬']};
   for(const [id,[name,mark]]of Object.entries(names)){const n=Number(profile.storyItems?.[id]||s.items[id]||0);if(n>0)list.insertAdjacentHTML('beforeend',row(name,mark,n,'劇情道具'));}
  }
  if(!list.children.length)list.innerHTML='<section class="panel"><p>目前沒有'+(bagTab==='equipment'?'裝備':'道具')+'。</p></section>';
 }
 return {library,armory,bag};
})();
