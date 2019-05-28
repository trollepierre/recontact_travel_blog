import Vue from 'vue'
import VueI18n from 'vue-i18n'
import PositionForm from './PositionForm.vue'
import positionsApi from '../../../api/positions'
import notificationsService from '../../../services/notifications'

describe('Component | PositionForm.vue', () => {
  let localVue
  let wrapper

  beforeEach(() => {
    console.warn = jest.fn()

    localVue = createLocalVue()
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
    })

    describe('#submit', () => {
      it('should prevent default', () => {
        const event = { preventDefault: jest.fn() }

        wrapper.vm.submit(event)

        expect(event.preventDefault).toHaveBeenCalledWith()
      })

      it('should update last position', () => {
        positionsApi.add = jest.fn()
        positionsApi.add.mockResolvedValue()
        notificationsService.success = jest.fn()
        const event = { preventDefault: jest.fn() }

        wrapper.vm.submit(event)

        expect(positionsApi.add).toHaveBeenCalledWith(currentPosition)
      })
    })

    describe('#updateLastPosition', () => {
      it('should add current position to api', () => {
        positionsApi.add = jest.fn()
        positionsApi.add.mockResolvedValue()
        notificationsService.success = jest.fn()

        wrapper.vm.updateLastPosition()

        expect(positionsApi.add).toHaveBeenCalledWith(currentPosition)
      })

      it('should emit current position', async () => {
        positionsApi.add = jest.fn()
        positionsApi.add.mockResolvedValue('tot')

        await wrapper.vm.updateLastPosition()

        expect(wrapper).toEmit('updateLastPositionData', currentPosition)
      })

      it('should reset position', async () => {
        positionsApi.add = jest.fn()
        positionsApi.add.mockResolvedValue()
        notificationsService.success = jest.fn()

        await wrapper.vm.updateLastPosition()

        expect(wrapper.vm.place).toEqual(null)
        expect(wrapper.vm.time).toEqual(null)
      })

      it('should send success notifications', async () => {
        positionsApi.add = jest.fn()
        positionsApi.add.mockResolvedValue()
        notificationsService.success = jest.fn()
        notificationsService.success.mockResolvedValue()

        await wrapper.vm.updateLastPosition()

        const message = 'positionUpdated'
        return Vue.nextTick().then(() => {
          expect(notificationsService.success).toHaveBeenCalledWith(expect.anything(), message)
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

        it('contains 6 locales', () => {
          expect(locales).toHaveLength(6)
          expect(locales).toEqual([
            'place',
            'time',
            'lastPosition',
            'confirm',
            'lastKnownPosition',
            'positionUpdated',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(PositionForm.i18n.messages.en)

        it('contains 6 locales', () => {
          expect(locales).toHaveLength(6)
          expect(locales).toEqual([
            'place',
            'time',
            'lastPosition',
            'confirm',
            'lastKnownPosition',
            'positionUpdated',
          ])
        })
      })
    })
  })
})
