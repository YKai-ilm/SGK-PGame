window.VillageEastScene={image:'桃源村東-v1.png',points:[['老翁',81,29,12,3.6,'elder'],['老樵夫',76,53,13.5,3.6,'woodcutter'],['桃樹',57,11,24,13,'rabbitTree'],['回村莊',9,42,13.5,3.6,'village']]};
window.VillageHiddenItems=(()=>{
 const key='three-kingdoms-taoyuan-hidden-items-v1';
 function read(){return JSON.parse(localStorage.getItem(key)||'{}');}
 function claimed(){return read().rabbitTreeClaimed===true;}
 function owned(){return read().rabbitDoll===1;}
 function claim(){const data=read();if(data.rabbitTreeClaimed)return false;data.rabbitTreeClaimed=true;data.rabbitDoll=1;localStorage.setItem(key,JSON.stringify(data));return true;}
 function flowerQuest(){const d=read();return d.flowerQuest||'none';}
 function flowerVisits(){return Math.min(2,Math.max(0,Number(read().flowerVisits)||0));}
 function finishFlowerVisit(n){const d=read();d.flowerVisits=Math.max(Number(d.flowerVisits)||0,n);localStorage.setItem(key,JSON.stringify(d));}
 function acceptFlower(){const d=read();if(!d.flowerQuest)d.flowerQuest='searching';localStorage.setItem(key,JSON.stringify(d));}
 function returnRabbit(){const d=read();if(d.flowerQuest!=='searching'||d.rabbitDoll!==1)return false;d.rabbitDoll=0;d.flowerQuest='completed';d.tanghulu=1;localStorage.setItem(key,JSON.stringify(d));return true;}
 function candyOwned(){return read().tanghulu===1;}
 function huatuoDone(){return read().huatuoCompleted===true;}
 function pasteOwned(){return read().fulingPaste===1&&!JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')||'{}').storyEvents?.yunlongRescue?.medicineUsed;}
 function completeHuatuo(){const d=read();if(d.huatuoCompleted||d.tanghulu!==1)return false;d.tanghulu=0;d.fulingPaste=1;d.huatuoCompleted=true;localStorage.setItem(key,JSON.stringify(d));return true;}
 return{key,claimed,owned,claim,flowerQuest,flowerVisits,finishFlowerVisit,acceptFlower,returnRabbit,candyOwned,huatuoDone,pasteOwned,completeHuatuo};
})();

// 夢輪迴劇情接入時，在主存檔 storyEvents.dreamReincarnationTriggered 寫入 true。
// 此處只提供資格判定；殘局內容及玩法尚未設定。
window.VillageElderPuzzle={
 requiredEvent:'dreamReincarnationTriggered',
 unlocked(){try{return JSON.parse(localStorage.getItem('three-kingdoms-interface-preview-v1')||'{}').storyEvents?.dreamReincarnationTriggered===true;}catch{return false;}}
};
