import { load } from 'dotenv-extended'
import { envKey } from './process'

const dotenvVars = load()

export default key => {
  const processEnv = envKey(key)
  return processEnv !== undefined
    ? processEnv
    : dotenvVars[key]
}
