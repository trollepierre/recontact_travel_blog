import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'

import ArticleList from './ArticleList.vue'
import articlesApi from '../../services/api/articles'
import positionsApi from '../../services/api/positions'
import articlesSorter from '../../services/services/articlesSorter'

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

  const fetchedArticles = [article('92'), article('12')]
  const sortedArticles = [article('12'), article('92')]
  const lastPosition = { place: 'Mexico', time: '1er mai 2019' }

  beforeEach(() => {
    console.warn = jest.fn()

    articlesSorter.sortByDropboxId = jest.fn()
    articlesSorter.sortByDropboxId.mockReturnValue(sortedArticles)
    positionsApi.fetchLast = jest.fn()
    positionsApi.fetchLast.mockResolvedValue(lastPosition)
    articlesApi.fetchAll = jest.fn()
    articlesApi.fetchAll.mockResolvedValue(fetchedArticles)
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

    it('should save articles from api in data articles', () => {
      expect(wrapper.vm.articles).toEqual(sortedArticles)
    })

    it('should call positions api to fetch last position', () => {
      expect(positionsApi.fetchLast).toHaveBeenCalledWith()
    })

    it('should save last position from api in data last position', () => {
      expect(wrapper.vm.lastPosition).toEqual('Mexico, 1er mai 2019')
    })
  })

  describe('computed property #title', () => {
    it('should return "Réparer le site" when site is in adminMode', () => {
      const propsData = { adminMode: true }

      wrapper = shallowMount(ArticleList, { localVue, router, propsData })

      expect(wrapper.vm.title).toEqual('fixWebsite')
    })

    it('should return "Les articles du voyage" by default', () => {
      wrapper = shallowMount(ArticleList, { localVue, router })

      expect(wrapper.vm.title).toEqual('theArticlesOfTheTrip')
    })
  })

  describe('methods', () => {
    describe('#updateLastPositionData', () => {
      it('should concat place and time', () => {
        const position = {
          place: 'place',
          time: 'time',
        }

        wrapper.vm.updateLastPositionData(position)

        expect(wrapper.vm.lastPosition).toEqual('place, time')
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

        it('contains 5 locales', () => {
          expect(locales).toHaveLength(5)
          expect(locales).toEqual([
            'fixWebsite',
            'theArticlesOfTheTrip',
            'lastPosition',
            'subtitle',
            'lastKnownPosition',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(ArticleList.i18n.messages.en)

        it('contains 5 locales', () => {
          expect(locales).toHaveLength(5)
          expect(locales).toEqual([
            'fixWebsite',
            'theArticlesOfTheTrip',
            'lastPosition',
            'subtitle',
            'lastKnownPosition',
          ])
        })
      })
    })
  })
})
