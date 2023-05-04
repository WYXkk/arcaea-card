function calcA()
{
	var calcNote=parseInt(document.getElementById('calcNote').value);
	var calcScoreA=parseInt(document.getElementById('calcScoreA').value);
	var calcFar=parseInt(document.getElementById('calcFar').value);
	var calcMax=parseInt(document.getElementById('calcMax').value);
	if(!isNaN(calcNote)&&!isNaN(calcScoreA))
	{
		calcFar=2*calcNote-Math.floor((calcScoreA+1)/(1e7/calcNote/2));
		calcMax=calcScoreA-Math.floor((2*calcNote-calcFar)*(1e7/calcNote/2));
		document.getElementById('calcFar').value=calcFar.toString();
		document.getElementById('calcMax').value=calcMax.toString();
	}
	else if(!isNaN(calcNote)&&!isNaN(calcFar)&&!isNaN(calcMax))
	{
		calcScoreA=calcMax+Math.floor((2*calcNote-calcFar)*(1e7/calcNote/2));
		document.getElementById('calcScoreA').value=calcScoreA.toString();
	}
}
function calcB()
{
	var calcConst=parseFloat(document.getElementById('calcConst').value);
	var calcScoreB=parseInt(document.getElementById('calcScoreB').value);
	var calcResult=parseFloat(document.getElementById('calcResult').value);
	if(!isNaN(calcConst)&&!isNaN(calcScoreB))
	{
		calcResult=((calcScoreB>=9800000)?((calcScoreB-9800000)/200000+calcConst+1):((calcScoreB-9800000)/300000+calcConst+1));
		calcResult=Math.round(calcResult*100000)/100000;
		document.getElementById('calcResult').value=calcResult.toString();
	}
	else if(!isNaN(calcConst)&&!isNaN(calcResult))
	{
		calcScoreB=((calcResult>=calcConst+1)?((calcResult-calcConst-1)*200000+9800000):((calcResult-calcConst-1)*300000+9800000));
		calcScoreB=Math.round(calcScoreB);
		document.getElementById('calcScoreB').value=calcScoreB.toString();
	}
	else if(!isNaN(calcResult)&&!isNaN(calcScoreB))
	{
		calcConst=((calcScoreB>=9800000)?(calcResult-(calcScoreB-9800000)/200000-1):(calcResult-(calcScoreB-9800000)/300000-1));
		calcConst=Math.round(calcConst*10)/10;
		document.getElementById('calcConst').value=calcConst.toString();
	}
}