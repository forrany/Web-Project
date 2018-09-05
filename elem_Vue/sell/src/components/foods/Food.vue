<template>
    <div class="foodWrapper" v-show="showFlag" @click="changeState">
        <img src="" alt="商品图">
    </div>
</template>

<script>
export default {
    props:{
        food: Object
    },
    data() {
        return {
            showFlag: false
        }
    },
    methods: {
        changeState() {
            this.showFlag = !this.showFlag;
        }
    }
}
</script>
