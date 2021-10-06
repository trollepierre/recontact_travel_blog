import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import VueI18n from 'vue-i18n'
import Vuex from 'vuex' // eslint-disable-line import/no-extraneous-dependencies
import VueRouter from 'vue-router' // eslint-disable-line import/no-extraneous-dependencies

import AppButton from '@/components/AppButton/AppButton'
import ArticleCard from './ArticleCard.vue'
import articlesApi from '../../services/api/articles'
import chaptersApi from '../../services/api/chapters'
import notificationsService from '../../services/services/notifications'
import translationsService from '../../services/services/translations'

describe('Component | ArticleCard.vue', () => {
  let localVue
  let store
  let wrapper
  const galleryLink = 'https://www.dropbox.com/sh/k79oskpopi9lm8v/AABst0JslmKYw3Rhx9BjwJxMa?dl=0'
  let article
  let propsData
  const dropboxId = '58'
  const router = {
    init: jest.fn(),
    push: jest.fn(),
    history: {},
  }

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueLazyload)
    localVue.use(VueRouter)
    localVue.use(Vuex)

    article = {
      dropboxId,
      enTitle: 'Pierre in Costa Rica',
      frTitle: 'Pierre au Costa Rica',
      imgLink: 'webf',
      galleryLink,
    }
    propsData = {
      article,
    }
    store = new Vuex.Store({ actions: {}, state: { locale: 'en' } })
    wrapper = shallowMount(ArticleCard, {
      localVue, propsData, router, store,
    })
  })

  describe('when adminMode is not defined', () => {
    beforeEach(() => {
      translationsService.getTitle = jest.fn()
      translationsService.getTitle.mockReturnValue('Pierre somewhere')
      wrapper = shallowMount(ArticleCard, {
        localVue, propsData, router, store,
      })
    })

    describe('template', () => {
      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('should match snapshot when lazy is false', () => {
        propsData = {
          article,
          lazy: false,
        }
        wrapper = shallowMount(ArticleCard, {
          localVue, propsData, router, store,
        })
        expect(wrapper).toMatchSnapshot()
      })

      it('should have enabled article button', () => {
        expect(wrapper.find('.article__view-button').disabled).toBeUndefined()
      })

      it('should have enabled dropbox button', () => {
        expect(wrapper.find('.article__dropbox-button').disabled).toBeUndefined()
      })
    })

    describe('$data', () => {
      it('should have isUpdateClicked property set to false', () => {
        expect(wrapper.vm.isUpdateClicked).toEqual(false)
      })
      it('should have isDeleteClicked property set to false', () => {
        expect(wrapper.vm.isDeleteClicked).toEqual(false)
      })
    })

    describe('computed', () => {
      describe('#articleUrl', () => {
        it('should return /articles/:id', () => {
          expect(wrapper.vm.articleUrl).toEqual('/articles/58')
        })
      })

      describe('#articleTitle', () => {
        it('should return articleName', () => {
          expect(wrapper.vm.articleTitle).toEqual('Pierre somewhere')
        })
      })
    })

    describe('methods', () => {
      describe('#disableUpdateButton', () => {
        it('should set isUpdateClicked to true', () => {
          wrapper.vm.disableUpdateButton()

          expect(wrapper.vm.isUpdateClicked).toEqual(true)
        })
      })

      describe('#viewArticle', () => {
        it('should redirect to /articles/:idArticle', () => {
          wrapper = shallowMount(ArticleCard, {
            localVue, propsData, router, store,
          })

          wrapper.vm.viewArticle()

          expect(router.push).toHaveBeenCalledWith('/articles/58')
        })
      })

      describe('#goToArticle', () => {
        it('should redirect to /articles/:idArticle', () => {
          wrapper = shallowMount(ArticleCard, {
            localVue, propsData, router, store,
          })

          wrapper.vm.goToArticle()

          expect(router.push).toHaveBeenCalledWith('/articles/58')
        })
      })

      describe('#updateArticle', () => {
        beforeEach(() => {
          articlesApi.update = jest.fn()
          notificationsService.information = jest.fn()
          notificationsService.warn = jest.fn()

          notificationsService.error = jest.fn()
        })

        it('should set isUpdateClicked to true', () => {
          articlesApi.update.mockResolvedValue({})

          wrapper.vm.updateArticle()

          expect(wrapper.vm.isUpdateClicked).toEqual(true)
        })

        it('should call delete article api', () => {
          articlesApi.update.mockResolvedValue({})

          wrapper.vm.updateArticle()

          expect(articlesApi.update).toHaveBeenCalledWith(dropboxId)
        })

        it('should display success toast notification before synchronisation calls', () => {
          articlesApi.update.mockResolvedValue({})

          wrapper.vm.updateArticle()

          const message = 'The synchronisation is launched! Please wait...'
          expect(notificationsService.information).toHaveBeenCalledWith(message)
        })

        it('should redirect to /article/id', () => {
          localVue = createLocalVue()
          localVue.use(VueI18n)
          localVue.use(VueRouter)
          localVue.use(Vuex)
          const consoleError = console.error
          console.error = jest.fn()
          articlesApi.update.mockResolvedValue({})
          wrapper = shallowMount(ArticleCard, {
            localVue, propsData, router, store,
          })

          wrapper.vm.updateArticle()

          return Vue.nextTick().then(() => {
            expect(router.push).toHaveBeenCalledWith('/articles/58')

            console.error = consoleError
          })
        })

        it('should display success toast notification when synchronisation succeeds', () => {
          articlesApi.update.mockResolvedValue({})

          wrapper.vm.updateArticle()

          return Vue.nextTick().then(() => {
            const message = 'The synchronisation succeeds!'
            expect(notificationsService.information).toHaveBeenCalledWith(message)
          })
        })

        // xit('should display error toast notification when synchronisation fails', () => {
        //   articlesApi.update.mockRejectedValue(new Error('Expected error'))
        //
        //   wrapper.vm.updateArticle()
        //
        //   return Vue.nextTick().then(() => {
        //
        //     const message = 'syncError Error: Expected error'
        //     expect(notificationsService.error).toHaveBeenCalledWith(message)
        //   })
        // })
      })
    })

    describe('events', () => {
      describe('clicking on button "Voir l\'article"', () => {
        it('should redirect to /article/id', () => {
          wrapper.findAllComponents(AppButton).at(0).vm.$emit('click')

          expect(router.push).toHaveBeenCalledWith('/articles/58')
        })
      })

      describe('clicking on title', () => {
        it('should redirect to /article/id', () => {
          wrapper.find('.article__link').trigger('click')

          expect(router.push).toHaveBeenCalledWith('/articles/58')
        })
      })

      describe('clicking on image', () => {
        it('should redirect to /article/id', () => {
          wrapper.find('.article__content').trigger('click')

          expect(router.push).toHaveBeenCalledWith('/articles/58')
        })
      })
    })
  })

  describe('when adminMode is true', () => {
    beforeEach(() => {
      translationsService.getTitle = jest.fn()
      translationsService.getTitle.mockReturnValue('Pierre somewhere')
      propsData = {
        article,
        adminMode: true,
      }
      wrapper = shallowMount(ArticleCard, {
        localVue, propsData, router, store,
      })
    })

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })

    describe('clicking on button "repare the article"', () => {
      beforeEach(() => {
        articlesApi.update = jest.fn()
        articlesApi.update.mockResolvedValue({})
        notificationsService.information = jest.fn()
        notificationsService.warn = jest.fn()

        notificationsService.error = jest.fn()
      })

      it('should call articlesApi', () => {
        wrapper.findAllComponents(AppButton).at(1).vm.$emit('click')

        expect(articlesApi.update).toHaveBeenCalledWith('58')
        expect(wrapper.vm.isUpdateClicked).toEqual(true)
      })
    })

    describe('clicking on button "repare the chapter"', () => {
      beforeEach(() => {
        chaptersApi.update = jest.fn()
        chaptersApi.update.mockResolvedValue({})
        notificationsService.information = jest.fn()
        notificationsService.warn = jest.fn()

        notificationsService.error = jest.fn()
      })

      it('should not call chaptersApi when input unchanged', () => {
        console.log = jest.fn()

        wrapper.findAllComponents(AppButton).at(0).vm.$emit('click')

        expect(notificationsService.error).toHaveBeenCalledOnceWith('incorrect chapter number: 0')
        expect(chaptersApi.update).not.toHaveBeenCalled()
      })

      it('should call chaptersApi when input changed', () => {
        wrapper.setData({ chapterToRepair: '2' })
        wrapper.findAllComponents(AppButton).at(0).vm.$emit('click')

        expect(chaptersApi.update).toHaveBeenCalledWith('58', 2)
        expect(wrapper.vm.isUpdateChapterClicked).toEqual(true)
      })
    })
  })

  describe('locales', () => {
    const languages = Object.keys(ArticleCard.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(ArticleCard.i18n.messages.fr)

        it('contains 11 locales', () => {
          expect(locales).toHaveLength(11)
          expect(locales).toEqual([
            'repairArticle',
            'repairChapter',
            'deleteArticle',
            'goToArticle',
            'viewGallery',
            'syncLaunched',
            'syncDone',
            'syncError',
            'deleteLaunched',
            'deleteDone',
            'deleteError',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(ArticleCard.i18n.messages.en)

        it('contains 11 locales', () => {
          expect(locales).toHaveLength(11)
          expect(locales).toEqual([
            'repairArticle',
            'repairChapter',
            'deleteArticle',
            'goToArticle',
            'viewGallery',
            'syncLaunched',
            'syncDone',
            'syncError',
            'deleteLaunched',
            'deleteDone',
            'deleteError',
          ])
        })
      })
    })
  })
})
