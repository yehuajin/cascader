import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import utils from '@/utils'
// 引公共样式
import './assets/common.css'
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.UTILS = utils

new Vue({
  render: h => h(App)
}).$mount('#app')
