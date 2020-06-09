import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import System from '../components/system.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Administrators from '../components/administrators/administrators.vue'
import Administrators_Detail from '../components/administrators/administrators_detail.vue'

import Goods from '../components/mall_management/Goods.vue'
import Goods_Cate from '../components/mall_management/Goods_Cate.vue'
import Demand from '../components/mall_management/Demand.vue'
import Order from '../components/mall_management/Order.vue'
import Forum_post from '../components/forum/forum_post.vue'
import Forum_cate from '../components/forum/forum_cate.vue'
import Interest_tag from '../components/interest_tag/interest_tag.vue'
// 
import Reports from '../components/report/report.vue'
import Report_detail from '../components/report/report_detail.vue'
Vue.use(VueRouter)

const router = new VueRouter({
 routes: [{
   path: '/',
   redirect: '/login'
  },
  {
   path: '/login',
   component: Login
  },
  {
   path: '/home',
   component: Home,
   redirect: '/system_message',
   children: [{
     path: '/system_message',
     component: System
   },
     {
       path: '/administrators',
       component:Administrators
     },
    {
     path: '/rights',
     component: Rights
    },
    {
     path: '/roles',
     component: Roles
     },
     {
       path: '/interest',
       component:Interest_tag
     },
     {
       path: '/admin_report',
       component:Reports
     },
     {
      path: '/report_detail',
      component:Report_detail
     },
     {
       path: '/administrators_Detail',
       component:Administrators_Detail
     },
     {
       path: '/forum_post',
       component:Forum_post
     },{
       path: '/forum_list',
       component:Forum_post
     },
     {
       path: '/forum_cate',
       component:Forum_cate
     },
     {
      path: '/Goods',
      component:Goods
     },
     {
      path: '/Goods_Cate',
      component:Goods_Cate
     },
     /*{
       path: '/Goods_Tag',
       component:Goods_Tag
     },*/
    {
      path: '/Order',
      component:Order
    }
   ]
  }
 ]
})

// 连续多次点击同一个按钮 会导致错误 这里把捕获错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//  /* 
//  to 将要访问的路径
//  from 代表从哪个路径跳转而来
//  next 是一个函数,表示放行
//  next() 放行 next('/ligin')  强制跳转
//  */
//  if (to.path === '/login') return next();
//  // 获取token
//  const tokenStr = window.sessionStorage.getItem('token')
//  if (!tokenStr) return next('/login')
//  next()
// })
export default router