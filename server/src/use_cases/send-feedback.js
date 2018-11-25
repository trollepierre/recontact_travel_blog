const mailJet = require('../infrastructure/mailing/mailjet')
const config = require('../infrastructure/config')

function sendFeedbackEmail({ feedback, email }) {
  const subject = `[RecontactMe] [Support] ${email} a émis un message`
  const template = `${feedback}`

  const options = {
    from: config.MAIL_FROM,
    fromName: 'RecontactMe - Ne pas répondre',
    to: config.MAIL_TO,
    subject,
    template,
  }

  return mailJet.sendEmail(options)
}

module.exports = {
  sendFeedbackEmail,
}
