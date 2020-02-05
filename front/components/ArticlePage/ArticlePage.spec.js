import VueRouter from 'vue-router' // eslint-disable-line import/no-extraneous-dependencies
import Vuex from 'vuex' // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'
import ArticlePage from './ArticlePage.vue'
import router from '../../test/router/router'
import commentsApi from '../../services/api/comments'
import chaptersApi from '../../services/api/chapters'
import photosApi from '../../services/api/photos'
import translationsService from '../../services/services/translations'

describe('Component | ArticlePage.vue', () => {
  let localVue
  let wrapper
  let chapters
  let photos
  let store
  const dropboxId = '8'
  const title = 'Pierre au pays des'
  const commentsFromApi = [{ text: 'comment1' }]

  beforeEach(() => {
    translationsService.getChapterTitle = jest.fn()
    translationsService.getChapterTitle.mockReturnValue('My title')
    translationsService.getChapterText = jest.fn()
    translationsService.getChapterText.mockReturnValue(['one text'])
    chapters = [
      {
        title: '60 : Pierre avec les webf',
        imgLink: '../assets/toto.jpg',
        text: ['some text'],
      },
      {
        title: '61 : Pierre au Koezio',
        imgLink: '/assets/tata.jpg',
        text: ['some text'],
      },
      {
        title: '62 : Pierre au Koezio',
        imgLink: '/assets/titi.jpg',
        text: ['some text'],
      },
    ]
    photos = [{ imgLink: 'url/photo1' }, { imgLink: 'url/photo2' }]
    photosApi.fetch = jest.fn()
    photosApi.fetch.mockResolvedValue(photos)
    chaptersApi.fetch = jest.fn()
    chaptersApi.fetch.mockResolvedValue({ title, chapters })
    commentsApi.fetch = jest.fn()
    commentsApi.fetch.mockResolvedValue(commentsFromApi)

    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueI18n)
    localVue.use(VueRouter)
    localVue.use(VueAnalytics, { id: '12' })
    store = new Vuex.Store({ actions: {}, state: { locale: 'en' } })
    wrapper = shallowMount(ArticlePage, {
      localVue,
      router,
      store,
      data: () => ({ dropboxId }),
    })
  })

  it('should be named "ArticlePage"', () => {
    expect(wrapper.name()).toEqual('ArticlePage')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should match snapshot when chapter not fetched', () => {
      chaptersApi.fetch.mockRejectedValue()

      wrapper = shallowMount(ArticlePage, {
        localVue,
        router,
        store,
        data: () => ({ dropboxId }),
      })

      expect(wrapper.element).toMatchSnapshot()
    })

    it('should add title when defined', () => {
      wrapper = shallowMount(ArticlePage, {
        localVue,
        router,
        store,
        data: () => ({ title: 'toto' }),
      })

      expect(wrapper.find('.article-page__title').text()).toEqual('toto')
    })
  })

  describe('mounted', () => {
    it('should call chapters api to fetch chapters', () => {
      expect(chaptersApi.fetch).toHaveBeenCalledWith(dropboxId)
    })

    it('should call photos api to fetch photos', () => {
      expect(photosApi.fetch).toHaveBeenCalledWith(dropboxId)
    })

    it('should save chapters from api in data chapters', () => {
      expect(wrapper.vm.chapters).toEqual(chapters)
    })

    it('should save photos from api in data photos', () => {
      expect(wrapper.vm.photos).toEqual(photos)
    })
  })

  describe('locales', () => {
    const languages = Object.keys(ArticlePage.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ArticlePage.i18n.messages.fr)

        it('contains 5 locales', () => {
          expect(locales).toHaveLength(5)
          expect(locales).toMatchInlineSnapshot(
            [
              'hereTheGallery',
              'goToPreviousArticle',
              'goToNextArticle',
              'goToHomePage',
              'title',
            ],
            `
            Object {
              "0": "hereTheGallery",
              "1": "goToPreviousArticle",
              "2": "goToNextArticle",
              "3": "goToHomePage",
              "4": "title",
            }
          `
          )
        })
      })

      describe('en', () => {
        const locales = Object.keys(ArticlePage.i18n.messages.en)

        it('contains 5 locales', () => {
          expect(locales).toHaveLength(5)
          expect(locales).toMatchInlineSnapshot(
            [
              'hereTheGallery',
              'goToPreviousArticle',
              'goToNextArticle',
              'goToHomePage',
              'title',
            ],
            `
            Object {
              "0": "hereTheGallery",
              "1": "goToPreviousArticle",
              "2": "goToNextArticle",
              "3": "goToHomePage",
              "4": "title",
            }
          `
          )
        })
      })
    })
  })
})
