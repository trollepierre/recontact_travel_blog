import positionsApi from './positions'
import apiService from '../services/api-service'

describe('Unit | API | positions api', () => {
  describe('#fetchLast', () => {
    let data

    beforeEach(() => {
      data = { lastPosition: 'Cancun, Mexico, le 5 mars 2018' }
      apiService.get = jest.fn()
      apiService.get.mockResolvedValue(data)
    })

    it('should get good url and return data', async () => {
      const result = await positionsApi.fetchLast()

      expect(apiService.get).toHaveBeenCalledWith('positions/last')
      expect(result).toEqual(data)
    })
  })

  describe('#add', () => {
    let data
    const position = {
      lastPosition: 'Cancun, Mexico, le 5 mars 2018',
    }

    beforeEach(() => {
      data = { lastPosition: 'Cancun, Mexico, le 5 mars 2018' }
      apiService.post = jest.fn()
      apiService.post.mockResolvedValue(data)
    })

    it('should post to good API with the good params and return result', async () => {
      const result = await positionsApi.add(position)

      expect(apiService.post).toHaveBeenCalledWith('positions', position)
      expect(result).toEqual(data)
    })
  })
})
