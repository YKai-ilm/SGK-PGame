'use strict';
window.BubbleTraining=(()=>{
 const key='three-kingdoms-interface-preview-v1',cost=100,duration=45000;
 const cells=Array.from({length:80},(_,i)=>({x:25+(i%8)*46+(Math.floor(i/8)%2)*23,y:26+Math.floor(i/8)*40}));
 const neighbors=i=>cells.map((p,j)=>Math.hypot(p.x-cells[i].x,p.y-cells[i].y)<48&&j!==i?j:-1).filter(j=>j>=0);
 const read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 const write=s=>localStorage.setItem(key,JSON.stringify(s));
 const pick=a=>a[Math.floor(Math.random()*a.length)];
 function names(faction){return [...new Set(OFFICER_PROPOSAL.entries.filter(p=>p.faction===faction&&[...p.name].length>=2&&[...p.name].length<=4).map(p=>p.name))];}
 // Three complete rows, mixed letters; no prearranged answer columns.
 function seed(list){const chars=[...list.join('')],board=Array.from({length:80},(_,i)=>i<24?pick(chars):null);return {board};}
 function ammo(g,exclude){const list=names(g.faction),related=list.filter(n=>[...n].some(ch=>g.board.includes(ch))),options=[...(related.length?related:list).join('')],different=options.filter(ch=>ch!==exclude);return pick(different.length?different:options);}
 function rewardPool(s,faction){const p=ChestSystem.pool(s,1);return p.groups.map((group,i)=>({group:group.filter(h=>h.faction===faction),weight:p.rates[i],quality:ChestSystem.colors[i]})).filter(g=>g.group.length&&g.weight>0);}
 function start(now=Date.now()){
  const s=read();if(s.bubbleTraining?.active)return s.bubbleTraining.active;
  if(s.mode!=='story'||!names(s.storyFaction).length)throw Error('請先選擇劇情陣營。');
  const wallet=window.SharedWallet.init(s);if(wallet.coins<cost)throw Error('金幣不足，需要100金幣。');
  if(!rewardPool(s,s.storyFaction).length)throw Error('此陣營暫無可用獎勵。');
  const g={id:crypto.randomUUID(),faction:s.storyFaction,deadline:now+duration,score:0,matches:0,shots:0,...seed(names(s.storyFaction))};g.current=ammo(g);g.next=ammo(g,g.current);wallet.coins-=cost;s.bubbleTraining??={};s.bubbleTraining.active=g;write(s);return g;
 }
 function matched(board,list,placed){const result=[];for(const name of list){const chars=[...name];const search=(i,path)=>{if(path.length===chars.length){if(path.includes(placed))result.push({name,path});return;}for(const j of neighbors(i))if(!path.includes(j)&&board[j]===chars[path.length])search(j,[...path,j]);};board.forEach((ch,i)=>{if(ch===chars[0])search(i,[i]);});}return result;}
 function shoot(id,index,now=Date.now()){
  const s=read(),g=s.bubbleTraining?.active;if(!g||g.id!==id)throw Error('這一局已結束。');if(now>=g.deadline)return {expired:true};
  if(!Number.isInteger(index)||index<0||index>=80||g.board[index]||!(index<8||neighbors(index).some(i=>g.board[i])))throw Error('這裡無法停球。');
  g.board[index]=g.current;g.shots++;const found=matched(g.board,names(g.faction),index),unique=[...new Set(found.map(m=>m.name))],removed=[...new Set(found.flatMap(m=>m.path))];removed.forEach(i=>g.board[i]=null);g.score+=unique.length*100;g.matches+=unique.length;
  // Every remaining bubble stays available; no arbitrary removal of unmatched letters.
  if(g.board.filter(Boolean).length<12){const fresh=seed(names(g.faction));g.board=g.board.map((ch,i)=>ch||fresh.board[i]);}
  g.current=g.next;g.next=ammo(g,g.current);write(s);return {game:g,names:unique,removed,full:g.board.every(Boolean)};
 }
 function swap(id){const s=read(),g=s.bubbleTraining?.active;if(!g||g.id!==id||Date.now()>=g.deadline)return;[g.current,g.next]=[g.next,g.current];write(s);return g;}
 function finish(id,now=Date.now(),abandon=false){
  const s=read();if(s.bubbleTraining?.last?.id===id)return s.bubbleTraining.last;
  const g=s.bubbleTraining?.active;if(!g||g.id!==id)throw Error('找不到這局紀錄。');
  if(!abandon&&now<g.deadline&&!g.board.every(Boolean))throw Error('訓練尚未結束。');
  const items=[],xp=abandon?0:20+Math.min(40,Math.floor(g.score/100)*5);
  if(!abandon){const pool=rewardPool(s,g.faction),total=pool.reduce((n,g)=>n+g.weight,0);if(!total)throw Error('無法結算獎勵。');const m=ChestSystem.init(s);for(let i=0;i<2;i++){let x=Math.random()*total,group=pool.at(-1);for(const p of pool){x-=p.weight;if(x<0){group=p;break;}}const name=pick(group.group).name;m.officerFragments[name]=(m.officerFragments[name]||0)+1;items.push({name,quality:group.quality,count:1});}s.chests.story.trainingXP=(s.chests.story.trainingXP||0)+xp;}
  const receipt={id,score:g.score,matches:g.matches,items,xp,abandon,at:now};s.bubbleTraining.last=receipt;s.bubbleTraining.active=null;write(s);return receipt;
 }
 function allocate(ch,amount){const s=read();ChestSystem.init(s);const m=s.chests.story;if(s.mode!=='story'||!s.unlocks.story.letters.includes(ch))throw Error('只能分配給已持有的劇情單字卡。');if(!Number.isSafeInteger(amount)||amount<=0||amount>(m.trainingXP||0))throw Error('可分配經驗不足。');const p=m.letterProgress[ch]??={level:1,xp:0,quality:'青'};if(p.level>=100)throw Error('字卡已滿級。');let max=0;for(let l=p.level;l<100;l++)max+=100*l;max-=p.xp;const used=Math.min(amount,max);p.xp+=used;while(p.level<100&&p.xp>=100*p.level){p.xp-=100*p.level;p.level++;}if(p.level===100)p.xp=0;m.trainingXP-=used;write(s);return s;}
 const locked=fn=>navigator.locks?navigator.locks.request('three-kingdoms-profile-training',fn):Promise.resolve().then(fn);
 return {key,cost,duration,cells,neighbors,names,read,start,shoot,swap,finish,allocate,matched,locked};
})();
