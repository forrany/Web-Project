import Vue from 'vue'
import Router from 'vue-router'
import Guild from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Guild',
      component: Guild
    }
  ]
})
