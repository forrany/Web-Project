<template>
  <div id="app">
    <div class="logo">
      <a href="http://zhaopin.sgcc.com.cn/html/subunit/00995898" class="link">
      <img src="//alicliimg.clewm.net/010/501/3501010/1530110187799ac1b6f79a68bb5976ee0259edad790a61530110008.png">
      </a>
      <v-login/>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Login from './components/login/Login'
export default {
  name: 'App',
  components:{
    'v-login' : Login
  }
}
</script>
<style lang="sass">
@import './assets/init.scss'
.logo
  width: 100%
  height: 4.67725rem
  img
    width: 80%
</style>
