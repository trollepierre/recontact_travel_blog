import axios from 'axios'
import chaptersApi from './chapters'
import env from '../env/env'

describe('Unit | API | chapters api', () => {
  describe('#fetch', () => {
    let idArticle
    let data

    beforeEach(() => {
      idArticle = 59
      data = {
        foo: 'bar',
        chapters: 'some chapters',
      }
      const stubbedResponse = {
        status: 200,
        data,
      }
      axios.get = jest.fn()
      axios.get.mockResolvedValue(stubbedResponse)
    })

    it('should fetch API with the good params', () => {
      const expectedUrl = `${env('API_URL')}api/articles/${idArticle}`
      const expectedOptions = { json: true }

      const promise = chaptersApi.fetch(idArticle)

      return promise.then(() => {
        expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedOptions)
      })
    })

    it('should return the response', () => {
      const promise = chaptersApi.fetch(idArticle)

      return promise.then(returnedChapters => {
        expect(returnedChapters).toEqual(data)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      const accessToken = 'invalid-access_token'
      axios.get.mockRejectedValue(new Error('some error'))
      console.error = jest.fn()

      const promise = chaptersApi.fetch(accessToken)

      promise.catch(error => {
        expect(error.message).toEqual('some error')
        done()
      })
    })
  })
})
