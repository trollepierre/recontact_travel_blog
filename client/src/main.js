import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import VueI18n from 'vue-i18n'
import VueLazyload from 'vue-lazyload'
import VueModal from 'vue-js-modal'
import Toastr from 'vue-toastr'
import App from './App.vue'
import env from './env/env'
import router from './router/router'

Vue.component('vue-toastr', Toastr)
require('vue-toastr/dist/vue-toastr.css')

Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(VueModal)

const i18n = new VueI18n({
  locale: navigator.language.substring(0, 2),
  fallbackLocale: 'en',
})

Vue.use(VueLazyload, {
  error: '',
  loading: '/static/loader.gif',
})

Vue.use(VueAnalytics, {
  id: `${env('ANALYTICS_KEY')}`,
  router,
  autoTracking: {
    exception: true,
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  mounted() {
    this.$refs.toastr.defaultPosition = 'toast-bottom-right'
  },
  template: '' +
  '<div>' +
  '<App/>' +
  '<vue-toastr ref="toastr"/>' +
  '</div>',
})
