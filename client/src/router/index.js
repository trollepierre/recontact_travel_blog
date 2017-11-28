import Vue from 'vue';
import Router from 'vue-router';
import ArticleList from '@/components/ArticleList';
import ArticlePage from '@/components/ArticlePage';
import SubscriberList from '@/components/SubscriberList';

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
  ],
});
