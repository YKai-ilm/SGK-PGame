'use strict';
window.SwallowShop=(()=>{
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function modal(title,html){document.getElementById('noticeTitle').textContent=title;const body=document.getElementById('noticeBody');body.innerHTML=html;const dialog=document.getElementById('notice');if(!dialog.open)dialog.showModal();return body;}
 function rewardText(items){return items.map(x=>esc(x.name)+(x.kind==='fragment'?'碎片':'武將卡')+'（'+x.quality+'）×'+x.count).join('、');}
 function render(root,refresh){
  const s=FiveVFiveGame.read(),bag=s.shop||{boxes:{},history:[]};
  root.innerHTML='<h2>寶箱</h2><div class="boxlist">'+Object.entries(ChestSystem.tiers).map(([id,t])=>'<button data-box="'+id+'"><span class="box-icon">匣</span><strong>'+t.name+'</strong><p>持有 '+(bag.boxes[id]||0)+' 箱</p><small>'+(id==='4'?'尚未開放':t.currency?t.price+(t.currency==='coins'?' 金幣':' 鑽石'):'任務／關卡取得')+'</small></button>').join('')+'</div><h3 class="shop-section-title">最近取得</h3><div class="chest-history" tabindex="0" role="region" aria-label="最近取得紀錄">'+(bag.history.length?bag.history.slice(0,15).map(r=>'<div class="panel">'+ChestSystem.tiers[r.tier].name+'：'+rewardText(r.items)+'<br><small>'+esc(new Date(r.at).toLocaleString('zh-TW'))+'</small></div>').join(''):'<p>尚無開箱紀錄。</p>')+'</div>';
  for(const b of root.querySelectorAll('[data-box]'))b.onclick=()=>details(Number(b.dataset.box),refresh);
 }
 function details(tier,refresh){
  const t=ChestSystem.tiers[tier],s=FiveVFiveGame.read(),pool=SwallowChests.pool(tier),stock=s.shop?.boxes?.[tier]||0;
  const body=modal(t.name,'<p>'+SwallowChests.description+'</p><p>武將品質機率：'+pool.rates.map((n,i)=>n?ChestSystem.colors[i]+' '+Number(n.toFixed(2))+'%':'').filter(Boolean).join(' · ')+'</p><p>同品質內各武將等機率。沒有對應武將的品質會按其餘權重換算。</p>'+(tier===4?'<p>尚未開放，不會扣款。</p>':'<div class="actions"><button data-source="stock" '+(stock?'':'disabled')+'>開啟持有寶箱（剩 '+stock+'）</button>'+(t.currency?'<button data-source="buy" '+((s[t.currency]||0)>=t.price?'':'disabled')+'>花費 '+t.price+(t.currency==='coins'?' 金幣':' 鑽石')+'購買並開啟</button>':'')+'</div>')+'<p id="shopError" role="status"></p>');
  for(const button of body.querySelectorAll('[data-source]'))button.onclick=()=>{button.disabled=true;try{const receipt=SwallowChests.open(tier,button.dataset.source,s.shop?.revision||0);refresh();modal('開箱結果','<div class="chest-rewards" aria-label="本次開箱獎勵">'+receipt.items.map(x=>'<div class="chest-reward"><div class="officer reward-card" style="--quality:'+OFFICER_QUALITY.colors[x.quality]+'"><span class="nameplate">'+esc(x.name)+'</span>'+(x.kind==='fragment'?'<span class="fragment-mark">碎</span>':'')+'</div><div class="reward-caption"><span>'+x.quality+' · '+(x.converted?'重複卡轉同名碎片':x.kind==='fragment'?'武將碎片':'完整武將卡')+'</span><b>×'+x.count+'</b></div></div>').join('')+'</div><p>獎勵已入庫，進度已保存。</p>');}catch(e){body.querySelector('#shopError').textContent=e.message;button.disabled=false;}};
 }
 return {render};
})();
