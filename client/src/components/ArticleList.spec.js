import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'

import articlesApi from '../api/articles'
import ArticleList from './ArticleList.vue'
import syncApi from '../api/sync'
import positionsApi from '../api/positions'
import notificationsService from '../services/notifications'
import articlesSorter from '../services/articlesSorter'

describe('Component | ArticleList.vue', () => {
  let localVue
  let wrapper
  const router = {
    init: jest.fn(),
    push: jest.fn(),
    history: {},
  }

  const article = (dropboxId = 59) => ({
    dropboxId,
    frTitle: 'Le titre',
    enTitle: 'The title',
  })

  const fetchArticles = [article('92'), article('12')]
  const sortedArticles = [article('12'), article('92')]

  beforeEach(() => {
    articlesSorter.sortByDropboxId = jest.fn()
    articlesSorter.sortByDropboxId.mockReturnValue(sortedArticles)
    articlesApi.fetchAll = jest.fn()
    articlesApi.fetchAll.mockResolvedValue(fetchArticles)
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)
    localVue.use(VueAnalytics, { id: '12' })
    const propsData = { adminMode: true }
    wrapper = shallowMount(ArticleList, { localVue, router, propsData })
  })

  it('should be named "ArticleList"', () => {
    expect(wrapper.name()).toEqual('ArticleList')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('mounted', () => {
    it('should call articles api to fetch articles', () => {
      expect(articlesApi.fetchAll).toHaveBeenCalledWith()
    })

    it('should call articles api to fetch articles', () => {
      expect(articlesApi.fetchAll).toHaveBeenCalledWith()
    })

    // TODO kill red warn
    it('should save articles from api in data articles', () => {
      expect(wrapper.vm.articles).toEqual(sortedArticles)
    })
  })

  describe('computed property #title', () => {
    it('should return "Réparer le site" when site is in adminMode', () => {
      const propsData = { adminMode: true }

      wrapper = shallowMount(ArticleList, { localVue, router, propsData })

      expect(wrapper.vm.title).toEqual('fixWebsite')
    })

    it('should return "Les articles du voyage" when site is in adminMode', () => {
      const propsData = { adminMode: false }

      wrapper = shallowMount(ArticleList, { localVue, router, propsData })

      expect(wrapper.vm.title).toEqual('theArticlesOfTheTrip')
    })
  })

  describe('methods', () => {
    describe('#updateLastPosition', () => {
      beforeEach(() => {
        positionsApi.add = jest.fn()
      })

      it('should call positionsApi to add default position', () => {
        positionsApi.add.mockResolvedValue({})
        const position = {
          place: null,
          time: null,
        }

        wrapper.vm.updateLastPosition()

        expect(positionsApi.add).toHaveBeenCalledWith(position)
      })

      it('should updateLastPositionData with api answer', async () => {
        positionsApi.add.mockResolvedValue({
          place: 'London',
          time: '6 May 2018',
        })

        await wrapper.vm.updateLastPosition()

        expect(wrapper.vm.lastPosition).toEqual('London, 6 May 2018')
      })
    })

    describe('#synchronise', () => {
      beforeEach(() => {
        syncApi.launch = jest.fn()
      })

      it('should display success toast notification before synchronisation calls', () => {
        notificationsService.information = jest.fn()
        notificationsService.information.mockResolvedValue({})
        syncApi.launch.mockResolvedValue({})

        wrapper.vm.synchronise()

        const message = 'syncLaunched'
        expect(notificationsService.information).toHaveBeenCalledWith(expect.anything(), message)
      })

      it('should call syncApi', () => {
        syncApi.launch.mockResolvedValue({})

        wrapper.vm.synchronise()

        expect(syncApi.launch).toHaveBeenCalledWith()
      })

      it('should display success toast notification when synchronisation succeeds', async () => {
        notificationsService.success = jest.fn()
        notificationsService.success.mockResolvedValue({})
        notificationsService.removeInformation = jest.fn()
        notificationsService.removeInformation.mockResolvedValue({})
        syncApi.launch.mockResolvedValue({})

        await wrapper.vm.synchronise()

        expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything())
        const message = 'syncDone'
        expect(notificationsService.success).toHaveBeenCalledWith(expect.anything(), message)
      })

      xit('should redirect to /', () => {
        router.push.mockResolvedValue({})
        syncApi.launch.mockResolvedValue({})

        wrapper.vm.synchronise()

        return Vue.nextTick().then(() => {
          expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
        })
      })

      xit('should display error toast notification when synchronisation fails', () => {
        notificationsService.error = jest.fn()
        notificationsService.error.mockResolvedValue({})
        syncApi.launch.mockRejectedValue('Expected error')

        wrapper.vm.synchronise()

        return Vue.nextTick().then(() => {
          expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything())
          const message = 'syncError Error: Expected error'
          expect(notificationsService.error).toHaveBeenCalledWith(expect.anything(), message)
        })
      })
    })
  })

  describe('clicking on button "Synchronise"', () => {
    let syncButton

    beforeEach(() => {
      notificationsService.information = jest.fn()
      syncApi.launch.mockResolvedValue({})
      syncButton = wrapper.findAll('button.article-results__buttons').at(1)
    })

    xit('should disable sync button', () => {
      notificationsService.information.mockRejectedValue()
      syncButton.trigger('click')

      return Vue.nextTick().then(() => {
        expect(syncButton.disabled).toEqual(true)
      })
    })

    xit('should call synchronise api', () => {
      notificationsService.information.mockResolvedValue({})
      sinon.stub(component, 'synchronise').mockResolvedValue({})

      syncButton.trigger('click')

      return Vue.nextTick().then(() => {
        expect(wrapper.vm.synchronise).toHaveBeenCalled
      })
    })
  })

  describe('locales', () => {
    const languages = Object.keys(ArticleList.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ArticleList.i18n.messages.fr)

        it('contains 15 locales', () => {
          expect(locales).toHaveLength(15)
          expect(locales).toEqual([
            'getNewArticles',
            'deleteAllArticles',
            'deleteAndSyncAllArticles',
            'getSubscribers',
            'fixWebsite',
            'theArticlesOfTheTrip',
            'syncLaunched',
            'syncDone',
            'syncError',
            'place',
            'time',
            'confirm',
            'lastPosition',
            'subtitle',
            'lastKnownPosition',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(ArticleList.i18n.messages.en)

        it('contains 15 locales', () => {
          expect(locales).toHaveLength(15)
          expect(locales).toEqual([
            'getNewArticles',
            'deleteAllArticles',
            'deleteAndSyncAllArticles',
            'getSubscribers',
            'fixWebsite',
            'theArticlesOfTheTrip',
            'syncLaunched',
            'syncDone',
            'syncError',
            'place',
            'time',
            'confirm',
            'lastPosition',
            'subtitle',
            'lastKnownPosition',
          ])
        })
      })
    })
  })
})
