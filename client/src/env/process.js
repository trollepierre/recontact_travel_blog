const PRODUCTION_MODE = 'production'
const DEVELOPMENT_MODE = 'development'

isProduction = () => process.env.NODE_ENV === PRODUCTION_MODE
isDevelopment = () => process.env.NODE_ENV === DEVELOPMENT_MODE

export {
  isProduction,
  isDevelopment,
}
