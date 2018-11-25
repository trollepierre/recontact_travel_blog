import { load } from 'dotenv-extended'
import { env } from './process'

const dotenvVars = load()

export default key => {
  const processEnv = env(key)
  return processEnv !== undefined
    ? processEnv
    : dotenvVars[key]
}
