import http from 'http'
import env from '../../env/env'

const wakeupPeriod = env('WAKE_UP_PERIOD') ? env('WAKE_UP_PERIOD') : 30 * 60 * 1000

function preventSleep() {
  const shouldPreventSleep = env('WAKE_UP') === 'true'
  if (shouldPreventSleep) {
    setInterval(() => {
      const url = `http://${env('HEROKU_APPNAME')}.herokuapp.com`
      console.info(`Wake up Heroku on...${url}`)
      http.get(url)
    }, wakeupPeriod)
  }
}

module.exports = preventSleep()
