'use strict';
(()=>{const button=document.getElementById('banditEncounter'),dialog=document.getElementById('foundItem'),close=document.getElementById('closeFound'),message=document.getElementById('foundText');let pending=false,timer=null;
 function travel(){sessionStorage.setItem('yunlong-return-scroll',String(document.getElementById('view').scrollTop));location.href='戰場直版.html?yunlongBandits=1&returnTo='+encodeURIComponent('雲龍山場景預覽.html');}
 button.onclick=()=>{if(pending)return;pending=true;button.disabled=true;close.hidden=true;message.textContent='此路是我開，欲從此路過，留下買路財！';dialog.showModal();timer=setTimeout(travel,2000);};
 dialog.addEventListener('cancel',e=>{if(pending)e.preventDefault();});addEventListener('pagehide',()=>clearTimeout(timer));addEventListener('pageshow',()=>{if(pending){pending=false;button.disabled=false;close.hidden=false;if(dialog.open)dialog.close();}});
 const img=document.getElementById('scene');function restore(){const value=sessionStorage.getItem('yunlong-return-scroll');if(value!==null){document.getElementById('view').scrollTop=Number(value)||0;sessionStorage.removeItem('yunlong-return-scroll');}}addEventListener('load',restore,{once:true});
})();
