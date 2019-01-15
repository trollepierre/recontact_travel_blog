import VueRouter from 'vue-router'
import App from './App.vue'

describe('Component | App', () => {
  let localVue
  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueRouter)
  })

  describe('template', () => {
    it('should match snapshot', () => {
      const wrapper = shallowMount(App, { localVue })

      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
