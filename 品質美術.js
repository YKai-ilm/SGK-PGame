'use strict';
window.QualityArt=(()=>{
const palette={青:{fill:'#67bfc0',ink:'#155b64'},綠:{fill:'#83ba68',ink:'#23551c'},藍:{fill:'#75a7df',ink:'#1b4d91'},橘:{fill:'#e6a05b',ink:'#8b400c'},紅:{fill:'#d8797c',ink:'#8c202d'},紫:{fill:'#b292d5',ink:'#5c2a8c'},金:{fill:'#e4c568',ink:'#82600b'}};
// 視覺測試暫定歸屬，正式品質尚待逐將確認；不套用額外能力倍率。
const preview={馬超:'紅',關平:'綠',姜維:'藍',陳宮:'橘',劉備:'橘',關羽:'紫',張飛:'紅',趙雲:'紫',黃忠:'紅',諸葛亮:'金',徐庶:'橘'};
function quality(type){return window.HERO_COMBAT_DATA?.[type]?.quality||preview[type]||'青';}
function colors(type){return palette[quality(type)];}
function drawCard(c,u,x,y,s,selected,fullCell=false){if(fullCell)s*=1.175;const p=colors(u.type);c.save();const w=s*.8,h=s*.64;c.shadowColor="#10191088";c.shadowBlur=s*.07;c.shadowOffsetX=s*.035;c.shadowOffsetY=s*.07;c.fillStyle="#454638";c.fillRect(x-w/2,y-h/2+s*.055,w,h);c.shadowColor="transparent";for(const [inset,color]of [[0,'#171c18'],[.018,'#fffdf2'],[.045,'#171c18'],[.06,p.fill]]){c.fillStyle=color;c.fillRect(x-w/2+s*inset,y-h/2+s*inset,w-2*s*inset,h-2*s*inset);}if(selected){c.strokeStyle='#fff7b8';c.lineWidth=s*.025;const a=w/2+s*.025,b=h/2+s*.025,d=s*.1;for(const signX of [-1,1])for(const signY of [-1,1]){c.beginPath();c.moveTo(x+signX*(a-d),y+signY*b);c.lineTo(x+signX*a,y+signY*b);c.lineTo(x+signX*a,y+signY*(b-d));c.stroke();}}
const chars=Array.from(u.type),twoLines=chars.length===4;const nw=s*.7,nh=s*(twoLines?.44:.32);c.fillStyle='#ffffff';c.fillRect(x-nw/2,y-nh/2,nw,nh);c.strokeStyle='#000000';c.lineWidth=s*.012;c.strokeRect(x-nw/2,y-nh/2,nw,nh);const fontSize=twoLines?s*.2:fullCell?s*Math.min(.28,.64/chars.length):s*.22;c.font=`${fontSize}px "DFKai-SB", "BiauKai", serif`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#000000';if(twoLines){c.fillText(chars.slice(0,2).join(''),x,y-s*.11,nw-s*.04);c.fillText(chars.slice(2).join(''),x,y+s*.11,nw-s*.04);}else c.fillText(u.type,x,y,nw-s*.04);c.restore();}
// 卡面外觀不隨戰鬥時鐘改變；保留原尺寸與選取外框，避免逐幀重畫陰影及文字。
const cards=new Map();
function clearCache(){cards.clear();window.invalidateBattle?.();}
document.fonts?.ready.then(clearCache);
document.fonts?.addEventListener('loadingdone',clearCache);
function draw(c,u,x,y,s,selected,fullCell=false){
 const key=[u.type,quality(u.type),s,!!selected,fullCell].join('|');
 let sprite=cards.get(key);
 if(!sprite){
  if(cards.size>=128)cards.delete(cards.keys().next().value);
  sprite=document.createElement('canvas');sprite.width=sprite.height=Math.ceil(s*1.8);
  drawCard(sprite.getContext('2d'),u,sprite.width/2,sprite.height/2,s,selected,fullCell);
  cards.set(key,sprite);
 }
 c.drawImage(sprite,x-sprite.width/2,y-sprite.height/2);
}
return{palette,quality,colors,draw};})();
