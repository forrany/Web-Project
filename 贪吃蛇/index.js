/*
1. 检查网页中是否有某个元素  if(document.getElementsByClassName('xx'));
2. 蛇的运动，控制蛇头进行元素加减，蛇身跟随：
       -蛇身跟随的原理： 通过一个数组记录前一时刻蛇每个关节的位置，下一时刻，将位置赋值
       -通过判断当前方向 currentDirec，确保蛇不能直接撞自己(左行时，按右键无效；上下同理)
3.  随机出现苹果
        - 判断网页内是否有苹果的元素  if(document.getElementsByClassName)
        - 判断苹果是第几个，当碰到消失   Array.prototpye.indexOf
        - 删除元素、节点 parent.removeChild(child);
4.  得分
        - 判断元素蛇头的位置是否与苹果的位置重合，重合后删除。 页面内插入内容： dom.innerHTML 或者 document.creatTextNode('我是文本')
5.  键盘响应
        - 绑定时间 addEventListener("keydown",function(e){})
        - 事件event的属性，包括keycode key等，不同的按键有不同的状态。 e 本身也是对象
6.  是否碰撞到自己的判断：
        -这个非常关键！ 每一次动作(setInterval)中，都会将当前的位置(bodyPosition)存储在一个对象中，对象中有x和y两个数组
    这个数组，一定要小心。统一变量，如果是parse
6.  事件流
7.  timer 互不干扰，独立作用域
8.  array.map   array.reduce  str.match  str.toUpperCase str.toLowerCase str.substring(0,3)  
9.  array.indexOf 与 str.indexOf的不同
10. jquery anmiate不支持  "transform" 
*/

function SnakeInit() {
    this.dom = {
        'btn' : document.getElementsByClassName('startGame')[0],
        'main' : document.getElementsByClassName('gameAera')[0],
        'actScore' : document.getElementsByClassName('actScore')[0],
    };
    this.timer1;
    this.bodyPosition = {x:[],y:[]};
    this.applePosition = {x:[],y:[]};
    this.detectPosition = {x:[],y:[]};
    this.currentDiret = "";   //当前移动的方向
    this.bindStartEvent();   //绑定键盘、点击事件 
    this.score = 0;
}
SnakeInit.prototype.cashDectet = function () {
/*    
    1. 碰到墙壁；
    2. 碰到自己，检测头的坐标是否和 bodyPosition坐标相同;*/
    var snakeHead = document.getElementById('snakeHead'),
        snakeBlock = document.getElementById('snakeBlock'),
        snakeBody = document.getElementsByClassName('snakeBody'),
        self = this;
    cashTimer = setInterval(function () {
        var x = parseInt(getComputedStyle(snakeHead).left),
            y = parseInt(getComputedStyle(snakeHead).top),
            Bx = parseInt(getComputedStyle(snakeBlock).left),
            BY = parseInt(getComputedStyle(snakeBlock).top),
            len = snakeBlock.children.length;
        if((x + Bx) < 0 || (x + Bx > 1200)){
            alert("Game Over! Your Score Is : " + self.score);
            clearInterval(self.timer1);
            clearInterval(cashTimer);
        }else if((y + BY) < 0 || (y + BY) > 560){
            alert("Game Over! Your Score Is : " + self.score);
            clearInterval(self.timer1);
            clearInterval(cashTimer);            
        }
        
        for(var i = 0; i < len; i++){
            self.detectPosition.x[i] = parseInt(getComputedStyle(snakeBlock.children[i]).left);
            self.detectPosition.y[i] = parseInt(getComputedStyle(snakeBlock.children[i]).top);
        }
        for(var i = 1; i < len; i++){
            if(x == self.detectPosition.x[i]){
                if(y == self.detectPosition.y[i]){
                    alert("Game Over! Your Score Is : " + self.score);
                    clearInterval(self.timer1);
                    clearInterval(cashTimer);  
                }
            }
        }
        

    },100)
        
        
}
SnakeInit.prototype.bindStartEvent = function () {
    var self = this;
    this.dom.btn.addEventListener('click',function () {
        this.style.display = "none" ;
        self.init('right');
    },false);  
}
SnakeInit.prototype.bindKeyEvent = function () {
    var snakeHead = document.getElementById('snakeHead'),
        snakeBody = document.getElementsByClassName('snakeBody'),
        snakeBlock = document.getElementById('snakeBlock'),
        len = snakeBody.length,
        self = this;
        document.addEventListener('keydown',function (e) {
        e.preventDefault();
        switch(e.key) {
            case 'ArrowDown' : 
                console.log(e.key);
                if(self.currentDiret == "up" || self.currentDiret == "down"){
                    break;
                }
                self.move("down"); break;
            case 'ArrowUp' : 
                if(self.currentDiret == "up" || self.currentDiret == "down"){
                    break;
                }               
                self.move("up"); break;
            case 'ArrowLeft' : 
                if(self.currentDiret == "left" || self.currentDiret == "right"){
                    break;
                }
                self.move("left"); break;
            case 'ArrowRight' :
                if(self.currentDiret == "left" || self.currentDiret == "right"){
                    break;
                } 
                self.move("right"); break;
        }
        return false;
    } )
}

SnakeInit.prototype.move = function (direction) {
    if(this.timer1){
        clearInterval(this.timer1);
    }
    var snakeBlock = document.getElementById('snakeBlock'),
    snakeHead = document.getElementById('snakeHead'),
    snakeBody = document.getElementsByClassName('snakeBody'),
    x = parseInt(getComputedStyle(snakeHead).left),
    y = parseInt(getComputedStyle(snakeHead).top),
    self = this;

    this.timer1 = setInterval(function () {
        var len = snakeBlock.children.length;
        for(var i = 0; i < len; i++){
            self.bodyPosition.x[i] = parseInt(getComputedStyle(snakeBlock.children[i]).left);
            self.bodyPosition.y[i] = parseInt(getComputedStyle(snakeBlock.children[i]).top);
        }
        if(document.getElementsByClassName('apple')){                         //判断游戏中是否出现了食物
            var apple = document.getElementsByClassName('apple'),
                appleNum = apple.length;
            for(var i = 0; i < appleNum; i++ ){
                self.applePosition.x[i] = parseInt(getComputedStyle(apple[i]).left);
                self.applePosition.y[i] = parseInt(getComputedStyle(apple[i]).top);
            }
        }
        switch(direction) {
            case "right" : 
                snakeHead.style.left = self.bodyPosition.x[0] + 40 + "px";
                snakeHead.style.transform = "rotateZ(0deg)";
                self.currentDiret = "right";
                for(var i = 0; i < len -1; i ++){
                    snakeBody[i].style.left = self.bodyPosition.x[i] + "px";
                    snakeBody[i].style.top = self.bodyPosition.y[i] + "px";
                }
                break;
            case "left" :
                snakeHead.style.left = self.bodyPosition.x[0] - 40 + "px";
                snakeHead.style.transform = "rotateZ(180deg)" ;
                self.currentDiret = "left";
                for(var i = 0; i < len -1; i ++){
                    snakeBody[i].style.left = self.bodyPosition.x[i] + "px";
                    snakeBody[i].style.top = self.bodyPosition.y[i] + "px";
                }
                break;
            case "up" :
                snakeHead.style.top = self.bodyPosition.y[0] - 40 + "px";
                snakeHead.style.transform = "rotateZ(-90deg)" ;
                self.currentDiret = "up";
                for(var i = 0; i < len -1; i ++){
                    snakeBody[i].style.left = self.bodyPosition.x[i] + "px";
                    snakeBody[i].style.top = self.bodyPosition.y[i] + "px";
                }
                break;
            case "down" :
                snakeHead.style.top = self.bodyPosition.y[0] + 40 + "px";
                snakeHead.style.transform = "rotateZ(90deg)";
                self.currentDiret = "down";
                for(var i = 0; i < len -1; i ++){
                    snakeBody[i].style.left = self.bodyPosition.x[i] + "px";
                    snakeBody[i].style.top = self.bodyPosition.y[i] + "px";
                }
                break;
        }
        if(apple){
            var mapX = parseInt(getComputedStyle(snakeHead).left) + parseInt(getComputedStyle(snakeBlock).left),
                mapY = parseInt(getComputedStyle(snakeHead).top) + parseInt(getComputedStyle(snakeBlock).top);
            for(var i =0; i < appleNum; i++){
                if(mapX == self.applePosition.x[i] && mapY == self.applePosition.y[i]){
                    self.addBody(mapX,mapY);
                }
            }
        }
        self.dom.actScore.innerHTML = self.score;
    },200)
}
SnakeInit.prototype.addBody = function (x,y) {
    //  删除苹果  新加入苹果   加长身体
    var apple = document.getElementsByClassName('apple');
    var n = apple.length,
        snakeBody = document.createElement('div'),
        snakeBlock = document.getElementById('snakeBlock');
        len = snakeBlock.children.length;
    for(var i = 0; i < n; i++){
        if(x == this.applePosition.x[i]){
            var index = i;
            this.dom.main.removeChild(apple[i]);
            break;
        }
    }
    snakeBody.className = "snakeBody"
    snakeBody.style.left = this.bodyPosition.x[len-1] +"px";
    snakeBody.style.top = this.bodyPosition.y[len-1] + "px" ;
    snakeBlock.appendChild(snakeBody);
    this.appleShow();
    this.score++;
}
SnakeInit.prototype.appleShow = function () {
    var apple = document.getElementsByClassName('apple');
    var n = Math.floor(Math.random()*2 + 1);   // 确定是随机生成1个或者2个果实
    if(apple.length >= 1){                          //保证同时只能存在两个果实
        this.generate(1);
    }else{
        this.generate(n);            
    }
    
}
SnakeInit.prototype.generate = function (n) {
    for(var i = 0; i < n; i++){
        var apple = document.createElement('div'),
            x = Math.floor(Math.random()*30) * 40;
            y = Math.floor(Math.random()*15) * 40;
        apple.className = "apple";
        apple.style.left = x + "px";
        apple.style.top = y + "px";
        this.dom.main.appendChild(apple);
    }
}
SnakeInit.prototype.init = function (direction) {
    var self = this,
        bodyPositionX = 40,
        bodyPositionY = 40;
    var positionX = Math.floor(Math.random() * 12 + 3) * 40,
        positionY = Math.floor(Math.random() *15) * 40,
        moveLeft = positionX;
    var snakeBlock = document.createElement('div'),
        snakeHead = document.createElement('div');
    snakeBlock.id = 'snakeBlock';
    snakeBlock.style.left = positionX + "px";
    snakeBlock.style.top = positionY + "px";
    snakeHead.id = 'snakeHead';
    snakeBlock.appendChild(snakeHead);
    for(var i = 0; i < 3; i++) {
       var snakeBody = document.createElement('div');
       snakeBody.className = 'snakeBody';
       snakeBody.style.left = -bodyPositionX + 'px';
       bodyPositionX += 40;
       snakeBlock.appendChild(snakeBody);
    }
    this.dom.main.appendChild(snakeBlock);
    this.move('right');
    this.currentDiret = direction;
    this.bindKeyEvent();
    this.cashDectet();      //检测是否碰壁或者撞到自己  
    this.appleShow();

}

var snake = new SnakeInit();
