# 拼图游戏练习总结

## 一 编程思路
### 1. HTML/CSS 完成wrapper的结构，对容器及游戏开始按钮的整体布局完成。 JS动态生成imgCell
在这一步，js动态生成每一个拼图块是重点。  每个拼图块img的scr都指向同一个图片。不同的地方在于每一个imgCell的位置(position) 和 背景图位置(background-position)。

### 2. 绑定“开始游戏”按钮事件
这是游戏的主干，点击按钮后，需要随机打乱每一个拼图块。这里，随机打乱拼图块并记录原始位置，主要通过数组。 数组记录imgCell的位置

### 3. 拖拽功能
游戏的交互主要通过拖拽imgCell来实现拼图， 拖拽的实现，主要绑定 `mousedown` `mousemove` `mouseup` 事件。 但是注意，`mousemove` 应该绑定在document上，而不是imgCell上。 同时，这里对于交换两个拼图位置，也是通过之前位置数组来进行。

### 4.游戏结束
当乱序数组一步步变回原始数组顺序，游戏成功。 注意比较两个数组是否相等不可以直接`==`，因为引用值存储的是地址，两个表面一样的数组、对象都返回`false`

## 二 关键操作、知识回顾
- 有关添加类、属性的操作  `addClass` `removeClass` `attr('class','xx')` `toggleClass('xx')`
- 创建dom元素并添加进去的方法
```
var son = $('<div></div');
father.append(son);
```
- 动态的变化、实现样式 animate()
**不同于.css({})  animate({},time,function () {}) 可以动态的添加样式并加一个回掉函数**
- 关于坐标点、位置
```
.on('mouseup',function (e){
    e.pageX  // 鼠标距离窗口的位置
    imgAera.offset().left // imgAera元素的距离左边的距离
    })
```
- 检验两个数组是否相等
  检验两个数组是否相等，可以先转换为字符串,再比较
```
    var arr1 = [1,2,3];
    var arr2 = [1,2,3];
    var str1 = arr1.join("~") //返回1~2~3  也可以使用toString方法
    var str2 = arr2.join("~")
```
