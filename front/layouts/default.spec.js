import Vuex from 'vuex'
import Layout from './default.vue'

describe('default layout', () => {
  let localVue
  let store

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = theme => new Vuex.Store({
      actions: {},
      state: { theme },
    })
  })

  it('should return default layout with aliceblue by default', () => {
    console.error = jest.fn()

    const wrapper = shallowMount(Layout, { localVue, store: store('light') })

    expect(wrapper).toMatchSnapshot()
  })

  it('should return default layout with dark', () => {
    console.error = jest.fn()

    const wrapper = shallowMount(Layout, { localVue, store: store('dark') })

    expect(wrapper.classes()).toContain('dark-mode')
  })

  it('should return default layout with new', () => {
    console.error = jest.fn()

    const wrapper = shallowMount(Layout, { localVue, store: store('new') })

    expect(wrapper.classes()).toContain('new-mode')
  })
})
