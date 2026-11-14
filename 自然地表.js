'use strict';
// 固定種子連續地表；只在地圖尺寸改變時產生一次，戰鬥中使用快取。
window.NaturalGround=function(c,n,path,padding,roadSegments=null){
 const height=c.canvas.height,size=720,s=size/(n+2*padding),offset=padding*s;
 const hash=(x,y)=>{let v=Math.imul(x,374761393)^Math.imul(y,668265263);v=Math.imul(v^(v>>>13),1274126177);return((v^(v>>>16))>>>0)/4294967295;};
 function noise(x,y,scale){x/=scale;y/=scale;const ix=Math.floor(x),iy=Math.floor(y);let u=x-ix,v=y-iy;u=u*u*(3-2*u);v=v*v*(3-2*v);return (hash(ix,iy)*(1-u)+hash(ix+1,iy)*u)*(1-v)+(hash(ix,iy+1)*(1-u)+hash(ix+1,iy+1)*u)*v;}
 const points=path.map(p=>({x:offset+(p.x+.5)*s,y:offset+(p.y+.5)*s}));
 const segments=[];for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];const last=segments.at(-1);if(last&&(last.a.x===a.x&&a.x===b.x||last.a.y===a.y&&a.y===b.y))last.b=b;else segments.push({a,b});}
 function distance(x,y){let best=1e9;for(const {a,b}of segments){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));best=Math.min(best,Math.hypot(x-a.x-t*dx,y-a.y-t*dy));}return best;}
 if(roadSegments){segments.length=0;for(const seg of roadSegments)segments.push({a:{x:offset+(seg.a.x+.5)*s,y:offset+(seg.a.y+.5)*s},b:{x:offset+(seg.b.x+.5)*s,y:offset+(seg.b.y+.5)*s}});}
 const img=c.createImageData(size,height);for(let y=0;y<height;y++)for(let x=0;x<size;x++){const broad=noise(x,y,120),patch=noise(x+91,y+24,35),grain=hash(x,y)-.5,d=distance(x,y),edge=s*(.5+(noise(x,y,10)-.5)*.055),blend=Math.max(0,Math.min(1,(edge-d)/(s*.025)+.5));const turf=noise(x+313,y-97,13),earth=Math.max(0,(noise(x-173,y+211,49)-.56)*2.8);let green=[116+broad*8+patch*4+earth*5,137+broad*9+patch*4+earth*3,78+broad*6+patch*3+earth*4];const mud=[158+patch*24,140+patch*23,104+patch*20];const rut=Math.exp(-Math.pow((d-s*.16)/(s*.035),2))*10;const i=(y*size+x)*4;for(let k=0;k<3;k++)img.data[i+k]=green[k]*(1-blend)+(mud[k]-rut)*blend+grain*(blend>0.5?11:2);img.data[i+3]=255;}c.putImageData(img,0,0);
 // 使用獨立亂數流產生位置，避免同索引雜湊的座標相關性形成斜紋。
 let grassSeed=0x519b34af;
 const grassRandom=()=>{let t=grassSeed+=0x6D2B79F5;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};
 const density=Math.round(size*height/90);
 for(let j=0;j<density;j++){
  const x=grassRandom()*size,y=grassRandom()*height;if(distance(x,y)<s*.52)continue;
  const cover=noise(x+313,y-97,26);if(grassRandom()>.65+cover*.2)continue;
  const h=1.8+grassRandom()*1.6,angle=grassRandom()*Math.PI*2;
  c.fillStyle='#52633a16';c.beginPath();c.ellipse(x+.3,y+.6,h*.65,h*.3,angle,0,Math.PI*2);c.fill();
  for(let k=0;k<3;k++){
   const a=angle+k*2.1+(grassRandom()-.5),len=h*(.6+grassRandom()*.5),dx=Math.cos(a)*len,dy=Math.sin(a)*len*.75,w=.35+grassRandom()*.4;
   c.fillStyle=['#5f7b4490','#7c945480','#a4b56c90'][k];c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+dx*.45-dy/len*w,y+dy*.45+dx/len*w,x+dx,y+dy);c.quadraticCurveTo(x+dx*.5+dy/len*w*.35,y+dy*.5-dx/len*w*.35,x,y);c.fill();
  }
 }
 // 壓實土面保留細砂、碎石及短車轍，不以模糊色帶代替細節。
 for(let j=0;j<Math.round(size*height/70);j++){
  const x=hash(j,1101)*size,y=hash(j,1207)*height,d=distance(x,y);if(d>s*.485)continue;
  const r=.35+hash(j,1251)*1.1;c.fillStyle=j%3?'#74634455':'#e8d0a480';c.beginPath();c.ellipse(x,y,r*1.4,r*.6,hash(j,4)*3,0,Math.PI*2);c.fill();
 }
 for(const {a,b}of segments){const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;for(const side of [-1,1])for(let t=5;t<len-4;t+=7){const k=Math.floor(a.x+a.y+t),jitter=(hash(k,99)-.5)*s*.012,x=a.x+dx*t/len+nx*(s*.16*side+jitter),y=a.y+dy*t/len+ny*(s*.16*side+jitter);c.strokeStyle='#806a4740';c.lineWidth=.8;c.beginPath();c.moveTo(x,y);c.lineTo(x+dx/len*4,y+dy/len*4);c.stroke();}}
 // 路緣碎石與枯草，不增加阻擋或改變可部署格。
 for(let j=0;j<450;j++){const x=hash(j,171)*size,y=hash(j,271)*height,d=distance(x,y);if(d<s*.41||d>s*.56)continue;const r=.7+hash(j,311)*1.7;c.fillStyle='#2b302a48';c.beginPath();c.ellipse(x+1,y+1,r*1.5,r*.7,0,0,Math.PI*2);c.fill();c.fillStyle=j%2?'#a9a28a':'#797d68';c.beginPath();c.ellipse(x,y,r,r*.6,0,0,Math.PI*2);c.fill();}
};
