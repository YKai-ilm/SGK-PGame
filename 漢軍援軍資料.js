'use strict';
// Only register encounter variants in the two Han campaign battles; permanent cards are unchanged.
if(new URLSearchParams(location.search).has('hanBattle')){
 const definitions={
  '盧植':{kind:'hit',range:2,skills:[{...TestRoster['劉備'].skills[1],name:'援軍・護陣',cd:7},{...TestRoster['徐庶'].skills[1],name:'援軍・整軍',cd:8}]},
  '朱儁':{kind:'hit',range:2,skills:[{...TestRoster['關平'].skills[0],name:'援軍・奮擊',cd:6},{...TestRoster['張飛'].skills[1],name:'援軍・堅守',cd:7}]},
  '皇甫嵩':{kind:'magic',range:3.5,skills:[{...TestRoster['諸葛亮'].skills[0],name:'援軍・火攻',cd:9},{...TestRoster['諸葛亮'].skills[1],name:'援軍・截勢',cd:8}]}
 };
 for(const [name,d]of Object.entries(definitions)){const base=HERO_COMBAT_DATA[name],s=HeroCombat.calculate(base.abilities,base.quality,1),atk=d.kind==='magic'?s.magic:s.physical;TestRoster[name]={...d,hp:s.hp,atk,def:s.def,mdef:s.mdef,interval:s.interval,group:d.kind==='magic'?'遠攻':'近戰',quality:base.quality,physicalRatio:s.physical/atk,magicRatio:s.magic/atk,supportRatio:s.support/atk,combatVersion:1};}
}
