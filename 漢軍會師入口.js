'use strict';
(()=>{const key='three-kingdoms-xuzhou-story-v1',s=JSON.parse(localStorage.getItem(key)||'{}');if(!HanQuest.progress().departed&&!window.SceneTest?.active()){location.replace('徐州劇情.html');return;}if(!HanQuest.canEnter(s.scene)){s.scene='盧植軍營';s.active=null;localStorage.setItem(key,JSON.stringify(s));}})();
