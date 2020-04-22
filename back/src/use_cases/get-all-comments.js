import commentRepository from '../domain/repositories/comment-repository'

function getAllComments() {
  return commentRepository.getAll()
}

export default {
  getAllComments,
}
