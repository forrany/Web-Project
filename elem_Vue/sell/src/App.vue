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
      <router-view :seller="seller"/>
  </div>
</template>

<script>
/* eslint space-before-function-paren: ["error", "never"] */
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
      }
    })
  }
}
</script>

<style lang="stylus">
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
</style>
