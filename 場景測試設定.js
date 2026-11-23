'use strict';
// 對應現行劇情頁的場景 ID；不另存一套對白。
window.SceneTestScenes={};
for(const [id,name,scene] of [['taoyuan','劉備家','home'],['village','桃源村','village'],['east','桃源村東','east'],['west','桃源村西','west'],['chiefHome','村長家','chiefHome'],['zhangHome','張飛家','zhangHome']])SceneTestScenes[id]={name,scene,group:'桃源村',engine:'taoyuan',url:'桃園起兵.html'};
for(const [id,name,scene] of [['xuzhou','徐州內城','內城'],['xuzhouWest','徐州城西','城西'],...['城主府','役所','驛站','客棧','酒樓','武器店','防具店','訓練店','編輯所','道具店','曹豹家','糜家','藥師家'].map(n=>['xz-'+n,n,n])])SceneTestScenes[id]={name,scene,group:'徐州',engine:'xuzhou',url:'徐州劇情.html'};
SceneTestScenes.yunlong={name:'雲龍山',scene:'雲龍山',group:'徐州',engine:'yunlong',url:'雲龍山場景預覽.html'};
window.SceneTestGuideIDs={'劉備家':'taoyuan','桃園村':'village','桃源村東':'east','桃源村西':'west','村長家':'chiefHome','張飛家':'zhangHome','徐州內城':'xuzhou','徐州城西':'xuzhouWest','雲龍山':'yunlong'};
for(const name of ['城主府','役所','驛站','客棧','酒樓','武器店','防具店','訓練店','編輯所','道具店','曹豹家','糜家','藥師家']){SceneTestGuideIDs[name]='xz-'+name;SceneTestGuideIDs['徐州'+name]='xz-'+name;}
SceneTestGuideIDs['徐州城主府一']='xz-城主府';SceneTestGuideIDs['城主府一']='xz-城主府';SceneTestGuideIDs['城西']='xuzhouWest';

for(const name of ['糧道谷關','茶站','盜糧匪寨']){const id='xz-'+name;SceneTestScenes[id]={name,scene:name,group:'徐州',engine:'xuzhou',url:'徐州劇情.html'};SceneTestGuideIDs[name]=id;}

for(const [id,name] of [['yellow-camp','前線營地'],['yellow-outpost','黃巾前哨'],['yellow-hq','黃巾主營']]){SceneTestScenes[id]={name,scene:name,group:'黃巾烽火',engine:'xuzhou',url:'黃巾前線.html'};SceneTestGuideIDs[name]=id;}

window.HanSceneStages=["departed","luHeard","routeKnown","reliefBriefed","reliefWon","reliefShown","dispatched","huangHeard","zhuHeard","fireBriefed","fireWon","fireShown","fireReported","escortHeard","southOrdered","completed"];
window.HanTestScenes=[["lu","盧植軍營","departed","黃巾前線營地-v1.png","盧植、傳令兵","拜會盧植後向傳令兵問路；廣宗接應勝利後回盧植處領受軍情書。"],["relief","廣宗外圍","routeKnown","漢軍驛道-v1.png","接應軍士、車隊","四波接應戰，盧植第二波前到達；勝利回營覆命。"],["camp","長社營地","dispatched","黃巾前線營地-v1.png","皇甫嵩、朱儁、軍需吏","先向皇甫嵩遞書，再問朱儁開側翼；軍需行囊給解毒散，戰後回報可領硬皮甲。"],["fire","長社側翼","zhuHeard","漢軍長社側翼-v1.png","朱儁、皇甫嵩","六波守側翼，朱儁部署階段可用，皇甫嵩第四波前到達。勝利後找皇甫嵩回報。"],["road","驛道探訊","fireReported","漢軍驛道-v1.png","盧植、押解軍士","長社戰後才開；完整對話後車隊離去，再回朱儁處。無戰鬥。"],["south","南陽軍前","southOrdered","黃巾前線營地-v1.png","朱儁、斥候、軍需吏","聽完宛城軍情完成漢軍會師。再與朱儁交談可接宛城委任；查訪老者與民夫後回來請書，戰後安置百姓再覆命。"]];
for(const [id,name]of HanTestScenes){SceneTestScenes["han-"+id]={name,scene:name,group:"黃巾烽火",engine:"xuzhou",url:"漢軍會師.html"};SceneTestGuideIDs[name]="han-"+id;}

window.WanSceneStages=["ordered","elder","worker","letter","sent","divided","won","shown","settled","completed"];
for(const [id,name]of [["wan-outside","宛城外圍"],["wan-gate","宛城城門"]]){SceneTestScenes[id]={name,scene:name,group:"黃巾烽火",engine:"xuzhou",url:"漢軍會師.html"};SceneTestGuideIDs[name]=id;}

for(const [id,name,gate] of [['han-changshe','長社','dispatched'],['han-guangzong','廣宗','reliefShown']]){SceneTestScenes[id]={name,scene:name,group:'黃巾烽火',engine:'xuzhou',url:'漢軍會師.html'};SceneTestGuideIDs[name]=id;HanTestScenes.push([id.slice(4),name,gate,name==='長社'?'長社縣城-v1.png':'廣宗縣城-v2.png','軍營入口、驛站','先到城鎮地點，再進軍營。']);}

for(const [town,prefix]of [['長社','changshe'],['廣宗','guangzong']]){
 SceneTestScenes['han-'+prefix].group=town;
 for(const label of ['縣衙','驛站','客棧','道具鋪','武器鋪','防具鋪','編輯所']){
  const id='town-'+prefix+'-'+label,name=town+'・'+label;
  SceneTestScenes[id]={name,scene:name,group:town,engine:'xuzhou',url:'漢軍會師.html'};SceneTestGuideIDs[name]=id;
 }
}
