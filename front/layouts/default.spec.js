import Vuex from 'vuex'
import Layout from './default.vue'

describe('default layout', () => {
  let localVue
  let store
let consoleError

  beforeEach(() => {
    consoleError = console.error
    console.error = jest.fn()
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = theme => new Vuex.Store({
      actions: {},
      state: { theme },
    })
  })

  afterEach(() => {
    console.error = consoleError
  })

  it('should return default layout with aliceblue by default', () => {
    const wrapper = shallowMount(Layout, { localVue, store: store('light') })

    expect(wrapper).toMatchSnapshot()
  })

  it('should return default layout with dark', () => {
    const wrapper = shallowMount(Layout, { localVue, store: store('dark') })

    expect(wrapper.classes()).toContain('dark-mode')
  })

  it('should return default layout with new', () => {
    const wrapper = shallowMount(Layout, { localVue, store: store('new') })

    expect(wrapper.classes()).toContain('new-mode')
  })
})
