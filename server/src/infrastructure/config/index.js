require('dotenv').config();

function config() {
  const APP_ENV = {
    DROPBOX_CLIENT_ID: process.env.DROPBOX_CLIENT_ID,
    MAILJET: {
      apiKey: process.env.MAILJET_PUBLIC_KEY,
      apiSecret: process.env.MAILJET_SECRET_KEY,
    },
    MAIL_FROM: process.env.MAIL_FROM,
    MAIL_TO: process.env.MAIL_TO,

  };

  if (process.env.NODE_ENV === 'test') {
    APP_ENV.DROPBOX_CLIENT_ID = 'dropbox-client-id';
    APP_ENV.MAILJET = {
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
    };
    APP_ENV.MAIL_FROM = 'pierre@recontact.me';
    APP_ENV.MAIL_TO = 'contact@recontact.me';
  }

  return APP_ENV;
}

module.exports = config();
