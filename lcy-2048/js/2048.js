var nums = new Array();
var score=0;
var hasConflicted = new Array();

var startx=0;
var starty=0;
var endx=0;
var emdy=0;

$(document).ready(function(){

	settingForMobile();

	newgame();

});



//开始新游戏
function newgame(){

	init();
	//在随机的两个单元格中生成数字
	generateOneNumber();
	generateOneNumber();
}
	
	function settingForMobile(){
			if(documentWidth>500){
				containerWidth=500;
				cellWidth=100;
				cellSpace=20;
			}

		$('.head_row').css('width',containerWidth);

		$('.da').css('width',containerWidth-cellSpace*2);
		$('.da').css('height',containerWidth-cellSpace*2);
		$('.da').css('padding',cellSpace);
		$('.da').css('border-radius',cellWidth*0.08);

		$('.xiao').css('width',cellWidth);
		$('.xiao').css('height',cellWidth);
		$('.xiao').css('border-radius',cellWidth*0.08);


	}
	

	//初始化页面
	function init(){
		// 初始化单元格位置
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				var xiao=$("#xiao-"+i+"-"+j);
				xiao.css("top",getPosTop(i,j));
				xiao.css("left",getPosLeft(i,j));
			
			}
		};

		for(var i=0;i<4;i++){
			nums[i] = new Array();
			hasConflicted[i]=new Array();
			for(var j=0;j<4;j++){
				nums[i][j]=0;
				hasConflicted[i][j]=false;
			}
		};
	// 动态创建上层单元格并初始化
	updateView();
	score=0;
	updateScore(score);
} 
	// 更新上层单元格视图
	function updateView(){
		$('.number').remove();

		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				$('.da').append('<div class="number" id="number-'+i+'-'+j+'"></div>');

				var number=$('#number-'+i+'-'+j);

				if(nums[i][j]==0){
					number.css('width','0px');
					number.css('height','0px');
					number.css('top',getPosTop(i,j)+50);
					number.css('left',getPosLeft(i,j)+50);
				}else{
					number.css('width',cellWidth);
					number.css('height',cellWidth);
					number.css('top',getPosTop(i,j));
					number.css('left',getPosLeft(i,j));
					number.css('background',getNumberBgColor(nums[i][j]));
					number.css('color',getNumberColor(nums[i][j]));
					number.css('fontSize',getNumberSize(nums[i][j]));
					number.text(nums[i][j]);

				}
				hasConflicted[i][j] = false;

				$('.number').css('border-radius',cellWidth*0.06);
				$('.number').css('lineHeight',cellWidth+'px');
			}
		}
	}


	function generateOneNumber(){ 
		//判断是否还有空间，如果没有空间则直接返回
		if(noSpace(nums)){
			return;
		}

		var count=0;
		var temp=new Array();
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(nums[i][j]==0){
					temp[count] = i*4+j;
					count++;
				}
			}
		}
		var pos=Math.floor(Math.random()*count);

		var randx=Math.floor(temp[pos]/4);
		var randy=Math.floor(temp[pos]%4);

		var randNum=Math.random()<0.5?2:4;


		nums[randx][randy]=randNum;
		showNumberWithAnimation(randx,randy,randNum);
	}

	$(document).keydown(function(event){
		switch (event.keyCode) {
			case 37://左
				if(canMoveLeft(nums)){
					moveLeft();
					setTimeout(generateOneNumber,200);
					setTimeout(isGameOver,500);
					setTimeout(winer,500);
				}
				break;
			case 38://上
				if(canMoveUp(nums)){
					moveUp();
					setTimeout(generateOneNumber,200);
					setTimeout(isGameOver,500);
					setTimeout(winer,500);
				}
				break;
			case 39://右
				if(canMoveRight(nums)){
					moveRight();
					setTimeout(generateOneNumber,200);
					setTimeout(isGameOver,500);
					setTimeout(winer,500);
				}
				break;
			case 40://下
				if(canMoveDown(nums)){
					moveDown();
					setTimeout(generateOneNumber,200);
					setTimeout(isGameOver,500);
					setTimeout(winer,500);
				}
				break;

			default:
				// statements_def
				break;
		}
	});

	document.addEventListener('touchstart',function(event){
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;

	//判断滑动方向
	var deltax=endx-startx;
	var deltay=endy-starty;

	//判断当触摸移动距离小于一定阈值时不做操作，因为可能只是点击了屏幕，并未滑动
	if(Math.abs(deltax)<documentWidth*0.1 && Math.abs(deltay)<documentWidth*0.1){
		return;
	}

	if(Math.abs(deltax)>=Math.abs(deltay)){ //水平方向滑动
		if(deltax>0){ // 向右滑动
			if (canMoveRight(nums)) {
				moveRight();
				setTimeout(generateOneNumber, 210);
				setTimeout(isGameOver, 300);
			}
		}else{  // 向左滑动
			if (canMoveLeft(nums)) { // 判断是否可以向左移动
				moveLeft();
				setTimeout(generateOneNumber, 210); // 等待动画效果的执行
				setTimeout(isGameOver, 300);
			}
		}	
	}else{
		if(deltay>0){ // 向下滑动
			if (canMoveDown(nums)) {
				moveDown();
				setTimeout(generateOneNumber, 210);
				setTimeout(isGameOver, 300);
			}
		}else{  // 向上滑动
			if (canMoveUp(nums)) {
				moveUp();
				setTimeout(generateOneNumber, 210);
				setTimeout(isGameOver, 300);
			}
		}
	}

});

	

function moveRight(){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(nums[i][j]!=0){
				for(var k=3;k>j;k--){
					if(nums[i][k]==0  && noBlockHorizontal(i,j,k,nums)){ //第i行的第k-j列之间是否有障碍物
						//移动操作
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,j,k,nums) && !hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						nums[i][k]+=nums[i][j];
						nums[i][j]=0;
						
						score+=nums[i][k];
						updateScore(score);

						hasConflicted[i][k]=true;
						break;
					}
				}
			}
		}
	}
	
	setTimeout(updateView,200);
}

function moveLeft(){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(nums[i][j]!=0){
				for(var k=0;k<j;k++){
					if(nums[i][k]==0  && noBlockHorizontal(i,k,j,nums)){ //第i行的第k-j列之间是否有障碍物
						//移动操作
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,k,j,nums) && !hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						nums[i][k]+=nums[i][j];
						nums[i][j]=0;
						//统计分数
						score+=nums[i][k];
						updateScore(score);

						hasConflicted[i][k]=true; //已经叠加
						break;
					}
				}
			}
		}
	}
	//更新页面上的数字单元格，此处才是真正的更新显示移动后的效果
	setTimeout(updateView,200); //等待200ms，为了让单元格移动效果能够显示完
}

function moveUp(){
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(nums[i][j]!=0){
				for(var k=0;k<i;k++){
					if(nums[k][j]==0 && noBlockVertical(j,k,i,nums)){ //第j列的第k-i行之间是否有障碍物
						showMoveAnimation(i,j,k,j);
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[k][j]==nums[i][j] && noBlockVertical(j,k,i,nums) && !hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);	
						nums[k][j]+=nums[i][j];
						nums[i][j]=0;
						score+=nums[k][j];
						updateScore(score);

						hasConflicted[k][j]=true;
						break;
					}
				}
			}
		}
	}
	setTimeout(updateView,200);
}

function moveDown(){
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(nums[i][j]!=0){
				for(var k=3;k>i;k--){
					if(nums[k][j]==0 && noBlockVertical(j,i,k,nums)){ //第j列的第i-k行之间是否有障碍物
						showMoveAnimation(i,j,k,j);
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[k][j]==nums[i][j]  && noBlockVertical(j,i,k,nums) && !hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						nums[k][j]+=nums[i][j];
						nums[i][j]=0;
						score+=nums[k][j];
						updateScore(score);

						hasConflicted[k][j]=true;
						break;
					}
				}	
			}
		}
	}
	setTimeout(updateView,200);
}