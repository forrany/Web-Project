> 面试和笔试题目中，经常会出现'promise','setTimeout'等函数混合出现时候的运行顺序问题。 我们都知道这些异步的方法会在当前任务执行结束之后调用，但为什么'promise'会在'setTimeout'之前执行？ 具体的实现原理是什么？

有和我一样正在为秋招offer奋斗的小伙伴，欢迎到github获取更多我的总结和踩过的坑，一起进步→→→→[传送门](https://github.com/forrany/Web-Project)
## 问题的提出
上面问题的答案，都在文章[《Tasks, microtasks, queues and schedules》](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly)讲的非常透彻。 建议英文可以的同学直接看这篇文章，就不要看我这个“笔记”了。( *之所以叫笔记，因为大部分内容出自文章，但是又不是按字翻译* )

以下的题目是我们刷题可以经常看到的一个常规题目：
```javascript
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```

几乎每个前端er都可以毫不犹豫的给出答案:
```javascript
script start
script end
promise1
promise2
setTimeout
```
问题来了，为什么`promise`的异步执行会在`setTimeout`之前，甚至`setTimeout`设置的延时是0都不行。 还有在Vue中，我们常用的nextTick()函数原理中，说的microtasks是什么东西？ 一切的解释都在开头给的文章中。 

ps： 再次再次声明，这篇文章仍然是我记得笔记，原文比我写的好得多，英文可以的小伙伴强烈推荐看原文。

## js异步实现原理
我们多多少少都应该听说过event loop，js是单线程的，通过异步它变得非常强大，而实现异步主要就是通过将异步的内容压入tasks，当前任务执行结束之后，再执行tasks中的callback。

**Tasks**，是一个任务队列，Js在执行同步任务的时候，只要遇到了异步执行和函数，都会把这个内容压入Tasks中，然后在当前同步任务完成后，再去Tasks中执行相应的回调。 举个例子，比如刚才代码中的`setTimeout`，当遇到这个函数，总会跟一个异步执行的任务(callback)，那么这个时候，Tasks队列里，除了当前正在执行的script之外，会在后面压入一个`setTimeout callback`， 而这个callback的调用时机，就是在当前同步任务完成之后，才会调用。这就是为什么,'setTimeout' 会出现在'script end'之后了。

**MicroTasks**，说一些这个，这个和`setTimeout`不同，因为它是在当前Task完成后，就立即执行的，或者可以理解成，'microTasks总是在当前任务的最后执行'。  另外，还有一个非常重要的特性是： **如果当前JS stack如果为空的时候(比如我们绑定了click事件后，等待和监听click时间的时候，JS stack就是空的),一会立即执行。** 关于这一点，之后有个例子会具体说明，先往下看。

那么MicroTasks队列主要是promise和mutation observer 的回掉函数生成

### 用新的理论来解释下
好了，刚才大概说了几个概念，那么一开始的例子，到底发生了什么？

`talk is cheap, show me a animation!!`---我自己说的

下面的[动画](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly)说明对整个过程进行了说明:

![原文中的动态演示](https://user-gold-cdn.xitu.io/2018/8/5/1650827c4eb4d2a5?w=420&h=306&f=gif&s=441671)

1、 程序执行  `log: script start`
* Tasks: Run script
* JS stack: script

2、 遇到setTimeout  `log: script start `
* Tasks： Run script | setTimeout callback
* JS stack: script

3、 遇到Promise
* Tasks: Run script | setTimeout callback
* Microtasks: promise then
* JS stack: script

4、 执行最后一行 `log: script start | script end `
* Tasks: Run script | setTimeout callback
* Microtasks: promise then
* JS stack: script

4、 同步任务执行完毕，弹出相应的stack `log: script start | script end `
* Tasks: Run script | setTimeout callback
* Microtasks: promise then
* JS stack:

5、 同步任务最后是microTasks，JS stack压入callback `log: script start | script end | promise1`
* Tasks: Run script | setTimeout callback
* Microtasks: promise then | promise then
* JS stack: promise1 calback
6、 promise返回新的promise，压入microTasks，继续执行 `log: script start | script end | promise1 | promise2`
* Tasks: Run script | setTimeout callback
* Microtasks:  promise then
* JS stack: promise2 calback

8、 第一个Tasks结束,弹出 `log: script start | script end | promise1 | promise2`
* Tasks: setTimeout callback
* Microtasks:
* JS stack:

9、 下一个Tasks `log: script start | script end | promise1 | promise2 | setTimeout`
* Tasks: setTimeout callback
* Microtasks:
* JS stack: setTimeout callback


好了，结束了，这就比之前的理解"promise比setTimeout快，异步先执行promise，再执行setTimeout"就深刻的多。 因为promise所建立的回掉函数是压入了`mircroTasks`队列中，它仍然属于当前的Task，而`setTimeout`则是相当于在Task序列中添加了新的任务

## 一个更复杂的例子
好了，有了刚才的认识和铺垫，接下来通过一个更加复杂的例子来熟悉JS事件处理的一个过程。

现在有这样一个页面结构：
```html
<div class="outer">
  <div class="inner"></div>
</div>

```

![](https://user-gold-cdn.xitu.io/2018/8/5/1650914100613dfd?w=225&h=194&f=png&s=1245)
js代码如下,现在如果点击里面的方块，控制台会输出什么呢？[在线实例](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly)
```javascript
// Let's get hold of those elements
var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

// Let's listen for attribute changes on the
// outer element
new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true
});

// Here's a click listener…
function onClick() {
  console.log('click');

  setTimeout(function() {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function() {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

// …which we'll attach to both elements
inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);
```

这里先把正确答案公布，按照之前的理论，正确答案应该是：
```javascript
click
promise
mutate
click
promise
mutate
timeout
timeout
```
当然，不同浏览器，对于event loop的实现会稍有不同，这个是chrome下打印出来的结果，具体的其他形式还是推荐大家看原文了。

下面分析下，为什么是上面的顺序呢？

### 代码分析
按照刚才的结论：

click事件显然是一个Task，Mutation observer和Promise是在microTasks队列中的，而setTimeout会被安排在Tasks之中。 因此

1、点击事件触发
* Tasks: Dispatch click
* Microtasks: 
* JS stack:

2、触发点击事件的函数，函数执行，压入JS stack
* Tasks: Dispatch click
* Microtasks: 
* JS stack: onClick
* Log: 'click'

3、遇到setTimeout，压入Tasks队列
* Tasks: Dispatch click | setTimeout callBack
* Microtasks: 
* JS stack: onClick
* Log: 'click'

4、遇到promise，压入Microtasks
* Tasks: Dispatch click | setTimeout callBack
* Microtasks: Promise.then
* JS stack: onClick
* Log: 'click'

5、遇到 outer.setAttribute，触发mutation
* Tasks: Dispatch click | setTimeout callBack
* Microtasks: Promise.then | Mutation observers
* JS stack: onClick
* Log: 'click'

6、onclick函数执行完毕，出JS stack
* Tasks: Dispatch click | setTimeout callBack
* Microtasks: Promise.then | Mutation observers
* JS stack:
* Log: 'click'

7、这个时候，JS stack为空，执行Microtasks
* Tasks: Dispatch click | setTimeout callBack
* Microtasks: Promise.then | Mutation observers
* JS stack: PromiseCallback
* Log: 'click' 'promise'

8、microtasks顺序执行
* Tasks: Dispatch click | setTimeout callBack
* Microtasks:  Mutation observers
* JS stack: Mutation callback
* Log: 'click' 'promise' 'mutate'

接下来是重点，当microtasks为空，该执行下一个Tasks(setTimeout)了吗？并没有，因为js事件流中的冒泡被触发，也就是在外面的一层Div也会触发click函数，因此我们把刚才的步骤再走一遍。

过程省略，结果为
9、冒泡走一遍的结果为
* Tasks: Dispatch click | setTimeout callBack | setTmeout callback(outer)
* Microtasks:  Mutation observers
* JS stack: Mutation callback
* Log: `click` `promise` `mutate` `click`  `promise` `mutate` 

10、 第一个Tasks完成，出栈
* Tasks: setTimeout callBack | setTmeout callback(outer)
* Microtasks: 
* JS stack: setTimeout callback
* Log: `click` `promise` `mutate` `click`  `promise` `mutate` `timeout`

11、 第二个Tasks完成，出栈
* Tasks: setTmeout callback(outer)
* Microtasks: 
* JS stack: setTimeout(outer) callback
* Log: `click` `promise` `mutate` `click`  `promise` `mutate` `timeout` `timeout`


结束了

所以这里的重点是什么？ 是**MicroTasks的执行时机： 见缝插针，它不一定就必须在Tasks的最后，只要JS stack为空，就可以执行**  这条规则出处在

>If the stack of script settings objects is now empty, perform a microtask checkpoint                
— HTML: Cleaning up after a callback step 3

另一方面，ECMA也对此有过说明
>Execution of a Job can be initiated only when there is no running execution context and the execution context stack is empty…                                     
   — ECMAScript: Jobs and Job Queues
   
**但是对于其他浏览器(firefox  safari ie)同样的代码，得出的结果是不同的哦。关键在于，对与 `job`和`microTasks`之间的一个联系是很模糊的。  但是我们就按照Chrome的实现来理解吧。**
 ### 最后一关
 
 还是刚才那道题，只不过，我不用鼠标点击了，而是直接执行函数
 
 ```javascirpt
 inner.click()
 ```
 如果这样，结果会一样吗？
 
 答案是:
 ```javascript
 click
 click
 promise
 mutate
 promise
 timeout 
 timeout
 ```
 
 What！！？？我怎么感觉我白学了？ 不着急，看下这次的过程是这样的，首先最大的不同在于，我们在函数最底部加了一个执行`inner.click()`，这样子，这个函数执行的过程，都是同步序列里的，所以这次的task的起点就在Run scripts:
 
1、不同与鼠标点击，我们执行函数后，进入函数内部执行
* Tasks: Run scripts
* Microtasks: 
* JS stack: script | onClick
* Log: `click`

2、遇到setTimeout和promise&mutation
* Tasks: Run scripts | setTimeout callback
* Microtasks: Promise.then | Mutation Observers
* JS stack: script | onClick
* Log: `click`

3、接下来关键，冒泡的时候，因为我们并没有执行完当前的script,还在`inner.click()`这个函数执行之中，因此当`onclick`结束，开始冒泡时，script并没有结束
* Tasks: Run scripts | setTimeout callback
* Microtasks: Promise.then | Mutation Observers
* JS stack: script | onClick(这是冒泡的click，第一次click已经结束)
* Log: `click` `click` 

4、冒泡阶段重复之前内容
* Tasks: Run scripts | setTimeout callback |setTimeout callback(outer)
* Microtasks: Promise.then | Mutation Observers |promise.then
* JS stack: script | onClick(这是冒泡的click，第一次click已经结束)
* Log: `click` `click`

注意第二次没有增加mutation，因为已经有一个在渲染的了

5、inner.click()执行完毕,执行Microtasks
* Tasks: Run scripts | setTimeout callback |setTimeout callback(outer)
* Microtasks: Promise.then | Mutation Observers |promise.then
* JS stack: 
* Log: `click` `click` `promise`

6、按理论执行
* Tasks: Run scripts | setTimeout callback |setTimeout callback(outer)
* Microtasks: Mutation Observers |promise.then
* JS stack: 
* Log: `click` `click` `promise` `mutate`....

后面的就不解释了，Microtasks依次出栈，接着Tasks顺序执行。

## 总结

Jake老师的文章，对这个的解析和深入实在令人佩服，我也在面试中因把event loop解释的较为详尽而被面试官肯定，所以如果对异步以及event loop有疑惑的，可以好好的消化下这个内容，一起进步!
