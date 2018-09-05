<template>
    <div class="controlWrapper">
        <transition name="slide">
            <div class="minus" v-show="food.count > 0" @click="removeItem">
                <i class = "icon-remove_circle_outline"></i>
            </div>
        </transition>
        <transition name="appear">
            <div class="count" v-show="food.count > 0">{{food.count}}</div>
        </transition>
        <div class="plus" @click="addItem">
            <i class = "icon-add_circle"></i>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    props: {
        'food': Object
    },
    methods: {
        addItem() {
            console.log('hh')
            if (!this.food.count) {
                Vue.set(this.food, 'count', 1)
            } else {
                this.food.count++
            }
            this.$emit('cartAdd', event.target)
        },
        removeItem() {
            this.food.count--
        }
    }
}
</script>

<style lang="stylus">
    .controlWrapper
        font-size: 0
        div
            display: inline-block
            height: 1.5rem
            width: 1.5rem
            text-align: center
            vertical-align: top
    .minus
        border-radius: 50%
        color: rgb(0,160,220)
        font-size: 24px
        line-height: 1.5rem
    .count
        color: rgb(147,153,159)
        font-size: .625rem
        line-height: 1.5rem
    .plus
        border-radius: 50%
        color: rgb(0,160,220)
        font-size: 24px
        line-height: 1.5rem
    .slide-enter-active, .slide-leave-active, .appear-enter-active, .appear-leave-active
        transition: all 0.3s
        transform: translate3d(0,0,0) rotateZ(0)
    .slide-enter, .appear-enter, .slide-leave-to, .appear-leave-to
        transform: translate3d(3rem,0,0) rotateZ(-180deg)
        opacity: 0
</style>
