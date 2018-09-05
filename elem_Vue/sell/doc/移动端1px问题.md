# 页面骨架分割与设计

<!-- TOC -->

- [页面骨架分割与设计](#)
    - [导航栏](#)
    - [移动端的1px问题](#1px)
        - [解决方案](#)

<!-- /TOC -->

根据之前的分析，整体项目通过vue-router，将content部分，根据导航的不同实现显示不同的内容。

以下是整个页面骨架和组件的预设计：
* header组件 包括头部的各个内容
* 导航栏 非组件，在`<app>`直接写好，注意要有路由的嵌入
* goods组件， 即导航为商品时的页面
* ratings组件， 即导航为评价时的页面
* seller组件， 即商家的页面

根据以上内容，整体骨架如下
```html
<template>
  <div id="app">
    <v-header :seller = "seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
      <router-view/>
  </div>
</template>
```
## 导航栏
根据骨架内容，可以看到，导航栏主要是有路由的作用，这里需要注意的是flex布局的应用

因为导航是3个部分的平均分割，使用flex布局可以非常好的实现，另一方面，在移动端不存在不兼容的问题。因此，可以放心的使用flex布局。

使用flex布局注意一点：**flex布局完全可以只是某一个组件甚至某个`div`使用，并不是整个页面甚至项目都要用这种布局。多种布局的配合，让页面结构更容易实现和整洁。**

先把布局的css（stylus)内容写上，如下：
```css
@import "./common/stylus/mixin.styl"
  #app
    .tab
      display flex
      width 100%
      height 2.5rem
      line-height 2.5rem
      border-1px(rgba(7,17,21,0.1))
      .tab-item
        flex 1
        text-align center
        a
          display block
          font-size .875rem
          color rgb(77,85,93)
          &.router-link-active
            color rgb(240,20,20)
```

首先，父级容器使用flex布局，设置相应的宽度(100%)和高度

子元素，设置flex为1，即占用1份，这样就可以均分，共3份。

其中`<a>`标签设置`display:block`，是为了实现，在点击空白处，也可以出发click，否则必须点击文字才能触发，影响使用体验。

具体的设计和代码可以直接查看源码，这里需要注意，在vue生命周期`created`中，调用了axios请求来请求后台数据，因为页面是根据数据渲染的，取到数据后，data的seller对象中，在之后包括goods等都会保存到相应的对象，只不过第一阶段，只考虑<header>组件即内容。以下为`script`的内容
```javascript
import header from './components/header/Header'
export default {
  data() {
    return {
      seller: {}
    }
  },
  name: 'App',
  components: {
    'v-header': header
  },
  created: function() {
    var that = this
    this.$http.get('/api/seller').then(function(response) {
      response = response.data
      if (response.errno === 0) {
        that.seller = response.data
        console.log(that.seller)
      }
    })
  }
}
```

## 移动端的1px问题
如果写代码时，写了1px，而在手机上查看，往往看起来是比1px粗的,因为实际上，移动端相对于pc，'px'的含义是不同的

在移动端，特别是高分辨率手机的显示上，设备物理像素与css像素是不同的，由此引出了devicePixelRatio的概念。 DPR表示两者的比值，一般有2和3。这样css中的`1px`可能在手机上就是`2px`或者`3px`

### 解决方案
这里采用使用查询dpr后，根据dpr比例进行缩放来解决。 在CSS属性有一个transform,可以使用`scaleY(x)`实现对物体进行y轴缩放x倍。

这里我们查询后，根据dpr进行相应的缩放即可

回到之前的css样式，注意这句话：
```stylus
border-1px(rgba(7,17,21,0.1))
```
这是一个stylus语法，之前引入了mixin，这是在mixin中定义的一个样式函数，具体内容如下：
```Stylus
border-1px($color)
    position: relative  
    &:after
        display: block
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        border-top: 1px solid $color
        content: ' '
```
函数留了一个颜色的传入接口，传入颜色后，可以实现实现改颜色的一个下边框。下边框通过伪元素`:after`实现

接下来，我们在通用样式中，对`class="border-1px"`的元素进行缩放
```stylus
body,html
    line-height: 1
    font-weight:  200
    font-style: 'PingFang SC','STHeitiSC-Light','Helvetica-Light','arial'

@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-radio:1.5)
    .border-1px
        &::after
            -webkit-transform: scaleY(0.7)
            transform: scaleY(0.7)

@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-radio:2)
    .border-1px
        &::after
            -webkit-transform: scaleY(0.5)
            transform: scaleY(0.5)
```

这里，说一下stylus的目录和技巧
目录包括以下文件
```
--index.styl  //索引，在main.js只引入一个即可
--mixin.styl   //mixin的样式，各种样式函数
--base.styl   //基本、通用样式
--icon.styl   //图标字体
```
