import photosApi from './photos'
import apiService from '../services/api-service'

describe('Unit | API | photos api', () => {
  describe('#fetch', () => {
    let idArticle
    let data
    let stubbedResponse

    beforeEach(() => {
      idArticle = 59
      data = {
        foo: 'bar',
        photos: 'some photos',
      }
      stubbedResponse = {
        status: 200,
        data,
      }
      apiService.get = jest.fn()
      apiService.get.mockResolvedValue(stubbedResponse)
    })

    it('should fetch API with the good params', () => {
      const expectedUrl = `articles/${idArticle}/photos`

      const promise = photosApi.fetch(idArticle)

      return promise.then(() => {
        expect(apiService.get).toHaveBeenCalledWith(expectedUrl)
      })
    })

    it('should return the response', () => {
      const promise = photosApi.fetch(idArticle)

      return promise.then(returnedChapters => {
        expect(returnedChapters).toEqual(stubbedResponse)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      const accessToken = 'invalid-access_token'
      apiService.get.mockRejectedValue(new Error('some error'))
      console.error = jest.fn()

      const promise = photosApi.fetch(accessToken)

      promise.catch(error => {
        expect(error.message).toBe('some error')
        done()
      })
    })
  })
})
