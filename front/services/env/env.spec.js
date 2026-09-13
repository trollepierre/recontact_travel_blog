import env from './env'

describe('env', () => {
  describe('when asking for an unknown key', () => {
    it('should return undefined', () => {
      expect(env('unknown')).toBeUndefined()
    })
  })

  describe('when asking for a known key', () => {
    it('should return the corresponding environment value', () => {
      expect(env('NODE_ENV')).toBe('test')
    })
  })

  describe('when asking for a API_URL key', () => {
    it('should return the corresponding environment value', () => {
      expect(env('API_URL')).toBe(`${process.env.API_URL}/`)
    })
  })

  describe('when the back injected an apiBase', () => {
    afterEach(() => {
      delete window.__ENV__
    })

    it('should return the same origin when it is empty', () => {
      window.__ENV__ = { apiBase: '' }

      expect(env('API_URL')).toBe('/')
    })

    it('should return the injected absolute base', () => {
      window.__ENV__ = { apiBase: 'https://recontact.herokuapp.com' }

      expect(env('API_URL')).toBe('https://recontact.herokuapp.com/')
    })

    it('should not double the trailing slash', () => {
      window.__ENV__ = { apiBase: 'https://recontact.herokuapp.com/' }

      expect(env('API_URL')).toBe('https://recontact.herokuapp.com/')
    })
  })
})
