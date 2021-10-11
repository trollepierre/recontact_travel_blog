import Comments from '@/components/comments/Comments'
import CommentList from '@/components/comments/CommentList'
import CommentForm from '@/components/comments/CommentForm'

describe('Comments', () => {
  it('should match snapshot', () => {
    // When
    const wrapper = shallowMount(Comments)

    // Then
    expect(wrapper).toMatchSnapshot()
  })

  it('should send false to reload by default', () => {
    // When
    const wrapper = shallowMount(Comments)

    // Then
    expect(wrapper.findComponent(CommentList).props().toReload).toEqual(false)
  })

  it('should send to reload when form asks for reload', async () => {
    // Given
    const wrapper = shallowMount(Comments, { data: () => ({ toReload: false }) })

    // When
    await wrapper.findComponent(CommentForm).vm.$emit('reload')

    // Then
    expect(wrapper.findComponent(CommentList).props().toReload).toEqual(true)
  })

  it('should send to reload off when list returns reloaded', async () => {
    // Given
    const wrapper = shallowMount(Comments, { data: () => ({ toReload: true }) })

    // When
    await wrapper.findComponent(CommentList).vm.$emit('reloaded')

    // Then
    expect(wrapper.findComponent(CommentList).props().toReload).toEqual(false)
  })
})
