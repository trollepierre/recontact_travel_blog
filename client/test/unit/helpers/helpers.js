import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueModal from 'vue-js-modal';
import VueRouter from 'vue-router';
import VueLazyload from 'vue-lazyload';

Vue.use(VueI18n);
Vue.use(VueModal);
Vue.use(VueRouter);
Vue.use(VueLazyload);

window.Vue = Vue;
window.VueI18n = VueI18n;
window.VueModal = VueModal;
window.VueRouter = VueRouter;
