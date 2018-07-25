# 今日笔记

## Ajax && Jsonp跨域
### Ajax
#### 通过Jquery或者axios发送Ajax请求
```javascript
//jquery
$.get('//discovery.vip.com',{
    'click':3,
    'name':'job'
},(data) => {
    console.log(data);
})

//  $.get() 与 $.post()基本一致，第一个参数url，第二个参数是数据(可选)
//  第三个参数是回调函数

//axios 与juqery很相似，只不过它是支持Promise的一种方法
axios.get('//discovery.vip.com').then((data)=>{
    console.log(data);
}).catch(error) {
    console.log(error);
}

//可选请求
axios.get('//discovery.vip.com',{
    params:{
        id:12345
    }
}).then((data)=>{
    console.log(data);
}).catch(err => {
    console.log(err);
})

```
#### 原生Ajax方法
原生Ajax是建立在XMLHttpRequest请求上，这个现代浏览器支持，不支持的话，得使用ActiveX对象
new一个对象
```javascript
if(window.XMLHttpRequest) {
    var Req = new XMLHttpRequest();
}else {
    var Req = new ActiveX('Microsoft.XMLHTTP');
}
```
对象建立好之后，即使发送请求了`open()`和`send()`
其中`open`规定格式，`send()`正式发送
```javascript
//get方法
//get方法，send不需要加内容，open的第三个参数表示是否异步，默认为true
Req.open('get','//discovery.vip.com',true);
Req.onreadystatechange = function() {
    if(Req.readyState === 4 && Req.status === 200) {
        document.getElementById('root').innerHtml = Req.responseText;
    }
}
Req.send();

//post
Req.open('post','//discovery.vip.com',true);
Req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
Req.onreadystatechange = function() {
    if(Req.readyState === 4 && Req.status === 200) {
        document.getElementById('root').innerHtml = Req.responseText;
    }
}
Req.send("fname=Henry&lname=Ford");
```
注意这里post的方法设置了请求头，这里对请求头简单说一下
1. `Content-type,application/x-www-form-urlencoded` 的方式

这种方式最常见的方式，原生form表单的提交方式。 提交的时候，将会以`key1=value&key2=value&key3=value`的方式进行编码

2. `multipart/form-data`

这个看起来也是比较熟悉的，因为的确也很常见呀~
当要使用文件上传组件时，必须让form的entyped的值等于这个

3. `application/json`格式

这个就是json的格式，用来告诉服务器消息主体是序列化后的JSON字符串

### 跨域
跨域最简单、干净的方式，应该是W3C规定的CROS跨域了。
这个在使用fidder进行抓包调试的时候，使用filter来处理跨域的问题，算是很方便了。

方法就是在返回数据上加个头 `set Response header`

`Access-Control-Allow-Origin,*` 这个表示允许任意域名跨域

`Access-Control-Allow-Origin,192.168.1.110:8080`允许指定域名跨域

当然这个不是重点，下面主要说一下Jsop的跨域
#### Jsonp
Jsonp跨域也是需要后端服务器配合的，原来就是虽然Ajax请求不允许跨域，但是`<script>、<img>`等是可以跨域的

```javascript
//jquery封装的跨域

$.ajax({
    url:'//discovery.vip.com',
    method: 'GET',
    dataType: 'jsonp',
    success: function (data) {
        var result = JSON.stringify(data);
        $('#test').val(result);
    }

})

```
**注意：JSONP的一个限制，就是只能使用`get`请求，因为`<script src>`就支持`get `请求呀。**

好了，以上的方法会返回一个随机的函数名，Jquery内部处理得到。如果想要自己规定，也是可以的
```javascript
$.ajax({
    url:'//discovery.vip.com',
    method:'GET',
    dataType:'jsonp',
    jsonpCallback:'showData',
    success:function(data) {
        console.log('success')
    }
})

function showData(data) {
    var result = JSON.stringify(data);
    $("#test").val(result);
}
```
这里就可以看的更清楚一些了，其实返回的数据是`showData({...})`。 因为我们设置了函数，所以就直接执行函数。

就是因为这样的道理，我们完全可以自己做一个script标签，动态添加src来请求数据，实现自己的`jsonp`。

## 算法

### 统计数字

问题描述
>计算数字k在0到n中的出现的次数，k可能是0~9的一个值

例如n=12，k=1，在 [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]，我们发现1出现了5次 (1, 10, 11, 12)

解析：
最简单的方法就是遍历了，当然高级方法这里不探讨。那么简单的遍历又有什么问题呢？ 那就是遇到了比如`111`这样的数字。

我们可以使用`indexOf`来判断是否出现过，但是出现了多少次该怎么判断？

说一个思路，使用`split`方法，具体实现如下
```javascript
const digitCounts = function (k, n) {
    let num = 0;
    for(let i = 0; i<=n;i++){
        if(String(i).indexOf(k) !== -1) {
            num += (String(i).split(k).length-1)
        }
    }
    return num
}
```
[题目地址(lintcode)](https://www.lintcode.com/problem/digit-counts/description)

### 快速排序和二分查找
一般的排序，使用`Array.sort()`可以很方便的解决，所以对于前端来说，主要掌握快排和二分查找是基础和必要的。其他的可以有兴趣再研究好了
#### 快排
只用递归实现，基本思路：
1. 拿出一个数字；
2. 逐一和剩下数字比较，比这个数字小的放左边，大的放右边
3. 对左边和右边再使用同样的比较方法
4. 直到比较结束

代码实现如下：
```javascript  
function quickSort(arr) {
    if(arr.length <= 1) {
        return arr;
    }
    let left = [];
    let right = [];
    let cur = arr.splice(0,1);
    for(let i = 0; i<arr.length; i++) {
        if(arr[i] < cur) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }
    return quickSort(left).concat(cur,quickSort(right));
}

```

### 二分查找
原理很简单了，就是找中间数，复杂度(log(N))，前提是必须在有序数列中查找
1. 在一个范围内，将target与中间值比较
2. 如果大了，在大的范围进行查找；如果小了，在小的范围查找；
3. 重复上面的方法

用两种方法，一种是循环，一种是递归来实现
```javascript
//循环实现
function binarySearch(arr,target) {
    let low = 0;
    let high = arr.length - 1;
    while(low <= high) {
        let mid = parseInt((high+low)/2);
        if(target === arr[mid]) {
            return `找到了${target},位置在${mid}`
        } else if (target > Math.floor(high/2)) {
            low = mid+1;
        } else {
            high = mid-1;
        }
    }
    return false;
}
```
这里需要注意`low` `high`的取值和变化
1. 中间值的取法`parseInt((high+low)/2)
2. 当在另一个区间的时候，不能用`low = mid`或`high=mid`，因为这样边界值就会进入死循环。

```javascript
//递归的方法
function binarySearch(arr,target,low,high) {
    let mid = parseInt((low+high)/2);
    if(arr[mid] === target) {
        return `找到了${target},位置在${mid}`
    } else if(target > arr[mid]) {
        return binarySearch(arr,target,mid+1,high)
    } else {
        return binarySearch(arr,target,low,high-1)
    }
    return -1
}
```
#### 二分查找真题，寻找二维数组内的值
> 在一个二维数组中，每一行都按照从左到右递增，每一列都从上到下递增的顺序排序，完成一个函数，输入这个二维数组和一个整数，判断数组中是否含有该整数

思路是一样的，只不过从一维变成了二维，我们遍历思路可以这样子：
1. 选取第一行的最后一个进行判断(这个是第一行中最大的)
2. 如果目标大于该值，行数加1，遍历第二行(因为每列都是递增的)
3. 如果目标小于该值，则在这一行中进行查找
4. 循环以上步骤
```javascript
function findTarget(arr,target) {
    let i = 0; 
    let j = arr[i].length -1;
    while(i < arr.length && j>=0) { //i是只增不减的，j是只减不增的，就是从矩阵右上角向下查找的过程
        if(target < arr[i][j]) {
            j--;
        } else if (target > arr[i][j]) {
            i++;
        } else {
            return `找到了，位置在${i},${j}`
        }
    }
    return `(${i},${j})`
}

arr=[
[1,2,3,4],
[5,9,10,11],
[13,20,21,23]]  //测试
```