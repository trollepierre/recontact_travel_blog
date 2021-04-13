import env from '../infrastructure/env/env'
import mailJet from '../infrastructure/mailing/mailjet'

async function sendMailWithTheme(theme) {
  const { previousTheme, newTheme } = theme
  const optionsFr = {
    from: env('MAIL_FROM'),
    fromName: 'RecontactMe',
    to: [env('MAIL_TO')],
    subject: `[RecontactMe] Un thème a été choisi : ${newTheme}!`,
    template: `<p>Le thème a été changé :</p>
<p>C'était : ${previousTheme}</p>
<p>C'est   : ${newTheme}</p>`,
  }
  await mailJet.sendEmail(optionsFr)
  return 'ok'
}

function notifyTheme(body) {
  return sendMailWithTheme(body)
}

export default {
  notifyTheme,
}
