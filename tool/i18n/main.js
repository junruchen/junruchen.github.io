import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import validator from 'vue-lite-validator'
import store from '@/store'
import {i18n} from './i18n'

Vue.use(validator)

Vue.config.productionTip = false
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  components: {App}
})
