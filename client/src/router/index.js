import Vue from 'vue';
import Router from 'vue-router';
import ArticleList from '@/components/ArticleList';
import ArticlePage from '@/components/ArticlePage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ArticleList',
      component: ArticleList,
    },
    {
      path: '/article',
      name: 'ArticlePage',
      component: ArticlePage,
    },
  ],
});
