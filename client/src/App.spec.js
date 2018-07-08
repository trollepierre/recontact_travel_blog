import App from './App.vue'
import VueRouter from 'vue-router'

describe('Component | App', () => {
  let localVue
  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueRouter)
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
