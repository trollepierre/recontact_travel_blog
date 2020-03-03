import commentRepository from '../domain/repositories/comment-repository'
import { formatDateWithLongEndianLongFormat } from '../domain/utils/date-utils'

const getComments = async dropboxId => {
  const comments = await commentRepository.getAllById(dropboxId)
  return comments.map(comment => ({
    ...comment,
    createdAt: formatDateWithLongEndianLongFormat(new Date(comment.createdAt)),
  }))
}

export default {
  getArticleComments: getComments,
}
