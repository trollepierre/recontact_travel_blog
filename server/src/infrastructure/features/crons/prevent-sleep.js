import http from 'http'
import env from '../../env/env'

const EVERY_THENTY_MINUTES = 30 * 60 * 1000

function preventSleep() {
  setInterval(() => {
    const url = `http://${env('HEROKU_APPNAME')}.herokuapp.com`
    console.info(`Wake up Heroku on...${url}`)
    http.get(url)
  }, EVERY_THENTY_MINUTES)
}

module.exports = preventSleep()
