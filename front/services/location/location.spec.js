import { isCecile, isWww } from './location'

describe('location', () => {
  describe('isWww', () => {
    it('should be false by default', () => {
      // When
      const answer = isWww()
      // Then
      expect(answer).toBe(false)
    })
  })
  describe('isCecile', () => {
    it('should be false by default', () => {
      // When
      const answer = isCecile()
      // Then
      expect(answer).toBe(false)
    })
  })
})
