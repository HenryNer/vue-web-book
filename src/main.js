import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import i18n from './lang'
import VueLazyload from 'vue-lazyload'
import './assets/styles/icon.css'
import './assets/styles/global.scss'
import './utils/boost'
import './utils/create-api'
// import './mock'

Vue.config.productionTip = false
Vue.use(VueLazyload)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
