import VueI18n from 'vue-i18n'
import Vue from 'vue'
import VueRouter from 'vue-router'
import AppButton from '@/components/AppButton/AppButton' // eslint-disable-line import/no-extraneous-dependencies
import Homepage from './Homepage.vue'

jest.mock('@/components/Homepage/Map/Map', () => () => '<div>Map</div>')

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
    wrapper = shallowMount(Homepage, { localVue, router })
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    it('should go to articles on click on app button', () => {
      // Given

      // When
      wrapper.getComponent(AppButton).vm.$emit('click')

      // Then
      expect(router.push).toHaveBeenCalledWith('/articles')
    })
  })
})
