import Vue from 'vue'
import VueRouter from 'vue-router' // eslint-disable-line import/no-extraneous-dependencies
import VueModal from 'vue-js-modal'
import VueI18n from 'vue-i18n'

import SubscribeModal from './SubscribeModal.vue'
import notificationsService from '../../services/services/notifications'
import subscriptionsApi from '../../services/api/subscriptions'

jest.mock('../../services/utils/screen/screen-utils', () => ({ screenWidth: 200, PHONE_PORTRAIT_TO_LANDSCAPE: 600 }))

describe.skip('Component | SubscribeModal.vue', () => {
  let wrapper
  const email = 'pierre@recontact.me'
  let localVue

  beforeEach(() => {
    console.warn = jest.fn()
    localVue = createLocalVue()
    localVue.use(VueModal)
    localVue.use(VueI18n)
    localVue.use(VueRouter)

    wrapper = shallowMount(SubscribeModal, {
      localVue,
      data() {
        return {
          email,
          error: 'error message',
        }
      },
    })
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  /* xdescribe('rendering', () => {
    it('should display the modal', () => {
      wrapper.$modal.show('subscribe-modal')

      return Vue.nextTick().then(() => {
        expect(wrapper.find('.subscribe-modal')).toBeDefined()
      })
    })
  }) */

  describe('#beforeOpen', () => {
    it('should reset email', () => {
      wrapper.vm.email = 'Coucou@contact.me'

      wrapper.vm.beforeOpen()

      expect(wrapper.vm.email).toBeNull()
    })

    it('should remove error', () => {
      wrapper.vm.error = 'C\'est un problème'

      wrapper.vm.beforeOpen()

      expect(wrapper.vm.error).toBeNull()
    })
  })

  describe('#opened', () => {
    beforeEach(() => {
      wrapper.vm._focusOnInput = jest.fn()
      wrapper.vm._closeModal = jest.fn()
    })

    it('should focusOnInput', () => {
      wrapper.vm.opened()

      expect(wrapper.vm._focusOnInput).toHaveBeenCalledWith()
    })

    it('should close on escape key', () => {
      wrapper.vm.opened()

      const e = document.createEvent('Events')
      e.initEvent('keydown', true, true)
      e.keyCode = 27
      document.dispatchEvent(e)

      return Vue.nextTick().then(() => {
        expect(wrapper.vm._closeModal).toHaveBeenCalledWith()
      })
    })

    it('should not close on any other key than space', () => {
      wrapper.vm.opened()

      const e = document.createEvent('Events')
      e.initEvent('keydown', true, true)
      e.keyCode = 13
      document.dispatchEvent(e)

      return Vue.nextTick().then(() => {
        expect(wrapper.vm._closeModal).not.toHaveBeenCalled()
      })
    })
  })

  /* xdescribe('#_focusOnInput', () => {
    it.skip('should focus on input subscribe content', done => {
      wrapper.$modal.show('subscribe-modal')

      setTimeout(() => {
        const inputSubscribe = wrapper.find('input#subscribe-content')
        // expect(inputSubscribe).to.have.focus()
        done()
      }, 100)
    })
  }) */

  describe('#sendSubscription', () => {
    beforeEach(() => {
      subscriptionsApi.subscribe = jest.fn()
      notificationsService.information = jest.fn()
      subscriptionsApi.subscribe.mockResolvedValue({})
    })

    it('should remove error', () => {
      wrapper.vm.error = 'C\'est un problème'

      wrapper.vm.sendSubscription()

      expect(wrapper.vm.error).toBeNull()
    })

    describe('when email is empty', () => {
      it('should set error', () => {
        wrapper.vm.email = ''

        wrapper.vm.sendSubscription()

        expect(wrapper.vm.error).toBe('emailError')
      })

      it('should not call sendSubscription', () => {
        wrapper.vm.email = ''

        wrapper.vm.sendSubscription()

        expect(subscriptionsApi.subscribe).not.toHaveBeenCalled()
      })
    })

    describe('when email does not follow good pattern', () => {
      it('should set error', () => {
        wrapper.vm.email = 'pierrerecontact'

        wrapper.vm.sendSubscription()

        expect(wrapper.vm.error).toBe('emailError')
      })

      it('should not call sendSubscription', () => {
        wrapper.vm.email = 'pierre@recontact.m'

        wrapper.vm.sendSubscription()

        expect(subscriptionsApi.subscribe).not.toHaveBeenCalled()
      })
    })

    it('should call the API with good params', () => {
      wrapper.vm.sendSubscription(email)

      expect(subscriptionsApi.subscribe).toHaveBeenCalledWith(email)
    })

    it('should display success notification', () => {
      notificationsService.information.mockResolvedValue({})

      wrapper.vm.sendSubscription()

      return Vue.nextTick().then(() => {
        const message = 'subscriptionSuccess'
        expect(notificationsService.information).toHaveBeenCalledWith(message)
      })
    })

    /* xit('should close modal', () => {
      wrapper.$modal.show('subscribe-modal')
      wrapper.vm.email = 'email@recontact.me'

      wrapper.vm.sendSubscription()

      return Vue.nextTick().then(() => {
        expect(wrapper.find('.subscribe-modal')).not.to.exist
      })
    }) */

    // describe('when sendSubscription fails', () => {
    //   beforeEach(() => {
    //     // wrapper.$modal.show('subscribe-modal');
    //     wrapper.vm.email = 'email@recontact.me'
    //     subscriptionsApi.subscribe.mockRejectedValue(new Error('e'))
    //   })
    //
    //   // xit('should not close modal', () => {
    //   //   wrapper.vm.sendSubscription()
    //   //
    //   //   return Vue.nextTick().then(() => {
    //   //     expect(wrapper.find('.subscribe-modal')).to.exist
    //   //   })
    //   // })
    //   //
    //   // xit('should set error', () => {
    //   //   wrapper.vm.sendSubscription()
    //   //
    //   //   return Vue.nextTick().then(() => {
    //   //     expect(wrapper.vm.error).toEqual('subscriptionError')
    //   //   })
    //   // })
    // })
  })

  /* xdescribe('#cancelSubscription', () => {
    it('should close modal', () => {
      wrapper.$modal.show('subscribe-modal')

      wrapper.cancelSubscription()

      return Vue.nextTick().then(() => {
        expect(wrapper.find('.subscribe-modal')).not.to.exist
      })
    })
  }) */

  /* it.skip('should sendSubscription on click on "send" button', () => {
    wrapper.$modal.show('subscribe-modal')
    sinon.stub(component, 'sendSubscription')

    return Vue.nextTick().then(() => {
      const myButton = wrapper.find('.subscribe-modal__action--send')

      myButton.click()

      expect(wrapper.sendSubscription).toHaveBeenCalled
    })
  }) */

  /* it.skip('should cancelSubscription on click on "cancel" button', () => {
    wrapper.$modal.show('subscribe-modal')
    sinon.stub(component, 'cancelSubscription')

    return Vue.nextTick().then(() => {
      const myButton = wrapper.find('.subscribe-modal__action--cancel')

      myButton.click()

      expect(wrapper.cancelSubscription).toHaveBeenCalled
    })
  }) */

  describe('locales', () => {
    const languages = Object.keys(SubscribeModal.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(SubscribeModal.i18n.messages.fr)

        it('contains 8 locales', () => {
          expect(locales).toHaveLength(8)
          expect(locales).toEqual([
            'subscribe',
            'modalText',
            'email',
            'confirm',
            'cancel',
            'emailError',
            'subscriptionError',
            'subscriptionSuccess',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(SubscribeModal.i18n.messages.en)

        it('contains 8 locales', () => {
          expect(locales).toHaveLength(8)
          expect(locales).toEqual([
            'subscribe',
            'modalText',
            'email',
            'confirm',
            'cancel',
            'emailError',
            'subscriptionError',
            'subscriptionSuccess',
          ])
        })
      })
    })
  })
})
