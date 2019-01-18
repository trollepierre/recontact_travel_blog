import commentRepository from '../domain/repositories/comment-repository'

const getComments = dropboxId => {
  return commentRepository.getAllById(dropboxId)
}

export default {
  getArticleComments: getComments,
}
