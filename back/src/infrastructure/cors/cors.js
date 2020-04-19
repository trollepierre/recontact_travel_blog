import env from '../env/env'

const whitelist = [
  env('CORS_FRENCH_URL'),
  env('CORS_ENGLISH_URL'),
  env('CORS_DEVELOPMENT_URL'),
  env('CORS_FRENCH_INTEGRATION_URL'),
  env('CORS_ENGLISH_INTEGRATION_URL'),
]

export const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('URL origin not allowed by CORS'))
    }
  },
}
