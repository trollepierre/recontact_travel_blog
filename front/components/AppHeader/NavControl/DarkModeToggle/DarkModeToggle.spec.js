import Vuex from 'vuex'
import DarkModeToggle from './DarkModeToggle.vue'

describe('Component | DarkModeToggle.vue', () => {
  let localVue
  let store
  let wrapper
  let setThemeModeMock
  let getThemeModeMock

  beforeEach(() => {
    setThemeModeMock = jest.fn()
    getThemeModeMock = jest.fn()
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store({
      actions: {},
      state: { theme: 'light' },
      mutations: {
        SET_THEME_MODE: setThemeModeMock,
        GET_THEME_MODE: getThemeModeMock,
      },
    })
  })

  describe('template', () => {
    it('should match snapshot', () => {
      wrapper = shallowMount(DarkModeToggle, { localVue, store })

      expect(wrapper).toMatchInlineSnapshot(
        '<app-button-stub text="🌙️" tag="button" allowmultipleclick="true" class="dark-button"></app-button-stub>',
      )
    })

    it('should match snapshot on dark theme', () => {
      store = new Vuex.Store({
        actions: {},
        state: { theme: 'dark' },
        mutations: {
          SET_THEME_MODE: setThemeModeMock,
          GET_THEME_MODE: getThemeModeMock,
        },
      })

      wrapper = shallowMount(DarkModeToggle, { localVue, store })

      expect(wrapper.html()).toContain('☀️')
    })
  })

  describe('mount', () => {
    it('should call get theme mode', () => {
      wrapper = shallowMount(DarkModeToggle, { localVue, store })

      expect(getThemeModeMock).toHaveBeenCalledOnceWith({ theme: 'light' }, undefined)
    })
  })

  describe('methods', () => {
    describe('toggleDarkMode', () => {
      it('should send Theme to api and call SET_THEME_MODE with light theme, when theme is dark', () => {
        // Given
        store = new Vuex.Store({
          actions: {},
          state: { theme: 'dark' },
          mutations: {
            SET_THEME_MODE: setThemeModeMock,
            GET_THEME_MODE: getThemeModeMock,
          },
        })
        wrapper = shallowMount(DarkModeToggle, { localVue, store })

        // When
        wrapper.vm.toggleDarkMode()

        // Then
        expect(setThemeModeMock).toHaveBeenCalledOnceWith({ theme: 'dark' }, 'light')
      })

      it('should send Theme to api and call SET_THEME_MODE with dark theme, when theme is light', () => {
        // Given
        wrapper = shallowMount(DarkModeToggle, { localVue, store })

        // When
        wrapper.vm.toggleDarkMode()

        // Then
        expect(setThemeModeMock).toHaveBeenCalledOnceWith({ theme: 'light' }, 'dark')
      })
    })
  })
})
