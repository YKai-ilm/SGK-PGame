'use strict';
// Handbook-only baseline study. No save access and no mutation of live battle stats.
window.NakedHPStudy=(()=>{
 const levels=[1,10,20,40,60,80,100],stars=[1,3,6,10];
 function calculate(name,permanentLevel=1,star=1,battleLevel=1){
  const d=window.HERO_COMBAT_DATA?.[name];
  if(!d||!Number.isInteger(permanentLevel)||permanentLevel<1||permanentLevel>100||!Number.isInteger(star)||star<1||star>10||!Number.isInteger(battleLevel)||battleLevel<1||battleLevel>100)throw Error('裸裝生命試算條件不正確');
  const base=window.HeroCombat.calculate(d.abilities,d.quality,star).hp;
  const permanentHP=Math.round(base*(1+.04*(permanentLevel-1)));
  let projectedBattleHP=permanentHP;for(let i=1;i<battleLevel;i++)projectedBattleHP=Math.round(projectedBattleHP*1.12);
  let liveBattleHP=window.HeroCombat.stats(name).hp;for(let i=1;i<battleLevel;i++)liveBattleHP=Math.round(liveBattleHP*1.12);
  return {name,quality:d.quality,body:d.abilities.body,star,permanentLevel,battleLevel,base,permanentHP,projectedBattleHP,liveBattleHP};
 }
 return {levels,stars,calculate};
})();
