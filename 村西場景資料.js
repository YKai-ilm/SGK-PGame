window.VillageWestScene={image:'桃源村西-v1.png',points:[['張飛家',34,17,13.5,3.6,'zhangHome'],['村長家',15,43,13.5,3.6,'chiefHome'],['水井',52,39,17,14,'goldWell'],['回村莊',92,31,13.5,3.6,'village']]};
window.VillageWestLoot=(()=>{
 const key='three-kingdoms-interface-preview-v1',id='taoyuan-west-gold-necklace';
 function read(){return JSON.parse(localStorage.getItem(key)||'null')||{version:1,tutorial:{status:'new',step:0,reward:null},mode:'story',storyFaction:'蜀',libraryFaction:'蜀',teams:{},unlocks:{story:{heroes:[],letters:[]},battle:{heroes:[],letters:[]}},page:'home'};}
 function quest(){const q=read().storyEvents?.woodcutterJewelry;return q==='found'?'completed':q||'none';}
 function hasNecklace(s=read()){return !!s.equipment?.story?.items?.some(i=>i.id===id);}
 function accept(){const s=read();s.storyEvents??={};if(!s.storyEvents.woodcutterJewelry)s.storyEvents.woodcutterJewelry=hasNecklace(s)?'completed':'searching';localStorage.setItem(key,JSON.stringify(s));}
 function drawWater(){const s=read();s.storyItems??={};s.storyItems.waterBucket=1;s.storyEvents??={};let found=false;if(s.storyEvents.woodcutterJewelry==='searching'&&!s.storyEvents.westGoldNecklace&&!hasNecklace(s)){s.equipment??={};s.equipment.story??={items:[],loadouts:{}};s.equipment.story.items??=[];s.equipment.story.items.push({id,name:'金項鍊',slot:'accessory',description:'老樵夫妻子遺失的首飾。',source:'村西水井'});s.storyEvents.westGoldNecklace=true;s.storyEvents.woodcutterJewelry='completed';found=true;}localStorage.setItem(key,JSON.stringify(s));return found;}
 return{quest,accept,drawWater,hasNecklace};
})();
