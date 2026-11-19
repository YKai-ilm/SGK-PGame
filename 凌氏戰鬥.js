'use strict';
window.LingCombat=(()=>{
 let ledger={};
 const names=['凌操','凌統'];
 const active=()=>names.every(name=>units.some(u=>u.hp>0&&u.type===name));
 function record(u){return ledger[u.type]??={end:0,next:0,dead:false,firstUsed:false};}
 function update(){if(!active())for(const r of Object.values(ledger))r.end=0;}
 function engage(u){if(!u||u.enemy||!names.includes(u.type)||u.hp<=0||!units.includes(u))return;const r=record(u);if(r.dead){r.dead=false;r.end=r.next=0;}update();if(active()&&elapsed>=r.next){r.end=elapsed+3;r.next=elapsed+8;ring(u.x,u.y,.6,'#c6d9a6');mark(u.x,u.y,'先鋒·物防↑','#c6d9a6');}}
 function defense(u){update();return u&&units.includes(u)&&u.hp>0&&names.includes(u.type)&&active()&&(ledger[u.type]?.end||0)>elapsed?1.2:1;}
 function shield(u,amount,duration,owner,kind){u.lingShields??={};const old=u.lingShields[kind];if(old?.end>elapsed&&old.amount>=amount)return false;u.lingShields[kind]={amount,end:elapsed+duration,owner:owner.id};ring(u.x,u.y,.55,'#acd4ca');return true;}
 function shieldTotal(u){return Object.values(u.lingShields||{}).reduce((n,s)=>n+(s.end>elapsed?s.amount:0),0);}
 function absorb(u,amount){let total=0;for(const s of Object.values(u.lingShields||{})){if(s.end<=elapsed)continue;const n=Math.min(s.amount,amount-total);s.amount-=n;total+=n;if(n)window.BattleResults?.credit(s.owner,'shieldSupport',n);if(total>=amount)break;}return total;}
 function hit(target,source,damage){if(damage<=0)return;if(target.enemy&&!source?.enemy)engage(source);if(source?.enemy&&units.includes(target)){target.lastEnemyHit=elapsed;if(target.hp>0){engage(target);if(target.type==='凌操'){const r=record(target);if(!r.firstUsed){r.firstUsed=true;shield(target,target.max*.15,4,target,'first');}}}else if(names.includes(target.type)){const r=record(target);r.dead=true;r.end=0;}}update();}
 function skill(u,skill){if(skill.id==='waveSlash'){const t=targets(u,2)[0];if(!t)return false;const dx=t.x-u.x,dy=t.y-u.y,d=Math.hypot(dx,dy),nx=d?dx/d:1,ny=d?dy/d:0;for(const e of enemies){const x=e.x-u.x,y=e.y-u.y,along=x*nx+y*ny;if(e.hp>0&&along>=0&&along<=2+1e-8&&Math.abs(x*ny-y*nx)<=.5+1e-8){hurt(e,combatPower(u,false)*1.8,false,u);e.lingSlow=(window.EquipmentBattle?.controlEnd(e,elapsed,2)??elapsed+(2));}}fx.push({x:u.x,y:u.y,tx:u.x+nx*2,ty:u.y+ny*2,color:'#d5ddb0',end:elapsed+.3});return true;}
 if(skill.id==='lingGuard'){const amount=u.max*.12,a=units.filter(a=>a!==u&&a.hp>0&&a.hp/a.max<.6&&dist(u,a)<=1&&!(a.lingShields?.guard?.end>elapsed&&a.lingShields.guard.amount>=amount)).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];return !!a&&shield(a,amount,3,u,'guard');}
 if(skill.id==='lingStrike'){const t=targets(u,2)[0];if(!t)return false;const boosted=units.some(a=>a.hp>0&&dist(u,a)<=1&&elapsed-(a.lastEnemyHit??-100)<=2);u.lingCombo={target:t.id,next:elapsed,left:2,raw:combatPower(u,false)*(boosted?1.3:1),x:u.x,y:u.y};combo(u);return true;}return false;}
 function combo(u){const c=u.lingCombo;if(!c)return;if(!units.includes(u)||u.hp<=0||u.stun>elapsed||u.x!==c.x||u.y!==c.y){delete u.lingCombo;return;}if(elapsed+1e-8<c.next)return;const t=enemies.find(e=>e.id===c.target&&e.hp>0);if(!t||dist(u,t)>2){delete u.lingCombo;return;}weaponMotion(u,t,'hit');hurt(t,c.raw,false,u);c.left--;c.next=elapsed+.3;if(!c.left)delete u.lingCombo;}
 function status(u){if(!u||!names.includes(u.type))return '';update();const r=ledger[u.type];if(r?.end>elapsed&&active())return '物防提高20% · 剩 '+(r.end-elapsed).toFixed(1)+' 秒';if(r?.next>elapsed)return '觸發鎖定 · 剩 '+(r.next-elapsed).toFixed(1)+' 秒';return active()?'已就緒 · 等待接敵':'等待父子同時在場';}
 return{engage,defense,hit,skill,combo,update,absorb,shieldTotal,status,reset(){ledger={};},save(){return JSON.parse(JSON.stringify(ledger));},load(data){ledger=JSON.parse(JSON.stringify(data||{}));}};
})();
