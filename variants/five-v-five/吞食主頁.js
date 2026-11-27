'use strict';
(()=>{const g=FiveVFiveGame,$=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));let page='home';
 let homeFlagObserver;
 function fitHomeFlag(hero){
  homeFlagObserver?.disconnect();
  if(!hero)return;
  const flag=hero.querySelector('.flag');
  // 與走防相同：旗桿底端跟隨底圖屋脊 (1200,548)，不可使用固定百分比。
  const fit=()=>{const w=hero.clientWidth,h=hero.clientHeight,scale=Math.max(w/1536,h/1024);flag.style.left=((w-1536*scale)/2+1200*scale)+'px';flag.style.bottom=((1024-548)*scale)+'px';flag.style.transform='scale('+scale+')';};
  fit();homeFlagObserver=new ResizeObserver(fit);homeFlagObserver.observe(hero);
 }
 function draw(){homeFlagObserver?.disconnect();SwallowCampaign.syncParty();const s=g.read(),story=SwallowCampaign.story();$('coins').textContent=s.coins;$('diamonds').textContent=s.diamonds||0;$('partyCount').textContent=s.party.length+' / 5';document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 if(page==='home')$('content').innerHTML='<div class="home-grid"><section class="hero"><span class="eyebrow">蜀國序章</span><h2>桃園起兵<br>同心護民</h2><p>從桃源村出發，結識同伴，列陣迎敵。</p><div class="flag"><span>蜀</span></div><small>三哥吞食・五將指令戰鬥</small></section><div class="home-right"><button class="primary" data-page="journey"><strong>劇情出征</strong><small>開始或繼續桃園起兵</small></button><section class="panel"><div class="row"><h3>目前隊伍</h3><button data-page="armory">整備</button></div><p>'+s.party.map(u=>esc(u.name)).join('、')+'</p><p>'+esc(g.formations[s.formation].name)+' · '+s.party.length+'／5 名</p></section><div class="two"><button data-page="library"><strong>武將庫</strong><small>五陣營・特殊武將</small></button><button data-page="bag"><strong>背包</strong><small>整理道具與旅途所得</small></button></div></div></div>';
 if(page==='journey')$('content').innerHTML='<span class="eyebrow">劇情出征</span><h2>選擇一段征途</h2><div class="journey-grid"><button><strong>蜀</strong><small>桃園起兵 · 已開放</small></button>'+['魏','吳','群雄','東漢'].map(n=>'<button disabled><strong>'+n+'</strong><small>後續開放</small></button>').join('')+'</div><section class="panel"><h3>蜀 · 桃園起兵</h3><p>從劉備家出發，探訪桃源村、村東與村西，結識關羽、張飛，一同護衛鄉里。</p><button class="primary" id="depart">'+(story?'繼續桃園起兵':'進入桃園起兵')+'</button><p class="small">進度自動保存，再次進入接續上次旅程。</p></section>';
 if(page==='shop')SwallowShop.render($('content'),draw);
 if(page==='library')SwallowMenus.library($('content'));
 if(page==='bag')SwallowMenus.bag($('content'));
 if(page==='armory')SwallowMenus.armory($('content'));
 fitHomeFlag($('content').querySelector('.hero'));
 $('depart')?.addEventListener('click',()=>location.href=s.battle?'index.html?campaign=1':'桃園起兵.html');}
 document.addEventListener('click',e=>{const use=e.target.closest('[data-use]');if(use){const id=use.dataset.use;$('noticeTitle').textContent=g.items[id].name;$('noticeBody').replaceChildren();for(const [i,u]of g.read().party.entries()){const button=document.createElement('button');button.textContent=u.name+' '+u.hp+'/'+u.max;button.disabled=g.items[id].revive?u.hp>0:u.hp<=0||u.hp===u.max;button.onclick=()=>{try{g.useItem(id,i);$('notice').close();draw();}catch(e){$('noticeBody').textContent=e.message;}};$('noticeBody').append(button);}$('notice').showModal();return;}const b=e.target.closest('[data-page]');if(b){page=b.dataset.page;draw();}});$('settings').onclick=()=>{$('noticeTitle').textContent='設定與進度';$('noticeBody').textContent='三哥吞食的劇情、隊伍與生命獨立保存在此瀏覽器，不與三哥走防或先前戰鬥試排共用進度。';const music=window.GameMusic;if(music){const box=document.createElement('div');box.innerHTML='<p><label><input id="musicEnabled" type="checkbox"> 背景音樂</label></p><label>音量 <input id="musicVolume" type="range" min="0" max="1" step="0.05"></label>';$('noticeBody').append(box);$('musicEnabled').checked=music.state.enabled;$('musicVolume').value=music.state.volume;}$('notice').showModal();};$('closeNotice').onclick=()=>$('notice').close();draw();})();
