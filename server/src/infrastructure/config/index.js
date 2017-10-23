require('dotenv').config();

function config() {
  const APP_ENV = {
    DROPBOX_CLIENT_ID: process.env.DROPBOX_CLIENT_ID,
  };

  if (process.env.NODE_ENV === 'test') {
    APP_ENV.DROPBOX_CLIENT_ID = 'dropbox-client-id';
  }

  return APP_ENV;
}

module.exports = config();
