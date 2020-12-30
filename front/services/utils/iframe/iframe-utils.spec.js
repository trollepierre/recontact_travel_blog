import { iframeDimensions } from './iframe-utils'
import { screenWidth } from '../screen/screen-utils'
import { IS_DESKTOP, IS_TABLET } from '../responsive/responsive-utils'

jest.mock('../screen/screen-utils')
jest.mock('../responsive/responsive-utils')

describe('iframe dimension', () => {
  it('should return half width on desktop', () => {
    // Given
    screenWidth.mockReturnValue(2240)
    IS_DESKTOP.mockReturnValue(true)

    // When
    const dimensions = iframeDimensions()

    // Then
    expect(dimensions).toEqual({ width: 1120, height: 630 })
  })

  it('should return sixty percent width on tablet', () => {
    // Given
    screenWidth.mockReturnValue(1000)
    IS_DESKTOP.mockReturnValue(false)
    IS_TABLET.mockReturnValue(true)

    // When
    const dimensions = iframeDimensions()

    // Then
    expect(dimensions).toEqual({ width: 600, height: 337.5 })
  })

  it('should return ninety percent width on desktop', () => {
    // Given
    screenWidth.mockReturnValue(500)

    // When
    const dimensions = iframeDimensions()

    // Then
    expect(dimensions).toEqual({ width: 450, height: 253.125 })
  })
})
