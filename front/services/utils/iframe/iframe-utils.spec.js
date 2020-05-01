import { iframeDimensions } from './iframe-utils'
import { screenWidth } from '../screen/screen-utils'

jest.mock('../screen/screen-utils')

describe('iframe dimension', () => {
  it('should return half width on desktop', () => {
    // Given
    screenWidth.mockReturnValue(2240)

    // When
    const dimensions = iframeDimensions()

    // Then
    expect(dimensions).toEqual({ width: 1120, height: 630 })
  })

  it('should return sixty percent width on desktop', () => {
    // Given
    screenWidth.mockReturnValue(1000)

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
