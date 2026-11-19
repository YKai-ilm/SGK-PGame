/* 品質取符合條件的最高級；六維不變，金色需實際轉生。 */
window.OFFICER_QUALITY={version:8,date:'2026-11-08',
 tiers:['青','綠','藍','橘','紅','紫','金'],
 colors:{青:'#67bbc0',綠:'#85bb80',藍:'#85b8e0',橘:'#e8ad67',紅:'#d98989',紫:'#b69bd5',金:'#e4cb74'},
 rules:{青:'未符合綠至紫的任何條件。',綠:'平均≥66，或一項≥75，或兩項≥70；取符合的最高品質。',藍:'平均≥71，或一項≥80，或兩項≥75，或三項≥70；取符合的最高品質。',橘:'平均≥76，或一項≥88，或兩項≥83，或三項≥78；取符合的最高品質。',紅:'平均≥81，或一項≥95，或兩項≥90，或三項≥85；取符合的最高品質。',紫:'平均≥86，或一項≥98，或兩項≥95，或三項≥90。',金:'紫色十星且永久武將等級100，完成轉生後為金色一星、等級回到1；普通升星不降等級。'},
 evaluate(person,{rebirth=0}={}){
  if(person.playerCard&&this.tiers.includes(person.quality))return {quality:person.quality,baseQuality:'青',reason:'玩家卡品質由升星進度決定'};
  if(!Number.isInteger(rebirth)||rebirth<0)throw Error('轉生次數須為非負整數');
  const keys=['str','int','lead','body','agi','charm'],values=keys.map(k=>person[k]);
  const complete=values.every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=100);
  const average=complete?values.reduce((a,b)=>a+b,0)/6:null;
  const atLeast85=complete?keys.filter(k=>person[k]>=85):[];
  const atLeast90=complete?keys.filter(k=>person[k]>=90):[],atLeast95=complete?keys.filter(k=>person[k]>=95):[];
  let baseQuality=null,matchedConditions=[];
  if(complete){
   for(const [tier,avg,one,two,three] of [['紫',86,98,95,90],['紅',81,95,90,85],['橘',76,88,83,78],['藍',71,80,75,70],['綠',66,75,70,null]]){
    const conditions=[];
    if(average>=avg)conditions.push(`平均≥${avg}`);
    for(const [count,threshold] of [[1,one],[2,two],[3,three]])if(threshold!==null){const fields=keys.filter(k=>person[k]>=threshold);if(fields.length>=count)conditions.push(`${count}項≥${threshold}`);}
    if(conditions.length){baseQuality=tier;matchedConditions=conditions;break;}
   }
   if(!baseQuality)baseQuality='青';
  }
  const quality=rebirth>=1?'金':baseQuality;
  const reason=rebirth>=1?'轉生試算已達一轉以上，列金；不代表實際角色已轉生。':complete?`平均 ${average.toFixed(2)}；${matchedConditions.length?'符合'+matchedConditions.join('、'):'未符合綠至紫條件'}；由高至低取${quality}色，門檻包含等於，平均不先四捨五入。`:'六項能力未完整，暫不判定基本品質。';
  return {name:person.name,average,atLeast85,atLeast90,atLeast95,matchedConditions,baseQuality,quality,rebirth,reason};
 }
};
