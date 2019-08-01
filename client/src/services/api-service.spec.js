import axios from 'axios'
import logger from './logger-service'
import apiService from './api-service'

jest.mock('axios')
jest.mock('../env/env', () => () => 'http://localhost:9100/')

describe('apiService', () => {
  const API_URL = 'http://localhost:9100/api/'

  beforeEach(() => {
    logger.error = jest.fn()
  })

  describe('get', () => {
    const path = 'status'

    describe('when the promise resolves data', () => {
      const data = { hello: 'world' }

      beforeEach(() => {
        axios.get.mockResolvedValue({ data })
      })

      it('should call the correct API status endpoint', async () => {
        // Given
        expect.assertions(3)
        const url = `${API_URL}${path}`

        // When
        await apiService.get(path)

        // Then
        expect(axios.get).toHaveBeenCalledOnceWith(url, { json: true })
      })

      it('should return response data', async () => {
        // Given
        expect.assertions(1)

        // When
        const response = await apiService.get(path)

        // Then
        expect(response).toEqual(data)
      })
    })

    describe('when the promise rejects', () => {
      beforeEach(() => {
        axios.get.mockRejectedValue(new Error('Async error'))
      })

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

    describe('when the promise resolves data', () => {
      const data = { hello: 'world' }

      beforeEach(() => {
        axios.post.mockResolvedValue({ data })
      })

      it('should call the correct API status endpoint', async () => {
        // Given
        expect.assertions(3)
        const url = `${API_URL}${path}`

        // When
        await apiService.post(path)

        // Then
        expect(axios.post).toHaveBeenCalledOnceWith(url, { json: true })
      })

      it('should return response data', async () => {
        // Given
        expect.assertions(1)

        // When
        const response = await apiService.post(path)

        // Then
        expect(response).toEqual(data)
      })
    })

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

    describe('when the promise resolves data', () => {
      const data = { hello: 'world' }

      beforeEach(() => {
        axios.patch.mockResolvedValue({ data })
      })

      it('should call the correct API status endpoint', async () => {
        // Given
        expect.assertions(3)
        const url = `${API_URL}${path}`

        // When
        await apiService.put(path)

        // Then
        expect(axios.patch).toHaveBeenCalledOnceWith(url, { json: true })
      })

      it('should return response data', async () => {
        // Given
        expect.assertions(1)

        // When
        const response = await apiService.put(path)

        // Then
        expect(response).toEqual(data)
      })
    })

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

    describe('when the promise resolves data', () => {
      const data = { hello: 'world' }

      beforeEach(() => {
        axios.delete.mockResolvedValue({ data })
      })

      it('should call the correct API status endpoint', async () => {
        // Given
        expect.assertions(3)
        const url = `${API_URL}${path}`

        // When
        await apiService.delete(path)

        // Then
        expect(axios.delete).toHaveBeenCalledOnceWith(url)
      })

      it('should return response data', async () => {
        // Given
        expect.assertions(1)

        // When
        const response = await apiService.delete(path)

        // Then
        expect(response).toEqual(data)
      })
    })

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
