'use strict';
window.SharedWallet=(()=>{
 const amount=n=>Number.isSafeInteger(n)&&n>=0?n:0;
 function init(s){s.rewards??={};const r=s.rewards;
  if(!r.wallet){r.wallet={coins:amount(r.modes?.story?.coins)+amount(r.modes?.battle?.coins),diamonds:amount(r.modes?.story?.diamonds)+amount(r.modes?.battle?.diamonds)};}
  for(const k of ['coins','diamonds']){if(!Number.isSafeInteger(r.wallet[k])||r.wallet[k]<0)throw Error('共用資源數值無效');}
  for(const m of Object.values(r.modes||{})){delete m.coins;delete m.diamonds;}
  return r.wallet;
 }
 return {init};
})();
