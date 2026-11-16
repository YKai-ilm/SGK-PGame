'use strict';
(()=>{
 const script=document.currentScript,initial=script?.dataset.scene||'home';
 // 舊書籤與直接入口也由固定外層承載；file:// 本機預覽保持原入口。
 if(parent===window&&!window.GameAudioShell&&/^https?:$/.test(location.protocol)){
  const page=decodeURIComponent(location.pathname.split('/').pop())+location.search+location.hash;
  location.replace(new URL('index.html#page='+encodeURIComponent(page),location.href).href);return;
 }
 // 同源教學 iframe 共用外層播放器，避免兩首音樂同時播放。
 function changeSettings(e){if(e.target.id==='musicEnabled'||e.target.id==='musicVolume')window.GameMusic.settings(document.getElementById('musicEnabled').checked,document.getElementById('musicVolume').value);}
 try{if(parent!==window&&parent.GameMusic){window.GameMusic=parent.GameMusic;window.GameMusic.scene(initial);document.addEventListener('click',()=>window.GameMusic.unlock(),true);document.addEventListener('keydown',()=>window.GameMusic.unlock(),true);document.addEventListener('change',changeSettings);return;}}catch{}
 const tracks={home:'音樂/主頁.mp3',story:'音樂/劇情.mp3',battle:'音樂/戰鬥.mp3'};
 const audio=new Audio();audio.loop=true;audio.preload='metadata';
 let current='',paused=false,enabled=true,volume=.35,pendingSeek=null;
 const positions={};
 try{const s=JSON.parse(localStorage.getItem('three-kingdoms-music-settings')||'null');if(s){enabled=s.enabled!==false;volume=Number.isFinite(s.volume)?Math.max(0,Math.min(1,s.volume)):.35;}
 Object.assign(positions,JSON.parse(sessionStorage.getItem('three-kingdoms-music-positions')||'{}'));}catch{}
 audio.volume=volume;
 function remember(){if(current&&Number.isFinite(audio.currentTime)&&pendingSeek===null)positions[current]=audio.currentTime;try{sessionStorage.setItem('three-kingdoms-music-positions',JSON.stringify(positions));}catch{}}
 function play(){if(!current||paused||!enabled||document.hidden)return;if(audio.paused)audio.play().catch(()=>{});}
 audio.addEventListener('loadedmetadata',()=>{if(pendingSeek!==null){if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=pendingSeek%audio.duration;pendingSeek=null;}play();});
 function scene(name){if(name===current)return;remember();audio.pause();current=Object.hasOwn(tracks,name)?name:'';paused=false;if(!current)return;pendingSeek=current==='battle'?0:Math.max(0,Number(positions[current])||0);audio.src=new URL(tracks[current],script.src).href;play();}
 function battle(started,running,ended){if(ended){scene('');return;}scene('battle');const next=started&&!running;if(paused!==next){paused=next;if(paused)audio.pause();else play();}}
 function settings(on,level){enabled=!!on;volume=Math.max(0,Math.min(1,Number(level)||0));audio.volume=volume;try{localStorage.setItem('three-kingdoms-music-settings',JSON.stringify({enabled,volume}));}catch{}if(!enabled)audio.pause();else play();}
 window.GameMusic={scene,battle,settings,unlock:play,get state(){return{scene:current,paused,enabled,volume,playing:!audio.paused,time:audio.currentTime,loop:audio.loop};}};
 // Safari 要求首次播放由使用者操作啟動；失敗時留待下一次操作重試。
 document.addEventListener('click',play,true);document.addEventListener('keydown',play,true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){remember();audio.pause();}else play();});
 window.addEventListener('pagehide',()=>{remember();audio.pause();});window.addEventListener('pageshow',play);
 document.addEventListener('change',changeSettings);
 scene(initial);
})();
