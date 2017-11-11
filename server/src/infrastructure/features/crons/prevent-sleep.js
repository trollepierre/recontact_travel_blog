/* eslint-disable no-console */
const http = require('http');
const config = require('../../config');

const EVERY_THENTY_MINUTES = 30 * 60 * 1000;

function preventSleep() {
  setInterval(() => {
    const url = `http://${config.HEROKU_APPNAME}.herokuapp.com`;
    console.log(`Wake up Heroku on...${url}`);
    http.get(url);
  }, EVERY_THENTY_MINUTES);
}

module.exports = preventSleep();
