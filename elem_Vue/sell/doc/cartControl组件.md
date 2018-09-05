# 购物车及control组件 
![购物车详情页](https://github.com/forrany/elem_Vue/blob/master/sell/resource/%E5%A4%96%E5%8D%9601_%E5%95%86%E5%93%81%E9%A1%B5.jpg)
## 购物车开发
### Prop参数传递
购物车是一个通用组件，在各个页面都在，因此其很多状态依靠其父组件传递。这里涉及到两级传递

注意，实际router也是可以传递props参数的。像组件一样进行传递即可
```
router(prop:seller)--goods(prop:seller.deliveryPrice)--shopcart
```

注意prop的问题
>HTML 中的特性名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符。这意味着当你使用 DOM 中的模板时，camelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名：
html中是`delivery-price`,组件中使用是`deliveryPrice`

另外，养成良好的变成习惯，props设置类型和默认值
```javascript
props: {
    deliveryPrice: {
        type: Number,
        default: 0
    }
}
```
这里需要注意一点，如果props是数组或者对象，则默认就得是一个函数了，如下：
```javascript
props: {
    selectGoods: {
        type: Array,
        default() {
            return []
        }
    }
}

```
## control样式相关
control组件是附着在每一个li上的“＋－按钮”,用以进行交互的。其中包括购物车添加、动画效果等。先说样式相关的问题：

根据需求，可以看到`control`组件主要是为购物车添加、删除而制作的，且在多处复用。

从样式可以很简单的分成三个部分
```html
<div class="minus"> </div>
<div class="content"> </div>
<div class="plus"> </div>
```
横向排列，只需要使用`display:inline-block`即可

这里简单说下样式的几个注意点：
- inline-block，会有inline的特性，注意设置`text-align:center`来使其水平居中
- 使用`verticle-align:top`使其上对其
- `line-height`设置一致来配合`verticle-align`实现居中对齐

## vue相关/逻辑设计

`control`组件是嵌入在`food-item`之中的，而购物车`showcart`又需要传入`selected-good`来实现结账逻辑。
所以，这里在遍历`food-item`的时候，把每一个`food`信息和状态传入`contorl`。

`control`要能够改变food的状态，渲染自己的UI

### 传入food
遍历`foot-item`的时候，就会得到food，然后通过`<cartControl :food="food"/>`传入food

在组件中，增加商品的逻辑如下
```javascript
if(!this.food.count){
    this.food.count = 0;
}else {
    this.food.count++
}
```
也就是，第一次传入时，是没有count选项的，因此只需要设置，如果有了，就++。

**但是，如果这样写，不会触发渲染。**
> 如果需要增加和更改属性，并希望UI渲染，必须使用VUE中规定的'特殊方法'

```javascript   
import Vue from 'vue'
if(!this.food.count){
    Vue.set(this.food, 'count', 1)
}else {
    this.food.count++
}
```
这样，通过set增加属性，就可以被vue检测到 ，进行动态的UI更新了。

## 与购物车组件的联动
组件的动态联动和控制，主要通过`selected-goods`实现。 

`control`与`shopcart`的共同父组件是`Goods`，该组件会向购物车绑定`selected-goods`，因此这里写一个计算方法
```javascript   
computed: {
    selectedGoods() {
        let returnGoods = [];
        this.goods.forEach( good => {
            good.foods.forEach( food => {
                if(food.count > 0) {
                    returnGoods.push({
                        'price': food.price,
                        'count': food.count
                    })
                }
            });
        });
    }
}
```
至此，就可以实现联动了。
## 简单的动画效果
关于vue的动画效果，主要参考vue官方文档。这里简单做一个总结：
- v-enter 是最开始的状态，可以理解为动画开始的状态
- v-enter-active 经过最开始状态后，就开始动画激活的状态
- v-leave-active 这是关闭、结束动画之前的状态
- v-leave-to 这是最后动画完毕的状态

因此，一般如果是一个具有往复效果的过渡，会把`v-enter-active`与`v-leave-active`写在一起，都是动画的过程，或者是动画结束后的状态。

而`v-enter`与`v-leave-to`是动画还没开始的，初始状态，可以写在一起

## 掉落动画的实现
![动画效果](https://img-blog.csdn.net/20180525182156258)

在vue2.0中，对于这部分动画的实现由比较大的不同和差异。
先说实现方式：
1. 点击“＋”,触发事件(control组件)，记录当前的位置(left, top)，传出当前元素句柄
2. 父组件(goods)组件v-on上面的事件，触发后，调用shopcart组件的drop方法
3. shopcart组件的drop方法定义了相关的动画，进行处理。

由于vue2.0中，没有了`$dispatch`和`$broadcast`,这里需要使用新的方法。
### 动作、方法在父子组件之间的传递
要实现上面的传递，父组件(goods)是核心和中介，第一步定义`goods`组件中的方法cartAdd
```javascript
//goods 组件
...
methods: {
    cartAdd(el) : {
        this.$refs.shopcart._drop(el);
    }
}
```
注意，这里就是简单的调用子组件的方法。
> `$refs`如果指向dom，则选择dom； 如果是组件，则可以获取组件实例,自然包含其上的属性和方法

接下来，在`control`组件中，触发父组件的方法`cartAdd`
```javascript
//control 组件
methods: {
    addItem: {
        ...
        let el = document.getElementById('')
        this.$emit('cartAdd',event.target)
    }
}
```
注意这个event.target可以说是很妙了。 使用`$emit`触发，第二个为传入的参数。

第三步，当然就是在cartshop中定义drop方法了。
### drop方法实现动画效果的关键
`<transition>`是不可以嵌套的，如果有多个组件，就要用`<transition-grop>`

html结构如下
```html
<transition-grop name= "drop" tag="div"
v-on:before-enter="beforeEnter"
v-on:enter="dropEnter"
v-on:after-enter="afterEnter"
>
<div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
    <div class="inner inner-hook"></div>
</div>
</transitioin-grop>
```
注意几点：
* `transition-grop`默认是span包裹，因为里面有`<div>`标签，因此，必须修改`tag="div"`
* `v-on：before-enter="beforeEnter"`这几个是关键，分别绑定了动画开始前、动画和结束的状态。这里详细参考文档
* `inner-hook`只为标记和dom选取

当然，使用了js钩子，css样式也要支持。这里的样式结构如下：
```stylus
.ball-content
    .ball
        position: fixed
        left: 2rem
        bottom: 1.375rem
        z-index 99
        background-color: red
        .inner
            height: 1rem
            width: 1rem
            border-radius: 50%
            background-color: rgb(0,160,220)
            transition: all 0.4s    
    .drop-enter-active
        transition: all 0.4s cubic-bezier(.58,-0.42,.9,.55)   
```
这里主要是对动画的过渡的一个设置:
- 多种transition过渡动画，往往套路是内外两层来层或多层来实现，每一层实现不同的transition
- wrapper和inner 两层动画实际上各自独立进行，同时又因为父容器包裹inner ，所以inner的垂直变化受父容器的曲线函数影响，产生小球的抛物线效果，从background-color:red上 可以很明显看出；

接下来，通过js来实现这个小球动画
```javascript  
//_drop触发小球遍历，激活小球 
methods: {
    _drop(el) {
        for(let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            if(!ball.show) {
                ball.show = true;
                ball.el = el;
                this.dropBall.push(ball);
                return;
            }
        }
    },
    beforeEnter(el,done): {
        let count = this.balls.length;
        while(count--) {
            let ball = this.balls[count];
            if(ball.show) {
                let rect = ball.el.getBoundingClientRect();
                let x = rect.left - 32;
                let y = -(window.offsetHeight - rect.top - 22);
                el.style.webkitTransform = `translate3d(0,${y},0)`;
                el.style.transform = `translate3d(0,${y},0)`;
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = `translate3d(${x},0,0)`;
                inner.style.transform = `translate3d(${x},0,0)`;
            }
        }
    },
    enter(el,done): {
        el.style.webkitTransform = 'translate3d(0,0,0)';
        el.style.transform = 'translate3d(0,0,0)';
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.webkitTransform = 'translate3d(0,0,0)';
        inner.style.transform = 'translate3d(0,0,0)';
        el.addEventListener('transitionend',done);
    },
    afterEnter(el,done): {
        let ball = this.dropBalls.shift();
        if (ball.show) {
            ball.show = false
        }
    }
}
```
**注意事项：**
1. `enter`中的`el.addEventListrener('transitionend',done)`是必须的，否则之后的`afterEnter`将不会被触发，这样子小球就无法重复利用
2. `afterEvent`比较神奇在于，我们将dropBalls中元素的show属性设置为false，也就将balls中项目的属性设置为false了。因此可以进行复用

### 参考文献
[项目里的小球飞入动画](https://blog.csdn.net/elie_yang/article/details/80455379)

[废弃了events和`$dispatch`,改用`$emit`实现监听事件](https://blog.csdn.net/wangwangwanglichao/article/details/80088054)