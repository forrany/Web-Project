var main = $('.main'),
	title = $('.title'),
	score = 0,
	timer,
	speed = 5,
	lock = true;
	color = ['#f3a','#33b','#96a','#62f'];


function start() {
	title.on('click',function() {
		title.css('display','none');
		move();

	})
}
function cDiv(){
	var line = $('<div></div>');
	var index = Math.floor(Math.random() * 4);
	line.attr('class','line');
	for(var i = 0; i < 4; i++){
		var iDiv = $('<div></div>');
		line.append(iDiv);
	}

	if(main.children().length == 0){
		line.appendTo(main);
	}else{
		line.insertBefore(main.children()[0]);
	}

	var clickDiv = line.children()[index];
	$(clickDiv).css('background-color',color[index]);
	$(clickDiv).attr('class','needclick');
	/*$('.line').find('.block').eq(Index).css('backgroundColor',color[Index]);
*/
}
function bindEvent(){
		main.on('click',function(e){
			if(lock){
				var event = e || window.event;
				if(event.target.className == 'needclick'){
					score++;
					event.target.style.backgroundColor = '#bbb';
					event.target.className = "";
				}else{
					clearInterval(timer);
					main.css('top','0px');
					alert('游戏结束，当前得分为'+ score);
					lock = false;
				}
				if(score % 10 == 0) {
					speed++;
				}				
			}
		})
}

function move() {
	clearInterval(timer);
	timer = setInterval(function(){
		var caltop = parseInt(main.css('top')) + speed;
		main.css('top',caltop +'px');
		if(parseInt(main.css('top')) >= 0){
			cDiv();
			main.css({
				'top': -150 + 'px',
			});
		}
		var len = main.children().length;
		if(len == 6){
			for(var i = 0; i < 4; i++){
				if(main.children()[len-1].children[i].className == 'needclick'){
					clearInterval(timer);
					alert('游戏结束，当前得分为'+ score);
					lock = false;
				}
			}
			$(main.children()[len-1]).remove();
		}


	},20);
	bindEvent();

}
start();
