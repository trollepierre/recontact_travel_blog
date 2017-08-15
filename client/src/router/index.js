import Vue from 'vue';
import Router from 'vue-router';
import ArticleList from '@/components/ArticleList';

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
      name: 'ArticleList',
      component: ArticleList,
    },
  ],
});
