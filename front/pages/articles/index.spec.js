import ArticlesIndex from '@/pages/articles/index'

describe('Page | index.vue', () => {
  it('should match snapshot', () => {
    // When
    const wrapper = shallowMount(ArticlesIndex)

    // Then
    expect(wrapper).toMatchSnapshot()
  })
})
