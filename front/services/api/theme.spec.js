import ThemeApi from './theme'
import apiService from '../services/api-service'

describe('Unit | API | theme api', () => {
  describe('#send', () => {
    let data

    beforeEach(() => {
      apiService.post = jest.fn()
      apiService.post.mockResolvedValue(data)
    })

    it('should post to good API with the good params and return result', async () => {
      const result = await ThemeApi.send('light', 'dark')

      expect(apiService.post).toHaveBeenCalledWith('theme', { previousTheme: 'light', newTheme: 'dark' })
      expect(result).toEqual(data)
    })
  })
})
