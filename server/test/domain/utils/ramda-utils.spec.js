import { expect } from '../../test-helper'
import { isEmptyPlus, sortByAscendingNumber } from '../../../src/domain/utils/ramda-utils'

describe('ramda-utils', () => {
  describe('isEmpty', () => {
    describe('when parameter is null', () => {
      it('should return true', () => {
        // When
        const isEmptyResult = isEmptyPlus(null)

        // Then
        expect(isEmptyResult).to.equal(true)
      })
    })
    describe('when parameter is undefined', () => {
      it('should return true', () => {
        // When
        const isEmptyResult = isEmptyPlus(undefined)

        // Then
        expect(isEmptyResult).to.equal(true)
      })
    })
    describe('when parameter is ""', () => {
      it('should return true', () => {
        // When
        const isEmptyResult = isEmptyPlus('')

        // Then
        expect(isEmptyResult).to.equal(true)
      })
    })
    describe('when parameter is an array with 3 elements', () => {
      it('should return false', () => {
        // Given
        const myArray = ['a', 'b', 'c']

        // When
        const isEmptyResult = isEmptyPlus(myArray)

        // Then
        expect(isEmptyResult).to.equal(false)
      })
    })
    describe('when parameter is an empty array', () => {
      it('should return true', () => {
        // Given
        const myArray = []

        // When
        const isEmptyResult = isEmptyPlus(myArray)

        // Then
        expect(isEmptyResult).to.equal(true)
      })
    })
  })

  describe('sortByAscendingNumber', () => {
    it('should return list sorted in ascending order according to key', () => {
      // Given
      const list = [{ position: 1 }, { position: 3 }, { position: 2 }]
      const ascSortedList = [{ position: 1 }, { position: 2 }, { position: 3 }]

      // When
      const result = sortByAscendingNumber(list, 'position')

      // Then
      expect(result).to.deep.equal(ascSortedList)
    })

    it('should return manage equality', () => {
      // Given
      const list = [{ anotherKey: 2 }, { anotherKey: 1 }, { anotherKey: 2 }]
      const ascSortedList = [{ anotherKey: 1 }, { anotherKey: 2 }, { anotherKey: 2 }]

      // When
      const result = sortByAscendingNumber(list, 'anotherKey')

      // Then
      expect(result).to.deep.equal(ascSortedList)
    })
  })
})
