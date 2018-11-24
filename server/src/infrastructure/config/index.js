require('dotenv').config();

function config() {
  const APP_ENV = {
    DROPBOX_CLIENT_ID: process.env.DROPBOX_CLIENT_ID,
    MAILJET: {
      apiKey: process.env.MAILJET_PUBLIC_KEY,
      apiSecret: process.env.MAILJET_SECRET_KEY,
    },
    MAIL_FROM: process.env.MAIL_FROM,
    MAIL_SUPPORT: process.env.MAIL_SUPPORT,
    MAIL_TO: process.env.MAIL_TO,
    HEROKU_APPNAME: process.env.HEROKU_APPNAME,

  };

  if (process.env.NODE_ENV === 'test') {
    APP_ENV.DROPBOX_CLIENT_ID = 'dropbox-client-id';
    APP_ENV.MAILJET = {
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
    };
    APP_ENV.MAIL_FROM = 'contact@recontact.me';
    APP_ENV.MAIL_SUPPORT = 'support@recontact.me';
    APP_ENV.MAIL_TO = 'contact@recontact.me';
    APP_ENV.HEROKU_APPNAME = 'recontact';
  }

  return APP_ENV;
}

module.exports = config();
