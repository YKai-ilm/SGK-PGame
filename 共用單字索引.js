/* 姓名關聯資料，不推定字卡能力、品質或玩家持有狀態。 */
window.LETTER_CATALOG={
 build(people,{includeUnverified=false}={}){
  const byName=new Map(people.map(p=>[p.name,p])),letters=new Map();
  for(const p of byName.values()){
   if(p.identityPending&&!includeUnverified)continue;
   const counts=new Map();for(const char of Array.from(p.name))counts.set(char,(counts.get(char)||0)+1);
   for(const [char,quantity] of counts){
    if(!letters.has(char))letters.set(char,{char,factions:[],generals:[],attributes:null,quality:null});
    const entry=letters.get(char);if(!entry.factions.includes(p.faction))entry.factions.push(p.faction);
    entry.generals.push({name:p.name,faction:p.faction,quantity,identityPending:!!p.identityPending});
   }
  }
  return [...letters.values()].sort((a,b)=>a.char.localeCompare(b.char,'zh-Hant')).map(entry=>({...entry,factions:['魏','蜀','吳','群雄','東漢','待分類'].filter(f=>entry.factions.includes(f)),generalCount:entry.generals.length}));
 }
};
