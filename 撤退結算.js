'use strict';
(()=>{
 const button=document.createElement('button');button.id='retreatBattle';button.textContent='撤退結算';button.style.cssText='font-size:11px;min-height:30px;padding:4px 6px';$('speed').after(button);
 const dialog=document.createElement('dialog');dialog.id='retreatConfirm';dialog.setAttribute('aria-label','確認撤退');dialog.innerHTML='<h2>確定撤退？</h2><p>本場將立即結束，保留目前戰鬥統計；不會繼續模擬剩餘波次，也不算通關。</p><p>目前尚未接入永久獎勵，本次不發放經驗、金幣或寶箱。</p><p>只需暫時離開，可取消後使用「暫停戰鬥」。確認期間維持原本的戰鬥狀態。</p><button id="cancelRetreat">取消</button> <button id="confirmRetreat">確認撤退</button>';document.body.append(dialog);
 button.onclick=()=>{if(ended)return say('本場已結束，可查看戰報或重開。');if(!started)return say('尚未開始戰鬥，無須撤退；可直接調整部署。');if(!dialog.open)dialog.showModal();};
 $('cancelRetreat').onclick=()=>dialog.close();$('confirmRetreat').onclick=()=>{dialog.close();if(!started||ended)return;window.Assembly?.reset();finish(false,'retreat');sync();};
})();
