import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './plugins/element.js'


/* 导入全局样式表 */
import './assets/css/global.css'
import './assets/css/font_lcuwsu5jg6/iconfont.css'
// 导入树形格
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'

axios.defaults.baseURL = '/api'

axios.interceptors.request.use(config=>{
 /* 给请求头里面添加一个属性 Authorization 并将其值设置为token令牌*/
  config.headers.Authorization = window.sessionStorage.getItem('token')
 return config
})


// Vue.prototype.HOST='/api'
// 配置axios
Vue.prototype.$http = axios




// 阻止启动生产消息
Vue.config.productionTip = false


Vue.component('tree-table',TreeTable)

// 定义一个全局过滤器start   将后台传过来的身份数字转为对应的身份
Vue.filter('admin_type_Format', function(type) {
  const ts = type
      switch (ts) {
        case 10:
          // 代码块
          return '普通会员'
        case 20:
          // 代码块
          return '服务人员'
        case 30:
          return '校园组织'
        case 35:
          return '公益组织'
        case 40:
          return '校园社团'
        case 50:
          return '管理员'
      }
})
/* 身份的过滤器end */

// 定义一个全局过滤器start 将后台的传过来的举报类型数字转为对应的举报
Vue.filter('report_type_format', function(type) {
  const ts = type
  switch (ts) {
    case 1:
      return '商品'
    case 2:
      return '留言'
    case 3:
      return '评论'
    case 4:
      return '帖子'
  }
  
})
// end


// 定义一个全局过滤器 start 区分处理结果
Vue.filter('report_result_format', function(result) {
  const res = result
  switch (res) {
    case 1:
      return '举报失败'
    case 2:
      return '处理中'
    case 3:
      return '警告'
    case 4:
      return '冻结账号'
    case 5:
      return '删除相关内容'
  }
})

// 定义一个全局过滤器 商品交易方式
Vue.filter('tradeType', function(type) {
  const ty = type
  switch (ty) {
    case 10:
      return '正常交易'
    case 20:
      return '公益捐赠'
  }
})
// 定义一个全局过滤器  订单的交易方式
Vue.filter('orderTradeType', function(type) {
  const ty = type
  switch (ty) {
    case 10:
      return '线上交易'
    case 20:
      return '线下交易'
    case 30:
      return '公益捐赠'
  }
})


// 全局注册树形table表格
Vue.component('tree-table',TreeTable)
new Vue({
 router,
 store,
 render: h => h(App)
}).$mount('#app')