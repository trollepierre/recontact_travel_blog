import commentRepository from '../domain/repositories/comment-repository'

function deleteComment(commentId) {
  return commentRepository.deleteById(commentId)
}

export default {
  deleteComment,
}
