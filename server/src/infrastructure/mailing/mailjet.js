import nodeMailjet from 'node-mailjet'
import { isEmpty } from 'lodash'
import env from '../env/env'

function _formatRecipients(recipients) {
  if (!recipients) {
    return []
  }
  if (typeof recipients === 'string') {
    return [{ Email: recipients }]
  }
  return recipients.map(recipient => ({ Email: recipient }))
}

function _formatPayload(options) {
  return {
    FromEmail: options.from,
    FromName: options.fromName,
    Subject: options.subject,
    'Html-part': options.template,
    Recipients: _formatRecipients(options.to),
  }
}

function sendEmail(options) {
  if (!isEmpty(options.to)) {
    const mailjet = nodeMailjet.connect(env('MAILJET_PUBLIC_KEY'), env('MAILJET_SECRET_KEY'))
    return mailjet
      .post('send')
      .request(_formatPayload(options))
  }
  return Promise.resolve()
}

export default {
  sendEmail,
}
