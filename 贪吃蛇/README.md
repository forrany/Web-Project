# 贪吃蛇游戏总结

1. 检查网页中是否有某个元素  `if(document.getElementsByClassName('xx'));`
2. 蛇的运动，控制蛇头进行元素加减，蛇身跟随：
   - 蛇身跟随的原理： 通过一个数组记录前一时刻蛇每个关节的位置，下一时刻，将位置赋值
   - 通过判断当前方向 currentDirec，确保蛇不能直接撞自己(左行时，按右键无效；上下同理)
3. 随机出现食物:
   - 判断网页内是否有苹果的元素  `if(document.getElementsByClassName)` 
   - 判断苹果是第几个，当碰到消失 `Array.prototpye.indexOf`  **注意数组的indexOf方法，要求元素严格相等`===`**
   - 删除元素、节点 `parent.removeChild(dom)`
4. 得分
   - 判断元素蛇头的位置是否与苹果的位置重合，重合后删除。 页面内插入内容：`document.creatTextNode("text")` 或者 `dom.innerHTML= xxx`
5. 键盘响应
   - 绑定事件 document.addEventListener('keydown',function (e) {}); **注意绑定在当前焦点document上，否则不会响应**
   - 判定事件类型 `keycode` `key`
6. 是否碰撞到自己的判断：
   - 这个非常关键！ 每一次动作(setInterval)中，都会将当前的位置(bodyPosition)存储在一个对象中，对象中有x和y两个数组这个数组，一定要小心。统一变量，如果是parseInt(pos),是没有"px"的number数据。
