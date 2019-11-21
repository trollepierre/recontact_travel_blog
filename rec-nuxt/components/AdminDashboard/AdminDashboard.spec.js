import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import AdminDashboard from './AdminDashboard.vue'
import notificationsService from '../../services/services/notifications'
import analyticsService from '../../services/services/analytics-service'
import syncApi from '../../services/api/sync'
import PositionForm from './PositionForm/PositionForm.vue'
import articlesApi from '../../services/api/articles'

describe('Component | AdminDashboard.vue', () => {
  let localVue
  let wrapper

  beforeEach(() => {
    analyticsService.sendAnalytics = jest.fn()
    console.warn = jest.fn()

    localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(VueI18n)
  })

  it('should be named "AdminDashboard"', () => {
    wrapper = shallowMount(AdminDashboard, { localVue })

    expect(wrapper.name()).toEqual('AdminDashboard')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      wrapper = shallowMount(AdminDashboard, { localVue })

      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    let currentPosition
    const router = {
      init: jest.fn(),
      push: jest.fn(),
      history: {},
    }

    beforeEach(() => {
      wrapper = shallowMount(AdminDashboard, { localVue, router })
      notificationsService.information = jest.fn()
      notificationsService.success = jest.fn()
      notificationsService.success.mockResolvedValue({})
      notificationsService.removeInformation = jest.fn()
      notificationsService.removeInformation.mockResolvedValue({})
      currentPosition = { place: 'place', time: 'time' }
    })

    describe('#updateLastPositionData', () => {
      it('should emit updateLastPositionData with current position', () => {
        wrapper.vm.updateLastPositionData(currentPosition)

        expect(wrapper).toEmit('updateLastPositionData', currentPosition)
      })
    })

    describe('#disableButton', () => {
      it('should set isClickSync to true', () => {
        wrapper.vm.disableButton()

        expect(wrapper.vm.isClickedSync).toEqual(true)
      })
    })

    describe('#enableButton', () => {
      it('should set isClickSync to false', () => {
        wrapper.setData({ isClickedSync: true })

        wrapper.vm.enableButton()

        expect(wrapper.vm.isClickedSync).toEqual(false)
      })
    })

    describe('#synchronise', () => {
      beforeEach(() => {
        syncApi.launch = jest.fn()
        syncApi.launch.mockResolvedValue({})
      })

      it('should track event', () => {
        wrapper.vm.synchronise()

        expect(analyticsService.sendAnalytics).toHaveBeenCalledWith(expect.anything(), 'Article List', 'synchronise', 'All articles have been synchronised')
      })

      it('should set isClickSync to true', () => {
        wrapper.vm.synchronise()

        expect(wrapper.vm.isClickedSync).toEqual(true)
      })

      it('should display success toast notification before synchronisation calls', () => {
        wrapper.vm.synchronise()

        const message = 'syncLaunched'
        expect(notificationsService.information).toHaveBeenCalledWith(expect.anything(), message)
      })

      it('should call syncApi', () => {
        wrapper.vm.synchronise()

        expect(syncApi.launch).toHaveBeenCalledWith()
      })

      xit('should display success toast notification when synchronisation succeeds', async () => {
        await wrapper.vm.synchronise()

        expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything())
        const message = 'syncDone'
        expect(notificationsService.success).toHaveBeenCalledWith(expect.anything(), message)
      })

      xit('should enable button', async () => {
        wrapper.setData({ isClickedSync: true })

        await wrapper.vm.synchronise()

        return Vue.nextTick().then(() => {
          expect(wrapper.vm.isClickedSync).toEqual(false)
        })
      })

      xit('should redirect to homepage', async () => {
        await wrapper.vm.synchronise()

        return Vue.nextTick().then(() => {
          expect(router.push).toHaveBeenCalledWith('/')
        })
      })

      xit('should remove information and show error', async () => {
        jest.resetAllMocks()
        syncApi.launch = jest.fn()
        syncApi.launch.mockRejectedValue('message')

        notificationsService.removeInformation = jest.fn()
        notificationsService.removeInformation.mockResolvedValue({})
        notificationsService.error = jest.fn()

        await wrapper.vm.synchronise()

        return Vue.nextTick().then(() => {
          expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything())
          expect(notificationsService.success).not.toHaveBeenCalled()
          expect(router.push).not.toHaveBeenCalled()
          expect(notificationsService.error).toHaveBeenCalledWith(expect.anything(), 'syncError message')
        })
      })
    })

    describe('#updateAll', () => {
      beforeEach(() => {
        articlesApi.updateAll = jest.fn()
        articlesApi.updateAll.mockResolvedValue({})
      })

      it('should set isClickSync to true', () => {
        wrapper.vm.updateAll()

        expect(wrapper.vm.isClickedSync).toEqual(true)
      })

      it('should display success toast notification before synchronisation calls', () => {
        wrapper.vm.updateAll()

        const message = 'syncLaunched'
        expect(notificationsService.information).toHaveBeenCalledWith(expect.anything(), message)
      })

      it('should call syncApi with default value', () => {
        wrapper.vm.updateAll()

        expect(articlesApi.updateAll).toHaveBeenCalledWith(1, 87)
      })

      it('should call syncApi with updated min and max', () => {
        wrapper.vm.min = 4
        wrapper.vm.max = 7

        wrapper.vm.updateAll()

        expect(articlesApi.updateAll).toHaveBeenCalledWith(4, 7)
      })

      it('should display success toast notification when synchronisation succeeds', async () => {
        await wrapper.vm.updateAll()

        expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything())
        const message = 'syncDone'
        expect(notificationsService.success).toHaveBeenCalledWith(expect.anything(), message)
      })

      it('should enable button', async () => {
        wrapper.setData({ isClickedSync: true })

        await wrapper.vm.updateAll()

        return Vue.nextTick().then(() => {
          expect(wrapper.vm.isClickedSync).toEqual(false)
        })
      })

      it('should redirect to homepage', async () => {
        await wrapper.vm.updateAll()

        return Vue.nextTick().then(() => {
          expect(router.push).toHaveBeenCalledWith('/')
        })
      })

      it('should remove information and show error', async () => {
        jest.resetAllMocks()
        articlesApi.updateAll = jest.fn()
        articlesApi.updateAll.mockRejectedValue('message')

        notificationsService.removeInformation = jest.fn()
        notificationsService.removeInformation.mockResolvedValue({})
        notificationsService.error = jest.fn()

        await wrapper.vm.updateAll()

        return Vue.nextTick().then(() => {
          expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything())
          expect(notificationsService.success).not.toHaveBeenCalled()
          expect(router.push).not.toHaveBeenCalled()
          expect(notificationsService.error).toHaveBeenCalledWith(expect.anything(), 'syncError message')
        })
      })
    })

    describe('#deleteAll', () => {
      beforeEach(() => {
        articlesApi.deleteAll = jest.fn()
        articlesApi.deleteAll.mockResolvedValue({})
      })

      it('should set isClickSync to true', () => {
        wrapper.vm.deleteAll()

        expect(wrapper.vm.isClickedSync).toEqual(true)
      })

      it('should display success toast notification before synchronisation calls', () => {
        wrapper.vm.deleteAll()

        const message = 'syncLaunched'
        expect(notificationsService.information).toHaveBeenCalledWith(expect.anything(), message)
      })

      it('should call syncApi', () => {
        wrapper.vm.deleteAll()

        expect(articlesApi.deleteAll).toHaveBeenCalledWith()
      })

      xit('should display success toast notification when synchronisation succeeds', async () => {
        await wrapper.vm.deleteAll()

        expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything())
        const message = 'syncDone'
        expect(notificationsService.success).toHaveBeenCalledWith(expect.anything(), message)
      })

      xit('should enable button', async () => {
        wrapper.setData({ isClickedSync: true })

        await wrapper.vm.deleteAll()

        return Vue.nextTick().then(() => {
          expect(wrapper.vm.isClickedSync).toEqual(false)
        })
      })

      xit('should redirect to homepage', async () => {
        await wrapper.vm.deleteAll()

        return Vue.nextTick().then(() => {
          expect(router.push).toHaveBeenCalledWith('/')
        })
      })

      xit('should remove information and show error', async () => {
        jest.resetAllMocks()
        articlesApi.deleteAll = jest.fn()
        articlesApi.deleteAll.mockRejectedValue('message')

        notificationsService.removeInformation = jest.fn()
        notificationsService.removeInformation.mockResolvedValue({})
        notificationsService.error = jest.fn()

        await wrapper.vm.deleteAll()

        return Vue.nextTick().then(() => {
          expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything())
          expect(notificationsService.success).not.toHaveBeenCalled()
          expect(router.push).not.toHaveBeenCalled()
          expect(notificationsService.error).toHaveBeenCalledWith(expect.anything(), 'syncError message')
        })
      })
    })

    describe('#deleteAndSyncAll', () => {
      beforeEach(() => {
        articlesApi.deleteAndSyncAll = jest.fn()
        articlesApi.deleteAndSyncAll.mockResolvedValue({})
      })

      it('should set isClickSync to true', () => {
        wrapper.vm.deleteAndSyncAll()

        expect(wrapper.vm.isClickedSync).toEqual(true)
      })

      it('should display success toast notification before synchronisation calls', () => {
        wrapper.vm.deleteAndSyncAll()

        const message = 'syncLaunched'
        expect(notificationsService.information).toHaveBeenCalledWith(expect.anything(), message)
      })

      it('should call syncApi', () => {
        wrapper.vm.deleteAndSyncAll()

        expect(articlesApi.deleteAndSyncAll).toHaveBeenCalledWith()
      })

      xit('should display success toast notification when synchronisation succeeds', async () => {
        await wrapper.vm.deleteAndSyncAll()

        expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything())
        const message = 'syncDone'
        expect(notificationsService.success).toHaveBeenCalledWith(expect.anything(), message)
      })

      xit('should enable button', async () => {
        wrapper.setData({ isClickedSync: true })

        await wrapper.vm.deleteAndSyncAll()

        return Vue.nextTick().then(() => {
          expect(wrapper.vm.isClickedSync).toEqual(false)
        })
      })

      xit('should redirect to homepage', async () => {
        await wrapper.vm.deleteAndSyncAll()

        return Vue.nextTick().then(() => {
          expect(router.push).toHaveBeenCalledWith('/')
        })
      })

      xit('should remove information and show error', async () => {
        jest.resetAllMocks()
        articlesApi.deleteAndSyncAll = jest.fn()
        articlesApi.deleteAndSyncAll.mockRejectedValue('message')

        notificationsService.removeInformation = jest.fn()
        notificationsService.removeInformation.mockResolvedValue({})
        notificationsService.error = jest.fn()

        await wrapper.vm.deleteAndSyncAll()

        return Vue.nextTick().then(() => {
          expect(notificationsService.removeInformation).toHaveBeenCalledWith(expect.anything())
          expect(notificationsService.success).not.toHaveBeenCalled()
          expect(router.push).not.toHaveBeenCalled()
          expect(notificationsService.error).toHaveBeenCalledWith(expect.anything(), 'syncError message')
        })
      })
    })

    describe('#goToSubscriptions', () => {
      it('should ', () => {
        wrapper.vm.goToSubscriptions()

        expect(router.push).toHaveBeenCalledWith('/subscriptions')
      })
    })

    describe('#trackEvent', () => {
      it('should call send analytics service', () => {
        wrapper.vm.trackEvent()

        expect(analyticsService.sendAnalytics).toHaveBeenCalledWith(expect.anything(), 'Article List', 'synchronise', 'All articles have been synchronised')
      })
    })

    describe('#goToHome', () => {
      it('should enable button', () => {
        wrapper.setData({ isClickedSync: true })

        wrapper.vm.goToHome()

        expect(wrapper.vm.isClickedSync).toEqual(false)
      })

      it('should redirect to homepage', () => {
        wrapper.vm.goToHome()

        expect(router.push).toHaveBeenCalledWith('/')
      })
    })
  })

  describe.skip('events', () => {
    describe('clicking on button "Envoyer"', () => {
      it('should call updateLastPosition', () => {
        wrapper = shallowMount(AdminDashboard, { localVue })
        wrapper.vm.updateLastPosition = jest.fn()

        wrapper.find('button').trigger('click')

        expect(wrapper.vm.updateLastPosition).toHaveBeenCalled()
      })
    })
  })

  describe('locales', () => {
    const languages = Object.keys(AdminDashboard.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(AdminDashboard.i18n.messages.fr)

        it('contains 8 locales', () => {
          expect(locales).toHaveLength(8)
          expect(locales).toEqual([
            'getNewArticles',
            'deleteAllArticles',
            'updateAllArticles',
            'deleteAndSyncAllArticles',
            'getSubscribers',
            'syncLaunched',
            'syncDone',
            'syncError',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(AdminDashboard.i18n.messages.en)

        it('contains 8 locales', () => {
          expect(locales).toHaveLength(8)
          expect(locales).toEqual([
            'getNewArticles',
            'deleteAllArticles',
            'updateAllArticles',
            'deleteAndSyncAllArticles',
            'getSubscribers',
            'syncLaunched',
            'syncDone',
            'syncError',
          ])
        })
      })
    })
  })
})
