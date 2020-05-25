import error from './error.vue'

describe('error layout', () => {
  it('should return page not found when 404', () => {
    console.error = jest.fn()

    const wrapper = shallowMount(error, { propsData: { error: { statusCode: 404 } } })

    expect(wrapper).toMatchSnapshot()
  })

  it('should return error occured not found when not 404', () => {
    console.error = jest.fn()

    const wrapper = shallowMount(error, { propsData: { error: { statusCode: 500 } } })

    expect(wrapper).toMatchSnapshot()
  })
})
