import VueRouter from 'vue-router' // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n'

import CommentForm from './CommentForm.vue'
import router from '../../test/router/router'
import commentsApi from '../../services/api/comments'
import notificationsService from '../../services/services/notifications'

describe('Component | CommentForm.vue', () => {
  let localVue
  let wrapper

  const dropboxId = '8'
  const commentsFromApi = [{ text: 'comment1' }]

  beforeEach(() => {
    commentsApi.fetch = jest.fn()
    commentsApi.fetch.mockResolvedValue(commentsFromApi)
    console.warn = jest.fn()

    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(VueRouter)

    wrapper = shallowMount(CommentForm, { localVue, router, data: () => ({ dropboxId }) })
  })

  it('should be named "CommentForm"', () => {
    expect(wrapper.name()).toEqual('CommentForm')
  })

  describe('template', () => {
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    describe('submitComment', () => {
      const newComment = 'my text'
      beforeEach(() => {
        commentsApi.send = jest.fn()
        notificationsService.information = jest.fn()
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
        expect(notificationsService.information).toHaveBeenCalledOnceWith('Your comment has been taken into consideration.')
      })

      describe('when api throws error', () => {
        it('should display error notification', async () => {
          // Given
          commentsApi.send.mockRejectedValue({ error: 'no comment...' })
          wrapper = shallowMount(CommentForm, { localVue, router, data: () => ({ dropboxId, newComment }) })

          // When
          await wrapper.vm.submitComment({ preventDefault: jest.fn() })

          // Then
          expect(notificationsService.error).toHaveBeenCalledOnceWith('Error when adding the comment.')
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
