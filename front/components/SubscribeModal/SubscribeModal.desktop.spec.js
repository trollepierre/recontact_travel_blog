import VueRouter from 'vue-router' // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'
import VueModal from 'vue-js-modal'
import SubscribeModal from './SubscribeModal.vue'

describe('Component | SubscribeModal.vue', () => {
  let wrapper
  const email = 'pierre@recontact.me'
  let localVue

  beforeEach(() => {
    console.warn = jest.fn()
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)
    localVue.use(VueModal)
    localVue.use(VueAnalytics, { id: '12' })
    wrapper = shallowMount(SubscribeModal, {
      localVue,
      data() {
        return {
          email,
        }
      },
    })
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
