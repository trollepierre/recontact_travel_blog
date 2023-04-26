import { isEmptyPlus } from './ramda-utils'

describe('ramda-utils', () => {
  describe('isEmpty', () => {
    describe('when parameter is null', () => {
      it('should return true', () => {
        // When
        const isEmptyResult = isEmptyPlus(null)

        // Then
        expect(isEmptyResult).toBe(true)
      })
    })
    describe('when parameter is undefined', () => {
      it('should return true', () => {
        // When
        const isEmptyResult = isEmptyPlus(undefined)

        // Then
        expect(isEmptyResult).toBe(true)
      })
    })
    describe('when parameter is ""', () => {
      it('should return true', () => {
        // When
        const isEmptyResult = isEmptyPlus('')

        // Then
        expect(isEmptyResult).toBe(true)
      })
    })
    describe('when parameter is an array with 3 elements', () => {
      it('should return false', () => {
        // Given
        const myArray = ['a', 'b', 'c']

        // When
        const isEmptyResult = isEmptyPlus(myArray)

        // Then
        expect(isEmptyResult).toBe(false)
      })
    })
    describe('when parameter is an empty array', () => {
      it('should return true', () => {
        // Given
        const myArray = []

        // When
        const isEmptyResult = isEmptyPlus(myArray)

        // Then
        expect(isEmptyResult).toBe(true)
      })
    })
  })
})
