import axios from 'axios'
import articlesApi from './articles'
import env from '../env/env'

describe('Unit | API | articles api', () => {
  describe('#fetchAll', () => {
    beforeEach(() => {
      const stubbedResponse = {
        status: 200,
        data: { foo: 'bar' },
      }
      axios.get = jest.fn()
      axios.get.mockResolvedValue(stubbedResponse)
    })

    it('should fetch API with the good params', () => {
      const expectedUrl = `${env('API_URL')}api/articles`
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } }

      const promise = articlesApi.fetchAll()

      return promise.then(() => {
        expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedOptions)
      })
    })

    it('should return a rejected promise when an error is thrown', (done) => {
      const accessToken = 'invalid-access_token'
      axios.get.mockRejectedValue(new Error('some error'))

      const promise = articlesApi.fetchAll(accessToken)

      promise.catch((error) => {
        expect(error.message).toEqual('some error')
        done()
      })
    })
  })

  describe('#updateArticle', () => {
    const id = 59

    beforeEach(() => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      }
      axios.patch = jest.fn()
      axios.patch.mockResolvedValue(stubbedResponse)
    })

    it('should patch API with the good params', () => {
      const expectedUrl = `${env('API_URL')}api/admin/articles/${id}`
      const expectedOptions = { headers: { 'Content-Type': 'application/json' } }

      const promise = articlesApi.update(id)

      return promise.then(() => {
        expect(axios.patch).toHaveBeenCalledWith(expectedUrl, {}, expectedOptions)
      })
    })

    it('should return a rejected promise when an error is thrown', (done) => {
      const accessToken = 'invalid-access_token'
      axios.patch.mockRejectedValue(new Error('some error'))

      const promise = articlesApi.update(accessToken)

      promise.catch((error) => {
        expect(error.message).toEqual('some error')
        done()
      })
    })
  })
})
