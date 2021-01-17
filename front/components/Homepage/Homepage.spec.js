import VueI18n from 'vue-i18n'
import Homepage from './Homepage.vue'

jest.mock('@/components/Homepage/Map/Map', () => () => '<div>Map</div>')

describe('Component | Homepage.vue', () => {
  let localVue
  let wrapper

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueI18n)
    wrapper = shallowMount(Homepage, { localVue })
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
