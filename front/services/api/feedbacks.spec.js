import api from './feedbacks'
import apiService from '../services/api-service'

describe('Unit | API | feedbacks api', () => {
  describe('#sendFeedback', () => {
    beforeEach(() => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      }
      apiService.post = jest.fn()
      apiService.post.mockResolvedValue(stubbedResponse)
    })

    it('should post feedback to API with the feedback and email', () => {
      const email = 'pierre@recontact.me'
      const feedback = 'Vive le Tour de France  !'

      const expectedUrl = 'feedbacks'
      const expectedBody = { feedback, email }

      const promise = api.sendFeedback(feedback, email)

      return promise.then(() => {
        expect(apiService.post).toHaveBeenCalledWith(expectedUrl, expectedBody)
      })
    })

    it('should reject a promise when an error is thrown', done => {
      apiService.post.mockRejectedValue(new Error('some error'))
      const feedback = 'coucou'
      const email = 'pierre@recontact.me'

      const promise = api.sendFeedback(feedback, email)

      promise.catch(error => {
        expect(error.message).toBe('some error')
        done()
      })
    })
  })
})
