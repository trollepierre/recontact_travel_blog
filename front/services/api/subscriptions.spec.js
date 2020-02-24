import axios from 'axios'
import api from './subscriptions'
import translationsService from '../services/translations'
import env from '../env/env'

describe('Unit | API | subscriptions api', () => {
  describe('#sendSubscription', () => {
    beforeEach(() => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      }
      axios.post = jest.fn()
      axios.post.mockResolvedValue(stubbedResponse)
      translationsService.getNavigatorLanguage = jest.fn()
      translationsService.getNavigatorLanguage.mockReturnValue('en')
    })

    it('should post subscriptions to API with the email', () => {
      const email = 'pierre@recontact.me'

      const expectedUrl = `${env('API_URL')}api/subscriptions`
      const expectedBody = { email, lang: 'en', json: true }

      const promise = api.subscribe(email)

      return promise.then(() => {
        expect(axios.post).toHaveBeenCalledWith(expectedUrl, expectedBody)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      axios.post.mockRejectedValue(new Error('some error'))
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
