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
import ReleaseInfoExamination from '../components/examination/ReleaseInfoExamination.vue'
// 
import Reports from '../components/examination/report.vue'

import Goods_Tag from '../components/mall_management/Goods_Tag.vue'
import commonweal_apply from '../components/examination/commonweal_apply.vue'
import commonweal_approve from '../components/examination/commonweal_approve.vue'
import mall_audit from '../components/examination/mall_audit.vue'
import forum_audit from '../components/examination/ReleaseInfoExamination.vue'
import realnameExamination from '../components/examination/realnameExamination.vue'

// 以下是反馈和审核页面的详细页面
import Report_art_detail from '../components/examination/children/report_detail.vue'
import Report_comm from '../components/examination/children/report_comm'
import Report_lea_msg from '../components/examination/children/report_lea_msg'
import report_evaluate from '../components/examination/children/report_evaluate'
import report_demand_detail from '../components/examination/children/report_demand_detail'

import commonweal_apply_detail from '../components/examination/children/commonweal_apply_detail.vue'
import commonweal_approve_detail from '../components/examination/children/commonweal_approve_detail.vue'
import mall_audit_detail from '../components/examination/children/mall_audit_detail.vue'
import realnameExamination_detail from '../components/examination/children/realnameExamination_detail.vue'
import ReleaseInfoExamination_detail from '../components/examination/children/ReleaseInfoExamination_detail.vue'



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
      path: '/forum_audit',
      component:forum_audit
     },
     {
      path: '/Goods',
      component:Goods
     },
     {
      path: '/Goods_Cate',
      component:Goods_Cate
     },
     {
       path: '/Goods_Tag',
       component:Goods_Tag
     },
     {
      path: '/commonweal_apply',
      component:commonweal_apply
     },
     {
      path: '/commonweal_approve',
      component:commonweal_approve
     },
     {
      path: '/mall_audit',
      component:mall_audit
     },
    {
      path: '/Order',
      component:Order
    },
     {
       path: '/ReleaseInfoExamination',
       component:ReleaseInfoExamination
     },
    {
      path: '/Users',
      component:Users
    },
    {
      path: '/Demand',
      component:Demand
    },
     {
       path: '/realnameExamination',
       component:realnameExamination
     },
     {
      path: '/commonweal_apply_detail',
      component:commonweal_apply_detail
     },
     {
      path: '/commonweal_approve_detail',
      component:commonweal_approve_detail
     },
     {
      path: '/mall_audit_detail',
      component:mall_audit_detail
     },
     {
      path: '/realnameExamination_detail',
      component:realnameExamination_detail
     },
     {
      path: '/ReleaseInfoExamination_detail',
      component:ReleaseInfoExamination_detail
     },
     {
      path: '/Report_comm',
      component:Report_comm
     },
     {
      path: '/Report_lea_msg',
      component:Report_lea_msg
     },
     {
      path: '/report_evaluate',
      component:report_evaluate
     },
     {
      path: '/report_art_detail',
      component:Report_art_detail
     },
     {
      path: '/report_demand_detail',
      component:report_demand_detail
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