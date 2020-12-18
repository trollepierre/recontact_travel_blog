import { IS_DESKTOP, IS_TABLET, IS_MOBILE } from './responsive-utils'
import { screenWidth } from '../screen/screen-utils'

jest.mock('../screen/screen-utils')

describe('responsive utils', () => {
  it('IS DESKTOP should return true on desktop', () => {
    // Given
    screenWidth.mockReturnValue(2240)

    // When
    const boolean = IS_DESKTOP()

    // Then
    expect(boolean).toEqual(true)
  })

  it('should handle correctly the high limit', () => {
    // Given
    screenWidth.mockReturnValue(1000)

    // When
    const isDesktop = IS_DESKTOP()
    const isTablet = IS_TABLET()

    // Then
    expect(isDesktop).toEqual(false)
    expect(isTablet).toEqual(true)
  })

  it('IS TABLET should return true on tablet', () => {
    // Given
    screenWidth.mockReturnValue(999)

    // When
    const boolean = IS_TABLET()

    // Then
    expect(boolean).toEqual(true)
  })

  it('should handle correctly the low limit', () => {
    // Given
    screenWidth.mockReturnValue(640)

    // When
    const isMobile = IS_MOBILE()
    const isTablet = IS_TABLET()

    // Then
    expect(isMobile).toEqual(true)
    expect(isTablet).toEqual(false)
  })

  it('IS MOBILE should return true on mobile', () => {
    // Given
    screenWidth.mockReturnValue(500)

    // When
    const boolean = IS_MOBILE()

    // Then
    expect(boolean).toEqual(true)
  })
})
