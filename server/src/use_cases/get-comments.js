import commentRepository from '../domain/repositories/comment-repository'

const getComments = () => {
  return commentRepository.getAll()
}

export default {
  getComments,
}
