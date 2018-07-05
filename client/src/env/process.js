const PRODUCTION_MODE = 'production'
const DEVELOPMENT_MODE = 'development'

function isProduction() {
  return process.env.NODE_ENV === PRODUCTION_MODE
}

function isDevelopment() {
  return process.env.NODE_ENV === DEVELOPMENT_MODE
}

export {
  isProduction,
  isDevelopment,
}
