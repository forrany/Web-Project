<template>
    <div class="wrapper">
        <ul class="nav">
            <li v-for="(item,index) in goods" :key="index" class="nav-list">
                <span class="text border-1px">
                    <span v-show="item.type>0" class="icon" :class="mapClass[item.type]"></span>{{item.name}}
                </span>
            </li>
        </ul>
        <div class="foodsWrapper" ref="bsWrapper">
            <ul>
                <li v-for="(item,index) in goods" :key="index" class="food-list">
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
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
/* eslint space-before-function-paren: ["error", "never"] */
/* eslint semi: "error" */
import Bscroll from 'better-scroll';
const ERR_OK = 0;
export default{
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
            goods: []
        };
    },
    created() {
        this.mapClass = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        this.$http.get('/api/goods').then((response) => {
            response = response.data;
            console.log(response);
            if (response.errno === ERR_OK) {
                this.goods = response.data;
            }
        });
    },
    mounted() {
        this.$nextTick(() => {
            this.scroll = new Bscroll('.foodsWrapper', {});
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

</style>
