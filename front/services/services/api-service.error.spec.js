import logger from './logger-service'
import apiService from './api-service'

jest.mock('ofetch', () => ({
  ofetch: {
    create: jest.fn().mockReturnValue(() => {
      throw new Error('Async error')
    }),
  },
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

  describe('patch', () => {
    describe('when the promise rejects', () => {
      it('should log the error', async () => {
        // Given
        expect.assertions(3)

        // When
        try {
          await apiService.patch(path)
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
