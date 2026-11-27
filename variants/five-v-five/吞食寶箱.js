'use strict';
window.SwallowChests=(()=>{
 const description='每箱兩次獨立抽選：完整武將卡50%、同名武將碎片50%。兩種獎勵都依下列品質機率抽取。重複完整卡轉為同名碎片1片；同箱重複也適用。不含單字卡。';
 function pool(tier){const t=ChestSystem.tiers[tier];if(!t)throw Error('寶箱不存在');const entries=OFFICER_PROPOSAL.entries.filter(p=>!p.playerCard),groups=ChestSystem.colors.map(q=>entries.filter(p=>OFFICER_QUALITY.evaluate(p).quality===q));const weights=t.rates.map((n,i)=>groups[i].length?n:0),total=weights.reduce((a,b)=>a+b,0);return {groups,rates:weights.map(n=>total?n/total*100:0)};}
 function random(){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296;}
 function open(tier,source,revision,rng=random){
  const t=ChestSystem.tiers[tier];if(!t||tier===4)throw Error('此寶箱尚未開放');
  const s=FiveVFiveGame.read(),bag=s.shop??={boxes:{},heroes:[],fragments:{},history:[],revision:0};
  if(revision!==undefined&&revision!==(bag.revision||0))throw Error('寶箱資料已更新，請重新開啟');
  if(source==='stock'){if(!(bag.boxes[tier]>0))throw Error('沒有持有這個寶箱');}
  else if(source==='buy'){if(!t.currency)throw Error('此寶箱不販售');if(!Number.isSafeInteger(s[t.currency])||s[t.currency]<t.price)throw Error(t.currency==='coins'?'金幣不足':'鑽石不足');}
  else throw Error('寶箱來源不正確');
  const p=pool(tier);if(!p.rates.some(n=>n>0))throw Error('目前沒有可抽取的武將');
  const sample=()=>{const n=rng();if(!Number.isFinite(n)||n<0||n>=1)throw Error('抽選失敗');return n;};
  const owned=new Set([...s.party.map(u=>u.name),...Object.keys(s.reserves||{}),...(bag.heroes||[])]),items=[];
  for(let i=0;i<ChestSystem.draws;i++){
   const complete=sample()<.5;let roll=sample()*100,index=p.rates.findLastIndex(n=>n>0);for(let j=0;j<p.rates.length;j++){roll-=p.rates[j];if(roll<0){index=j;break;}}
   const group=p.groups[index],hero=group[Math.floor(sample()*group.length)],duplicate=complete&&owned.has(hero.name),kind=complete&&!duplicate?'hero':'fragment';
   const item={kind,name:hero.name,quality:ChestSystem.colors[index],count:1,...(duplicate?{converted:true}:{})};items.push(item);
   if(kind==='hero'){bag.heroes.push(hero.name);owned.add(hero.name);}else bag.fragments[hero.name]=(bag.fragments[hero.name]||0)+1;
  }
  if(source==='stock')bag.boxes[tier]--;else s[t.currency]-=t.price;
  const receipt={tier,source,items,cost:source==='buy'?t.price:0,currency:source==='buy'?t.currency:null,at:new Date().toISOString()};bag.history.unshift(receipt);bag.revision=(bag.revision||0)+1;
  // 貨幣、收藏與紀錄單次寫入；失敗時不會只扣款或只發獎勵。
  localStorage.setItem(FiveVFiveGame.key,JSON.stringify(s));return receipt;
 }
 function owned(){const s=FiveVFiveGame.read();return new Map([...(s.shop?.heroes||[]).map(name=>[name,{name,stars:1,collected:true}]),...Object.entries(s.reserves||{}),...s.party.map(u=>[u.name,u])]);}
 function deploy(name,replaceIndex){
  const s=FiveVFiveGame.read(),person=OFFICER_PROPOSAL.entries.find(p=>p.name===name);
  if(!person||person.holdingOnly||person.playerCard||!owned().has(name))throw Error('此武將不能編入隊伍');
  if(s.battle)throw Error('請先結束並離開目前戰鬥');
  if(s.party.some(u=>u.name===name))throw Error('此武將已在隊伍中');
  // 新取得武將先沿用目前吞食試戰配置；正式六維換算另行接入。
  s.reserves??={};const officer=s.reserves[name]||{name,max:260,hp:260,attack:80,speed:10,xp:0,stars:1};
  if(s.party.length<5)s.party.push(officer);else{if(!Number.isInteger(replaceIndex)||replaceIndex<0||replaceIndex>=s.party.length)throw Error('請選擇要替換的武將');const old=s.party[replaceIndex];s.reserves[old.name]=old;s.party[replaceIndex]=officer;}
  delete s.reserves[name];s.formationOrder=s.party.map((_,i)=>i);window.SwallowGrowth?.sync(s);localStorage.setItem(FiveVFiveGame.key,JSON.stringify(s));
 }
 return {description,pool,open,owned,deploy};
})();
