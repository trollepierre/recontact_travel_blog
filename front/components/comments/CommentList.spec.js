import VueRouter from 'vue-router' // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n'
import CommentList from './CommentList.vue'
// import router from '../../router/router'
import commentsApi from '../../services/api/comments'

xdescribe('Component | CommentList.vue', () => {
  let localVue
  let wrapper
  const dropboxId = '8'
  const commentsFromApi = [{ text: 'comment1' }]

  beforeEach(() => {
    commentsApi.fetch = jest.fn()
    commentsApi.fetch.mockResolvedValue(commentsFromApi)

    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)
    wrapper = shallowMount(CommentList, { localVue, data: () => ({ dropboxId }) })
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('mounted', () => {
    describe('getComments', () => {
      it('should fetch comments with dropbox id', () => {
        // Then
        expect(commentsApi.fetch).toHaveBeenCalledOnceWith(dropboxId)
      })

      it('should update comments data', () => {
        // Then
        expect(wrapper.vm.comments).toEqual(commentsFromApi)
      })
    })
  })

  describe('locales', () => {
    const languages = Object.keys(CommentList.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(CommentList.i18n.messages.fr)

        it('contains 1 locale', () => {
          expect(locales).toHaveLength(1)
          expect(locales).toEqual([
            'hereTheComments',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(CommentList.i18n.messages.en)

        it('contains 1 locale', () => {
          expect(locales).toHaveLength(1)
          expect(locales).toEqual([
            'hereTheComments',
          ])
        })
      })
    })
  })
})
