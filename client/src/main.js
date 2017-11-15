// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Toastr from 'vue-toastr';
import VueModal from 'vue-js-modal';
import VueLazyload from 'vue-lazyload';
import VueI18n from 'vue-i18n';
import App from './App';
import router from './router/index';

Vue.component('vue-toastr', Toastr);
require('vue-toastr/dist/vue-toastr.css');

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(VueModal);

const i18n = new VueI18n({
  locale: navigator.language,
  fallbackLocale: 'en',
});

Vue.use(VueLazyload, {
  error: '',
  loading: '/static/loader.gif',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  template: '' +
  '<div>' +
  '<App/>' +
  '<vue-toastr ref="toastr"/>' +
  '</div>',
  components: { App },
  mounted() {
    this.$refs.toastr.defaultPosition = 'toast-bottom-right';
  },
});
