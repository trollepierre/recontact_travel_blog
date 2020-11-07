import Vue from 'vue'
import VueI18n from 'vue-i18n'
// eslint-disable-next-line import/no-extraneous-dependencies
import AppHeader from './AppHeader.vue'

describe('Component | AppHeader.vue', () => {
  let localVue
  let wrapper

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueI18n)
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
      console.error = jest.fn()
      process.client = jest.fn().mockReturnValue(true)
      window.history.pushState({}, 'Page Title', '/articles/8/')

      wrapper = shallowMount(AppHeader, { localVue })

      return Vue.nextTick().then(() => {
        expect(wrapper).toMatchSnapshot()
      })
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

    it('should not update article id by default', () => {
      // When
      window.history.pushState({}, 'Page Title', '/nope')

      wrapper = shallowMount(AppHeader, { localVue })

      // Then
      expect(wrapper.vm.isArticlePage).toEqual(false)
      expect(wrapper.vm.previousArticleId).toEqual(null)
      expect(wrapper.vm.articleId).toEqual(null)
      expect(wrapper.vm.nextArticleId).toEqual(null)
    })

    it('should update article id', () => {
      // Given
      console.error = jest.fn()
      window.history.pushState({}, 'Page Title', '/articles/8/')

      // When
      wrapper = shallowMount(AppHeader, { localVue })

      // Then
      return Vue.nextTick().then(() => {
        expect(wrapper.vm.isArticlePage).toEqual(true)
        expect(wrapper.vm.previousArticleId).toEqual('/articles/7')
        expect(wrapper.vm.articleId).toEqual('8')
        expect(wrapper.vm.nextArticleId).toEqual('/articles/9')
      })
    })
  })

  describe('methods', () => {
    describe('switchLanguage', () => {
      it('should reload page', () => {
        // Given
        console.error = jest.fn()
        wrapper = shallowMount(AppHeader, { localVue })

        // When
        wrapper.vm.switchLanguage()

        // Then
        expect(window.location.href).toEqual('http://localhost/articles/8/')
      })
    })

    describe('onScroll', () => {
      it('should update last scroll position', () => {
        // Given
        window.pageYOffset = 100
        wrapper = shallowMount(AppHeader, { localVue })

        // When
        wrapper.vm.onScroll()
        // Then
        expect(wrapper.vm.showNavbar).toEqual(false)
        expect(wrapper.vm.lastScrollPosition).toEqual(100)
      })
      it('should not change anything when offset is not enough', () => {
        // Given
        window.pageYOffset = 50
        wrapper = shallowMount(AppHeader, { localVue })

        // When
        wrapper.vm.onScroll()
        // Then
        expect(wrapper.vm.showNavbar).toEqual(true)
        expect(wrapper.vm.lastScrollPosition).toEqual(0)
      })
      it('should not change anything when offset < 0', () => {
        // Given
        window.pageYOffset = -100
        wrapper = shallowMount(AppHeader, { localVue })

        // When
        wrapper.vm.onScroll()
        // Then
        expect(wrapper.vm.showNavbar).toEqual(true)
        expect(wrapper.vm.lastScrollPosition).toEqual(0)
      })
      it('should use scrollTop when offSet not available', () => {
        // Given
        window.pageYOffset = undefined
        document.documentElement.scrollTop = 100
        wrapper = shallowMount(AppHeader, { localVue })

        // When
        wrapper.vm.onScroll()
        // Then
        expect(wrapper.vm.showNavbar).toEqual(false)
        expect(wrapper.vm.lastScrollPosition).toEqual(100)
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
