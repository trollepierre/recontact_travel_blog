import VueI18n from 'vue-i18n'
// eslint-disable-next-line import/no-extraneous-dependencies
import VueRouter from 'vue-router'
import AppButton from '@/components/AppButton/AppButton' // eslint-disable-line import/no-extraneous-dependencies
import ArticleList from '@/components/ArticleList/ArticleList'
import Homepage from './Homepage.vue'
import { IS_DESKTOP } from '~/services/utils/responsive/responsive-utils'

jest.mock('@/components/Homepage/Map/Map', () => () => '<div>Map</div>')
jest.mock('~/services/utils/responsive/responsive-utils')

describe('Component | Homepage.vue', () => {
  let localVue
  let wrapper
  const router = {
    init: jest.fn(),
    push: jest.fn(),
    history: {},
  }

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)
  })

  describe('template', () => {
    it('should match snapshot on desktop', async () => {
      IS_DESKTOP.mockReturnValue(true)

      wrapper = await shallowMount(Homepage, { localVue, router })

      expect(wrapper).toMatchSnapshot()
    })

    it('should remove article list on mobile', async () => {
      IS_DESKTOP.mockReturnValue(false)

      wrapper = await shallowMount(Homepage, { localVue, router })

      expect(wrapper.findComponent(ArticleList).exists()).toBe(false)
    })
  })

  describe('mount', () => {
    it('should go to articles on click on app button', () => {
      // When
      wrapper.getComponent(AppButton).vm.$emit('click')

      // Then
      expect(router.push).toHaveBeenCalledWith('/articles')
    })
  })

  describe('methods', () => {
    it('should go to articles on click on app button', () => {
      // When
      wrapper.getComponent(AppButton).vm.$emit('click')

      // Then
      expect(router.push).toHaveBeenCalledWith('/articles')
    })
  })

  describe('events', () => {
    it('should show articles after touch on mobile', async () => {
      IS_DESKTOP.mockReturnValue(false)
      wrapper = await shallowMount(Homepage, { localVue, router })

      await window.dispatchEvent(new Event('touchstart'))

      expect(wrapper.findComponent(ArticleList).exists()).toBe(true)
    })
  })
})
