var backupload=false;
function getptt(songid,diff,mxp,mis,far)
{
	var constant=sdb[songid][diff].constant/10;
	var note=sdb[songid][diff].note;
	var pur=note-mis-far;
	var score=Math.floor(1e7*(pur+far/2)/note+mxp);
	var ptt=Math.max(0,constant+Math.min((score>=9800000?(score-9600000)/200000:(score-9500000)/300000),2));
	return ptt;
}
function uploadplay()
{
	var title=document.getElementById('songtitle').value;
	var diff=null;var obj=document.getElementsByName("diff2");
	for(var i in obj) if(obj[i].checked) diff=parseInt(obj[i].value);
	var mis,far,mxp,isScoreOnly;
	if(slst.songs.find((x)=>{return x.title_localized.en==title})==undefined)
	{
		var str='没有 "'+title+'" 的 '+['PST','PRS','FTR','BYD'][diff]+' 难度的谱面信息。';
		alert(str);
		return;
	}
	var lstInfo=slst.songs.find((x)=>{return x.title_localized.en==title;})
	var songid=lstInfo.id;
	if(sdb[songid][diff].note==-1||sdb[songid][diff].constant==-1)
	{
		var str='没有 "'+title+'" 的 '+['PST','PRS','FTR','BYD'][diff]+' 难度的谱面信息。';
		alert(str);
		return;
	}
	if(!isNaN(parseInt(document.getElementById('scoreOnly').value))) {
		isScoreOnly=true;var score=parseInt(document.getElementById('scoreOnly').value);
		var note=sdb[songid][diff].note;
		mis=0;far=2*note-Math.floor((score+1)/(1e7/note/2));mxp=score-Math.floor((2*note-far)*(1e7/note/2));
		if(far<=1) isScoreOnly=false;
		if(far>=2*note-1) {isScoreOnly=false;mis=far-note;far=note-mis;}
	}
	else {
		isScoreOnly=false;
		mis=parseInt(document.getElementById('mis').value);
		far=parseInt(document.getElementById('far').value);
		mxp=parseInt(document.getElementById('mxp').value);
		if(isNaN(mis)) {alert('输入数据不合法！');return;}
		if(isNaN(far)) {alert('输入数据不合法！');return;}
		if(isNaN(mxp)) {alert('输入数据不合法！');return;}
	}
	var newrec={'songid':songid,'diff':diff,'mis':mis,'far':far,'mxp':mxp,'isScoreOnly':isScoreOnly};
	recentplay=newrec;
	var c=0;
	for(i in playlist) if(playlist[i].songid==songid&&playlist[i].diff==diff)
	{
		var ptt1=getptt(songid,diff,playlist[i].mxp,playlist[i].mis,playlist[i].far);
		var ptt2=getptt(songid,diff,mxp,mis,far);
		if(ptt2>=ptt1) playlist[i]=newrec;
		c=1;
	}
	if(c==0) playlist[playlist.length]=newrec;
	playlist.sort(function(a,b){
		var ptta=getptt(a.songid,a.diff,a.mxp,a.mis,a.far);
		var pttb=getptt(b.songid,b.diff,b.mxp,b.mis,b.far);
		return pttb-ptta;
	})
	save();
	showMain();
	document.getElementById('songtitle').value='';
	for(var i in obj) obj[i].checked=(obj[i].value==2);
	document.getElementById('mis').value='';
	document.getElementById('far').value='';
	document.getElementById('mxp').value='';
	document.getElementById('scoreOnly').value='';
}
function delplay()
{
	var title=document.getElementById('songtitlec').value;
	var lstInfo=slst.songs.find((x)=>{return x.title_localized.en==title;})
	var songid=lstInfo.id;
	var diff=null;var obj=document.getElementsByName("diffc");
	for(var i in obj) if(obj[i].checked) diff=parseInt(obj[i].value);
	var a=-1,b={};
	for(var i in playlist)
	{
		if(playlist[i].songid==songid&&playlist[i].diff==diff)
		{
			a=i,b=playlist[i];
		}
	}
	if(a==-1) {alert('没有 "'+title+'" 的 '+['PST','PRS','FTR','BYD'][diff]+' 难度的游玩记录。');return;}
	var num=sdb[songid][diff].note;
	var r=confirm('确认删除 "'+title+'" 的 '+['PST','PRS','FTR','BYD'][diff]+' 难度的游玩记录吗？'
		+(b.isScoreOnly?"":('\nPURE:'+(num-b.far-b.mis)+'(+'+b.mxp+') FAR:'+b.far+' LOST:'+b.mis))
		+'\n得分：'+(Math.floor(1e7*((num-b.far-b.mis)+b.far/2)/num+b.mxp)));
	if(!r) return;
	for(i=parseInt(a);i<playlist.length-1;++i) playlist[i]=playlist[i+1];
	--playlist.length;
	if(recentplay.songid==songid&&recentplay.diff==diff) recentplay={};
	document.getElementById('songtitlec').value='';
	for(var i in obj) obj[i].checked=(obj[i].value==2);
	showMain();save();
}
function jumpToPlayUpload(songid)
{
	var x=slst.songs.find((x)=>{return x.id==songid;});
	document.getElementById('songtitle').value=x.title_localized.en;
	settab(2,'playupload');
}