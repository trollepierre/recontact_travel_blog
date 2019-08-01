import axios from 'axios'
import articlesApi from './articles'
import env from '../env/env'
import logger from '../services/logger-service'

describe('Unit | API | articles api', () => {
  beforeEach(() => {
    logger.error = jest.fn()
  })

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
      const expectedOptions = { json: true }

      const promise = articlesApi.fetchAll()

      return promise.then(() => {
        expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedOptions)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      const accessToken = 'invalid-access_token'
      axios.get.mockRejectedValue(new Error('some error'))

      const promise = articlesApi.fetchAll(accessToken)

      promise.catch(error => {
        expect(error.message).toEqual('some error')
        done()
      })
    })
  })

  describe('#update', () => {
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

      const promise = articlesApi.update(id)

      return promise.then(() => {
        expect(axios.patch).toHaveBeenCalledWith(expectedUrl, { json: true })
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      const accessToken = 'invalid-access_token'
      axios.patch.mockRejectedValue(new Error('some error'))

      const promise = articlesApi.update(accessToken)

      promise.catch(error => {
        expect(error.message).toEqual('some error')
        done()
      })
    })
  })

  describe('#delete', () => {
    it('should call api service with the good url', async () => {
      axios.get = jest.fn()
      const expectedUrl = `${env('API_URL')}api/apo/art/del/33`

      await articlesApi.delete('33')

      expect(axios.get).toHaveBeenCalledWith(expectedUrl, { json: true })
    })
  })

  describe('#updateAll', () => {
    it('should call api service with the good url', async () => {
      axios.patch = jest.fn()
      const expectedUrl = `${env('API_URL')}api/admin/articles`

      await articlesApi.updateAll(33, 35)

      expect(axios.patch).toHaveBeenCalledWith(expectedUrl, { json: true, max: 35, min: 33 })
    })
  })

  describe('#deleteAll', () => {
    it('should call api service with the good url', async () => {
      axios.get = jest.fn()
      const expectedUrl = `${env('API_URL')}api/apo/art/del`

      await articlesApi.deleteAll()

      expect(axios.get).toHaveBeenCalledWith(expectedUrl, { json: true })
    })
  })

  describe('#deleteAndSyncAll', () => {
    it('should call api service with the good url', async () => {
      axios.get = jest.fn()
      const expectedUrl = `${env('API_URL')}api/apo/art/delsyn`

      await articlesApi.deleteAndSyncAll()

      expect(axios.get).toHaveBeenCalledWith(expectedUrl, { json: true })
    })
  })
})
