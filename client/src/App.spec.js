import App from './App.vue'

describe('Component | App', () => {
  let localVue
  beforeEach(() => {
    localVue = createLocalVue()
  })

  describe('template', () => {
    it('should match snapshot', () => {
      // When
      const wrapper = shallowMount(App, { localVue })

      // Then
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
