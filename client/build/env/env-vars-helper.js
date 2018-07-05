const dotenv = require('dotenv-extended')
const { adjust, curry, fromPairs, keys, map, pickBy, pipe, slice, toPairs } = require('ramda')

// When building the application for production, all environment variables
// prefixed with this pattern will be automatically injected in the final env.js file
const ENV_VAR_PREFIX = 'RANDSTAD_FRONT_'

// https://github.com/ramda/ramda/wiki/Cookbook#rename-keys-of-an-object
const renameObjKeysBy = curry((fn, obj) => pipe(toPairs, map(adjust(fn, 0)), fromPairs)(obj))
const isNumeric = val => !isNaN(val)
const isBoolean = val => val === 'true' || val === 'false'
const mapValue = val => !isNumeric(val) && !isBoolean(val) ? `'${val}'` : val

// Development keys are retrieved from .env config files
const getDevelopmentContent = dotenv.load

// Production keys are retrieved from machine environment variables
const getProductionContent = () => pipe(
  pickBy((val, key) => key.startsWith(ENV_VAR_PREFIX)),
  renameObjKeysBy(slice(ENV_VAR_PREFIX.length, Infinity)),
)(process.env)

function generateEnvFileContent() {
  const envVars = process.env.NODE_ENV === 'production'
    ? getProductionContent()
    : getDevelopmentContent()

  return `window.env={${
    keys(envVars)
      .map(key => `${key}: ${mapValue(envVars[key])}`)
      .join(',')
  }}`
}

module.exports = generateEnvFileContent
