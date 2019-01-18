import CommentCard from './CommentCard.vue'

describe('Component | CommentCard.vue', () => {
  let localVue
  let wrapper
  const propsData = { comment: { text: 'comment', createdAt: '2019-01-13T21:12:37.300Z' } }

  beforeEach(() => {
    localVue = createLocalVue()
  })

  it('should be named "CommentCard"', () => {
    wrapper = shallowMount(CommentCard, { localVue, propsData })

    expect(wrapper.name()).toEqual('CommentCard')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      wrapper = shallowMount(CommentCard, { localVue, propsData })

      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
