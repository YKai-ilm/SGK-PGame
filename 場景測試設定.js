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
