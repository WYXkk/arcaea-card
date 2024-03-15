function longer(u,v){v=v.toString();while(v.length<u)v='0'+v;return v;}
function getTitle(songid,diff){
	var x=slst.songs.find((x)=>{return x.id==songid;})
	var t;
	if(x.difficulties[diff].title_localized!=undefined) t=x.difficulties[diff].title_localized;
	else t=x.title_localized;
	return t[songLang]||t['en'];
}
function gethtml(songid,diff,mxp,mis,far,rankk,isScoreOnly)
{
	var str='<div class="ui cards" style="display:inline-block;margin-top:-1.5em;margin-bottom:0.4em;margin-right:0.33em;"><div class="record card"><div class="content"><div class="header"><div class="title">';
	str+=getTitle(songid,diff);
	str+='</div><span class="ui '+['pst','prs','ftr','byd','etr'][diff]+'-color horizontal label">';
	str+=['PST','PRS','FTR','BYD','ETR'][diff]+' ';
	var constant=sdb[songid][diff].constant/10;
	var note=sdb[songid][diff].note;
	var lstInfo=slst.songs.find((x)=>{return x.id==songid;})
	var level=lstInfo.difficulties[diff].rating.toString()+(lstInfo.difficulties[diff].ratingPlus?'+':'');
	if(songid=='worldvanquisher'&&diff==2) level=['1','6','8','10+'][Math.random()*4|0];
	str+=level;
	str+='</span></div><div class="description"><div class="ui very compact grid"><div class="row"><div class="score"><span class="score">';
	var pur=note-mis-far;
	var score=Math.floor(1e7*(pur+far/2)/note+mxp);
	var a=Math.floor(score/1e6),b=Math.floor(score/1e3)%1000,c=score%1000;
	str+=longer(2,a)+"'"+longer(3,b)+"'"+longer(3,c);
	var ptt=Math.max(0,constant+Math.min((score>=9800000?(score-9600000)/200000:(score-9500000)/300000),2));
	ptt=Math.floor(ptt*100000)/100000;
	str+='</span><span class="chart-ptt"> / '+constant+' / '+ptt;
	str+='</span></div></div><div class="row"><div class="three wide rank column">';
	var rk='D';
	if(score>=8600000) rk='C';
	if(score>=8900000) rk='B';
	if(score>=9200000) rk='A';
	if(score>=9500000) rk='AA';
	if(score>=9800000) rk='EX';
	if(score>=9900000) rk='EX+';
	if(score>=10000000) rk='PM';
	if(score>=10000000+note) rk='PM+';
	str+=rk;
	if(isScoreOnly)
	{
		if(pur<0) {far=(far+2*pur)+"-2n";mis=-pur+"+n";pur="n";}
		else if(pur==0) {pur="n";far=far+"-2n";mis="n";}
		else {pur=pur+"+n";far=far+"-2n";mis="n";}
	}
	str+='</div><div class="nine wide details column"><div class="ui very compact grid"><div class="row">';
	str+='P: '+pur+' (+'+mxp+')'+'</div><div class="equal width row"><div class="column">';
	str+='F: '+far+'</div><div class="column">';
	str+='L: '+mis+'</div></div></div></div>';
	str+='<div class="three wide rank column">'+rankk+'</div>';
	str+='</div></div></div></div></div></div>';
	return str;
}
function getText(songid,diff,mxp,mis,far,isScoreOnly)
{
	var title=getTitle(songid,diff);
	var diffText=['PST','PRS','FTR','BYD','ETR'][diff];
	var constant=sdb[songid][diff].constant/10;
	var note=sdb[songid][diff].note;
	var lstInfo=slst.songs.find((x)=>{return x.id==songid;})
	var level=lstInfo.difficulties[diff].rating.toString()+(lstInfo.difficulties[diff].ratingPlus?'+':'');
	var pur=note-mis-far;
	var score=Math.floor(1e7*(pur+far/2)/note+mxp);
	var a=Math.floor(score/1e6),b=Math.floor(score/1e3)%1000,c=score%1000;
	a=longer(2,a),b=longer(3,b),c=longer(3,c);
	var ptt=Math.max(0,constant+Math.min((score>=9800000?(score-9600000)/200000:(score-9500000)/300000),2));
	ptt=Math.floor(ptt*100000)/100000;
	return `${title} [${diffText} ${level}] `+(isScoreOnly?"":`${pur}(+${mxp})-${far}-${mis} `)+`${a}'${b}'${c} (${constant} -> ${ptt})`;
}
function showMain()
{
	if(Object.keys(recentplay).length!=0)
	{
		document.getElementById("recent").innerHTML=gethtml(recentplay.songid,recentplay.diff,recentplay.mxp,
			recentplay.mis,recentplay.far,'REC',recentplay.isScoreOnly);
		document.getElementById("recentText").innerHTML=getText(recentplay.songid,recentplay.diff,recentplay.mxp,
			recentplay.mis,recentplay.far,recentplay.isScoreOnly);
	}
	else 
	{
		document.getElementById("recent").innerHTML="暂无最近游玩记录";
		document.getElementById("recentText").innerHTML='';
	}
	var ptt=0;document.getElementById("all").innerHTML='';
	for(var i in playlist)
	{
		document.getElementById("all").innerHTML+=gethtml(playlist[i].songid,playlist[i].diff,playlist[i].mxp,playlist[i].mis,
			playlist[i].far,'#'+(parseInt(i)+1),playlist[i].isScoreOnly);
		var pttnow=getptt(playlist[i].songid,playlist[i].diff,playlist[i].mxp,playlist[i].mis,playlist[i].far);
		if(i<10) ptt+=pttnow;
		if(i<30) ptt+=pttnow;
	}
	ptt/=40;
	var hi=Math.floor(ptt),lo=Math.floor(100*(ptt-hi));
	lo=lo.toString();hi=hi.toString();
	var badge=0;
	if(ptt>=3.5) badge=1;
	if(ptt>=7) badge=2;
	if(ptt>=10) badge=3;
	if(ptt>=11) badge=4;
	if(ptt>=12) badge=5;
	if(ptt>=12.5) badge=6;
	if(ptt>=13) badge=7;
	document.getElementById("ptt").className="rating-small rating-badge-"+badge;
	document.getElementById("ptthi").innerHTML=hi+'.';document.getElementById("pttlo").innerHTML=longer(2,lo);
	document.getElementById('pttext').innerHTML=hi+'.'+longer(5,Math.floor((ptt-hi)*1e5).toString());
}
function filter()
{
	var songcur='';
	var listsong=[];
	var diffi=[0,0,0,0,0];
	for(var i=0;i<5;i++) diffi[i]=document.getElementsByName("diff1")[i].checked;
	if(!(diffi[0]||diffi[1]||diffi[2]||diffi[3]||diffi[4])) diffi=[true,true,true,true,true];
	var constantMin=parseFloat(document.getElementById('rankmin').value),
		constantMax=parseFloat(document.getElementById('rankmax').value);
	if(isNaN(constantMin)) constantMin=0.0;constantMin=Math.max(constantMin,0.0);
	if(isNaN(constantMax)) constantMax=20.0;constantMax=Math.min(constantMax,20.0);
	var name=document.getElementById('songtitlea').value;
	for(i in sdb)
	{
		var lstInfo=slst.songs.find((x)=>{return x.id==i;})
		var t=true;
		{
			var flagTitle=false;
			var searchName=name.replaceAll(' ','').toLocaleLowerCase();
			var originalNames=[];
			for(var j in lstInfo.title_localized) originalNames.push(lstInfo.title_localized[j]);
			originalNames.push(lstInfo.artist);
			for(var j in lstInfo.search_title) for(var k in lstInfo.search_title[j]) originalNames.push(lstInfo.search_title[j][k]);
			for(var j in lstInfo.search_artist) for(var k in lstInfo.search_artist[j]) originalNames.push(lstInfo.search_artist[j][k]);
			for(var j in lstInfo.difficulties) if(lstInfo.difficulties[j].title_localized!=undefined)
				for(var k in lstInfo.difficulties[j].title_localized) originalNames.push(lstInfo.difficulties[j].title_localized[k]);
			for(var j in lstInfo.difficulties) if(lstInfo.difficulties[j].artist!=undefined)
				originalNames.push(lstInfo.difficulties[j].artist);
			for(var j in originalNames) if(originalNames[j].replaceAll(' ','').toLocaleLowerCase().includes(searchName)) flagTitle=true;
			if(!flagTitle) t=false;
		}
		var flag=false;
		for(var j=0;j<5;j++) if(diffi[j]&&sdb[i].length>j&&sdb[i][j].constant/10>=constantMin&&sdb[i][j].constant/10<=constantMax) flag=true;
		if(!flag) t=false;
		if(t) listsong.push({lst:lstInfo,info:sdb[i]});
	}
	var method=document.getElementById("sortMethod").value;
	var mainDiff=0;let ord=[4,3,0,1,2];for(let i=0;i<5;i++) if(diffi[ord[i]]) mainDiff=ord[i];
	var sortValue=(a)=>{return 1;}
	if(method=="name") sortValue=(a)=>{
		if(a.lst.difficulties[mainDiff].title_localized!=undefined)
			return a.lst.difficulties[mainDiff].title_localized.en.toLocaleLowerCase();
		return a.lst.title_localized.en.toLocaleLowerCase();
	};
	else if(method=="const") sortValue=(a)=>{return a.info[mainDiff].constant|0;};
	else if(method=="note") sortValue=(a)=>{return a.info[mainDiff].note|0;};
	else if(method=="time") sortValue=(a)=>{
		if(a.lst.difficulties[mainDiff].date!=undefined)
			return a.lst.difficulties[mainDiff].date;
		return a.lst.date;
	};
	listsong.sort((a,b)=>{return sortValue(a)<sortValue(b)?-1:(sortValue(a)>sortValue(b)?1:0);});
	if(document.getElementById("sortWay").checked) listsong.reverse();
	for(i in listsong)
	{
		var x=listsong[i].lst;
		songcur+='<div class="title"><div class="ui grid"><div class="six wide column">'+(x.title_localized[songLang]||x.title_localized.en);
		for(var j=0;j<5;j++) if(x.difficulties.length>j&&x.difficulties[j].title_localized!=undefined) {
			let t=x.difficulties[j].title_localized;
			songcur+='<br><div class="ui '+['pst','prs','ftr','byd','etr'][j]+'-color horizontal mini label">'+t[songLang]||t.en+'</div>';
		}
		songcur+='</div>';
		songcur+='<div class="nine wide column"><div class="ui equal width grid">';
		for(var j=0;j<3;++j)
		{
			if(listsong[i].info[j]!=undefined&&listsong[i].info[j].note!=-11)
				songcur+='<div class="column"><div class="ui '+['pst','prs','ftr','byd','etr'][j]+'-color horizontal label">'
				+((x)=>{return x==-1?'?':(Math.floor(x/10)+'.'+(x%10))})(listsong[i].info[j].constant)
				+'</div>'+((x)=>{return x==-1?'?':x})(listsong[i].info[j].note)+'</div>';
			else songcur+='<div class="column"></div>';
		}
		{
			let j=3;
			if(listsong[i].info[j]!=undefined&&listsong[i].info[j].note!=-11)
				songcur+='<div class="column"><div class="ui '+['pst','prs','ftr','byd','etr'][j]+'-color horizontal label">'
				+((x)=>{return x==-1?'?':(Math.floor(x/10)+'.'+(x%10))})(listsong[i].info[j].constant)
				+'</div>'+((x)=>{return x==-1?'?':x})(listsong[i].info[j].note)+'</div>';
			else {
				j=4;
				if(listsong[i].info[j]!=undefined&&listsong[i].info[j].note!=-11)
					songcur+='<div class="column"><div class="ui '+['pst','prs','ftr','byd','etr'][j]+'-color horizontal label">'
					+((x)=>{return x==-1?'?':(Math.floor(x/10)+'.'+(x%10))})(listsong[i].info[j].constant)
					+'</div>'+((x)=>{return x==-1?'?':x})(listsong[i].info[j].note)+'</div>';
				else songcur+='<div class="column"></div>';
			}
		}
		songcur+="<div class='column'><div class='mini ui blue submit button' onclick='jumpToPlayUpload(\""+x.id+"\")'>录入成绩</div></div>";
		songcur+='</div></div></div></div>';
	}
	document.getElementById('songcur').innerHTML=songcur;
}
function loadExample(){
	document.getElementById("example").innerHTML=
		gethtml('espebranch',2,948,1,10,'#4',false)+
		gethtml('aegleseeker',1,1023,14,35,'REC',false);
}