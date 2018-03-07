
function SnakeInit() {
    this.dom = {
        'btn' : document.getElementsByClassName('startGame')[0],
        'main' : document.getElementsByClassName('gameAera')[0],
    };
    this.timer1;
    this.currentDiret = "";
    this.bindStartEvent();
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
        len = snakeBlock.children.length,
        self = this;
        document.addEventListener('keydown',function (e) {
        switch(e.key) {
            case 'ArrowDown' : 
                clearInterval(self.timer1);
                var keydownX = parseInt(getComputedStyle(snakeHead).left),
                    keydownY = parseInt(getComputedStyle(snakeHead).top);
                self.timer2 = setInterval(function () {
                    var moveY = parseInt(getComputedStyle(snakeHead).top) + 40;
                    snakeHead.style.top = moveY + "px";  
                    for(var i = 0; i < 3; i ++){
                        var x = parseInt(getComputedStyle(snakeBody[i]).left),
                            y = parseInt(getComputedStyle(snakeBody[i]).top);
                        if(x == keydownX && y ==keydownY){
                            snakeBody[i].style.top = x + 40 + "px";
                        }else{
                            switch(self.currentDiret){
                                case "right" : snakeBody[i].style.left = x + 40 + "px";
                            }
                        }
                    } 
                 },500)
                 break;
            case 'ArrowUp' : console.log(2);break;
            case 'ArrowLeft' : console.log(3); break;
            case 'ArrowRight' : console.log(4); break;
        }
        return false;
    } )
}
SnakeInit.prototype.move = function (direction) {
    var target = document.getElementById('snakeBlock'),
        len = target.children.length;
        this.timer1 = setInterval(function () {
            for(var i = 0; i < len; i++){
                var part = target.children,
                    moveX = parseInt(getComputedStyle(part[i]).left) + 40,
                    moveY = parseInt(getComputedStyle(part[i]).left) + 40;
                switch(direction) {
                    case "right" : part[i].style.left = moveX + 'px'; break;
                    default: break;
                }
            }
        },500);
/*     for( var i = 0; i < len; i++){
        (function (j) {
           var timer1 = setInterval(function () {
                var part = target.children,
                    moveX = parseInt(getComputedStyle(part[j]).left) + 40, 
                    moveY = parseInt(getComputedStyle(part[j]).top) + 40;
                switch (direction) {
                    case "right":
                        part[j].style.left = moveX + 'px'; 
                        break;
                    default:
                        break;
                }
            },500);
        }(i))
    } */
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
       snakeBlock.insertBefore(snakeBody,snakeHead);
    }
    this.dom.main.appendChild(snakeBlock);
    this.move('right');
    this.currentDiret = direction;
    this.bindKeyEvent();

}

new SnakeInit();