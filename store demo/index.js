import Vue from 'vue'
import Vuex from 'vuex'
import routerList from './modules/list'
import routerInfo from './modules/info'
import routerQuot from './modules/quotation'
import hubSellers from './modules/sellers'
import {
  ROUTER_INFO,
  ROUTER_LIST,
  ROUTER_QUOT,
  HUB_SELLERS
} from './namespace'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    [ROUTER_INFO]: routerInfo,
    [ROUTER_LIST]: routerList,
    [ROUTER_QUOT]: routerQuot,
    [HUB_SELLERS]: hubSellers
  }
})

if (process.env.NODE_ENV === 'development') {
  window.appStore = store
}

export default store
