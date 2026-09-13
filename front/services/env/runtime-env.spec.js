import runtimeValue from './runtime-env'

describe('runtime-env', () => {
  afterEach(() => {
    delete window.__ENV__
  })

  describe('when the back injected nothing', () => {
    it('should return the fallback', () => {
      expect(runtimeValue('mapboxToken', 'from-build')).toBe('from-build')
    })
  })

  describe('when the back injected the key', () => {
    it('should return the injected value', () => {
      window.__ENV__ = { mapboxToken: 'from-dyno' }

      expect(runtimeValue('mapboxToken', 'from-build')).toBe('from-dyno')
    })

    it('should return an injected empty value rather than the fallback', () => {
      window.__ENV__ = { apiBase: '' }

      expect(runtimeValue('apiBase', 'https://recontact.herokuapp.com')).toBe('')
    })
  })

  describe('when the back injected other keys', () => {
    it('should return the fallback', () => {
      window.__ENV__ = { apiBase: '' }

      expect(runtimeValue('mapboxToken', 'from-build')).toBe('from-build')
    })
  })
})
