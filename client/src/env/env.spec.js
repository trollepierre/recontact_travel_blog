import * as window from './window'
import env from './env'

jest.mock('./window')

const defaultWindowEnv = {
  cyka: 'blyat',
}

beforeEach(() => {
  window.get.mockImplementation(() => defaultWindowEnv)
})

describe('when asking for an unknown key', () => {
  it('should return undefined', () => {
    expect(env('unknown')).toBeUndefined()
  })
})

describe('when asking for a known key', () => {
  it('should return the corresponding environment value', () => {
    expect(env('cyka')).toEqual(defaultWindowEnv['cyka'])
  })
})
