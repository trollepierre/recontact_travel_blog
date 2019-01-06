import commentRepository from '../domain/repositories/comment-repository'

function createComment(comment) {
  return commentRepository.create(comment)
}

export default {
  addComment: createComment,
}
