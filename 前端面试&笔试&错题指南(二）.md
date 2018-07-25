## 前端面试&笔试&错题指南（二）

### JavaScript
#### 1. 数组的神奇变化
请问以下输出是什么
```JavaScript
var arr1 = "john".split('');
var arr2 = arr1.reverse();
var arr3 = "jones".split('');
arr2.push(arr3);
console.log("array 1: length=" + arr1.length + " last=" + arr1.slice(-1));
console.log("array 2: length=" + arr2.length + " last=" + arr2.slice(-1));
```
答案：
```JavaScript
"array 1: length=5 last=j,o,n,e,s"
"array 2: length=5 last=j,o,n,e,s"
```
是的，发现两个输出一样，先说这道题的核心，再好好想想吧
* (1) 数组不是简单数据类型(值类型),会保存在堆中(heap)中，当使用`var arr1 = arr2`赋值时，只是浅拷贝，拿到了`arr2`的引用，这样带来的问题就是，修改`arr1`的时候`arr2`也会收到影响。
* (2) `arr1.push(arr2)`，这就是为什么有一个函数叫`concat`，`push`会直接把整个数组push进去，而不会分开搞
搞清楚以上两点，这个题基本上就解开了。

#### 2.+ - 运算符之惑
以下程序输出是什么？
```JavaScript
console.log(1 +  "2" + "2");
console.log(1 +  +"2" + "2");
console.log(1 +  -"1" + "2");
console.log(+"1" +  "1" + "2");
console.log( "A" - "B" + "2");
console.log( "A" - "B" + 2);
```

答案：
```JavaScript
"122"
"32"
"02"
"112"
"NaN2"
NaN
```
嗯，核心是以下几点，自己再细细思考
* (1) `-` `+`会隐式转换为`Number`类型
* (2) 当`+` 作为运算符出现在`String`类型前时，会认为需要字符串拼接，因此会隐式转换为`String`
* (3) `Number`包含一个特殊的类型NaN,当对非数字进行Number转换时，会变为这个。

**第一题**： 第二条，认为需要字符串拼接 1被转换为`1`，答案`122`
**第二题**： 注意到第二个`2`前面的`+`号，是符合第一条的，因此第二个`2`被转换为Number类型，答案为`32`
**第三题**： 同理，答案`02`
**第五题**： 运用(1)(3)，显然是`NaN2`，第六题同理

#### 3.堆栈溢出之谜
下面的代码将会造成栈溢出，请问如何优化，不改变原有逻辑
```JavaScript
var list = readHugeList();

var nextListItem = function() {
    var item = list.pop();

    if (item) {
        // process the list item...
        nextListItem();
    }
};
```
答案：
```JavaScript
var nextListItem = function() {
    var item = list.pop();

    if (item) {
        // process the list item...
        setTimeout(nextListItem,0}
};
```
首先必须搞清楚，堆栈溢出的原因。

在JS中，不小心的操作或者编程习惯，很容易造成堆栈溢出，特别是进行回调或者循环的时候。 引用以下来说明溢出的原因：
> 原因是每次执行代码时，都会分配一定尺寸的栈空间（Windows系统中为1M），每次方法调用时都会在栈里储存一定信息（如参数、局部变量、返回值等等），这些信息再少也会占用一定空间，成千上万个此类空间累积起来，自然就超过线程的栈空间了。那么如何解决此类问题？

这里介绍两个思路解决此问题：
1. 异步
2. 闭包

显然，这里就是使用的第一种方法，闭包。为什么使用setTimeout就可以解决问题？我们看下与没用之前的差别。如果没有使用setTimeout，那么函数将在大数据前不断的回调，直到最后走到重点，最初的函数才运行结束，释放内存。 但是如果使用了`setTimeout`，我们知道它是异步的，即使设置了时间为0，它也允许先执行下面的内容，可以释放堆栈，从而避免堆栈溢出的问题。
换言之，加了`setTimeout`，nextListItem函数被压入**事件队列**，函数可以退出，因此每次会清空调用堆栈。

**闭包** 也是一样的道理，因为这道题要求不修改原有逻辑，第一种是最合适的答案，当然用闭包避免的方法就是返回出来一个函数
```JavaScript
var nextListItem = function() {
    var item = list.pop();

    if (item) {
        // process the list item...
        return nextListItem()
    }
};
```
当然，这样做会改变函数的调用方式，我们就需要不断的调用
`nextListItem()()()`
为了处理这个办法，可以对其进行进一步的封装
```JavaScript
var nextListItem = function() {
    var item = list.pop();

    if (item) {
        // process the list item...
        return nextListItem()
    }
};

function autoRun(fun) {
    var value = nextListItem();
    while(typeof value === 'function') {
        value = nextListItem()
    }
    return
}
```
这样，就解决堆栈溢出的问题。
这里闭包的思路来源与[堆栈溢出解决方案](http://www.zuojj.com/archives/1115.html)

#### 4.你真的懂对象(Object)的key吗？
下面函数的输出是什么？
```JavaScript
var a={},
    b={key:'b'},
    c={key:'c'};

a[b]=123;
a[c]=456;

console.log(a[b]);
```
答案：
输出是这样的`456`，不是`123`，至少我有有点以外...

原因是什么呢？ 这里了解ES6新的数据类型map的应该就会意识到了，没错，对象的key值是只允许`String`类型的，这也是为什么引入了map数据类型了。 好了，那如果把一个对象作为key值，就会调用`toString`方法了。

`Object.prototype.toString(obj)`会得到什么呢？没错`[object Object]。 那所以
```
a[b] ==> a["[object Object"] = 123;
a[b] ==> a["[object Object"] = 456;
```
答案，显而易见

#### 5.回文判断
请做一个回文判断的函数，判断是否是回文

答案： 这是一个很简单、很常规的方法。链表是最好的判断回文的方法，当然得益于JS数组的灵活方法，可以更容易实现。 

这里主要考虑了一个健壮性的问题,多了一个正则来检测：
```JavaScript
function check(str) {
    str = str.replace(/\W/g,'').toLowerCase();
    return str === str.split('').reverse().join()
}
```
