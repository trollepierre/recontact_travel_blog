import {
  getInLocalStorage,
  removeInLocalStorage,
  saveInLocalStorage,
  reloadPage,
} from './local-storage'

describe('localStorage', () => {
  const key = 'key'
  const value = 'value'

  describe('getInLocalStorage', () => {
    it('should call window location reload', () => {
      // Given
      window.localStorage.setItem(key, value)

      // When
      const returnedValue = getInLocalStorage(key)

      // Then
      expect(returnedValue).toEqual(value)
    })
  })

  describe('removeInLocalStorage', () => {
    it('should call window location reload', () => {
      // Given
      window.localStorage.setItem(key, value)
      expect(window.localStorage.getItem(key)).toEqual(value)

      // When
      removeInLocalStorage(key)

      // Then
      expect(window.localStorage.getItem(key)).toBeNull()
    })
  })

  describe('saveInLocalStorage', () => {
    it('should save in local storage the value in the key', () => {
      // When
      saveInLocalStorage(key, value)

      // Then
      expect(window.localStorage.getItem(key)).toEqual(value)
    })
  })

  // eslint-disable-next-line jest/no-disabled-tests
  xdescribe('reloadPage', () => {
    it('should call window location reload', () => {
      // Given
      window.location.reload = jest.fn()

      // When
      reloadPage()

      // Then
      expect(window.location.reload).toHaveBeenCalledOnceWith()
    })
  })
})
