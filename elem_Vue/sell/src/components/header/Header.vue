<template>
    <div class="header">
        <div class="content-wrapper" @click="showDetail">
            <img :src="seller.avatar" alt="avatar" id="avatar">
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="number" @click="showDetail">
                    <span v-if="seller.supports" class="count">{{seller.supports.length}}个</span>
                    <i class="icon-keyboard_arrow_right"></i>
                </div>
                <div class="deliver">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}} </span>
                </div>
            </div>
            <div class="background">
                <img :src="seller.avatar" width="100%" height="100%">
            </div>
        </div>
        <div class="notice-wrapper">
            <div class="notice">
                <span class="icon"></span><span class="text">{{seller.bulletin}}</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <transition name="fade">
            <div v-show="isDetail" class="flow">
                <div class="content">
                    <div class="sticker">
                        <div class="title">{{seller.name}}</div>
                        <v-stars :size="48" :score="seller.score"/>
                        <div class="split">
                            <div class="line"></div>
                            <div class="message">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul v-if="seller.supports" class="discont">
                            <li v-for="(item,index) in seller.supports" :key="index" class="supports-item">
                                <span class="icon" :class="classMap[item.type]"></span>
                                <span class="text">{{item.description}}</span>
                            </li>
                        </ul>
                        <div class="split">
                            <div class="line"></div>
                            <div class="message">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="inform">
                            {{seller.bulletin}}
                        </div>
                    </div>
                </div>
                <div class="footer" @click="closeDetail">
                    <span class="icon">
                        <i class="icon-close"></i>
                    </span>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
/* eslint-disable */
import star from "../stars/Star.vue"
export default {
    components:{
        "v-stars": star
    },
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
            isDetail:false
        }
    },
    computed:{
        score() {
            return parseInt(this.seller.score)
        }
    },
    methods:{
        showDetail(){
            this.isDetail = true
        },
        closeDetail(){
            this.isDetail = false
        }
    },
    created() {
        this.classMap = ['decrease','discount','special','invoice','guarantee']
        return
    }
}
</script>
<style lang="stylus">
    @import '../../common/stylus/mixin'
    .header
        background: rgba(7,17,27,0.5) 
        overflow: hidden
        position: relative
        width: 100%
        .content-wrapper
            padding: 1.5rem .75rem 1.125rem 1.5rem
            font-size: 0
            position relative
            #avatar
                width: 4rem
                height: 4rem
                border-radius: .125rem
                vertical-align: top
            .content
                display:inline-block
                background-color: "#FFFFFF"
                height: 100%
                margin-left: 1rem
                color: rgb(255,255,255)
                .title
                    margin: .125rem 0 .5rem 0
                    .brand
                        display: inline-block
                        vertical-align: top
                        width: 1.875rem
                        height: 1.125rem
                        bg-image('brand')
                        background-size: 1.875rem 1.125rem
                        background-repeat: no-repeat
                    .name
                        display: inline-block
                        margin-left: .375rem
                        font-size: 1rem
                        line-height: 1.125rem
                        font-weight: 600
                .number
                    position absolute 
                    height 1.5rem
                    right .75rem
                    bottom .875rem  
                    padding 0 .5rem
                    border-radius .875rem
                    background-color:rgba(0,0,0,0.2) 
                    text-align center        
                    .count
                        vertical-align top
                        font-size .75rem
                        line-height 1.5rem
                    .icon-keyboard_arrow_right
                        font-size .75rem
                        line-height 1.5rem
                        margin-left .125rem      
                .deliver
                    font-size: .75rem
                    line-height: .75rem
                    margin-bottom: .625rem
                .support
                    margin-bottom: .125rem
                    height .75rem
                    .icon
                        display inline-block
                        width: .75rem
                        height: .75rem
                        line-height: .75rem
                        background-size: .75rem .75rem
                        background-repeat: no-repeat
                        vertical-align: top
                        &.decrease
                            bg-image('decrease_1')
                        &.discount
                            bg-image('discount_1')
                        &.guarantee
                            bg-image('guarantee_1')
                        &.invoice
                            bg-image('invoice_1')
                        &.special
                            bg-image('special_1')
                    .text
                        display: inline-block
                        margin-left: .25rem
                        font-size: .625rem
                        line-height: .75rem
                        margin-top: .125rem
            .background
                position: absolute 
                top: 0
                left: 0
                z-index: -1
                width: 100%
                height: 8.375rem
                filter: blur(10px)
        .notice-wrapper
            height: 1.75rem
            position: relative
            background-color:rgba(7,17,27,0.2)
            .notice
                color: rgb(255,255,255)
                height: 1.75rem
                line-height 1.75rem
                padding 0 1.375rem 0 .75rem
                white-space nowrap  
                overflow hidden
                text-overflow ellipsis
                .icon
                    display: inline-block
                    width: 1.375rem
                    height: .75rem
                    line-height: 1.75rem
                    bg-image('bulletin')
                    background-size: 1.375rem .75rem
                    background-repeat: no-repeat
                    vertical-align: top
                    margin-top: .375rem
                .text
                    font-size: .625rem
                    margin: 0 .25rem
                    vertical-align: top
                    text-align: center
                .icon-keyboard_arrow_right
                    font-size: 0.625rem
                    line-height: 1.75rem
                    position: absolute 
                    right: .75rem
        .fade-enter-active, .fade-leave-active
            transition: opacity 0.5s
        .fade-enter, .fade-leave-to
            opacity: 0
        .flow
            position: fixed 
            left: 0
            top: 0
            height: 100%
            width:100%
            z-index: 100
            background-color: rgba(7,17,27,0.8)
            overflow: auto
            .content
                width: 100%
                min-height: 100%
                .sticker
                    padding-bottom: 4rem
                    text-align: center
                    .title
                        padding: 4rem 0 1rem 0
                        font-size: 1rem
                        font-weight: 700
                        color: rgb(255,255,255)
                        line-height: 1rem
                    .split
                        width: 80%
                        margin: 1.75rem auto auto 2.25rem
                        display: flex
                        .line
                            border-bottom: 1px solid rgba(255,255,255,0.2)
                            flex: 1
                            position: relative
                            top: -0.375rem
                            width: 7rem
                        .message
                            margin: 0 .75rem
                            color: #ffffff
                            font-size: .875rem
                            font-weight: 700
                    .discont
                        margin-top: 1.5rem
                        margin-bottom: 1.75rem
                        .supports-item 
                            margin-bottom: .75rem
                            margin-left: 3rem
                            text-align: left
                            font-size: 0
                            &:last-child
                                margin-bottom: 0
                            .icon
                                display: inline-block 
                                width: 1rem
                                height: 1rem
                                vertical-align: top
                                margin-right: .375rem
                                background-size: 1rem 1rem
                                background-repeat: no-repeat
                                &.decrease
                                    bg-image('decrease_2')
                                &.discount
                                    bg-image('discount_2')
                                &.guarantee
                                    bg-image('guarantee_2')
                                &.invoice
                                    bg-image('invoice_2')
                                &.special
                                    bg-image('special_2')
                            .text
                                line-height: 1rem
                                font-size: .75rem
                                font-weight: 200
                                color: #FFFFFF
                    .inform
                        text-align: left
                        padding: 1.5rem 3rem 0 3rem
                        line-height: 1.5rem
                        color: #FFFFFF
                        font-size: .75rem

            .footer
                margin-top: -4rem
                .icon 
                    display: block
                    text-align: center
                    .icon-close
                        font-size: 2rem
                        color: rgba(255,255,255,0.5)
</style>
