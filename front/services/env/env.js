export default key => {
  if (key === 'API_URL') {
    try {
      // Nuxt 3 runtime config (client + server)
      // eslint-disable-next-line no-undef
      const { public: publicConfig } = useRuntimeConfig()
      if (publicConfig && publicConfig.apiBase) {
        return `${publicConfig.apiBase}/`
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
