# Javscript 高阶函数(上)
<!-- TOC -->

- [Javscript 高阶函数(上)](#javscript-高阶函数上)
    - [filter](#filter)
    - [map](#map)
    - [reduce](#reduce)
        - [reduce 实现compose](#reduce-实现compose)
            - [什么是compose](#什么是compose)
            - [面向过程的实现](#面向过程的实现)
            - [generator实现](#generator实现)
        - [总结](#总结)

<!-- /TOC -->

对于ES6的语法的引入，很多时候是我所不理解的，甚至是知道用法(api),却不清楚何使用、为什么用。一次偶然的机会，在Youtube看到了一个系列教程，觉得非常不错，遂记笔记，进行详细的梳理和整合，非常推荐大家去看原版啦，老师是个10年的coder，讲课比小品还生动的([@fun fun function](https://www.youtube.com/watch?v=BMUiFMZr7vk&index=1&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84))

因为一次可能更新不完，之后有新的内容会更新在github，欢迎小伙伴star，共同进步.[传送门](https://github.com/forrany/Web-Project)
## filter
从一段程序开始
```javascript
var tripe = function(x) {
    return x*3;
}

var waffle = tripe;
waffle(3);
```

这是一段简单到不能再简单的代码了，但是，这也是JS的特殊之处。一切皆对象，函数也是对象，函数可以是一个变量(var)。

正式这样的特殊性，让函数可以作为另一个函数的参数(callback)进行传递，这种方式就是高阶函数--函数中包含着另一个函数。下面就从`filter`函数举例来说

> 现在有一个需求，要找到一个数组中比3大的数字，并拿出来。

先看传统的，不用filter的方案
```javascript
function big(arr) {
    let ret = [];
    for(let i = 0; i<arr.length; i++) {
        if arr[i] > 3
        ret.push(arr[i]);
    }
    return ret;
}
// 如果现在需求改成找比3小的？再写代码？而且没有复用性。
```

好了，有没有可能简化或者优化下代码呢？让它更具有可维护性，更清楚点？ 来看看最简单的函数式编程，使用filter的例子。

```javascript
var arr = [1,2,3,4];
var b = arr.filter((x)=>{return x >3 });
console.log(b)  // [4]
```
好了，可以看到filter接收一个函数作为参数，函数会遍历数组每一个item，当`return`为`true`时，会返回当前的`item`。

这只是一个简单的逻辑，我们说的函数式编程，目的是为了让函数尽量功能简单、逻辑清晰，没有耦合的组织可以让函数复用和代码高效上更有利。所以我们改写下上面的内容
```javascript
var isBig = function(x) {
    return x > 3;
}
var b = arr.filter(isBig);
```
这样子，就完成了解耦，我们就是把函数当作一个变量、参数传给了另一个函数，这就是最基本的思想。 这样做的好处是什么？比如我们现在需要找到比3小的数字，只需要一行代码
```javascript
var c = arr.reject(isBig);
```
是的，就是这么简单，是不是很神奇？ 想想传统的思路，找比3大和比3小是怎么做的？

## map
map 是映射的意思，其实和filter很相似，只不过map是映射和变换原数组。什么意思?看下面的需求

> 一个数组中包含了很多对象，我想要获取这些对象的名字

```javascript
var animals = [
    {name:'cindy', species:'dog'},
    {name:'hash', species:'duck'},
    {name:'gigi', species:'rabit'},
    {name:'chik', species:'cat'},
]
```
好了，传统的做法又是要循环、遍历然后push之后，返回了。用map就很简单
```javascript
var name = animals.map(obj=>{
    return obj.name;
})
```
注意，这就是map和filter的不同： **filter遍历，并根据`true`和`flase`决定是否返回原对象(item); map就是纯粹的变换(transform)了。**

当然，我们可以利用map，让内容变的更加丰富
```javascript
var name = animals.map(obj=>{
    return `${obj.name}是一个${obj.species}`
})
```

## reduce

reduce最基本的用法如下：
```javascript
var arr = [1,2,3,4,5];
var sum = arr.reduce((sum,next)=>{
    return sum + next;
},0)
```

reduce接收两个参数，第一个是`callback`,第二个参数是`初始值`。`arr.reduce(callback(p1,p2),init)`

为什么要初始值呢？注意一下回调函数中，是两个参数，p1参数是上一次循环(loop)的返回结果，p2参数是当前遍历到的(item)。 很显然，那么第一次遍历时的p1，就是由`init`提供的。

reduce绝不仅仅是遍历一个数组或者做一个加法这么简单。他可以做更复杂事情，可以对对象进行操作。 比如我们看到这个例子：

```javascript
var fs = [
    'sam\tblender\t200\t1    ',
    'sam\tpot\t130\t5    ',
    'nacy\tconaver\t20\t3    ',
    'amy\tpot\t130\t2    ',
    'amy\tblender\t4\t2    '
]
```
现在需要统计这个数组中，sam\nacy\amy的个人财产和数据。 怎么办呢？ 利用上面介绍的方法组合，可以很好的做到

思路：  
 1. map对每个字符串进行处理和变换
 2. 使用reduce进行统计

```javascript
var fn = function(arr) {
    return arr.map(item=>{
        return item.trim().split('\t');
    }).reduce((custormer,line)=>{
        debugger;
        custormer[line[0]] = custormer[line[0]] || [];
        custormer[line[0]].push({
            'name' : line[0],
            'good' : line[1],
            'number' : line[2],
            'quilty': line[3]
        })
        return custormer
    },{})
}
fn(fs);
```
嗯，可能有点复杂了，一行一行来看。
```javascript
map的作用： 经过map,将原来每一项的字符串，转换成了数组，现在是
这样的形式：
[
    [[sam],[blender],[200],[1]],
    [[sam],[pot],[130],[5]],
    ...
]

好了，继续就到了reduce。我们给reduce穿的`init`是一个空对象，也就是
会创建一个对象作为返回值
第一次循环： 
  custormers:{}  line: [[sam],[blender],[200],[1]]
  custormers.sam = [];
  custormers.sam.push({...})
     ==> 最终 
     custormers = {
        sam:[{
            name:sam,
            property:blender,
            price:200,
            quilty:1
        }]
     }

第二次循环：
    custormers:{sam:[...]}  line:[[sam],[pot],[130],[5]]
    custormers.sam = [...]
    继续为sam这个对象，增加“财产"
    ...

...

```

所以看到了，这就是reduce的威力。

### reduce 实现compose

好了，reduce的作用可能远不止于前面介绍的那些，因为至少我们在菜鸟教程上看的话，会很醒目的告诉你，reduce可以实现**函数compose**
![reduce](https://github.com/forrany/Web-Project/blob/master/blog_image/reduce.png?raw=true)

我擦，这是什么东西？赶快了解了一下
#### 什么是compose
compose就是执行一系列的任务（函数），比如有以下任务队列
```
let tasks = [step1, step2, step3, step4]
```
每一个step都是一个步骤，按照步骤一步一步的执行到结尾，这就是一个compose
compose在函数式编程中是一个很重要的工具函数，在这里实现的compose有三点说明
* 第一个函数是多元的（接受多个参数），后面的函数都是单元的（接受一个参数）
* 执行顺序的自右向左的
* 所有函数的执行都是同步的

#### 面向过程的实现
使用递归的思想，不断的检测任务队列中是否有任务，如果有任务就执行，并把执行结果传递. 实现过程如下
```javascript
var compose = function(args) {
    let length = args.length;
    let count = lenth - 1;
    let result;
    return function inner(...inArgs) {
        result = args[count].apply(null,inArgs);
        if(coun <= 0) {
            return result;
        } 
        count--;
        return args[count].apply(null,result);
    }
}
```

#### generator实现
generator是会专门写一个介绍的(就在近期更新),同样是看了很多内容后，理解了它才做的。 因为generator本身就是实现中断、处理、再中断的流程。 generator遇到yield就会抛出一个iterator，而其next()方法可以传递参数，就可以实现传值，将上一步的运行结果，作为下一步的参数。 好了，下面就generator来实现。
```javascript
function * iterateSteps(steps) {
    let param;
    steps.forEach((step)=> {
        if(param) {
            param = yield step.apply(null,param)
        } else {
            param = yield;
        }
    })
}

const compose = function(steps) {
    let g = iterateSteps(steps);  //g是一个generator，通过next()执行
    return function(...args) {
        let val = steps.pop().apply(null,args) //val返回的值作为将作为第二个函数的参数
        //第一个函数无法传参，因此空消耗一个yield
        g.next()
        return steps.reverse.reduce((result,fn)=>{
            g.next(result).value //返回
        },val)
    }
}
```

解释：

这个可能看起来就有点让人迷糊了。 首先，generator就是一步步来运行函数的，只不过，与普通函数不同，运行到函数的地方，它会把"线程"抛出来，让外面来进行解决。当下次迭代到`next(val)`的时候，会把val值传回。

首先，因为第一次的运行无法传参数，所以我们将param定义，但是不赋值。 在`if-else`中，第一次将走到else，运行`param = yield`。 所以，当第一次运行next的时候，实际只是为了消耗yield。

在compose函数中，首先运行iterataSteps，接下来使用reduce来`自动运行` 这个generator，就可以使实现compose了。注意这里`Steps.pop.apply(null,args)`是弹出了最后一个函数，并执行，拿到的值，作为`reduce`的`init`参数。

### 总结
reduce实现compose的意思，通过上面的函数，已经解释到了。其实，compose的思路还有Promise、函数交织等思路，这里不做详细介绍了，可以在这里参考

[传送门--实现compose的五种思路](https://segmentfault.com/a/1190000011447164)