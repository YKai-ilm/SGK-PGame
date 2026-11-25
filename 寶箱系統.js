'use strict';
window.ChestSystem=(()=>{
 const colors=['青','綠','藍','橘','紅','紫','金'];
 const tiers={1:{name:'一級寶箱',currency:'coins',price:100,rates:[45,35,17,3,0,0,0]},2:{name:'二級寶箱',currency:null,price:0,rates:[0,45,40,13,2,0,0]},3:{name:'三級寶箱',currency:'diamonds',price:10,rates:[0,0,35,40,20,5,0]},4:{name:'四級寶箱',currency:null,price:0,rates:[0,0,0,50,30,15,5]}};
 const draws=2;
 // 解鎖共用，模式內的 letterProgress（等級／養成）獨立保存。
 function syncUnlocked(s){s.unlocks??={};const modes=['story','battle'],letters=new Set(),heroes=new Set(),added=[];for(const mode of modes){const own=s.unlocks[mode]??={heroes:[],letters:[]};for(const ch of own.letters||[])letters.add(ch);for(const name of own.heroes||[])heroes.add(name);}for(const p of OFFICER_PROPOSAL.entries){if(!p.storyRewardOnly&&[...p.name].every(ch=>letters.has(ch)))heroes.add(p.name);}for(const mode of modes){const own=s.unlocks[mode];for(const name of heroes)if(!(own.heroes||[]).includes(name))added.push({mode,name});own.letters=[...letters];own.heroes=[...heroes];}return added;}
 function init(s){syncUnlocked(s);s.chests??={};for(const mode of ['story','battle']){const m=s.chests[mode]??={};m.boxes??={};m.fragments??={};m.officerFragments??={};m.history??=[];m.letterProgress??={};m.letterCopies??={};}
 if(!s.chests.shared){const shared={boxes:{},fragments:{},officerFragments:{},letterCopies:{},history:[]};for(const mode of ['story','battle']){const m=s.chests[mode];for(const field of ['boxes','fragments','officerFragments','letterCopies'])for(const [name,n] of Object.entries(m[field]))shared[field][name]=(shared[field][name]||0)+n;shared.history.push(...m.history);}shared.history.sort((a,b)=>new Date(b.at)-new Date(a.at));s.chests.shared=shared;}
 for(const mode of ['story','battle'])for(const field of ['boxes','fragments','officerFragments','letterCopies','history'])s.chests[mode][field]=s.chests.shared[field];return s.chests[s.mode];}
 function roster(s){return OFFICER_PROPOSAL.entries.filter(p=>!p.playerCard&&!p.storyRewardOnly);}
 function pool(s,tier){const list=roster(s),t=tiers[tier];if(!t)throw Error('寶箱不存在');const groups=colors.map(q=>list.filter(p=>OFFICER_QUALITY.evaluate(p).quality===q));const weights=t.rates.map((n,i)=>groups[i].length?n:0),sum=weights.reduce((a,b)=>a+b,0);return{list,groups,rates:weights.map(n=>sum?n/sum*100:0),letters:[...new Set(list.map(p=>p.name).join(''))]};}
 function random(){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296;}
 function sample(rng){const x=rng();if(!(x>=0&&x<1))throw Error('抽選失敗');return x;}
 function addLetter(s,ch){const m=init(s),owned=s.unlocks[s.mode];if(!owned.letters.includes(ch))owned.letters.push(ch);m.letterProgress[ch]??={level:1,xp:0,quality:'青'};m.letterCopies[ch]=(m.letterCopies[ch]||0)+1;syncUnlocked(s);}
 function open(s,tier,source,rng=random){const t=tiers[tier];if(!t||tier===4)throw Error('此寶箱尚未開放');const m=init(s),wallet=window.SharedWallet.init(s),p=pool(s,tier);if(!p.letters.length||!p.rates.some(n=>n>0))throw Error('請先選擇可抽取的劇情陣營');if(source==='stock'){if(!(m.boxes[tier]>0))throw Error('沒有持有這個寶箱');}else if(source==='buy'){if(!t.currency)throw Error('此寶箱不販售');if(wallet[t.currency]<t.price)throw Error(t.currency==='coins'?'金幣不足':'鑽石不足');}else throw Error('寶箱來源不正確');
 const items=[];for(let i=0;i<draws;i++){if(sample(rng)<.5){items.push({kind:'letter',name:p.letters[Math.floor(sample(rng)*p.letters.length)],quality:'青',count:1});}else{let x=sample(rng)*100,index=p.rates.findLastIndex(n=>n>0);for(let j=0;j<p.rates.length;j++){x-=p.rates[j];if(x<0){index=j;break;}}const group=p.groups[index],hero=group[Math.floor(sample(rng)*group.length)];items.push({kind:'fragment',name:hero.name,quality:colors[index],count:1});}}
 if(source==='stock')m.boxes[tier]--;else wallet[t.currency]-=t.price;for(const item of items){if(item.kind==='letter')addLetter(s,item.name);else m.officerFragments[item.name]=(m.officerFragments[item.name]||0)+1;}
 const receipt={type:'open',version:2,tier,source,items,cost:source==='buy'?t.price:0,currency:source==='buy'?t.currency:null,at:new Date().toISOString()};m.history.unshift(receipt);return receipt;
 }
 function candidates(s){return roster(s).filter(p=>!s.unlocks[s.mode].heroes.includes(p.name));}
 function unlock(s,name){const p=OFFICER_PROPOSAL.entries.find(p=>p.name===name);if(!p||p.storyRewardOnly||s.unlocks[s.mode].heroes.includes(name))throw Error('此武將已解鎖或不存在');if(![...name].every(ch=>s.unlocks[s.mode].letters.includes(ch)))throw Error('尚未集齊名字字卡');syncUnlocked(s);return{type:'unlock',version:3,name,quality:OFFICER_QUALITY.evaluate(p).quality,cost:0,letters:[...new Set(name)]};}
 return{colors,tiers,draws,init,open,candidates,unlock,pool,syncUnlocked};
})();
