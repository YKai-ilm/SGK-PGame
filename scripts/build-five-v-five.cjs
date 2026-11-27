'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.preview-five-v-five');
(async()=>{fs.mkdirSync(out,{recursive:true});const source=path.join(root,'variants/five-v-five');const files={'入口.html':path.join(source,'玩法入口.html'),'index.html':path.join(source,'驗證入口.html'),'game.js':path.join(source,'game.js'),'ui.js':path.join(source,'ui.js'),'style.css':path.join(source,'style.css'),'shared/grain-route.js':path.join(root,'shared/grain-route.js'),'共用室內場景資料.js':path.join(root,'共用室內場景資料.js')};
 files['武將戰鬥能力資料.js']=path.join(root,'武將戰鬥能力資料.js');files['品質美術.js']=path.join(root,'品質美術.js');
 files['攻擊美術.js']=path.join(root,'攻擊美術.js');
 const hashes={};for(const [target,from]of Object.entries(files)){const data=fs.readFileSync(from);fs.mkdirSync(path.dirname(path.join(out,target)),{recursive:true});fs.writeFileSync(path.join(out,target),data);hashes[target]=crypto.createHash('sha256').update(data).digest('hex');}
 for(const file of ['糧道谷關-v1.png','盜糧匪寨-v2-黑風寨.png','共用室內場景/茶站-v1.png','共用室內場景/客棧-v1.png','共用室內場景/城主府大堂三-v2-方正議事廳.png']){const target=path.join(out,file.replace(/\.png$/,'.webp'));fs.mkdirSync(path.dirname(target),{recursive:true});const data=await sharp(path.join(root,file)).webp({quality:88,effort:5}).toBuffer();fs.writeFileSync(target,data);}
 fs.writeFileSync(path.join(out,'build-info.json'),JSON.stringify({variant:'five-v-five-preview',sharedContent:hashes['shared/grain-route.js'],saveKey:'sgk-five-v-five-preview-v1',production:false},null,2));console.log('Built isolated five-v-five preview; shared content hash '+hashes['shared/grain-route.js'].slice(0,12));
})().catch(e=>{console.error(e);process.exitCode=1;});
