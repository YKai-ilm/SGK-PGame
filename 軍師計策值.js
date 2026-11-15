'use strict';
window.StrategyPoints={
 canAppoint(name){const i=window.HERO_COMBAT_DATA?.[name]?.abilities?.int;return Number.isInteger(i)&&i>=65&&i<=100;},
 // Permanent officer progression is not connected yet; current officers are level 1.
 level(name){return 1;},
 breakdown(name,level=this.level(name)){
  if(!Number.isInteger(level)||level<1||level>100)throw Error('軍師等級須為1至100');
  if(!this.canAppoint(name))return {base:0,bonus:0,total:0};
  const base=10,bonus=Math.floor((level-1)*window.HERO_COMBAT_DATA[name].abilities.int/100);
  return {base,bonus,total:base+bonus};
 },
 capacity(name,level=this.level(name)){return this.breakdown(name,level).total;}
};
