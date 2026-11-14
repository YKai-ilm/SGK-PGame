 'use strict';
window.CitySceneNavigation=(()=>{
 // 新城接入時在此登記入口；共用店鋪不得寫死返回某座城。
 const cities=Object.freeze({xuzhou:{name:'徐州城',home:'徐州城內城預覽.html'}});
 function context(search=location.search){const p=new URLSearchParams(search),id=p.get('city'),city=Object.hasOwn(cities,id)?cities[id]:null;return {cityId:city?id:null,city,source:p.get('source')==='guide'?'guide':'city'};}
 function sceneURL(scene,ctx=context()){const p=new URLSearchParams({scene});if(ctx.cityId)p.set('city',ctx.cityId);if(ctx.source==='guide')p.set('source','guide');return '共用室內場景預覽.html?'+p.toString();}
 function destination(ctx=context()){return ctx.source==='guide'||!ctx.city?'劇情場景圖鑑.html':ctx.city.home;}
 function label(ctx=context()){return ctx.source==='guide'||!ctx.city?'返回場景圖鑑':'返回'+ctx.city.name;}
 return {cities,context,sceneURL,destination,label};
})();
