import Vuex from 'vuex'
import ThemeApi from '@/services/api/theme'
import NewModeToggle from './NewModeToggle.vue'

describe('Component | NewModeToggle.vue', () => {
  let localVue
  let store
  let wrapper
  let setThemeModeMock

  beforeEach(() => {
    setThemeModeMock = jest.fn()
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store({
      actions: {},
      state: { theme: 'light' },
      mutations: {
        SET_THEME_MODE: setThemeModeMock,
      },
    })
    ThemeApi.send = jest.fn().mockResolvedValue('ok')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      wrapper = shallowMount(NewModeToggle, { localVue, store })

      expect(wrapper).toMatchInlineSnapshot(`
        <app-button-stub
          allowmultipleclick="true"
          class="new-button"
          hide="false"
          tag="button"
          text="🎨"
        />
      `)
    })

    it('should match snapshot on new theme', () => {
      store = new Vuex.Store({
        actions: {},
        state: { theme: 'new' },
        mutations: {
          SET_THEME_MODE: setThemeModeMock,
        },
      })

      wrapper = shallowMount(NewModeToggle, { localVue, store })

      expect(wrapper.html()).toContain('🎨')
    })
  })

  describe('methods', () => {
    describe('toggleNewMode', () => {
      it('should send Theme to api and call SET_THEME_MODE with light theme, when theme is new', () => {
        // Given
        store = new Vuex.Store({
          actions: {},
          state: { theme: 'new' },
          mutations: {
            SET_THEME_MODE: setThemeModeMock,
          },
        })
        wrapper = shallowMount(NewModeToggle, { localVue, store })

        // When
        wrapper.vm.toggleNewMode()

        // Then
        expect(ThemeApi.send).toHaveBeenCalledOnceWith('new', 'light')
        expect(setThemeModeMock).toHaveBeenCalledOnceWith(
          { theme: 'new' },
          'light',
        )
      })

      it('should send Theme to api and call SET_THEME_MODE with new theme, when theme is light', () => {
        // Given
        wrapper = shallowMount(NewModeToggle, { localVue, store })

        // When
        wrapper.vm.toggleNewMode()

        // Then
        expect(ThemeApi.send).toHaveBeenCalledOnceWith('light', 'new')
        expect(setThemeModeMock).toHaveBeenCalledOnceWith(
          { theme: 'light' },
          'new',
        )
      })
    })
  })
})
