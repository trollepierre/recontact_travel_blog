import logger from './logger-service'
import apiService from './api-service'

jest.mock('axios', () => ({
  defaults: {},
  create: jest.fn().mockReturnValue({
    get: (path, config) => ({ data: { path, config } }),
    post: (path, config) => ({ data: { path, config } }),
    patch: (path, config) => ({ data: { path, config } }),
    delete: (path, config) => ({ data: { path, config } }),
  }),
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
          config: { json: true },
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
        const response = await apiService.post(path)

        // Then
        expect(response).toEqual({
          config: { json: true },
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
          config: { json: true },
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
          path,
        })
      })
    })
  })
})
