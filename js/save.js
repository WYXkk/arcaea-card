var playlist,recentplay,songLang;
function setNewLang(lang)
{
	songLang=lang;
	showMain();filter();loadExample();
	$('#displayLang').dropdown('set selected',lang)
	save();
}
function load()
{
	if(localStorage.arcsave!=undefined)
	{
		let t=JSON.parse(Base64.decode(localStorage.arcsave));
		recentplay=t.recentplay;
		playlist=t.playlist;
		songLang=t.songLang;
	}
	else
	{
		if(localStorage.playlist==undefined) playlist=[];
		else playlist=JSON.parse(Base64.decode(localStorage.playlist));
		if(localStorage.recentplay==undefined) recentplay={};
		else recentplay=JSON.parse(Base64.decode(localStorage.recentplay));
		localStorage.removeItem('playlist');
		localStorage.removeItem('recentplay');
	}
	if(playlist==undefined) playlist=[];
	if(recentplay==undefined) recentplay={};
	if(songLang==undefined) songLang='en';
	setNewLang(songLang);
}
function save()
{
	localStorage.arcsave=Base64.encode(JSON.stringify({playlist:playlist,recentplay:recentplay,songLang:songLang}));
}
function outersave()
{
	document.getElementById('rawoutput').value=Base64.encode(JSON.stringify({playlist:playlist,recentplay:recentplay,songLang:songLang}));
}
function outerload()
{
	let r=confirm('确定导入吗？这会覆盖你当前的存档！\n建议提前导出当前存档再导入！');
	if(!r) return;
	let t=JSON.parse(Base64.decode(document.getElementById('rawinput').value));
	recentplay=t.recentplay;
	playlist=t.playlist;
	songLang=t.songLang;
	if(recentplay==undefined) recentplay={};
	if(playlist==undefined) playlist=[];
	if(songLang==undefined) songLang='en';
	setNewLang(songLang);
	alert('导入成功。')
}
function clearsave()
{
	let r=confirm('确定清空存档吗？这会清除所有游玩信息和所有曲目信息！\n建议仅在存档损坏时使用！');
	if(!r)return;
	r=confirm('请再次确认是否清空存档，这会删除所有存储信息！');
	if(!r)return;
	r=confirm('存档被清空后无法被直接恢复（除非提前导出），请最后确认是否清空存档！');
	if(!r)return;
	playlist=[];recentplay={};songLang='en';
	setNewLang(songLang);
	alert('存档已经清空。')
}