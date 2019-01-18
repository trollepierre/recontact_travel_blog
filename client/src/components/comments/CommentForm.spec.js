import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'
import CommentForm from './CommentForm.vue'
import router from '../../router/router'
import photosApi from '../../api/photos'
import chaptersApi from '../../api/chapters'
import commentsApi from '../../api/comments'
import translationsService from '../../services/translations'
import notificationsService from '../../services/notifications'

describe('Component | CommentForm.vue', () => {
  let localVue
  let wrapper
  let chapters
  let photos
  const dropboxId = '8'
  const title = 'Pierre au pays des'
  const commentsFromApi = [{ text: 'comment1' }]

  beforeEach(() => {
    translationsService.getChapterTitle = jest.fn()
    translationsService.getChapterTitle.mockReturnValue('My title')
    translationsService.getChapterText = jest.fn()
    translationsService.getChapterText.mockReturnValue(['one text'])
    chapters = [
      {
        title: '60 : Pierre avec les webf',
        imgLink: '../assets/toto.jpg',
        text: ['some text'],
      }, {
        title: '61 : Pierre au Koezio',
        imgLink: '/assets/tata.jpg',
        text: ['some text'],
      }, {
        title: '62 : Pierre au Koezio',
        imgLink: '/assets/titi.jpg',
        text: ['some text'],
      },
    ]
    photos = [
      { imgLink: 'url/photo1' },
      { imgLink: 'url/photo2' },
    ]
    photosApi.fetch = jest.fn()
    photosApi.fetch.mockResolvedValue(photos)
    chaptersApi.fetch = jest.fn()
    chaptersApi.fetch.mockResolvedValue({ title, chapters })
    commentsApi.fetch = jest.fn()
    commentsApi.fetch.mockResolvedValue(commentsFromApi)

    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)
    localVue.use(VueAnalytics, { id: '12' })
    wrapper = shallowMount(CommentForm, { localVue, router, data: () => ({ dropboxId }) })
  })

  it('should be named "CommentForm"', () => {
    expect(wrapper.name()).toEqual('CommentForm')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    describe('submitComment', () => {
      const newComment = 'my text'
      beforeEach(() => {
        commentsApi.send = jest.fn()
        notificationsService.success = jest.fn()
        notificationsService.error = jest.fn()
      })

      it('should send comment to api', () => {
        // Given
        commentsApi.send.mockResolvedValue({ text: 'createdComment' })
        wrapper = shallowMount(CommentForm, { localVue, router, data: () => ({ dropboxId, newComment }) })

        // When
        wrapper.vm.submitComment({ preventDefault: jest.fn() })

        // Then
        expect(commentsApi.send).toHaveBeenCalledOnceWith(dropboxId, { author: '', text: newComment })
      })

      it('should display success notification', async () => {
        // Given
        commentsApi.send.mockResolvedValue({ text: 'createdComment' })
        wrapper = shallowMount(CommentForm, { localVue, router, data: () => ({ dropboxId, newComment }) })

        // When
        await wrapper.vm.submitComment({ preventDefault: jest.fn() })

        // Then
        expect(notificationsService.success).toHaveBeenNotifiedOnceWith('commentSuccess')
      })

      describe('when api throws error', () => {
        it('should display error notification', async () => {
          // Given
          commentsApi.send.mockRejectedValue({ error: 'no comment...' })
          wrapper = shallowMount(CommentForm, { localVue, router, data: () => ({ dropboxId, newComment }) })

          // When
          await wrapper.vm.submitComment({ preventDefault: jest.fn() })

          // Then
          expect(notificationsService.error).toHaveBeenNotifiedOnceWith('commentError')
        })
      })

      describe('when newComment is not set', () => {
        it('should not send comment', () => {
          // Given
          wrapper = shallowMount(CommentForm, { localVue, router, data: () => ({ dropboxId, newComment: '' }) })

          // When
          wrapper.vm.submitComment({ preventDefault: jest.fn() })

          // Then
          expect(commentsApi.send).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('locales', () => {
    const languages = Object.keys(CommentForm.i18n.messages)

    it('contains 2 languages', () => {
      expect(languages).toHaveLength(2)
      expect(languages).toEqual(['fr', 'en'])
    })

    describe('each language', () => {
      describe('fr', () => {
        const locales = Object.keys(CommentForm.i18n.messages.fr)

        it('contains 8 locales', () => {
          expect(locales).toHaveLength(8)
          expect(locales).toEqual([
            'addComment',
            'name',
            'commentError',
            'commentSuccess',
            'anonymous',
            'textPlaceholder',
            'send',
            'text',
          ])
        })
      })

      describe('en', () => {
        const locales = Object.keys(CommentForm.i18n.messages.en)

        it('contains 8 locales', () => {
          expect(locales).toHaveLength(8)
          expect(locales).toEqual([
            'addComment',
            'name',
            'commentError',
            'commentSuccess',
            'anonymous',
            'textPlaceholder',
            'send',
            'text',
          ])
        })
      })
    })
  })
})
