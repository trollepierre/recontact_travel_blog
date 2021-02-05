import { articlesNumberLimit } from '@/components/Homepage/Homepage.utils'
import { screenWidth } from '@/services/utils/screen/screen-utils'
import { IS_DESKTOP } from '~/services/utils/responsive/responsive-utils'

jest.mock('~/services/utils/responsive/responsive-utils')
jest.mock('@/services/utils/screen/screen-utils')

describe('Homepage.utils', () => {
  it('should return 4 on mobile', () => {
    // Given
    IS_DESKTOP.mockReturnValue(false)

    // When/Then
    expect(articlesNumberLimit()).toEqual(4)
  })

  it('should return 3 on small desktop', () => {
    // Given
    IS_DESKTOP.mockReturnValue(true)
    screenWidth.mockReturnValue(1001)

    // When/Then
    expect(articlesNumberLimit()).toEqual(3)
  })

  it('should return calculation on large desktop', () => {
    // Given
    IS_DESKTOP.mockReturnValue(true)
    screenWidth.mockReturnValue(1860)

    // When/Then
    expect(articlesNumberLimit()).toEqual(6)
  })
})
