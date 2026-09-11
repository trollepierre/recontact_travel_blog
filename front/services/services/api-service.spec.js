import logger from './logger-service'
import apiService from './api-service'

jest.mock('ofetch', () => ({
  ofetch: {
    create: jest.fn().mockReturnValue((path, options) => ({ path, options })),
  },
}))
jest.mock('../env/env', () => () => 'http://localhost:9100/')

describe('apiService', () => {
  beforeEach(() => {
    logger.error = jest.fn()
  })

  describe('get', () => {
    const path = 'status'

    describe('when the promise resolves data', () => {
      it('should return response data', async () => {
        // Given
        expect.assertions(1)

        // When
        const response = await apiService.get(path)

        // Then
        expect(response).toEqual({
          options: { method: 'GET' },
          path,
        })
      })
    })
  })

  describe('post', () => {
    const path = 'status'

    describe('when the promise resolves data', () => {
      it('should return response data', async () => {
        // Given
        expect.assertions(1)

        // When
        const response = await apiService.post(path, { some: 'body' })

        // Then
        expect(response).toEqual({
          options: { method: 'POST', body: { some: 'body' } },
          path,
        })
      })
    })
  })

  describe('put', () => {
    const path = 'status'

    describe('when the promise resolves data', () => {
      it('should return response data', async () => {
        // Given
        expect.assertions(1)

        // When
        const response = await apiService.put(path)

        // Then
        expect(response).toEqual({
          options: { method: 'PATCH', body: undefined },
          path,
        })
      })
    })
  })

  describe('delete', () => {
    const path = 'status'

    describe('when the promise resolves data', () => {
      it('should return response data', async () => {
        // Given
        expect.assertions(1)

        // When
        const response = await apiService.delete(path)

        // Then
        expect(response).toEqual({
          options: { method: 'DELETE' },
          path,
        })
      })
    })
  })
})
