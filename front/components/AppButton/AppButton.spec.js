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
  })

  describe('methods', () => {
    it('should handle click', () => {
      // Given
      wrapper = shallowMount(AppButton, { localVue })

      // When
      wrapper.find('button').trigger('click')

      // Then
      expect(wrapper).toEmit('click')
    })
  })
})
