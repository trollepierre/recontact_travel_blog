import axios from 'axios'
import photosApi from './photos'
import env from '../env/env'

describe('Unit | API | photos api', () => {
  describe('#fetch', () => {
    let idArticle
    let data

    beforeEach(() => {
      idArticle = 59
      data = {
        foo: 'bar',
        photos: 'some photos',
      }
      const stubbedResponse = {
        status: 200,
        data,
      }
      axios.get = jest.fn()
      axios.get.mockResolvedValue(stubbedResponse)
    })

    it('should fetch API with the good params', () => {
      const expectedUrl = `${env('API_URL')}api/articles/${idArticle}/photos`
      const expectedOptions = { headers: { 'Content-Type': 'application/json', 'Referrer-Policy': 'no-referrer-when-downgrade' } }

      const promise = photosApi.fetch(idArticle)

      return promise.then(() => {
        expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedOptions)
      })
    })

    it('should return the response', () => {
      const promise = photosApi.fetch(idArticle)

      return promise.then(returnedChapters => {
        expect(returnedChapters).toEqual(data)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      const accessToken = 'invalid-access_token'
      axios.get.mockRejectedValue(new Error('some error'))

      const promise = photosApi.fetch(accessToken)

      promise.catch(error => {
        expect(error.message).toEqual('some error')
        done()
      })
    })
  })
})
