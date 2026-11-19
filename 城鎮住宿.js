'use strict';
window.TownLodging=(()=>{
 const key='three-kingdoms-interface-preview-v1';
 // 城鎮各自定價，不依血量、裝備或金幣餘額調價。
 const prices=Object.freeze({xuzhou:Object.freeze({base:20,perMember:2})});
 const read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 function quote(city='xuzhou',s=read()){
  const price=prices[city];if(!price)throw Error('此城鎮尚未開放住宿。');
  const faction=s.storyFaction||'蜀',slots=s.teams?.['story:'+faction]?.slots||[];
  const members=[...new Set(slots.slice(0,7).filter(x=>typeof x==='string'&&x.trim()))];
  return {city,base:price.base,perMember:price.perMember,count:members.length,total:price.base+price.perMember*members.length};
 }
 const cityKey='three-kingdoms-xuzhou-story-v1';
 const pending=()=>read().townLodging?.pending||null;
 function freeAvailable(s=read()){const city=JSON.parse(localStorage.getItem(cityKey)||'{}');return !!city.flags?.steward&&!city.flags?.slept&&!s.townLodging?.xuzhouFreeUsed;}
 function locked(fn){return window.navigator?.locks?window.navigator.locks.request('story-town-lodging',fn):Promise.resolve().then(fn);}
 function begin(expected){return locked(()=>{
  const s=read();if(s.townLodging?.pending)return s.townLodging.pending;
  const q=quote('xuzhou',s),free=freeAvailable(s),cost=free?0:q.total;
  if(expected!==cost)throw Error('編制或住宿費已變動，請重新確認住宿。');
  const wallet=SharedWallet.init(s);if(wallet.coins<cost)throw Error('金幣不足，這次尚未住宿或扣款。');
  const stay={id:crypto.randomUUID(),city:'xuzhou',count:q.count,cost,free};
  wallet.coins-=cost;s.townLodging??={};s.townLodging.pending=stay;
  if(free)s.townLodging.xuzhouFreeUsed=true;
  localStorage.setItem(key,JSON.stringify(s));return stay;
 });}
 function complete(id){return locked(()=>{
  const s=read(),stay=s.townLodging?.pending;if(!stay||stay.id!==id)return false;
  s.storyMorale={...(s.storyMorale||{}),value:100};
  s.townLodging.last=stay;s.townLodging.pending=null;
  localStorage.setItem(key,JSON.stringify(s));window.dispatchEvent(new Event('story-morale-updated'));return true;
 });}
 return {key,prices,quote,pending,freeAvailable,begin,complete};
})();
