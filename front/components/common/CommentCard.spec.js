import Vuex from 'vuex' // eslint-disable-line import/no-extraneous-dependencies
import CommentCard from './CommentCard.vue'

describe('Component | CommentCard.vue', () => {
  let localVue
  let wrapper
  let store
  const propsData = { comment: { text: 'comment', author: 'toto', createdAt: '13/01/2019 21:12' } }

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store({ state: { locale: 'en' } })
  })

  it('should be named "CommentCard"', () => {
    wrapper = shallowMount(CommentCard, { localVue, propsData, store })

    expect(wrapper.name()).toEqual('CommentCard')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      wrapper = shallowMount(CommentCard, { localVue, propsData, store })

      expect(wrapper).toMatchSnapshot()
    })

    it('should use French language', () => {
      store = new Vuex.Store({ state: { locale: 'fr' } })

      wrapper = shallowMount(CommentCard, { localVue, propsData, store })

      expect(wrapper.find('.comment__author').text()).toContain('De toto - 13/01/2019 21:12')
    })
  })
})
