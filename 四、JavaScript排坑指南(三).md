# JavaScript排坑指南(三)

JavaScript总是给人以惊喜，学习不止，进步不断，今天继续补充JS容易搞错的几道笔试/面试题，为了秋招继续努力，欢迎一起为秋招努力的小伙伴共勉

--------------------------------------[前端系列传送门](https://github.com/forrany/Web-Project)-----------------------------------

[前端面试&笔试&错题指南(一)](https://github.com/forrany/Web-Project/blob/master/%E4%B8%80%E3%80%81%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%AF%95%26%E9%94%99%E9%A2%98%E6%8C%87%E5%8D%97.md)

[前端面试&笔试&错题指南（二）](https://github.com/forrany/Web-Project/blob/master/%E4%BA%8C%E3%80%81JavaScript%E6%8E%92%E5%9D%91%E6%8C%87%E5%8D%97(%E4%BA%8C).md)

[JavaScript排坑指南(三)](https://github.com/forrany/Web-Project/blob/master/%E5%9B%9B%E3%80%81JavaScript%E6%8E%92%E5%9D%91%E6%8C%87%E5%8D%97(%E4%B8%89).md)

##  ”老生常错“的this与作用域相关

### Q1. 下面程序的输出结果是？

```javascript
var length = 10;
function fn() {
	console.log(this.length);
}

var obj = {
  length: 5,
  method: function(fn) {
    fn();
    arguments[0]();
  }
};

obj.method(fn, 1);
```



output: 

```javascript
10
2
```

这个我做错在第二个输出上，其实对`this`了解后就知道，第一个输出`10`应该是很显然的：虽然在程序执行时，使用了`obj.method`方法，让this指向了`obj`，但是真正的函数执行在函数体内部，也即当`fn()`执行的时候，`this`是指向`window`的，所以第一次执行结果是10

那么这里第二次执行`arguments[0]`为什么结果是`2`？

分析下在`method(fn,1)`执行时，经历了什么： 首先两个参数`fn`和`1`会被放入`arguments`中，在`arguments`中第一个参数就是我们传入的函数；接下来`fn`执行，此时`this`没有绑定因此指向`window`，输出`10`。 然而到了`arguments[0]()`这一句，相当于把`arguments[0]`中的第一个参数拿来执行, 效果如下:

```javascript
arguments[0]()  //执行,等同于下面的
arguments.0() //当然这句话是不合法的，但是这样我们可以更清楚知道，this是指向arguments实例本身
```

`arguments.length`就是它本身的长度(arguments是一个类数组，具有length属性)，因此输出`2`

---

### Q2. try..catch程序的输出结果

```javascript
(function () {
    try {
        throw new Error();
    } catch (x) {
        var x = 1, y = 2;
        console.log(x);
    }
    console.log(x);
    console.log(y);
})();
```

输出结果:

```javascript
1
undefined
2
```

我们都知道`var`是在预编译阶段会有一个变量提升，这种类型很容易解决，但是当遇到在`catch(x)`中与已有变量重名的情况，一定要区分两者之间的关系。

用变量提升的方法，把程序重写并分析如下：

```javascript
(function () {
    var x,y;  // 外部变量提升
    try {
        throw new Error();
    } catch (x/* 内部的x */) {
		x = 1; //内部的x，和上面声明的x不是一回事！！
         y = 2; //内部没有声明，作用域链向上找，外面的y
        console.log(x); //当然是1
    }
    console.log(x);  //只声明，未赋值，undefined
    console.log(y);  //就是2了
})();
```

这样子就很清晰，之后注意预编译的过程，把变量和函数定义进行提升后，进行分析，会清楚很多

---

### Q3. 下面程序的输出

```javascript
var x = 21;
var girl = function () {
    console.log(x);
    var x = 20;
};
girl ();
```

输出：

```javascript
undefined
```

说实话，这个题目我没做错，我没做错，我没做错！

因为和Q2一样，而且还没有Q2难，一句话解释就是： 函数内部变量提升。 相当于

```javascript
var x = 21;
var girl = function() {
    var x;
    console.log(x); // undefined
    x = 20;
}
}
```



## 那些诡异的边角知识

### Q1.  运算符考点： 下面程序输出是什么?

```javascript
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

输出:

```javascript
true
flase
```

第一个输出结果是好理解的，主要看下第二个为什么是`false`

核心在于js怎么去解析`<`和`>`运算符。 在JS中，这种运算符是从左向右运算的，所以`3>2>1`就被转换成了`true>1`,而`true`的值是`1`，接着比较`1>1`就返回false了。

---

### Q2. typeof，下面输出结果是什么

```javascript
console.log(typeof typeof 1);
```

答案是`string`

会输出`string`，这个题目不仅仅是typeof的考察，也是对js运算的一个考察。 在js中一般有两种操作

* 赋值操作，例如`a = b` `2>3`之类的，上面的题目提到过，是从左向右的顺序
* 取值操作， js问内存：`有没有见过这个家伙？`，比如`console.log(a)` `typeof a` 都属于这个类型，是从右向左的

因此，这个题就被分解为`typeof 1`返回`"number"`，注意是一个字符串。 接下来`typeof "number"`，返回`string`

---

### Q3. `typeof undefined == typeof NULL `输出结果是什么

首先搞清楚两点：

* `typeof undefined` 输出是`undefined`
* `typeof null`输出是`object`

但是，另一方面，因为js对大小写敏感，`null ` ≠ `NULL`，所以``typeof NULL` 返回`undefined`

结果是： `true`

### Q4. 递归设计。 实现一个函数，给该函数一个DOM节点，函数访问其所有子元素(所有子元素，不仅仅是直接子元素)，每次访问子元素的时候，并为其传一个callback。

访问一个DOM tree，是一个经典的深度优先搜索的算法

```javascript
function Traverse(DOM,callback) {
    callback(DOM);
    var list = DOM.children;
    Array.prototype.forEach.apply(list,(item)=>{
        Traverse(item,callback); //递归
    })
}
```

