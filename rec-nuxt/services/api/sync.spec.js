import axios from 'axios'
import syncApi from './sync'
import env from '../env/env'

describe('Unit | API | sync api', () => {
  describe('#launch', () => {
    let stubbedResponse

    beforeEach(() => {
      stubbedResponse = {
        status: 200,
      }
      axios.patch = jest.fn()
      axios.patch.mockResolvedValue(stubbedResponse)
    })

    it('should launch API with the good params', () => {
      const expectedUrl = `${env('API_URL')}api/sync/`
      const expectedOptions = { headers: { 'Content-Type': 'application/json', 'Referrer-Policy': 'no-referrer-when-downgrade' } }

      const promise = syncApi.launch()

      return promise.then(() => {
        expect(axios.patch).toHaveBeenCalledWith(expectedUrl, expectedOptions)
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
      axios.patch.mockRejectedValue(new Error('some error'))

      const promise = syncApi.launch(accessToken)

      promise.catch(error => {
        expect(error.message).toEqual('some error')
        done()
      })
    })
  })
})
