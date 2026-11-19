'use strict';
window.HeroFeed=(()=>{
function type(ref){return typeof ref==='number'?deck[ref]:ref?.type;}
function valid(ref){return typeof ref==='number'?!!deck[ref]:!!ref&&units.includes(ref)&&ref.hp>0;}
const saved=ref=>typeof ref==='number'?Recruit.saved(ref):ref;
function basicMatch(source,target){return ['刀','槍','弓'].includes(type(source))&&type(source)===type(target);}
function matches(source,target){const name=type(source);return !window.PlayerOfficer?.is(name)&&!window.PlayerOfficer?.is(type(target))&&Recruit.enabled&&source!==target&&valid(source)&&valid(target)&&(basicMatch(source,target)||roster[type(target)]?.skills.length>0&&(name===type(target)||roster[name]?.letter&&type(target).includes(name)));}
const basicValue=u=>2**((u?.level||1)-1)+(u?.basicStored||0);
function mergeBasic(source,target){
 const material=saved(source),existing=saved(target);
 if([material,existing].some(u=>u&&(u.root>elapsed||u.ready>elapsed))){say('卡片定身或換位冷卻中，暫時不能合成。');return true;}
 const u=existing||makeUnit(type(target),-1,-1),beforeLevel=u.level,own=basicValue(u),incoming=basicValue(material),ratio=((material?material.hp/material.max:1)*incoming+u.hp/u.max*own)/(own+incoming);
 u.basicStored=(u.basicStored||0)+incoming;
 while(u.basicStored>=2**(u.level-1)){u.basicStored-=2**(u.level-1);u.level++;u.max=window.EquipmentBattle?EquipmentBattle.growHP(u):Math.round(u.max*1.12);u.atk*=1.09;}
 u.hp=Math.min(u.max,u.max*ratio);if(u.level>beforeLevel)u.xp=0;
 for(const prop of ['slow','stun','root','attackSlow','broken','ready','nextAttack'])u[prop]=Math.max(u[prop]||0,material?.[prop]||0);
 if(typeof source==='number')Recruit.consume(source);else{units=units.filter(v=>v!==source);shots=shots.filter(p=>p.target!==source);clearLetterWard(source);}
 if(typeof target==='number'){Recruit.replace(target,u);selected=null;card=target;}else{selected=u;card=null;mark(u.x,u.y,u.level>beforeLevel?'合成 Lv'+u.level:'預儲 '+u.basicStored+'/'+2**(u.level-1),'#f7e696');}
 sync();say(u.type+' Lv'+u.level+' · '+progress(u)+'；保留在目標位置。');return true;
}
function feed(source,target){if(!matches(source,target))return false;if(!actionAllowed())return true;if(basicMatch(source,target))return mergeBasic(source,target);const name=type(target),sourceName=type(source),material=typeof source==='number'?Recruit.saved(source):source;if(material&&(material.root>elapsed||material.ready>elapsed)){say('材料卡定身或換位冷卻中，暫時不能用於升級。');return true;}const u=typeof target==='number'?(Recruit.saved(target)||makeUnit(name,-1,-1)):target;
ensure(u);const ratio=material?Math.max(0,Math.min(1,material.hp/material.max)):1,letters=sourceName===name?[...name]:[sourceName],beforeLevel=u.level;
for(const ch of letters){u.materialCounts[ch]++;u.materialRatios[ch].push(ratio);}
// 散字先給當前剩餘血量；超過上限的部分不儲存，升級加成等材料齊備再給。
if(sourceName!==name)u.hp=Math.min(u.max,u.hp+(material?material.hp:roster[sourceName].hp));
while([...name].every(ch=>u.materialCounts[ch]>=u.materialTier+1)){const ratios=[...name].map(ch=>u.materialRatios[ch].shift()??1),before=u.max;u.materialTier++;u.level++;u.max=window.EquipmentBattle?EquipmentBattle.growHP(u):Math.round(u.max*1.12);u.atk*=1.09;u.hp=Math.min(u.max,u.hp+(u.max-before)*ratios.reduce((a,b)=>a+b,0)/ratios.length);u.xp=0;}
// 保留目標技能冷卻，材料負面狀態不因吃卡消失。
for(const prop of ['slow','stun','root','attackSlow','broken'])u[prop]=Math.max(u[prop]||0,material?.[prop]||0);
if(typeof source==='number')Recruit.consume(source);else{units=units.filter(v=>v!==source);shots=shots.filter(p=>p.target!==source);}
if(typeof target==='number'){Recruit.replace(target,u);selected=null;card=target;}else{selected=u;card=null;mark(u.x,u.y,u.level>beforeLevel?'升級':'補料','#f7e696');}
sync();say(name+' · '+progress(u)+(u.level>beforeLevel?'；升至 Lv'+u.level+'，局內經驗歸零。':'；材料已累積，經驗保留。'));return true;}
function ensure(u){u.materialTier??=1;u.materialCounts??=Object.fromEntries([...u.type].map(ch=>[ch,1]));u.materialRatios??=Object.fromEntries([...u.type].map(ch=>[ch,[]]));}
function progress(u){if(window.PlayerOfficer?.is(u?.type))return '玩家武將 · 不拆字、不接受餵卡';if(['刀','槍','弓'].includes(u?.type))return '預儲 '+(u.basicStored||0)+'／'+2**(u.level-1)+'（升 LV'+(u.level+1)+'）';if(!u?.hero)return '';ensure(u);return [...u.type].map(ch=>ch+' '+u.materialCounts[ch]+'/'+u.materialTier).join(' · ');}
function summary(){if(window.PlayerOfficer?.is(selected?.type||(card!==null?deck[card]:null)))return '玩家武將 · 不拆字、不接受餵卡';const u=selected||(card!==null?Recruit.saved(card):null);if(u?.hero||['刀','槍','弓'].includes(u?.type))return progress(u);if(card!==null&&['刀','槍','弓'].includes(deck[card]))return progress({type:deck[card],level:1});if(card!==null&&roster[deck[card]]?.skills.length)return [...deck[card]].map(ch=>ch+' 1/1').join(' · ');return '';}
function hint(source,target){if(basicMatch(source,target)){const u=saved(target),amount=(u?.basicStored||0)+basicValue(saved(source)),need=2**((u?.level||1)-1);return amount>=need?'可升級':'可預儲 '+amount+'/'+need;}const u=typeof target==='number'?Recruit.saved(target):target,name=type(target),sourceName=type(source),tier=u?.materialTier||1;return [...name].every(ch=>(u?.materialCounts?.[ch]||1)+(sourceName===name||ch===sourceName?1:0)>=tier+1)?'可升級':'可補料';}
return{matches,feed,progress,summary,hint};})();
