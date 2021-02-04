import AppButton from './AppButton.vue'

describe('Component | AppButton.vue', () => {
  let localVue
  let wrapper

  beforeEach(() => {
    localVue = createLocalVue()
  })

  describe('template', () => {
    it('should match snapshot', () => {
      wrapper = shallowMount(AppButton, { localVue })

      expect(wrapper).toMatchSnapshot()
    })
  })
})
