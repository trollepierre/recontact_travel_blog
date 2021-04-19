import { mutations, state } from '@/store'
import { saveInLocalStorage, getInLocalStorage } from '@/services/localStorage/local-storage'

jest.mock('@/services/localStorage/local-storage')

describe('store', () => {
  describe('state', () => {
    it('should contain store', () => {
      // Then
      expect(state()).toMatchInlineSnapshot(`
        Object {
          "locale": "fr",
          "locales": Array [
            "en",
            "fr",
          ],
          "theme": "light",
        }
      `)
    })
  })

  describe('mutations', () => {
    describe('SET_LANG', () => {
      it('should set lang', () => {
        // Given
        const myState = state()

        // When
        mutations.SET_LANG(myState, 'en')

        // Then
        expect(myState.locale).toEqual('en')
      })

      it('should not set lang not found', () => {
        // Given
        const myState = state()

        // When
        mutations.SET_LANG(myState, 'es')

        // Then
        expect(myState.locale).toEqual('fr')
      })
    })

    describe('SET_THEME_MODE', () => {
      it('should set theme', () => {
        // Given
        const myState = state()

        // When
        mutations.SET_THEME_MODE(myState, 'dark')

        // Then
        expect(myState.theme).toEqual('dark')
      })

      it('should save in local storage', () => {
        // Given
        const myState = state()

        // When
        mutations.SET_THEME_MODE(myState, 'dark')

        // Then
        expect(saveInLocalStorage).toHaveBeenCalledWith('theme', 'dark')
      })
    })
  })

  describe('GET_THEME_MODE', () => {
    it('should get theme from local storage', () => {
      // Given
      const myState = state()
      getInLocalStorage.mockReturnValue('new')

      // When
      mutations.GET_THEME_MODE(myState)

      // Then
      expect(myState.theme).toEqual('new')
    })

    it('should save in local storage', () => {
      // Given
      const myState = state()
      getInLocalStorage.mockReturnValue(undefined)
      window.matchMedia = jest.fn().mockReturnValue({ matches: true })

      // When
      mutations.GET_THEME_MODE(myState)

      // Then
      expect(myState.theme).toEqual('dark')
    })
  })
})
