import VueI18n from 'vue-i18n'
import NavControl from './NavControl.vue'

describe('Component | NavControl.vue', () => {
  let localVue
  let wrapper

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueI18n)
  })

  describe('template', () => {
    it('should match snapshot', () => {
      wrapper = shallowMount(NavControl, { localVue })

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    describe('switchLanguage', () => {
      it('should reload page', () => {
        // Given
        console.error = jest.fn()
        wrapper = shallowMount(NavControl, { localVue })

        // When
        wrapper.vm.switchLanguage()

        // Then
        expect(window.location.href).toEqual('http://localhost/')
      })
    })

    xdescribe('#displayFeedbackModal', () => {
      it('should display the feedback-modal', () => {
        wrapper.vm.$modal.show = jest.fn()

        wrapper.vm.displayFeedbackModal()

        expect(wrapper.vm.$modal.show).toHaveBeenCalledWith('feedback-modal')
      })
    })

    xdescribe('#displaySubscribeModal', () => {
      it('should display the subscribe-modal', () => {
        wrapper.vm.$modal.show = jest.fn()

        wrapper.vm.displaySubscribeModal()

        expect(wrapper.vm.$modal.show).toHaveBeenCalledWith('subscribe-modal')
      })
    })
  })

  describe('locales', () => {
    const languages = Object.keys(NavControl.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      it('contains fr locales', () => {
        const locales = Object.keys(NavControl.i18n.messages.fr)
        expect(locales).toMatchInlineSnapshot(`
          Array [
            "subscribe",
            "suggestion",
            "tdm",
            "logo",
            "otherLanguage",
            "otherUrl",
          ]
        `)
      })

      it('contains en locales', () => {
        const locales = Object.keys(NavControl.i18n.messages.en)
        expect(locales).toMatchInlineSnapshot(`
          Array [
            "subscribe",
            "suggestion",
            "tdm",
            "logo",
            "otherLanguage",
            "otherUrl",
          ]
        `)
      })
    })
  })
})
