import commentRepository from '../domain/repositories/comment-repository'

const getComments = dropboxId => commentRepository.getAllById(dropboxId)

export default {
  getArticleComments: getComments,
}
