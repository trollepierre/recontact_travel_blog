import syncApi from './sync'
import apiService from '../services/api-service'

describe('Unit | API | sync api', () => {
  describe('#launch', () => {
    let stubbedResponse

    beforeEach(() => {
      stubbedResponse = {
        status: 200,
      }
      apiService.patch = jest.fn()
      apiService.patch.mockResolvedValue(stubbedResponse)
    })

    it('should launch API with the good params', () => {
      const expectedUrl = 'sync/'

      const promise = syncApi.launch()

      return promise.then(() => {
        expect(apiService.patch).toHaveBeenCalledWith(expectedUrl)
      })
    })

    it('should return the response', () => {
      const promise = syncApi.launch()

      return promise.then(returnedChapters => {
        expect(returnedChapters).toEqual(stubbedResponse)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      const accessToken = 'invalid-access_token'
      apiService.patch.mockRejectedValue(new Error('some error'))

      const promise = syncApi.launch(accessToken)

      promise.catch(error => {
        expect(error.message).toBe('some error')
        done()
      })
    })
  })
})
