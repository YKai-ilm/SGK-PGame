/* 單入口連續道路；路線只決定關卡地形，不另行定義戰鬥規則。 */
window.BattleRoutes=(()=>{
 const legacyNames={u:'環邊行軍',snake:'S型折返',stairs:'階梯轉折',spiral:'向內迴繞'};
 function legacyBuild(n,rows,type='u'){
  const r=n-2,b=rows-2,m=Math.floor(rows/2),cx=Math.floor(n/2);
  const corners=type==='snake'?[[1,1],[r,1],[r,m],[1,m],[1,b],[r,b]]:type==='stairs'?[[1,1],[cx,1],[cx,3],[r,3],[r,m+1],[cx-1,m+1],[cx-1,b],[1,b]]:type==='spiral'?[[1,1],[r,1],[r,b],[1,b],[1,3],[r-2,3],[r-2,b-2]]:[[1,1],[r,1],[r,b],[1,b]];
  const cells=[{x:corners[0][0],y:corners[0][1]}];for(const [x,y]of corners.slice(1)){let p=cells.at(-1);while(p.x!==x||p.y!==y){p={x:p.x+Math.sign(x-p.x),y:p.y+Math.sign(y-p.y)};cells.push(p);}}return cells;
 }
 const stairs={step1:'階梯一・逐段推進',step2:'階梯二・折返穿行',step3:'階梯三・曲折穿谷',step4:'階梯四・回鉤轉進'};
 const rings={ring1:'環圈一・內縮回鉤',ring2:'環圈二・折返環谷'};
 const names={...legacyNames,...stairs,...rings};
 for(const m of window.BattleMapPresets||[])if(!names[m.id])names[m.id]=m.name;
 const sizes=['6x10','6x15','10x6','10x12'];
 function orientationSize(stage=false){return innerWidth>innerHeight?(stage?[10,12]:[10,6]):(stage?[6,15]:[6,10]);}
 function available(n,rows){const custom=(window.BattleMapPresets||[]).filter(m=>m.cols===n&&m.rows===rows);if(custom.length)return custom.map(m=>m.id);return (n===10&&rows===6||n===6&&rows===10)?Object.keys(stairs):[...Object.keys(stairs),...Object.keys(rings)];}
 function build(n,rows,type='step1'){
  const preset=(window.BattleMapPresets||[]).find(m=>m.cols===n&&m.rows===rows&&m.id===type);if(preset)return preset.path.map(p=>({...p}));
  if(Object.hasOwn(legacyNames,type))return legacyBuild(n,rows,type);
  if(n===6&&(rows===10||rows===15))return build(rows,6,type).map(p=>({x:p.y,y:p.x}));
  if(![...sizes,'15x6','15x12'].includes(n+'x'+rows)||![...Object.keys(stairs),...Object.keys(rings)].includes(type))throw Error('地圖尺寸與路線不相容');
  const a=Math.floor(n/3),b=Math.floor(n*2/3),m=Math.floor((rows-1)/2),bottom=rows-2;
  let corners={step1:[[0,1],[a,1],[a,m],[b,m],[b,bottom],[n-1,bottom]],step2:[[0,1],[b,1],[b,m],[a,m],[a,bottom],[n-1,bottom]],step3:[[0,bottom],[2,bottom],[2,1],[b-1,1],[b-1,bottom-1],[n-3,bottom-1],[n-3,1],[n-1,1]],step4:[[1,0],[1,m],[a,m],[a,1],[b,1],[b,bottom],[n-1,bottom]]}[type];
  // 環圈外側至少留一格；短圖用橫向回鉤，長圖提早收進內圈。
  if(type==='ring1')corners=rows===6
   ?[[1,1],[n-3,1],[n-3,4],[3,4],[3,3],[n-5,3]]
   :[[1,1],[n-3,1],[n-3,rows-3],[2,rows-3],[2,3],[n-5,3],[n-5,rows-5]];
  if(type==='ring2')corners=rows===6
   ?[[n-2,4],[2,4],[2,1],[n-4,1],[n-4,2],[5,2]]
   :[[n-2,1],[3,1],[3,rows-4],[n-3,rows-4],[n-3,3],[5,3],[5,rows-6]];
  const cells=[{x:corners[0][0],y:corners[0][1]}];
  for(const [x,y]of corners.slice(1)){let p=cells.at(-1);if(p.x!==x&&p.y!==y)throw Error('道路不可斜接');while(p.x!==x||p.y!==y){p={x:p.x+Math.sign(x-p.x),y:p.y+Math.sign(y-p.y)};cells.push(p);}}
  if(new Set(cells.map(p=>p.x+','+p.y)).size!==cells.length)throw Error('道路不可交叉重疊');return cells;
 }
 // 城門最後一段進軍方向的延伸側，視為城後區域。
 function behindGate(x,y,road){if(!road||road.length<2)return false;const g=road.at(-1),p=road.at(-2);return (x-g.x)*(g.x-p.x)+(y-g.y)*(g.y-p.y)>0;}
 function syncOptions(n,rows,keepLegacy=false){const select=document.getElementById('routePattern');if(!select)return;const old=select.value;
  const list=window.TutorialBattleConfig?Object.keys(legacyNames):available(n,rows);if(keepLegacy&&names[old]&&!list.includes(old))list.push(old);
  select.replaceChildren(...list.map(value=>{const o=document.createElement('option');o.value=value;o.textContent=names[value];return o;}));select.value=list.includes(old)?old:list[0];
 }
 function selectSaved(type,n,rows){const select=document.getElementById('routePattern');if(!select)return;if(![...select.options].some(o=>o.value===type)){const o=document.createElement('option');o.value=type;o.textContent=names[type]||type;select.append(o);}select.value=type;syncOptions(n,rows,true);}
 function mount(){if(document.getElementById('routePattern'))return;const select=document.createElement('select');select.id='routePattern';select.setAttribute('aria-label','路線模式');select.style.cssText='font-size:11px;min-height:25px;height:25px;padding:2px;max-width:140px';document.getElementById('size').after(select);const [w,h]=document.getElementById('size').value.split('x').map(Number);syncOptions(w,h||w);select.onchange=()=>reset();}
 return{build,mount,names,available,sizes,orientationSize,syncOptions,selectSaved,behindGate};
})();
