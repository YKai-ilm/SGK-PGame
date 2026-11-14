/* 試算提案，未接入角色戰鬥.js；永久等級固定LV1，不含技能、裝備、羈絆。 */
window.COMBAT_GROWTH_PROPOSAL={
 version:1,tiers:['青','綠','藍','橘','紅','紫'],
 calculate(p,quality,stars){
  const rank=this.tiers.indexOf(quality);
  if(rank<0||!Number.isInteger(stars)||stars<1||stars>10)throw Error('只試算青至紫、1至10星');
  for(const k of ['str','int','lead','body','agi','charm'])if(!Number.isFinite(p[k])||p[k]<0||p[k]>100)throw Error('六項能力須完整且介於0至100');
  const base={physicalAttack:p.str*2,strategyAttack:p.int*2,hp:400+p.body*8,physicalDefense:p.lead*.6,strategyDefense:p.lead*.2+p.int*.4,support:p.charm*1.5,attackRate:.5+p.agi*.005};
  const multiplier=1+rank*.1+(stars-1)*.01;
  const stats=Object.fromEntries(Object.entries(base).map(([k,v])=>[k,k==='attackRate'?v:v*multiplier]));
  return {quality,stars,multiplier,base,stats,attackInterval:1/stats.attackRate,physicalDpsAgainst100:stats.physicalAttack*.5*stats.attackRate,strategyDpsAgainst100:stats.strategyAttack*.5*stats.attackRate,physicalEffectiveHp:stats.hp*(1+stats.physicalDefense/100)};
 }
};
