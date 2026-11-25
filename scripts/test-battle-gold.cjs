const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('村外掃蕩.js','utf8');const fn=source.split(/\r?\n/).find(l=>l.includes('function goldReward()'));
let stored='{}';const c={regional:null,window:null,document:{querySelector:()=>null},localStorage:{getItem:()=>stored,setItem:(k,v)=>{stored=v;}}};c.window=c;vm.createContext(c);for(const f of ['共用錢包.js','劇情士氣.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);vm.runInContext(fn,c);
for(const version of [1,2,3])for(const [encounter,expected]of Object.entries({rabble:[1,2,4],deng:[2,3,6],cheng:[2,3,6]}))for(const [i,waves]of [1,3,6].entries()){
 Object.assign(c,{rewardVersion:version,encounterId:encounter,waveCount:waves});const gold=c.goldReward(),amount=version===1?waves:expected[i]*(version===3?2:1);assert.equal(gold,amount);const id=version+'-'+encounter+'-'+waves,before=c.StoryMorale.status().coins;assert.equal(c.StoryMorale.settle(id,'win',waves,gold),true);assert.equal(c.StoryMorale.status().coins-before,amount);assert.equal(c.StoryMorale.settle(id,'win',waves,gold),false);assert.equal(c.StoryMorale.status().coins-before,amount);
}
assert.equal(c.StoryMorale.settle('invalid','win',6,13),false);const coins=c.StoryMorale.status().coins;c.StoryMorale.settle('loss','loss',6,12);c.StoryMorale.settle('retreat','retreat',6,12);assert.equal(c.StoryMorale.status().coins,coins);
assert(source.includes('rewardVersion=3'));assert(!source.includes('rewardVersion=2'));assert(fs.readFileSync('戰鬥存檔.js','utf8').includes('[1,2,3].includes(s.storySweep.rewardVersion)'));
console.log('PASS all wave/encounter gold doubled for v3, original v1/v2 preserved, exact once credits, 12 gold allowed and no loss/retreat gold');

for(const leader of [null,'韓忠'])for(const [i,waves] of [1,3,6].entries()){Object.assign(c,{regional:{leader},waveCount:waves});assert.equal(c.goldReward(),(leader?[4,6,12]:[2,4,8])[i]);}
