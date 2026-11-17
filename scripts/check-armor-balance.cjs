const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c={window:{},elapsed:0,roster:{},mark(){},letterMorale(){return 0},letterHit(){},gate:{},selected:null,moving:false};
for(const f of ['測試角色.js','武將戰鬥能力資料.js','武將戰鬥換算.js','武將裝備.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);
// 使用正式傷害函式；隔離羈絆、技能與地形，單獨測量裝備防禦。
const source=fs.readFileSync('角色戰鬥.js','utf8');const hurt=source.split(/\r?\n/).find(l=>l.startsWith('function hurt('));assert(hurt);vm.runInNewContext(hurt,c);
function hit(def,mdef,raw,magic,fixed=false,broken=false){const u={hp:1e9,max:1e9,def,mdef,shield:0,blocks:0,guard:0,broken:broken?1:0,type:'驗算'};c.hurt(u,raw,magic,null,fixed);return 1e9-u.hp;}
assert(Math.abs(hit(50,50,300,false)-200)<1e-6);assert.equal(hit(325,133,300,false,true),300);
assert(Math.abs(hit(325,133,300,true,false,true)-30000/(100+133*.6))<1e-6);
const score=c.window.EquipmentSystem.scoreStats;
const tiers=[[20,12,4,8],[40,24,7,15],[80,49,15,30],[150,94,28,56],[250,164,49,94],[400,275,83,150]];
const tierRows=tiers.map(([attack,d,m,b])=>{const target=score({physical:attack}),heavy=score({def:d,mdef:m}),light=score({def:b,mdef:b});assert(Math.abs(heavy-target)/target<=.05);assert(Math.abs(light-target)/target<=.05);return {attack,target,def:d,mdef:m,heavy,balanced:b,light};});
const armors=[{name:'未穿防具',def:0,mdef:0},{name:'原百鍊戰甲',def:110,mdef:33},{name:'百鍊戰甲（調整）',def:275,mdef:83},{name:'龍鱗甲（調整）',def:150,mdef:150},{name:'星紋法袍（調整）',def:83,mdef:275}];
function incoming(base,a,raw,p){return p*hit(base.def+a.def,base.mdef+a.mdef,raw,false)+(1-p)*hit(base.def+a.def,base.mdef+a.mdef,raw,true);}
const base={hp:4000,def:50,mdef:50};
const ratios=armors.map(a=>({name:a.name,power:score({def:a.def,mdef:a.mdef}),physical:incoming(base,armors[0],300,1)/incoming(base,a,300,1),mixed:incoming(base,armors[0],300,.5)/incoming(base,a,300,.5),magic:incoming(base,armors[0],300,0)/incoming(base,a,300,0)}));
const heroes=Object.keys(c.window.HERO_COMBAT_DATA).map(name=>({name,...c.window.HeroCombat.stats(name)}));
const heroRanges=armors.slice(2).map(a=>{const values=heroes.map(h=>incoming(h,armors[0],300,.5)/incoming(h,a,300,.5));return {name:a.name,count:values.length,min:Math.min(...values),max:Math.max(...values)};});
// 整秒攻擊先發生，5秒治療其後發生；不復活。600秒仍存活僅記錄觀測上限。
function survive(a,raw,p,heal,hp=4000){let life=hp;const loss=incoming(base,a,raw,p);for(let sec=1;sec<=600;sec++){life-=loss;if(life<=1e-5)return sec;if(sec%5===0)life=Math.min(hp,life+heal);}return '≥600';}
const heals=[];for(const raw of [300,600])for(const heal of [0,400,800])for(const a of armors.slice(0,1).concat(armors.slice(2)))heals.push({raw,heal,name:a.name,seconds:survive(a,raw,.5,heal),withNecklace:survive(a,raw,.5,heal,4500)});
const fmt=x=>Number(x).toFixed(2),table=(heads,rows)=>'<div class="scroll"><table><tr>'+heads.map(x=>'<th>'+x+'</th>').join('')+'</tr>'+rows.map(r=>'<tr>'+r.map(v=>'<td>'+v+'</td>').join('')+'</tr>').join('')+'</table></div>';
const html='<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>防具攻防驗算｜設計資料</title><style>body{max-width:1100px;margin:auto;padding:24px;background:#f4f0e3;color:#294236;font:17px/1.8 system-ui}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bac4ad;padding:8px;text-align:left}.scroll{overflow:auto}a{color:#285c50}</style><h1>防具攻防驗算</h1><p><a href="裝備道具建議清單.html#armor-catalog">返回防具配置</a> · <a href="行旅手冊.html#archive">返回設計資料</a></p><p>這是可重跑的隔離驗算；已驗算的普通防具雙防效果已接入，取得狀態請見裝備攻略。使用正式 hurt 傷害函式與現有武將六維資料，排除羈絆、暴擊、控制、護盾與角色技能；不代表整場勝率測試。</p><h2>六階同戰力配置</h2>'+table(['攻擊基準','武器戰力','重甲物防／謀防','重甲戰力','輕甲雙防各','輕甲戰力'],tierRows.map(r=>[r.attack,r.target,r.def+'／'+r.mdef,r.heavy,r.balanced,r.light]))+'<p>法袍將重甲雙防對調。六階三類與同階武器的戰力差均在5%內。</p><h2>不治療的存活時間倍率</h2><p>參考生命4000、雙防各50；同一原始輸出，混合情境為物理／謀略各半。倍率以未穿防具為1。</p>'+table(['防具','戰力','純物理','物謀各半','純謀略'],ratios.map(r=>[r.name,r.power,fmt(r.physical)+'倍',fmt(r.mixed)+'倍',fmt(r.magic)+'倍']))+'<h2>現有一級武將的混合承傷驗算</h2>'+table(['防具','武將數','存活提升最小','最大'],heroRanges.map(r=>[r.name,r.count,fmt(r.min)+'倍',fmt(r.max)+'倍']))+'<h2>治療壓力測試</h2><p>每秒一次混合攻擊，表內原始攻擊為防禦減傷前數值。每5秒固定治療400或800是壓力測試輸入，不代表丹藥或技能正式配值。先受擊再治療，不復活；≥600表示600秒觀測期內未死亡，不等於證明無敵。項鍊情境僅加生命500。</p>'+table(['每秒原始攻擊','每5秒治療','防具','存活秒數','加金項鍊後'],heals.map(r=>[r.raw,r.heal,r.name,r.seconds,r.withNecklace]))+'<h2>結論與使用限制</h2><p>275／83重甲、150／150輕甲、83／275法袍可以作為＋400武器的同戰力防具配置，但不是所有關卡都同效。治療接近裝備後承傷時會使存活時間非線性放大；治療足以補回承傷且撐過治療間隔時，可持續存活。低階敵人面對高階防具容易出現此情況，不能用同分宣稱全場平衡。</p><p>正式開放前需按取得階段驗算敵方持續傷害、治療頻率及集火；不直接削弱既有治療或改動減傷公式。固定傷害不受防具保護；謀防破防沿用現有60%防禦計算。藤甲火傷倍率、減暴擊、護盾與技能組合未在本次定案。</p></html>';
fs.writeFileSync('防具攻防驗算.html',html);
console.log(JSON.stringify({tierRows,ratios,heroRanges,heals},null,2));
