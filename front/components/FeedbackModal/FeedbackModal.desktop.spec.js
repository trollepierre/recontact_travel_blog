import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import VueModal from 'vue-js-modal'
import VueAnalytics from 'vue-analytics'
import FeedbackModal from './FeedbackModal.vue'

describe('Component | FeedbackModal.vue', () => {
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
    localVue.use(VueAnalytics, { id: '12' })
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
      expect(wrapper.element).toMatchSnapshot()
    })
    xit('should have message with height to 152px', () => {
      expect(wrapper.vm.heightMessage).toEqual('152px')
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

      expect(wrapper.vm.heightMessage).toEqual('90px')
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

      expect(wrapper.vm.heightMessage).toEqual('152px')
    })
  })
})
