//1. 动态生成div和imgCell填充整个html框架      用到的关于dom的操作，需要反复熟悉
//2. 对于图片或内容随机并能复原的思想： 通过数组，记录位置；打乱数组，形成随机位置； 以数组指导位置；
//3. 数组乱序的方法，注意sort排序会对原数组有影响，因此用slice剪切一个全新数组，不让其影响原来数组
//4. 拖拽的应用，拖拽三步： ① MouseDown获取当前鼠标位置(e.pageX  e.pageY) ② MouseMove跟踪鼠标位置并动态设置div的left top值 ③ MouseUp抬起
//   如果要实现拖拽到某个盒子中，要设置和比较盒子的offset().top 以及 offset().left
//5. 移动后需要判定是交换位置还是返回原来的位置    imgCell只能在固定的格子之中。 通过判定MouseUp位置来进行判定
//6. 游戏是否结束判定，通过比较MassArr 和 OrignalArr，相等就成功。 注意数组、对象的比较不能直接 ==  他们是引用值，直接比较永远不相等(地址)
//7. 动态的完成某个效果，JQ中使用 animate()，第一个参数 css样式，第二个时间， 同时还可以增加函数

var btn = $('.start');
var imgArea = $('.imgArea');
var state = true;
var imgOrign = [];
var imgRandOrder = [];
var imgCell;

imgGenerate();
gameState();

function imgGenerate() {
	imgArea.html(''); //清空父级内容
	for(var i = 0; i < 3; i++){
		for(var j = 0; j < 3; j++){
			imgOrign.push(i * 3 + j);
			var cell = $('<div></div>');
			$(cell).attr('class','imgCell');  //注意这里cell还要重新变为jquery对象
			$(cell).css({
				'width' : '100px',
				'height' : '100px',
				'background' : 'url(./pic.jpg)',
				'left' : j*100 + 'px',
				'top': i*100 + 'px',
				'backgroundPosition': (-j) * 100 +'px ' + (-i) * 100 +'px',
			})
			imgArea.append(cell);
		}
	}
	imgCell = $('.imgCell');
}
function randArr() {
	copyArr = imgOrign.slice(0);
	imgRandOrder = [];
	imgRandOrder = copyArr.sort(function (a,b){
		return Math.random() - 0.5;
	})
	console.log(imgRandOrder);
	
}
function cellOrder(Arr) {
	var len = Arr.length;
	for(var i = 0; i < len; i++){
		var order = Arr[i];
		$(imgCell[i]).animate({
			'left' : Arr[i] % 3 * 100 + 'px',
			'top' : Math.floor(Arr[i] / 3) * 100 + 'px',
		},400)

	}
}
function gameState() {
	btn.on('click',function () {
		if(state){
			$(this).text('复原');
			state = false;
			randArr();  //打乱数组顺序
			cellOrder(imgRandOrder);  //根据乱序数组顺序排列图片
			console.log(imgRandOrder);
			imgCell.css({
				'cursor' : 'pointer',
			}).on('mouseover',function () {
				$(this).addClass('hover');
			}).on('mouseleave',function () {
				$(this).removeClass('hover');
			}).on('mousedown',function (e) {
				$(this).css({
					'cursor' : 'move',
				})
				var cellIndex1 = $(this).index();
				var cellX = e.pageX - imgCell.eq(cellIndex1).offset().left;
				var cellY = e.pageY - imgCell.eq(cellIndex1).offset().top;
				$(document).on('mousemove',function (e1) {
					imgCell.eq(cellIndex1).css({
						'z-index' : '90',
						'left' : e1.pageX - cellX - imgArea.offset().left + 'px',
						'top' : e1.pageY - cellY - imgArea.offset().top + 'px',
					})
				}).on('mouseup',function (e2) {

					var cellIndex2 = getIndex(e2.pageX - imgArea.offset().left , e2.pageY - imgArea.offset().top ,cellIndex1);
					if(cellIndex2 == cellIndex1){
						cellOrder(imgRandOrder);
						imgCell.eq(cellIndex1).css('z-index',10);
					}else{
						cellChange(cellIndex1,cellIndex2);	
					}
					$(document).off('mousemove').off('mouseup');
				}).on('mouseup',function () {
					$(this).css({
						"cursor" : "pointer"
					})
				})
			})
		}else{
			$(this).text('开始');
			state = true;
			cellOrder(imgOrign);
			imgCell.css('cursor', 'default').off('mousemove').off('mousedown').off('mouseup').off('mouseover');
		}
	})
}

function getIndex(x,y,index) {
	if( x < 0 || x > 300 || y < 0 || y > 300 ){
		return index;
	}else{
		var col = Math.floor(x / 100),
		row = Math.floor(y / 100),
		location = row * 3 + col;
		console.log(imgRandOrder.indexOf(location));
		console.log(x,y);
		return imgRandOrder.indexOf(location);
	}
}

function cellChange(from,to) {
	imgCell.eq(from).animate({
		"left" : imgRandOrder[to] % 3 * 100 + 'px',
		"top" : Math.floor(imgRandOrder[to] / 3) * 100 + 'px',
	},400,function () {
		$(this).css('z-index',10);
	});
	imgCell.eq(to).animate({
		"left" : imgRandOrder[from] % 3 * 100 + 'px',
		"top" : Math.floor(imgRandOrder[from] / 3) * 100 + 'px',							
	},400,function () {
		$(this).css('z-index',10);
		var temp = imgRandOrder[from];
		imgRandOrder[from] = imgRandOrder[to];
		imgRandOrder[to] = temp;
		if(isEqual(imgRandOrder,imgOrign)){
			success();
		}
	});
}
function isEqual(ARR1,ARR2) {
	str1 = ARR1.join(",");
	str2 = ARR2.join(",");
	if(str1 == str2){
		return true;
	}else{
		return false;
	}
}

function success () {
	imgCell.css('cursor','default').off("mouseover").off("mousedown").off("mousehover").off("mousemove");
	for(var i = 0 ; i < 9; i++){
		if(imgCell.eq(i).has('hover')){
			imgCell.eq(i).removeClass('hover');
		}
	}
	btn.text('开始');
	state = true;
	alert('Good Job! You success!');
}