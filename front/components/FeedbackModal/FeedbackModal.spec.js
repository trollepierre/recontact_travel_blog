import VueRouter from 'vue-router'
import VueModal from 'vue-js-modal'
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'
import FeedbackModal from './FeedbackModal.vue'
// import feedbacksApi from '../api/feedbacks'
// import notificationsService from '../services/notifications'

jest.mock('../../services/utils/screen/screen-utils', () => ({ screenHeight: 200, PHONE_PORTRAIT_TO_LANDSCAPE: 600 }))

describe('Component | FeedbackModal.vue', () => {
  let wrapper
  let localVue

  const feedback = 'Dis-moi petit, as-tu déjà dansé avec le diable au clair de lune ?'
  const email = 'pierre@recontact.me'

  beforeEach(() => {
    console.warn = jest.fn()
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)
    localVue.use(VueModal)
    localVue.use(VueAnalytics, { id: '12' })
    wrapper = shallowMount(FeedbackModal, {
      localVue,
      data() {
        return {
          feedback,
          email,
          error: 'error message',
        }
      },
    })
  })

  it('should be named "FeedbackModal"', () => {
    expect(wrapper.name()).toEqual('FeedbackModal')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  it('should have empty error', () => {
    wrapper = shallowMount(FeedbackModal, {
      localVue,
      data() {
        return {
          feedback,
          email,
        }
      },
    })
    expect(wrapper.vm.error).toEqual(null)
  })

  it('should have message with height to 152px', () => {
    expect(wrapper.vm.heightMessage).toBeUndefined()
  })

  /* xdescribe('rendering', () => {
    it('should display the modal', () => {
      wrapper.vm.$modal.show('feedback-modal')

      return Vue.nextTick().then(() => {
        expect(wrapper.find('.feedback-modal')).to.exist
      })
    })
  })
*/
  describe('#beforeOpen', () => {
    it('should reset feedback', () => {
      wrapper.vm.feedback = 'Coucou'

      wrapper.vm.beforeOpen()

      expect(wrapper.vm.feedback).toEqual(null)
    })

    it('should reset email', () => {
      wrapper.vm.email = 'Coucou@contact.me'

      wrapper.vm.beforeOpen()

      expect(wrapper.vm.email).toEqual(null)
    })

    it('should reset height', () => {
      wrapper.vm.beforeOpen()

      expect(wrapper.vm.heightMessage).toBeUndefined()
    })

    it('should remove error', () => {
      wrapper.vm.error = 'C\'est un problème'

      wrapper.vm.beforeOpen()

      expect(wrapper.vm.error).toEqual(null)
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

      expect(wrapper.vm._closeModal).toHaveBeenCalledWith()
    })

    it('should not close on any other key than space', () => {
      wrapper.vm.opened()

      const e = document.createEvent('Events')
      e.initEvent('keydown', true, true)
      e.keyCode = 13
      document.dispatchEvent(e)

      expect(wrapper.vm._closeModal).not.toHaveBeenCalledWith()
    })
  })

  /*
  xdescribe('#_focusOnInput', () => {
    it.skip('should focus on input feedback content', done => {
      wrapper.vm.$modal.show('feedback-modal')

      setTimeout(() => {
        const inputSubscribe = wrapper.find('input#feedback-email')
        expect(inputSubscribe).to.have.focus()
        done()
      }, 100)
    })
  })
*/

  /* xdescribe('#sendFeedback', () => {
    beforeEach(() => {
      feedbacksApi.sendFeedback = jest.fn()
      feedbacksApi.sendFeedback.mockResolvedValue({})
      notificationsService.success = jest.fn()
    })

    it('should remove error', () => {
      wrapper.vm.error = 'C\'est un problème'

      wrapper.vm.sendFeedback()

      expect(wrapper.vm.error).toEqual(null)
    })

    describe('when email is empty', () => {
      it('should set error', () => {
        wrapper.vm.email = ''

        wrapper.vm.sendFeedback()

        expect(wrapper.vm.error).toEqual('emailError')
      })

      it('should set error height', () => {
        wrapper.vm.email = ''

        wrapper.vm.sendFeedback()

        expect(wrapper.vm.heightMessage).toEqual('90px')
      })

      it('should not call sendFeedback', () => {
        wrapper.vm.email = ''

        wrapper.vm.sendFeedback()

        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled
      })
    })

    describe('when email does not follow the good pattern', () => {
      it('should set error', () => {
        wrapper.vm.email = '@recontact.me'

        wrapper.vm.sendFeedback()

        expect(wrapper.vm.error).toEqual('emailError')
      })

      it('should set error height', () => {
        wrapper.vm.email = 'pierre@recontact.m'

        wrapper.vm.sendFeedback()

        expect(wrapper.vm.heightMessage).toEqual('90px')
      })

      it('should not call sendFeedback', () => {
        wrapper.vm.email = 'pierre@recontact.m'

        wrapper.vm.sendFeedback()

        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled
      })
    })

    describe('when feedback is empty', () => {
      it('should set error', () => {
        wrapper.vm.feedback = ''

        wrapper.vm.sendFeedback()

        expect(wrapper.vm.error).toEqual('feedbackError')
      })

      it('should set error height', () => {
        wrapper.vm.feedback = ''

        wrapper.vm.sendFeedback()

        expect(wrapper.vm.heightMessage).toEqual('90px')
      })

      it('should not call sendFeedback', () => {
        wrapper.vm.feedback = ''

        wrapper.vm.sendFeedback()

        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled
      })
    })

    describe('when trimmed feedback is empty', () => {
      it('should set error', () => {
        wrapper.vm.feedback = ' '

        wrapper.vm.sendFeedback()

        expect(wrapper.vm.error).toEqual('feedbackError')
      })

      it('should set error height', () => {
        wrapper.vm.feedback = ' \n'

        wrapper.vm.sendFeedback()

        expect(wrapper.vm.heightMessage).toEqual('90px')
      })

      it('should not call sendFeedback', () => {
        wrapper.vm.feedback = ''

        wrapper.vm.sendFeedback()

        expect(feedbacksApi.sendFeedback).not.toHaveBeenCalled
      })
    })

    it('should call the API with good params', () => {
      wrapper.vm.sendFeedback()

      expect(feedbacksApi.sendFeedback).toHaveBeenCalledWith(feedback, email)
    })

    it('should display success notification', () => {
      notificationsService.success.mockResolvedValue({})

      wrapper.vm.sendFeedback()

        const message = 'sendingSuccess'
        expect(notificationsService.success).toHaveBeenCalledWith(component, message)
    })

    it('should close modal', () => {
      notificationsService.success.mockResolvedValue({})
      wrapper.vm.$modal.show('feedback-modal')
      wrapper.vm.email = 'email@recontact.me'
      wrapper.vm.feedback = 'Coucou'

      wrapper.vm.sendFeedback()

        expect(wrapper.find('.feedback-modal')).not.to.exist
    })

    /!*xdescribe('when sendFeedback fails', () => {
      beforeEach(() => {
        feedbacksApi.sendFeedback.restore()
        wrapper.vm.$modal.show('feedback-modal')
        sinon.stub(feedbacksApi, 'sendFeedback').rejects(new Error('e'))
        wrapper.vm.feedback = 'Dis-moi petit, as-tu déjà dansé avec le diable au clair de lune ?'
        wrapper.vm.email = 'contact@recontact.me'
        wrapper.vm.heightMessage = '12px'
      })

      it('should not close modal', () => {
        wrapper.vm.sendFeedback()

        return Vue.nextTick().then(() => {
          expect(wrapper.find('.feedback-modal')).to.exist
        })
      })

      it('should set error', () => {
        wrapper.vm.sendFeedback()

          expect(wrapper.vm.error).toEqual('sendingError')
      })

      it('should set error height', () => {
        wrapper.vm.sendFeedback()

          expect(wrapper.vm.heightMessage).toEqual('90px')
      })
    })*!/
  })
*/
  /* xdescribe('#cancelFeedback', () => {
    it('should close modal', () => {
      wrapper.vm.$modal.show('feedback-modal')

      wrapper.vm.cancelFeedback()

      return Vue.nextTick().then(() => {
        expect(wrapper.find('.feedback-modal')).not.to.exist
      })
    })
  }) */

  /* it.skip('should sendFeedback on click on "send" button', () => {
    wrapper.vm.$modal.show('feedback-modal')
    sinon.stub(component, 'sendFeedback')

    return Vue.nextTick().then(() => {
      const myButton = wrapper.find('.feedback-modal__action--send')

      myButton.click()

      expect(wrapper.vm.sendFeedback).toHaveBeenCalled
    })
  }) */

  /* it.skip('should cancelFeedback on click on "cancel" button', () => {
    wrapper.vm.$modal.show('feedback-modal')
    sinon.stub(component, 'cancelFeedback')

    return Vue.nextTick().then(() => {
      const myButton = wrapper.find('.feedback-modal__action--cancel')

      myButton.click()

      expect(wrapper.vm.cancelFeedback).toHaveBeenCalled
    })
  }) */

  describe('locales', () => {
    const languages = Object.keys(FeedbackModal.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(FeedbackModal.i18n.messages.fr)

        it('contains 10 locales', () => {
          expect(locales).toHaveLength(10)
          expect(locales).toEqual([
            'suggest',
            'content',
            'placeholder',
            'email',
            'send',
            'cancel',
            'emailError',
            'feedbackError',
            'sendingError',
            'sendingSuccess',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(FeedbackModal.i18n.messages.en)

        it('contains 10 locales', () => {
          expect(locales).toHaveLength(10)
          expect(locales).toEqual([
            'suggest',
            'content',
            'placeholder',
            'email',
            'send',
            'cancel',
            'emailError',
            'feedbackError',
            'sendingError',
            'sendingSuccess',
          ])
        })
      })
    })
  })
})
