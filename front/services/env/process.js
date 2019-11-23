const PRODUCTION_MODE = 'production'
const DEVELOPMENT_MODE = 'development'

const isProduction = () => process.env.NODE_ENV === PRODUCTION_MODE
const isDevelopment = () => process.env.NODE_ENV === DEVELOPMENT_MODE

export {
  isProduction,
  isDevelopment,
}
