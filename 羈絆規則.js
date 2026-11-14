'use strict';
window.BondRules=(()=>{
 const rules=[
  {id:'peach',name:'桃園結義',members:['劉備','關羽','張飛'],stages:[{count:2,value:.05},{count:3,value:.10}],kind:'reduction',label:'受到傷害降低'},
  {id:'tigers',name:'五虎將',members:['關羽','張飛','趙雲','黃忠','馬超'],stages:[{count:2,value:.10},{count:3,value:.15},{count:5,value:.25}],kind:'physical',label:'武力傷害提高'},
  {id:'strategists',name:'臥龍元直',members:['諸葛亮','徐庶'],stages:[{count:2,value:.15}],kind:'magic',label:'謀略傷害提高'},
{id:'qiao',name:'江東二喬',members:['大喬','小喬'],stages:[{count:2,value:.15}],kind:'healing',label:'受到治療提高'},
 {id:'ling',name:'凌氏先鋒',members:['凌操','凌統'],stages:[{count:2,value:.2}],kind:'lingDefense',label:'接敵物防提高'}
 ];
 function states(activeNames){const names=new Set(activeNames);return rules.map(rule=>{const present=rule.members.filter(n=>names.has(n)),stage=rule.stages.filter(s=>present.length>=s.count).at(-1);return{...rule,present,missing:rule.members.filter(n=>!names.has(n)),value:stage?.value||0};});}
 function sources(name,activeNames){if(!activeNames.includes(name))return[];return states(activeNames).filter(r=>r.value>0&&(r.members.includes(name)||r.id==='qiao')).map(r=>({id:r.id,name:r.name,kind:r.kind,label:r.label,value:r.id==='qiao'&&!r.members.includes(name)?.10:r.value,count:r.stages.filter(s=>r.present.length>=s.count).at(-1).count}));}
 function effects(name,activeNames){const result={physical:0,magic:0,reduction:0};for(const r of sources(name,activeNames))result[r.kind]=(result[r.kind]||0)+r.value;return result;}
 function describe(source){if(source.kind==='lingDefense')return '凌氏先鋒：接敵物防+20%持續3秒，之後冷卻5秒；各自計時，撤回換位不重刷。';return source.name+'（'+source.count+'人階段）：'+source.label+Math.round(source.value*100)+'%'+(source.kind==='reduction'?'（武力與謀略皆適用）':'');}
 function healing(name,activeNames){const q=states(activeNames).find(r=>r.id==='qiao');return q?.value?(q.members.includes(name)?.15:.10):0;}
 return{rules,states,effects,sources,describe,healing};
})();
