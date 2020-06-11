import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import '@/icons' // icon
import '@/styles/index.scss' // global css
import '@/permission'
// 引入全局过滤器
import * as filters from './filters'
Object.keys(filters).forEach(key => {
  console.log(key)
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
