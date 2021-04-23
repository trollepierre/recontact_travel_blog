import AppButton from './AppButton.vue'

describe('Component | AppButton.vue', () => {
  let localVue
  let wrapper

  beforeEach(() => {
    localVue = createLocalVue()
  })

  describe('template', () => {
    it('should match snapshot', () => {
      wrapper = shallowMount(AppButton, { localVue })

      expect(wrapper).toMatchSnapshot()
    })

    it('should display anchor when tag is a', () => {
      const propsData = { tag: 'a', href: 'http://rec.me', text: 'anchor' }

      wrapper = shallowMount(AppButton, { localVue, propsData })

      expect(wrapper).toMatchSnapshot()
    })

    it('should display nuxt link when tag is nuxt link', () => {
      const consoleError = console.error
      console.error = jest.fn()
      const propsData = { tag: 'nuxt-link', to: 'http://rec.me', text: 'link' }

      wrapper = shallowMount(AppButton, { localVue, propsData })

      expect(wrapper).toMatchSnapshot()
      console.error = consoleError
    })

    it('should hide component when needed on app-header', () => {
      const propsData = { hide: true }

      wrapper = shallowMount(AppButton, { localVue, propsData })

      expect(wrapper.find('button').classes()).toContain('hidden')
    })
  })

  describe('methods', () => {
    it('should handle click - and prevent multiple click', () => {
      // Given
      wrapper = shallowMount(AppButton, { localVue })

      // When
      wrapper.find('button').trigger('click')
      wrapper.find('button').trigger('click')

      // Then
      expect(wrapper).toEmit('click')
      expect(wrapper.emitted().click).toHaveLength(1)
    })

    it('should handle multiple click', () => {
      // Given
      const propsData = { allowMultipleClick: true }
      wrapper = shallowMount(AppButton, { localVue, propsData })

      // When
      wrapper.find('button').trigger('click')
      wrapper.find('button').trigger('click')

      // Then
      expect(wrapper.emitted().click).toHaveLength(2)
    })
  })
})
