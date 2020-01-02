import env from './env'

describe('env', () => {
  describe('when asking for an unknown key', () => {
    it('should return undefined', () => {
      expect(env('unknown')).toBeUndefined()
    })
  })

  describe('when asking for a known key', () => {
    it('should return the corresponding environment value', () => {
      expect(env('NODE_ENV')).toEqual('test')
    })
  })

  describe('when asking for a API_URL key', () => {
    it('should return the corresponding environment value', () => {
      expect(env('API_URL')).toEqual(`${process.env.API_URL}/`)
    })
  })
})
