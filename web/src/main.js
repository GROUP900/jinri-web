import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import App from './App.vue'
import axios from 'axios'


//设置自定挂载属性
Vue.prototype.imgCdn = 'https://img.nine00.com';
axios.defaults.baseURL = 'http://localhost:4030/api/';
Vue.prototype.ajax = axios;
Vue.prototype.bus = new Vue();

//路由初始化
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes
})

//根实例
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
