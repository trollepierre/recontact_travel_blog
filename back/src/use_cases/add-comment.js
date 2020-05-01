import commentRepository from '../domain/repositories/comment-repository'
import { isEmptyPlus } from '../domain/utils/ramda-utils'
import env from '../infrastructure/env/env'
import mailJet from '../infrastructure/mailing/mailjet'

function createComment(comment, dropboxId) {
  if (comment && !isEmptyPlus(comment.text)) {
    if (isEmptyPlus(comment.author)) {
      comment.author = 'Anonyme' // eslint-disable-line no-param-reassign
    }
    return commentRepository.create({ ...comment, dropboxId })
  }
  throw new Error('Empty comment')
}

async function sendMailWithComment(comment, dropboxId) {
  const optionsFr = {
    from: env('MAIL_FROM'),
    fromName: 'RecontactMe',
    to: [env('MAIL_TO')],
    subject: `[RecontactMe] Un nouveau commentaire a été publié par ${comment.author}!`,
    template: `<p>Voici le message :</p>
<p>${comment.text}</p>
<p>Article concerné : ${dropboxId}</p>`,
  }
  await mailJet.sendEmail(optionsFr)
  return comment
}

function addComment(comment, dropboxId) {
  return createComment(comment, dropboxId)
    .then(persistedComment => sendMailWithComment(persistedComment, dropboxId))
}

export default {
  addComment,
}
