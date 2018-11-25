import mailJet from '../infrastructure/mailing/mailjet'
import env from '../infrastructure/env/env'

function sendFeedbackEmail({ feedback, email }) {
  const subject = `[RecontactMe] [Support] ${email} a émis un message`
  const template = `${feedback}`

  const options = {
    from: env('MAIL_FROM'),
    fromName: 'RecontactMe - Ne pas répondre',
    to: env('MAIL_TO'),
    subject,
    template,
  }

  return mailJet.sendEmail(options)
}

export {
  sendFeedbackEmail,
}
