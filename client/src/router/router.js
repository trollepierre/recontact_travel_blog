import Router from 'vue-router'
import Vue from 'vue'
import ArticleList from '../components/ArticleList.vue'
import ArticlePage from '../components/ArticlePage.vue'
import SubscriberList from '../components/SubscriberList.vue'

Vue.use(Router)

export const conf = {
  mode: 'history',
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
}

export default new Router(conf)
