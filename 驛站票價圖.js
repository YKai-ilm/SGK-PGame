'use strict';
(()=>{const $=id=>document.getElementById(id),network=WorldTravel.fareNetwork(),names=network.towns.map(t=>t.name),ns='http://www.w3.org/2000/svg';
for(const id of ['from','to'])for(const name of names){const o=document.createElement('option');o.value=name;o.textContent=name;$(id).append(o);}
$('from').value='徐州';$('to').value='廣宗';
function svg(tag,attrs,text){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);if(text)el.textContent=text;return el;}
// Independent schematic positions; never use or modify the world-map coordinates.
const rows=[
 [1,[[7,'朔方'],[10,'雁門'],[14,'幽州'],[17,'北平']]],
 [3,[[1,'武威'],[4,'安定'],[10,'太原'],[14,'桃源村']]],
 [5,[[1,'金城'],[4,'街亭'],[10,'上黨'],[12,'鄴'],[14,'廣宗'],[16,'冀州'],[18,'平原'],[21,'北海']]],
 [7,[[1,'天水'],[4,'五丈原'],[7,'長安'],[10,'洛陽'],[13,'虎牢關'],[16,'官渡'],[18,'小沛'],[21,'東海']]],
 [9,[[1,'祁山'],[4,'陳倉'],[7,'弘農'],[10,'宜陽'],[13,'許昌'],[16,'陳留'],[19,'徐州'],[22,'黑風寨']]],
 [11,[[1,'武都'],[4,'漢中'],[7,'漢水'],[10,'宛城'],[13,'長社'],[16,'汝南'],[19,'下邳'],[22,'雲龍山']]],
 [13,[[1,'陰平'],[4,'定軍山'],[10,'新野'],[16,'古城'],[19,'壽春'],[22,'合肥']]],
 [15,[[1,'綿虒'],[4,'葭萌'],[7,'涪城'],[10,'樊城'],[16,'江夏'],[19,'廬江'],[22,'建業']]],
 [17,[[1,'成都'],[4,'雒城'],[7,'白帝城'],[10,'襄陽'],[13,'長坂坡'],[16,'赤壁'],[19,'柴桑'],[22,'會稽']]],
 [19,[[1,'江陽'],[4,'江州'],[7,'夷陵'],[10,'麥城'],[13,'江陵'],[16,'華容道'],[19,'豫章'],[22,'夷洲']]],
 [21,[[1,'朱提'],[10,'武陵'],[16,'長沙'],[22,'建安']]],
 [23,[[1,'建寧'],[10,'零陵'],[16,'桂陽']]],
 [25,[[1,'雲南'],[10,'交趾'],[16,'南海']]]
];
const positions={};for(const [y,items]of rows)for(const [x,n]of items)positions[n]={x:60+x*70,y:30+y*60};
const lines=[
 ['河北驛路','#bb3348','北平 幽州 桃源村 冀州 廣宗 鄴 上黨 太原 雁門 朔方'],
 ['中原驛路','#2878aa','北海 平原 小沛 陳留 官渡 虎牢關 洛陽 弘農 長安 陳倉 五丈原 街亭 安定 武威'],
 ['江淮驛路','#c28a21','北海 東海 徐州 下邳 壽春 合肥 廬江 柴桑 建業 會稽 夷洲'],
 ['荊楚驛路','#27856c','虎牢關 許昌 長社 宛城 新野 樊城 襄陽 長坂坡 江陵 武陵 零陵 桂陽 南海 交趾'],
 ['巴蜀驛路','#845ba5','長安 漢中 定軍山 葭萌 涪城 雒城 成都 江陽 朱提 建寧 雲南'],
 ['江南驛路','#cb6236','江陵 華容道 赤壁 長沙 桂陽'],
 ['隴右驛路','#6b7d3c','武威 金城 天水 祁山 武都 陰平 葭萌'],
 ['聯絡支路','#82959a','']
];
const edgeKey=(a,b)=>[a,b].sort().join('|'),colors=new Map();for(const [,color,seq]of lines){const a=seq.split(' ');for(let i=1;i<a.length;i++)colors.set(edgeKey(a[i-1],a[i]),color);}
const degree=Object.fromEntries(names.map(n=>[n,0]));for(const [a,b]of network.roads){degree[a]++;degree[b]++;}
// Route on a schematic grid, avoiding other station circles and name labels.
const unit=10,W=174,H=163,occupied=new Set(),used=new Map();
const verticalStops=new Set(network.roads.filter(([a,b])=>positions[a].x===positions[b].x).flat());
const obstacles=new Map();
for(const [n,p]of Object.entries(positions)){
 const cells=new Set(),side=verticalStops.has(n);
 for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)cells.add((p.x/unit+x)+','+(p.y/unit+y));
 for(let x=side?2:-5;x<=(side?10:5);x++)for(let y=-4;y<=-1;y++)cells.add((p.x/unit+x)+','+(p.y/unit+y));
 obstacles.set(n,cells);for(const k of cells)occupied.add(k);
}
function routeEdge(a,b){
 const start=positions[a],end=positions[b],sx=start.x/unit,sy=start.y/unit,ex=end.x/unit,ey=end.y/unit;
 // Clear aligned segments stay straight, regardless of previous edge routing.
 if(sx===ex||sy===ey){
  const cells=[],dx=Math.sign(ex-sx),dy=Math.sign(ey-sy);let clear=true;
  for(let x=sx,y=sy;;x+=dx,y+=dy){const k=x+','+y;cells.push(k);for(const [n,blocked]of obstacles)if(n!==a&&n!==b&&blocked.has(k))clear=false;if(x===ex&&y===ey)break;}
  if(clear){for(const k of cells)used.set(k,(used.get(k)||0)+1);return [[start.x,start.y],[end.x,end.y]];}
 }
 const id=(x,y)=>x+','+y, heuristic=(x,y)=>Math.abs(x-ex)+Math.abs(y-ey),queue=[{x:sx,y:sy,g:0,f:0,dir:-1}],best=new Map([[id(sx,sy),0]]),parents=new Map();
 let found=false;
 while(queue.length){queue.sort((a,b)=>b.f-a.f);const cur=queue.pop();if(cur.g>best.get(id(cur.x,cur.y)))continue;if(cur.x===ex&&cur.y===ey){found=true;break;}
  for(const [d,[dx,dy]]of [[1,0],[0,1],[-1,0],[0,-1]].entries()){
   const x=cur.x+dx,y=cur.y+dy,k=id(x,y);if(x<2||x>W||y<2||y>H)continue;
   const nearStart=Math.abs(x-sx)<=5&&Math.abs(y-sy)<=4,nearEnd=Math.abs(x-ex)<=5&&Math.abs(y-ey)<=4;
   if(occupied.has(k)&&!nearStart&&!nearEnd)continue;

   const g=cur.g+1+(cur.dir!==d&&cur.dir!==-1?2:0)+(used.get(k)||0)*5;
   if(g>=(best.get(k)??Infinity))continue;best.set(k,g);parents.set(k,id(cur.x,cur.y));queue.push({x,y,g,f:g+heuristic(x,y),dir:d});
  }
 }
 if(!found)throw Error('無法配置驛路 '+a+' '+b);
 const points=[];let k=id(ex,ey);while(k){const [x,y]=k.split(',').map(Number);points.push([x*unit,y*unit]);used.set(k,(used.get(k)||0)+1);k=parents.get(k);}points.reverse();
 return points.filter((p,i)=>!i||i===points.length-1||(p[0]-points[i-1][0])*(points[i+1][1]-p[1])!==(p[1]-points[i-1][1])*(points[i+1][0]-p[0]));
}
const paths=network.roads.map(([a,b])=>({a,b,key:edgeKey(a,b),color:colors.get(edgeKey(a,b))||lines.at(-1)[1],points:routeEdge(a,b)}));
function drawNetwork(q,from,to){
 const root=$('network');root.replaceChildren();root.setAttribute('viewBox','0 0 1760 1660');
 const selected=new Set((q?.path||[]).slice(1).map((n,i)=>edgeKey(q.path[i],n))),focus=$('focus-route').checked;
 for(const edge of [...paths].sort((a,b)=>Number(selected.has(a.key))-Number(selected.has(b.key)))){
  const active=selected.has(edge.key),d='M'+edge.points.map(p=>p.join(',')).join(' L'),g=svg('g',{'data-road':edge.key,opacity:focus&&!active?'.13':'1'});
  g.append(svg('path',{d,fill:'none',stroke:'#fffdf6','stroke-width':active?13:10,'stroke-linejoin':'round','stroke-linecap':'round'}),svg('path',{d,fill:'none',stroke:edge.color,'stroke-width':active?7:5,'stroke-linejoin':'round','stroke-linecap':'round'}));root.append(g);
 }
 for(const n of names){const p=positions[n],endpoint=n===from||n===to,active=q?.path.includes(n),g=svg('g',{'data-station':n,opacity:focus&&!active?'.3':'1'});
  g.append(svg('circle',{cx:p.x,cy:p.y,r:degree[n]>2?10:7,fill:'#fffdf6',stroke:degree[n]>2?'#263e36':'#627779','stroke-width':degree[n]>2?4:3}));
  if(endpoint)g.append(svg('circle',{cx:p.x,cy:p.y,r:4,fill:n===from?'#bf3348':'#2878aa'}));
  const label=svg('text',{x:p.x+(verticalStops.has(n)?18:0),y:p.y-17,'text-anchor':verticalStops.has(n)?'start':'middle','font-size':19,'font-weight':endpoint?'750':'550',stroke:'#fffdf6','stroke-width':6,'paint-order':'stroke'},n);g.append(label);
  if(endpoint)g.append(svg('text',{x:p.x,y:p.y+29,'text-anchor':'middle','font-size':15,stroke:'#fffdf6','stroke-width':5,'paint-order':'stroke'},from===to?'起訖':n===from?'起點':'終點'));root.append(g);
 }
}
for(const [name,color]of lines){const el=document.createElement('span');el.textContent=name;el.style.setProperty('--line-color',color);$('line-legend').append(el);}
$('focus-route').onchange=()=>drawNetwork(WorldTravel.fare($('from').value,$('to').value),$('from').value,$('to').value);
function zoom(value){$('network').style.width=value+'px';$('zoom-status').textContent=Math.round(value/1760*100)+'%';}
$('zoom-in').onclick=()=>zoom(Math.min(2640,$('network').getBoundingClientRect().width*1.25));
$('zoom-out').onclick=()=>zoom(Math.max(600,$('network').getBoundingClientRect().width/1.25));
$('zoom-fit').onclick=()=>zoom($('map-scroll').clientWidth);
$('zoom-read').onclick=()=>zoom(1760);
zoom(1320);
function render(){const from=$('from').value,to=$('to').value,q=WorldTravel.fare(from,to);$('price').textContent=q?q.coins+' 金幣':'路線尚未設定';$('segments').textContent=q?q.segments+' 段 × 20 金幣':'';$('route').textContent=q?q.path.join(' → '):'尚無可計價連線。';

 drawNetwork(q,from,to);
 const head=document.createElement('thead'),hr=document.createElement('tr');for(const n of ['起點／終點',...names]){const th=document.createElement('th');th.textContent=n;hr.append(th);}head.append(hr);const body=document.createElement('tbody');for(const a of names){const tr=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent=a;tr.append(th);for(const b of names){const td=document.createElement('td');td.textContent=WorldTravel.fare(a,b)?.coins??'—';if(a===from&&b===to)td.className='selected';tr.append(td);}body.append(tr);}$('fares').replaceChildren(head,body);
}
$('from').onchange=$('to').onchange=render;$('swap').onclick=()=>{const a=$('from').value;$('from').value=$('to').value;$('to').value=a;render();};
$('export').onclick=()=>{const data={schema:'three-kingdoms-station-fares-v1',status:network.status+'；尚未接入扣款',stops:network.towns,perSegment:20,roads:network.roads,fares:names.flatMap(from=>names.map(to=>({from,to,...WorldTravel.fare(from,to)})))};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='三國驛站票價紀錄.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};render();
})();
