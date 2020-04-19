import CommentCard from './CommentCard.vue'

describe('Component | CommentCard.vue', () => {
  let localVue
  let wrapper
  const propsData = { comment: { text: 'comment', author: 'toto', createdAt: '13/01/2019 21:12' } }

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

      expect(wrapper).toMatchSnapshot()
    })
  })
})
