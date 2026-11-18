'use strict';
window.HeroCombat=(()=>{
 const tiers=['青','綠','藍','橘','紅','紫'];
 function calculate(p,quality,stars=1){
  const rank=tiers.indexOf(quality);
  if(rank<0||!Number.isInteger(stars)||stars<1||stars>10||!['str','int','lead','body','agi','charm'].every(k=>Number.isFinite(p[k])&&p[k]>=0&&p[k]<=100))throw Error('武將戰鬥換算資料無效');
  const score={physical:p.str,magic:p.int,hp:p.body,def:p.lead*.7+p.str*.3,mdef:p.int*.7+p.lead*.3,support:p.charm,rate:p.agi};
  const base={physical:p.str*2,magic:p.int*2,hp:400+p.body*8,def:p.lead*.42+p.str*.18,mdef:p.lead*.2+p.int*.4,support:p.charm*1.5,rate:.5+p.agi*.005};
  const gain=rank*.14+(stars-1)*.01,out={};
  for(const k of Object.keys(base)){const scale=k==='rate'?.2:['def','mdef'].includes(k)?.5:1;out[k]=base[k]*(1+gain*(.75+.5*score[k]/100)*scale);}
  return {...out,hp:Math.round(out.hp),interval:1/out.rate,quality,stars};
 }
 function stats(name){const d=window.HERO_COMBAT_DATA?.[name];return d?calculate(d.abilities,d.quality):null;}
 // Encounter growth is independent of player ownership and permanent progression.
 function encounter(name,config={},wave=1){
  const d=window.HERO_COMBAT_DATA?.[name];
  if(!d||!Number.isInteger(wave)||wave<1||!config||typeof config!=='object')throw Error('敵將關卡設定無效');
  const baseLevel=config.baseLevel??1;
  if(!Number.isInteger(baseLevel)||baseLevel<1||baseLevel>100)throw Error('敵將起始等級無效');
  const level=config.level??(baseLevel+wave-1);
  if(!Number.isInteger(level)||level<1||level>100)throw Error('敵將出場等級無效');
  const s=calculate(d.abilities,config.quality??d.quality,config.stars??1);
  let hp=s.hp;for(let i=1;i<level;i++)hp=Math.round(hp*1.12);
  const gain=1.09**(level-1);
  return {name,quality:s.quality,stars:s.stars,level,hp,atk:s.physical*gain,magicAttack:s.magic*gain,def:s.def,mdef:s.mdef,interval:s.interval};
 }
 // atk remains the primary attack for existing local level-up and save code.
 // Store the ratios on each unit so an older battle cannot change after roster edits.
 function power(u,magic=false,includeEquipment=true){return u.atk*(magic?(u.magicRatio??1):(u.physicalRatio??1))*(includeEquipment?1+(magic?u.equipmentMagicRate||0:u.equipmentPhysicalRate||0):1)+(includeEquipment?(magic?u.equipmentMagic||0:u.equipmentPhysical||0):0);}
 function support(u){return (u.supportRatio===undefined?180:u.atk*u.supportRatio*1.2)*(1+(u.equipmentSupportRate||0));}
 for(const [name,d] of Object.entries(window.TestRoster||{})){
  if(d.letter||!d.skills.length)continue;
  const s=stats(name);if(!s)throw Error('缺少武將六維：'+name);
  const primary=d.kind==='magic'?s.magic:s.physical;
  Object.assign(d,{hp:s.hp,atk:primary,def:s.def,mdef:s.mdef,interval:s.interval,physicalRatio:s.physical/primary,magicRatio:s.magic/primary,supportRatio:s.support/primary,quality:s.quality,combatVersion:1});
  for(const skill of d.skills){
   if(skill.id==='heal')skill.desc='治療全場生命比例最低的受傷友軍，回復輔助力120%，可治療自身。';
   if(skill.id==='shield')skill.desc='為全場一名生命低於60%的友軍提供輔助力120%的護盾，可保護自身；同源護盾不累加。';
  }
 }
 return {calculate,stats,encounter,power,support};
})();
