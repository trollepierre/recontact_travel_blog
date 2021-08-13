import logger from './logger-service'
import apiService from './api-service'

jest.mock('axios', () => ({
  defaults: {},
  create: jest.fn().mockReturnValue({
    get: () => {
      throw new Error('Async error')
    },
    post: () => {
      throw new Error('Async error')
    },
    patch: () => {
      throw new Error('Async error')
    },
    delete: () => {
      throw new Error('Async error')
    },
  }),
}))
jest.mock('../env/env', () => () => 'http://localhost:9100/')

describe('apiService', () => {
  const path = 'status'

  beforeEach(() => {
    logger.error = jest.fn()
  })

  describe('get', () => {
    describe('when the promise rejects', () => {
      it('should log the error', async () => {
        // Given
        expect.assertions(3)

        // When
        try {
          await apiService.get(path)
        } catch (err) {
          // Then
          expect(logger.error).toHaveBeenCalledOnceWith('Async error')
        }
      })
    })
  })

  describe('post', () => {
    describe('when the promise rejects', () => {
      it('should log the error', async () => {
        // Given
        expect.assertions(3)

        // When
        try {
          await apiService.post(path)
        } catch (err) {
          // Then
          expect(logger.error).toHaveBeenCalledOnceWith('Async error')
        }
      })
    })
  })

  describe('put', () => {
    describe('when the promise rejects', () => {
      it('should log the error', async () => {
        // Given
        expect.assertions(3)

        // When
        try {
          await apiService.put(path)
        } catch (err) {
          // Then
          expect(logger.error).toHaveBeenCalledOnceWith('Async error')
        }
      })
    })
  })

  describe('delete', () => {
    describe('when the promise rejects', () => {
      it('should log the error', async () => {
        // Given
        expect.assertions(3)

        // When
        try {
          await apiService.delete(path)
        } catch (err) {
          // Then
          expect(logger.error).toHaveBeenCalledOnceWith('Async error')
        }
      })
    })
  })
})
