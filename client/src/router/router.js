import Vue from 'vue';
import Router from 'vue-router';
import ArticleList from '../components/ArticleList.vue';
import ArticlePage from '../components/ArticlePage.vue';
import SubscriberList from '../components/SubscriberList.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ArticleList',
      component: ArticleList,
    },
    {
      path: '/articles/:id',
      name: 'ArticlePage',
      component: ArticlePage,
    },
    {
      path: '/admin',
      name: 'ArticleList',
      component: ArticleList,
      props: { adminMode: true },
    },
    {
      path: '/subscriptions',
      name: 'SubscriberList',
      component: SubscriberList,
    },
    { path: '/sub', redirect: '/subscriptions' },
    { path: '/a/:id', redirect: '/articles/:id' },
  ],
});
