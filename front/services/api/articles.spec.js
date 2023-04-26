import articlesApi from './articles'
import logger from '../services/logger-service'
import apiService from '../services/api-service'

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
      apiService.get = jest.fn()
      apiService.get.mockResolvedValue(stubbedResponse)
    })

    it('should fetch API with the good params', () => {
      const expectedUrl = 'articles?limit=8'

      const promise = articlesApi.fetchAll(8)

      return promise.then(() => {
        expect(apiService.get).toHaveBeenCalledWith(expectedUrl)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      const accessToken = 'invalid-access_token'
      apiService.get.mockRejectedValue(new Error('some error'))

      const promise = articlesApi.fetchAll(accessToken)

      promise.catch(error => {
        expect(error.message).toBe('some error')
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
      apiService.put = jest.fn()
      apiService.put.mockResolvedValue(stubbedResponse)
    })

    it('should put API with the good params', () => {
      const expectedUrl = `admin/articles/${id}`

      const promise = articlesApi.update(id)

      return promise.then(() => {
        expect(apiService.put).toHaveBeenCalledWith(expectedUrl)
      })
    })

    it('should return a rejected promise when an error is thrown', done => {
      const accessToken = 'invalid-access_token'
      apiService.put.mockRejectedValue(new Error('some error'))

      const promise = articlesApi.update(accessToken)

      promise.catch(error => {
        expect(error.message).toBe('some error')
        done()
      })
    })
  })

  describe('#delete', () => {
    it('should call api service with the good url', async () => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      }
      apiService.get = jest.fn()
      apiService.get.mockResolvedValue(stubbedResponse)
      const expectedUrl = 'apo/art/del/33'

      await articlesApi.delete('33')

      expect(apiService.get).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('#updateAll', () => {
    it('should call api service with the good url', async () => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      }
      apiService.put = jest.fn()
      apiService.put.mockResolvedValue(stubbedResponse)
      const expectedUrl = 'admin/articles'

      await articlesApi.updateAll(33, 35)

      expect(apiService.put).toHaveBeenCalledWith(expectedUrl, { max: 35, min: 33 })
    })
  })

  describe('#deleteAll', () => {
    it('should call api service with the good url', async () => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      }
      apiService.get = jest.fn()
      apiService.get.mockResolvedValue(stubbedResponse)
      const expectedUrl = 'apo/art/del'

      await articlesApi.deleteAll()

      expect(apiService.get).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('#deleteAndSyncAll', () => {
    it('should call api service with the good url', async () => {
      const stubbedResponse = {
        status: 200,
        data: {
          foo: 'bar',
        },
      }
      apiService.get = jest.fn()
      apiService.get.mockResolvedValue(stubbedResponse)
      const expectedUrl = 'apo/art/delsyn'

      await articlesApi.deleteAndSyncAll()

      expect(apiService.get).toHaveBeenCalledWith(expectedUrl)
    })
  })
})
