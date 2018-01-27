var timer = null,
	timerInv = null,
	window_width = 720,
	index = 0,
	flag = true,
	step = 0,
	img_count = 4,
	newLeft = 0,
	locatArr = [0, -720, -1440, -2160];
var box = document.getElementsByClassName('box')[0],
	dot = document.getElementsByClassName('dot')[0];

/**
*轮播图片展示函数(最新，利用CSS3)，根据索引值到达相应地方
*@param none
*@return none
*/
function disPlay () {
	var initLeft = parseInt(window.getComputedStyle(box).left);
	if(index == img_count - 1){
		moveTo(0);
		index = 0;
	}else{
		moveTo(++index);
	}
}
/**
*轮播图片展示函数，老版本，利用JS的interval函数实现动态变换
*@param none
*@return none
*/

/*function disPlay () {
	var initLeft = parseInt(window.getComputedStyle(box).left);
	timer = setInterval(function (inittime) {
		if(index == img_count - 1){
			index = 0;
			clearInterval(timer);
			timerInv = setInterval(function () {
				var nowposition = parseInt(window.getComputedStyle(box).left);
				if(nowposition == 0){
					timer3 = setTimeout(disPlay,1500);
					clearInterval(timerInv);
				}else{
					nowposition += 20;
					box.style.left = nowposition + 'px';
				}
			},2);
			
		}else if(initLeft - parseInt(window.getComputedStyle(box).left) < window_width){
			step = parseInt(window.getComputedStyle(box).left);
			step = step - 5;
			box.style.left = step +'px';
		}else{
			index++;
			clearInterval(timer);
			timer3 = setTimeout(disPlay,1500);
		}
	},2)
}*/

/**
*上一张/下一章图片
*Function lastPlay/nextPlay
*@param none
*@return none
*/
function lastPlay () {
	if(index == 0){
		moveTo(3);
		index = 3;
	}else{
		moveTo(--index);
	}
}
function nextPlay () {
	if(index == 3){
		moveTo(1);
		index = 1;
	}else{
		moveTo(++index);
	}
}
/**
*绑定时间，包括小圆点、箭头的click事件
*@function bindEvent
*@param none
*@return none
*/
function bindEvent() {
	var li = dot.getElementsByTagName('li');
	var next = document.getElementsByClassName('next')[0];
	var last = document.getElementsByClassName('last')[0];
	next.addEventListener('click',function () {
		clearInterval(timer);
		nextPlay();
		timer = setInterval(disPlay,2000);
	});
	last.addEventListener('click',function() {
		clearInterval(timer);
		lastPlay();		
		timer = setInterval(disPlay,2000);
	});
	for(var i = 0; i < 4; i++){
		(function (j) {
			li[j].addEventListener('click',function () {
				clearInterval(timer);
				index = j;
				moveTo(index);
				timer = setInterval(disPlay,2000);
			})
		}(i))
		
	}
}
/**
*跳转到某张图片
*@function moveTo
*@param location 索引值，具体位置存储在locatArr数组中
*@return none
*/
function moveTo(location) {
	var target_position = parseInt(window.getComputedStyle(box).left) - locatArr[location];
	box.style.left = locatArr[location] + 'px';
}
function start() {

	timer = setInterval(disPlay,2000);
	var timerDot = setInterval(function () {
		var dots = document.getElementsByClassName('dot')[0];
		var singledot = dots.getElementsByTagName('li');
		for(var i = 0; i < 4; i++){
			singledot[i].className = '';
		}
		singledot[index].className = 'act';

	},20)
	bindEvent();
}

start();
	
