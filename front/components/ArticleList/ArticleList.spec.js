import Vuex from 'vuex' // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n'

import Vue from 'vue'
import { IS_DESKTOP } from '../../services/utils/responsive/responsive-utils'
import ArticleList from './ArticleList.vue'
import articlesApi from '../../services/api/articles'
import positionsApi from '../../services/api/positions'
import { isCecile, sortByDropboxId } from '../../services'
import ArticleCard from '../ArticleCard/ArticleCard.vue'

jest.mock('../../services')
jest.mock('@/services/utils/responsive/responsive-utils')

describe('Component | ArticleList.vue', () => {
  let localVue
  let store
  let wrapper
  const article = (dropboxId = 59) => ({
    dropboxId,
    frTitle: 'Le titre',
    enTitle: 'The title',
  })

  const fetchedArticles = [article('92'), article('12')]
  const sortedArticles = [article('12'), article('92')]
  const lastPosition = {
    place: 'Mexico', time: '1er mai 2019', placeEn: 'London', timeEn: '11th October 2019',
  }

  beforeEach(() => {
    console.warn = jest.fn()

    sortByDropboxId.mockReturnValue(sortedArticles)
    positionsApi.fetchLast = jest.fn()
    positionsApi.fetchLast.mockResolvedValue(lastPosition)
    articlesApi.fetchAll = jest.fn()
    articlesApi.fetchAll.mockResolvedValue(fetchedArticles)
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(Vuex)
    store = new Vuex.Store({ state: { locale: 'fr' } })
    const propsData = { adminMode: true }
    wrapper = shallowMount(ArticleList, { localVue, propsData, store })
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should handle English language on last position', () => {
      store = new Vuex.Store({ state: { locale: 'en' } })
      const propsData = { adminMode: true }

      wrapper = shallowMount(ArticleList, { localVue, propsData, store })

      return Vue.nextTick().then(() => {
        expect(wrapper.find('.h3').text()).toBe('London, 11th October 2019')
      })
    })

    it('should contain lazy when more than 9 articles', async () => {
      // Given
      IS_DESKTOP.mockReturnValue(true)
      const articles = [
        article('9'),
        article('8'),
        article('7'),
        article('6'),
        article('5'),
        article('4'),
        article('3'),
        article('2'),
        article('1'),
      ]

      // When
      wrapper = await shallowMount(ArticleList, {
        localVue,
        store,
        data() {
          return { articles }
        },
      })

      expect(wrapper.findAllComponents(ArticleCard).at(7).props().lazy).toBe(false)
      expect(wrapper.findAllComponents(ArticleCard).at(8).props().lazy).toBe(true)
    })

    it('should contain lazy when more than 3 articles on MOBILE', async () => {
      // Given
      IS_DESKTOP.mockReturnValue(false)
      const articles = [
        article('3'),
        article('2'),
        article('1'),
      ]

      // When
      wrapper = await shallowMount(ArticleList, {
        localVue,
        store,
        data() {
          return { articles }
        },
      })

      expect(wrapper.findAllComponents(ArticleCard).at(0).props().lazy).toBe(false)
      expect(wrapper.findAllComponents(ArticleCard).at(1).props().lazy).toBe(false)
      expect(wrapper.findAllComponents(ArticleCard).at(2).props().lazy).toBe(true)
    })

    it('should remove last position when cecile website', () => {
      // Given
      isCecile.mockImplementation(() => true)

      // When
      wrapper = shallowMount(ArticleList, { localVue, store })

      // Then
      expect(wrapper.find('.article-results__title.h3').element).toBeUndefined()
    })
  })

  describe('mounted', () => {
    it('should call articles api to fetch articles', () => {
      expect(articlesApi.fetchAll).toHaveBeenCalledWith(0)
    })

    it('should call articles api to fetch articles with limit', () => {
      const propsData = { articlesNumberLimit: 8 }

      wrapper = shallowMount(ArticleList, { localVue, propsData, store })

      expect(articlesApi.fetchAll).toHaveBeenCalledWith(8)
    })

    it('should save articles from api in data articles', () => {
      expect(wrapper.vm.articles).toEqual(sortedArticles)
    })

    it('should call positions api to fetch last position', () => {
      expect(positionsApi.fetchLast).toHaveBeenCalledWith()
    })

    it('should save last position from api in data last position', () => {
      expect(wrapper.vm.lastPosition).toBe('Mexico, 1er mai 2019')
    })
  })

  describe('computed property #title', () => {
    it('should return "Réparer le site" when site is in adminMode', () => {
      const propsData = { adminMode: true }

      wrapper = shallowMount(ArticleList, { localVue, propsData, store })

      expect(wrapper.vm.hiddenTitle).toBe('Fix the website')
    })

    it('should return "Les articles du voyage" by default', () => {
      wrapper = shallowMount(ArticleList, { localVue, store })

      expect(wrapper.vm.hiddenTitle).toBe('Travel blog of Pierre and Benoît after a world trip and other adventures')
    })

    it('should return "mon cadeau de saint val" when site is cecile', () => {
      isCecile.mockImplementation(() => true)

      wrapper = shallowMount(ArticleList, { localVue, store })

      expect(wrapper.vm.title).toBe('Mon petit Cadeau de Saint Valentin')
    })

    it('should return "title" by default', () => {
      wrapper = shallowMount(ArticleList, { localVue, store })

      expect(wrapper.vm.title).toBe('Discover the world with us!')
    })

    it('should return "recharge site" when site is in cecile', () => {
      isCecile.mockImplementation(() => true)

      wrapper = shallowMount(ArticleList, { localVue, store })

      expect(wrapper.vm.subtitle).toBe(
        'recharge le site si jamais l’article ne s’est pas chargé',
      )
    })

    it('should return "lastKnownPosition" by default', () => {
      wrapper = shallowMount(ArticleList, { localVue, store })

      expect(wrapper.vm.subtitle).toBe('Last known position:')
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

        expect(wrapper.vm.lastPosition).toBe('place, time')
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
          expect(locales).toMatchInlineSnapshot(`
            Array [
              "fixWebsite",
              "theArticlesOfTheTrip",
              "lastPosition",
              "title",
              "lastKnownPosition",
            ]
          `)
        })
      })

      describe('en', () => {
        const locales = Object.keys(ArticleList.i18n.messages.en)

        it('contains 5 locales', () => {
          expect(locales).toHaveLength(5)
          expect(locales).toMatchInlineSnapshot(`
            Array [
              "fixWebsite",
              "theArticlesOfTheTrip",
              "lastPosition",
              "title",
              "lastKnownPosition",
            ]
          `)
        })
      })
    })
  })
})
