const DEVELOPMENT_MODE = 'development'
const PRODUCTION_MODE = 'production'

function envKey(key) {
  return process.env[key]
}

function isProduction() {
  return envKey('NODE_ENV') === PRODUCTION_MODE
}

function isDevelopment() {
  return envKey('NODE_ENV') === DEVELOPMENT_MODE
}

export {
  envKey,
  isDevelopment,
  isProduction,
}
