import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'
import PositionForm from './PositionForm.vue'
import positionsApi from '../../../api/positions'
import notificationsService from '../../../services/notifications'

describe('Component | PositionForm.vue', () => {
  let localVue
  let wrapper

  beforeEach(() => {
    console.warn = jest.fn()

    localVue = createLocalVue()
    localVue.use(VueAnalytics, { id: '12' })
    localVue.use(VueI18n)
  })

  it('should be named "PositionForm"', () => {
    wrapper = shallowMount(PositionForm, { localVue })

    expect(wrapper.name()).toEqual('PositionForm')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      wrapper = shallowMount(PositionForm, { localVue })

      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    let currentPosition

    beforeEach(() => {
      wrapper = shallowMount(PositionForm, { localVue })
      currentPosition = { place: 'place', time: 'time' }
      wrapper.setData(currentPosition)
      positionsApi.add = jest.fn()
      positionsApi.add.mockResolvedValue()
      notificationsService.success = jest.fn()
      notificationsService.error = jest.fn()
    })

    describe('#submit', () => {
      it('should prevent default', () => {
        const event = { preventDefault: jest.fn() }

        wrapper.vm.submit(event)

        expect(event.preventDefault).toHaveBeenCalledWith()
      })

      it('should update last position', () => {
        const event = { preventDefault: jest.fn() }

        wrapper.vm.submit(event)

        expect(positionsApi.add).toHaveBeenCalledWith(currentPosition)
      })
    })

    describe('#updateLastPosition', () => {
      describe('when position is null', () => {
        beforeEach(() => {
          currentPosition = { place: null, time: 'time' }
          wrapper.setData(currentPosition)
        })

        it('should not add position', () => {
          wrapper.vm.updateLastPosition()

          expect(positionsApi.add).not.toHaveBeenCalled()
        })

        it('should send error notification', () => {
          wrapper.vm.updateLastPosition()

          expect(notificationsService.error).toHaveBeenCalledWith(expect.anything(), 'positionNotUpdated')
        })
      })

      describe('when time is null', () => {
        beforeEach(() => {
          currentPosition = { place: 'place', time: null }
          wrapper.setData(currentPosition)
        })

        it('should not add position', () => {
          wrapper.vm.updateLastPosition()

          expect(positionsApi.add).not.toHaveBeenCalled()
        })

        it('should send error notification', () => {
          wrapper.vm.updateLastPosition()

          expect(notificationsService.error).toHaveBeenCalledWith(expect.anything(), 'positionNotUpdated')
        })
      })

      it('should add current position to api', () => {
        wrapper.vm.updateLastPosition()

        expect(positionsApi.add).toHaveBeenCalledWith(currentPosition)
      })

      it('should emit current position', async () => {
        await wrapper.vm.updateLastPosition()

        expect(wrapper).toEmit('updateLastPositionData', currentPosition)
      })

      it('should reset position', async () => {
        await wrapper.vm.updateLastPosition()

        expect(wrapper.vm.place).toEqual(null)
        expect(wrapper.vm.time).toEqual(null)
      })

      it('should send success notifications', async () => {
        notificationsService.success.mockResolvedValue()

        await wrapper.vm.updateLastPosition()

        return Vue.nextTick().then(() => {
          expect(notificationsService.success).toHaveBeenCalledWith(expect.anything(), 'positionUpdated')
        })
      })
    })

    describe('#updateLastPositionData', () => {
      it('should emit last position', () => {
        wrapper.vm.updateLastPositionData()

        expect(wrapper).toEmit('updateLastPositionData', currentPosition)
      })

      it('should reset position', () => {
        wrapper.vm.updateLastPositionData()

        expect(wrapper.vm.place).toEqual(null)
        expect(wrapper.vm.time).toEqual(null)
      })
    })

    describe('#resetPosition', () => {
      it('should set position values to null', () => {
        wrapper.vm.resetPosition()

        expect(wrapper.vm.place).toEqual(null)
        expect(wrapper.vm.time).toEqual(null)
      })
    })
  })

  describe('events', () => {
    describe('clicking on button "Envoyer"', () => {
      it('should call updateLastPosition', () => {
        wrapper = shallowMount(PositionForm, { localVue })
        wrapper.vm.updateLastPosition = jest.fn()

        wrapper.find('button').trigger('click')

        expect(wrapper.vm.updateLastPosition).toHaveBeenCalled()
      })
    })
  })

  describe('locales', () => {
    const languages = Object.keys(PositionForm.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(PositionForm.i18n.messages.fr)

        it('contains 7 locales', () => {
          expect(locales).toHaveLength(7)
          expect(locales).toEqual([
            'place',
            'time',
            'lastPosition',
            'confirm',
            'lastKnownPosition',
            'positionUpdated',
            'positionNotUpdated',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(PositionForm.i18n.messages.en)

        it('contains 7 locales', () => {
          expect(locales).toHaveLength(7)
          expect(locales).toEqual([
            'place',
            'time',
            'lastPosition',
            'confirm',
            'lastKnownPosition',
            'positionUpdated',
            'positionNotUpdated',
          ])
        })
      })
    })
  })
})
