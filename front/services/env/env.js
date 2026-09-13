import runtimeValue from './runtime-env'

// '' => même origine ('/'), 'https://x' ou 'https://x/' => 'https://x/'
const toApiUrl = base => (base ? `${String(base).replace(/\/+$/, '')}/` : '/')

export default key => {
  if (key === 'API_URL') {
    const injectedBase = runtimeValue('apiBase', undefined)
    if (injectedBase !== undefined) {
      return toApiUrl(injectedBase)
    }
    try {
      // Nuxt 3 runtime config (client + server)
      // eslint-disable-next-line no-undef
      const { public: publicConfig } = useRuntimeConfig()
      if (publicConfig) {
        return toApiUrl(publicConfig.apiBase)
      }
    } catch (e) {
      // fallback to env when useRuntimeConfig n'est pas disponible (tests, scripts)
      if (process && process.env) {
        if (Object.prototype.hasOwnProperty.call(process.env, 'API_URL')) {
          return `${process.env.API_URL}/`
        }
        if (Object.prototype.hasOwnProperty.call(process.env, 'NUXT_ENV_API_URL')) {
          return `${process.env.NUXT_ENV_API_URL}/`
        }
        // For tests expecting 'undefined/' when not set
        return `${process.env.API_URL}/`
      }
    }
  }
  return process.env[key]
}
