import commentRepository from '../domain/repositories/comment-repository'
import { isEmptyPlus } from '../domain/utils/ramda-utils'

function createComment(comment) {
  if (comment && !isEmptyPlus(comment.text)) {
    if (isEmptyPlus(comment.author)) {
      comment.author = 'Anonyme'
    }
    const enhanceComment = {
      ...comment,
      datetime: new Date(),
    }
    return commentRepository.create(enhanceComment)
  } else {
    throw new Error('Empty comment')
  }
}

export default {
  addComment: createComment,
}
