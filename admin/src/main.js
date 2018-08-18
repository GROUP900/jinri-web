import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import App from './App.vue'
import axios from 'axios'

//设置自定挂载属性
const apiUrl = 'http://localhost:4030/';
Vue.prototype.apiUrl = apiUrl;
Vue.prototype.ajax = axios;
Vue.prototype.bus = new Vue();
Vue.prototype.bucketUrl = 'http://xxx.costj.myqcloud.com';

axios.interceptors.request.use(function(config) {
  config.headers.Authorization = 'Bearer '+sessionStorage.token;
  return config;
}, function(error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    return response;
  }, function (err) {
    if(err.response.status == 401){
      Vue.prototype.bus.$emit('popMessageComing', '无效的token');
      sessionStorage.clear();
      router.push({
        name: 'login'
      })
    }
    return Promise.reject(err);
  });

import popup from './components/popup.vue'
Vue.component('popup', popup);
//路由初始化
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes
})

//全局路由钩子
router.beforeEach((to, from, next) => {
  switch (to.name) {
    case "login":
      next();
      break;
    case "logout":
      sessionStorage.clear();
      Vue.prototype.bus.$emit('popMessageComing', '已经登出');
      next({
        name: 'login'
      });
      break;
    default:
      if (!sessionStorage.token) {
        next({
          name: 'login'
        })
      } else {
        next()
      }
  }

})

//根实例
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
