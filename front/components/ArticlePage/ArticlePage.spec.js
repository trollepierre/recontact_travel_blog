import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'
import ArticlePage from './ArticlePage.vue'
import router from '../../router/router'
import commentsApi from '../../services/api/comments'
import chaptersApi from '../../services/api/chapters'
import photosApi from '../../services/api/photos'
import translationsService from '../../services/services/translations'

describe('Component | ArticlePage.vue', () => {
  let localVue
  let wrapper
  let chapters
  let photos
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
      }, {
        title: '61 : Pierre au Koezio',
        imgLink: '/assets/tata.jpg',
        text: ['some text'],
      }, {
        title: '62 : Pierre au Koezio',
        imgLink: '/assets/titi.jpg',
        text: ['some text'],
      },
    ]
    photos = [
      { imgLink: 'url/photo1' },
      { imgLink: 'url/photo2' },
    ]
    photosApi.fetch = jest.fn()
    photosApi.fetch.mockResolvedValue(photos)
    chaptersApi.fetch = jest.fn()
    chaptersApi.fetch.mockResolvedValue({ title, chapters })
    commentsApi.fetch = jest.fn()
    commentsApi.fetch.mockResolvedValue(commentsFromApi)

    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)
    localVue.use(VueAnalytics, { id: '12' })
    wrapper = shallowMount(ArticlePage, { localVue, router, data: () => ({ dropboxId }) })
  })

  it('should be named "ArticlePage"', () => {
    expect(wrapper.name()).toEqual('ArticlePage')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('mounted', () => {
    // xit('should call chapters api to fetch chapters', () => {
    //   expect(chaptersApi.fetch).toHaveBeenCalledWith(idArticle)
    // })
    //
    // xit('should call photos api to fetch photos', () => {
    //   expect(photosApi.fetch).toHaveBeenCalledWith(idArticle)
    // })

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

        it('contains 4 locales', () => {
          expect(locales).toHaveLength(4)
          expect(locales).toEqual([
            'hereTheGallery',
            'goToPreviousArticle',
            'goToNextArticle',
            'goToHomePage',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(ArticlePage.i18n.messages.en)

        it('contains 4 locales', () => {
          expect(locales).toHaveLength(4)
          expect(locales).toEqual([
            'hereTheGallery',
            'goToPreviousArticle',
            'goToNextArticle',
            'goToHomePage',
          ])
        })
      })
    })
  })
})
