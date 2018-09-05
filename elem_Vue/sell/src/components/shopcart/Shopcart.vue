<template>
    <div class="bannerRooter">
        <div class="bannerWrapper">
            <div class="mContent" @click="toggleList">
                <div class="leftContent">
                    <div class="cartLogo">
                        <div class="logo" :class="{hasContent:getCount > 0}">
                            <i class="icon icon-shopping_cart"></i>
                        </div>
                    </div>
                    <div class="num" v-show="getCount > 0">{{getCount}}</div>
                    <div class="totalPrice">￥{{getTotalPrice}}元</div>
                    <div class="disc">另需配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="rightContent" :class="{goal: isGotoDelivery === '去结算'}" @click.stop.prevent="pay">
                    <span class="pricStart">{{isGotoDelivery}}</span>
                </div>
            </div>
            <transition-group name="drop" tag="div" class="ball-content"
                v-on:before-enter="beforeEnter"
                v-on:enter="dropEnter"
                v-on:after-enter="afterEnter"
            >
                <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
                    <div class="inner inner-hook"></div>
                </div>
            </transition-group>
            <transition name="list-trans" mode="in-out">
                <div class="cartList" v-show="true" :class="{listAnimate:showList}">
                    <div class="cartHead">
                        <h1 class="listTitle">购物车</h1>
                        <span class="empty" @click="clearCart">清空</span>
                    </div>
                    <div class="cartListContent">
                        <ul class="goodList">
                            <li v-for="(item,index) in selectedGoods" :key="index" class="list-item">
                                <span class="list-name">{{item.name}}</span>
                                <span class="list-price">￥{{item.count * item.price}}</span>
                                <v-cartcontrol :food="item" class="vControl"/>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="mask">
            <div class="listMask" v-show="showList" @click="toggleList"></div>
        </transition>
    </div>
</template>

<script>
/* eslint space-before-function-paren: ["error", "never"] */
import cartControl from '../cartcontrol/Control'
import Bscroll from 'better-scroll'
export default {
    data() {
        return {
            balls: [{
                show: false
            }, {
                show: false
            }, {
                show: false
            }, {
                show: false
            }, {
                show: false
            }
            ],
            dropBall: [],
            fold: true
        }
    },
    methods: {
        _drop(el) {
            for (let i = 0; i < this.balls.length; i++) {
                let ball = this.balls[i]
                if (!ball.show) {
                    ball.show = true
                    ball.el = el
                    this.dropBall.push(ball)
                    return
                }
            }
        },
        beforeEnter(el, done) {
            let count = this.balls.length
            while (count--) {
                let ball = this.balls[count]
                if (ball.show) {
                    let rect = ball.el.getBoundingClientRect()
                    let x = rect.left - 32
                    let y = -(window.innerHeight - rect.top - 22)
                    el.style.webkitTransform = `translate3d(0,${y}px,0)`
                    el.style.transform = `translate3d(0,${y}px,0)`
                    let inner = el.getElementsByClassName('inner-hook')[0]
                    inner.style.webkitTransform = `translate3d(${x}px,0,0)`
                    inner.style.transform = `translate3d(${x}px,0,0)`
                }
            }
        },
        clearCart() {
            this.selectedGoods.forEach(food => {
                food.count = 0
            })
        },
        dropEnter(el, done) {
            /* eslint-disable no-unused-vars */
            this.$nextTick(() => {
                el.style.webkitTransform = 'translate3d(0,0,0)'
                el.style.transform = 'translate3d(0,0,0)'
                let inner = el.getElementsByClassName('inner-hook')[0]
                inner.style.webkitTransform = 'translate3d(0,0,0)'
                inner.style.transform = 'translate3d(0,0,0)'
                el.addEventListener('transitionend', done)
            })
        },
        afterEnter(el, done) {
            let ball = this.dropBall.shift()
            if (ball.show) {
                ball.show = false
                el.style.display = 'none'
            }
        },
        toggleList() {
            this.fold = !this.fold
        },
        pay() {
            if (this.getTotalPrice < 20) {
                return
            }
            alert(`支付${this.getTotalPrice}元`)
        }
    },
    components: {
        'v-cartcontrol': cartControl
    },
    props: {
        'delivery-price': {
            type: Number,
            default: 0
        },
        'min-price': {
            type: Number,
            default: 0
        },
        'selected-goods': {
            type: Array,
            default() {
                return []
            }
        }
    },
    computed: {
        getTotalPrice() {
            let price = 0
            this.selectedGoods.forEach(item => {
                price += item.price * item.count
            })
            return price
        },
        getCount() {
            let count = 0
            this.selectedGoods.forEach(item => {
                count += item.count
            })
            return count
        },
        isGotoDelivery() {
            let price = 0
            this.selectedGoods.forEach(item => {
                price += item.price * item.count
            })
            if (price === 0) {
                return this.minPrice + `起送`
            } else if (price < 20) {
                return '还差￥' + (this.minPrice - price) + '起送'
            } else {
                return '去结算'
            }
        },
        showList() {
            if (!this.getCount) {
                return false
            }
            let show = !this.fold
            return show
        }
    },
    watch: {
        fold() {
            if (!this.fold) {
                if (!this.contentScroll) {
                    this.$nextTick(() => {
                        this.contentScroll = new Bscroll('.cartListContent', {
                        click: true
                    })
                    })
                } else {
                    this.contentScroll.refresh()
                }
            }
        }
    }
}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin.styl'
.bannerWrapper
    display: flex
    position: fixed
    bottom: 0
    left: 0
    z-index: 1
    height: 3rem
    width: 100%
    background-color: #141d27
    font-size: 0
    .mContent
        display: flex
        width: 100%
        .leftContent
            flex: 1
            background-color: #2b333b
            .cartLogo
                display: inline-block
                height: 3.5rem
                width: 3.5rem
                margin: 0 12px
                border-radius: 50%
                background-color: #141d27;
                position: relative
                top: -10px
                .logo
                    display: inline-block
                    border-radius: 50%
                    height: 2.75rem
                    width: 2.75rem
                    position: relative
                    top: .375rem
                    left: .375rem
                    background-color: #2b343c
                    text-align: center
                    &.hasContent
                        background-color: rgb(0,160,220)
                        .icon
                            color:#fff
                    .icon
                        display: inline-block
                        font-size: 1.5rem
                        color: rgba(255,255,255,0.4)
                        line-height: 2.75rem
            .num
                width: 1.5rem
                position: absolute
                left: 2.75rem
                top: -10px
                box-sizing: border-box
                border-radius: .375rem
                background-color: rgb(240,20,20)
                font-size: 9px
                font-weight: 700
                text-align: center
                color: #ffffff
                line-height: 1rem

            .totalPrice
                display: inline-block
                box-sizing: border-box
                padding-right: .75rem
                margin-top: .75rem
                border-right: 1px solid rgba(255,255,255,0.1)
                color: rgba(255,255,255,0.4)
                font-size: 1rem
                font-weight: 700
                line-height: 24px
                vertical-align: top
            .disc
                display: inline-block
                box-sizing: border-box
                padding-left: .75rem
                margin-top: .75rem
                color: rgba(255,255,255,0.4)
                font-size: 12px
                font-weight: 200
                line-height: 24px
                vertical-align: top
        .rightContent
            flex: 0 0 6.5625rem
            background-color: #2b333b
            text-align: center
            &.goal
                background-color: #00b43c
                .pricStart
                    color: #ffffff
            .pricStart
                display: inline-block
                margin: 0 auto
                font-size: .75rem
                color: rgba(255,255,255,0.4)
                font-weight: 700
                line-height: 3rem
    .ball-content
        .ball
            position: fixed
            left: 2rem
            bottom: 1.375rem
            z-index 99
            .inner
                height: 1rem
                width: 1rem
                border-radius: 50%
                background-color: rgb(0,160,220)
                transition: all 0.4s
        .drop-enter-active
            transition: all 0.4s cubic-bezier(.58,-0.42,.9,.55)
    .listAnimate
        transform:translateY(-100%)
    .cartList
        position: absolute
        top: 0
        left: 0
        width: 100%
        z-index: -1
        transition: all 0.8s
        .cartHead
            height: 2.5rem
            background-color: #f3f5f7
            border-1px(rgba(7,17,27,0.1))
            line-height: 2.5rem
            padding: 0 1.125rem
            .listTitle
                float: left
                font-size: .875rem
                font-weight: 200
                color: #000
            .empty
                float: right
                font-size: .75rem
                font-weight: 500
                color: rgb(0,160,220)
        .cartListContent
            max-height: 13.5625rem
            padding: 0 1.125rem
            overflow: hidden
            background-color: #ffffff
            .list-item
                position: relative
                height: 3rem
                width: 100%
                border-1px(rgba(7,17,27,0.1))
                font-size: 0
                .list-name
                    display: inline-block
                    padding: .75rem 0
                    font-size: .875rem
                    line-height: 1.5rem
                    color: rgb(7,17,27)
                .list-price
                    display: inline-block
                    position: absolute
                    right: 5.625rem
                    padding: .75rem 0
                    line-height: 1.5rem
                    color: red
                    font-size: .875rem
                    font-weight: 700
                .controlWrapper
                    position: absolute
                    right: 0
                    bottom: .75rem
.listMask
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(7,17,27,0.6)
    z-index: 0
.mask-enter-active, .mask-leave-active
    transition: all 1s
.mask-enter, .mask-leave-to
    opacity: 0
</style>
