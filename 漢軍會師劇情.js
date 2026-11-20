'use strict';
window.HanQuestUI=(()=>{
 let api,busy=false;const q=()=>HanQuest.progress(),wait=ms=>new Promise(r=>setTimeout(r,ms));
 const names=Object.keys(HanQuest.sceneGate),point=(name,x,y,id)=>[name,x,y,()=>npc(id)];
 function talk(key,flag){api.talk(HanCampaignLines[key],flag?'han:'+flag:null);}
 const say=(name,line)=>api.talk([[name,line]]);
 function travel(name){if(!HanQuest.canEnter(name))return;api.go(name);}
 function destinations(){api.menu('行程','可回城整備，已完成的劇情與已領物品會保留。',[...names.filter(n=>HanQuest.canEnter(n)&&n!==api.state.scene).map(n=>[n,()=>travel(n)]),['返回徐州',leave],['留下',()=>{}]]);}
 function leave(){if(window.SceneTest?.holdNavigation('返回徐州'))return;api.state.scene='內城';api.state.active=null;api.save();location.href='徐州劇情.html';}
 function enter(){if(!q().departed||window.SceneTest?.holdNavigation('盧植軍營'))return;api.state.scene='盧植軍營';api.state.active=null;api.save();location.href='漢軍會師.html';}
 function scene(name){if(!names.includes(name))return null;const p=q(),points=[],road='漢軍驛道-v1.png',camp='黃巾前線營地-v1.png';let image=camp;
  if(name==='盧植軍營'){if(!p.escortHeard)points.push(point('盧植',40,43,'hanLu'));points.push(point('傳令兵',72,53,'hanMessenger'));if(p.routeKnown)points.push(['廣宗外圍',51,16,()=>travel('廣宗外圍')]);if(p.dispatched)points.push(['前往長社',73,25,()=>travel('長社營地')]);}
  if(name==='廣宗外圍'){image=road;points.push(point('接應軍士',48,72,'hanRelief'));if(!p.reliefShown)points.push(point('車隊',74,49,'hanCart'));if(p.reliefWon&&!p.reliefShown)points.push(point('截路黃巾',48,28,'hanEnemy'));}
  if(name==='長社營地'){points.push(point('皇甫嵩',39,41,'hanHuang'),point(p.southOrdered?'留守軍吏':'朱儁',70,52,p.southOrdered?'hanRearGuard':'hanZhu'),point('軍需吏',28,73,'hanSupply'));if(p.zhuHeard)points.push(['長社側翼',51,16,()=>travel('長社側翼')]);if(p.fireReported)points.push(['驛道探訊',75,25,()=>travel('驛道探訊')]);if(p.southOrdered)points.push(['前往南陽',76,84,()=>travel('南陽軍前')]);}
  if(name==='長社側翼'){image='漢軍長社側翼-v1.png';points.push(point(p.southOrdered?'留守軍吏':'朱儁',43,65,p.southOrdered?'hanRearGuard':'hanFire'));if(p.fireWon&&!p.fireShown)points.push(point('黃巾前隊',54,31,'hanEnemy'));if(p.fireShown&&!p.fireReported)points.push(point('皇甫嵩',72,53,'hanFireReport'));}
  if(name==='驛道探訊'){image=road;if(!p.escortHeard)points.push(point('盧植',52,43,'hanEscort'),point('押解軍士',70,48,'hanEscortGuard'));else points.push(point('車隊已遠去',52,43,'hanGone'));}
  if(name==='南陽軍前'){points.push(point('朱儁',40,43,'hanNanyang'),point('斥候',71,53,'hanNanyang'),point('軍需吏',28,73,'hanSouthSupply'));if(p.completed)points.push(point('宛城軍情',51,16,'hanWancheng'));}
  points.push(['離開',50,93,()=>name==='廣宗外圍'?travel('盧植軍營'):['長社側翼','驛道探訊'].includes(name)?travel('長社營地'):destinations()]);return {image,points};
 }
 function choices(kind){api.menu(kind==='relief'?'守口接應':'長社解圍',kind==='relief'?'守住接應口，共四波。盧植於第二波前抵達。':'守住側翼，共六波。朱儁先行支援，皇甫嵩於第四波前抵達。',[['開始作戰',()=>start(kind)],['稍作準備',()=>{}]]);}
 async function start(kind){if(busy||window.SceneTest?.holdNavigation('漢軍會師戰鬥：'+kind))return;busy=true;api.setBusy(true);const fade=document.getElementById('fade');try{const run=HanQuest.begin(kind),b=document.createElement('button');b.className='hotspot scene-sign sign-common';b.dataset.name='漢軍戰前敵卡';b.textContent=kind==='relief'?'截路黃巾':'黃巾前隊';b.style.cssText='left:50%;top:30%;width:18%';document.getElementById('hotspots').append(b);await wait(900);fade.classList.add('busy');fade.style.opacity='1';await wait(1400);api.state.active=null;api.save();location.href='戰場直版.html?hanBattle='+kind+'&run='+encodeURIComponent(run)+'&returnTo='+encodeURIComponent('漢軍會師.html');}catch(e){api.notice(e.message);}finally{busy=false;api.setBusy(false);fade.classList.remove('busy');fade.style.opacity='0';}}
 function npc(id){const p=q();if(id==='taoqian'&&window.YellowQuest?.progress().completed){if(!p.departed)talk('departure','departed');else say('陶謙',p.completed?'諸位已赴南陽聽取軍情，遠行辛苦，先在城中整備。':'軍前不比鄉里，凡事以軍令與百姓安危為重。徐州出口可前往盧植軍營。');return true;}
  if(!id.startsWith('han'))return false;
  switch(id){
   case 'hanLu':if(!p.luHeard)talk('lu','luHeard');else if(p.reliefShown&&!p.dispatched)talk('dispatch','dispatched');else say('盧植',p.dispatched?'到了長社，將此間軍情如實交代。':'先問傳令兵道路，護住接應口，不必去追逃賊。');break;
   case 'hanMessenger':if(p.escortHeard){say('傳令兵','中郎將已奉令回京，此處由留守軍士照應。');break;}if(p.dispatched){say('傳令兵','軍情書已交予諸位，請依後續軍令行事。');break;}if(!p.luHeard)say('傳令兵','中郎將正在帳前，請先呈上文書。');else if(!p.routeKnown)talk('route','routeKnown');else say('傳令兵',p.reliefShown?'車隊已入營，請向中郎將覆命。':'廣宗外圍的道路已標明，整隊後便可前往。');break;
   case 'hanRelief':if(p.reliefShown)say('接應軍士','人都接到了，一個也沒落下。請回營向中郎將覆命。');else if(p.reliefBriefed)choices('relief');else talk('relief','reliefBriefed');break;
   case 'hanCart':say('車隊軍士','傷者與鄉民都在這裡，請先與接應軍士商議守備。');break;
   case 'hanHuang':if(p.southOrdered){say('皇甫嵩','朱將軍已領兵南下，我另有軍務。此後相見，盼聽到百姓安定的消息。');break;}if(p.escortHeard){say('皇甫嵩','子幹之事自當有人陳明，先向朱將軍回報，聽取後續軍令。');break;}if(!p.huangHeard)talk('huang','huangHeard');else if(p.fireShown&&!p.fireReported)talk('fireReport','fireReported');else say('皇甫嵩',p.fireReported?'側翼已安，去探問北路軍情，再向朱將軍回報。':'請找朱將軍分派側翼守備。');break;
   case 'hanZhu':if(p.escortHeard&&!p.southOrdered)talk('south','southOrdered');else if(!p.huangHeard)say('朱儁','軍情先呈皇甫將軍，議定進退，我再與你分派守備。');else if(!p.zhuHeard)talk('zhu','zhuHeard');else say('朱儁',p.southOrdered?'軍令已下，整軍後前往南陽軍前。':p.fireReported?'可循驛道探問北路消息，回來再議下一步。':p.fireShown?'側路已通，去向皇甫將軍回報。':'整隊後來側翼會合，未奉號令，不得離開守點。');break;
   case 'hanRearGuard':say('留守軍吏','朱將軍已領兵南下，請到南陽軍前會合。');break;
   case 'hanSupply':if(!p.zhuHeard)say('軍需吏','先聽將軍分派守備，才可領取這次補給。');else if(p.fireReported)say('軍需吏','戰後配發的硬皮甲已放在箱中，尚未領取的可自行取用。');else talk('supply');break;
   case 'hanFire':if(p.fireShown)say('朱儁',p.fireReported?'此處已交留守軍士照應，後續軍令回營再議。':'側路已通，去向皇甫將軍回報。');else if(p.fireBriefed)choices('fire');else talk('fire','fireBriefed');break;
   case 'hanFireReport':if(!p.fireReported)talk('fireReport','fireReported');else say('皇甫嵩','傷者已收治，回營整軍，再探問北路消息。');break;
   case 'hanEscort':case 'hanEscortGuard':if(!p.escortHeard)talk('escort','escortHeard');break;
   case 'hanGone':say('劉備','先生已遠去。回營向朱將軍稟明此事，聽候軍令。');break;
   case 'hanNanyang':if(!p.completed)talk('nanyang','completed');else say('朱儁','宛城城堅，先查清城內外消息，攻城與勸降之策尚待商議。');break;
   case 'hanSouthSupply':say('軍需吏','遠行辛苦，若需住宿與補給，可由行程返回徐州整備。');break;
   case 'hanWancheng':api.notice('已聽取宛城軍情。宛城討伐與勸降書支線尚未開放，可先回城整備。');break;
  }return true;
 }
 function finish(action,animated=false){if(!action?.startsWith('han:'))return false;const flag=action.slice(4);if(flag==='escortHeard'&&!animated){api.end();busy=true;api.setBusy(true);Promise.all(['盧植','押解軍士'].map(name=>document.querySelector('[data-name="'+name+'"]')?.animate([{opacity:1},{opacity:0,transform:'translate(0,-90px)'}],{duration:1400,fill:'forwards'}).finished)).then(()=>finish(action,true)).catch(e=>api.notice('演出未完成，可再次交談：'+e.message)).finally(()=>{busy=false;api.setBusy(false);});return true;}if(!HanQuest.advance(flag)&&!q()[flag])throw Error('劇情前置尚未完成');api.end();api.render();if(flag==='reliefBriefed'||flag==='fireBriefed')choices(flag.startsWith('relief')?'relief':'fire');else if(flag==='departed')api.notice('整軍北上：徐州出口已開放「前往盧植軍營」。');else if(flag==='dispatched')api.notice('奉書赴長社：營地行程已開放長社營地。');else if(flag==='escortHeard')api.notice('車隊已遠去。請回長社向朱儁回報。');else if(flag==='southOrdered')api.notice('整軍南下：行程已開放南陽軍前。');else if(flag==='completed')api.notice('漢軍會師完成：副章節成就可領玩家碎片10片。宛城後續尚未開放，黃巾主章未結束。');return true;}
 function pending(){const p=q();return p.reliefWon&&!p.reliefShown||p.fireWon&&!p.fireShown;}
 async function arrival(){if(!pending())return;busy=true;api.setBusy(true);const kind=q().reliefWon&&!q().reliefShown?'relief':'fire';try{api.state.scene=kind==='relief'?'廣宗外圍':'長社側翼';api.state.active=null;api.save();api.render();const name=kind==='relief'?'截路黃巾':'黃巾前隊',el=document.querySelector('[data-name="'+name+'"]');await wait(400);if(el)await el.animate([{opacity:1},{opacity:0,transform:'translate(30px,-70px)'}],{duration:1200,fill:'forwards'}).finished;HanQuest.advance(kind+'Shown');api.render();say('劉備',kind==='relief'?'車隊已安全入營，請回營向盧中郎將覆命。':'賊軍已退，先向皇甫將軍回報，再安置傷者。');}finally{busy=false;api.setBusy(false);}}
 function decorate(){if(api.state.scene==='長社側翼'&&q().fireShown){const smoke=document.createElement('div');smoke.setAttribute('aria-hidden','true');smoke.style.cssText='position:absolute;left:58%;top:3%;width:32%;height:12%;pointer-events:none;background:radial-gradient(ellipse at 50% 80%,#9d5b2877,transparent 48%),radial-gradient(ellipse at 50% 40%,#55544466,transparent 65%);filter:blur(5px)';document.getElementById('hotspots').append(smoke);}if(api.state.scene!=='長社營地')return;const p=q();for(const [id,gate,x,y,label,cls]of [['medicine','zhuHeard',32,80,'軍需行囊','travel-bag'],['armor','fireReported',20,65,'配發防具箱','treasure']]){if(!p[gate]||id==='medicine'&&p.loot?.[id])continue;const b=document.createElement('button');b.className='hotspot '+cls+(p.loot?.[id]?' opened':'');b.style.cssText='left:'+x+'%;top:'+y+'%';b.dataset.hanLoot=id;b.setAttribute('aria-label',label+(p.loot?.[id]?'（已領取）':''));b.onclick=()=>{try{const ok=HanQuest.collect(id);api.render();api.notice(ok?(id==='medicine'?'取得解毒散1份。':'取得硬皮甲1件，已放入裝備背包。'):'箱內已經空了。');}catch(e){api.notice('尚未領取：'+e.message);}};document.getElementById('hotspots').append(b);}}
 return {install:c=>{api=c;},scene,npc,finish,pending,arrival,decorate,enter};
})();
