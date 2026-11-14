'use strict';
// Design-study only. Never reads or writes player saves; not loaded by battle pages.
window.SPStudy={
 canAppoint(intelligence){return Number.isInteger(intelligence)&&intelligence>=65&&intelligence<=100;},
 capacity(intelligence,level,model='c'){
  if(!Number.isInteger(intelligence)||intelligence<0||intelligence>100||!Number.isInteger(level)||level<1||level>100)throw Error('試算範圍不正確');
  if(model==='a')return Math.floor((20+4*(level-1))*(.4+.6*(intelligence/100)**4));
  if(model==='b')return intelligence+Math.floor(4*(level-1)*intelligence**2/10000);
  if(model!=='c')throw Error('未知方案');
  if(!this.canAppoint(intelligence))return 0;
  const start=10;
  return start+Math.floor((level-1)*intelligence/100);
 },
 transition(current,maximum,event,amount=0){
  if(!Number.isSafeInteger(current)||current<0||!Number.isSafeInteger(maximum)||maximum<0||!Number.isSafeInteger(amount)||amount<0)throw Error('SP值不正確');
  if(event==='spend')return current>=amount?current-amount:current;
  if(event==='inn')return Math.max(current,maximum);
  if(event==='item')return current+Math.min(amount,Math.max(0,maximum-current));
  if(['battle','level','strategist'].includes(event))return current;
  throw Error('未知操作');
 }
};
