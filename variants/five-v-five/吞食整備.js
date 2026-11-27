'use strict';
window.SwallowMenus=(()=>{
 const g=FiveVFiveGame,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let faction='蜀',search='';
 const roster=()=>OFFICER_PROPOSAL.entries.filter(p=>!p.playerCard);
 function detail(person){
  const owned=g.read().party.find(u=>u.name===person.name),q=OFFICER_QUALITY.evaluate(person),body=document.getElementById('noticeBody');
  document.getElementById('noticeTitle').textContent=person.name+' · '+q.quality;
  body.innerHTML='<p>'+(owned?'已加入隊伍':'尚未取得')+' · '+esc(person.faction)+'</p><div class="stats">'+Object.entries(OFFICER_PROPOSAL.fields).map(([id,f])=>'<div>'+esc(f.label)+'<b>'+esc(person[id]??'—')+'</b></div>').join('')+'</div>'+(owned?'<h3>目前戰鬥能力</h3><div class="stats">'+[['生命',owned.hp+'／'+owned.max],['物攻',owned.attack],['速度',owned.speed],['經驗',owned.xp]].map(([k,v])=>'<div>'+k+'<b>'+v+'</b></div>').join('')+'</div>':'<p>取得武將後可查看目前戰鬥能力。</p>');
  document.getElementById('notice').showModal();
 }
 function library(root){
  root.innerHTML='<h2>武將庫</h2><div class="factions swallow-factions"></div><label>尋找武將 <input id="officerSearch" type="search" placeholder="姓名" value="'+esc(search)+'"></label><p id="officerCount"></p><div class="collection" id="officerList"></div>';
  const tabs=root.querySelector('.factions');for(const name of ['蜀','魏','吳','群雄','東漢','特殊']){const button=document.createElement('button');button.textContent=name;button.classList.toggle('active',name===faction);button.onclick=()=>{faction=name;library(root);};tabs.append(button);}
  const list=()=>{const owned=new Map(g.read().party.map(u=>[u.name,u]));const entries=roster().filter(p=>p.faction===faction&&(!search||p.name.includes(search)||p.aliases?.some(a=>a.includes(search)))).sort((a,b)=>Number(owned.has(b.name))-Number(owned.has(a.name)));root.querySelector('#officerCount').textContent=entries.length+' 位武將';const cards=root.querySelector('#officerList');cards.replaceChildren();for(const p of entries){const q=OFFICER_QUALITY.evaluate(p),u=owned.get(p.name),button=document.createElement('button');button.className='officer'+(u?'':' locked-officer');button.dataset.officer=p.name;button.innerHTML='<span class="nameplate" style="border-color:'+OFFICER_QUALITY.colors[q.quality]+'">'+esc(p.name)+'</span><small>'+q.quality+' · '+(u?'已加入<br>生命 '+u.hp+'／'+u.max:'未取得')+'</small>';button.onclick=()=>detail(p);cards.append(button);}};
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
 return {library,armory};
})();
