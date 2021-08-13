import api from './subscriptions'
import translationsService from '../services/translations'
import apiService from '../services/api-service'

describe('Unit | API | subscriptions api', () => {
  describe('#sendSubscription', () => {
    beforeEach(() => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      }
      apiService.post = jest.fn()
      apiService.post.mockResolvedValue(stubbedResponse)
      translationsService.getNavigatorLanguage = jest.fn()
      translationsService.getNavigatorLanguage.mockReturnValue('en')
    })

    it('should post subscriptions to API with the email', () => {
      const email = 'pierre@recontact.me'

      const expectedUrl = 'subscriptions'
      const expectedBody = { email, lang: 'en' }

      const promise = api.subscribe(email)

      return promise.then(() => {
        expect(apiService.post).toHaveBeenCalledWith(expectedUrl, expectedBody)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      apiService.post.mockRejectedValue(new Error('some error'))
      const email = 'pierre@recontact.me'
      console.error = jest.fn()

      const promise = api.subscribe(email)

      promise.catch(error => {
        expect(error.message).toEqual('some error')
        done()
      })
    })
  })
})
