const fs=require('fs'),path=require('path'),sharp=require('sharp');
module.exports=async function(out){
 const root=path.resolve(__dirname,'..'),variant=path.join(root,'variants/five-v-five');
 const scripts=['桃園起兵.js','村東場景資料.js','村西場景資料.js','桃園首戰設定.js','村外進度.js','劇情軍資.js','劇情士氣.js','共用錢包.js','人物字卡樣式.js'];
 for(const name of scripts){let text=fs.readFileSync(path.join(root,name),'utf8').replaceAll('three-kingdoms-','sgk-swallow-').replaceAll('.png','.webp');
  if(name==='桃園起兵.js')text=text.replace("$('restart').onclick=", "$('restart').hidden=true;$('restart').onclick=").replace('全隊士氣恢復至100。','存活武將的生命與計策值已恢復。');
  fs.writeFileSync(path.join(out,name),text);
 }
 for(const name of ['桃園起兵.css','主介面流程.css','遊戲字體.css','場景物件.css'])fs.writeFileSync(path.join(out,name),fs.readFileSync(path.join(root,name),'utf8').replaceAll('.png','.webp'));
 for(const name of ['吞食主頁.js','吞食銜接.js'])fs.copyFileSync(path.join(variant,name),path.join(out,name));
 const home=fs.readFileSync(path.join(variant,'吞食主頁.html'),'utf8');for(const name of ['入口.html','主介面流程預覽.html'])fs.writeFileSync(path.join(out,name),home);
 let village=fs.readFileSync(path.join(root,'桃園起兵.html'),'utf8');village=village.replace(/<script\b[^>]*\bsrc="(?:行旅等待|行旅等待介面|場景測試設定|場景重測|背景音樂|各城掃蕩|大地圖通行)\.js[^" ]*"[^>]*><\/script>/g,'');
 village=village.replace('<script src="桃園起兵.js', '<script>window.SWALLOW_CAMPAIGN=true;</script><script src="shared/grain-route.js"></script><script src="game.js"></script><script src="吞食銜接.js"></script><script src="桃園起兵.js');fs.writeFileSync(path.join(out,'桃園起兵.html'),village);
 const images=['劉備家居室-v1.png','桃園村背景-無字牌-v1.png','桃源村東-v1.png','桃源村西-v1.png','村長家居室-v1.png','張飛家居室-v1.png','主城草地背景-v1.png','場景共用物件-v1.png'];
 for(const name of images)await sharp(path.join(root,name)).webp({quality:88,effort:5}).toFile(path.join(out,name.replace('.png','.webp')));
};
