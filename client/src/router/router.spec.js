describe('router', () => {
  let ArticleList
  let ArticlePage
  let SubscriberList
  let routerConfiguration

  beforeEach(() => {
    jest.mock('../components/ArticleList.vue', () => ({ name: 'ArticleList' }))
    jest.mock('../components/ArticlePage.vue', () => ({ name: 'ArticlePage' }))
    jest.mock('../components/SubscriberList.vue', () => ({ name: 'SubscriberList' }))

    ArticleList = require('../components/ArticleList.vue')
    ArticlePage = require('../components/ArticlePage.vue')
    SubscriberList = require('../components/SubscriberList.vue')

    routerConfiguration = require('./router').conf
  })

  it('should have history mode', () => {
    expect(routerConfiguration).toHaveProperty('mode', 'history')
  })

  describe('routes', () => {
    let routes
    beforeEach(() => {
      routes = routerConfiguration.routes
    })

    it('should have a homepage route', () => {
      expect(routes).toContainEqual({
        path: '/',
        name: 'ArticleList',
        component: ArticleList,
      })
    })

    it('should have an article page route', () => {
      expect(routes).toContainEqual({
        path: '/articles/:id',
        name: 'ArticlePage',
        component: ArticlePage,
      })
    })

    it('should have an admin page route', () => {
      expect(routes).toContainEqual({
        path: '/admin',
        name: 'ArticleList',
        component: ArticleList,
        props: { adminMode: true },
      })
    })

    it('should have a subscription page route', () => {
      expect(routes).toContainEqual({
        path: '/subscriptions',
        name: 'SubscriberList',
        component: SubscriberList,
      })
    })

    it('should have a sub redirection', () => {
      expect(routes).toContainEqual({
        path: '/sub',
        redirect: '/subscriptions',
      })
    })

    it('should have a article redirection route', () => {
      expect(routes).toContainEqual({
        path: '/a/:id',
        redirect: '/articles/:id',
      })
    })
  })
})

