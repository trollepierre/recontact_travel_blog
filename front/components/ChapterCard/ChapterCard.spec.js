import VueI18n from 'vue-i18n'
import Vuex from 'vuex'
import ChapterCard from './ChapterCard.vue'
import translationsService from '../../services/services/translations'

describe('Component | ChapterCard.vue', () => {
  let wrapper
  const chapter = {
    position: 82,
    frTitle: 'Titre du premier paragraphe',
    enTitle: 'Title of the first paragraph',
    imgLink: 'webf',
    frText: 'du blabla',
    enText: 'some blabla',
  }
  let localVue
  let store
  let propsData

  beforeEach(() => {
    console.warn = jest.fn()
    translationsService.getChapterTitle = jest.fn()
    translationsService.getChapterTitle.mockReturnValue('My title')
    translationsService.getChapterText = jest.fn()
    translationsService.getChapterText.mockReturnValue(['Title of the first paragraph', 'https://github.com/trollepierre', 'url', 'https://www.youtube.com/embed/-18AYp_7iW0'])
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(Vuex)
    propsData = { chapter }
    store = new Vuex.Store({ state: { locale: 'en' } })
    wrapper = shallowMount(ChapterCard, { localVue, propsData, store })
  })

  it('should be named "ChapterCard"', () => {
    expect(wrapper.name()).toEqual('ChapterCard')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should not contain header when chapterTitle is empty', () => {
      translationsService.getChapterTitle.mockReturnValue('-')
      propsData = { chapter }
      wrapper = shallowMount(ChapterCard, { localVue, propsData, store })
      expect(wrapper.find('.chapter__header').element).toBeUndefined()
    })
  })

  describe('computed property #chapterAlt', () => {
    it('should return chapterAlt when defined', () => {
      translationsService.getChapterText.mockReturnValue([])

      wrapper = shallowMount(ChapterCard, { localVue, propsData, store })

      expect(wrapper.vm.chapterAlt).toEqual('An image showing ')
    })
  })

  describe('computed property #imgLink', () => {
    it('should return imgLink when defined', () => {
      chapter.imgLink = 'dropbox.com/img0.jpg'
      propsData = { chapter }

      wrapper = shallowMount(ChapterCard, { localVue, propsData, store })

      expect(wrapper.vm.imgLink).toEqual('dropbox.com/img0.jpg')
    })

    it('should return false when chapter imglink is empty', () => {
      chapter.imgLink = ''
      propsData = { chapter }

      wrapper = shallowMount(ChapterCard, { localVue, propsData, store })

      expect(wrapper.vm.imgLink).toEqual(false)
    })
  })

  describe('locales', () => {
    const languages = Object.keys(ChapterCard.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ChapterCard.i18n.messages.fr)

        it('contains 1 locales', () => {
          expect(locales).toHaveLength(1)
          expect(locales).toEqual([
            'altComplement',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(ChapterCard.i18n.messages.en)

        it('contains 1 locales', () => {
          expect(locales).toHaveLength(1)
          expect(locales).toEqual([
            'altComplement',
          ])
        })
      })
    })
  })
})

