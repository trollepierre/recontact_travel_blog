import VueI18n from 'vue-i18n'
// eslint-disable-next-line import/no-extraneous-dependencies
import VueRouter from 'vue-router'
import AppHeader from './AppHeader.vue'

describe('Component | AppHeader.vue', () => {
  let localVue
  let wrapper
  const router = {
    init: jest.fn(),
    push: jest.fn(),
    history: {},
  }

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)
  })

  it('should be named "AppHeader"', () => {
    wrapper = shallowMount(AppHeader, { localVue })

    expect(wrapper.name()).toEqual('AppHeader')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      wrapper = shallowMount(AppHeader, { localVue })

      expect(wrapper).toMatchSnapshot()
    })

    it('should match snapshot on article page', () => {
      process.client = jest.fn().mockReturnValue(true)
      window.history.pushState({}, 'Page Title', '/articles/')

      wrapper = shallowMount(AppHeader, { localVue })

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('mount', () => {
    it('should add scroll event listener', () => {
      // Given
      window.addEventListener = jest.fn()

      // When
      wrapper = shallowMount(AppHeader, { localVue })

      // Then
      expect(window.addEventListener).toHaveBeenCalledWith('scroll', wrapper.vm.onScroll)
    })
  })

  describe('methods', () => {
    describe('#viewNextArticle', () => {
      it('should route to next article', () => {
        const articleId = '43'
        process.client = jest.fn().mockReturnValue(true)
        window.history.pushState({}, 'Page Title', `/articles/${articleId}`)
        wrapper = shallowMount(AppHeader, { localVue, router })

        wrapper.vm.viewNextArticle()

        expect(router.push).toHaveBeenCalledWith('/articles/44')
      })
    })

    describe('#viewPreviousArticle', () => {
      it('should route to previous article', () => {
        const articleId = '43'
        process.client = jest.fn().mockReturnValue(true)
        window.history.pushState({}, 'Page Title', `/articles/${articleId}`)
        wrapper = shallowMount(AppHeader, { localVue, router })

        wrapper.vm.viewPreviousArticle()

        expect(router.push).toHaveBeenCalledWith('/articles/42')
      })

      it('should not route to article id less than 1', () => {
        const articleId = '1'
        process.client = jest.fn().mockReturnValue(true)
        window.history.pushState({}, 'Page Title', `/articles/${articleId}`)
        wrapper = shallowMount(AppHeader, { localVue, router })

        wrapper.vm.viewPreviousArticle()

        expect(router.push).not.toHaveBeenCalled()
      })
    })

    xdescribe('#onScroll', () => {
      it('should be tested in utils', () => {})
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

  describe('events', () => {
    describe('on click on previous button', () => {
      it('should go to previous article', () => {
        // Given
        process.client = jest.fn().mockReturnValue(true)
        window.history.pushState({}, 'Page Title', '/articles/46')
        wrapper = shallowMount(AppHeader, { localVue })
        wrapper.vm.viewPreviousArticle = jest.fn()

        // When
        wrapper.find('button.previous').trigger('click')

        // Then
        expect(wrapper.vm.viewPreviousArticle).toHaveBeenCalled()
      })
    })

    describe('on click on next button', () => {
      it('should go to next article', () => {
        // Given
        process.client = jest.fn().mockReturnValue(true)
        window.history.pushState({}, 'Page Title', '/articles/')
        wrapper = shallowMount(AppHeader, { localVue })
        wrapper.vm.viewNextArticle = jest.fn()

        // When
        wrapper.find('button.next').trigger('click')

        // Then
        expect(wrapper.vm.viewNextArticle).toHaveBeenCalled()
      })
    })

    xdescribe('clicking on button "Laisser un message"', () => {
      it('should call displayFeedbackModal', () => {
        wrapper.vm.displayFeedbackModal = jest.fn()

        wrapper
          .find('button.navbar-action.navbar-action__suggestion')
          .trigger('click')

        expect(wrapper.vm.displayFeedbackModal).toHaveBeenCalled()
      })
    })

    xdescribe('clicking on button "S\'abonner"', () => {
      it('should call displaySubscribeModal', () => {
        wrapper.vm.displaySubscribeModal = jest.fn()

        wrapper
          .find('button.navbar-action.navbar-action__subscribe')
          .trigger('click')

        expect(wrapper.vm.displaySubscribeModal).toHaveBeenCalled()
      })
    })
  })

  describe('locales', () => {
    const languages = Object.keys(AppHeader.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      it('contains fr locales', () => {
        const locales = Object.keys(AppHeader.i18n.messages.fr)
        expect(locales).toMatchInlineSnapshot(`
          Array [
            "subscribe",
            "suggestion",
            "problem",
            "tdm",
            "home",
            "logo",
            "otherLanguage",
            "otherUrl",
            "previousArticle",
            "nextArticle",
            "article",
          ]
        `)
      })

      it('contains en locales', () => {
        const locales = Object.keys(AppHeader.i18n.messages.en)
        expect(locales).toMatchInlineSnapshot(`
          Array [
            "subscribe",
            "suggestion",
            "problem",
            "tdm",
            "home",
            "logo",
            "otherLanguage",
            "otherUrl",
            "previousArticle",
            "nextArticle",
            "article",
          ]
        `)
      })
    })
  })
})
