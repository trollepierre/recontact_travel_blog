import VueI18n from 'vue-i18n'
import Paragraphs from './Paragraphs.vue'

describe('Component | Paragraphs.vue', () => {
  let wrapper
  let propsData
  let localVue

  beforeEach(() => {
    console.warn = jest.fn()
    propsData = { title: 'title', chapterText: ['voilà', ''] }
    localVue = createLocalVue()
    localVue.use(VueI18n)
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

    it('should match snapshot with video on click on loading button', async () => {
    propsData = { title: 'title', chapterText: ['https://www.youtu.be/embed/123'] }
      wrapper = shallowMount(Paragraphs, { propsData, localVue })
      await wrapper.find('button').trigger('click')
      expect(wrapper).toMatchSnapshot()
    })
  })
})

