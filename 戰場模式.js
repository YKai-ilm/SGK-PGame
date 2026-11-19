'use strict';
// 一次進入戰場共用同一模式；其他頁籤切換介面不改變本場來源。
(()=>{let s={};try{s=JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')||'{}')||{};}catch{}
 const q=new URLSearchParams(location.search),story=['storySweep','villageDefense','villageRescue','yunlongBandits'].some(k=>q.has(k));
 const mode=story?'story':s.mode==='battle'?'battle':'story',faction=mode==='story'&&['魏','蜀','吳','群雄','東漢'].includes(s.storyFaction)?s.storyFaction:mode==='story'?'蜀':null;
 window.BattleContext=Object.freeze({mode,faction,teamKey:mode==='story'?'story:'+faction:'battle'});
})();
