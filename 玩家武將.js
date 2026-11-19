'use strict';
// 完整玩家卡：獨立於單字與一般武將的品質判定。
window.PlayerOfficer=(()=>{
 const key='three-kingdoms-interface-preview-v1',fields=['str','int','lead','body','agi','charm'],tiers=['青','綠','藍','橘','紅','紫','金'];
 const styles={武:[74,42,65,69,65,45],謀:[42,74,65,50,65,64],統:[60,56,74,69,51,50],魅:[46,65,60,55,60,74],全能:[60,60,60,60,60,60]};
 const skillSets={
  武:[{id:'cleave',name:'破陣一擊',cd:4,desc:'前方2格直線造成180%武力傷害。'},{id:'focus',name:'越戰越勇',cd:0,desc:'連續普攻同一目標每次增傷8%，最高40%；更換目標重新累積。'}],
  謀:[{id:'break',name:'運籌奇策',cd:5,desc:'半徑1.6格造成150%謀略傷害，降低謀防40%，持續5秒。'},{id:'slow',name:'洞察先機',cd:5,radius:2,desc:'目標周圍2格敵軍減速40%，持續4秒。'}],
  統:[{id:'shield',name:'固陣軍令',cd:5,desc:'為一名生命低於60%的友軍提供輔助力120%護盾；同源不疊加。'},{id:'block',name:'整軍有方',cd:0,desc:'每3次普攻獲得一次75%武力格擋，最多保留3次。'}],
  魅:[{id:'heal',name:'鼓舞人心',cd:4,desc:'治療生命比例最低的受傷友軍，恢復輔助力120%生命。'},{id:'cleanse',name:'眾望所歸',cd:6,desc:'解除一名友軍的暈眩、定身、緩速或降攻速效果。'}],
  全能:[{id:'burst',name:'文武進擊',cd:4,desc:'對單一目標連刺3次，每次80%武力傷害。'},{id:'guard',name:'攻守兼備',cd:5,desc:'受擊後獲得35%減傷，持續3秒。'}]
 };
 const read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
 function valid(p){return !!p&&p.version===1&&typeof p.id==='string'&&p.id.length>0&&/^[\p{Script=Han}A-Za-z0-9]{2,4}$/u.test(p.name)&&Object.hasOwn(styles,p.style)&&integer(p.rank,0,69)&&integer(p.level,1,100)&&integer(p.rebirth,0,10000)&&integer(p.fragments,0,Number.MAX_SAFE_INTEGER)&&(!p.milestones||Array.isArray(p.milestones)&&new Set(p.milestones).size===p.milestones.length&&p.milestones.every(n=>integer(n,10,100)&&n%10===0))&&integer(p.xp,0,p.level===100?0:100*p.level*(p.rebirth+1)-1)&&p.points&&Object.keys(p.points).length===6&&fields.every((k,i)=>integer(p.points[k],0,100-styles[p.style][i]))&&fields.reduce((n,k)=>n+p.points[k],0)<=p.rank*3;}
 function get(s=read()){return valid(s.playerOfficer)?s.playerOfficer:null;}
 function is(name){return name===active?.name;}
 function abilities(p){return Object.fromEntries(fields.map((k,i)=>[k,styles[p.style][i]+p.points[k]]));}
 function remaining(p){return p.rank*3-fields.reduce((n,k)=>n+p.points[k],0);}
 function create(s,name,style){if(s.playerOfficer)throw Error('已建立玩家武將');if(!['completed','skipped'].includes(s.tutorial?.status))throw Error('請先完成新手訓練');name=name.trim();if(!/^[\p{Script=Han}A-Za-z0-9]{2,4}$/u.test(name))throw Error('名稱請用2至4個中文字、英文字母或數字');if(!Object.hasOwn(styles,style))throw Error('請選擇風格');if((window.OFFICER_PROPOSAL?.entries||[]).some(p=>p.name===name)||Object.hasOwn(window.TestRoster||{},name)||['玩家武將','特殊'].includes(name))throw Error('此名稱已被使用，請換一個名字');const p={version:1,id:crypto.randomUUID(),name,style,rank:0,level:1,xp:0,rebirth:0,fragments:0,points:Object.fromEntries(fields.map(k=>[k,0]))};s.playerOfficer=p;unlock(s,p);return p;}
 function unlock(s,p){s.unlocks??={};for(const mode of ['story','battle']){s.unlocks[mode]??={heroes:[],letters:[]};if(!s.unlocks[mode].heroes.includes(p.name))s.unlocks[mode].heroes.push(p.name);}}
 function allocate(p,points){const next={...p,points:{...points}};if(!valid(next))throw Error('配點超過可用點數或單項100上限');p.points=next.points;}
 function milestones(p){p.milestones??=[];let bonus=0;for(let level=10;level<=100;level+=10)if(p.level>=level&&!p.milestones.includes(level)){p.milestones.push(level);bonus+=10;}p.fragments+=bonus;return bonus;}
 function gainXP(p,amount){if(!integer(amount,0,100000000))throw Error('經驗數值無效');if(p.level===100)return 0;let needed=0;for(let l=p.level;l<100;l++)needed+=100*l*(p.rebirth+1);const used=Math.min(amount,needed-p.xp);p.xp+=used;while(p.level<100&&p.xp>=100*p.level*(p.rebirth+1)){p.xp-=100*p.level*(p.rebirth+1);p.level++;}if(p.level===100)p.xp=0;milestones(p);return used;}
 const costs=[10,20,30,50,80,120,180];
 function starCost(p){return p.rank<69?costs[Math.floor(p.rank/10)]:null;}
 function upgrade(p){const cost=starCost(p);if(cost===null)throw Error('已達金色10星');if(p.fragments<cost)throw Error('玩家碎片不足');p.fragments-=cost;p.rank++;return cost;}
 function rebirthReward(p){return Math.min(500,200+p.rebirth*100);}
 function rebirth(p){if(p.level!==100)throw Error('永久等級100才能轉生');const bonus=rebirthReward(p);milestones(p);p.fragments+=bonus;p.rebirth++;p.level=1;p.xp=0;return bonus;}
 // 招募與戰鬥沿用進場快照，其他分頁配點不會改動進行中的戰局。
 let active=null;
 function register(s=read()){
  const p=get(s);if(!p)return null;active=JSON.parse(JSON.stringify(p));const a=abilities(p),quality=tiers[Math.floor(p.rank/10)];
  if(window.OFFICER_PROPOSAL){const list=window.OFFICER_PROPOSAL.entries,entry={name:p.name,faction:'特殊',role:'玩家武將 · '+p.style,playerCard:true,quality,...a};const index=list.findIndex(x=>x.playerCard);if(index<0)list.push(entry);else list[index]=entry;}
  if(window.HERO_COMBAT_DATA)window.HERO_COMBAT_DATA[p.name]={abilities:a,quality,playerCard:true};
  if(window.TestRoster){const scale=1+(p.level-1)*.03,defScale=1+(p.level-1)*.015,rate=(.5+a.agi*.005)*(1+(p.level-1)*.001),magic=['謀','魅'].includes(p.style),physical=a.str*2*scale,ma=a.int*2*scale,primary=magic?ma:physical;
   window.TestRoster[p.name]={playerCard:true,hp:Math.round((400+a.body*8)*scale),atk:primary,def:(a.lead*.42+a.str*.18)*defScale,mdef:(a.lead*.2+a.int*.4)*defScale,physicalRatio:physical/primary,magicRatio:ma/primary,supportRatio:a.charm*1.5*scale/primary,combatVersion:1,interval:1/rate,range:magic?4:2,group:magic?'遠攻':'近戰',kind:magic?'magic':'hit',weaponLabel:magic?'策杖':'劍',skills:skillSets[p.style].map(x=>({...x})),quality};}
  return active;
 }
 return{key,fields,tiers,styles,skillSets,costs,starCost,upgrade,rebirth,rebirthReward,milestones,read,get,valid,is,abilities,remaining,create,unlock,allocate,gainXP,register,get active(){return active;}};
})();
