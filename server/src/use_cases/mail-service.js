const mailJet = require('../infrastructure/mailing/mailjet');
const config = require('../infrastructure/config');

function sendFeedbackEmail({ feedback, email }) {
  // todo verify email
  const subject = `[RecontactMe] [Support] ${email} a émis un message`;
  const template = `${feedback}`;

  const options = {
    from: email,
    fromName: 'RecontactMe - Ne pas répondre',
    to: config.MAIL_TO,
    subject,
    template,
  };

  return mailJet.sendEmail(options);
}


module.exports = {
  sendFeedbackEmail,
};
