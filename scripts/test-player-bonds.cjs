const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),c={};c.window=c;c.PlayerOfficer={is:n=>n==='自訂主角'};vm.createContext(c);
for(const f of ['人物評定草案.js','武將品質草案.js','測試角色.js','武將戰鬥能力資料.js','蜀國武將技能資料.js','全武將補充技能資料.js','蜀國武將技能.js','武將戰鬥換算.js','羈絆規則.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const B=c.BondRules,p='自訂主角';
for(const r of B.playerRules)for(const g of r.groups){
 const names=[p,...g],state=ns=>B.states(ns).find(x=>x.id===r.id);
 assert.equal(state(names).value,r.value,r.name);assert.equal(state(g).value,0,'player absent');
 for(const missing of g)assert.equal(state(names.filter(n=>n!==missing)).value,0,'missing '+missing);
 assert.equal(B.sources(p,names).filter(x=>x.id===r.id).length,1);
 for(const n of g){assert(c.TestRoster[n]?.skills.length===2,'playable '+n);assert(!B.sources(n,names).some(x=>x.id===r.id),'player-only '+n);}
 assert.equal(state([...names,...names]).value,r.value,'duplicates');
 assert.equal(B.sources(p,[p,...r.groups.flat()]).filter(x=>x.id===r.id).length,1,'alternatives do not stack');
}
assert.equal(B.states([p,'關羽','張飛','趙雲','張遼','樂進']).find(r=>r.id==='playerFive').value,0,'mixed five not a full set');
assert.equal(B.states([p,'諸葛亮','郭嘉']).find(r=>r.id==='playerWisdom').value,0,'mixed strategist pair');
assert.equal(B.effects(p,[p,'黃忠','趙雲','童淵']).physical,.2);
assert.equal(c.OFFICER_PROPOSAL.entries.find(x=>x.name==='童淵').faction,'特殊');
for(const n of ['童淵','鄧艾','陸抗'])for(const ch of n)assert(c.TestRoster[ch]?.letter,'letter '+ch);
vm.runInContext(fs.readFileSync('補充武將能力評定資料.js','utf8'),c);vm.runInContext(fs.readFileSync('武將列表整合.js','utf8'),c);
for(const n of ['童淵','鄧艾','陸抗'])assert.equal(c.OFFICER_PROPOSAL.entries.filter(x=>x.name===n).length,1,'guide duplicate');
console.log('PASS six player bonds, every alternative and required member, no mixed/duplicate stacking, player-only effects, three playable officers and guide merge');
