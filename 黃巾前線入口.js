'use strict';
(()=>{const key='three-kingdoms-xuzhou-story-v1',s=JSON.parse(localStorage.getItem(key)||'{}');if(!YellowQuest.progress().launched&&!window.SceneTest?.active()){location.replace('徐州劇情.html');return;}if(!['前線營地','黃巾前哨','黃巾主營'].includes(s.scene)){s.scene='前線營地';s.active=null;localStorage.setItem(key,JSON.stringify(s));}})();
