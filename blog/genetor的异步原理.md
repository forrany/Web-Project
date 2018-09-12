# generator的异步原理

## 从实际应用场景开始
假设我们有一个异步的请求，想要去通过api获取一些数据。这里借助`node-fetch`库来获取数据。
`fetch`可以异步的获取数据，并返回一个promise，所以常规的异步操作和写法，大致如下
```javascript
var fetch = require('node-fetch');
fetch('http://jasonplacerholder.typecoder.com/posts/1')
    .then( res => res.json() )
    .then( post => post.title )
    .then( x => console.log('Title: ',x))
```

好了，以上的代码就是一个获取api，并拿到api中的`title`内容。 关于promise这里不多说，fetch返回的就是一个promise。

## genetor实现
那么如果使用generator会如何实现实现同样的一个异步操作呢？ 这里先给结果，再来分析实现原理。这里记住`co`，这个co是干嘛的，一会分析并实现一个我们自己的co函数。

co接收一个genetor，所以我们可以认为co就是一个generator的发动机，或者自动执行器。
```javascript
const co = require('co');
co(function *() {
    const url = 'http://jasonplacerholder.typecoder.com/posts/1';
    const response = yield fetch(url);
    const post = yield response.json();
    const title = post.title;
    console.log('Title: ',title);
})

```
好了，结束，执行后，会输出同样的结果，似乎和promise没有两样。下面先简单的逐行分析，来看看在genetor中，做了什么。
```
//从genetor的第一行开始
第一行： 定义了url
第二行： 声明response，并将fetch(url)的结果.....yield
stop...
What is yield???
```
嗯，所以，这个genetor的yield是干什么的？这是`genetor`和普通函数的不同之处，也是它可以做异步的基础。不同与普通函数，genetor遇到了`yield`之后，会将yield后面的处理内容抛出。

genetor: 运行呀---运行呀---运行呀--yield？ What？这是什么鬼，我搞不定，老大你帮我搞定后再加我---out..

outer(执行器co）: 收到yield返回的结果，处理----返回给genetor

genetor: 收到处理结果---运行---yeild？这又是什么？你帮我搞定，out...

outer(执行器co)： 收到yield返回的promise，处理---返回给genetor

这就是异步的原理了，genetor遇到yield会把任务丢出去，它就暂时不运行了。 我们知道，yield丢出去的是一个iterator，当调用next()的时候，会返回genetor中。 所以其实`co`就是一个自动触发和调度`next()`的函数。

## 实现co
知道了原理，我们自己来实现这个过程。然后就会比较清除整个过程了。

我们把函数改一下
```javascript
run(function *() {
    const url = 'http://jasonplacerholder.typecoder.com/posts/1';
    const response = yield fetch(url);
    const post = yield response.json();
    const title = post.title;
    console.log('Title: ',title);
})

function run(generator) {
    const iterator = generator(); //genetor执行会返回一个iterator，然后调用next()才会执行到下一个yield
    iterator.next(); //这里打印出来的结果看一下是{value: Promise {<pending>},done:false}

}
```
解释： 就如上面genetor和outer的对话，遇到yield，genetor会说:"我不知道怎么搞这个promise,你来搞吧，给你..“ 于是，外面的就会接住这个promise

我们继续写
```javascript
function run(generator) {
    const iterator = generator(); //genetor执行会返回一个iterator，然后调用next()才会执行到下一个yield
    const iteration = iterator.next(); //这里打印出来的结果看一下是{value: Promise {<pending>},done:false}
    const promise = iteration.value;
    promise.then(x => iterator.next(x)) //ok，外部帮忙处理了promise，然后处理的结果，我们需要返回genetor，使其继续运行
    //这个时候，genetor中的response拿到了值，就等于这里的x
}
```
分析到这里，程序已经得到了response。 但是，下一句，立马又遇到了response.json()，同样又会丢出去一个内容，因此，我们这里再处理一下，如下：
```javascript
function run(generator) {
    const iterator = generator(); //genetor执行会返回一个iterator，然后调用next()才会执行到下一个yield
    const iteration = iterator.next(); //这里打印出来的结果看一下是{value: Promise {<pending>},done:false}
    const promise = iteration.value;
    promise.then(x => {
        const anotherIterator = iterator.next(x);//注意,iterator.next()的含义，一方面会将运算结果返回，另一方面，genetor会继续将下一个yield的任务抛出，仍然是一个iterator
        const anotherPromise = anotherIterator.value;
        anotherPromise.then(post => iterator.next(post))
        //到此，因为iterator再也没有yield，所以不会再次返回iterator了，也不用调用next()
    }) 
}
```
至此，模拟的`co`方法已经实现了。

流程如下:
1. run传入一个genetor并运行，获得一个iterator(generator())
2. 调用next()方法，获取到iteration,iteration的value是`yield fetch(url)`的结果，也即一个Promise。
3. yield返回出的任务，由外部执行和处理，结束后在返回,于是使用then方法。
4. 处理后的结果为`x`，调用`iterator.next(x)`把x返回的同时，拿到了下一个`yield`的抛出的任务。
5. 处理任务，得到`post`，并通过`next(post)`返回给genetor。
6. 嗯，我拿到你们处理的结果了，下一次我遇到`yield`还给你们，反正我不会，我也不会学，这任务都是你们的。

也就是说，genetor的异步，就在于能将线程弹出，遇到`yield`后，交出线程。所以，我们做一个能够自动执行和触发`genetor`的执行器，就可以实现异步编程，而且看起来和同步的写法很相似。 这就是库`co`做的事情。

### 完善我们自己的`co`
刚才只有两个`yield`，我们希望方法有通用性，我们写个递归，让它能不断的触发
```javascript
function run(genetor) {
    const iterator = genetor();
    function autoRun(iteration) {
        if(iteration.done) {return iteration.value;}
        const anotherPromise = iteration.value;
        anotherPromise.then(x => {
            return autoRun(iterator.next(x));
        })
    }
    return autoRun(iterator.next());
}

```

好了，这样就完成了我们自己的简易版co函数。