import CommentCard from './CommentCard.vue'
import { formatDateWithLongEndianLongFormat } from '../../utils/date-utils'

jest.mock('../../utils/date-utils')

describe('Component | CommentCard.vue', () => {
  let localVue
  let wrapper
  const propsData = { comment: { text: 'comment', author: 'toto', createdAt: '2019-01-13T21:12:37.300Z' } }

  beforeEach(() => {
    localVue = createLocalVue()
    formatDateWithLongEndianLongFormat.mockImplementation(() => '13/01/2019 21:12')
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
