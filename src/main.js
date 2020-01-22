import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './plugins/element.js'


/* 导入全局样式表 */
import './assets/css/global.css'
import './assets/css/font_lcuwsu5jg6/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.baseURL = 'http://127.0.0.1:3000/mock/20/'

// axios.defaults.baseURL = 'http://mock-api.com/ZgBBZVgB.mock/'


axios.interceptors.request.use(config=>{
 /* 给请求头里面添加一个属性 Authorization 并将其值设置为token令牌*/
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config);
  // 必须return config
 return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)

new Vue({
 router,
 store,
 render: h => h(App)
}).$mount('#app')