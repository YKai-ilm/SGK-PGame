'use strict';
// 純視覺動畫：使用戰鬥時鐘，暫停與倍速跟隨戰鬥，不改動命中或攻速。
window.AttackArt=(()=>{
function line(c,points,color,width){c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
const signatures={劉備:'雙股劍',關羽:'青龍偃月刀',張飛:'丈八蛇矛',趙雲:'銀槍'};
function finishMetal(c,top=-.22,bottom=.18){const g=c.createLinearGradient(0,top,0,bottom);g.addColorStop(0,'#e2dfc9');g.addColorStop(.18,'#a4b0a4');g.addColorStop(.46,'#bec8ba');g.addColorStop(.49,'#f4eed8');g.addColorStop(.52,'#4b5b50');g.addColorStop(.84,'#263c31');g.addColorStop(.94,'#718579');g.addColorStop(1,'#d4d9c5');c.fillStyle=g;c.strokeStyle='#3c4939';c.lineWidth=.012;c.fill();c.stroke();c.save();c.clip();for(let i=0;i<10;i++)line(c,[[.32+i*.12,-.3],[.39+i*.12,.25]],i%2?'#e8e3cb25':'#283b2a18',.006);c.restore();}
function metal(c,points){c.beginPath();points.forEach(([x,y],i)=>c[i?'lineTo':'moveTo'](x,y));c.closePath();const ys=points.map(p=>p[1]);finishMetal(c,Math.min(...ys),Math.max(...ys));}
function shaft(c,end,color='#6a4d30'){const g=c.createLinearGradient(0,-.04,0,.04);g.addColorStop(0,'#b8ad82');g.addColorStop(.25,color);g.addColorStop(.72,color);g.addColorStop(1,'#302c20');line(c,[[-.45,.022],[end,.022]],'#26302155',.085);line(c,[[-.45,0],[end,0]],g,.06);line(c,[[-.38,-.017],[end,-.017]],'#ddd1a34d',.009);for(let x=-.3;x<.17;x+=.045)line(c,[[x,-.025],[x+.015,.025]],'#332d2499',.012);}
function trail(c,r,from,to,color='#c7cbb733'){c.save();c.globalAlpha*=.35;c.strokeStyle=color;c.lineWidth=.035;c.beginPath();c.arc(0,0,r,from,to);c.stroke();c.restore();}
function signature(c,u,p){
 if(!signatures[u.type]||!['hit','pierce'].includes(u.weapon.kind))return false;
 const thrust=Math.sin(p*Math.PI);
 if(u.type==='關羽'){
  c.translate(.1,.16);c.rotate(-1.05+p*1.95);trail(c,1.5,-.45,0,'#d8edcb66');
  // 參考長柄古兵器：細黑桿、銅吞口，狹長刀身沿桿延伸，尖端上翹。
  const pole=c.createLinearGradient(0,-.025,0,.025);pole.addColorStop(0,'#b7b19a');pole.addColorStop(.23,'#646756');pole.addColorStop(.55,'#272e29');pole.addColorStop(1,'#101c19');
  line(c,[[-.62,0],[.88,0]],pole,.045);line(c,[[-.59,-.014],[.85,-.014]],'#c8bfa466',.007);
  for(const x of [-.58,.69,.79])line(c,[[x,-.025],[x,.025]],'#b69b5b',.024);
  metal(c,[[-.62,-.035],[-.72,0],[-.62,.035],[-.54,.022],[-.54,-.022]]);
  c.beginPath();c.moveTo(.83,-.035);c.bezierCurveTo(1.04,-.08,1.24,-.1,1.4,-.2);c.quadraticCurveTo(1.58,-.28,1.66,-.46);c.bezierCurveTo(1.7,-.15,1.51,.04,1.28,.095);c.quadraticCurveTo(1.05,.14,.84,.045);c.closePath();
  const steel=c.createLinearGradient(.9,-.24,1.15,.14);steel.addColorStop(0,'#7d8379');steel.addColorStop(.3,'#343e38');steel.addColorStop(.65,'#475149');steel.addColorStop(.84,'#8c9587');steel.addColorStop(1,'#d9dcc9');c.fillStyle=steel;c.strokeStyle='#25312a';c.lineWidth=.012;c.fill();c.stroke();
  c.save();c.clip();const shine=c.createRadialGradient(1.35,-.045,.005,1.35,-.045,.29);shine.addColorStop(0,'#eee9d29c');shine.addColorStop(.28,'#c6d3ba40');shine.addColorStop(1,'#d2dbc000');c.fillStyle=shine;c.fillRect(.82,-.5,.9,.7);for(let i=0;i<23;i++){const x=.86+i*.035;line(c,[[x,-.3],[x+.025,.15]],i%3?'#c8caba17':'#141f1930',.005);}c.restore();
  c.strokeStyle='#d1d4c1';c.lineWidth=.015;c.beginPath();c.moveTo(1.655,-.425);c.bezierCurveTo(1.67,-.14,1.49,.025,1.27,.08);c.quadraticCurveTo(1.04,.12,.88,.045);c.stroke();
  // 下緣厚度暗面與刃口亮面分開，斜光照出鋼刃體積。
  c.strokeStyle='#1b2b24';c.lineWidth=.024;c.beginPath();c.moveTo(.88,.064);c.quadraticCurveTo(1.08,.147,1.3,.105);c.bezierCurveTo(1.53,.055,1.69,-.14,1.675,-.4);c.stroke();
  c.strokeStyle='#e2e4cf';c.lineWidth=.008;c.beginPath();c.moveTo(.9,.043);c.quadraticCurveTo(1.08,.12,1.28,.08);c.bezierCurveTo(1.52,.023,1.66,-.16,1.655,-.41);c.stroke();
  // 刀背鉤與細紅纓，保留參考圖的辨識輪廓。
  metal(c,[[1.16,-.09],[1.19,-.19],[1.23,-.2],[1.25,-.16],[1.22,-.105]]);
  c.strokeStyle='#8e302b';c.lineWidth=.018;c.beginPath();c.moveTo(1.2,-.17);c.bezierCurveTo(1.12,-.22,1.05,-.12,.94,-.12);c.stroke();
  const brass=c.createLinearGradient(0,-.075,0,.075);brass.addColorStop(0,'#d0bb78');brass.addColorStop(.4,'#aa8d4f');brass.addColorStop(.65,'#d9c58b');brass.addColorStop(1,'#685532');c.fillStyle=brass;c.strokeStyle='#655332';c.lineWidth=.009;
  c.beginPath();c.moveTo(.76,-.04);c.lineTo(.84,-.075);c.lineTo(.9,-.055);c.lineTo(.88,.06);c.lineTo(.82,.075);c.lineTo(.76,.035);c.closePath();c.fill();c.stroke();
  for(let i=0;i<3;i++){c.beginPath();c.arc(.795+i*.027,0,.017,-2,1.8);c.stroke();}
 }else if(u.type==='劉備'){
  // 兩把長短有別的直刃劍交錯揮斬。
  for(let i=0;i<2;i++){c.save();c.translate(.05,i?-.18:.18);c.rotate((i?-1:1)*(-.75+p*1.55));const end=i?1.02:1.2;trail(c,end,-.25,0,'#eff5df55');line(c,[[.02,0],[.28,0]],'#62452d',.065);line(c,[[.26,-.11],[.26,.11]],'#c7aa58',.04);metal(c,[[.3,-.055],[.4,-.048],[end-.2,-.029],[end,0],[end-.2,.029],[.4,.048],[.3,.055]]);line(c,[[.34,0],[end-.03,0]],'#d0d5c6',.009);for(let k=0;k<4;k++)line(c,[[.055+k*.045,-.025],[.07+k*.045,.025]],'#bbaa7755',.012);c.fillStyle='#ae985d';c.beginPath();c.arc(.015,0,.046,0,Math.PI*2);c.fill();c.restore();}
 }else if(u.type==='張飛'){
  c.translate(.12+thrust*.44,.18);c.rotate(-.08+thrust*.12);shaft(c,.73,'#514439');
  // 厚實黑杆，矛刃呈連續蛇形起伏。
  c.fillStyle='#bac8c6';c.strokeStyle='#253b3b';c.lineWidth=.025;c.beginPath();c.moveTo(.69,-.035);c.bezierCurveTo(.83,-.16,.91,.08,1.04,-.045);c.bezierCurveTo(1.16,-.16,1.25,.045,1.39,-.025);c.lineTo(1.57,-.07);c.bezierCurveTo(1.39,.12,1.24,-.025,1.1,.065);c.bezierCurveTo(.95,.19,.86,-.035,.73,.055);c.closePath();finishMetal(c,-.15,.17);line(c,[[.66,-.08],[.66,.1]],'#a78e5e',.06);line(c,[[.7,.06],[.52,.19],[.42,.12]],'#803b32',.055);
 }else{
  c.translate(.12+thrust*.58,.15);shaft(c,.82,'#99aca7');metal(c,[[.78,-.025],[.94,-.065],[1.12,-.045],[1.5,0],[1.12,.045],[.94,.065],[.78,.025]]);line(c,[[.87,0],[1.38,0]],'#79999e',.015);line(c,[[.78,-.065],[.78,.065]],'#d8bd73',.055);
  for(let i=0;i<3;i++)line(c,[[.81,.025],[.65-thrust*.08,.12+i*.04],[.48,.06+i*.055]],i===1?'#d8f0ee':'#6c9eaa',.022);line(c,[[.9,-.15],[1.5,-.15]],'#e1f7f44d',.022);
 }
 return true;
}
function drawWeapon(c,u,time,s){const a=u.weapon;if(!a)return;const p=(time-a.start)/a.duration;if(p<0||p>1)return;c.save();c.translate((u.x+.5)*s,(u.y+.5)*s);if(!u.enemy){const dx=Math.cos(a.angle),dy=Math.sin(a.angle);if(Math.abs(dx)>=Math.abs(dy))c.translate(Math.sign(dx)*.53*s,0);else c.translate(0,Math.sign(dy)*.436*s);}c.rotate(a.angle);const scale=s*(window.BoardObjectScale||.65)*.85*.7*2;c.scale(scale,scale);c.lineCap='round';const pulse=Math.sin(p*Math.PI);c.globalAlpha=Math.min(1,(1-p)*5);
if(signature(c,u,p)){c.restore();return;}
if(a.kind==='arrow'){
 const bend=.12+.2*Math.sin(Math.min(p/.4,1)*Math.PI);c.strokeStyle='#513923';c.lineWidth=.065;c.beginPath();c.moveTo(.28,-.38);c.quadraticCurveTo(.68,-.05,.28,.38);c.stroke();const wood=c.createLinearGradient(.28,0,.5,0);wood.addColorStop(0,'#4b3120');wood.addColorStop(.45,'#a5834d');wood.addColorStop(.7,'#dac38c');wood.addColorStop(1,'#6b482b');c.strokeStyle=wood;c.lineWidth=.04;c.stroke();
 c.strokeStyle='#ead5a06b';c.lineWidth=.008;c.beginPath();c.moveTo(.29,-.35);c.quadraticCurveTo(.65,-.05,.29,.35);c.stroke();
 for(let k=-2;k<=2;k++)line(c,[[.46,k*.022],[.51,k*.022]],k%2?'#402f23':'#8c714c',.018);line(c,[[.28,-.38],[.28-bend,0],[.28,.38]],'#fff2ca',.018);
 if(p<.42){line(c,[[.05,0],[.72,0]],'#f9e7b5',.025);line(c,[[.59,-.07],[.72,0],[.59,.07]],'#f9e7b5',.025);}
}else if(a.kind==='pierce'){
 const reach=.1+pulse*.45;c.save();c.translate(reach,.06);shaft(c,.68);c.restore();metal(c,[[reach+.62,.04],[reach+.72,.005],[reach+.96,.06],[reach+.72,.115],[reach+.62,.08]]);line(c,[[reach+.65,.06],[reach+.94,.06]],'#d9dfcd',.008);line(c,[[reach+.62,.035],[reach+.62,.085]],'#a48a55',.024);c.strokeStyle='#943e32';c.lineWidth=.025;c.beginPath();c.moveTo(reach+.62,.09);c.quadraticCurveTo(reach+.55,.19,reach+.46,.17);c.stroke();line(c,[[.3,-.04],[reach+.85,-.04]],'#fff4c044',.025);
}else if(a.kind==='magic'||a.kind==='fire'){
 c.rotate(-.65+p*1.3);line(c,[[.18,.14],[.48,0]],'#83603b',.055);for(let i=0;i<7;i++){const angle=-.85+i*.25;c.save();c.translate(.42,0);c.rotate(angle);const feather=c.createLinearGradient(0,-.06,0,.06);feather.addColorStop(0,'#e1dcc2');feather.addColorStop(.5,'#c1c6ad');feather.addColorStop(1,'#748c79');c.fillStyle=feather;c.beginPath();c.ellipse(.19,0,.24,.055,0,0,Math.PI*2);c.fill();c.strokeStyle='#596c535c';c.lineWidth=.008;c.stroke();
 for(let j=1;j<7;j++){const x=j*.055,w=.045*Math.sin(j/7*Math.PI);line(c,[[x-.025,-w],[x,0],[x-.025,w]],'#f2ead14d',.006);}
 line(c,[[0,.008],[.4,.008]],'#52674c',.01);line(c,[[0,0],[.4,0]],'#e3dcc1',.007);c.restore();}
}else if(a.kind==='stone'){
 line(c,[[.15,.22],[.45,-.22-pulse*.2]],'#f4db9a',.05);c.strokeStyle='#faf0bc99';c.lineWidth=.035;c.beginPath();c.arc(.05,.15,.55,-1.2-pulse,.1);c.stroke();
}else{
 c.rotate(-1.1+p*2.1);c.strokeStyle='#d6d3b730';c.lineWidth=.05;c.beginPath();c.arc(0,0,.68,-.9,0);c.stroke();line(c,[[.1,0],[.35,0]],'#6b4127',.075);line(c,[[.32,-.1],[.32,.1]],'#665337',.047);line(c,[[.31,-.095],[.31,.095]],'#c7b37a',.018);for(let j=0;j<4;j++)line(c,[[.13+j*.044,-.027],[.145+j*.044,.027]],'#bd9a6366',.012);c.fillStyle='#eef1db';c.strokeStyle='#657f78';c.lineWidth=.018;c.beginPath();c.moveTo(.35,-.04);c.quadraticCurveTo(.68,-.16,.93,-.11);c.quadraticCurveTo(.81,.13,.35,.08);c.closePath();finishMetal(c,-.14,.1);
}c.restore();}
// 先將整把武器合成，再投下單一柔影，避免每條紋理各自產生黑邊。
const weaponLayer=document.createElement('canvas');
function weapon(c,u,time,s){
 if(!u.weapon)return;
 const size=Math.ceil(s*10),ratio=2;
 if(weaponLayer.width!==size*ratio){weaponLayer.width=size*ratio;weaponLayer.height=size*ratio;}
 const ink=weaponLayer.getContext('2d');ink.setTransform(ratio,0,0,ratio,0,0);ink.clearRect(0,0,size,size);
 drawWeapon(ink,{...u,x:4,y:4},time,s);
 c.save();c.shadowColor='rgba(13,22,15,.62)';c.shadowBlur=Math.max(2,s*.035);c.shadowOffsetX=s*.0315;c.shadowOffsetY=s*.0595;
 c.drawImage(weaponLayer,(u.x-4)*s,(u.y-4)*s,size,size);c.restore();
}
// 三刀的刀氣是向前行進的薄弧刃；只處理視覺，不參與傷害判定。
function bladeWave(c,f,time,s){
 const start=f.start??f.end-.35,duration=f.end-start,p=Math.max(0,Math.min(1,(time-start)/duration));if(time>=f.end)return;
 const dx=f.tx-f.x,dy=f.ty-f.y,range=Math.hypot(dx,dy),angle=Math.atan2(dy,dx),travel=.48+(range-.48)*p,half=.40*s;
 c.save();c.translate((f.x+.5)*s+Math.cos(angle)*travel*s,(f.y+.5)*s+Math.sin(angle)*travel*s);c.rotate(angle);
 c.globalAlpha=Math.min(1,p*10+.35,(1-p)*7);const power=1+(f.step||0)*.12;
 // 越靠前的刀刃越亮，後側只有短而淡的弧形殘影，不畫圓球或光柱。
 for(let i=3;i>=0;i--){c.save();c.translate(-i*s*.09,0);c.globalAlpha*=i?(.15-i*.025):1;c.beginPath();c.moveTo(-s*.14,-half);c.bezierCurveTo(s*.35*power,-half*.45,s*.35*power,half*.45,-s*.14,half);c.bezierCurveTo(s*.18,half*.45,s*.18,-half*.45,-s*.14,-half);c.closePath();const g=c.createLinearGradient(-s*.15,0,s*.3,0);g.addColorStop(0,'#739c7955');g.addColorStop(.65,'#b8d9aacc');g.addColorStop(1,'#fff6d9');c.fillStyle=g;c.fill();if(!i){c.strokeStyle='#f4f6dc';c.lineWidth=s*.016;c.beginPath();c.moveTo(-s*.14,-half);c.bezierCurveTo(s*.35*power,-half*.45,s*.35*power,half*.45,-s*.14,half);c.stroke();}c.restore();}
 c.restore();
}
function flame(c,x,y,r,phase){c.save();c.translate(x,y);for(let i=0;i<5;i++){const dx=(i-2)*r*.3,h=r*(.9+.3*Math.sin(phase*18+i*2));c.fillStyle=i%2?'#ffad36':'#eb582b';c.beginPath();c.moveTo(dx-r*.23,0);c.quadraticCurveTo(dx-r*.4,-h*.45,dx+r*.1,-h);c.quadraticCurveTo(dx+r*.05,-h*.4,dx+r*.27,0);c.closePath();c.fill();c.fillStyle='#ffe58a';c.beginPath();c.ellipse(dx,-h*.22,r*.1,h*.25,0,0,Math.PI*2);c.fill();}c.restore();}
function cavalry(c,p,s,time){
 c.save();c.translate((p.x+.5)*s,(p.y+.5)*s);const dx=p.tx-p.x;c.scale(dx<0?-1:1,1);c.scale(s*.8,s*.8);const gait=Math.sin(time*24)*.08;
 c.fillStyle='#1e291e55';c.beginPath();c.ellipse(0,.27,.43,.12,0,0,Math.PI*2);c.fill();
 c.strokeStyle='#3a2d21';c.lineWidth=.065;c.lineCap='round';for(const [x,phase] of [[-.23,1],[-.13,-1],[.17,-1],[.27,1]]){c.beginPath();c.moveTo(x,.05);c.lineTo(x+gait*phase,.2);c.lineTo(x+.09*phase,.31);c.stroke();}
 const coat=c.createLinearGradient(0,-.25,0,.18);coat.addColorStop(0,'#e0c6a0');coat.addColorStop(.5,'#ad8054');coat.addColorStop(1,'#624831');c.fillStyle=coat;c.strokeStyle='#4d402e';c.lineWidth=.02;c.beginPath();c.ellipse(0,0,.34,.17,0,0,Math.PI*2);c.fill();c.stroke();
 c.beginPath();c.moveTo(.17,-.05);c.lineTo(.24,-.37);c.lineTo(.35,-.44);c.lineTo(.48,-.3);c.lineTo(.46,-.22);c.lineTo(.3,-.22);c.lineTo(.3,.06);c.closePath();c.fill();c.stroke();line(c,[[.23,-.36],[.18,-.2],[.16,-.08]],'#493d2b',.06);line(c,[[-.29,-.06],[-.43,-.12],[-.49,.03]],'#53412b',.05);c.fillStyle='#171d18';c.beginPath();c.arc(.38,-.32,.018,0,7);c.fill();
 // Saddle, armored rider, helmet, legs and long spear remain distinct at board scale.
 c.fillStyle='#733f35';c.fillRect(-.17,-.16,.31,.1);line(c,[[-.06,-.22],[.04,-.01],[.03,.17]],'#35483e',.065);
 const armor=c.createLinearGradient(-.12,-.48,.1,-.2);armor.addColorStop(0,'#d7d9bd');armor.addColorStop(.5,'#738c7e');armor.addColorStop(1,'#304c41');c.fillStyle=armor;c.beginPath();c.moveTo(-.14,-.47);c.lineTo(.06,-.48);c.lineTo(.13,-.21);c.lineTo(-.16,-.21);c.closePath();c.fill();c.stroke();
 c.fillStyle='#dabf8d';c.beginPath();c.arc(-.03,-.56,.075,0,7);c.fill();c.fillStyle='#647c72';c.beginPath();c.arc(-.03,-.59,.09,Math.PI,Math.PI*2);c.fill();line(c,[[-.04,-.66],[-.13,-.76]],'#9e4939',.045);line(c,[[0,-.4],[.19,-.35]],'#b6bba0',.06);line(c,[[-.23,-.33],[.65,-.41]],'#67543a',.025);metal(c,[[.65,-.44],[.84,-.43],[.66,-.37]]);c.restore();
}
function projectile(c,p,s,time){if(p.kind==='cavalry'){cavalry(c,p,s,time);return;}let x=(p.x+.5)*s,y=(p.y+.5)*s;const tx=p.kind==='stone'||p.kind==='fire'?p.tx:p.target.x,ty=p.kind==='stone'||p.kind==='fire'?p.ty:p.target.y,angle=Math.atan2(ty-p.y,tx-p.x);c.save();
if(p.kind==='stone'){const progress=Math.min(1,Math.hypot(p.x-p.sx,p.y-p.sy)/(p.distance||1));c.fillStyle='#28312544';c.beginPath();c.ellipse(x,y,s*.13,s*.06,0,0,Math.PI*2);c.fill();y-=Math.sin(progress*Math.PI)*s*.8;c.translate(x,y);c.rotate(progress*6);c.fillStyle='#777b68';c.strokeStyle='#e0d8b4';c.lineWidth=2;c.beginPath();c.moveTo(-s*.12,-s*.07);c.lineTo(0,-s*.15);c.lineTo(s*.13,-s*.05);c.lineTo(s*.1,s*.12);c.lineTo(-s*.1,s*.1);c.closePath();c.fill();c.stroke();
}else if(p.kind==='fire'){const progress=Math.min(1,Math.hypot(p.x-p.sx,p.y-p.sy)/(p.distance||1));x=(p.tx+.5)*s+(1-progress)*s*.8;y=(p.ty+.5)*s-(1-progress)*s*3;c.fillStyle='#302b2444';c.beginPath();c.ellipse((p.tx+.5)*s,(p.ty+.5)*s,s*.22,s*.09,0,0,Math.PI*2);c.fill();flame(c,x,y,s*.6,time);const g=c.createRadialGradient(x-s*.06,y-s*.08,0,x,y,s*.22);g.addColorStop(0,'#c2a27a');g.addColorStop(.5,'#79503a');g.addColorStop(1,'#322d29');c.fillStyle=g;c.strokeStyle='#f4a34b';c.lineWidth=2;c.beginPath();c.moveTo(x-s*.19,y-s*.08);c.lineTo(x-s*.08,y-s*.22);c.lineTo(x+s*.15,y-s*.15);c.lineTo(x+s*.22,y+s*.04);c.lineTo(x+s*.06,y+s*.2);c.lineTo(x-s*.17,y+s*.13);c.closePath();c.fill();c.stroke();}
else{c.translate(x,y);c.rotate(angle);if(p.kind==='arrow'){line(c,[[-s*.32,0],[s*.13,0]],'#fff0be',Math.max(2,s*.027));line(c,[[s*.02,-s*.07],[s*.15,0],[s*.02,s*.07]],'#fff7dc',2);line(c,[[-s*.23,0],[-s*.32,-s*.06]],'#b36a43',2);}else{c.shadowColor='#a5e6ff';c.shadowBlur=12;const g=c.createLinearGradient(-s*.45,0,s*.12,0);g.addColorStop(0,'#a9c4ff00');g.addColorStop(1,'#d8fbff');c.fillStyle=g;c.beginPath();c.ellipse(-s*.12,0,s*.3,s*.1,0,0,Math.PI*2);c.fill();c.strokeStyle='#eefcff';c.lineWidth=2;c.beginPath();c.arc(0,0,s*.13,-1.4,1.4);c.stroke();}}c.restore();}
function fire(c,f,time,s){c.save();c.globalAlpha=Math.min(1,(f.end-time)*2);const age=time-f.start;for(let i=0;i<9;i++){const a=i*2.4,r=f.radius*s*Math.sqrt(i/10);flame(c,(f.x+.5)*s+Math.cos(a)*r,(f.y+.5)*s+Math.sin(a)*r,s*.35,age+i);}c.restore();}
return{weapon,projectile,fire,bladeWave,signatures,burning:(c,x,y,s,time)=>flame(c,x,y,s*.32,time)};})();


