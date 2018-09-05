<template>
    <div class="wrapper">
        <div class="navWrapper">
            <ul class="nav">
            <li v-for="(item,index) in goods" :key="index" :class="{'current': currentIndex === index}" class="nav-list" @click="gotoFoods(index)">
                <span class="text border-1px">
                    <span v-show="item.type>0" class="icon" :class="mapClass[item.type]"></span>{{item.name}}
                </span>
            </li>
        </ul>
        </div>
        <div class="foodsWrapper" ref="bsWrapper">
            <ul>
                <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="(food,index) in item.foods" :key="index" class="food-item border-1px">
                            <div class="avatar">
                                <img :src="food.icon" width="57px">
                            </div>
                            <div class="content">
                                <h2 class="food-name">{{food.name}}</h2>
                                <p class="desc" v-show="food.description">{{food.description}}</p>
                                <div class="extra">
                                    <span>月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="curP">￥</span><span class="num">{{food.price}}</span><span class="oldP" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                            </div>
                            <v-cartcontrol :food="food" v-on:cartAdd="childCartAdd" ref="control"/>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <v-shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :selected-goods="selectedGoods" ref="shopcart"/>
    </div>
</template>
<script>
/* eslint space-before-function-paren: ["error", "never"] */
/* eslint semi: "error" */
import Bscroll from 'better-scroll';
import shopcart from '../shopcart/Shopcart';
import cartcontrol from '../cartcontrol/Control';

const ERR_OK = 0;
export default{
    props: {
        seller: {
            type: Object
        }
    },
    components: {
        'v-shopcart': shopcart,
        'v-cartcontrol': cartcontrol
    },
    data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0
        };
    },
    computed: {
        currentIndex() {
            for (let i = 0; i < this.listHeight.length - 1; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                if (this.scrollY >= height1 && this.scrollY < height2) {
                    return i;
                }
            }
        },
        selectedGoods() {
            let returnGood = [];
            this.goods.forEach(goodClass => {
                goodClass.foods.forEach(item => {
                    if (item.count > 0) {
                        returnGood.push(item);
                    }
                });
            });
            return returnGood;
        }
    },
    methods: {
        Bsinit() {
            this.$nextTick(() => {
                this.foodScroll = new Bscroll('.foodsWrapper', {
                    probeType: 3,
                    click: true
                });
                this.scrollNav = new Bscroll('.navWrapper', {
                    click: true
                });
                this.foodScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y));// 这里向下滑都是负数，希望得到的是正数
                });
            });
        },
        calculate_Hieght() {
            let curHeight = 0;
            let goodsList = this.$refs.bsWrapper.getElementsByClassName('food-list-hook');
            this.listHeight.push(curHeight);
            for (let i = 0; i < goodsList.length; i++) {
                curHeight += goodsList[i].clientHeight;
                this.listHeight.push(curHeight);
            }
        },
        gotoFoods(index) {
            let foodlist = this.$refs.bsWrapper.getElementsByClassName('food-list-hook');
            this.foodScroll.scrollToElement(foodlist[index], 300);
        },
        childCartAdd(el) {
            // 异步执行动画，提升使用体验
            this.$nextTick(() => {
                this.$refs.shopcart._drop(el);
            });
        }
    },
    mounted() {
        this.mapClass = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        this.$http.get('/api/goods').then((response) => {
            response = response.data;
            if (response.errno === ERR_OK) {
                this.goods = response.data;
                this.$nextTick(() => {
                    this.Bsinit();
                    this.calculate_Hieght();
                });
            }
        });
    }
};
</script>

<style lang="stylus">
    @import "../../common/stylus/mixin"
    .wrapper
        position: absolute
        top: 10.875rem
        bottom: 2.875rem
        display: flex
        width: 100%
        overflow: hidden
        .nav
            flex: 0 0 5rem
            width: 5rem
            background-color: #f3f5f7
            font-size: 0
            .nav-list
                display: table
                height: 3.375rem
                width: 3.5rem
                line-height: .875rem
                padding: 0 .75rem
                &.current
                    position: relative
                    margin-top: -1px
                    z-index: 99
                    background-color: #FFFFFF
                    font-weight: 700
                    .text
                        border-none()
                .text
                    display: table-cell
                    width: 3.5rem
                    vertical-align: middle
                    font-size: .75rem
                    line-height: .75rem
                    color: rgb(0,0,0)
                    font-weight: 200
                    border-1px(rgba(7,17,27,0.1))
                    .icon
                        display: inline-block
                        width: .75rem
                        height: .75rem
                        vertical-align: top
                        background-size: .75rem .75rem
                        background-repeat: no-repeat
                        &.decrease
                            bg-image('decrease_3')
                        &.special
                            bg-image('special_3')
                        &.discount
                            bg-image('discount_3')
                        &.guarantee
                            bg-image('guarantee_3')
        .foodsWrapper
            flex: 1
            background-color: #ffffff
            .title
                box-sizing: border-box
                height: 1.625rem
                width: 100%
                border-left: 2px solid #d9dde1
                padding-left: .875rem
                background-color: #f3f5f7
                line-height: 1.625rem
                font-size: .75rem
                color: rgb(147,153,159)
            .food-item
                margin: 1.125rem
                display: flex
                padding-bottom: 1.125rem
                border-1px(rgba(7,17,27,0.1))
                &:last-child
                    border-none()
                    padding: 0
                    .controlWrapper
                        bottom: 0
                .avatar
                    flex: 0 0 3.5625rem
                    margin-right: .625rem
                    img
                        border-radius: .25rem
                .content
                    font-size: 0
                    flex: 1
                    .food-name
                        font-size: .875rem
                        color: rgb(7,17,27)
                        line-height: .875rem
                        margin: .125rem 0 .5rem 0
                    .desc
                        display: inline-block
                        margin-bottom: .5rem
                        font-size: .625rem
                        line-height: .625rem
                        color: rgb(147,153,159)
                    .extra
                        font-size: .625rem
                        line-height: .625rem
                        color: rgb(147,153,159)
                        span
                            display: inline-block
                            margin-right: .75rem
                    .price
                        color: red
                        line-height: 1.5rem
                        .curP
                            font-size: .625rem
                            font-weight: normal
                        .num
                            font-size: .875rem
                            font-weight: 700
                        .oldP
                            margin-left: .5rem
                            font-size: .625rem
                            color: rgb(147,153,159)
                            font-weight: 700
                            vertical-align: top
                            text-decoration: line-through
                .controlWrapper
                    position: absolute
                    right: 0
                    bottom: 1.125rem

</style>
