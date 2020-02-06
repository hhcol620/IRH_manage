import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Administrators from '../components/administrators/administrators.vue'
import Administrators_Detail from '../components/administrators/administrators_detail.vue'

import Goods from '../components/mall_management/Goods.vue'
import Order from '../components/mall_management/Order.vue'
import Forum_post from '../components/forum/forum_post.vue'

// 
import Reports from '../components/report/report.vue'
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
   redirect: '/welcome',
   children: [{
     path: '/welcome',
     component: Welcome
   },
     {
       path: '/administrators',
       component:Administrators
     },
    {
     path: '/users',
     component: Users
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
       path: '/admin_report',
       component:Reports
    },
     {
       path: '/administrators_Detail',
       component:Administrators_Detail
     },
     {
       path: '/forum_post',
       component:Forum_post
     },
     {
      path: '/Goods',
      component:Goods
    },
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
router.beforeEach((to, from, next) => {
 /* 
 to 将要访问的路径
 from 代表从哪个路径跳转而来
 next 是一个函数,表示放行
 next() 放行 next('/ligin')  强制跳转
 */
 if (to.path === '/login') return next();
 // 获取token
 const tokenStr = window.sessionStorage.getItem('token')
 if (!tokenStr) return next('/login')
 next()
})
export default router