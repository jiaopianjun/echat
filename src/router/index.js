import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import EasyScroll from 'easyscroll'
import VueContextMenu from 'vue-contextmenu'
import 'vue-contextmenu/style/css/font-awesome.min.css'
Vue.use(VueContextMenu)
// Vue.use(EasyScroll)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
  ]
})
