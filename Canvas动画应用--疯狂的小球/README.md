# Canvas应用--动画--疯狂小球

## 实现效果
1. 可以设置初始化，屏幕内的小球个数
2. 小球随机运动，动画效果
3. 小球的碰撞检测，撞到墙壁反弹 
4. 鼠标轨迹跟随。

## 思路

            1.将canvas宽高设置的和浏览器一样 
               - 注意，获取浏览器的高度  window.innerWidth/innerHeight
               - 赋值，可以直接 canvas.width = w; canvas.height = x; 因为canvas本身有width height属性
            2. oop面向对象编程。每个球都是一个对象，其所有的方法，属性写在其原型链上
               - Bubble.prototype.init()  初始化函数，初始化需要确定bubble的x,y 位置 r半径等，用随机数生成大小不一的球;
                  - 初始化init(x,y) 与 init() 的不同，鼠标跟随要求确定的x,y，随机生成要求随机，实现函数重载 overload解决此问题
               - Bubble.prototype.draw()  根据init的位置，半径等，画出图形。 注意canvas上 beginPath()的重要性
               - Bubble.prototype.move()  利用定时器进行不断调用，通过改变bubble的x,y，重绘来实现动画效果。注意每次擦除桌布
               - Bubble.prototype.collisionDect() 碰撞检测，小球撞到墙壁，原速反弹。速度分解实现。
            3. 鼠标跟随
               - canvas.addEventListener('mousemove',function (e) {})  函数中，记录e.pageX  e.pageY，赋值，绘图
