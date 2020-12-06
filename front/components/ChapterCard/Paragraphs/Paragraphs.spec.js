import Paragraphs from './Paragraphs.vue'

describe('Component | Paragraphs.vue', () => {
  let wrapper
  let propsData

  beforeEach(() => {
    propsData = { title: 'title', chapterText: ['voilà', ''] }
  })

  describe('template', () => {
    it('should match snapshot with text', () => {
      wrapper = shallowMount(Paragraphs, { propsData })
      expect(wrapper).toMatchSnapshot()
    })

    it('should match snapshot with link', () => {
    propsData = { title: 'title', chapterText: ['https://www.rec.me'] }
      wrapper = shallowMount(Paragraphs, { propsData })
      expect(wrapper).toMatchSnapshot()
    })

    it('should match snapshot with video', () => {
    propsData = { title: 'title', chapterText: ['https://www.youtu.be/embed/123'] }
      wrapper = shallowMount(Paragraphs, { propsData })
      expect(wrapper).toMatchSnapshot()
    })
  })
})

