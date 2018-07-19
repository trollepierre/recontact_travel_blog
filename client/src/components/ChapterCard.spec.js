import ChapterCard from './ChapterCard'
import translationsService from '../services/translations'
import VueI18n from 'vue-i18n'

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
  })

  describe('render', () => {
    it('should render chapter image', () => {
      const chapterLink = wrapper.find('img')
      expect(chapterLink.attributes().src).toContain('webf')
    })

    it('should not render a span text with Image manquante', () => {
      const missingImage = wrapper.find('span')
      expect(missingImage.length).toBeUndefined()
    })
  })

  describe('computed property #imgLink', () => {
    it('should return imgLink when defined', () => {
      chapter.imgLink = 'dropbox.com/img0.jpg'
      const propsData = { chapter }

      wrapper = shallowMount(ChapterCard, { localVue, propsData })

      expect(wrapper.vm.imgLink).toEqual('dropbox.com/img0.jpg')
    })

    it('should return false when api status is undefined', () => {
      chapter.imgLink = ''
      const propsData = { chapter }

      wrapper = shallowMount(ChapterCard, { localVue, propsData })

      expect(wrapper.vm.imgLink).toEqual(false)
    })
  })
})

describe('ChapterCard.vue when imgLink not set', () => {
  let wrapper
  let chapter
  let localVue

  beforeEach(() => {
    translationsService.getChapterTitle = jest.fn()
    translationsService.getChapterTitle.mockReturnValue('My title')
    translationsService.getChapterText = jest.fn()
    translationsService.getChapterText.mockReturnValue(['one text'])

    chapter = {
      frTitle: 'Titre du premier paragraphe',
      enTitle: 'Title of the first paragraph',
      imgLink: '',
      frText: 'du blabla',
      enText: 'some blabla',
    }
    const propsData = {
      chapter,
    }
    localVue = createLocalVue()
    localVue.use(VueI18n)
    wrapper = shallowMount(ChapterCard, { localVue, propsData })
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
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

