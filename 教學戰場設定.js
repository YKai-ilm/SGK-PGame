/* 教學只調整關卡配置；攻擊、技能、移動、組將與美術共用原戰場。 */
(()=>{if(new URLSearchParams(location.search).get('tutorial')!=='1')return;window.TutorialBattleConfig={waves:2,health:.7,attack:.4,draw:i=>['關','羽','刀','弓','關','羽','槍','塔','趙','雲','投','刀'][i]};})();
