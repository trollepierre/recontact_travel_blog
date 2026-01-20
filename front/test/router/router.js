import { createRouter, createMemoryHistory } from 'vue-router'
import ArticlePage from '../../components/ArticlePage/ArticlePage.vue'

export const conf = {
  routes: [
    {
      path: '/articles/:id',
      name: 'ArticlePage',
      component: ArticlePage,
    },
    { path: '/sub', redirect: '/subscriptions' },
    { path: '/a/:id', redirect: '/articles/:id' },
  ],
}

export default createRouter({
  history: createMemoryHistory(),
  routes: conf.routes,
})
