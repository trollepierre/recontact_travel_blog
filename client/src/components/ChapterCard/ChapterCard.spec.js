import VueI18n from 'vue-i18n'
import ChapterCard from './ChapterCard.vue'
import translationsService from '../../services/translations'

describe('Component | ChapterCard.vue', () => {
  let wrapper
  let chapter
  let localVue

  beforeEach(() => {
    translationsService.getChapterTitle = jest.fn()
    translationsService.getChapterTitle.mockReturnValue('My title')
    translationsService.getChapterText = jest.fn()
    translationsService.getChapterText.mockReturnValue(['one text'])
    chapter = {
      position: 82,
      frTitle: 'Titre du premier paragraphe',
      enTitle: 'Title of the first paragraph',
      imgLink: 'webf',
      frText: 'du blabla',
      enText: 'some blabla',
    }
    localVue = createLocalVue()
    localVue.use(VueI18n)
    const propsData = { chapter }
    wrapper = shallowMount(ChapterCard, { localVue, propsData })
  })

  it('should be named "ChapterCard"', () => {
    expect(wrapper.name()).toEqual('ChapterCard')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should match snapshot when imgLink is not set', () => {
      chapter = {
        position: 82,
        frTitle: 'Titre du premier paragraphe',
        enTitle: 'Title of the first paragraph',
        imgLink: '',
        frText: 'du blabla',
        enText: 'some blabla',
      }
      const propsData = {
        chapter,
      }
      wrapper = shallowMount(ChapterCard, { localVue, propsData })
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('computed property #imgLink', () => {
    it('should return imgLink when defined', () => {
      chapter.imgLink = 'dropbox.com/img0.jpg'
      const propsData = { chapter }

      wrapper = shallowMount(ChapterCard, { localVue, propsData })

      expect(wrapper.vm.imgLink).toEqual('dropbox.com/img0.jpg')
    })

    it('should return false when chapter imglink is empty', () => {
      chapter.imgLink = ''
      const propsData = { chapter }

      wrapper = shallowMount(ChapterCard, { localVue, propsData })

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

        it('contains 1 locale', () => {
          expect(locales).toHaveLength(1)
          expect(locales).toEqual([
            'missingImage',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(ChapterCard.i18n.messages.en)

        it('contains 1 locale', () => {
          expect(locales).toHaveLength(1)
          expect(locales).toEqual([
            'missingImage',
          ])
        })
      })
    })
  })
})

