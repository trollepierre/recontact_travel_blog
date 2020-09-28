import { isCecile } from './location'

describe('location', () => {
  describe('isCecile', () => {
    it('should be false by default', () => {
      // When
      const answer = isCecile()
      // Then
      expect(answer).toBe(false)
    })
  })
})
