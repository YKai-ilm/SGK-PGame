const assert=require('node:assert/strict'),{chromium}=require(process.env.USERPROFILE+'/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.GameAudioShell=true;delete Navigator.prototype.serviceWorker;});const root='http://localhost:4192/',key='three-kingdoms-interface-preview-v1';await page.goto(root+encodeURIComponent('徐州劇情.html'));
const cases=[
 ['成軍前',{army:false},'壯士先救護軍','grain:armyFormed'],
 ['成軍後首次軍令',{},'糧道雖已暫安','yellow:launched'],
 ['初戰覆命',{yellow:{launched:true,reported:true,hqWon:true,hqShown:true}},'前哨與主營皆已擊退','yellow:completed'],
 ['赴盧植軍前',{yellow:{launched:true,completed:true}},'官道得以重通','han:departed'],
 ['漢軍會師完成',{late:true},'南陽軍情已明',null],
 ['宛城完成',{late:true,wan:{ordered:true,completed:true}},'宛城已定',null],
 ['下曲陽收復尚未軍前覆命',{late:true,three:{ordered:true,quyangRecovered:true}},'請先回廣宗軍前',null],
 ['兩城軍前覆命完成',{late:true,three:{ordered:true,quyangRecovered:true,reported:true,completed:true}},'廣宗與下曲陽皆已收復','quyang:chapterCompleted'],
 ['章末已回報',{late:true,three:{ordered:true,quyangRecovered:true,reported:true,completed:true,chapterCompleted:true}},'兩城收復的戰報已收下',null]
];
for(const [name,options,line,action]of cases){await page.evaluate(({options,key})=>{localStorage.clear();const s={version:1,mode:'story',storyFaction:'蜀',tutorial:{status:'skipped'},teams:{},storyEvents:{grainRoute:{captainGift:true,reported:true,completed:true,armyFormed:options.army!==false},yellowOpening:options.yellow||(options.late?{launched:true,reported:true,completed:true}:{}),hanCampaign:options.late?{departed:true,completed:true}:{},wancheng:options.wan||{},threeZhang:options.three||{}},rewards:{wallet:{coins:1234,diamonds:7}},sentinel:'keep'};localStorage.setItem(key,JSON.stringify(s));localStorage.setItem('three-kingdoms-xuzhou-story-v1',JSON.stringify({scene:'城主府',flags:{},history:[],active:null}));},{options,key});await page.reload();await page.locator('[data-name="陶謙"]').click();assert((await page.locator('#line').textContent()).includes(line),name);const active=await page.evaluate(()=>JSON.parse(localStorage.getItem('three-kingdoms-xuzhou-story-v1')).active);assert.equal(active.action||null,action,name);
if(action==='quyang:chapterCompleted'){for(let i=0;i<4;i++)await page.locator('#nextLine').click();const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);assert(saved.storyEvents.threeZhang.chapterCompleted);assert.equal(saved.rewards.wallet.coins,1234);assert.equal(saved.sentinel,'keep');await page.locator('#menuButtons button').click();await page.reload();await page.locator('[data-name="陶謙"]').click();assert((await page.locator('#line').textContent()).includes('兩城收復的戰報已收下'));}
console.log('PASS '+name);}
assert.deepEqual(errors,[]);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
