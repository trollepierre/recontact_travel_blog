import commentRepository from '../domain/repositories/comment-repository'
import { isEmptyPlus } from '../domain/utils/ramda-utils'

function createComment(comment, dropboxId) {
  if (comment && !isEmptyPlus(comment.text)) {
    if (isEmptyPlus(comment.author)) {
      comment.author = 'Anonyme'
    }
    return commentRepository.create({ ...comment, dropboxId })
  } else {
    throw new Error('Empty comment')
  }
}

export default {
  addComment: createComment,
}
