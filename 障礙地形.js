window.TerrainObstacles=(()=>{
 const at=(x,y,items)=>items.find(p=>p.x===x&&p.y===y);
 function build(n,rows,path,tutorial=false){
  if(!tutorial){const preset=(window.BattleMapPresets||[]).find(m=>m.cols===n&&m.rows===rows&&m.path.length===path.length&&m.path.every((p,i)=>p.x===path[i].x&&p.y===path[i].y));if(preset)return preset.blocks.map(p=>({...p}));}
  const road=new Set(path.map(p=>p.x+','+p.y)),items=[],limit=tutorial?4:Math.max(6,Math.floor(n*rows*.15));
  // 固定種子安排成片地形；關卡重開保持相同布局。
  const anchors=[[2,Math.floor(rows*.55),'forest'],[Math.floor(n*.55),rows-3,'rock'],[n-3,3,'forest'],[1,rows-4,'rock']];
  for(const [ax,ay,kind]of anchors)for(const [dx,dy]of [[0,0],[0,1],[1,0],[1,1],[-1,0],[0,-1]]){const x=ax+dx,y=ay+dy;if(items.length>=limit)break;if(x<0||y<0||x>=n||y>=rows||road.has(x+','+y)||at(x,y,items)||tutorial&&y<=3)continue;items.push({x,y,kind});}
  // 少量教學也同時展示兩種障礙。
  if(tutorial&&items.length>1)items[items.length-1].kind='rock';return items;
 }
 function polygon(c,pts,color){c.fillStyle=color;c.beginPath();pts.forEach(([x,y],i)=>c[i?'lineTo':'moveTo'](x,y));c.closePath();c.fill();}

 // 僅改變外輪廓；共用邊維持相接，裝飾不改變部署判定。
 const edgeRandom=(x,y,k=0)=>{let v=Math.imul(x+1871,374761393)^Math.imul(y+911,668265263)^Math.imul(k+1,1274126177);v=Math.imul(v^(v>>>13),1274126177);return((v^(v>>>16))>>>0)/4294967296;};
 function edges(items){const occupied=new Set(items.map(p=>p.x+','+p.y));return items.flatMap(p=>[[0,-1,0,0,100,0],[1,0,100,0,100,100],[0,1,100,100,0,100],[-1,0,0,100,0,0]].map(([dx,dy,ax,ay,bx,by])=>({p,dx,dy,ax,ay,bx,by,outer:!occupied.has((p.x+dx)+','+(p.y+dy))})));}
 function organicClip(c,items){c.beginPath();const list=edges(items);for(let i=0;i<list.length;i+=4){const p=list[i].p;for(let side=0;side<4;side++){const e=list[i+side];for(let j=0;j<10;j++){const t=j/10,x=p.x*100+e.ax+(e.bx-e.ax)*t,y=p.y*100+e.ay+(e.by-e.ay)*t,shift=e.outer?(edgeRandom(Math.round(x),Math.round(y),5)-.55)*13:0;const xx=x+e.dx*shift,yy=y+e.dy*shift;if(side===0&&j===0)c.moveTo(xx,yy);else c.lineTo(xx,yy);}}c.closePath();}c.clip();}
 function rockField(c,rocks,size,offset){
  if(!rocks.length)return;
  const noise=(x,y,k=0)=>{let v=Math.imul(x+7919,374761393)^Math.imul(y+104729,668265263)^Math.imul(k+1,1274126177);v=Math.imul(v^(v>>>13),1274126177);return((v^(v>>>16))>>>0)/4294967296;};
  c.save();c.translate(offset,offset);c.scale(size/100,size/100);organicClip(c,rocks);
  const left=Math.min(...rocks.map(p=>p.x))*100,top=Math.min(...rocks.map(p=>p.y))*100,right=(Math.max(...rocks.map(p=>p.x))+1)*100,bottom=(Math.max(...rocks.map(p=>p.y))+1)*100;
  c.fillStyle='#77766a';c.fillRect(left-10,top-10,right-left+20,bottom-top+20);
  const point=(x,y)=>({x:x*23+noise(x,y)*17,y:y*23+noise(x,y,1)*17});
  for(let gy=Math.floor(top/23)-2;gy<=Math.ceil(bottom/23)+1;gy++)for(let gx=Math.floor(left/23)-2;gx<=Math.ceil(right/23)+1;gx++){
   const p=point(gx,gy);let poly=[[p.x-50,p.y-50],[p.x+50,p.y-50],[p.x+50,p.y+50],[p.x-50,p.y+50]];
   for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){if(!dx&&!dy)continue;const q=point(gx+dx,gy+dy),nx=q.x-p.x,ny=q.y-p.y,k=(q.x*q.x+q.y*q.y-p.x*p.x-p.y*p.y)/2,out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=a[0]*nx+a[1]*ny-k,db=b[0]*nx+b[1]*ny-k;if(da<=0)out.push(a);if((da<=0)!==(db<=0)){const t=da/(da-db);out.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]);}}poly=out;}
   if(poly.length<3)continue;
   const shade=Math.floor(noise(gx,gy,2)*30),g=c.createLinearGradient(p.x-12,p.y-15,p.x+13,p.y+17);
   g.addColorStop(0,`rgb(${171+shade},${168+shade},${151+shade})`);g.addColorStop(.35,`rgb(${142+shade},${141+shade},${128+shade})`);g.addColorStop(1,`rgb(${91+shade},${95+shade},${87+shade})`);
   polygon(c,poly,g);c.strokeStyle='#565d4866';c.lineWidth=.7;c.stroke();
   c.save();c.clip();for(let j=0;j<24;j++){const x=p.x+(noise(gx*71+j,gy,3)-.5)*50,y=p.y+(noise(gx,gy*73+j,4)-.5)*50;c.fillStyle=j%3?'#62695116':'#fff5d925';c.fillRect(x,y,.4+noise(gx+j,gy,5)*1.2,.6);}
   if(noise(gx,gy,6)>.45){c.strokeStyle='#454b4055';c.lineWidth=.55;c.beginPath();c.moveTo(p.x-9,p.y-5);c.lineTo(p.x-2,p.y-1);c.lineTo(p.x+1,p.y+6);c.lineTo(p.x+7,p.y+9);c.stroke();}c.restore();
  }
  // 大片風化石面上散落大小不一的碎屑，打破規則鋪磚感。
  for(let j=0;j<(right-left)*(bottom-top)/210;j++){
   const x=left+noise(j,31,8)*(right-left),y=top+noise(j,93,9)*(bottom-top),r=1.1+noise(j,17,10)**3*6.5,pts=[];
   for(let k=0;k<7;k++){const angle=k*Math.PI*2/7,rad=r*(.65+noise(j,k,11)*.55);pts.push([x+Math.cos(angle)*rad,y+Math.sin(angle)*rad*.7]);}
   c.save();c.shadowColor='#22271e66';c.shadowBlur=1.3;c.shadowOffsetX=.7;c.shadowOffsetY=1;
   const v=Math.floor(noise(j,5,12)*52),g=c.createLinearGradient(x-r,y-r,x+r,y+r);g.addColorStop(0,`rgb(${164+v},${158+v},${139+v})`);g.addColorStop(1,`rgb(${82+v},${85+v},${74+v})`);polygon(c,pts,g);c.restore();
  }
  c.restore();
 }
 // 整片森林在共同座標生成樹冠，格子之間不留底框或接縫。
 function forestField(c,trees,size,offset){
  if(!trees.length)return;
  const rand=(x,y)=>{let v=Math.imul(x+519,374761393)^Math.imul(y+173,668265263);v=Math.imul(v^(v>>>13),1274126177);return((v^(v>>>16))>>>0)/4294967296;};
  c.save();c.translate(offset,offset);c.scale(size/100,size/100);organicClip(c,trees);
  const l=Math.min(...trees.map(p=>p.x))*100,t=Math.min(...trees.map(p=>p.y))*100,r=(Math.max(...trees.map(p=>p.x))+1)*100,b=(Math.max(...trees.map(p=>p.y))+1)*100;
  c.fillStyle='#425b38';c.fillRect(l-10,t-10,r-l+20,b-t+20);
  for(let gy=Math.floor(t/38)-1;gy<=Math.ceil(b/38);gy++)for(let gx=Math.floor(l/38)-1;gx<=Math.ceil(r/38);gx++){
   const x=gx*38+rand(gx,gy)*24,y=gy*38+rand(gx+79,gy)*24,rad=23+rand(gx,gy+53)*12,hue=rand(gx+91,gy+51);
   // 樹冠陰影與不規則分枝葉團，光源由左上方照入。
   c.fillStyle='#344b3280';c.beginPath();c.ellipse(x+5,y+8,rad*1.1,rad*.9,0,0,Math.PI*2);c.fill();
   for(let k=0;k<13;k++){
    const a=k*2.399,dist=Math.sqrt(k/13)*rad*.65,cx=x+Math.cos(a)*dist,cy=y+Math.sin(a)*dist*.8,rr=rad*(.3+rand(gx*17+k,gy)*.2);
    const g=c.createRadialGradient(cx-rr*.35,cy-rr*.4,0,cx,cy,rr);g.addColorStop(0,hue>.5?'#91a363':'#819c5b');g.addColorStop(.5,hue>.5?'#617e46':'#547440');g.addColorStop(1,'#3b5735');c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,rr,rr*.85,a,0,Math.PI*2);c.fill();
   }
   for(let k=0;k<110;k++){
    const a=rand(gx*229+k,gy+10)*Math.PI*2,d=Math.sqrt(rand(gx+19,gy*229+k))*rad*.94,px=x+Math.cos(a)*d,py=y+Math.sin(a)*d*.83;
    const lit=(x-px+y-py)/rad+rand(gx+k,gy+99);c.fillStyle=lit>.9?'#b0be7970':lit>.1?'#8ba36370':'#3e5b3280';c.beginPath();c.ellipse(px,py,.6+rand(gx+k,gy+7)*1.7,.4+rand(gx+8,gy+k)*.7,a,0,Math.PI*2);c.fill();
   }
  }
  c.restore();
 }
 // 外緣只以地表混色收邊，不再排列縮小的樹叢或碎石。
 function blendedField(c,items,size,offset,render){
  if(!items.length)return;
  const layer=document.createElement('canvas');layer.width=c.canvas.width;layer.height=c.canvas.height;const lc=layer.getContext('2d');render(lc,items,size,offset);
  const occupied=new Set(items.map(p=>p.x+','+p.y)),outline=edges(items).filter(e=>e.outer),image=lc.getImageData(0,0,layer.width,layer.height),data=image.data;
  const minX=Math.max(0,Math.floor(offset+(Math.min(...items.map(p=>p.x))-.1)*size)),maxX=Math.min(layer.width,Math.ceil(offset+(Math.max(...items.map(p=>p.x))+1.1)*size)),minY=Math.max(0,Math.floor(offset+(Math.min(...items.map(p=>p.y))-.1)*size)),maxY=Math.min(layer.height,Math.ceil(offset+(Math.max(...items.map(p=>p.y))+1.1)*size));
  for(let y=minY;y<maxY;y++)for(let x=minX;x<maxX;x++){
   const i=(y*layer.width+x)*4;if(!data[i+3])continue;const wx=(x-offset)/size*100,wy=(y-offset)/size*100;let distance=1e6;
   for(const e of outline){const ax=e.p.x*100+e.ax,ay=e.p.y*100+e.ay,bx=e.p.x*100+e.bx,by=e.p.y*100+e.by,t=Math.max(0,Math.min(1,((wx-ax)*(bx-ax)+(wy-ay)*(by-ay))/10000));distance=Math.min(distance,Math.hypot(wx-ax-t*(bx-ax),wy-ay-t*(by-ay)));}
   const inside=occupied.has(Math.floor(wx/100)+','+Math.floor(wy/100));const d=inside?distance:-distance;
   const fade=Math.max(0,Math.min(1,(d+2)/7));data[i+3]*=fade*fade*(3-2*fade);
   const earth=(1-fade)*.22;for(let k=0;k<3;k++)data[i+k]=data[i+k]*(1-earth)+[111,112,73][k]*earth;
  }
  lc.putImageData(image,0,0);c.drawImage(layer,0,0);
 }
 function draw(c,items,size,offset){blendedField(c,items.filter(p=>p.kind==='rock'),size,offset,rockField);blendedField(c,items.filter(p=>p.kind==='forest'),size,offset,forestField);}
 return{at,build,draw};
})();
