function showNumberWithAnimation(i,j,randNumber){
	var number=$('#number-'+i+'-'+j);
	number.css('background',getNumberBgColor(randNumber));
	number.css('color',getNumberColor(randNumber));
	number.text(randNumber);

	number.animate({
		width:cellWidth,
		height:cellWidth,
		top:getPosTop(i,j),
		left:getPosLeft(i,j)	
	},500);
}

function showMoveAnimation(fromx,fromy,tox,toy){
	var number=$('#number-'+fromx+'-'+fromy);
	number.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
	},200);
} 