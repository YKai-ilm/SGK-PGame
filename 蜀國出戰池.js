'use strict';
window.ShuBattlePool=(()=>{
 const names=[...new Set([...SHU_SKILL_DESIGN.names,...(window.ADDITIONAL_HERO_SKILLS?.entries||[]).filter(r=>['蜀','特殊'].includes(r.faction)).map(r=>r.name)])];
 function read(key){try{return JSON.parse(localStorage.getItem(key)||'{}');}catch{return {};}}
 function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function eligible(state){return new Set((state.unlocks?.story?.heroes||[]).filter(n=>names.includes(n)));}
 function fill(state,story,picks=null,rng=Math.random){
  const allowed=eligible(state),chosen=[...new Set((picks??state.teams?.['story:蜀']?.slots??[]).filter(n=>allowed.has(n)))].slice(0,7);
  const party=['劉備',...(story.party||[]).filter(n=>['關羽','張飛'].includes(n))];
  const heroes=[...chosen,...shuffle([...new Set(party)].filter(n=>!chosen.includes(n)),rng).slice(0,7-chosen.length)];
  heroes.push(...shuffle(names.filter(n=>!heroes.includes(n)),rng).slice(0,7-heroes.length));
  return {chosen,heroes};
 }
 function current(picks=null){return fill(read('three-kingdoms-interface-preview-v1'),read('three-kingdoms-taoyuan-dialogue-v1'),picks);}
 function canChoose(name){return eligible(read('three-kingdoms-interface-preview-v1')).has(name);}
 return {names:[...names],fill,current,canChoose};
})();
