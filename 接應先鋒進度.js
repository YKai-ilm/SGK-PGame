'use strict';
window.DongRelief=(()=>{
 const key='three-kingdoms-interface-preview-v1',read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 const progress=()=>read().storyEvents?.dongRelief||{};
 function change(fn){const s=read();s.storyEvents??={};const p=s.storyEvents.dongRelief??={};const result=fn(s,p);if(result!==false)localStorage.setItem(key,JSON.stringify(s));return result;}
 function advance(flag){return change((s,p)=>{const gates={ordered:s.storyEvents.dongCoalition?.completed,briefed:p.ordered,handedOver:p.won,completed:p.handedOver};if(!gates[flag]||p[flag])return false;if(flag==='completed'){const w=SharedWallet.init(s),items=s.storyItems??={},books=items.letterXPBook120??0;if(!Number.isSafeInteger(w.coins+320)||!Number.isSafeInteger(books)||books<0||!Number.isSafeInteger(books+1))throw Error('獎勵數值無效');w.coins+=320;items.letterXPBook120=books+1;}p[flag]=true;return true;});}
 function begin(){return change((s,p)=>{if(!p.briefed||p.won)throw Error('請先聽完軍情，已勝利的戰鬥不可重開');p.pending={runId:crypto.randomUUID()};return p.pending.runId;});}
 function complete(runId,win,outcome){return change((s,p)=>{if(p.won)return p.wonRun===runId;if(!p.briefed||!runId||p.pending?.runId!==runId)return false;if(win){p.won=true;p.wonRun=runId;delete p.pending;}else if(!['defeat','retreat'].includes(outcome))return false;return true;});}
 return {progress,advance,begin,complete};
})();
