'use strict';
(()=>{const $=id=>document.getElementById(id),network=WorldTravel.fareNetwork(),names=network.towns.map(t=>t.name),ns='http://www.w3.org/2000/svg';
for(const id of ['from','to'])for(const name of names){const o=document.createElement('option');o.value=name;o.textContent=name;$(id).append(o);}
$('from').value='徐州';$('to').value='廣宗';
function svg(tag,attrs,text){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);if(text)el.textContent=text;return el;}
function render(){const from=$('from').value,to=$('to').value,q=WorldTravel.fare(from,to);$('price').textContent=q?q.coins+' 金幣':'路線尚未設定';$('segments').textContent=q?q.segments+' 段 × 20 金幣':'';$('route').textContent=q?q.path.join(' → '):'尚無可計價連線。';

 const stops=network.towns,pos=Object.fromEntries(stops.map(t=>[t.name,t]));$('network').replaceChildren();
 for(const [a,b]of network.roads){const active=q&&q.path.some((n,i)=>i&&((n===a&&q.path[i-1]===b)||(n===b&&q.path[i-1]===a))),p=pos[a],r=pos[b];$('network').append(svg('line',{x1:p.x,y1:p.y,x2:r.x,y2:r.y,stroke:active?'#c68829':'#277d73','stroke-width':8,'stroke-linecap':'round'}),svg('text',{x:(p.x+r.x)/2+(p.x===r.x?25:0),y:(p.y+r.y)/2-(p.x===r.x?0:16),'text-anchor':p.x===r.x?'start':'middle','font-size':15},'20'));}
 for(const t of stops){const n=t.name;$('network').append(svg('circle',{cx:t.x,cy:t.y,r:11,fill:t.transitOnly?'#e1e3dc':'#fffdf6',stroke:n===from||n===to?'#c68829':'#277d73','stroke-width':4}),svg('text',{x:t.x,y:t.y+36,'text-anchor':'middle','font-size':21},n+(t.transitOnly?' ◇':'')));if(n===from||n===to)$('network').append(svg('text',{x:t.x,y:t.y-22,'text-anchor':'middle','font-size':14},n===from&&n===to?'起點／終點':n===from?'起點':'終點'));}
 const head=document.createElement('thead'),hr=document.createElement('tr');for(const n of ['起點／終點',...names]){const th=document.createElement('th');th.textContent=n;hr.append(th);}head.append(hr);const body=document.createElement('tbody');for(const a of names){const tr=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent=a;tr.append(th);for(const b of names){const td=document.createElement('td');td.textContent=WorldTravel.fare(a,b)?.coins??'—';if(a===from&&b===to)td.className='selected';tr.append(td);}body.append(tr);}$('fares').replaceChildren(head,body);
}
$('from').onchange=$('to').onchange=render;$('swap').onclick=()=>{const a=$('from').value;$('from').value=$('to').value;$('to').value=a;render();};
$('export').onclick=()=>{const data={schema:'three-kingdoms-station-fares-v1',status:network.status+'；尚未接入扣款',stops:network.towns,perSegment:20,roads:network.roads,fares:names.flatMap(from=>names.map(to=>({from,to,...WorldTravel.fare(from,to)})))};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='三國驛站票價紀錄.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};render();
})();
