import { articlesNumberLimit, minWidth } from '@/components/Homepage/Homepage.utils'
import { screenWidth } from '@/services/utils/screen/screen-utils'
import { IS_DESKTOP } from '~/services/utils/responsive/responsive-utils'

jest.mock('~/services/utils/responsive/responsive-utils')
jest.mock('@/services/utils/screen/screen-utils')

describe('Homepage.utils', () => {
  describe('articlesNumberLimit', () => {
    it('should return 4 on mobile', () => {
      // Given
      IS_DESKTOP.mockReturnValue(false)

      // When/Then
      expect(articlesNumberLimit()).toBe(4)
    })

    it('should return 3 on small desktop', () => {
      // Given
      IS_DESKTOP.mockReturnValue(true)
      screenWidth.mockReturnValue(1001)

      // When/Then
      expect(articlesNumberLimit()).toBe(3)
    })

    it('should return calculation on large desktop', () => {
      // Given
      IS_DESKTOP.mockReturnValue(true)
      screenWidth.mockReturnValue(1860)

      // When/Then
      expect(articlesNumberLimit()).toBe(6)
    })
  })

  describe('minWidth', () => {
    it('should return 4 on mobile', () => {
      // Given
      IS_DESKTOP.mockReturnValue(false)

      // When/Then
      expect(minWidth()).toBe(0)
    })

    it('should return 3 on small desktop', () => {
      // Given
      IS_DESKTOP.mockReturnValue(true)
      screenWidth.mockReturnValue(1001)

      // When/Then
      expect(minWidth()).toBe(270)
    })

    it('should return calculation on large desktop', () => {
      // Given
      IS_DESKTOP.mockReturnValue(true)
      screenWidth.mockReturnValue(1860)

      // When/Then
      expect(minWidth()).toBe(810)
    })
  })
})
