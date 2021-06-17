import axios from 'axios'
import logger from './logger-service'
import apiService from './api-service'

jest.mock('axios', () => ({
  defaults: {},
  create: jest.fn().mockReturnValue({
    get: () => { throw new Error('Async error') },
  }),
}))
jest.mock('../env/env', () => () => 'http://localhost:9100/')

describe('apiService', () => {
  beforeEach(() => {
    logger.error = jest.fn()
  })

  describe('get', () => {
    const path = 'status'

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
    const path = 'status'

    describe('when the promise rejects', () => {
      beforeEach(() => {
        axios.post.mockRejectedValue(new Error('Async error'))
      })

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
    const path = 'status'

    describe('when the promise rejects', () => {
      beforeEach(() => {
        axios.patch.mockRejectedValue(new Error('Async error'))
      })

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
    const path = 'status'

    describe('when the promise rejects', () => {
      beforeEach(() => {
        axios.delete.mockRejectedValue(new Error('Async error'))
      })

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
