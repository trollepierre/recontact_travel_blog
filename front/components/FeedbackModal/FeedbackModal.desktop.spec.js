import VueRouter from 'vue-router' // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n'
import VueModal from 'vue-js-modal'
import FeedbackModal from './FeedbackModal.vue'

describe.skip('Component | FeedbackModal.vue', () => {
  let wrapper
  const email = 'pierre@recontact.me'
  let localVue
  const feedback = 'Dis-moi petit, as-tu déjà dansé avec le diable au clair de lune ?'

  beforeEach(() => {
    console.warn = jest.fn()
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)
    localVue.use(VueModal)
    wrapper = shallowMount(FeedbackModal, {
      localVue,
      data() {
        return {
          feedback,
          email,
        }
      },
    })
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })
    xit('should have message with height to 152px', () => {
      expect(wrapper.vm.heightMessage).toBe('152px')
    })
    xit('should have message with height to 90px when wrapper in error', () => {
      wrapper = shallowMount(FeedbackModal, {
        localVue,
        data() {
          return {
            feedback,
            email,
            error: 'non null',
          }
        },
      })

      expect(wrapper.vm.heightMessage).toBe('90px')
    })
  })

  xdescribe('beforeOpen', () => {
    it('should reset height', () => {
      wrapper = shallowMount(FeedbackModal, {
        localVue,
        data() {
          return {
            feedback,
            email,
            error: 'non null',
          }
        },
      })

      wrapper.vm.beforeOpen()

      expect(wrapper.vm.heightMessage).toBe('152px')
    })
  })
})
