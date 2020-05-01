import VueI18n from 'vue-i18n'

import ArticleList from './ArticleList.vue'
import articlesApi from '../../services/api/articles'
import positionsApi from '../../services/api/positions'
import articlesSorter from '../../services/services/articlesSorter'
import { isCecile } from '../../services'
import ArticleCard from '../ArticleCard/ArticleCard.vue'

jest.mock('../../services')

describe('Component | ArticleList.vue', () => {
  let localVue
  let wrapper
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
    const propsData = { adminMode: true }
    wrapper = shallowMount(ArticleList, { localVue, propsData })
  })

  it('should be named "ArticleList"', () => {
    expect(wrapper.name()).toEqual('ArticleList')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should contain lazy when more than 9 articles', async () => {
      // Given
      const articles = [article('9'),
        article('8'), article('7'),
        article('6'), article('5'),
        article('4'), article('3'),
        article('2'), article('1'),
      ]

      // When
      wrapper = await shallowMount(ArticleList, { localVue, data() { return { articles } } })

      expect(wrapper.findAll(ArticleCard).at(7).props().lazy).toEqual(false)
      expect(wrapper.findAll(ArticleCard).at(8).props().lazy).toEqual(true)
    })

    it('should remove last position when cecile website', () => {
      // Given
      isCecile.mockImplementation(() => true)

      // When
      wrapper = shallowMount(ArticleList, { localVue })

      // Then
      expect(wrapper.find('.article-results__title.h3').element).toBeUndefined()
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

      wrapper = shallowMount(ArticleList, { localVue, propsData })

      expect(wrapper.vm.hiddenTitle).toEqual('fixWebsite')
    })

    it('should return "Les articles du voyage" by default', () => {
      wrapper = shallowMount(ArticleList, { localVue })

      expect(wrapper.vm.hiddenTitle).toEqual('theArticlesOfTheTrip')
    })

    it('should return "mon cadeau de saint val" when site is cecile', () => {
      isCecile.mockImplementation(() => true)

      wrapper = shallowMount(ArticleList, { localVue })

      expect(wrapper.vm.title).toEqual('Mon petit Cadeau de Saint Valentin')
    })

    it('should return "title" by default', () => {
      wrapper = shallowMount(ArticleList, { localVue })

      expect(wrapper.vm.title).toEqual('title')
    })

    it('should return "recharge site" when site is in cecile', () => {
      isCecile.mockImplementation(() => true)

      wrapper = shallowMount(ArticleList, { localVue })

      expect(wrapper.vm.subtitle).toEqual(
        'recharge le site si jamais l’article ne s’est pas chargé',
      )
    })

    it('should return "lastKnownPosition" by default', () => {
      wrapper = shallowMount(ArticleList, { localVue })

      expect(wrapper.vm.subtitle).toEqual('lastKnownPosition')
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
