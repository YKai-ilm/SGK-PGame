'use strict';
window.Candidates=(()=>{
let current=['劉備','關羽','張飛','趙雲','黃忠','諸葛亮','徐庶'],chosen=[...current];
function apply(picks,heroes){const all=Object.keys(roster).filter(n=>roster[n].skills.length);if(!Array.isArray(picks)||!Array.isArray(heroes)||heroes.length!==7||new Set(heroes).size!==7||new Set(picks).size!==picks.length||picks.length>7||heroes.some(n=>!all.includes(n))||picks.some(n=>!heroes.includes(n)))return false;chosen=[...picks];current=[...heroes];Recruit.configure(current);if(!Recruit.enabled)$('supplyMode').click();else reset();say('已套用字卡庫候選，新的軍糧戰場已準備。');return true;}
return{loadState(data){chosen=[...data.chosen];current=[...data.heroes];Recruit.configure(current);},apply,restore(data){if(started||units.length)return false;return apply(data.chosen,data.heroes);},get heroes(){return [...current];},snapshot:()=>({heroes:[...current],chosen:[...chosen]})};})();
