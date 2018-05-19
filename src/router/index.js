import Vue from 'vue'
import Router from 'vue-router'
import GoodsView from '../components/goods/goods'
import SellerView from '../components/seller/seller'
import RatingsView from '../components/ratings/ratings'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
        path: '/',
        redirect:'/goods'
    },
    {
      path: '/goods',
      component: GoodsView
    },
    {
        path: '/seller',
        component: SellerView
    },
    {
        path: '/ratings',
        component: RatingsView
    }
  ]
})
