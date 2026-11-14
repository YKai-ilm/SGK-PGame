/* 各能力分開統計，不建立總分或品質換算。空白不是零。 */
window.OFFICER_COMPARISON={
 summarize(rows,keys){
  const ranges=[[0,39],[40,59],[60,69],[70,79],[80,89],[90,100]];
  return Object.fromEntries(keys.map(key=>{
   const values=rows.map(r=>r[key]).filter(Number.isFinite);
   return [key,{count:values.length,missing:rows.length-values.length,average:values.length?values.reduce((a,b)=>a+b,0)/values.length:null,min:values.length?Math.min(...values):null,max:values.length?Math.max(...values):null,bins:ranges.map(([low,high])=>({label:`${low}–${high}`,count:values.filter(v=>v>=low&&v<=high).length}))}];
  }));
 }
};
