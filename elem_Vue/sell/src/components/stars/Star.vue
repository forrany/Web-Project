<template>
    <div class="star" :class="starType">
        <span v-for="itemClass in itemClasses" :class="itemClass.status" class="star-item" :key="itemClass.index"></span>
    </div>
</template>

<script>
/* eslint semi: "error" */
    const LENGTH = 5;
    const CLS_ON = 'on';
    const CLS_OFF = 'off';
    const CLS_HALF = 'half';
export default {
    props: {
        size: {
            type: Number
        },
        score: {
            type: Number
        }
    },
    computed: {
        starType() {
            return 'star-' + this.size;
        },
        itemClasses() {
            let result = [];
            let score = Math.floor(this.score * 2) / 2;
            let hasDot = score % 1 !== 0;
            let integer = Math.floor(score);
            for (let i = 0; i < integer; i++) {
                result.push({'status': CLS_ON, 'index': i});
            };
            if (hasDot) {
                result.push({'status': CLS_HALF, 'index': result.length});
            }
            while (result.length < LENGTH) {
                result.push({'status': CLS_OFF, 'index': result.length});
            }
            return result;
        }
    }
};
</script>

<style lang="stylus">
    @import "../../common/stylus/mixin.styl"
    .star
        font-size: 0
        .star-item
            display: inline-block
            background-repeat: no-repeat
        &.star-48
            .star-item
                width: 1.25rem
                height: 1.25rem
                margin-right: 1.375rem
                background-size: 1.25rem 1.25rem
                &:last-child
                    margin-right:0
                &.on
                    bg-image('star48_on')
                &.half
                    bg-image('star48_half')
                &.off
                    bg-image('star48_off')
        &.star-36
            .star-item
                width: .9375rem
                height: .9375rem
                margin-right: 1rem
                background-size: .9375rem .9375rem
                &:last-child
                    margin-right:0
                &.on
                    bg-image('star36_on')
                &.half
                    bg-image('star36_half')
                &.off
                    bg-image('star36_off')
        &.star-24
            .star-item
                width: .625rem
                height: .625rem
                margin-right: .1875rem
                background-size: .625rem .625rem
                &:last-child
                    margin-right:0
                &.on
                    bg-image('star24_on')
                &.half
                    bg-image('star24_half')
                &.off
                    bg-image('star24_off')
</style>
