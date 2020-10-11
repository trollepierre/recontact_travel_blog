import Vue from 'vue'
import VueI18n from 'vue-i18n'
import PositionForm from './PositionForm.vue'
import positionsApi from '../../../services/api/positions'
import notificationsService from '../../../services/services/notifications'

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

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    let currentPosition
    let currentPositionForApi

    beforeEach(() => {
      wrapper = shallowMount(PositionForm, { localVue })
      currentPosition = {
        placeFr: 'placeFr',
        timeFr: 'timeFr',
        placeEn: 'placeEn',
        timeEn: 'timeEn',
      }
      currentPositionForApi = {
        place: 'placeFr',
        time: 'timeFr',
        placeEn: 'placeEn',
        timeEn: 'timeEn',
      }
      wrapper.setData(currentPosition)
      positionsApi.add = jest.fn()
      positionsApi.add.mockResolvedValue()
      notificationsService.information = jest.fn()
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

        expect(positionsApi.add).toHaveBeenCalledWith({
          place: 'placeFr',
          time: 'timeFr',
          placeEn: 'placeEn',
          timeEn: 'timeEn',
        })
      })
    })

    describe('#updateLastPosition', () => {
      describe('when position is null', () => {
        beforeEach(() => {
          currentPosition = { placeFr: null, timeFr: 'time' }
          wrapper.setData(currentPosition)
        })

        it('should not add position', () => {
          wrapper.vm.updateLastPosition()

          expect(positionsApi.add).not.toHaveBeenCalled()
        })

        it('should send error notification', () => {
          wrapper.vm.updateLastPosition()

          expect(notificationsService.error).toHaveBeenCalledWith(
            'Fill all the informations. Position was not updated',
          )
        })
      })

      describe('when time is null', () => {
        beforeEach(() => {
          currentPosition = { placeFr: 'place', timeFr: null }
          wrapper.setData(currentPosition)
        })

        it('should not add position', () => {
          wrapper.vm.updateLastPosition()

          expect(positionsApi.add).not.toHaveBeenCalled()
        })

        it('should send error notification', () => {
          wrapper.vm.updateLastPosition()

          expect(notificationsService.error).toHaveBeenCalledWith(
            'Fill all the informations. Position was not updated',
          )
        })
      })

      it('should add current position to api', () => {
        wrapper.vm.updateLastPosition()

        expect(positionsApi.add).toHaveBeenCalledWith(currentPositionForApi)
      })

      xit('should emit current position', async () => {
        await wrapper.vm.updateLastPosition()

        expect(wrapper).toEmit('updateLastPositionData', currentPosition)
      })

      xit('should reset position', async () => {
        await wrapper.vm.updateLastPosition()

        expect(wrapper.vm.place).toEqual(null)
        expect(wrapper.vm.time).toEqual(null)
      })

      it('should send success notifications', async () => {
        notificationsService.information.mockResolvedValue()

        await wrapper.vm.updateLastPosition()

        return Vue.nextTick().then(() => {
          expect(notificationsService.information).toHaveBeenCalledWith(
            'Position updated',
          )
        })
      })
    })

    describe('#updateLastPositionData', () => {
      it('should emit last position', () => {
        wrapper.vm.updateLastPositionData()

        expect(wrapper).toEmit('updateLastPositionData', {
          place: 'placeFr',
          time: 'timeFr',
        })
      })

      it('should reset position', () => {
        wrapper.vm.updateLastPositionData()

        expect(wrapper.vm.placeFr).toEqual(null)
        expect(wrapper.vm.timeFr).toEqual(null)
        expect(wrapper.vm.placeEn).toEqual(null)
        expect(wrapper.vm.timeEn).toEqual(null)
      })
    })

    describe('#resetPosition', () => {
      it('should set position values to null', () => {
        wrapper.vm.resetPosition()

        expect(wrapper.vm.placeFr).toEqual(null)
        expect(wrapper.vm.timeFr).toEqual(null)
        expect(wrapper.vm.placeEn).toEqual(null)
        expect(wrapper.vm.timeEn).toEqual(null)
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

        it('contains 9 locales', () => {
          expect(locales).toHaveLength(9)
          expect(locales).toMatchInlineSnapshot(`
            Array [
              "placeFr",
              "placeEn",
              "timeFr",
              "timeEn",
              "lastPositionFr",
              "lastPositionEn",
              "confirm",
              "positionUpdated",
              "positionNotUpdated",
            ]
          `)
        })
      })

      describe('en', () => {
        const locales = Object.keys(PositionForm.i18n.messages.en)

        it('contains 9 locales', () => {
          expect(locales).toHaveLength(9)
          expect(locales).toMatchInlineSnapshot(`
            Array [
              "placeFr",
              "placeEn",
              "timeFr",
              "timeEn",
              "lastPositionFr",
              "lastPositionEn",
              "confirm",
              "positionUpdated",
              "positionNotUpdated",
            ]
          `)
        })
      })
    })
  })
})
